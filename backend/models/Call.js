const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Please add a call subject']
  },
  callType: {
    type: String,
    enum: ['Inbound', 'Outbound'],
    default: 'Outbound'
  },
  callPurpose: {
    type: String,
    enum: ['Prospecting', 'Administrative', 'Negotiation', 'Demo', 'Project Management', 'Support'],
    default: 'Prospecting'
  },
  startTime: {
    type: Date,
    required: [true, 'Please add a start time']
  },
  duration: {
    type: String, // e.g. "15:00" or in seconds
    default: '00:00'
  },
  status: {
    type: String,
    enum: ['Planned', 'Held', 'Missed'],
    default: 'Planned'
  },
  description: {
    type: String
  },
  callResult: {
    type: String
  },
  relatedTo: {
    type: String, // 'Lead', 'Contact', 'Account', 'Deal'
    required: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'relatedTo'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  collection: 'calls'
});

module.exports = mongoose.models.Call || mongoose.model('Call', callSchema);
