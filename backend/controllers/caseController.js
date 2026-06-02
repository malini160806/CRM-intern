const Case = require('../models/Case');

// @desc    Get all support cases
// @route   GET /api/cases
// @access  Private
const getCases = async (req, res, next) => {
  try {
    const cases = await Case.find({ owner: req.user._id })
      .populate('contact', 'name email')
      .populate('account', 'name');
    res.json(cases);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single case
// @route   GET /api/cases/:id
// @access  Private
const getCaseById = async (req, res, next) => {
  try {
    const supportCase = await Case.findOne({ _id: req.params.id, owner: req.user._id })
      .populate('contact', 'name email')
      .populate('account', 'name');

    if (!supportCase) {
      res.status(404);
      throw new Error('Case not found');
    }

    res.json(supportCase);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a case
// @route   POST /api/cases
// @access  Private
const createCase = async (req, res, next) => {
  try {
    const supportCase = await Case.create({
      ...req.body,
      owner: req.user._id
    });
    
    const populatedCase = await Case.findById(supportCase._id)
      .populate('contact', 'name email')
      .populate('account', 'name');

    res.status(201).json(populatedCase);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a case
// @route   PUT /api/cases/:id
// @access  Private
const updateCase = async (req, res, next) => {
  try {
    const supportCase = await Case.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('contact', 'name email').populate('account', 'name');

    if (!supportCase) {
      res.status(404);
      throw new Error('Case not found');
    }

    res.json(supportCase);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a case
// @route   DELETE /api/cases/:id
// @access  Private
const deleteCase = async (req, res, next) => {
  try {
    const supportCase = await Case.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!supportCase) {
      res.status(404);
      throw new Error('Case not found');
    }

    res.json({ message: 'Case removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getCases, 
  getCaseById, 
  createCase, 
  updateCase, 
  deleteCase 
};
