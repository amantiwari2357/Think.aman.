const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth');
const userRoutes = require('./users');
const postRoutes = require('./posts');
const problemRoutes = require('./problems');
const chatRoutes = require('./chat');

// Define routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/problems', problemRoutes);
router.use('/chat', chatRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

module.exports = router;
