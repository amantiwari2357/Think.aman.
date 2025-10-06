const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Search users
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Search users by name, email, skills, or industry
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { skills: { $in: [new RegExp(q, 'i')] } },
        { industry: { $regex: q, $options: 'i' } }
      ]
    })
    .select('id name email industry avatar bio location skills experience isVerified')
    .limit(10)
    .lean();

    // Add follow/block status if currentUserId is provided
    const currentUserId = req.headers.authorization?.split(' ')[1];
    if (currentUserId) {
      // In a real app, you'd check the Follow collection for follow status
      // For now, we'll set default values
      users.forEach(user => {
        user.isFollowing = false;
        user.isBlocked = false;
      });
    }

    res.status(200).json({
      success: true,
      users,
      totalCount: users.length
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user profile by ID
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ id: userId })
      .select('id name email industry avatar bio location skills experience isVerified createdAt updatedAt')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add computed fields for the profile display
    const profileData = {
      ...user,
      expertise: user.skills || [],
      problemsSolved: Math.floor(Math.random() * 50) + 10,
      problemsPosted: Math.floor(Math.random() * 20) + 5,
      rating: 3 + Math.random() * 2,
      joinedAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      user: profileData
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's following and followers data
router.get('/:userId/follows', async (req, res) => {
  try {
    const { userId } = req.params;

    // For now, return empty arrays since we don't have Follow model yet
    // In a real app, you'd query the Follow collection
    const followsData = {
      following: [],
      followers: [],
      blockedUsers: []
    };

    res.status(200).json({
      success: true,
      ...followsData
    });

  } catch (error) {
    console.error('Get follows data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Follow a user
router.post('/follow', async (req, res) => {
  try {
    console.log('Follow request received');
    console.log('Request headers:', req.headers);
    console.log('Request body raw:', req.body);

    const { userId, targetUserId } = req.body;
    console.log('Current user ID:', userId);
    console.log('Target user ID:', targetUserId);
    console.log('Target user ID type:', typeof targetUserId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Current user ID is required'
      });
    }

    if (!targetUserId || targetUserId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Target user ID is required and cannot be empty'
      });
    }

    console.log(`Processing follow request for target user: ${targetUserId}`);

    // For demo purposes, don't require target user to exist in database
    // In production, you'd validate that the target user exists
    // const targetUser = await User.findOne({ id: targetUserId });
    // if (!targetUser) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Target user not found'
    //   });
    // }

    console.log(`User ${userId} following ${targetUserId}`);

    // In a real app, you'd create a Follow document in MongoDB
    // For demo purposes, we'll just return success
    res.status(200).json({
      success: true,
      message: 'User followed successfully'
    });

  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Unfollow a user
router.post('/unfollow', async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Current user ID is required'
      });
    }

    // In a real app, you'd remove the Follow document from MongoDB
    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully'
    });

  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Block a user
router.post('/block', async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Current user ID is required'
      });
    }

    // In a real app, you'd create a Block document or add to blocked list
    res.status(200).json({
      success: true,
      message: 'User blocked successfully'
    });

  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Unblock a user
router.post('/unblock', async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Current user ID is required'
      });
    }

    // In a real app, you'd remove the Block document
    res.status(200).json({
      success: true,
      message: 'User unblocked successfully'
    });

  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;
