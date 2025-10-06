const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only code files
    const allowedTypes = [
      'application/javascript',
      'application/json',
      'text/javascript',
      'text/typescript',
      'text/html',
      'text/css',
      'application/zip',
      'application/x-zip-compressed'
    ];

    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(js|ts|jsx|tsx|html|css|zip)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only code files are allowed.'), false);
    }
  }
});

// Create a new problem (without file upload)
router.post('/text', async (req, res) => {
  try {
    console.log('Creating text problem:', req.body);

    const { userId, userName, userAvatar, title, description, category, industry } = req.body;

    if (!userId || !userName || !title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields (userId, userName, title, description, category)'
      });
    }

    // Create new problem without file
    const problem = new Problem({
      userId,
      userName,
      userAvatar,
      title,
      description,
      category,
      industry,
      status: 'pending',
      experts: 0,
      isUrgent: false
    });

    const savedProblem = await problem.save();
    console.log('Problem created successfully:', savedProblem.id);

    // Convert MongoDB document to proper format for frontend
    const formattedProblem = {
      ...savedProblem.toObject(),
      id: savedProblem._id?.toString() || savedProblem.id,
      _id: undefined
    };

    res.status(201).json({
      success: true,
      problem: formattedProblem
    });

  } catch (error) {
    console.error('Create text problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create problem',
      error: error.message
    });
  }
});

// Create a new problem
router.post('/', upload.single('codeFile'), async (req, res) => {
  try {
    console.log('Creating problem:', req.body);

    const { userId, userName, userAvatar, title, description, category } = req.body;

    if (!userId || !title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    let codeFile = null;
    if (req.file) {
      // Convert file buffer to base64 for storage
      codeFile = {
        filename: req.file.filename || `upload-${Date.now()}`,
        originalName: req.file.originalname,
        content: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype,
        size: req.file.size
      };
    }

    // Create new problem
    const problem = new Problem({
      userId,
      userName,
      userAvatar,
      title,
      description,
      category,
      codeFile,
      status: 'pending',
      experts: 0,
      isUrgent: false
    });

    const savedProblem = await problem.save();
    console.log('Problem created successfully:', savedProblem.id);

    // Convert MongoDB document to proper format for frontend
    const formattedProblem = {
      ...savedProblem.toObject(),
      id: savedProblem._id?.toString() || savedProblem.id,
      _id: undefined,
      comments: savedProblem.comments || []
    };

    res.status(201).json({
      success: true,
      problem: formattedProblem
    });

  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create problem',
      error: error.message
    });
  }
});

// Get problems with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, status, userId, page = 1, limit = 10 } = req.query;

    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (userId) {
      query.userId = userId;
    }

    const problems = await Problem.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Convert MongoDB documents to proper format for frontend
    const formattedProblems = problems.map(problem => ({
      ...problem,
      id: problem._id?.toString() || problem.id,
      _id: undefined
    }));

    const totalCount = await Problem.countDocuments(query);

    res.status(200).json({
      success: true,
      problems: formattedProblems,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });

  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problems',
      error: error.message
    });
  }
});

// Get a single problem by ID
router.get('/:problemId', async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await Problem.findOne({
      $or: [
        { id: problemId },
        { _id: problemId }
      ]
    }).lean();

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Convert MongoDB document to proper format for frontend
    const formattedProblem = {
      ...problem,
      id: problem._id?.toString() || problem.id,
      _id: undefined
    };

    res.status(200).json({
      success: true,
      problem: formattedProblem
    });

  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problem',
      error: error.message
    });
  }
});

// Accept a problem as an expert
router.post('/:problemId/accept', async (req, res) => {
  try {
    const { problemId } = req.params;
    const { expertId, expertName } = req.body;

    if (!expertId) {
      return res.status(400).json({
        success: false,
        message: 'Expert ID is required'
      });
    }

    const problem = await Problem.findOneAndUpdate(
      {
        $or: [
          { id: problemId },
          { _id: problemId }
        ],
        status: 'pending' // Only allow accepting pending problems
      },
      {
        status: 'in-progress',
        $inc: { experts: 1 }
      },
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found or already taken'
      });
    }

    // Convert MongoDB document to proper format for frontend
    const formattedProblem = {
      ...problem.toObject(),
      id: problem._id?.toString() || problem.id,
      _id: undefined
    };

    res.status(200).json({
      success: true,
      problem: formattedProblem,
      message: 'Problem accepted successfully'
    });

  } catch (error) {
    console.error('Accept problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept problem',
      error: error.message
    });
  }
});

// Update problem status
router.patch('/:problemId/status', async (req, res) => {
  try {
    const { problemId } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const problem = await Problem.findOneAndUpdate(
      {
        $or: [
          { id: problemId },
          { _id: problemId }
        ]
      },
      { status },
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Convert MongoDB document to proper format for frontend
    const formattedProblem = {
      ...problem.toObject(),
      id: problem._id?.toString() || problem.id,
      _id: undefined
    };

    res.status(200).json({
      success: true,
      problem: formattedProblem
    });

  } catch (error) {
    console.error('Update problem status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update problem status',
      error: error.message
    });
  }
});

// Download code file
router.get('/:problemId/download', async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await Problem.findOne({
      $or: [
        { id: problemId },
        { _id: problemId }
      ]
    });

    if (!problem || !problem.codeFile) {
      return res.status(404).json({
        success: false,
        message: 'Problem or code file not found'
      });
    }

    // Set appropriate headers for file download
    res.setHeader('Content-Type', problem.codeFile.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${problem.codeFile.originalName}"`);

    // Send the base64 decoded file content
    const fileBuffer = Buffer.from(problem.codeFile.content, 'base64');
    res.send(fileBuffer);

  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download file',
      error: error.message
    });
  }
});

module.exports = router;
