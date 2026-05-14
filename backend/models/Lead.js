const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    company: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Hot', 'Warm', 'Cold'],
      default: 'Warm',
    },
    leadScore: {
      type: Number,
      default: 0,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    notes: [
      {
        text: String,
        date: { type: Date, default: Date.now },
      },
    ],
    aiInsights: {
      buyingIntent: String,
      recommendedAction: String,
      summary: String,
    },
    qualificationData: {
      businessType: String,
      budget: String,
      timeline: String,
      requirements: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lead', leadSchema);
