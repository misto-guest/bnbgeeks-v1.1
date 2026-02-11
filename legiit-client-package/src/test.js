/**
 * Test Script for Legiit Automation
 * 
 * Run this to verify the automation is working correctly
 * Usage: node src/test.js
 */

require('dotenv').config();
const LegiitPurchaser = require('./legiit-purchaser');

// Test configuration
const testDetails = {
  domain: 'test-business.com',
  businessName: 'Test Business LLC',
  address: '123 Test Street, Test City, TS 12345'
};

async function runTests() {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   Legiit Automation Test Suite              ║');
  console.log('╚══════════════════════════════════════════════╝\n');
  
  // Check environment
  console.log('🔍 Checking environment...');
  if (!process.env.LEGIIT_EMAIL || !process.env.LEGIIT_PASSWORD) {
    console.error('❌ FAIL: LEGIIT_EMAIL and LEGIIT_PASSWORD must be set in .env file');
    process.exit(1);
  }
  console.log('✅ Environment variables configured\n');
  
  const purchaser = new LegiitPurchaser({
    email: process.env.LEGIIT_EMAIL,
    password: process.env.LEGIIT_PASSWORD,
    headless: process.env.HEADLESS !== 'false',
    timeout: parseInt(process.env.TIMEOUT) || 60000
  });
  
  try {
    // Test 1: Browser initialization
    console.log('Test 1: Browser Initialization');
    console.log('─────────────────────────────────────');
    await purchaser.init();
    console.log('✅ PASS: Browser initialized successfully\n');
    
    // Test 2: Login
    console.log('Test 2: Login to Legiit');
    console.log('─────────────────────────────────────');
    const loginSuccess = await purchaser.login();
    if (loginSuccess) {
      console.log('✅ PASS: Login successful\n');
    } else {
      throw new Error('Login failed');
    }
    
    // Test 3: Navigate to service
    console.log('Test 3: Navigate to Service Page');
    console.log('─────────────────────────────────────');
    await purchaser.navigateToService();
    console.log('✅ PASS: Service page loaded\n');
    
    // Test 4: Select package
    console.log('Test 4: Select Standard Package');
    console.log('─────────────────────────────────────');
    await purchaser.selectPackage('Standard');
    console.log('✅ PASS: Package selected\n');
    
    // Test 5: Fill business details
    console.log('Test 5: Fill Business Details');
    console.log('─────────────────────────────────────');
    await purchaser.fillBusinessDetails(testDetails);
    console.log('✅ PASS: Business details filled\n');
    
    // Test 6: Complete purchase (commented out to avoid actual purchase during testing)
    console.log('Test 6: Complete Purchase');
    console.log('─────────────────────────────────────');
    console.log('⚠️  SKIPPED: Purchase completion (to avoid actual charge)');
    console.log('   To enable, uncomment the purchase call below\n');
    
    // Uncomment to run actual purchase test:
    // const purchaseResult = await purchaser.completePurchase();
    // console.log('✅ PASS: Purchase completed');
    // console.log(`   Order ID: ${purchaseResult.orderId}\n`);
    
    // Summary
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║   Test Results                               ║');
    console.log('╠══════════════════════════════════════════════╣');
    console.log('║   ✅ Browser Initialization                  ║');
    console.log('║   ✅ Login                                   ║');
    console.log('║   ✅ Navigate to Service                     ║');
    console.log('║   ✅ Select Package                          ║');
    console.log('║   ✅ Fill Business Details                   ║');
    console.log('║   ⚠️  Complete Purchase (skipped)            ║');
    console.log('╚══════════════════════════════════════════════╝\n');
    
    console.log('✅ All tests passed! Automation is ready.\n');
    
  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await purchaser.cleanup();
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
