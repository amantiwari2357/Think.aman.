const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  problemId: {
    type: String,
    required: true
  },
  participants: [{
    type: String,
    required: true
  }],
  problemTitle: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
chatSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Chat', chatSchema);
