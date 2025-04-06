const express = require('express');
const router = express.Router();
const AITool = require('../models/AITool');

// Search tools
router.get('/', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.json([]);
    }

    // Create a case-insensitive regex pattern
    const searchPattern = new RegExp(query, 'i');

    // Search across name and description fields
    const tools = await AITool.find({
      $or: [
        { name: searchPattern },
        { description: searchPattern }
      ]
    })
    .sort({ 
      'metrics.stars': -1,
      'metrics.downloads': -1,
      'metrics.citations': -1
    })
    .limit(12); // Limit to 12 results for better performance

    res.json(tools);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

module.exports = router; 