const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a contact name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      trim: true,
      lowercase: true,
    },
    phone: String,
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    title: String, // e.g., CTO, Manager
    department: String,
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Lead'],
      default: 'Active',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  {
    timestamps: true,
    collection: 'contacts'
  }
);

const { syncRecordEmbedding, deleteEmbedding } = require('../utils/vectorDb');

contactSchema.post('save', async function (doc) {
  await syncRecordEmbedding(doc, 'Contact');
});

contactSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await syncRecordEmbedding(doc, 'Contact');
  }
});

contactSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await deleteEmbedding(doc._id.toString());
  }
});

contactSchema.post('deleteOne', { document: true, query: false }, async function () {
  await deleteEmbedding(this._id.toString());
});

module.exports = mongoose.model('Contact', contactSchema);
