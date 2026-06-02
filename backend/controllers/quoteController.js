const Quote = require('../models/Quote');

// @desc    Get all quotes
// @route   GET /api/quotes
// @access  Private
const getQuotes = async (req, res, next) => {
  try {
    const quotes = await Quote.find({ owner: req.user._id })
      .populate('account', 'name')
      .populate('items.product', 'name price');
    res.json(quotes);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a quote
// @route   POST /api/quotes
// @access  Private
const createQuote = async (req, res, next) => {
  try {
    const quote = await Quote.create({
      ...req.body,
      owner: req.user._id
    });
    
    // Populate for immediate frontend display
    const populatedQuote = await Quote.findById(quote._id)
      .populate('account', 'name')
      .populate('items.product', 'name price');
      
    res.status(201).json(populatedQuote);
  } catch (error) {
    next(error);
  }
};

// @desc    Get quote by ID
// @route   GET /api/quotes/:id
// @access  Private
const getQuoteById = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('account', 'name')
      .populate('deal', 'name amount stage')
      .populate('items.product', 'name price description');
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    res.json(quote);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a quote
// @route   PUT /api/quotes/:id
// @access  Private
const updateQuote = async (req, res, next) => {
  try {
    let quote = await Quote.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('account', 'name')
      .populate('items.product', 'name price');
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    res.json(quote);
  } catch (error) {
    next(error);
  }
};

// @desc    Update quote status (Workflow)
// @route   PUT /api/quotes/:id/status
// @access  Private
const updateQuoteStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    let quote = await Quote.findById(req.params.id)
      .populate('account', 'name')
      .populate('items.product', 'name price');
    
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    
    quote.status = status;
    await quote.save();
    
    res.json(quote);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a quote
// @route   DELETE /api/quotes/:id
// @access  Private
const deleteQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    await quote.deleteOne();
    res.json({ message: 'Quote removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getQuotes, createQuote, getQuoteById, updateQuote, updateQuoteStatus, deleteQuote };
