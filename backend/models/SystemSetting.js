const mongoose = require('mongoose');

const systemSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    description: {
      type: String
    }
  },
  {
    timestamps: true,
    collection: 'system_settings'
  }
);

module.exports = mongoose.model('SystemSetting', systemSettingSchema);
