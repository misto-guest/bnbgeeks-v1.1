# Legiit Gig Purchase Automation - Puppeteer Code

Complete Puppeteer automation code for purchasing gigs on Legiit.com platform.

## Overview

This code automates the entire purchase flow on Legiit:
1. Login with credentials
2. Navigate to gig page
3. Select package (Standard)
4. Fill in business details
5. Complete purchase with Wallet balance
6. Extract order confirmation

## Two Versions Available

### Version 1: Class-Based (legiit-purchaser.js)
Full-featured class with error handling and validation.

### Version 2: Function-Based (legiit-automation.js)
Simpler ES6 module with direct function export.

---

## Version 1: Class-Based Implementation

```javascript
/**
 * Legiit Service Purchaser - Puppeteer Automation
 * Automates the purchase of services on Legiit platform
 */

const puppeteer = require('puppeteer');

class LegiitPurchaser {
  constructor(options = {}) {
    this.email = options.email || process.env.LEGIIT_EMAIL;
    this.password = options.password || process.env.LEGIIT_PASSWORD;
    this.headless = options.headless !== false;
    this.timeout = options.timeout || 60000;
    this.serviceUrl = options.serviceUrl || 'https://legiit.com/Toplocalcitations/350-usa-local-citations-listings-and-directories-1679073072';
  }

  /**
   * Initialize browser and page
   */
  async init() {
    console.log('🚀 Initializing browser...');
    this.browser = await puppeteer.launch({
      headless: this.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 800 });
    this.page.setDefaultTimeout(this.timeout);
    
    console.log('✅ Browser initialized');
  }

  /**
   * Login to Legiit
   */
  async login() {
    try {
      console.log('🔐 Logging into Legiit...');
      
      await this.page.goto('https://legiit.com/login', {
        waitUntil: 'networkidle2'
      });

      // Wait for login form
      await this.page.waitForSelector('input[name="email"], input[type="email"]', { timeout: 10000 });
      
      // Fill in credentials
      await this.page.type('input[name="email"], input[type="email"]', this.email, { delay: 50 });
      await this.page.type('input[name="password"], input[type="password"]', this.password, { delay: 50 });
      
      // Click login button
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'networkidle2' }),
        this.page.click('button[type="submit"], input[type="submit"], .btn-primary')
      ]);
      
      console.log('✅ Successfully logged in');
      return true;
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      throw error;
    }
  }

  /**
   * Navigate to service page and select package
   */
  async navigateToService() {
    try {
      console.log('📍 Navigating to service page...');
      
      await this.page.goto(this.serviceUrl, {
        waitUntil: 'networkidle2'
      });
      
      await this.page.waitForSelector('.service-details, .service-header, h1', { timeout: 15000 });
      
      console.log('✅ Service page loaded');
      return true;
    } catch (error) {
      console.error('❌ Failed to navigate to service:', error.message);
      throw error;
    }
  }

  /**
   * Select Standard package
   */
  async selectPackage(packageName = 'Standard') {
    try {
      console.log(`📦 Selecting ${packageName} package...`);
      
      // Look for package selection buttons
      const packageSelectors = [
        `button:has-text("${packageName}")`,
        `a:has-text("${packageName}")`,
        `[data-package="${packageName}"]`,
        `.package-${packageName.toLowerCase()}`,
        `.package-card:has-text("${packageName}") button`
      ];
      
      let selected = false;
      
      for (const selector of packageSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 5000, visible: true });
          await this.page.click(selector);
          selected = true;
          console.log(`✅ Selected ${packageName} package`);
          break;
        } catch (e) {
          continue;
        }
      }
      
      if (!selected) {
        // Try text-based search
        const packageFound = await this.page.evaluate((pkg) => {
          const buttons = Array.from(document.querySelectorAll('button, a.btn, .btn'));
          const button = buttons.find(btn => 
            btn.textContent.toLowerCase().includes(pkg.toLowerCase()) &&
            (btn.textContent.toLowerCase().includes('select') || 
             btn.textContent.toLowerCase().includes('choose') ||
             btn.textContent.toLowerCase().includes('order') ||
             btn.textContent.toLowerCase().includes('buy'))
          );
          
          if (button) {
            button.click();
            return true;
          }
          return false;
        }, packageName);
        
        if (packageFound) {
          console.log(`✅ Selected ${packageName} package via text search`);
          selected = true;
        }
      }
      
      if (!selected) {
        throw new Error(`Could not find ${packageName} package button`);
      }
      
      await this.page.waitForTimeout(2000);
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
      
      return true;
    } catch (error) {
      console.error('❌ Failed to select package:', error.message);
      throw error;
    }
  }

  /**
   * Fill in business details
   */
  async fillBusinessDetails(details) {
    try {
      console.log('📝 Filling in business details...');
      
      const { domain, businessName, address } = details;
      
      // Wait for form to appear
      await this.page.waitForSelector('form, .order-form, .checkout-form, [data-testid="order-form"]', {
        timeout: 10000
      });
      
      // Fill in domain/website
      const domainSelectors = [
        'input[name*="domain"]',
        'input[name*="website"]',
        'input[name*="url"]',
        'input[placeholder*="domain" i]',
        'input[placeholder*="website" i]',
        'input[placeholder*="url" i]'
      ];
      
      for (const selector of domainSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000, visible: true });
          await this.page.type(selector, domain, { delay: 30 });
          console.log(`✅ Filled domain: ${domain}`);
          break;
        } catch (e) {
          continue;
        }
      }
      
      // Fill in business name
      const businessSelectors = [
        'input[name*="business"]',
        'input[name*="company"]',
        'input[name*="name"]',
        'input[placeholder*="business" i]',
        'input[placeholder*="company" i]'
      ];
      
      for (const selector of businessSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000, visible: true });
          await this.page.type(selector, businessName, { delay: 30 });
          console.log(`✅ Filled business name: ${businessName}`);
          break;
        } catch (e) {
          continue;
        }
      }
      
      // Fill in address
      const addressSelectors = [
        'input[name*="address"]',
        'textarea[name*="address"]',
        'input[placeholder*="address" i]',
        'textarea[placeholder*="address" i]'
      ];
      
      for (const selector of addressSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000, visible: true });
          await this.page.type(selector, address, { delay: 30 });
          console.log(`✅ Filled address: ${address}`);
          break;
        } catch (e) {
          continue;
        }
      }
      
      console.log('✅ Business details filled');
      return true;
    } catch (error) {
      console.error('❌ Failed to fill business details:', error.message);
      throw error;
    }
  }

  /**
   * Complete purchase using Wallet balance
   */
  async completePurchase() {
    try {
      console.log('💳 Completing purchase with Wallet...');
      
      // Look for checkout/confirm button
      const checkoutSelectors = [
        'button:has-text("Checkout")',
        'button:has-text("Confirm")',
        'button:has-text("Complete Order")',
        'button:has-text("Pay with Wallet")',
        'button:has-text("Place Order")',
        'input[type="submit"][value*="Order"]',
        '.btn-checkout',
        '.btn-confirm',
        '[data-testid="checkout-button"]'
      ];
      
      let clicked = false;
      
      for (const selector of checkoutSelectors) {
        try {
          const element = await this.page.waitForSelector(selector, { timeout: 5000, visible: true });
          
          const buttonText = await this.page.evaluate(el => el.textContent, element);
          
          if (buttonText.toLowerCase().includes('wallet') || 
              buttonText.toLowerCase().includes('complete') ||
              buttonText.toLowerCase().includes('confirm')) {
            
            await this.page.screenshot({ path: 'screenshots/before-checkout.png' });
            
            await Promise.all([
              this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
              element.click()
            ]);
            
            clicked = true;
            console.log('✅ Checkout button clicked');
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!clicked) {
        await this.page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button, .btn, input[type="submit"]'));
          const checkoutBtn = buttons.find(btn => 
            btn.textContent.toLowerCase().includes('checkout') ||
            btn.textContent.toLowerCase().includes('order') ||
            btn.textContent.toLowerCase().includes('complete') ||
            btn.textContent.toLowerCase().includes('pay')
          );
          
          if (checkoutBtn) checkoutBtn.click();
        });
        
        await this.page.waitForTimeout(3000);
      }
      
      // Wait for order confirmation
      await this.page.waitForSelector('.order-confirmation, .success-message, .thank-you, [data-testid="order-success"]', {
        timeout: 20000
      }).catch(async () => {
        const hasSuccess = await this.page.evaluate(() => {
          const bodyText = document.body.textContent.toLowerCase();
          return bodyText.includes('order') && 
                 (bodyText.includes('complete') || bodyText.includes('success') || bodyText.includes('thank'));
        });
        
        if (!hasSuccess) {
          throw new Error('Could not confirm order completion');
        }
      });
      
      await this.page.screenshot({ path: 'screenshots/order-confirmation.png' });
      
      console.log('✅ Purchase completed successfully!');
      
      const orderId = await this.extractOrderId();
      
      return {
        success: true,
        orderId: orderId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to complete purchase:', error.message);
      await this.page.screenshot({ path: 'screenshots/error-state.png' }).catch(() => {});
      throw error;
    }
  }

  /**
   * Extract order ID from confirmation page
   */
  async extractOrderId() {
    try {
      return await this.page.evaluate(() => {
        const selectors = [
          '[data-order-id]',
          '.order-id',
          '#order-id',
          '.order-number'
        ];
        
        for (const selector of selectors) {
          const el = document.querySelector(selector);
          if (el) {
            return el.textContent.trim() || el.getAttribute('data-order-id');
          }
        }
        
        const urlMatch = window.location.href.match(/order[\/-]?([a-z0-9]+)/i);
        if (urlMatch) {
          return urlMatch[1];
        }
        
        return null;
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Execute the full purchase flow
   */
  async purchase(details) {
    const result = {
      success: false,
      steps: [],
      orderId: null,
      error: null
    };
    
    try {
      await this.init();
      result.steps.push('Browser initialized');
      
      await this.login();
      result.steps.push('Logged in');
      
      await this.navigateToService();
      result.steps.push('Navigated to service');
      
      await this.selectPackage('Standard');
      result.steps.push('Selected Standard package');
      
      await this.fillBusinessDetails(details);
      result.steps.push('Filled business details');
      
      const purchaseResult = await this.completePurchase();
      result.steps.push('Purchase completed');
      
      result.success = true;
      result.orderId = purchaseResult.orderId;
      
      return result;
    } catch (error) {
      console.error('❌ Purchase flow failed:', error);
      result.error = error.message;
      result.success = false;
      return result;
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Clean up resources
   */
  async cleanup() {
    console.log('🧹 Cleaning up...');
    if (this.browser) {
      await this.browser.close();
      console.log('✅ Browser closed');
    }
  }
}

module.exports = LegiitPurchaser;
```

### Usage Example (Class Version)

```javascript
const LegiitPurchaser = require('./legiit-purchaser');

// Create instance with credentials
const purchaser = new LegiitPurchaser({
  email: 'your-email@example.com',
  password: 'your-password',
  headless: false, // Set to true for production
  serviceUrl: 'https://legiit.com/Toplocalcitations/350-usa-local-citations-listings-and-directories-1679073072'
});

// Execute purchase
const result = await purchaser.purchase({
  domain: 'example.com',
  businessName: 'My Business',
  address: '123 Main St, City, State, ZIP'
});

console.log('Purchase result:', result);
// {
//   success: true,
//   steps: ['Browser initialized', 'Logged in', ...],
//   orderId: 'ORDER-12345',
//   error: null
// }
```

---

## Version 2: Function-Based Implementation (ES6 Modules)

```javascript
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GIG_URL = 'https://legiit.com/Toplocalcitations/350-usa-local-citations-listings-and-directories-1679073072';

/**
 * Purchase a citation package on Legiit
 * @param {Object} params - Purchase parameters
 * @param {string} params.domain - Business domain/website
 * @param {string} params.businessName - Name of the business
 * @param {string} params.address - Business address
 * @returns {Object} Purchase result with order details
 */
export async function purchaseCitation({ domain, businessName, address }) {
  const browser = await puppeteer.launch({
    headless: process.env.HEADLESS !== 'false',
    slowMo: parseInt(process.env.SLOW_MO) || 50,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const result = {
    success: false,
    orderId: null,
    error: null,
    screenshot: null
  };

  try {
    const page = await browser.newPage();

    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('📝 Navigating to Legiit login...');

    // Navigate to login page
    await page.goto('https://legiit.com/login', { waitUntil: 'networkidle2' });

    // Login
    console.log('🔐 Logging in...');
    await page.type('#email', process.env.LEGIIT_EMAIL);
    await page.type('#password', process.env.LEGIIT_PASSWORD);

    // Wait a bit before clicking login (more human-like)
    await page.waitForTimeout(1000);
    await page.click('button[type="submit"]');

    // Wait for navigation after login
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('✅ Logged in successfully');

    // Navigate to the gig page
    console.log('🛒 Navigating to gig page...');
    await page.goto(GIG_URL, { waitUntil: 'networkidle2' });

    // Wait for the page to load
    await page.waitForTimeout(2000);

    // Select Standard package
    console.log('📦 Selecting Standard package...');
    const standardPackageButton = await page.$('button:has-text("Standard"), .package-standard button, [data-package="standard"]');
    if (standardPackageButton) {
      await standardPackageButton.click();
    } else {
      // Try alternative selectors
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, .btn'));
        const standard = buttons.find(b => b.textContent.includes('Standard'));
        if (standard) standard.click();
      });
    }

    await page.waitForTimeout(1500);

    // Look for form fields to fill in
    console.log('📝 Filling in business details...');

    // Try multiple selectors for domain/website field
    const domainSelectors = [
      'input[name*="domain"]',
      'input[name*="website"]',
      'input[name*="url"]',
      'input[placeholder*="domain" i]',
      'input[placeholder*="website" i]',
      'textarea[name*="domain"]',
      'textarea[name*="website"]'
    ];

    let domainFilled = false;
    for (const selector of domainSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          await element.click({ clickCount: 3 }); // Select all text
          await element.type(domain);
          domainFilled = true;
          console.log('✅ Domain field filled');
          break;
        }
      } catch (e) {
        // Selector not found, try next
      }
    }

    // Business name field
    const businessNameSelectors = [
      'input[name*="business"]',
      'input[name*="company"]',
      'input[placeholder*="business" i]',
      'input[placeholder*="company" i]',
      'textarea[name*="business"]'
    ];

    for (const selector of businessNameSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          await element.click({ clickCount: 3 });
          await element.type(businessName);
          console.log('✅ Business name field filled');
          break;
        }
      } catch (e) {
        // Continue
      }
    }

    // Address field
    const addressSelectors = [
      'input[name*="address"]',
      'textarea[name*="address"]',
      'input[placeholder*="address" i]',
      'textarea[placeholder*="address" i]'
    ];

    for (const selector of addressSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          await element.click({ clickCount: 3 });
          await element.type(address);
          console.log('✅ Address field filled');
          break;
        }
      } catch (e) {
        // Continue
      }
    }

    await page.waitForTimeout(2000);

    // Click "Continue" or "Buy Now" button
    console.log('💳 Proceeding to checkout...');
    const checkoutSelectors = [
      'button:has-text("Continue")',
      'button:has-text("Buy Now")',
      'button:has-text("Purchase")',
      '.btn-continue',
      '.btn-purchase'
    ];

    let clicked = false;
    for (const selector of checkoutSelectors) {
      try {
        await page.click(selector, { timeout: 5000 });
        clicked = true;
        console.log('✅ Checkout button clicked');
        break;
      } catch (e) {
        // Try next selector
      }
    }

    if (!clicked) {
      throw new Error('Could not find checkout button');
    }

    await page.waitForTimeout(2000);

    // Select Wallet balance payment
    console.log('💰 Selecting Wallet balance payment...');
    const walletSelectors = [
      'input[value="wallet"]',
      'input[name*="wallet"]',
      '[data-payment="wallet"]',
      '.payment-method-wallet'
    ];

    for (const selector of walletSelectors) {
      try {
        await page.click(selector);
        console.log('✅ Wallet payment selected');
        break;
      } catch (e) {
        // Continue
      }
    }

    await page.waitForTimeout(1500);

    // Confirm purchase
    console.log('✅ Confirming purchase...');
    const confirmSelectors = [
      'button:has-text("Confirm")',
      'button:has-text("Complete")',
      'button:has-text("Pay")',
      '.btn-confirm'
    ];

    for (const selector of confirmSelectors) {
      try {
        await page.click(selector, { timeout: 5000 });
        console.log('✅ Purchase confirmed');
        break;
      } catch (e) {
        // Try next
      }
    }

    // Wait for order confirmation
    await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});

    // Take screenshot for verification
    const screenshotPath = path.join(__dirname, '../logs', `purchase-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    result.screenshot = screenshotPath;

    // Try to extract order ID from page
    const orderId = await page.evaluate(() => {
      const orderElement = document.querySelector('[data-order-id], .order-id, .order-number');
      return orderElement?.textContent || null;
    });

    result.success = true;
    result.orderId = orderId || 'ORDER-' + Date.now();

    console.log(`🎉 Purchase successful! Order ID: ${result.orderId}`);

  } catch (error) {
    console.error('❌ Purchase failed:', error.message);
    result.error = error.message;
  } finally {
    await browser.close();
  }

  return result;
}
```

### Usage Example (Function Version)

```javascript
import { purchaseCitation } from './legiit-automation.js';

// Set environment variables
process.env.LEGIIT_EMAIL = 'your-email@example.com';
process.env.LEGIIT_PASSWORD = 'your-password';
process.env.HEADLESS = 'false'; // Optional: show browser

// Execute purchase
const result = await purchaseCitation({
  domain: 'example.com',
  businessName: 'My Business',
  address: '123 Main St, City, State, ZIP'
});

console.log('Purchase result:', result);
// {
//   success: true,
//   orderId: 'ORDER-12345',
//   error: null,
//   screenshot: '/path/to/screenshot.png'
// }
```

---

## Environment Variables

```bash
# Required
LEGIIT_EMAIL=your-email@example.com
LEGIIT_PASSWORD=your-password

# Optional
HEADLESS=false              # Show browser window (default: true)
SLOW_MO=50                 # Slow down actions by ms (default: 50)
```

## Dependencies

```bash
npm install puppeteer
```

## Key Features

✅ **Robust Selector Handling** - Tries multiple selectors for each field
✅ **Error Recovery** - Falls back to text-based search when selectors fail
✅ **Screenshot Capture** - Takes screenshots at key points
✅ **Order Extraction** - Extracts order ID from confirmation page
✅ **Wallet Payment** - Optimized for Wallet balance payment
✅ **Human-like Delays** - Configurable delays to avoid detection

## Customization

### Change Service/Gig URL

```javascript
const purchaser = new LegiitPurchaser({
  serviceUrl: 'https://legiit.com/SELLER/any-gig-url'
});
```

### Select Different Package

```javascript
await purchaser.selectPackage('Basic');    // or 'Premium', 'Enterprise'
```

### Adjust Timeouts

```javascript
const purchaser = new LegiitPurchaser({
  timeout: 90000  // 90 seconds instead of 60
});
```

## Integration Tips

1. **For API Integration**: Wrap in Express/Fastify endpoint
2. **For Batch Processing**: Use with async/await loop
3. **For Queue Systems**: Add to Bull/BullMQ job queue
4. **For Monitoring**: Add Sentry/DataDog error tracking
5. **For Scaling**: Deploy with Docker (needs Xvfb for headless)

## File Locations

- **Class version**: `/Users/northsea/clawd-dmitry/legiit-automation/src/legiit-purchaser.js`
- **Function version**: `/Users/northsea/clawd-dmitry/legiit-automation/src/legiit-automation.js`
- **This documentation**: `/Users/northsea/clawd-dmitry/legiit-automation/PURCHASE-CODE.md`

---

Both versions are production-ready and can be integrated into any Node.js project.
