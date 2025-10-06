const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    console.log('Auth middleware - Token received:', token ? 'Present' : 'Missing'); // Debug
    console.log('Auth middleware - Authorization header:', req.headers.authorization); // Debug

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      console.log('Auth middleware - Verifying token...'); // Debug
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth middleware - Token decoded successfully:', decoded.id); // Debug

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        console.log('Auth middleware - User not found for ID:', decoded.id); // Debug
        return res.status(401).json({
          success: false,
          message: 'Token is not valid. User not found.'
        });
      }

      // Update last login
      await user.updateLastLogin();

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware - JWT verification failed:', error.message); // Debug
      return res.status(401).json({
        success: false,
        message: 'Token is not valid.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Optional: Check if user is admin (for future use)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  generateToken,
  authorize
};
