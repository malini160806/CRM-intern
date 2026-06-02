const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loginTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  logoutTime: {
    type: Date
  },
  duration: {
    type: Number, // duration in seconds
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Completed'],
    default: 'Active'
  }
}, {
  timestamps: true,
  collection: 'usersessions'
});

module.exports = mongoose.model('UserSession', userSessionSchema);
