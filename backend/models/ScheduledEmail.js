const mongoose = require('mongoose');

const scheduledEmailSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  recipient: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  scheduleTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'sent', 'failed'],
    default: 'scheduled',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ScheduledEmail', scheduledEmailSchema);
