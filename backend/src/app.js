const express = require('express');
const mongoose = require('mongoose');
const scheduleScrapingTasks = require('./scheduler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-tools', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/tools', async (req, res) => {
  try {
    const tools = await AITool.find().sort({ 'metrics.stars': -1 }).limit(100);
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tools' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Initialize scraping tasks
  scheduleScrapingTasks();
}); 