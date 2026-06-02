const Lead = require('../models/Lead');
const Meeting = require('../models/Meeting');
const Deal = require('../models/Deal');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = [];

    // 1. New Leads Assigned
    const recentLeads = await Lead.find({ 
      assignedTo: userId,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }).sort({ createdAt: -1 }).limit(3);

    recentLeads.forEach(lead => {
      notifications.push({
        id: `lead_${lead._id}`,
        title: 'New Lead Assigned',
        description: `${lead.name} from ${lead.company || 'Unknown'}`,
        time: lead.createdAt,
        type: 'lead'
      });
    });

    // 2. Upcoming Meetings
    const upcomingMeetings = await Meeting.find({
      user: userId,
      startTime: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    }).sort({ startTime: 1 }).limit(3);

    upcomingMeetings.forEach(meeting => {
      notifications.push({
        id: `meet_${meeting._id}`,
        title: 'Upcoming Meeting',
        description: meeting.title,
        time: meeting.startTime,
        type: 'meeting'
      });
    });

    // 3. Recently Updated Deals
    const recentDeals = await Deal.find({
      owner: userId,
      updatedAt: { $gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
    }).sort({ updatedAt: -1 }).limit(3);

    recentDeals.forEach(deal => {
      notifications.push({
        id: `deal_${deal._id}`,
        title: 'Deal Updated',
        description: `${deal.name} is now ${deal.status}`,
        time: deal.updatedAt,
        type: 'deal'
      });
    });

    // Sort
    notifications.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json(notifications.slice(0, 5));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotifications };
