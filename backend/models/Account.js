const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a company name'],
      unique: true,
    },
    industry: String,
    revenue: Number,
    employees: Number,
    website: String,
    phone: String,
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  {
    timestamps: true,
    collection: 'accounts'
  }
);

module.exports = mongoose.model('Account', accountSchema);
