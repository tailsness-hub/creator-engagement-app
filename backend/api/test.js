const express = require('express');
const router = express.Router();

/**
 * Test endpoint to verify API is working
 * GET /api/test
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working correctly!',
    timestamp: new Date().toISOString()
  });
});

/**
 * Test POST endpoint
 * POST /api/test
 */
router.post('/test', (req, res) => {
  const { message } = req.body;
  res.json({
    success: true,
    echo: message || 'No message provided',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
