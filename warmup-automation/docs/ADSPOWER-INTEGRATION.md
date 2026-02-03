# 🔐 AdsPower Integration for Persona Warmup

## Overview

AdsPower is a browser fingerprinting management platform that allows you to:
- Manage multiple browser profiles with unique fingerprints
- Isolate cookies, cache, and local storage
- Simulate different devices, locations, and browsers
- Prevent detection through advanced fingerprinting

This integration allows the persona warmup system to run directly on AdsPower profiles.

---

## 🔑 AdsPower API Setup

### 1. Get AdsPower API Credentials

```bash
# Default AdsPower local API URL
http://127.0.0.1:50325

# Or your custom URL
http://your-adspower-server:50325
```

### 2. API Authentication

AdsPower uses a simple API key system. Get your API key from:
```
AdsPower → Settings → API → API Key
```

---

## 📦 Installation

```bash
cd warmup-automation
npm install axios
```

---

## 🔧 Configuration

Create `adspower-config.json`:

```json
{
  "apiUrl": "http://127.0.0.1:50325",
  "apiKey": "your-adspower-api-key",
  "defaultProfileId": null,
  "closeAfterRun": true,
  "screenshots": {
    "enabled": true,
    "interval": 30000,
    "directory": "./screenshots/adspower"
  }
}
```

---

## 🚀 Usage

### Option 1: Interactive Login Prompt

```bash
node scripts/run-with-adspower.js
```

You'll be prompted:
```
🔐 AdsPower Integration
━━━━━━━━━━━━━━━━━━━━━━━━

Enter your AdsPower Profile ID (or 'list' to see available profiles): 
> 

Prompting for AdsPower login...

[1] Open AdsPower application
[2] Click on your profile
[3] Wait for profile to open
[4] Press ENTER here when ready

Profile opened? Press ENTER to continue...
```

### Option 2: Specify Profile ID Directly

```bash
node scripts/run-with-adspower.js --profile=123456
```

### Option 3: List Available Profiles

```bash
node scripts/run-with-adspower.js --list
```

Output:
```
Available AdsPower Profiles:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ID: 123456
  Name: "US User 1"
  Browser: Chrome
  OS: Windows 10
  Status: Active

ID: 123457
  Name: "NL User 2"
  Browser: Chrome
  OS: macOS 12
  Status: Active
```

---

## 📝 API Endpoints

### Get User Profiles
```http
GET /api/v1/user/list
Authorization: <your-api-key>
```

### Open Profile
```http
POST /api/v1/user/open
Authorization: <your-api-key>
Content-Type: application/json

{
  "user_id": "123456"
}
```

### Close Profile
```http
POST /api/v1/user/close
Authorization: <your-api-key>
Content-Type: application/json

{
  "user_id": "123456"
}
```

### Check Profile Status
```http
GET /api/v1/user/status
Authorization: <your-api-key>
```

---

## 🎭 Integration with Persona System

### Create AdsPower-Aware User

```javascript
{
  "name": "Dutch User with AdsPower",
  "description": "Runs on AdsPower profile ID 123456",
  "enabled": true,
  "adspower_profile_id": "123456",
  "adspower_auto_open": true,
  "persona": {
    "gender": "male",
    "age_group": "25-34",
    "geo": "NL",
    "activity_level": "medium",
    "tech_savvy": "high"
  }
}
```

---

## 🤖 Puppeteer Code for AdsPower

### Basic Structure

```javascript
import puppeteer from 'puppeteer';
import axios from 'axios';

// AdsPower configuration
const ADSPOWER_API = 'http://127.0.0.1:50325';
const ADSPOWER_API_KEY = 'your-api-key';

// Open AdsPower profile
async function openAdsPowerProfile(profileId) {
  console.log(`🔐 Opening AdsPower profile: ${profileId}`);
  
  const response = await axios.post(`${ADSPOWER_API}/api/v1/user/open`, {
    user_id: profileId
  }, {
    headers: {
      'Authorization': ADSPOWER_API_KEY
    }
  });
  
  const { data } = response;
  
  if (data.code !== 0) {
    throw new Error(`Failed to open AdsPower profile: ${data.msg}`);
  }
  
  // Get WebSocket debugging URL
  const wsUrl = data.data.ws.puppeteer;
  
  console.log(`✅ Profile opened: ${data.data.user_name}`);
  console.log(`🔗 WebSocket URL: ${wsUrl}`);
  
  return wsUrl;
}

// Run warmup on AdsPower profile
async function runWarmupOnAdsPower(profileId, userId) {
  let browser = null;
  
  try {
    // 1. Open AdsPower profile
    const wsUrl = await openAdsPowerProfile(profileId);
    
    // 2. Connect Puppeteer to AdsPower profile
    browser = await puppeteer.connect({
      browserWSEndpoint: wsUrl,
      defaultViewport: null
    });
    
    console.log('🤝 Connected to AdsPower profile');
    
    // 3. Get existing pages (profile might have open tabs)
    const pages = await browser.pages();
    const page = pages[0] || await browser.newPage();
    
    // 4. Run persona warmup
    const engine = new PersonaWarmupEngine(userId);
    engine.browser = browser;
    engine.page = page;
    
    await engine.run();
    
    console.log('✅ Warmup completed on AdsPower profile');
    
  } finally {
    // 5. Close profile (optional)
    if (browser && shouldCloseProfile) {
      await closeAdsPowerProfile(profileId);
    }
  }
}

// Close AdsPower profile
async function closeAdsPowerProfile(profileId) {
  console.log(`🔒 Closing AdsPower profile: ${profileId}`);
  
  await axios.post(`${ADSPOWER_API}/api/v1/user/close`, {
    user_id: profileId
  }, {
    headers: {
      'Authorization': ADSPOWER_API_KEY
    }
  });
  
  console.log('✅ Profile closed');
}
```

---

## 📋 Complete Script

Save as `scripts/run-with-adspower.js`:

```javascript
import puppeteer from 'puppeteer';
import axios from 'axios';
import readline from 'readline';
import PersonaManager from '../lib/persona-manager.js';
import UserManager from '../lib/user-manager.js';
import { setTimeout } from 'timers/promises';

// Configuration
const ADSPOWER_CONFIG = {
  apiUrl: process.env.ADSPOWER_API_URL || 'http://127.0.0.1:50325',
  apiKey: process.env.ADSPOWER_API_KEY || '',
  closeAfterRun: true
};

// AdsPower API helper
class AdsPowerClient {
  constructor(apiUrl, apiKey) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async getProfiles() {
    const response = await axios.get(`${this.apiUrl}/api/v1/user/list`, {
      headers: { 'Authorization': this.apiKey }
    });
    return response.data;
  }

  async openProfile(profileId) {
    console.log(`🔐 Opening AdsPower profile: ${profileId}`);
    
    const response = await axios.post(`${this.apiUrl}/api/v1/user/open`, {
      user_id: profileId
    }, {
      headers: { 'Authorization': this.apiKey }
    });
    
    if (response.data.code !== 0) {
      throw new Error(`Failed to open profile: ${response.data.msg}`);
    }
    
    const wsUrl = response.data.data.ws.puppeteer;
    console.log(`✅ Profile opened: ${response.data.data.user_name}`);
    
    return wsUrl;
  }

  async closeProfile(profileId) {
    console.log(`🔒 Closing AdsPower profile: ${profileId}`);
    
    await axios.post(`${this.apiUrl}/api/v1/user/close`, {
      user_id: profileId
    }, {
      headers: { 'Authorization': this.apiKey }
    });
    
    console.log('✅ Profile closed');
  }

  async getProfileStatus(profileId) {
    const response = await axios.get(`${this.apiUrl}/api/v1/user/status`, {
      headers: { 'Authorization': this.apiKey },
      params: { user_id: profileId }
    });
    
    return response.data;
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const profileId = args.find(arg => arg.startsWith('--profile='))?.split('=')[1];
  const listProfiles = args.includes('--list');
  
  const adspower = new AdsPowerClient(
    ADSPOWER_CONFIG.apiUrl,
    ADSPOWER_CONFIG.apiKey
  );

  try {
    // List profiles if requested
    if (listProfiles) {
      const profiles = await adspower.getProfiles();
      console.log('\n📋 Available AdsPower Profiles:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      profiles.data.data_list.forEach(profile => {
        console.log(`ID: ${profile.user_id}`);
        console.log(`  Name: "${profile.user_name}"`);
        console.log(`  Browser: ${profile.browsers[0].browser_type}`);
        console.log(`  OS: ${profile.browsers[0].os_type}`);
        console.log(`  Status: ${profile.browsers[0].status === 'Active' ? '✅ Active' : '⚫ Inactive'}`);
        console.log('');
      });
      
      return;
    }

    // Get profile ID
    let targetProfileId = profileId;
    
    if (!targetProfileId) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      targetProfileId = await new Promise(resolve => {
        rl.question('🔐 Enter your AdsPower Profile ID (or "list" to see profiles): ', (answer) => {
          rl.close();
          resolve(answer.trim());
        });
      });

      if (targetProfileId.toLowerCase() === 'list') {
        await main();
        return;
      }
    }

    // Prompt user to open profile manually
    console.log('\n📱 Manual Profile Open Instructions:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Open AdsPower application');
    console.log('2. Find and click on profile ID:', targetProfileId);
    console.log('3. Wait for the profile browser to open');
    console.log('4. Come back here and press ENTER\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    await new Promise(resolve => {
      rl.question('Profile opened? Press ENTER to continue... ', () => {
        rl.close();
        resolve();
      });
    });

    // Open profile via API
    const wsUrl = await adspower.openProfile(targetProfileId);

    // Connect Puppeteer
    console.log('\n🤝 Connecting Puppeteer to AdsPower profile...');
    
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsUrl,
      defaultViewport: null
    });

    const pages = await browser.pages();
    const page = pages[0] || await browser.newPage();

    console.log('✅ Connected! Running warmup...\n');

    // Run persona warmup
    const userId = 'a4019ed5-bd73-4783-a239-c7809eb62daf'; // Your test user
    
    const persona = await PersonaManager.getUserPersona(userId);
    
    if (!persona) {
      throw new Error('No persona found. Create one first.');
    }

    console.log('🎭 Using persona:', persona.gender, persona.age_group, persona.geo);

    // Run a simple warmup session
    console.log('\n🔍 Searching Google.nl...');
    
    await page.goto('https://google.nl', { waitUntil: 'networkidle2' });
    await setTimeout(2000);
    
    const query = "beste IDE voor JavaScript";
    console.log(`📝 Typing: "${query}"`);
    
    for (const char of query) {
      await page.keyboard.type(char, { delay: 50 + Math.random() * 100 });
    }
    
    await page.keyboard.press('Enter');
    await setTimeout(3000);
    
    console.log('👀 Viewing results...');
    await page.evaluate(() => {
      window.scrollBy({ top: 300, left: 0, behavior: 'smooth' });
    });
    await setTimeout(3000);
    
    // Take screenshot
    await page.screenshot({
      path: './screenshots/adspower/warmup-proof.png',
      fullPage: false
    });
    
    console.log('📸 Screenshot saved: screenshots/adspower/warmup-proof.png');

    // Visit a Dutch site
    console.log('\n🌐 Visiting tweakers.net...');
    await page.goto('https://tweakers.net', { waitUntil: 'networkidle2' });
    await setTimeout(5000);
    
    console.log('📰 Reading Dutch tech news...');
    for (let i = 0; i < 3; i++) {
      await page.evaluate((amt) => {
        window.scrollBy({ top: amt, left: 0, behavior: 'smooth' });
      }, 150);
      await setTimeout(2000);
    }

    console.log('\n✅ Warmup completed!');
    console.log(`📊 Session metrics:`);
    console.log(`   Profile ID: ${targetProfileId}`);
    console.log(`   Searches: 1`);
    console.log(`   Pages: 2`);
    console.log(`   Dutch sites: 2/2`);

    // Close profile if configured
    if (ADSPOWER_CONFIG.closeAfterRun) {
      await adspower.closeProfile(targetProfileId);
    } else {
      console.log('\nℹ️  Profile left open (closeAfterRun = false)');
    }

    console.log('\n🎉 All done! Check the screenshots folder.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure AdsPower is running');
    console.error('   2. Check API URL (default: http://127.0.0.1:50325)');
    console.error('   3. Verify API key in AdsPower → Settings → API');
    console.error('   4. Ensure profile ID is correct and active');
    process.exit(1);
  }
}

// Run
main();
```

---

## 🔌 REST API Integration

Add to `server/index-v3.js`:

```javascript
// AdsPower configuration
const ADSPOWER_CONFIG = {
  apiUrl: process.env.ADSPOWER_API_URL || 'http://127.0.0.1:50325',
  apiKey: process.env.ADSPOWER_API_KEY || ''
};

// Get AdsPower profiles
app.get('/api/adspower/profiles', async (req, res) => {
  try {
    const response = await axios.get(`${ADSPOWER_CONFIG.apiUrl}/api/v1/user/list`, {
      headers: { 'Authorization': ADSPOWER_CONFIG.apiKey }
    });
    
    res.json({ profiles: response.data.data.data_list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Open AdsPower profile
app.post('/api/adspower/open/:profileId', async (req, res) => {
  try {
    const response = await axios.post(`${ADSPOWER_CONFIG.apiUrl}/api/v1/user/open`, {
      user_id: req.params.profileId
    }, {
      headers: { 'Authorization': ADSPOWER_CONFIG.apiKey }
    });
    
    res.json({ 
      wsUrl: response.data.data.ws.puppeteer,
      profile: response.data.data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Close AdsPower profile
app.post('/api/adspower/close/:profileId', async (req, res) => {
  try {
    await axios.post(`${ADSPOWER_CONFIG.apiUrl}/api/v1/user/close`, {
      user_id: req.params.profileId
    }, {
      headers: { 'Authorization': ADSPOWER_CONFIG.apiKey }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 📝 Environment Setup

### 1. Create `.env` file

```bash
ADSPOWER_API_URL=http://127.0.0.1:50325
ADSPOWER_API_KEY=your-api-key-here
```

### 2. Update server to use `.env`

```javascript
import dotenv from 'dotenv';
dotenv.config();

const ADSPOWER_CONFIG = {
  apiUrl: process.env.ADSPOWER_API_URL,
  apiKey: process.env.ADSPOWER_API_KEY
};
```

---

## 🎯 Usage Examples

### Example 1: Run Warmup on Specific Profile

```bash
node scripts/run-with-adspower.js --profile=123456
```

### Example 2: List Available Profiles

```bash
node scripts/run-with-adspower.js --list
```

### Example 3: Interactive Mode

```bash
node scripts/run-with-adspower.js
```

### Example 4: Via API

```bash
# List profiles
curl http://localhost:3000/api/adspower/profiles

# Open profile
curl -X POST http://localhost:3000/api/adspower/open/123456

# Run warmup
curl -X POST http://localhost:3000/api/users/a4019ed5-bd73-4783-a239-c7809eb62daf/run

# Close profile
curl -X POST http://localhost:3000/api/adspower/close/123456
```

---

## 🔍 Troubleshooting

### Issue: "Failed to open profile"
**Solution:**
- Make sure AdsPower application is running
- Check profile ID is correct
- Verify profile is not already open

### Issue: "Connection refused"
**Solution:**
- Check AdsPower API URL (default: http://127.0.0.1:50325)
- Ensure AdsPower API is enabled in Settings

### Issue: "Authentication failed"
**Solution:**
- Get API key from AdsPower → Settings → API
- Update .env file with correct key

### Issue: "Profile not found"
**Solution:**
- List profiles using --list flag
- Use correct profile ID from list

---

## 📊 Benefits of AdsPower Integration

### 1. **Isolated Browser Profiles**
- Each profile has unique cookies, cache, localStorage
- No cross-contamination between accounts
- Perfect for managing multiple accounts

### 2. **Advanced Fingerprinting**
- Device fingerprint spoofing
- Browser fingerprint randomization
- WebGL fingerprint masking
- Canvas fingerprint protection

### 3. **Geolocation Spoofing**
- IP-based location matching
- Timezone spoofing
- Language/locale spoofing
- Browser language spoofing

### 4. **Device Emulation**
- Mobile profiles (iPhone, Android)
- Desktop profiles (Windows, macOS, Linux)
- Tablet profiles (iPad, Android tablets)

### 5. **Cookie Management**
- Persistent cookies per profile
- Automatic cookie cleanup
- Cookie export/import
- Cookie sharing between profiles

---

## 🚀 Production Deployment

### Docker with AdsPower

```dockerfile
FROM node:18

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application
COPY . .

# Environment
ENV ADSPOWER_API_URL=http://adspower:50325
ENV ADSPOWER_API_KEY=your-key

# Run
CMD ["node", "server/index-v3.js"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ADSPOWER_API_URL=http://adspower:50325
      - ADSPOWER_API_KEY=${ADSPOWER_API_KEY}
    depends_on:
      - adspower
  
  adspower:
    image: adspower/adspower:latest
    ports:
      - "50325:50325"
    volumes:
      - adspower_data:/adspower
    # Mount your AdsPower license

volumes:
  adspower_data:
```

---

## 🎓 Best Practices

### 1. Profile Management
- Use one AdsPower profile per persona/account
- Name profiles descriptively: "NL-Dev-25-34-Male"
- Keep profiles organized in folders
- Archive old profiles instead of deleting

### 2. API Key Security
- Never commit API keys to git
- Use environment variables
- Rotate API keys regularly
- Use different keys for dev/prod

### 3. Resource Management
- Don't open too many profiles at once
- Close profiles after warmup completes
- Monitor AdsPower resource usage
- Restart AdsPower weekly

### 4. Warmup Scheduling
- Stagger warmups across profiles
- Don't run all profiles simultaneously
- Use random delays between profiles
- Respect AdsPower rate limits

---

## 📈 Scaling with AdsPower

### Single Machine (Up to 50 profiles)
```
Machine Specs: 8GB RAM, 4 CPU
Profiles: 50
Concurrent Warmups: 5-10
Schedule: Every 4 hours
```

### Multiple Machines (100+ profiles)
```
Machine 1: 50 profiles (US accounts)
Machine 2: 50 profiles (EU accounts)
Load Balancer: Distribute requests
Database: Shared PostgreSQL
```

---

## 🔒 Security Considerations

### 1. API Key Protection
```javascript
// Use environment variables
const ADSPOWER_API_KEY = process.env.ADSPOWER_API_KEY;

// Never hardcode keys
// ❌ BAD:
const apiKey = '12345-67890-abcdef';

// ✅ GOOD:
const apiKey = process.env.ADSPOWER_API_KEY;
```

### 2. Profile ID Mapping
```javascript
// Store profile IDs securely in database
const userProfiles = {
  'user-1': { adspower_profile_id: '123456' },
  'user-2': { adspower_profile_id: '123457' }
};
```

### 3. Rate Limiting
```javascript
// Don't overwhelm AdsPower API
const rateLimiter = {
  delay: 1000, // 1 second between API calls
  concurrent: 5 // Max 5 concurrent operations
};
```

---

## 📝 License Requirements

**Important**: Ensure your AdsPower license allows:
- ✅ API access
- ✅ Puppeteer integration
- ✅ Commercial use (if applicable)
- ✅ Number of profiles (matches your license tier)

---

## ✅ Summary

AdsPower integration provides:
- 🔐 **Isolated profiles** for each account
- 🌍 **Geolocation spoofing** matching persona GEO
- 🎭 **Fingerprint protection** against detection
- 🤖 **Puppeteer control** of AdsPower profiles
- 📊 **Screenshot support** for verification
- 🔄 **Automated warmup** on real browser profiles

**Result**: Production-ready multi-account warmup with advanced anti-detection!

---

**Ready to deploy with AdsPower!** 🚀

Next: Run `node scripts/run-with-adspower.js --list` to see your available profiles.
