const express = require('express');
const router = express.Router();
const { registerUser, authUser, googleLogin, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', authUser);
router.post('/google', googleLogin);
router.post('/logout', protect, logoutUser);

module.exports = router;
