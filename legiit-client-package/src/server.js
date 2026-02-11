/**
 * Legiit Automation API Server
 * Express.js wrapper for Puppeteer automation
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const LegiitPurchaser = require('./legiit-purchaser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Legiit Automation API',
    version: '1.0.0'
  });
});

// Web panel homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'Legiit Automation API',
    version: '1.0.0',
    description: 'Automated purchasing of Legiit services via Puppeteer',
    endpoints: {
      'GET /': 'Web panel interface',
      'GET /health': 'Health check',
      'GET /api/docs': 'API documentation',
      'POST /api/purchase': 'Purchase a Legiit service',
      'POST /api/purchase/standard': 'Quick purchase with Standard package'
    },
    documentation: 'https://github.com/yourusername/legiit-automation'
  });
});

/**
 * Main purchase endpoint
 * POST /api/purchase
 * 
 * Body:
 * {
 *   "serviceUrl": "https://legiit.com/...",
 *   "package": "Standard",
 *   "details": {
 *     "domain": "example.com",
 *     "businessName": "My Business",
 *     "address": "123 Main St, City, State, ZIP"
 *   }
 * }
 */
app.post('/api/purchase', async (req, res) => {
  const requestId = Date.now().toString(36);
  console.log(`\n📦 [${requestId}] New purchase request received`);
  
  try {
    // Validate request body
    const { serviceUrl, package: packageName, details } = req.body;
    
    if (!details) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: details',
        requestId
      });
    }
    
    const { domain, businessName, address } = details;
    
    // Validate required fields
    if (!domain || !businessName || !address) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields in details: domain, businessName, address',
        requestId,
        received: details
      });
    }
    
    console.log(`  Domain: ${domain}`);
    console.log(`  Business: ${businessName}`);
    console.log(`  Address: ${address}`);
    console.log(`  Package: ${packageName || 'Standard'}`);
    console.log(`  Service URL: ${serviceUrl || 'default'}`);
    
    // Create purchaser instance
    const purchaser = new LegiitPurchaser({
      email: process.env.LEGIIT_EMAIL,
      password: process.env.LEGIIT_PASSWORD,
      serviceUrl: serviceUrl,
      headless: process.env.HEADLESS !== 'false',
      timeout: parseInt(process.env.TIMEOUT) || 60000
    });
    
    // Execute purchase
    console.log(`⏳ [${requestId}] Starting purchase flow...`);
    const result = await purchaser.purchase(details);
    
    result.requestId = requestId;
    
    if (result.success) {
      console.log(`✅ [${requestId}] Purchase successful! Order ID: ${result.orderId}`);
      res.json(result);
    } else {
      console.error(`❌ [${requestId}] Purchase failed: ${result.error}`);
      res.status(500).json(result);
    }
    
  } catch (error) {
    console.error(`💥 [${requestId}] Unexpected error:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      requestId
    });
  }
});

/**
 * Quick purchase endpoint for Standard package
 * POST /api/purchase/standard
 * 
 * Simplified endpoint that assumes Standard package
 * 
 * Body:
 * {
 *   "domain": "example.com",
 *   "businessName": "My Business",
 *   "address": "123 Main St, City, State, ZIP",
 *   "serviceUrl": "https://legiit.com/..." // optional
 * }
 */
app.post('/api/purchase/standard', async (req, res) => {
  const requestId = Date.now().toString(36);
  console.log(`\n📦 [${requestId}] Quick Standard package purchase`);
  
  try {
    const { domain, businessName, address, serviceUrl } = req.body;
    
    // Quick validation
    if (!domain || !businessName || !address) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: domain, businessName, address',
        requestId,
        hint: 'Send { domain, businessName, address } in request body'
      });
    }
    
    // Transform to standard format
    const standardRequest = {
      serviceUrl: serviceUrl || 'https://legiit.com/Toplocalcitations/350-usa-local-citations-listings-and-directories-1679073072',
      package: 'Standard',
      details: {
        domain,
        businessName,
        address
      }
    };
    
    // Delegate to main purchase endpoint logic
    const purchaser = new LegiitPurchaser({
      email: process.env.LEGIIT_EMAIL,
      password: process.env.LEGIIT_PASSWORD,
      serviceUrl: standardRequest.serviceUrl,
      headless: process.env.HEADLESS !== 'false',
      timeout: parseInt(process.env.TIMEOUT) || 60000
    });
    
    console.log(`⏳ [${requestId}] Starting purchase...`);
    const result = await purchaser.purchase(standardRequest.details);
    
    result.requestId = requestId;
    
    if (result.success) {
      console.log(`✅ [${requestId}] Purchase successful!`);
      res.json(result);
    } else {
      console.error(`❌ [${requestId}] Purchase failed`);
      res.status(500).json(result);
    }
    
  } catch (error) {
    console.error(`💥 [${requestId}] Error:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      requestId
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /api/purchase',
      'POST /api/purchase/standard'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   Legiit Automation API Server             ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║   Running on port ${PORT}                       ║`);
  console.log('║                                              ║');
  console.log('║   Endpoints:                                 ║');
  console.log(`║   → http://localhost:${PORT}/                 ║`);
  console.log(`║   → http://localhost:${PORT}/health          ║`);
  console.log(`║   → http://localhost:${PORT}/api/purchase    ║`);
  console.log('║                                              ║');
  console.log('║   Press Ctrl+C to stop                       ║');
  console.log('╚══════════════════════════════════════════════╝\n');
  
  // Check environment variables
  if (!process.env.LEGIIT_EMAIL || !process.env.LEGIIT_PASSWORD) {
    console.warn('⚠️  WARNING: LEGIIT_EMAIL or LEGIIT_PASSWORD not set in .env file!');
    console.warn('⚠️  Please configure your credentials before making API requests.\n');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
