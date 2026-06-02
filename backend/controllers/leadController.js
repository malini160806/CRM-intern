const Lead = require('../models/Lead');
const User = require('../models/User');
const Task = require('../models/Task');
const { triggerWebhook } = require('../services/makeWebhook.service');
const { sendEmailDirectly } = require('../utils/emailService');
const { syncRecordEmbedding } = require('../utils/vectorDb');
const fs = require('fs');
const csv = require('csv-parser');

/**
 * Helper function to determine if a user has access to a specific lead
 */
const hasLeadAccess = (user, lead, teamMembers = []) => {
  const userRole = user.role.toLowerCase();
  
  if (userRole === 'ceo' || userRole === 'admin' || userRole === 'saleslead') {
    return true;
  }
  
  if (userRole === 'salesperson') {
    const assignedId = lead.assignedTo && lead.assignedTo._id ? lead.assignedTo._id.toString() : lead.assignedTo?.toString();
    return assignedId === user._id.toString();
  }
  
  return false;
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const userRole = req.user.role ? req.user.role.toLowerCase() : 'salesperson';
    let query = {};

    if (userRole === 'ceo' || userRole === 'admin') {
      query = {};
    } else if (userRole === 'saleslead') {
      query = { $or: [{ assignedTo: req.user._id }, { assignedSalesLead: req.user._id }] };
    } else {
      query = { assignedTo: req.user._id };
    }

    const leads = await Lead.find(query).populate('assignedTo', 'name email');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get lead by ID
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email');
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Role-based Access Validation
    const user = await User.findById(req.user._id);
    const teamMembers = user.assignedSalesPersons || [];
    
    if (!hasLeadAccess(req.user, lead, teamMembers)) {
      return res.status(403).json({ message: 'Access Denied: You do not have permission to view this lead' });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  const { 
    name, leadName, 
    company, companyName, 
    email, customerEmail, 
    phone, status, priority, 
    leadScore, assignedTo 
  } = req.body;

  try {
    // 1. Determine target assignee
    const targetAssigneeId = assignedTo || req.user._id;

    // 2. Fetch assignee details to determine hierarchy
    const assignee = await User.findById(targetAssigneeId);
    if (!assignee) {
      return res.status(404).json({ message: 'Assignee user not found' });
    }

    // 3. Construct Lead
    const lead = new Lead({
      name: name || leadName,
      leadName: leadName || name,
      company: company || companyName,
      companyName: companyName || company,
      email: email || customerEmail,
      customerEmail: customerEmail || email,
      phone,
      status: status || 'Warm',
      priority: priority || 'Medium',
      leadScore: leadScore || 0,
      assignedTo: targetAssigneeId,
      assignedSalesLead: assignee.assignedSalesLead || null,
      createdBy: req.user._id
    });

    const createdLead = await lead.save();

    // 4. Trigger Webhook for Lead Assignment
    const priorityMapping = {
      'Hot': 'High',
      'Warm': 'Medium',
      'Cold': 'Low'
    };

    const payload = {
      leadId: createdLead._id.toString(),
      leadName: createdLead.name,
      companyName: createdLead.company || 'Not Specified',
      customerEmail: createdLead.email,
      priority: priorityMapping[createdLead.status] || createdLead.priority || 'Medium',
      assignedTo: assignee.name,
      salesEmail: assignee.email,
      salesLeadName: req.user.name || 'Manager',
      assignedBy: req.user.name || 'CRM System'
    };

    await triggerWebhook('lead_assigned', payload);
    if (assignee && assignee.email) {
      await sendEmailDirectly(assignee.email, "New Lead Assigned", `You have been assigned a new lead: ${createdLead.name}.\nPriority: ${payload.priority}`);
    }

    // Auto-sync to AI Vector DB
    syncRecordEmbedding(createdLead, 'Lead').catch(err => console.error("Auto-sync error:", err));

    res.status(201).json(createdLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Role-based Access Validation
    const user = await User.findById(req.user._id);
    const teamMembers = user.assignedSalesPersons || [];
    
    if (!hasLeadAccess(req.user, lead, teamMembers)) {
      return res.status(403).json({ message: 'Access Denied: You do not have permission to modify this lead' });
    }

    // Capture previous assignee to check if assignment changed
    const previousAssigneeId = lead.assignedTo?.toString();
    const previousStatus = lead.status;
    const newAssigneeId = req.body.assignedTo || previousAssigneeId;

    lead.name = req.body.name || req.body.leadName || lead.name;
    lead.leadName = req.body.leadName || req.body.name || lead.leadName;
    lead.company = req.body.company || req.body.companyName || lead.company;
    lead.companyName = req.body.companyName || req.body.company || lead.companyName;
    lead.email = req.body.email || req.body.customerEmail || lead.email;
    lead.customerEmail = req.body.customerEmail || req.body.email || lead.customerEmail;
    lead.phone = req.body.phone || lead.phone;
    lead.status = req.body.status || lead.status;
    lead.priority = req.body.priority || lead.priority;
    lead.leadScore = req.body.leadScore !== undefined ? req.body.leadScore : lead.leadScore;

    if (newAssigneeId !== previousAssigneeId) {
      const newAssignee = await User.findById(newAssigneeId);
      if (newAssignee) {
        lead.assignedTo = newAssigneeId;
        lead.assignedSalesLead = newAssignee.assignedSalesLead || null;

        // Trigger Make.com lead assigned event for new owner
        const priorityMapping = {
          'Hot': 'High',
          'Warm': 'Medium',
          'Cold': 'Low'
        };

        const payload = {
          leadId: lead._id.toString(),
          leadName: lead.name,
          companyName: lead.company || 'Not Specified',
          customerEmail: lead.email,
          priority: priorityMapping[lead.status] || lead.priority || 'Medium',
          assignedTo: newAssignee.name,
          salesEmail: newAssignee.email,
          salesLeadName: req.user.name || 'Manager',
          assignedBy: req.user.name || 'CRM Update'
        };

        await triggerWebhook('lead_assigned', payload);
        if (newAssignee && newAssignee.email) {
          await sendEmailDirectly(newAssignee.email, "Lead Reassigned to You", `You have been assigned a lead: ${lead.name}.\nPriority: ${payload.priority}`);
        }
      }
    }

    const updatedLead = await lead.save();

    // Auto-generate follow-up task if status changed
    if (req.body.status && req.body.status !== previousStatus) {
      if (['Warm', 'Cold', 'Hot / High Potential'].includes(req.body.status)) {
        let taskAssigneeEmail = '';
        const targetUserId = newAssigneeId || lead.assignedTo || req.user._id;
        const targetUser = await User.findById(targetUserId);
        if (targetUser) {
          taskAssigneeEmail = targetUser.email;
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 2); // 2 days from now

        await Task.create({
          title: `Follow up with lead: ${updatedLead.name}`,
          description: `Lead status changed to ${req.body.status}. Re-engaging after 2 days.`,
          priority: req.body.status === 'Hot / High Potential' ? 'High' : 'Medium',
          status: 'Pending',
          dueDate: dueDate,
          assignedTo: taskAssigneeEmail,
          relatedTo: 'Lead',
          relatedId: updatedLead._id,
          user: req.user._id
        });
        
        if (taskAssigneeEmail) {
          let emailSubject = "Lead Status Update";
          let emailBody = `The status for lead ${updatedLead.name} has been updated to ${req.body.status}.`;
          
          if (req.body.status === 'Hot / High Potential') {
             emailSubject = "🚨 URGENT: Hot Lead Status Update";
             emailBody = `ACTION REQUIRED: The lead ${updatedLead.name} has just been upgraded to HOT / HIGH POTENTIAL!\n\nPlease follow up immediately to close this deal.`;
          }
          
          await sendEmailDirectly(taskAssigneeEmail, emailSubject, emailBody);
        }
      }
    }

    // Auto-sync to AI Vector DB
    syncRecordEmbedding(updatedLead, 'Lead').catch(err => console.error("Auto-sync error:", err));

    res.json(updatedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Role-based Access Validation
    const user = await User.findById(req.user._id);
    const teamMembers = user.assignedSalesPersons || [];
    
    if (!hasLeadAccess(req.user, lead, teamMembers)) {
      return res.status(403).json({ message: 'Access Denied: You do not have permission to remove this lead' });
    }

    await lead.deleteOne();
    res.json({ message: 'Lead removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get lead statistics
// @route   GET /api/leads/stats
// @access  Private
const getLeadStats = async (req, res) => {
  try {
    const userRole = req.user.role ? req.user.role.toLowerCase() : 'salesperson';
    let query = {};

    if (userRole === 'ceo' || userRole === 'admin') {
      query = {};
    } else if (userRole === 'saleslead') {
      query = { $or: [{ assignedTo: req.user._id }, { assignedSalesLead: req.user._id }] };
    } else {
      query = { assignedTo: req.user._id };
    }

    const totalLeads = await Lead.countDocuments(query);
    const hotLeads = await Lead.countDocuments({ ...query, status: 'Hot / High Potential' });
    const warmLeads = await Lead.countDocuments({ ...query, status: 'Warm' });
    const coldLeads = await Lead.countDocuments({ ...query, status: 'Cold' });
    
    res.json({
      totalLeads,
      hotLeads,
      warmLeads,
      coldLeads,
      pendingFollowups: 0,
      totalRevenue: 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending followups
// @route   GET /api/leads/pending-followups
// @access  Private
const getPendingFollowups = async (req, res) => {
  try {
    const userRole = req.user.role ? req.user.role.toLowerCase() : 'salesperson';
    let query = {};

    if (userRole === 'ceo' || userRole === 'admin') {
      query = {};
    } else if (userRole === 'saleslead') {
      query = { $or: [{ assignedTo: req.user._id }, { assignedSalesLead: req.user._id }] };
    } else {
      query = { assignedTo: req.user._id };
    }
    
    // Find Hot leads not updated in last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    query.status = 'Hot / High Potential';
    query.updatedAt = { $lte: yesterday };

    const leads = await Lead.find(query).sort({ updatedAt: 1 }).limit(10);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload leads from CSV
// @route   POST /api/leads/upload
// @access  Private
const uploadLeads = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a CSV file' });
  }

  const results = [];
  const errors = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      // Map common CSV headers to Lead model
      const leadData = {
        name: data.name || data.leadName || data.Name || data['Lead Name'] || '',
        email: data.email || data.customerEmail || data.Email || data['Customer Email'] || '',
        company: data.company || data.companyName || data.Company || data['Company Name'] || '',
        phone: data.phone || data.Phone || '',
        status: data.status || data.Status || 'Warm',
        priority: data.priority || data.Priority || 'Medium',
      };
      
      if (leadData.name && leadData.email) {
        results.push(leadData);
      } else {
        errors.push({ row: data, error: 'Missing required fields (name, email)' });
      }
    })
    .on('end', async () => {
      try {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        const assignee = await User.findById(req.user._id);
        const assignedSalesLead = assignee ? assignee.assignedSalesLead : null;

        // Fetch existing leads to avoid duplicates (based on email)
        const emails = results.map(r => r.email);
        const existingLeads = await Lead.find({ email: { $in: emails } }).select('email');
        const existingEmails = new Set(existingLeads.map(l => l.email));

        const newLeads = results
          .filter(r => !existingEmails.has(r.email))
          .map(r => ({
            ...r,
            assignedTo: req.user._id,
            assignedSalesLead: assignedSalesLead,
            createdBy: req.user._id
          }));

        if (newLeads.length > 0) {
          await Lead.insertMany(newLeads);
        }

        res.status(200).json({
          message: 'CSV processing complete',
          totalRows: results.length + errors.length,
          inserted: newLeads.length,
          duplicatesSkipped: results.length - newLeads.length,
          errors: errors.length
        });
      } catch (err) {
        res.status(500).json({ message: 'Error saving leads to database', error: err.message });
      }
    })
    .on('error', (error) => {
      res.status(500).json({ message: 'Error parsing CSV', error: error.message });
    });
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getLeadStats,
  getPendingFollowups,
  uploadLeads,
};
