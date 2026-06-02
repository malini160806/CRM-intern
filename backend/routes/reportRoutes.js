const express = require('express');
const router = express.Router();
const { 
  getSalesReport, 
  getLeadReport, 
  getActivityReport 
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/sales', protect, getSalesReport);
router.get('/leads', protect, getLeadReport);
router.get('/activities', protect, getActivityReport);

module.exports = router;
