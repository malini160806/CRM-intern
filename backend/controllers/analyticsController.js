const Lead = require('../models/Lead');
const Deal = require('../models/Deal');
const Meeting = require('../models/Meeting');

// @desc    Get analytics statistics
// @route   GET /api/analytics
// @access  Private
const getAnalyticsStats = async (req, res) => {
  try {
    let leadQuery = {};
    let dealQuery = {};
    let meetingQuery = {};
    const userRole = req.user.role ? req.user.role.toLowerCase() : 'salesperson';

    if (userRole === 'ceo' || userRole === 'admin') {
      leadQuery = {};
      dealQuery = {};
      meetingQuery = {};
    } else if (userRole === 'saleslead') {
      leadQuery = { $or: [{ assignedTo: req.user._id }, { assignedSalesLead: req.user._id }] };
      dealQuery = { owner: req.user._id }; // Assuming deals don't have assignedSalesLead yet, or we'd add it.
      meetingQuery = { user: req.user._id };
    } else {
      leadQuery = { assignedTo: req.user._id };
      dealQuery = { owner: req.user._id };
      meetingQuery = { user: req.user._id };
    }

    const leads = await Lead.find(leadQuery);
    const deals = await Deal.find(dealQuery);
    const meetings = await Meeting.find(meetingQuery);

    // 1. Conversion Rate: (Won deals / Total deals) * 100
    const wonDeals = deals.filter(d => d.status === 'Won');
    const conversionRate = deals.length > 0 ? ((wonDeals.length / deals.length) * 100).toFixed(1) : 0;

    // 2. Avg Deal Size: Total value of all deals / Number of deals
    const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    const avgDealSize = deals.length > 0 ? (totalValue / deals.length).toFixed(2) : 0;

    // 3. Sales Velocity: Average days from creation to "Won" status
    let totalDays = 0;
    let wonDealsWithDuration = 0;
    wonDeals.forEach(deal => {
      if (deal.createdAt && deal.updatedAt) {
        const duration = (new Date(deal.updatedAt) - new Date(deal.createdAt)) / (1000 * 60 * 60 * 24);
        totalDays += duration;
        wonDealsWithDuration++;
      }
    });
    const salesVelocity = wonDealsWithDuration > 0 ? (totalDays / wonDealsWithDuration).toFixed(1) : 0;

    // Pending Follow-ups (Leads not updated in 2 days)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const pendingFollowups = leads.filter(l => 
      ['Warm', 'Cold', 'Hot / High Potential'].includes(l.status) && 
      new Date(l.updatedAt) <= twoDaysAgo
    ).length;

    // Meeting Statistics
    const upcomingMeetings = meetings.filter(m => m.status === 'Upcoming').length;
    const completedMeetings = meetings.filter(m => m.status === 'Completed').length;

    // 4. Funnel Data: Counts of deals in each status
    const funnelStages = ['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
    const funnelData = funnelStages.map(stage => ({
      name: stage,
      value: deals.filter(d => d.status === stage).length
    }));

    // 5. Source Distribution: Counts of leads by source
    const sources = ['Website', 'Referral', 'Cold Call', 'LinkedIn', 'Other'];
    const colors = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981', '#64748b'];
    const sourceData = sources.map((source, index) => ({
      name: source,
      value: leads.filter(l => (l.source || 'Other') === source).length,
      color: colors[index]
    })).filter(item => item.value > 0);

    res.json({
      metrics: {
        conversionRate,
        avgDealSize,
        salesVelocity,
        pendingFollowups,
        upcomingMeetings,
        completedMeetings
      },
      funnelData,
      sourceData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalyticsStats,
};
