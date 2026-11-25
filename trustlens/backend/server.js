const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const checkRoutes = require('./routes/checkRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Allow modern frontend assets and inline svg
}));
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// API Routes
app.use('/api', checkRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'TrustLens',
    version: '1.0.0',
    mode: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static build if present
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(frontendDist, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      res.json({
        product: 'TrustLens Backend API',
        message: 'Frontend is running on Vite dev server or run npm run build to serve static UI here.',
        endpoints: [
          'POST /api/check/auto',
          'POST /api/check/url',
          'POST /api/check/app',
          'POST /api/check/qr',
          'POST /api/check/voice',
          'POST /api/check/payment',
          'POST /api/check/call',
          'POST /api/check/message',
          'GET  /api/demos',
          'GET  /api/intelligence',
          'GET  /api/adapters',
          'GET  /api/health'
        ]
      });
    }
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`TrustLens server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
