const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// Add error handling middleware
const handleErrors = (err, req, res, next) => {
  console.error('Route error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: err.message 
  });
};

router.post('/subscribe', subscriptionController.subscribe);
router.post('/unsubscribe', subscriptionController.unsubscribe);
router.get('/status', subscriptionController.checkStatus);

// Apply error handling middleware
router.use(handleErrors);

module.exports = router; 