const express = require('express');
const router = express.Router();
const { getCalls, createCall, updateCall, deleteCall } = require('../controllers/callController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getCalls)
  .post(createCall);

router.route('/:id')
  .put(updateCall)
  .delete(deleteCall);

module.exports = router;
