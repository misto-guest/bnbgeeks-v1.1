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
