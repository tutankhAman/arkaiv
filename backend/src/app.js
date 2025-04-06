const express = require('express');
const mongoose = require('mongoose');
const { scheduleScrapingTasks } = require('./scheduler');
const DailyDigest = require('./models/DailyDigest');
const AITool = require('./models/AITool');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB connection with increased timeout
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-tools', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
  connectTimeoutMS: 30000, // 30 seconds
  maxPoolSize: 10,
  retryWrites: true,
  w: 'majority'
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if we can't connect to MongoDB
});

// Routes
app.get('/api/tools', async (req, res) => {
  try {
    const tools = await AITool.find().sort({ 'metrics.stars': -1 }).limit(100);
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tools' });
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

// Only start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Initialize scraping tasks and digest generation
    scheduleScrapingTasks();
  });
}

module.exports = app; 