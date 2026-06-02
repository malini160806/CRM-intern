const User = require('../models/User');
const Lead = require('../models/Lead');
const { triggerWebhook } = require('../services/makeWebhook.service');

// @desc    Admin assigns a Sales Person to a Sales Lead
// @route   POST /api/assignments/salesperson
// @access  Private (Admin/CEO only)
const assignSalesPersonToLead = async (req, res, next) => {
  const { salesPersonId, salesLeadId } = req.body;

  try {
    if (!salesPersonId) {
      return res.status(400).json({ message: 'Please provide salesPersonId' });
    }

    // 1. Fetch and validate Sales Person
    const salesPerson = await User.findById(salesPersonId);
    if (!salesPerson) {
      return res.status(404).json({ message: 'Sales Person not found' });
    }
    const isSalesPerson = salesPerson.role.toLowerCase() === 'salesperson';
    if (!isSalesPerson) {
      return res.status(400).json({ message: `User role is '${salesPerson.role}', must be SalesPerson` });
    }

    let salesLead = null;
    
    // 2. Fetch and validate Sales Lead if provided
    if (salesLeadId) {
      salesLead = await User.findById(salesLeadId);
      if (!salesLead) {
        return res.status(404).json({ message: 'Sales Lead not found' });
      }
      const isSalesLead = salesLead.role.toLowerCase() === 'saleslead';
      if (!isSalesLead) {
        return res.status(400).json({ message: `User role is '${salesLead.role}', must be SalesLead` });
      }
    }

    // 3. Update Sales Person record
    const previousSalesLeadId = salesPerson.assignedSalesLead;
    salesPerson.assignedSalesLead = salesLeadId || null;
    await salesPerson.save();

    // 4. Update Previous Sales Lead if exists (remove from team)
    if (previousSalesLeadId && previousSalesLeadId.toString() !== (salesLeadId || '').toString()) {
      await User.findByIdAndUpdate(previousSalesLeadId, {
        $pull: { assignedSalesPersons: salesPersonId }
      });
    }

    // 5. Update New Sales Lead record (add to team if not exists)
    if (salesLead && !salesLead.assignedSalesPersons.includes(salesPersonId)) {
      salesLead.assignedSalesPersons.push(salesPersonId);
      await salesLead.save();
    }

    // 6. Trigger centralized Make.com Webhook: event = salesperson_assigned
    if (salesLead) {
      const payload = {
        salesPersonId: salesPerson._id.toString(),
        salesPersonName: salesPerson.name,
        salesPersonEmail: salesPerson.email,
        salesLeadId: salesLead._id.toString(),
        salesLeadName: salesLead.name,
        salesLeadEmail: salesLead.email,
        assignedBy: req.user.name || 'Admin'
      };
      
      await triggerWebhook('salesperson_assigned', payload);
    }

    res.status(200).json({
      message: 'Sales Person successfully assigned to Sales Lead team',
      salesPerson: {
        id: salesPerson._id,
        name: salesPerson.name,
        assignedSalesLead: salesPerson.assignedSalesLead
      },
      salesLead: salesLead ? {
        id: salesLead._id,
        name: salesLead.name,
        teamSize: salesLead.assignedSalesPersons.length
      } : null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sales Lead assigns a CRM Lead to a Sales Person
// @route   POST /api/assignments/lead
// @access  Private (SalesLeads & Admins only)
const assignLeadToSalesPerson = async (req, res, next) => {
  const { leadId, salesPersonId } = req.body;

  try {
    if (!leadId || !salesPersonId) {
      return res.status(400).json({ message: 'Please provide both leadId and salesPersonId' });
    }

    // 1. Fetch and validate Lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'CRM Lead not found' });
    }

    // 2. Fetch and validate Sales Person
    const salesPerson = await User.findById(salesPersonId);
    if (!salesPerson) {
      return res.status(404).json({ message: 'Sales Person not found' });
    }
    const isSalesPerson = salesPerson.role.toLowerCase() === 'salesperson';
    if (!isSalesPerson) {
      return res.status(400).json({ message: `User role is '${salesPerson.role}', must be SalesPerson` });
    }

    // Enforce team hierarchy: Sales Lead can only assign to members of their own team (unless Admin)
    const userRole = req.user.role.toLowerCase();
    if (userRole === 'saleslead' && salesPerson.assignedSalesLead?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied: You can only assign leads to salespeople in your team' });
    }

    // 3. Update Lead assignment details
    lead.assignedTo = salesPersonId;
    lead.assignedSalesLead = salesPerson.assignedSalesLead || req.user._id;
    await lead.save();

    // 4. Trigger centralized Make.com Webhook: event = lead_assigned
    const priorityMapping = {
      'Hot': 'High',
      'Warm': 'Medium',
      'Cold': 'Low'
    };
    
    const payload = {
      salesPersonName: salesPerson.name,
      salesEmail: salesPerson.email,
      assignedBy: req.user.name || 'Sales Lead',
      assignedLeadCount: 1,
      assignedLeads: [
        {
          leadName: lead.name,
          companyName: lead.company || 'Not Specified',
          email: lead.email,
          priority: priorityMapping[lead.status] || lead.priority || 'Medium',
          status: lead.status || 'Warm'
        }
      ]
    };

    await triggerWebhook('lead_assigned', payload);

    res.status(200).json({
      message: 'Lead successfully assigned to Sales Person',
      leadId: lead._id,
      leadName: lead.name,
      assignedTo: {
        id: salesPerson._id,
        name: salesPerson.name,
        email: salesPerson.email
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  assignSalesPersonToLead,
  assignLeadToSalesPerson
};
