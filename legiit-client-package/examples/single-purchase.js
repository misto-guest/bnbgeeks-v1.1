/**
 * Single Purchase Example
 * 
 * This script demonstrates how to purchase a single citation
 * using the Legiit automation tool.
 */

const LegiitPurchaser = require('../src/legiit-purchaser');
require('dotenv').config();

async function singlePurchase() {
  // Initialize purchaser with credentials from .env
  const purchaser = new LegiitPurchaser({
    email: process.env.LEGIIT_EMAIL,
    password: process.env.LEGIIT_PASSWORD,
    gigUrl: process.env.LEGIIT_GIG_URL,
    headless: false, // Show browser for verification
    slowMo: 100 // Slow down for human-like behavior
  });

  try {
    console.log('🚀 Starting single citation purchase...\n');

    // Execute purchase
    const result = await purchaser.purchase({
      domain: 'example-business.com',
      businessName: 'Example Business LLC',
      address: '123 Main Street, Suite 100, New York, NY 10001',
      package: 'standard' // Options: basic, standard, premium
    });

    console.log('\n✅ Purchase successful!');
    console.log('Order ID:', result.orderId);
    console.log('Timestamp:', result.timestamp);
    console.log('Screenshot:', result.screenshot);

  } catch (error) {
    console.error('\n❌ Purchase failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    // Always close browser
    await purchaser.close();
  }
}

// Run the purchase
singlePurchase();
