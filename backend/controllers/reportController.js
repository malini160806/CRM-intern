const Lead = require('../models/Lead');
const Deal = require('../models/Deal');
const Meeting = require('../models/Meeting');
const Call = require('../models/Call');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get Sales Report
// @route   GET /api/reports/sales
// @access  Private
const getSalesReport = async (req, res) => {
  try {
    let dealQuery = {};
    const userRole = req.user.role ? req.user.role.toLowerCase() : 'salesperson';
    if (userRole === 'ceo' || userRole === 'admin') {
      dealQuery = {};
    } else if (userRole === 'saleslead') {
      dealQuery = { owner: req.user._id }; // We would ideally query team members here, but Deal doesn't have assignedSalesLead right now
    } else {
      dealQuery = { owner: req.user._id };
    }

    const deals = await Deal.find(dealQuery).populate('owner', 'name');

    // Revenue by month (last 6 months)
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      last6Months.push(date.toLocaleString('default', { month: 'short' }));
    }

    const revenueByMonth = last6Months.map(month => ({ name: month, revenue: 0 }));
    deals.filter(d => d.status === 'Won').forEach(deal => {
      const month = new Date(deal.updatedAt).toLocaleString('default', { month: 'short' });
      const index = last6Months.indexOf(month);
      if (index !== -1) {
        revenueByMonth[index].revenue += (deal.value || 0);
      }
    });

    // Won vs Lost
    const wonCount = deals.filter(d => d.status === 'Won').length;
    const lostCount = deals.filter(d => d.status === 'Lost').length;
    const openCount = deals.filter(d => !['Won', 'Lost'].includes(d.status)).length;

    // Revenue by Owner
    const ownerRevenue = {};
    deals.filter(d => d.status === 'Won').forEach(deal => {
      const ownerName = deal.owner?.name || 'Unknown';
      ownerRevenue[ownerName] = (ownerRevenue[ownerName] || 0) + (deal.value || 0);
    });
    const ownerRevenueData = Object.entries(ownerRevenue).map(([name, value]) => ({ name, value }));

    res.json({
      revenueByMonth,
      winLossData: [
        { name: 'Won', value: wonCount, color: '#10b981' },
        { name: 'Lost', value: lostCount, color: '#ef4444' },
        { name: 'Open', value: openCount, color: '#0ea5e9' }
      ],
      ownerRevenueData,
      totalRevenue: deals.filter(d => d.status === 'Won').reduce((sum, d) => sum + (d.value || 0), 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Lead Report
// @route   GET /api/reports/leads
// @access  Private
const getLeadReport = async (req, res) => {
  try {
    let leadQuery = {};
    const userRole = req.user.role ? req.user.role.toLowerCase() : 'salesperson';
    if (userRole === 'ceo' || userRole === 'admin') {
      leadQuery = {};
    } else if (userRole === 'saleslead') {
      leadQuery = { $or: [{ assignedTo: req.user._id }, { assignedSalesLead: req.user._id }] };
    } else {
      leadQuery = { assignedTo: req.user._id };
    }

    const leads = await Lead.find(leadQuery);

    // Leads by Status
    const statusCounts = {};
    leads.forEach(lead => {
      statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
    });
    const leadStatusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    // Lead Source distribution
    const sourceCounts = {};
    leads.forEach(lead => {
      const source = lead.source || 'Other';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    const leadSourceData = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

    // Lead growth (last 6 months)
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      last6Months.push(date.toLocaleString('default', { month: 'short' }));
    }
    const leadGrowth = last6Months.map(month => ({ name: month, count: 0 }));
    leads.forEach(lead => {
      const month = new Date(lead.createdAt).toLocaleString('default', { month: 'short' });
      const index = last6Months.indexOf(month);
      if (index !== -1) {
        leadGrowth[index].count += 1;
      }
    });

    // Conversion metrics
    const convertedCount = leads.filter(l => l.status === 'Converted').length;
    const conversionRate = leads.length > 0 ? ((convertedCount / leads.length) * 100).toFixed(1) : 0;

    res.json({
      leadStatusData,
      leadSourceData,
      leadGrowth,
      totalLeads: leads.length,
      conversionRate,
      convertedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Activity Report
// @route   GET /api/reports/activities
// @access  Private
const getActivityReport = async (req, res) => {
  try {
    let meetQuery = {};
    let callQuery = {};
    let taskQuery = {};
    const userRole = req.user.role ? req.user.role.toLowerCase() : 'salesperson';
    
    if (userRole !== 'ceo' && userRole !== 'admin') {
      meetQuery = { user: req.user._id };
      callQuery = { user: req.user._id };
      taskQuery = { assignedTo: req.user._id };
    }

    const meetings = await Meeting.find(meetQuery);
    const calls = await Call.find(callQuery);
    const tasks = await Task.find(taskQuery);

    // Activities by type
    const activityData = [
      { name: 'Meetings', value: meetings.length, color: '#8b5cf6' },
      { name: 'Calls', value: calls.length, color: '#0ea5e9' },
      { name: 'Tasks', value: tasks.length, color: '#f59e0b' }
    ];

    // Activity over time (combined)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toLocaleDateString('default', { weekday: 'short' }));
    }

    const activityTrend = last7Days.map(day => ({ name: day, meetings: 0, calls: 0, tasks: 0 }));
    
    meetings.forEach(m => {
      const day = new Date(m.startTime).toLocaleDateString('default', { weekday: 'short' });
      const item = activityTrend.find(d => d.name === day);
      if (item) item.meetings += 1;
    });

    calls.forEach(c => {
      const day = new Date(c.startTime).toLocaleDateString('default', { weekday: 'short' });
      const item = activityTrend.find(d => d.name === day);
      if (item) item.calls += 1;
    });

    tasks.forEach(t => {
      const day = new Date(t.createdAt).toLocaleDateString('default', { weekday: 'short' });
      const item = activityTrend.find(d => d.name === day);
      if (item) item.tasks += 1;
    });

    res.json({
      activityData,
      activityTrend,
      summary: {
        totalMeetings: meetings.length,
        totalCalls: calls.length,
        totalTasks: tasks.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSalesReport,
  getLeadReport,
  getActivityReport
};
