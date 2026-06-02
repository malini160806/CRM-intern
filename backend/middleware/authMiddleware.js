const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists in this database. Please sign up again.' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'CEO')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin/CEO' });
  }
};

/**
 * Dynamic role-based authorization middleware
 * Supports case-insensitive matching and synonyms (CEO = admin)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user session' });
    }

    const userRole = req.user.role.toLowerCase();
    const normalizedAllowedRoles = roles.map(r => r.toLowerCase());

    const isAdmin = normalizedAllowedRoles.includes('admin') || normalizedAllowedRoles.includes('ceo');
    const isLead = normalizedAllowedRoles.includes('saleslead');
    const isPerson = normalizedAllowedRoles.includes('salesperson');

    const hasAccess = 
      (isAdmin && (userRole === 'admin' || userRole === 'ceo')) ||
      (isLead && userRole === 'saleslead') ||
      (isPerson && userRole === 'salesperson');

    if (hasAccess) {
      next();
    } else {
      res.status(403).json({ 
        message: `Forbidden: Access denied for role '${req.user.role}'. Required one of: [${roles.join(', ')}]` 
      });
    }
  };
};

module.exports = { protect, admin, authorize };
