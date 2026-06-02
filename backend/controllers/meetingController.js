const Meeting = require('../models/Meeting');
const User = require('../models/User');
const { triggerWebhook } = require('../services/makeWebhook.service');
const { sendEmailDirectly } = require('../utils/emailService');

// @desc    Get all meetings
// @route   GET /api/meetings
// @access  Private
exports.getMeetings = async (req, res, next) => {
  try {
    let query = {};
    const userRole = req.user.role ? req.user.role.toLowerCase() : 'salesperson';
    if (userRole !== 'ceo' && userRole !== 'admin' && userRole !== 'saleslead') {
      query = { user: req.user.id };
    }
    const meetings = await Meeting.find(query).sort({ scheduledDate: 1 }).populate('lead', 'name email');
    res.status(200).json(meetings);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a meeting
// @route   POST /api/meetings
// @access  Private
exports.createMeeting = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    
    if (!req.body.startTime && req.body.scheduledDate) {
      req.body.startTime = req.body.scheduledDate;
    }
    if (!req.body.endTime && req.body.scheduledDate) {
      const end = new Date(req.body.scheduledDate);
      end.setHours(end.getHours() + 1);
      req.body.endTime = end;
    }

    const meeting = await Meeting.create(req.body);
    
    let participants = [];
    if (Array.isArray(meeting.participants)) {
      participants = meeting.participants.map(p => p.trim()).filter(Boolean);
    } else if (typeof meeting.participants === 'string') {
      participants = meeting.participants.split(',').map(p => p.trim()).filter(Boolean);
    }

    if (participants.length > 0) {
      for (const p of participants) {
        await sendEmailDirectly(p, `New Meeting Scheduled: ${meeting.title}`, `You have been invited to a meeting scheduled for ${meeting.scheduledDate || meeting.startTime}.\nLocation/Link: ${meeting.meetingLink || meeting.location || 'TBD'}`);
      }
      
      try {
        const webhookUrl = process.env.MAKE_CRM_WEBHOOK_URL;
        if (webhookUrl) {
          const payload = {
            "event": "meeting_scheduled",
            "participants": participants,
            "meetingTitle": meeting.title,
            "meetingDateTime": meeting.scheduledDate || meeting.startTime,
            "location": meeting.location,
            "meetingLink": meeting.meetingLink,
            "createdBy": req.user.name,
            "timestamp": new Date()
          };
          await require('axios').post(webhookUrl, payload);
        }
      } catch (error) {
        console.error("Meeting webhook failed");
      }
    }

    res.status(201).json(meeting);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a meeting
// @route   PUT /api/meetings/:id
// @access  Private
exports.updateMeeting = async (req, res, next) => {
  try {
    let meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const userRole = req.user.role ? req.user.role.toLowerCase() : 'salesperson';
    if (meeting.user.toString() !== req.user.id && userRole !== 'ceo' && userRole !== 'admin' && userRole !== 'saleslead') {
      return res.status(401).json({ message: 'Not authorized to modify this meeting' });
    }

    meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json(meeting);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a meeting
// @route   DELETE /api/meetings/:id
// @access  Private
exports.deleteMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const userRole = req.user.role ? req.user.role.toLowerCase() : 'salesperson';
    if (meeting.user.toString() !== req.user.id && userRole !== 'ceo' && userRole !== 'admin' && userRole !== 'saleslead') {
      return res.status(401).json({ message: 'Not authorized to delete this meeting' });
    }

    await meeting.deleteOne();
    res.status(200).json({ message: 'Meeting removed' });
  } catch (error) {
    next(error);
  }
};
