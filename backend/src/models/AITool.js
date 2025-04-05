const mongoose = require('mongoose');

const AIToolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  source: {
    type: String,
    enum: ['GitHub', 'HuggingFace', 'arXiv'],
    required: true
  },
  metrics: {
    stars: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    citations: { type: Number, default: 0 }
  },
  timeline: [{
    date: { type: Date, required: true },
    value: { type: Number, required: true }
  }],
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster queries
AIToolSchema.index({ name: 'text', description: 'text' });
AIToolSchema.index({ source: 1, 'metrics.stars': -1 });
AIToolSchema.index({ source: 1, 'metrics.downloads': -1 });

module.exports = mongoose.model('AITool', AIToolSchema); 