/**
 * Node.js Example - Legiit Automation API
 * 
 * Install dependencies:
 * npm install node-fetch
 * 
 * Run:
 * node examples/nodejs-example.js
 */

const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

/**
 * Purchase a Legiit service
 */
async function purchaseService(details) {
  try {
    console.log('🛒 Purchasing Legiit service...');
    console.log('   Domain:', details.domain);
    console.log('   Business:', details.businessName);
    
    const response = await fetch(`${API_BASE_URL}/api/purchase/standard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(details)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('\n✅ Purchase successful!');
      console.log('   Order ID:', result.orderId);
      console.log('   Request ID:', result.requestId);
      console.log('   Steps completed:', result.steps.length);
    } else {
      console.error('\n❌ Purchase failed!');
      console.error('   Error:', result.error);
      console.error('   Request ID:', result.requestId);
    }
    
    return result;
    
  } catch (error) {
    console.error('\n💥 Request failed:', error.message);
    throw error;
  }
}

/**
 * Purchase with custom service URL
 */
async function purchaseCustomService(serviceUrl, details) {
  try {
    console.log('🛒 Purchasing custom service...');
    console.log('   Service URL:', serviceUrl);
    
    const response = await fetch(`${API_BASE_URL}/api/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        serviceUrl: serviceUrl,
        package: 'Standard',
        details: details
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('\n✅ Purchase successful!');
      console.log('   Order ID:', result.orderId);
    } else {
      console.error('\n❌ Purchase failed!');
      console.error('   Error:', result.error);
    }
    
    return result;
    
  } catch (error) {
    console.error('\n💥 Request failed:', error.message);
    throw error;
  }
}

/**
 * Check API health
 */
async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const health = await response.json();
    
    console.log('🏥 API Health:', health.status);
    return health;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    throw error;
  }
}

// Main execution
async function main() {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   Legiit Automation API - Node.js Example   ║');
  console.log('╚══════════════════════════════════════════════╝\n');
  
  // Check health first
  await checkHealth();
  
  // Example 1: Quick purchase (Standard package)
  console.log('\n--- Example 1: Quick Purchase ---\n');
  await purchaseService({
    domain: 'mybusiness.com',
    businessName: 'My Business LLC',
    address: '123 Main St, City, State 12345'
  });
  
  // Example 2: Custom service URL
  // console.log('\n--- Example 2: Custom Service URL ---\n');
  // await purchaseCustomService(
  //   'https://legiit.com/Toplocalcitations/350-usa-local-citations-listings-and-directories-1679073072',
  //   {
  //     domain: 'another-business.com',
  //     businessName: 'Another Business Inc',
  //     address: '456 Oak Ave, Town, State 67890'
  //   }
  // );
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('\nFatal error:', error);
    process.exit(1);
  });
}

module.exports = { purchaseService, purchaseCustomService, checkHealth };
