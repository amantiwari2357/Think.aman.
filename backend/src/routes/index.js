const express = require('express');
const router = express.Router();

// Import route files
// const userRoutes = require('./user.routes');
// const authRoutes = require('./auth.routes');

// Define routes
// router.use('/users', userRoutes);
// router.use('/auth', authRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

module.exports = router;
