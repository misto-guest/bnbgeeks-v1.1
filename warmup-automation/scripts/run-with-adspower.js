import puppeteer from 'puppeteer';
import axios from 'axios';
import readline from 'readline';
import { setTimeout } from 'timers/promises';
import UserManager from '../lib/user-manager.js';
import PersonaManager from '../lib/persona-manager.js';
import PersonaWarmupEngine from '../lib/persona-warmup-engine.js';

// AdsPower configuration
const ADSPOWER_CONFIG = {
  apiUrl: process.env.ADSPOWER_API_URL || 'http://127.0.0.1:50325',
  apiKey: process.env.ADSPOWER_API_KEY || '',
  closeAfterRun: true,
  screenshots: {
    enabled: true,
    interval: 30000,
    directory: './screenshots/adspower'
  }
};

// AdsPower API Client
class AdsPowerClient {
  constructor(apiUrl, apiKey) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async getProfiles() {
    try {
      const response = await axios.get(`${this.apiUrl}/api/v1/user/list`, {
        headers: { 'Authorization': this.apiKey },
        timeout: 10000
      });
      
      if (response.data.code !== 0) {
        throw new Error(`AdsPower API Error: ${response.data.msg}`);
      }
      
      return response.data.data.data_list;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to AdsPower. Make sure AdsPower is running on ' + this.apiUrl);
      }
      throw error;
    }
  }

  async openProfile(profileId) {
    console.log(`🔐 Opening AdsPower profile: ${profileId}`);
    
    try {
      const response = await axios.post(`${this.apiUrl}/api/v1/user/open`, {
        user_id: profileId
      }, {
        headers: { 'Authorization': this.apiKey },
        timeout: 30000
      });
      
      if (response.data.code !== 0) {
        throw new Error(`Failed to open profile: ${response.data.msg}`);
      }
      
      const wsUrl = response.data.data.ws.puppeteer;
      const profileName = response.data.data.user_name;
      
      console.log(`✅ Profile opened: "${profileName}"`);
      console.log(`🔗 WebSocket URL obtained`);
      
      return wsUrl;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to AdsPower. Make sure AdsPower is running.');
      }
      throw error;
    }
  }

  async closeProfile(profileId) {
    console.log(`🔒 Closing AdsPower profile: ${profileId}`);
    
    try {
      const response = await axios.post(`${this.apiUrl}/api/v1/user/close`, {
        user_id: profileId
      }, {
        headers: { 'Authorization': this.apiKey },
        timeout: 10000
      });
      
      if (response.data.code !== 0) {
        console.log(`⚠️  Warning: ${response.data.msg}`);
        return;
      }
      
      console.log('✅ Profile closed');
    } catch (error) {
      console.log(`⚠️  Failed to close profile: ${error.message}`);
    }
  }

  async getProfileStatus(profileId) {
    try {
      const response = await axios.get(`${this.apiUrl}/api/v1/user/status`, {
        headers: { 'Authorization': this.apiKey },
        params: { user_id: profileId },
        timeout: 10000
      });
      
      if (response.data.code !== 0) {
        throw new Error(`Failed to get status: ${response.data.msg}`);
      }
      
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to get profile status: ${error.message}`);
    }
  }
}

// Run warmup on AdsPower profile
async function runWarmupOnAdsPower(profileId, userId) {
  let browser = null;
  let screenshotTimer = null;
  
  try {
    console.log('\n🚀 Starting AdsPower Warmup');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Initialize AdsPower client
    const adspower = new AdsPowerClient(
      ADSPOWER_CONFIG.apiUrl,
      ADSPOWER_CONFIG.apiKey
    );

    // Open AdsPower profile
    const wsUrl = await adspower.openProfile(profileId);
    
    // Wait for profile to fully load
    console.log('⏳ Waiting for profile to fully load...');
    await setTimeout(3000);
    
    // Connect Puppeteer to AdsPower profile
    console.log('🤝 Connecting Puppeteer to AdsPower profile...');
    
    browser = await puppeteer.connect({
      browserWSEndpoint: wsUrl,
      defaultViewport: null
    });

    const pages = await browser.pages();
    const page = pages[0] || await browser.newPage();
    
    console.log('✅ Connected! Browser ready');
    console.log('');

    // Get persona
    const persona = await PersonaManager.getUserPersona(userId);
    
    if (!persona) {
      throw new Error('No persona found for user. Please create a persona first.');
    }

    console.log('🎭 Persona Configuration:');
    console.log(`   Gender: ${persona.gender}`);
    console.log(`   Age Group: ${persona.age_group}`);
    console.log(`   GEO: ${persona.geo}`);
    console.log(`   Activity: ${persona.activity_level}`);
    console.log(`   Tech Savviness: ${persona.tech_savvy}`);
    console.log('');

    // Initialize warmup engine with AdsPower browser
    const engine = new PersonaWarmupEngine(userId);
    engine.browser = browser;
    engine.page = page;
    
    // Start screenshot timer
    engine.startScreenshotTimer();
    
    // Get session parameters
    const sessionDuration = PersonaManager.calculateSessionDuration(persona);
    const durationMinutes = Math.round(sessionDuration / 1000 / 60);
    
    console.log(`📊 Session Parameters:`);
    console.log(`   Duration: ${durationMinutes} minutes`);
    console.log(`   Platform: AdsPower Profile (isolated fingerprint)`);
    console.log(`   Screenshot interval: ${ADSPOWER_CONFIG.screenshots.interval / 1000}s`);
    console.log('');

    // Run the warmup session
    await engine.run();
    
    console.log('');
    console.log('✅ Warmup completed successfully on AdsPower profile!');
    
  } catch (error) {
    console.error('\n❌ Error during warmup:', error.message);
    throw error;
  } finally {
    // Stop screenshot timer
    if (engine && engine.stopScreenshotTimer) {
      engine.stopScreenshotTimer();
    }
    
    // Close profile if configured
    if (browser && ADSPOWER_CONFIG.closeAfterRun) {
      try {
        await adspower.closeProfile(profileId);
      } catch (error) {
        console.log(`⚠️  Could not close profile: ${error.message}`);
      }
    } else {
      console.log('');
      console.log('ℹ️  Profile left open for manual inspection');
      console.log(`   Profile ID: ${profileId}`);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const listProfiles = args.includes('--list');
  const profileIdArg = args.find(arg => arg.startsWith('--profile='));
  const userIdArg = args.find(arg => arg.startsWith('--user='));
  
  const profileId = profileIdArg ? profileIdArg.split('=')[1] : null;
  const userId = userIdArg ? userIdArg.split('=')[1] : null;
  
  const adspower = new AdsPowerClient(
    ADSPOWER_CONFIG.apiUrl,
    ADSPOWER_CONFIG.apiKey
  );

  try {
    // List profiles mode
    if (listProfiles) {
      console.log('\n📋 Available AdsPower Profiles');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      const profiles = await adspower.getProfiles();
      
      if (profiles.length === 0) {
        console.log('No profiles found. Create profiles in AdsPower first.');
        return;
      }
      
      profiles.forEach((profile, index) => {
        console.log(`[${index + 1}] Profile ID: ${profile.user_id}`);
        console.log(`    Name: "${profile.user_name}"`);
        console.log(`    Browser: ${profile.browsers[0]?.browser_type || 'Unknown'}`);
        console.log(`    OS: ${profile.browsers[0]?.os_type || 'Unknown'}`);
        console.log(`    Status: ${profile.browsers[0]?.status === 'Active' ? '✅ Active' : '⚫ Inactive'}`);
        console.log(`    Fingerprint: ${profile.browsers[0]?.fingerprint || 'Default'}`);
        console.log('');
      });
      
      console.log(`Total: ${profiles.length} profiles`);
      console.log('');
      console.log('Usage: node run-with-adspower.js --profile=<ID>');
      
      return;
    }

    // Get profile ID
    let targetProfileId = profileId;
    
    if (!targetProfileId) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      console.log('\n🔐 AdsPower Integration');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      targetProfileId = await new Promise(resolve => {
        rl.question('Enter AdsPower Profile ID (or "list" to see profiles): ', (answer) => {
          rl.close();
          resolve(answer.trim());
        });
      });

      if (targetProfileId.toLowerCase() === 'list') {
        await main();
        return;
      }
      
      if (!targetProfileId) {
        console.log('\n❌ Profile ID is required');
        console.log('Usage: node run-with-adspower.js --profile=<ID>');
        console.log('   Or: node run-with-adspower.js --list');
        process.exit(1);
      }
    }

    // Get user ID (use test user if not specified)
    const targetUserId = userId || 'a4019ed5-bd73-4783-a239-c7809eb62daf';

    // Verify user and persona exist
    console.log('\n🔍 Verifying user and persona...');
    const user = await UserManager.getUser(targetUserId);
    const persona = await PersonaManager.getUserPersona(targetUserId);
    
    if (!user) {
      console.log(`❌ User not found: ${targetUserId}`);
      console.log('Please create a user first.');
      process.exit(1);
    }
    
    if (!persona) {
      console.log(`❌ No persona found for user: ${targetUserId}`);
      console.log('Please create a persona first.');
      process.exit(1);
    }
    
    console.log(`✅ User: ${user.name}`);
    console.log(`✅ Persona: ${persona.gender} ${persona.age_group} ${persona.geo}`);
    
    // Check profile status
    try {
      console.log('\n🔍 Checking AdsPower profile status...');
      const profileStatus = await adspower.getProfileStatus(targetProfileId);
      console.log(`✅ Profile status: ${profileStatus.browsers[0]?.status || 'Unknown'}`);
    } catch (error) {
      console.log(`⚠️  Could not check profile status: ${error.message}`);
    }

    // Prompt for manual profile open (fallback)
    console.log('\n📱 Manual Profile Open (Fallback)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('If automatic profile open fails, you can open manually:');
    console.log('1. Open AdsPower application');
    console.log(`2. Find profile ID: ${targetProfileId}`);
    console.log('3. Click "Open" button');
    console.log('4. Wait for profile browser to open');
    console.log('5. Press ENTER here to continue\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const manualOpen = await new Promise(resolve => {
      const timeout = setTimeout(() => {
        rl.close();
        resolve(false);
      }, 5000); // 5 second timeout (auto-proceeds)

      rl.question('Profile opened? Press ENTER to continue (auto-proceeds in 5s)... ', () => {
        clearTimeout(timeout);
        rl.close();
        resolve(true);
      });
    });

    if (manualOpen) {
      console.log('✅ Proceeding with manual profile open');
    } else {
      console.log('⏭️  Auto-proceeding (will try automatic open)');
    }

    // Run warmup
    await runWarmupOnAdsPower(targetProfileId, targetUserId);

  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure AdsPower is running');
    console.error(`   2. Check AdsPower API URL: ${ADSPOWER_CONFIG.apiUrl}`);
    console.error('   3. Get API key from AdsPower → Settings → API');
    console.error('   4. Verify profile ID is correct and active');
    console.error('   5. Check profile is not already opened by another process');
    console.error('\n📚 Documentation: docs/ADSPOWER-INTEGRATION.md');
    process.exit(1);
  }
}

// Run
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { runWarmupOnAdsPower, AdsPowerClient };
