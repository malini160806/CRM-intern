const express = require('express');
const router = express.Router();
const { getMeetings, createMeeting, updateMeeting, deleteMeeting } = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getMeetings)
  .post(createMeeting);

router.route('/:id')
  .put(updateMeeting)
  .delete(deleteMeeting);

module.exports = router;
