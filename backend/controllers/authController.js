const User = require('../models/User');
const UserSession = require('../models/UserSession');
const generateToken = require('../utils/generateToken');
const { syncRecordEmbedding } = require('../utils/vectorDb');

const { triggerWebhook } = require('../services/makeWebhook.service');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res, next) => {
  const { 
    name, email, password, role,
    companyName, companySize, industry, website, adminCode,
    department, teamSize, managerId,
    employeeId, salesRegion, reportingManager
  } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name, email, password, role,
      companyName, companySize, industry, website, adminCode,
      department, teamSize, managerId,
      employeeId, salesRegion, reportingManager
    });

    if (user) {
      // Auto-sync User to AI Vector DB
      syncRecordEmbedding(user, 'User').catch(err => console.error("Auto-sync error:", err));

      // Trigger webhook for new signup
      triggerWebhook('signup', {
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName || 'Individual'
      });

      // Create a user session
      await UserSession.create({ user: user._id });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
        image: user.profilePic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Trigger webhook for login
      triggerWebhook('login', {
        name: user.name,
        email: user.email,
        role: user.role
      });

      // Create a user session
      await UserSession.create({ user: user._id });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
        image: user.profilePic,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Auth user with Google
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res, next) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();

    let isNewUser = false;
    let user = await User.findOne({ email });
    if (!user) {
      isNewUser = true;
      // Create user if they don't exist
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36).slice(-8),
        role: 'SalesPerson',
        companyName: 'Individual',
        profilePic: picture
      });
      // Auto-sync User to AI Vector DB
      syncRecordEmbedding(user, 'User').catch(err => console.error("Auto-sync error:", err));
    } else if (!user.profilePic) {
      user.profilePic = picture;
      await user.save();
    }

    // Trigger webhook based on whether they were created or just logged in
    triggerWebhook(isNewUser ? 'signup' : 'login', {
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName || 'Individual'
    });

    // Create a user session
    await UserSession.create({ user: user._id });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      companyName: user.companyName,
      role: user.role,
      image: user.profilePic,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & end session
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res, next) => {
  try {
    const session = await UserSession.findOne({ user: req.user._id, status: 'Active' }).sort({ loginTime: -1 });
    if (session) {
      session.logoutTime = Date.now();
      session.duration = Math.floor((session.logoutTime - session.loginTime) / 1000);
      session.status = 'Completed';
      await session.save();
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, authUser, googleLogin, logoutUser };
