const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    category: String,
    unitPrice: {
      type: Number,
      required: true,
    },
    quantityInStock: {
      type: Number,
      default: 0,
    },
    description: String,
    status: {
      type: String,
      enum: ['Active', 'Discontinued'],
      default: 'Active',
    }
  },
  {
    timestamps: true,
    collection: 'products'
  }
);

module.exports = mongoose.model('Product', productSchema);
