const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { scheduleScrapingTasks } = require('./scheduler');
const DailyDigest = require('./models/DailyDigest');
const AITool = require('./models/AITool');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Log environment variables (without sensitive data)
console.log('Environment:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI ? '***' : 'not set'
});

// MongoDB connection with increased timeout and better error handling
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
  connectTimeoutMS: 30000, // 30 seconds
  maxPoolSize: 10,
  retryWrites: true,
  w: 'majority'
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  
  // Start the server after successful MongoDB connection
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Initialize scraping tasks and digest generation
    scheduleScrapingTasks();
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    code: err.code,
    codeName: err.codeName
  });
  process.exit(1); // Exit if we can't connect to MongoDB
});

// Add connection event listeners
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  // Attempt to reconnect after a delay
  setTimeout(() => {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
  }, 5000);
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

// Routes
app.get('/api/tools', async (req, res) => {
  try {
    console.log('Fetching all tools from database...');
    
    // First, fetch all tools from each source
    const [allGithubTools, allHuggingfaceTools, allArxivTools] = await Promise.all([
      AITool.find({ source: 'GitHub' }).select('name description url metrics type'),
      AITool.find({ source: 'HuggingFace' }).select('name description url metrics type'),
      AITool.find({ source: 'arXiv' }).select('name description url metrics type')
    ]);

    console.log(`Found ${allGithubTools.length} GitHub tools, ${allHuggingfaceTools.length} HuggingFace tools, and ${allArxivTools.length} arXiv tools`);

    // Sort and get top 6 for each source
    const githubTools = allGithubTools
      .sort((a, b) => (b.metrics?.stars || 0) - (a.metrics?.stars || 0))
      .slice(0, 6);

    const huggingfaceTools = allHuggingfaceTools
      .sort((a, b) => (b.metrics?.downloads || 0) - (a.metrics?.downloads || 0))
      .slice(0, 6);

    const arxivTools = allArxivTools
      .sort((a, b) => (b.metrics?.citations || 0) - (a.metrics?.citations || 0))
      .slice(0, 6);

    console.log('Returning top 6 tools from each source');
    
    res.json({
      github: githubTools,
      huggingface: huggingfaceTools,
      arxiv: arxivTools
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tools',
      details: error.message 
    });
  }
});

// New endpoint for getting total tool counts
app.get('/api/tools/count', async (req, res) => {
  try {
    console.log('Fetching total tool counts...');
    
    // Get counts for each source
    const [githubCount, huggingfaceCount, arxivCount] = await Promise.all([
      AITool.countDocuments({ source: 'GitHub' }),
      AITool.countDocuments({ source: 'HuggingFace' }),
      AITool.countDocuments({ source: 'arXiv' })
    ]);

    const totalCount = githubCount + huggingfaceCount + arxivCount;
    
    console.log(`Found ${totalCount} total tools (GitHub: ${githubCount}, HuggingFace: ${huggingfaceCount}, arXiv: ${arxivCount})`);
    
    res.json({
      total: totalCount,
      bySource: {
        github: githubCount,
        huggingface: huggingfaceCount,
        arxiv: arxivCount
      }
    });
  } catch (error) {
    console.error('Error fetching tool counts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tool counts',
      details: error.message 
    });
  }
});

// Get latest daily digest
app.get('/api/digest/latest', async (req, res) => {
  try {
    const digest = await DailyDigest.findOne()
      .sort({ date: -1 })
      .limit(1);
    
    if (!digest) {
      return res.status(404).json({ error: 'No digest found' });
    }
    
    res.json(digest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch digest' });
  }
});

// Get digest by date
app.get('/api/digest/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const digest = await DailyDigest.findOne({ date });
    
    if (!digest) {
      return res.status(404).json({ error: 'Digest not found for the specified date' });
    }
    
    res.json(digest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch digest' });
  }
});

module.exports = app; 