const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true
  },
  userAvatar: {
    type: String,
    default: null
  },
  title: {
    type: String,
    required: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['react', 'javascript', 'typescript', 'html-css', 'backend', 'database', 'devops', 'mobile', 'ai', 'other'],
    index: true
  },
  codeFile: {
    filename: String,
    originalName: String,
    content: String, // Base64 encoded file content
    mimeType: String,
    size: Number
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending',
    index: true
  },
  experts: {
    type: Number,
    default: 0
  },
  isUrgent: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id field (returns _id as string)
problemSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Ensure virtual fields are serialized
problemSchema.set('toJSON', { virtuals: true });
problemSchema.set('toObject', { virtuals: true });

// Index for better query performance
problemSchema.index({ category: 1, status: 1, createdAt: -1 });
problemSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Problem', problemSchema);
