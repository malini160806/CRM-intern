const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
// Only Admin or CEO can manage settings
router.use(authorize('Admin', 'CEO'));

router.route('/')
  .get(getSettings)
  .put(updateSettings);

module.exports = router;
