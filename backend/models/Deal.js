const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a deal title'],
    },
    value: {
      type: Number,
      required: [true, 'Please add a deal value'],
      default: 0,
    },
    company: {
      type: String,
      required: [true, 'Please add a company name'],
    },
    contactPerson: {
      type: String,
    },
    status: {
      type: String,
      enum: ['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'],
      default: 'New',
    },
    probability: {
      type: Number,
      default: 10, // percentage
    },
    expectedCloseDate: {
      type: Date,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
    },
    notes: String,
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    }
  },
  {
    timestamps: true,
    collection: 'deals'
  }
);

const { syncRecordEmbedding, deleteEmbedding } = require('../utils/vectorDb');

dealSchema.post('save', async function (doc) {
  await syncRecordEmbedding(doc, 'Deal');
});

dealSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await syncRecordEmbedding(doc, 'Deal');
  }
});

dealSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await deleteEmbedding(doc._id.toString());
  }
});

dealSchema.post('deleteOne', { document: true, query: false }, async function () {
  await deleteEmbedding(this._id.toString());
});

module.exports = mongoose.model('Deal', dealSchema);
