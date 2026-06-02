const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a meeting title']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Please add a scheduled date']
  },
  startTime: {
    type: Date,
    required: [true, 'Please add a start time']
  },
  endTime: {
    type: Date,
    required: [true, 'Please add an end time']
  },
  location: {
    type: String,
    default: 'Online'
  },
  description: {
    type: String
  },
  participants: [String],
  status: {
    type: String,
    enum: ['Upcoming', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  meetingLink: {
    type: String
  },
  notes: {
    type: String,
    default: ''
  },
  outcome: {
    type: String,
    enum: ['Pending', 'Completed', 'Rescheduled', 'Cancelled', 'No Show'],
    default: 'Pending'
  },
  followUpActions: {
    type: String
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: [true, 'Please link a lead to this meeting']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  collection: 'meetings'
});

// Avoid OverwriteModelError
module.exports = mongoose.models.CRMMeeting || mongoose.model('CRMMeeting', meetingSchema);
