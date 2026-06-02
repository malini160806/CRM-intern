const express = require('express');
const router = express.Router();
const { updateUserProfile, getCompanyMembers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/company', getCompanyMembers);
router.put('/profile', updateUserProfile);

module.exports = router;
