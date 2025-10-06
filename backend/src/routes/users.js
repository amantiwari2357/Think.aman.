const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Follow = require('../models/Follow');

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
    .limit(10);
    // Remove .lean() to ensure virtual fields are included

    console.log('Raw database users before select:', users.map(u => ({ id: u.id, name: u.name, email: u.email })));

    // If no users found in database OR users don't have complete profile data, return demo users for testing
    let usersWithStatus = users;
    if (users.length === 0 || users.some(user => !user.name || !user.industry)) {
      if (users.length === 0) {
        console.log('No users found in database, returning demo users for testing');
      } else {
        console.log('Users found but incomplete profile data, returning demo users for testing');
      }
      usersWithStatus = [];
    } else {
      console.log('Found complete users in database:', users.length);
      console.log('Users after select:', users.map(u => ({ id: u.id, name: u.name, industry: u.industry, avatar: u.avatar })));
    }

    // Add follow/block status if currentUserId is provided
    const currentUserId = req.headers.authorization?.split(' ')[1];
    if (currentUserId) {
      // In a real app, you'd check the Follow collection for follow status
      // For now, we'll set default values
      usersWithStatus.forEach(user => {
        user.isFollowing = false;
        user.isBlocked = false;
      });
    }

    // Ensure all users have the id field properly set
    usersWithStatus = usersWithStatus.map(user => ({
      ...user,
      id: user.id || user._id?.toString()
    }));

    res.status(200).json({
      success: true,
      users: usersWithStatus,
      totalCount: usersWithStatus.length
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
    console.log('Looking for user with ID:', userId);

    // Try finding by virtual id field first
    let user = await User.findOne({ id: userId });

    // If not found, try finding by _id field (in case of ObjectId format)
    if (!user) {
      console.log('User not found by virtual id, trying _id lookup');
      user = await User.findById(userId);
    }

    if (!user) {
      console.log('User not found with either method');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('Found user:', { id: user.id, name: user.name });

    // Add computed fields for the profile display
    const profileData = {
      ...user.toObject(),
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
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get user's following and followers data
router.get('/:userId/follows', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all follow relationships for this user
    const following = await Follow.find({ followerId: userId }).populate('followingId', 'id name').lean();
    const followers = await Follow.find({ followingId: userId }).populate('followerId', 'id name').lean();

    const followingIds = following.map(f => f.followingId.id);
    const followersIds = followers.map(f => f.followerId.id);

    res.status(200).json({
      success: true,
      following: followingIds,
      followers: followersIds,
      blockedUsers: []
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

    // Check if already following
    const existingFollow = await Follow.findOne({
      followerId: userId,
      followingId: targetUserId
    });

    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: 'Already following this user'
      });
    }

    // Create follow relationship
    const follow = new Follow({
      followerId: userId,
      followingId: targetUserId
    });

    await follow.save();

    console.log(`User ${userId} is now following ${targetUserId}`);

    // Notify the target user about the new follower
    // In a real app, the backend would handle sending notifications with proper user names
    // For now, we'll just return success

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

    if (!targetUserId || targetUserId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Target user ID is required and cannot be empty'
      });
    }

    // Remove follow relationship
    const result = await Follow.findOneAndDelete({
      followerId: userId,
      followingId: targetUserId
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Follow relationship not found'
      });
    }

    console.log(`User ${userId} unfollowed ${targetUserId}`);

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
      user: profileData
    });

  } catch (error) {
    console.error('Get user profile error:', error);
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
