const Invoice = require('../models/Invoice');

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ owner: req.user._id })
      .populate('account', 'name')
      .populate('items.product', 'name price');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create({
      ...req.body,
      owner: req.user._id
    });
    
    // Populate for immediate frontend display
    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('account', 'name')
      .populate('items.product', 'name price');
      
    res.status(201).json(populatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getInvoices, createInvoice };
