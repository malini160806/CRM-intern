const Deal = require('../models/Deal');
const { syncRecordEmbedding } = require('../utils/vectorDb');

// @desc    Get all deals
// @route   GET /api/deals
// @access  Private
const getDeals = async (req, res) => {
  try {
    let query = { owner: req.user._id };

    // CEO and SalesLead (Manager) can see all deals in the database
    if (req.user.role === 'CEO' || req.user.role === 'SalesLead') {
      query = {};
    }

    const deals = await Deal.find(query).populate('owner', 'name email');
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get deal by ID
// @route   GET /api/deals/:id
// @access  Private
const getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).populate('owner', 'name email');
    if (deal) {
      res.json(deal);
    } else {
      res.status(404).json({ message: 'Deal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a deal
// @route   POST /api/deals
// @access  Private
const createDeal = async (req, res) => {
  try {
    const { title, value, company, contactPerson, status, expectedCloseDate } = req.body;
    
    const deal = await Deal.create({
      title,
      value,
      company,
      contactPerson,
      status,
      expectedCloseDate,
      owner: req.user._id
    });

    // Auto-sync to AI Vector DB
    syncRecordEmbedding(deal, 'Deal').catch(err => console.error("Auto-sync error:", err));

    res.status(201).json(deal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update deal (status for Kanban)
// @route   PUT /api/deals/:id
// @access  Private
const updateDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (deal) {
      deal.title = req.body.title || deal.title;
      deal.value = req.body.value || deal.value;
      deal.status = req.body.status || deal.status;
      deal.probability = req.body.probability || deal.probability;
      deal.expectedCloseDate = req.body.expectedCloseDate || deal.expectedCloseDate;

      const updatedDeal = await deal.save();

      // Auto-sync to AI Vector DB
      syncRecordEmbedding(updatedDeal, 'Deal').catch(err => console.error("Auto-sync error:", err));

      res.json(updatedDeal);
    } else {
      res.status(404).json({ message: 'Deal not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete deal
// @route   DELETE /api/deals/:id
// @access  Private
const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (deal) {
      await deal.deleteOne();
      res.json({ message: 'Deal removed' });
    } else {
      res.status(404).json({ message: 'Deal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal
};
