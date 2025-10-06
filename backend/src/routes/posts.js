const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Create a new post
router.post('/', async (req, res) => {
  try {
    console.log('Creating post:', req.body);

    const { userId, userName, userAvatar, industry, type, title, content, imageUrl } = req.body;

    if (!userId || !title || !content || !type || !industry) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create new post
    const post = new Post({
      userId,
      userName,
      userAvatar,
      industry,
      type,
      title,
      content,
      imageUrl,
      likes: 0,
      comments: []
    });

    const savedPost = await post.save();
    console.log('Post created successfully:', savedPost.id);

    // Convert MongoDB document to proper format for frontend
    const formattedPost = {
      ...savedPost.toObject(),
      id: savedPost._id?.toString() || savedPost.id,
      _id: undefined,
      comments: savedPost.comments || []
    };

    res.status(201).json({
      success: true,
      post: formattedPost
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message
    });
  }
});

// Get posts with optional filtering
router.get('/', async (req, res) => {
  try {
    const { industry, type, userId, page = 1, limit = 10 } = req.query;

    let query = {};

    if (industry && industry !== 'all') {
      query.industry = industry;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (userId) {
      query.userId = userId;
    }

    // Exclude archived posts by default
    query.isArchived = { $ne: true };

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Convert MongoDB documents to proper format for frontend
    const formattedPosts = posts.map(post => ({
      ...post,
      id: post._id?.toString() || post.id,
      _id: undefined, // Remove MongoDB _id from response
      comments: post.comments?.map(comment => ({
        ...comment,
        id: comment.id || `comment-${Date.now()}-${Math.random()}`
      })) || []
    }));

    const totalCount = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      posts: formattedPosts,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
      error: error.message
    });
  }
});

// Get a single post by ID
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({
      $or: [
        { id: postId },
        { _id: postId }
      ]
    }).lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Convert MongoDB document to proper format for frontend
    const formattedPost = {
      ...post,
      id: post._id?.toString() || post.id,
      _id: undefined,
      comments: post.comments?.map(comment => ({
        ...comment,
        id: comment.id || `comment-${Date.now()}-${Math.random()}`
      })) || []
    };

    res.status(200).json({
      success: true,
      post: formattedPost
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post',
      error: error.message
    });
  }
});

// Update a post
router.put('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const updates = req.body;

    const post = await Post.findOneAndUpdate(
      {
        $or: [
          { id: postId },
          { _id: postId }
        ]
      },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Convert MongoDB document to proper format for frontend
    const formattedPost = {
      ...post.toObject(),
      id: post._id?.toString() || post.id,
      _id: undefined,
      comments: post.comments?.map(comment => ({
        ...comment,
        id: comment.id || `comment-${Date.now()}-${Math.random()}`
      })) || []
    };

    res.status(200).json({
      success: true,
      post: formattedPost
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update post',
      error: error.message
    });
  }
});

// Delete a post
router.delete('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOneAndDelete({
      $or: [
        { id: postId },
        { _id: postId }
      ]
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      error: error.message
    });
  }
});

// Like a post
router.post('/:postId/like', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const post = await Post.findOneAndUpdate(
      {
        $or: [
          { id: postId },
          { _id: postId }
        ]
      },
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      likes: post.likes
    });

  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like post',
      error: error.message
    });
  }
});

// Add a comment to a post
router.post('/:postId/comment', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, userName, content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({
        success: false,
        message: 'User ID and content are required'
      });
    }

    const comment = {
      id: `comment-${Date.now()}`,
      userId,
      userName,
      content,
      createdAt: new Date()
    };

    const post = await Post.findOneAndUpdate(
      {
        $or: [
          { id: postId },
          { _id: postId }
        ]
      },
      { $push: { comments: comment } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      comment
    });

  } catch (error) {
    console.error('Comment on post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to comment on post',
      error: error.message
    });
  }
});

module.exports = router;
