const express = require('express');
const router = express.Router();
const { sendEmail, scheduleEmail, getScheduledEmails } = require('../controllers/emailController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/scheduled', getScheduledEmails);
router.post('/send', sendEmail);
router.post('/schedule', scheduleEmail);

module.exports = router;
