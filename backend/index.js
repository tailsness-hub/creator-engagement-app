const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import API routes
const testRoutes = require('./api/test');
app.use('/api', testRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Creator Engagement App - Backend API',
    version: '1.0.0',
    endpoints: {
      test: '/api/test'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
