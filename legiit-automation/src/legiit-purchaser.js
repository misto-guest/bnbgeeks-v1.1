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
    
    // Set default timeout
    this.page.setDefaultTimeout(this.timeout);
    
    console.log('✅ Browser initialized');
  }

  /**
   * Login to Legiit
   */
  async login() {
    try {
      console.log('🔐 Logging into Legiit...');
      
      // Navigate to login page
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
      
      // Verify login success
      await this.page.waitForSelector('.user-menu, .dropdown, [data-testid="user-menu"]', { timeout: 10000 })
        .catch(() => {
          // Check for error messages
          return this.page.waitForSelector('.alert-danger, .error, .message-error', { timeout: 2000 })
            .then(() => { throw new Error('Login failed - check credentials'); })
            .catch(() => {}); // If neither selector found, assume success
        });
      
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
      
      // Wait for page to load
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
          // Try next selector
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
      
      // Wait for any navigation or modal
      await this.page.waitForTimeout(2000);
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' })
        .catch(() => {}); // Might not navigate
      
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
      
      // Check for any required fields that might be empty
      await this.fillMissingRequiredFields();
      
      console.log('✅ Business details filled');
      return true;
    } catch (error) {
      console.error('❌ Failed to fill business details:', error.message);
      throw error;
    }
  }

  /**
   * Helper method to fill any missing required fields
   */
  async fillMissingRequiredFields() {
    try {
      const requiredFields = await this.page.evaluate(() => {
        const required = [];
        const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
          if (!input.value && input.type !== 'hidden') {
            required.push({
              selector: input.getAttribute('name') || input.getAttribute('id') || input.getAttribute('placeholder'),
              type: input.type,
              placeholder: input.placeholder
            });
          }
        });
        return required;
      });
      
      // If there are required fields, log them
      if (requiredFields.length > 0) {
        console.log('⚠️  Found required fields that may need attention:', requiredFields);
      }
    } catch (error) {
      // Ignore errors from this check
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
          
          // Check if button mentions wallet payment
          const buttonText = await this.page.evaluate(el => el.textContent, element);
          
          if (buttonText.toLowerCase().includes('wallet') || 
              buttonText.toLowerCase().includes('complete') ||
              buttonText.toLowerCase().includes('confirm')) {
            
            // Take screenshot before clicking
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
        // Try to find any button that completes the order
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
        // Check for success indicators
        const hasSuccess = await this.page.evaluate(() => {
          const bodyText = document.body.textContent.toLowerCase();
          return bodyText.includes('order') && 
                 (bodyText.includes('complete') || bodyText.includes('success') || bodyText.includes('thank'));
        });
        
        if (!hasSuccess) {
          throw new Error('Could not confirm order completion');
        }
      });
      
      // Take screenshot of confirmation
      await this.page.screenshot({ path: 'screenshots/order-confirmation.png' });
      
      console.log('✅ Purchase completed successfully!');
      
      // Extract order ID if available
      const orderId = await this.extractOrderId();
      
      return {
        success: true,
        orderId: orderId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to complete purchase:', error.message);
      
      // Take screenshot of error state
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
        // Look for order ID in various places
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
        
        // Try to find in URL
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
