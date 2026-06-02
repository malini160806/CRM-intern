const Call = require('../models/Call');

// @desc    Get all calls
// @route   GET /api/calls
// @access  Private
exports.getCalls = async (req, res, next) => {
  try {
    const calls = await Call.find({ user: req.user.id }).sort({ startTime: -1 });
    res.status(200).json(calls);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a call
// @route   POST /api/calls
// @access  Private
exports.createCall = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const call = await Call.create(req.body);
    res.status(201).json(call);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a call
// @route   PUT /api/calls/:id
// @access  Private
exports.updateCall = async (req, res, next) => {
  try {
    let call = await Call.findById(req.params.id);

    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    if (call.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    call = await Call.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json(call);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a call
// @route   DELETE /api/calls/:id
// @access  Private
exports.deleteCall = async (req, res, next) => {
  try {
    const call = await Call.findById(req.params.id);

    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    if (call.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await call.deleteOne();
    res.status(200).json({ message: 'Call removed' });
  } catch (error) {
    next(error);
  }
};
