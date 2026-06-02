const express = require('express');
const router = express.Router();
const { getAnalyticsStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAnalyticsStats);

module.exports = router;
