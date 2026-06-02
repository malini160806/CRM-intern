const Task = require('../models/Task');
const User = require('../models/User');
const { triggerWebhook } = require('../services/makeWebhook.service');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    let query = {};
    if (req.query.relatedId) {
      query.relatedId = req.query.relatedId;
    } else {
      query.user = req.user.id;
    }
    const tasks = await Task.find(query).sort({ dueDate: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const task = await Task.create(req.body);
    console.log("FOLLOW-UP API TRIGGERED");
    const webhookUrl = process.env.MAKE_CRM_WEBHOOK_URL;
    
    if (task.relatedTo === 'Lead' && task.relatedId) {
      try {
        const Lead = require('../models/Lead');
        const User = require('../models/User');
        const lead = await Lead.findById(task.relatedId);
        
        if (lead && lead.assignedTo) {
          const assignedSalesPerson = await User.findById(lead.assignedTo);
          const followup = task;
          
          if (assignedSalesPerson) {
            console.log("Assigned sales person:", assignedSalesPerson);
            
            if (webhookUrl) {
              const payload = {
                "event": "lead_followup",
                "leadId": lead._id,
                "leadName": lead.name,
                "leadEmail": lead.email,
                "companyName": lead.companyName || lead.company,
                "salesPersonName": assignedSalesPerson.name,
                "salesPersonEmail": assignedSalesPerson.email,
                "status": lead.intent || lead.status,
                "subject": followup.title,
                "description": followup.description,
                "followupDate": followup.dueDate,
                "timestamp": new Date()
              };
              
              console.log("Sending lead_followup webhook");
              console.log(payload);
              
              await triggerWebhook("lead_followup", payload);
              console.log("lead_followup success");
            }
          } else {
            console.log("Assigned user not found in DB for lead:", lead.name);
          }
        } else {
          console.log("Lead not found or has no assigned sales person.");
        }
      } catch (error) {
        console.error(
          "lead_followup webhook failed:",
          error.response?.data || error.message
        );
      }
    }

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};
