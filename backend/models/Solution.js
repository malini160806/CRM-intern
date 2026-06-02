const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema(
  {
    solutionNumber: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Reviewed', 'Published', 'Internal'],
      default: 'Draft',
    },
    category: {
      type: String,
      default: 'General',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'solutions',
  }
);

module.exports = mongoose.model('Solution', solutionSchema);
