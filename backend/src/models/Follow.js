const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure unique follow relationships
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

// Virtual for id field (returns _id as string)
followSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Ensure virtual fields are serialized
followSchema.set('toJSON', { virtuals: true });
followSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Follow', followSchema);
