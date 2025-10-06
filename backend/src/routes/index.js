const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth');
const userRoutes = require('./users');

// Define routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

module.exports = router;
