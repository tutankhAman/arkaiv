require('dotenv').config();
const subscriptionController = require('../src/controllers/subscriptionController');
const cron = require('node-cron');

// Schedule the digest to be sent at 8 AM every day
cron.schedule('0 8 * * *', async () => {
  console.log('Sending daily digest...');
  await subscriptionController.sendDailyDigest();
  console.log('Daily digest sent successfully');
});

console.log('Daily digest scheduler started. Will send digests at 8 AM every day.'); 