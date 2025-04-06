// MongoDB schema for AI tools from various sources
const mongoose = require('mongoose');

// Define schema for AI tools with metrics tracking
const AIToolSchema = new mongoose.Schema({
  // Basic tool information
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
  // Source-specific metrics
  metrics: {
    stars: { type: Number, default: 0 },      // GitHub stars
    downloads: { type: Number, default: 0 },  // HuggingFace downloads
    citations: { type: Number, default: 0 }   // arXiv citations
  },
  // Historical data tracking
  timeline: [{
    date: { type: Date, required: true },
    value: { type: Number, required: true }
  }],
  // Additional tool information
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for optimized queries
AIToolSchema.index({ name: 'text', description: 'text' });  // Text search
AIToolSchema.index({ source: 1, 'metrics.stars': -1 });     // GitHub ranking
AIToolSchema.index({ source: 1, 'metrics.downloads': -1 }); // HuggingFace ranking

module.exports = mongoose.model('AITool', AIToolSchema); 