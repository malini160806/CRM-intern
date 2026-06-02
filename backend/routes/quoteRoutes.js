const express = require('express');
const router = express.Router();
const { getQuotes, createQuote, getQuoteById, updateQuote, updateQuoteStatus, deleteQuote } = require('../controllers/quoteController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getQuotes)
  .post(createQuote);

router.route('/:id')
  .get(getQuoteById)
  .put(updateQuote)
  .delete(deleteQuote);

router.route('/:id/status')
  .put(updateQuoteStatus);

module.exports = router;
