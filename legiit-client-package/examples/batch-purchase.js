/**
 * Batch Purchase Example
 * 
 * This script demonstrates how to process multiple citations
 * from a CSV file or array of businesses.
 */

const LegiitPurchaser = require('../src/legiit-purchaser');
require('dotenv').config();

// Sample business data (replace with your data)
const businesses = [
  {
    domain: 'restaurant1.com',
    businessName: 'Downtown Restaurant LLC',
    address: '123 Main St, New York, NY 10001'
  },
  {
    domain: 'plumbing-service.com',
    businessName: 'Smith & Sons Plumbing',
    address: '456 Oak Ave, Los Angeles, CA 90001'
  },
  {
    domain: 'dental-care.net',
    businessName: 'Smile Dental Care',
    address: '789 Pine Rd, Chicago, IL 60601'
  }
];

async function batchPurchase() {
  // Initialize purchaser
  const purchaser = new LegiitPurchaser({
    email: process.env.LEGIIT_EMAIL,
    password: process.env.LEGIIT_PASSWORD,
    gigUrl: process.env.LEGIIT_GIG_URL,
    headless: false,
    slowMo: 100
  });

  console.log(`🚀 Starting batch purchase for ${businesses.length} businesses...\n`);

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < businesses.length; i++) {
    const business = businesses[i];
    
    console.log(`\n[${i + 1}/${businesses.length}] Processing: ${business.businessName}`);
    console.log(`Domain: ${business.domain}`);

    try {
      // Purchase citation
      const result = await purchaser.purchase({
        domain: business.domain,
        businessName: business.businessName,
        address: business.address,
        package: 'standard'
      });

      successCount++;
      
      console.log(`✅ SUCCESS - Order: ${result.orderId}`);
      
      results.push({
        ...business,
        status: 'success',
        orderId: result.orderId,
        timestamp: result.timestamp,
        screenshot: result.screenshot
      });

      // Wait between purchases (avoid detection)
      if (i < businesses.length - 1) {
        const delay = Math.floor(Math.random() * 5000) + 5000; // 5-10 seconds
        console.log(`⏳ Waiting ${delay/1000}s before next purchase...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

    } catch (error) {
      failCount++;
      
      console.error(`❌ FAILED - ${error.message}`);
      
      results.push({
        ...business,
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Close browser
  await purchaser.close();

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('BATCH PURCHASE SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Processed: ${businesses.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Success Rate: ${((successCount / businesses.length) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));

  // Save results to file
  const fs = require('fs');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const resultsFile = `results/batch-results-${timestamp}.json`;
  
  // Ensure results directory exists
  if (!fs.existsSync('results')) {
    fs.mkdirSync('results');
  }
  
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`\n📄 Results saved to: ${resultsFile}`);
}

// Run batch purchase
batchPurchase().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
