#!/usr/bin/env node

/**
 * Cloudflare Bypass Script for Property Magic Book
 * Uses puppeteer-extra with stealth plugin
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function downloadBook() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();

    // Set realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Generate temp email (using guerrillamail service)
    console.log('📧 Getting temporary email...');
    const tempEmail = await getTempEmail(page);
    console.log(`✅ Temp email: ${tempEmail}`);

    // Navigate to Property Magic page
    console.log('🌐 Navigating to Property Magic page...');
    await page.goto('https://www.propertymagicbook.com/download-now58324697', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for page to load
    await page.waitForTimeout(3000);

    // Check if Cloudflare block
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);

    if (title.includes('blocked') || title.includes('Access Denied')) {
      throw new Error('Cloudflare block detected');
    }

    // Look for form inputs
    console.log('🔍 Looking for form...');

    // Try to find email input
    const emailInput = await page.$('input[type="email"]') ||
                      await page.$('input[name*="email"]') ||
                      await page.$('input[id*="email"]');

    const nameInput = await page.$('input[type="text"]') ||
                      await page.$('input[name*="name"]') ||
                      await page.$('input[id*="name"]');

    const submitButton = await page.$('button[type="submit"]') ||
                        await page.$('input[type="submit"]') ||
                        await page.$('button');

    if (!emailInput || !submitButton) {
      console.log('❌ Form not found, trying to extract page content...');
      const content = await page.content();
      console.log(content.substring(0, 1000));
      throw new Error('Could not find form inputs');
    }

    console.log('✅ Form found!');

    // Fill out form
    console.log('✍️  Filling out form...');

    if (nameInput) {
      await nameInput.type('John');
      await page.waitForTimeout(500);
    }

    await emailInput.type(tempEmail);
    await page.waitForTimeout(1000);

    // Submit form
    console.log('📤 Submitting form...');
    await submitButton.click();

    // Wait for submission
    await page.waitForTimeout(5000);

    console.log('✅ Form submitted! Checking temp email for download link...');

    // Check temp email for download link
    await page.waitForTimeout(10000);

    const downloadLink = await checkTempEmail(page, tempEmail);

    if (downloadLink) {
      console.log(`✅ Download link found: ${downloadLink}`);
      console.log('📥 Downloading book...');

      // Download the PDF
      const downloadPath = '/Users/northsea/clawd-dmitry/Property-Magic-Book.pdf';
      await downloadPDF(page, downloadLink, downloadPath);

      console.log(`✅ Book downloaded to: ${downloadPath}`);
    } else {
      throw new Error('Download link not found in email');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

async function getTempEmail(page) {
  // Use guerrillamail
  await page.goto('https://www.guerrillamail.com/', {
    waitUntil: 'networkidle2'
  });

  await page.waitForTimeout(2000);

  // Get email from input field
  const emailInput = await page.$('#email-widget');
  if (!emailInput) {
    throw new Error('Could not find temp email input');
  }

  const email = await page.evaluate(el => el.value, emailInput);
  return email;
}

async function checkTempEmail(page, tempEmail) {
  // Go back to guerrillamail inbox
  await page.goto('https://www.guerrillamail.com/', {
    waitUntil: 'networkidle2'
  });

  // Wait for email
  await page.waitForTimeout(15000);

  // Check for emails from Property Magic
  const emails = await page.$$eval('.mail_item', items => {
    return items.map(item => ({
      from: item.querySelector('.mail_from')?.textContent,
      subject: item.querySelector('.mail_subject')?.textContent,
      id: item.getAttribute('onclick')
    }));
  });

  console.log(`📬 Found ${emails.length} emails`);

  for (const email of emails) {
    if (email.from && email.from.toLowerCase().includes('property')) {
      console.log(`✅ Found Property Magic email!`);
      // Open email
      await page.goto(`https://www.guerrillamail.com/inbox?mail_id=${email.id}`);
      await page.waitForTimeout(2000);

      // Find download link
      const downloadLink = await page.$eval('a[href*="download"]', a => a.href);
      return downloadLink;
    }
  }

  return null;
}

async function downloadPDF(page, url, path) {
  const viewSource = await page.goto(url, { waitUntil: 'networkidle2' });
  const buffer = await viewSource.buffer();

  const fs = require('fs');
  fs.writeFileSync(path, buffer);
}

// Run
downloadBook().catch(console.error);
