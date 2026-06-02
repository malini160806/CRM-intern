const Solution = require('../models/Solution');

// @desc    Get all solutions
// @route   GET /api/solutions
// @access  Private
const getSolutions = async (req, res, next) => {
  try {
    const solutions = await Solution.find({ owner: req.user._id });
    res.json(solutions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single solution
// @route   GET /api/solutions/:id
// @access  Private
const getSolutionById = async (req, res, next) => {
  try {
    const solution = await Solution.findOne({ _id: req.params.id, owner: req.user._id });

    if (!solution) {
      res.status(404);
      throw new Error('Solution not found');
    }

    res.json(solution);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a solution
// @route   POST /api/solutions
// @access  Private
const createSolution = async (req, res, next) => {
  try {
    const solution = await Solution.create({
      ...req.body,
      owner: req.user._id
    });
    res.status(201).json(solution);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a solution
// @route   PUT /api/solutions/:id
// @access  Private
const updateSolution = async (req, res, next) => {
  try {
    const solution = await Solution.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!solution) {
      res.status(404);
      throw new Error('Solution not found');
    }

    res.json(solution);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a solution
// @route   DELETE /api/solutions/:id
// @access  Private
const deleteSolution = async (req, res, next) => {
  try {
    const solution = await Solution.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!solution) {
      res.status(404);
      throw new Error('Solution not found');
    }

    res.json({ message: 'Solution removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSolutions,
  getSolutionById,
  createSolution,
  updateSolution,
  deleteSolution
};
