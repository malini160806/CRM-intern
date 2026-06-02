const Account = require('../models/Account');
const Lead = require('../models/Lead');

// @desc    Get all accounts
// @route   GET /api/accounts
// @access  Private
const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ owner: req.user._id });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an account
// @route   POST /api/accounts
// @access  Private
const createAccount = async (req, res) => {
  try {
    const account = await Account.create({
      ...req.body,
      owner: req.user._id
    });
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get account by ID
// @route   GET /api/accounts/:id
// @access  Private
const getAccountById = async (req, res, next) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    
    // Fetch related leads
    const leads = await Lead.find({ account: req.params.id });
    
    res.json({ account, leads });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an account
// @route   PUT /api/accounts/:id
// @access  Private
const updateAccount = async (req, res, next) => {
  try {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json(account);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an account
// @route   DELETE /api/accounts/:id
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    await account.deleteOne();
    res.json({ message: 'Account removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAccounts, createAccount, getAccountById, updateAccount, deleteAccount };
