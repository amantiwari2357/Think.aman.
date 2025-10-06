const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all chat routes
router.use(authMiddleware);

// Create a new chat
router.post('/', async (req, res) => {
  try {
    console.log('Creating chat:', req.body);

    const { problemId, participants, problemTitle, createdBy } = req.body;

    if (!problemId || !participants || !Array.isArray(participants) || participants.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Problem ID and at least 2 participants are required'
      });
    }

    // Check if chat already exists for this problem
    const existingChat = await Chat.findOne({
      problemId: problemId,
      participants: { $all: participants, $size: participants.length }
    });

    if (existingChat) {
      return res.status(200).json({
        success: true,
        chat: existingChat,
        message: 'Chat already exists'
      });
    }

    // Create new chat
    const chat = new Chat({
      problemId,
      participants,
      problemTitle,
      createdBy,
      messages: []
    });

    const savedChat = await chat.save();
    console.log('Chat created successfully:', savedChat.id);

    res.status(201).json({
      success: true,
      chat: savedChat
    });

  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat',
      error: error.message
    });
  }
});

// Get chat history for a specific problem/request
router.get('/:requestId/history', async (req, res) => {
  try {
    const { requestId } = req.params;
    console.log('Fetching chat history for request:', requestId);

    // Find chat by problem ID (which is the request ID)
    const chat = await Chat.findOne({ problemId: requestId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found for this request'
      });
    }

    // Format messages for frontend
    const formattedMessages = chat.messages.map(msg => ({
      id: msg._id?.toString() || msg.id,
      sender: msg.sender,
      userId: msg.userId,
      name: msg.userName,
      content: msg.content,
      timestamp: msg.createdAt
    }));

    res.status(200).json({
      success: true,
      messages: formattedMessages,
      chatId: chat._id?.toString()
    });

  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history',
      error: error.message
    });
  }
});

// Send a message in a chat
router.post('/:requestId/message', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { userId, content } = req.body;

    console.log('Sending message in request:', requestId, 'from user:', userId);

    if (!userId || !content) {
      return res.status(400).json({
        success: false,
        message: 'User ID and content are required'
      });
    }

    // Find or create chat for this problem
    let chat = await Chat.findOne({ problemId: requestId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found. Please accept the problem first.'
      });
    }

    // Add message to chat
    const newMessage = {
      userId,
      userName: req.user.name, // From auth middleware
      content,
      createdAt: new Date()
    };

    chat.messages.push(newMessage);
    await chat.save();

    console.log('Message sent successfully:', newMessage);

    res.status(201).json({
      success: true,
      message: newMessage
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// Get all chats for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({
      participants: userId
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      chats: chats
    });

  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user chats',
      error: error.message
    });
  }
});

module.exports = router;
