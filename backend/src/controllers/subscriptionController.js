const Subscription = require('../models/subscription');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
    console.error('Email Configuration:', {
      user: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASSWORD,
      errorCode: error.code,
      errorMessage: error.message,
      response: error.response
    });
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

const sendEmail = async (mailOptions) => {
  try {
    // Verify SMTP connection before sending
    await transporter.verify();
    
    // Send email with retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', {
          messageId: info.messageId,
          to: mailOptions.to,
          subject: mailOptions.subject,
          response: info.response
        });
        return true;
      } catch (error) {
        retries--;
        if (retries === 0) {
          console.error('Email sending failed after all retries:', {
            error: error.message,
            code: error.code,
            response: error.response,
            to: mailOptions.to,
            stack: error.stack
          });
          throw error;
        }
        console.log(`Retrying email send (${retries} attempts left)...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  } catch (error) {
    console.error('Email sending failed:', {
      error: error.message,
      code: error.code,
      response: error.response,
      to: mailOptions.to,
      stack: error.stack
    });
    return false;
  }
};

exports.subscribe = async (req, res) => {
  try {
    console.log('Subscription request received:', req.body);
    
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already subscribed
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      console.log('User already subscribed:', email);
      return res.status(400).json({ message: 'You are already subscribed to our AI digest' });
    }

    // Create new subscription
    const subscription = new Subscription({ email });
    await subscription.save();
    console.log('New subscription created:', email);

    // Send confirmation email
    const mailOptions = {
      from: 'work.arkaiv@gmail.com',
      to: email,
      subject: 'Subscription Confirmation - arkaiv AI Digest',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5; text-align: center;">Welcome to arkaiv AI Digest!</h1>
          <p>Hello ${user.username},</p>
          <p>Thank you for subscribing to our daily AI digest service. We're excited to have you on board!</p>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1F2937;">What to expect:</h2>
            <ul style="list-style-type: none; padding: 0;">
              <li style="margin: 10px 0;">📧 Daily digest of new AI tools and their summaries</li>
              <li style="margin: 10px 0;">📚 Author digest with latest research updates</li>
              <li style="margin: 10px 0;">📊 Weekly roundup of trending AI projects</li>
            </ul>
          </div>

          <p>Based on your preferences, we'll focus on: <strong>${user.preferences?.join(', ') || 'all AI topics'}</strong></p>
          
          <p>Your first digest will arrive tomorrow at 8:00 AM.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="font-size: 14px; color: #6B7280;">
              If you wish to unsubscribe at any time, please click the unsubscribe link in any of our emails.
            </p>
          </div>
        </div>
      `
    };

    const emailSent = await sendEmail(mailOptions);
    if (!emailSent) {
      console.error('Failed to send confirmation email to:', email);
      // Don't fail the subscription, but log the error
    }

    res.status(201).json({ 
      message: 'Successfully subscribed to AI digest',
      emailSent: emailSent
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ 
      message: 'Error subscribing to AI digest',
      error: error.message 
    });
  }
};

exports.checkStatus = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const subscription = await Subscription.findOne({ email });
    res.json({ isSubscribed: !!subscription });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ message: 'Error checking subscription status' });
  }
};

exports.sendDailyDigest = async () => {
  try {
    const subscriptions = await Subscription.find({ isSubscribed: true });
    
    for (const subscription of subscriptions) {
      const user = await User.findOne({ email: subscription.email });
      if (!user) continue;

      const newTools = await getNewTools(); // You'll need to implement this function
      const filteredTools = filterToolsByPreferences(newTools, user.preferences); // You'll need to implement this function

      await transporter.sendMail({
        from: 'work.arkaiv@gmail.com',
        to: subscription.email,
        subject: 'Your Daily AI Digest',
        html: generateDigestHTML(filteredTools, user.username) // You'll need to implement this function
      });

      // Update last digest sent time
      subscription.lastDigestSent = new Date();
      await subscription.save();
    }
  } catch (error) {
    console.error('Error sending daily digest:', error);
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    console.log('Unsubscription request received:', req.body);
    
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if subscription exists
    const subscription = await Subscription.findOne({ email });
    if (!subscription) {
      console.log('No subscription found:', email);
      return res.status(404).json({ message: 'No active subscription found' });
    }

    // Delete the subscription
    await Subscription.deleteOne({ email });
    console.log('Subscription deleted:', email);

    // Send confirmation email
    try {
      console.log('Sending unsubscription confirmation email to:', email);
      await transporter.sendMail({
        from: 'work.arkaiv@gmail.com',
        to: email,
        subject: 'Unsubscribed from arkaiv AI Digest',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5; text-align: center;">You've been unsubscribed</h1>
            <p>Hello,</p>
            <p>You have successfully unsubscribed from arkaiv's daily AI digest service.</p>
            
            <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p>We're sorry to see you go! If you change your mind, you can always resubscribe through your dashboard.</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <p style="font-size: 14px; color: #6B7280;">
                If you didn't request this unsubscription, please contact our support team.
              </p>
            </div>
          </div>
        `
      });
      console.log('Unsubscription confirmation email sent successfully to:', email);
    } catch (emailError) {
      console.error('Error sending unsubscription confirmation email:', emailError);
      // Don't fail the unsubscription if email fails
    }

    res.status(200).json({ message: 'Successfully unsubscribed from AI digest' });
  } catch (error) {
    console.error('Unsubscription error:', error);
    res.status(500).json({ 
      message: 'Error unsubscribing from AI digest',
      error: error.message 
    });
  }
}; 