const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:19006', // Expo default
  credentials: true // Allow cookies/sessions
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import API routes
const testRoutes = require('./api/test');
const discordRoutes = require('./api/discord');
const instagramRoutes = require('./api/instagram');
const twitterRoutes = require('./api/twitter');

app.use('/api', testRoutes);
app.use('/', discordRoutes);
app.use('/', instagramRoutes);
app.use('/', twitterRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Creator Engagement App - Backend API',
    version: '1.0.0',
    endpoints: {
      test: '/api/test',
      discord_auth: '/auth/discord',
      discord_status: '/auth/discord/status',
      discord_webhook_test: '/auth/discord/test-webhook',
      blast_off_discord: '/blast-off/discord',
      instagram_auth: '/auth/instagram',
      instagram_status: '/auth/instagram/status',
      instagram_test_post: '/auth/instagram/test-post',
      blast_off_instagram: '/blast-off/instagram',
      twitter_auth: '/auth/twitter/login',
      twitter_status: '/auth/twitter/status',
      twitter_test_post: '/auth/twitter/test-post',
      blast_off_twitter: '/blast-off/twitter'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
