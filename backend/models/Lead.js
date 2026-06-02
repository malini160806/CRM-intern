const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    leadName: {
      type: String,
    },
    company: {
      type: String,
    },
    companyName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
    },
    customerEmail: {
      type: String,
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
      enum: ['New Lead', 'Contacted', 'Warm', 'Cold', 'Hot / High Potential', 'Meeting Scheduled', 'Converted', 'Lost'],
      default: 'New Lead',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    leadScore: {
      type: Number,
      default: 0,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedSalesLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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
    source: {
      type: String,
      enum: ['Website', 'Referral', 'Cold Call', 'LinkedIn', 'Other'],
      default: 'Other',
    },
    qualificationData: {
      businessType: String,
      budget: String,
      timeline: String,
      requirements: String,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
  },
  {
    timestamps: true,
    collection: 'leads'
  }
);

leadSchema.pre('save', async function () {
  if (this.leadName && !this.name) this.name = this.leadName;
  if (this.name && !this.leadName) this.leadName = this.name;
  
  if (this.companyName && !this.company) this.company = this.companyName;
  if (this.company && !this.companyName) this.companyName = this.company;
  
  if (this.customerEmail && !this.email) this.email = this.customerEmail;
  if (this.email && !this.customerEmail) this.customerEmail = this.email;
  
  // Sync priority based on status
  if (this.isModified('status') || !this.priority) {
    if (['Hot / High Potential', 'Meeting Scheduled', 'Converted'].includes(this.status)) {
      this.priority = 'High';
    } else if (['Warm', 'Contacted', 'New Lead'].includes(this.status)) {
      this.priority = 'Medium';
    } else if (['Cold', 'Lost'].includes(this.status)) {
      this.priority = 'Low';
    }
  }
});

const { syncRecordEmbedding, deleteEmbedding } = require('../utils/vectorDb');

leadSchema.post('save', async function (doc) {
  await syncRecordEmbedding(doc, 'Lead');
});

leadSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await syncRecordEmbedding(doc, 'Lead');
  }
});

leadSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await deleteEmbedding(doc._id.toString());
  }
});

leadSchema.post('deleteOne', { document: true, query: false }, async function () {
  await deleteEmbedding(this._id.toString());
});

module.exports = mongoose.model('Lead', leadSchema);
