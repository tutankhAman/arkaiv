const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { scheduleScrapingTasks } = require('./scheduler');
const DailyDigest = require('./models/DailyDigest');
const AITool = require('./models/AITool');
const authRoutes = require('./routes/auth');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const searchRoutes = require('./routes/search');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(connectDB, 5000);
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

  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Start MongoDB connection
connectDB();

// Auth middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);

// Protected routes
app.get('/api/tools', auth, async (req, res) => {
  try {
    const tools = await AITool.find().sort({ 'metrics.stars': -1 }).limit(100);
    res.json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ error: 'Failed to fetch tools' });
  }
});

// Get latest daily digest
app.get('/api/digest/latest', auth, async (req, res) => {
  try {
    const digest = await DailyDigest.findOne()
      .sort({ date: -1 })
      .limit(1);
    
    if (!digest) {
      return res.status(404).json({ error: 'No digest found' });
    }
    
    res.json(digest);
  } catch (error) {
    console.error('Error fetching latest digest:', error);
    res.status(500).json({ error: 'Failed to fetch digest' });
  }
});

// Get digest by date
app.get('/api/digest/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const digest = await DailyDigest.findOne({ date });
    
    if (!digest) {
      return res.status(404).json({ error: 'Digest not found for the specified date' });
    }
    
    res.json(digest);
  } catch (error) {
    console.error('Error fetching digest by date:', error);
    res.status(500).json({ error: 'Failed to fetch digest' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      scheduleScrapingTasks();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Only start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app; 