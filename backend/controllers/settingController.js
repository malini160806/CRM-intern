const SystemSetting = require('../models/SystemSetting');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private (Admin/CEO)
const getSettings = async (req, res, next) => {
  try {
    const settings = await SystemSetting.find({});
    // Return as a key-value object
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    
    // Provide default fallback if empty
    if (Object.keys(settingsObj).length === 0) {
      settingsObj.reminderDaysHot = 1;
      settingsObj.reminderDaysWarm = 2;
      settingsObj.reminderDaysCold = 3;
    }
    
    res.status(200).json(settingsObj);
  } catch (error) {
    next(error);
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private (Admin/CEO)
const updateSettings = async (req, res, next) => {
  const updates = req.body;
  try {
    const promises = Object.keys(updates).map((key) => {
      return SystemSetting.findOneAndUpdate(
        { key },
        { value: updates[key] },
        { upsert: true, new: true }
      );
    });
    await Promise.all(promises);
    res.status(200).json({ message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings
};
