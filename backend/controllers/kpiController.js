const UserSession = require('../models/UserSession');
const Lead = require('../models/Lead');
const Deal = require('../models/Deal');
const Call = require('../models/Call');
const Meeting = require('../models/Meeting');
const Task = require('../models/Task');
const ScheduledEmail = require('../models/ScheduledEmail');
const mongoose = require('mongoose');

// Helper to filter by user if not CEO
const getMatchFilter = (req) => {
  if (req.user.role === 'CEO' || req.user.role === 'admin') {
    return {};
  }
  return { user: req.user._id };
};

// @desc    Get Sales KPIs
// @route   GET /api/kpi/sales
// @access  Private
const getSalesKPIs = async (req, res, next) => {
  try {
    const leadFilter = req.user.role === 'CEO' || req.user.role === 'admin' ? {} : { assignedTo: req.user._id };
    
    const totalLeads = await Lead.countDocuments(leadFilter);
    const convertedLeads = await Lead.countDocuments({ ...leadFilter, status: 'Customer' });
    
    const conversionPercentage = totalLeads === 0 ? 0 : Math.round((convertedLeads / totalLeads) * 100);

    const dealFilter = req.user.role === 'CEO' || req.user.role === 'admin' ? {} : { owner: req.user._id };
    const wonDeals = await Deal.find({ ...dealFilter, stage: 'Closed Won' });
    const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.amount, 0);

    res.json({
      totalLeads,
      convertedCustomers: convertedLeads,
      conversionPercentage,
      totalRevenue
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Activity KPIs
// @route   GET /api/kpi/activity
// @access  Private
const getActivityKPIs = async (req, res, next) => {
  try {
    const filter = getMatchFilter(req);
    // Tasks completed
    const tasksCompleted = await Task.countDocuments({ ...filter, status: 'Completed' });
    // Calls completed
    const callsCompleted = await Call.countDocuments({ ...filter, status: 'Held' });
    // Meetings attended
    const meetingsAttended = await Meeting.countDocuments({ ...filter, status: 'Completed' }); // assuming status or just all
    // Emails sent
    const emailsFilter = req.user.role === 'CEO' || req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const emailsSent = await ScheduledEmail.countDocuments({ ...emailsFilter, status: 'Sent' });

    res.json({
      tasksCompleted,
      callsCompleted,
      meetingsAttended,
      emailsSent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Productivity KPIs
// @route   GET /api/kpi/productivity
// @access  Private
const getProductivityKPIs = async (req, res, next) => {
  try {
    const filter = getMatchFilter(req);
    
    // Group User Sessions by User
    const sessions = await UserSession.aggregate([
      { $match: filter },
      { 
        $group: {
          _id: '$user',
          totalDuration: { $sum: '$duration' },
          sessionsCount: { $sum: 1 }
        }
      }
    ]);

    // Average duration per user
    const totalActiveHours = sessions.reduce((sum, s) => sum + s.totalDuration, 0) / 3600; // in hours

    res.json({
      totalActiveHours: totalActiveHours.toFixed(2),
      activeSessions: sessions.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSalesKPIs, getActivityKPIs, getProductivityKPIs };
