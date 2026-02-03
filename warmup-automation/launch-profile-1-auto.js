/**
 * Launch Profile 1 and Run Warmup (No Prompt)
 */

const AdsPowerClient = require('./adspower-client');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const API_KEY = '746feb8ab409fbb27a0377a864279e6c000f879a7a0e5329';
const PROFILE_ID = 'k12am9a2';
const SCREENSHOT_DIR = './screenshots/profile-1-warmup';

async function launchAndWarmup() {
    console.log('🚀 AdsPower Profile 1 Warmup Test\n');
    console.log('====================================\n');

    const client = new AdsPowerClient(API_KEY);

    // Step 1: Test Connection
    console.log('1️⃣ Testing AdsPower API connection...');
    try {
        const connection = await client.testConnection();
        if (!connection.success) {
            console.log('❌ Cannot connect to AdsPower');
            console.log(`   Error: ${connection.message}`);
            return;
        }
        console.log('✅ Connected to AdsPower API');
    } catch (error) {
        console.log('❌ Connection failed:', error.message);
        return;
    }

    // Step 2: Get Profile Info
    console.log('\n2️⃣ Getting Profile 1 information...');
    let profileInfo;
    try {
        profileInfo = await client.getProfileInfo(PROFILE_ID);
        console.log(`✅ Profile found: ${profileInfo.name || 'Unnamed'}`);
        console.log(`   User ID: ${profileInfo.user_id}`);
        console.log(`   Browser: ${profileInfo.browser_type || 'Unknown'}`);
        console.log(`   OS: ${profileInfo.os || 'Unknown'}`);
    } catch (error) {
        console.log('❌ Error getting profile info:', error.message);
        return;
    }

    // Step 3: Launch Profile
    console.log('\n3️⃣ Launching Profile 1...');
    let launchResult;
    try {
        launchResult = await client.startProfile(PROFILE_ID);

        if (!launchResult.ws || !launchResult.ws.puppeteer) {
            console.log('❌ Failed to launch profile');
            console.log('   Response:', JSON.stringify(launchResult, null, 2));
            return;
        }

        console.log('✅ Profile launched successfully!');
        console.log(`   WebSocket: ${launchResult.ws.puppeteer}`);
        console.log(`   Debug Port: ${launchResult.debug_port}`);
    } catch (error) {
        console.log('❌ Error launching profile:', error.message);
        return;
    }

    // Step 4: Create screenshot directory
    if (!fs.existsSync(SCREENSHOT_DIR)) {
        fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
    console.log(`\n📸 Screenshots will be saved to: ${SCREENSHOT_DIR}`);

    // Step 5: Connect Puppeteer and Run Warmup
    console.log('\n4️⃣ Connecting to browser and running warmup...\n');
    console.log('================================\n');

    try {
        const browser = await puppeteer.connect({
            browserWSEndpoint: launchResult.ws.puppeteer,
            defaultViewport: null
        });

        const pages = await browser.pages();
        const page = pages[0] || await browser.newPage();

        console.log('✅ Connected to browser\n');

        // Check if Gmail is open or logged in
        console.log('🔍 Checking Gmail login status...\n');

        try {
            await page.goto('https://mail.google.com', { waitUntil: 'networkidle2', timeout: 15000 });
            await page.waitForTimeout(3000);

            const url = page.url();
            console.log(`   Current URL: ${url}`);

            if (url.includes('mail.google.com') && !url.includes('accounts.google.com')) {
                console.log('✅ Gmail appears to be logged in!\n');
            } else {
                console.log('⚠️  Gmail may not be logged in\n');
            }
        } catch (error) {
            console.log('⚠️  Could not verify Gmail status:', error.message, '\n');
        }

        // Take initial screenshot
        const initialScreenshot = path.join(SCREENSHOT_DIR, `initial_${Date.now()}.png`);
        await page.screenshot({ path: initialScreenshot, fullPage: true });
        console.log(`📸 Initial screenshot saved\n`);

        // Run warmup activities
        console.log('🎯 Starting warmup activities...\n');
        await runWarmupActivities(page, SCREENSHOT_DIR);

        // Take final screenshot
        const finalScreenshot = path.join(SCREENSHOT_DIR, `final_${Date.now()}.png`);
        await page.screenshot({ path: finalScreenshot, fullPage: true });
        console.log(`\n📸 Final screenshot saved\n`);

        console.log('================================');
        console.log('✅ Warmup completed!');
        console.log('\n📊 Summary:');
        console.log(`   - Screenshots saved to: ${SCREENSHOT_DIR}`);
        console.log(`   - Profile 1 is still active in AdsPower`);
        console.log(`   - Browser window should be visible`);

        // Don't close browser - keep it open for user to see
        console.log('\n💡 Browser stays open - check AdsPower to see the warmup results!\n');

    } catch (error) {
        console.log('\n❌ Error during warmup:', error.message);
        console.log(error.stack);
    }
}

async function runWarmupActivities(page, screenshotDir) {
    const activities = [
        {
            name: 'Gmail Check',
            action: async () => {
                console.log('📧 Checking Gmail...');
                await page.goto('https://mail.google.com', { waitUntil: 'networkidle2', timeout: 15000 });
                await page.waitForTimeout(3000);
            }
        },
        {
            name: 'Google Search',
            action: async () => {
                console.log('🔍 Performing Google search...');
                await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });
                const searchBox = await page.$('textarea[name="q"]') || await page.$('input[name="q"]');
                if (searchBox) {
                    await searchBox.click();
                    await searchBox.type('latest technology news');
                    await page.keyboard.press('Enter');
                    await page.waitForTimeout(5000);
                }
            }
        },
        {
            name: 'Dutch News Site',
            action: async () => {
                console.log('🇳🇱 Visiting Dutch news site (nu.nl)...');
                await page.goto('https://www.nu.nl', { waitUntil: 'networkidle2', timeout: 15000 });
                await page.waitForTimeout(5000);
            }
        },
        {
            name: 'Tech Site',
            action: async () => {
                console.log('💻 Visiting tech site (tweakers.net)...');
                await page.goto('https://tweakers.net', { waitUntil: 'networkidle2', timeout: 15000 });
                await page.waitForTimeout(5000);
            }
        }
    ];

    let screenshotCount = 0;

    for (const activity of activities) {
        try {
            console.log(`\n${activity.name}`);
            console.log('─'.repeat(50));
            await activity.action();

            // Take screenshot after each activity
            screenshotCount++;
            const screenshotPath = path.join(screenshotDir, `activity_${screenshotCount}_${Date.now()}.png`);
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`📸 Screenshot ${screenshotCount} saved`);

            // Random pause
            const pauseTime = Math.floor(Math.random() * 3000) + 2000;
            console.log(`⏸️  Pausing for ${pauseTime}ms...\n`);
            await page.waitForTimeout(pauseTime);

        } catch (error) {
            console.log(`⚠️  Activity failed: ${error.message}\n`);
        }
    }

    console.log('✅ All warmup activities completed\n');
}

// Run the script automatically
launchAndWarmup().catch(error => {
    console.error('💥 Fatal Error:', error.message);
    process.exit(1);
});
