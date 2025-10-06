const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
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
  industry: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['meme', 'joke', 'information'],
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: true,
    maxlength: [2000, 'Content cannot be more than 2000 characters']
  },
  imageUrl: {
    type: String,
    default: null
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    id: String,
    userId: String,
    userName: String,
    content: String,
    createdAt: Date
  }],
  isArchived: {
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
postSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Ensure virtual fields are serialized
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

// Index for better query performance
postSchema.index({ industry: 1, type: 1, createdAt: -1 });
postSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
