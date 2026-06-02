const express = require('express');
const router = express.Router();
const { getSalesKPIs, getActivityKPIs, getProductivityKPIs } = require('../controllers/kpiController');
const { protect } = require('../middleware/authMiddleware');

router.get('/sales', protect, getSalesKPIs);
router.get('/activity', protect, getActivityKPIs);
router.get('/productivity', protect, getProductivityKPIs);

module.exports = router;
