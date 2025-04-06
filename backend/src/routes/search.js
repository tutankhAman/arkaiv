const express = require('express');
const router = express.Router();
const AITool = require('../models/AITool');

// Search tools
router.get('/', async (req, res) => {
  try {
    const { query, category } = req.query;
    let searchQuery = {};

    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    if (category) {
      searchQuery.category = category;
    }

    const tools = await AITool.find(searchQuery)
      .sort({ 'metrics.stars': -1 })
      .limit(50);

    res.json(tools);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

module.exports = router; 