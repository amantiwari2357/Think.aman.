const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth');

// Define routes
router.use('/auth', authRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

module.exports = router;
