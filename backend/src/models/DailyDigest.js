const mongoose = require('mongoose');

const TopEntrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  source: { type: String, required: true },
  description: { type: String, required: true },
  metrics: {
    stars: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    citations: { type: Number, default: 0 }
  },
  url: { type: String, required: true },
  improvements: { type: String, default: '' }
});

const DailyDigestSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  totalTools: {
    type: Number,
    required: true
  },
  newTools: {
    type: Number,
    required: true
  },
  topEntries: {
    github: [TopEntrySchema],
    huggingface: [TopEntrySchema],
    arxiv: [TopEntrySchema]
  },
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

// Create index for date-based queries
DailyDigestSchema.index({ date: -1 });

module.exports = mongoose.model('DailyDigest', DailyDigestSchema); 