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
const subscriptionRoutes = require('./routes/subscriptionRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://arkaiv.vercel.app', 'https://arkaiv.onrender.com']
    : ['http://localhost:5173', 'http://localhost:5176'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // 24 hours
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Log environment variables (without sensitive data)
console.log('Environment:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI ? '***' : 'not set'
});

// Consolidated MongoDB connection function
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };

    await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
    console.log('MongoDB connected successfully');

    // Set up connection event listeners
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

    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

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
app.get('/api/tools', auth, async (req, res) => {
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

// New endpoint for getting all tools without the top 6 limitation
app.get('/api/tools/all', auth, async (req, res) => {
  try {
    console.log('Fetching all tools from database...');
    
    // Fetch all tools from each source
    const [allGithubTools, allHuggingfaceTools, allArxivTools] = await Promise.all([
      AITool.find({ source: 'GitHub' }).select('name description url metrics type'),
      AITool.find({ source: 'HuggingFace' }).select('name description url metrics type'),
      AITool.find({ source: 'arXiv' }).select('name description url metrics type')
    ]);

    console.log(`Found ${allGithubTools.length} GitHub tools, ${allHuggingfaceTools.length} HuggingFace tools, and ${allArxivTools.length} arXiv tools`);

    // Add descriptions for tools that don't have them
    const addDescriptions = (tools, source) => {
      return tools.map(tool => {
        if (!tool.description || tool.description.trim() === '') {
          if (source === 'GitHub') {
            const repoName = tool.url.split('/').slice(-2).join('/');
            tool.description = `A popular GitHub repository ${repoName} focused on AI development. This repository has gained significant traction in the AI community.`;
          } else if (source === 'HuggingFace') {
            const modelName = tool.url.split('/').pop();
            const formattedName = modelName.replace(/-/g, ' ').replace(/_/g, ' ');
            tool.description = `A state-of-the-art ${formattedName} model available on HuggingFace. This model has been widely adopted by the AI community for various applications.`;
          } else if (source === 'arXiv') {
            const paperId = tool.url.split('/').pop();
            tool.description = `A groundbreaking research paper (ID: ${paperId}) published on arXiv. This paper presents significant advancements in the field of artificial intelligence.`;
          }
        }
        return tool;
      });
    };

    // Sort tools by their respective metrics and add descriptions
    const githubTools = addDescriptions(allGithubTools, 'GitHub')
      .sort((a, b) => (b.metrics?.stars || 0) - (a.metrics?.stars || 0));

    const huggingfaceTools = addDescriptions(allHuggingfaceTools, 'HuggingFace')
      .sort((a, b) => (b.metrics?.downloads || 0) - (a.metrics?.downloads || 0));

    const arxivTools = addDescriptions(allArxivTools, 'arXiv')
      .sort((a, b) => (b.metrics?.citations || 0) - (a.metrics?.citations || 0));

    console.log('Returning all tools from each source with enhanced descriptions');
    
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

// Get all digests
app.get('/api/digests', auth, async (req, res) => {
  try {
    const digests = await DailyDigest.find()
      .sort({ date: -1 });
    
    if (!digests || digests.length === 0) {
      return res.status(404).json({ error: 'No digests found' });
    }
    
    res.json(digests);
  } catch (error) {
    console.error('Error fetching digests:', error);
    res.status(500).json({ error: 'Failed to fetch digests' });
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

// Start the application
const startServer = async () => {
  const isConnected = await connectDB();
  if (!isConnected) {
    console.error('Failed to connect to MongoDB. Exiting...');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    scheduleScrapingTasks();
  });
};

// Only start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = app; 