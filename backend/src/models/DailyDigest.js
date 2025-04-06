// MongoDB schema for daily AI tool digests
const mongoose = require('mongoose');

// Schema for top entries from each source
const TopEntrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  source: { type: String, required: true },
  description: { type: String, required: true },
  metrics: {
    stars: { type: Number, default: 0 },      // GitHub stars
    downloads: { type: Number, default: 0 },  // HuggingFace downloads
    citations: { type: Number, default: 0 }   // arXiv citations
  },
  url: { type: String, required: true },
  improvements: { type: String, default: '' } // Suggested improvements
});

// Schema for daily digest containing top entries and summary
const DailyDigestSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  // Tool statistics
  totalTools: {
    type: Number,
    required: true
  },
  newTools: {
    type: Number,
    required: true
  },
  // Top entries by source
  topEntries: {
    github: [TopEntrySchema],      // Top GitHub repositories
    huggingface: [TopEntrySchema], // Top HuggingFace models
    arxiv: [TopEntrySchema]        // Top arXiv papers
  },
  // Digest content
  summary: {
    type: String,
    required: true
  },
  formattedDocument: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for efficient date-based queries
DailyDigestSchema.index({ date: -1 });

module.exports = mongoose.model('DailyDigest', DailyDigestSchema); 