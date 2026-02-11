/**
 * Test script to verify Dutch Portal Search setup
 * Tests first 3 portals only for quick validation
 */

const { main } = require('./search');

async function test() {
    console.log('Running Dutch Portal Search - Test Mode (3 sites only)');
    console.log('='.repeat(60));
    
    // Temporarily override DUTCH_PORTALS to only test 3 sites
    const DUTCH_PORTALS = [
        { domain: 'marktplaats.nl', searchUrl: 'https://www.marktplaats.nl/q/mrkortingscode.nl' },
        { domain: 'nu.nl', searchUrl: 'https://www.nu.nl/zoeken?q=mrkortingscode.nl' },
        { domain: 'nos.nl', searchUrl: 'https://www.nos.nl/zoeken?q=mrkortingscode.nl' },
    ];
    
    // Mock the processPortal function for testing
    const puppeteer = require('puppeteer-extra');
    const StealthPlugin = require('puppeteer-extra-plugin-stealth');
    puppeteer.use(StealthPlugin());
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('Browser launched successfully ✓');
    
    try {
        for (const portal of DUTCH_PORTALS) {
            console.log(`\nTesting: ${portal.domain}`);
            console.log(`URL: ${portal.searchUrl}`);
            
            const page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 });
            
            try {
                await page.goto(portal.searchUrl, { 
                    waitUntil: 'domcontentloaded',
                    timeout: 15000 
                });
                
                console.log(`✓ Successfully navigated to ${portal.domain}`);
                
                // Take test screenshot
                const screenshotPath = `results/screenshots/test-${portal.domain}.png`;
                await page.screenshot({ path: screenshotPath });
                console.log(`✓ Screenshot saved: ${screenshotPath}`);
                
            } catch (e) {
                console.log(`✗ Error: ${e.message}`);
            }
            
            await page.close();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('Test complete! Check results/screenshots/ for outputs.');
        console.log('If all 3 tests passed, run the full automation:');
        console.log('  npm start');
        console.log('='.repeat(60));
        
    } catch (e) {
        console.error('Test failed:', e);
    } finally {
        await browser.close();
    }
}

if (require.main === module) {
    test().catch(console.error);
}

module.exports = { test };
