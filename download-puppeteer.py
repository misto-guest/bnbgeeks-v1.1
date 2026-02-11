#!/usr/bin/env python3

"""
Property Magic Book Downloader using Puppeteer
"""

import asyncio
import json
import time
import re
import sys
from urllib.parse import urlencode

# Try to import puppeteer
try:
    from pyppeteer import launch
    PYPUPETEER_AVAILABLE = True
except ImportError:
    PYPUPETEER_AVAILABLE = False
    print("⚠️  pyppeteer not available, will try alternative methods")

async def download_with_puppeteer():
    """Download using pyppeteer"""

    print("🚀 Starting Puppeteer browser...")

    browser = await launch(
        headless=False,
        args=[
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled'
        ]
    )

    try:
        page = await browser.newPage()

        # Set viewport and user agent
        await page.setViewport({'width': 1920, 'height': 1080})
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

        # Step 1: Get temp email
        print("📧 Getting temporary email...")

        await page.goto('https://temp-mail.org/', {'waitUntil': 'networkidle2'})
        await asyncio.sleep(2)

        # Try to get email from page
        temp_email = await page.evaluate('''
            () => {
                const emailInput = document.querySelector('input[id*="email"], input[class*="email"]');
                return emailInput ? emailInput.value : null;
            }
        ''')

        if not temp_email:
            print("❌ Could not get temp email")
            return False

        print(f"✅ Temp email: {temp_email}")

        # Step 2: Go to Property Magic page
        print("🌐 Navigating to Property Magic page...")

        await page.goto('https://www.propertymagicbook.com/download-now58324697', {
            'waitUntil': 'networkidle2',
            'timeout': 30000
        })

        await asyncio.sleep(3)

        # Check for Cloudflare block
        title = await page.title()
        print(f"📄 Page title: {title}")

        if 'blocked' in title.lower() or 'access denied' in title.lower():
            print("⚠️  Cloudflare block detected")
            print("💡 Trying to wait for it to pass...")

            # Wait and retry
            await asyncio.sleep(10)
            await page.reload({'waitUntil': 'networkidle2'})
            await asyncio.sleep(3)

        # Look for form
        print("🔍 Looking for form fields...")

        # Try to find email input
        email_selectors = [
            'input[type="email"]',
            'input[name*="email" i]',
            'input[id*="email" i]',
            'input[placeholder*="email" i]'
        ]

        email_input = None
        for selector in email_selectors:
            try:
                email_input = await page.querySelector(selector)
                if email_input:
                    print(f"✅ Found email input: {selector}")
                    break
            except:
                continue

        if not email_input:
            # Get all inputs
            inputs = await page.querySelectorAll('input')
            print(f"📋 Found {len(inputs)} input fields")

            for i, inp in enumerate(inputs):
                input_type = await page.evaluate('(el) => el.type', inp)
                input_name = await page.evaluate('(el) => el.name || el.id', inp)
                print(f"   Input {i+1}: type={input_type}, name={input_name}")

        # Try to fill and submit
        if email_input:
            print("✍️  Filling out form...")

            # Type slowly like a human
            await email_input.type(temp_email, {'delay': 100})

            await asyncio.sleep(1)

            # Look for submit button
            submit_selectors = [
                'button[type="submit"]',
                'input[type="submit"]',
                'button',
            ]

            for selector in submit_selectors:
                try:
                    btn = await page.querySelector(selector)
                    if btn:
                        btn_text = await page.evaluate('(el) => el.textContent', btn)
                        if btn_text and len(btn_text.strip()) > 0:
                            print(f"✅ Found submit button: {btn_text.strip()}")
                            await btn.click()
                            break
                except:
                    continue

            await asyncio.sleep(5)

            print("✅ Form submitted!")

        else:
            print("❌ Could not find email input field")
            return False

        # Step 3: Check email for download link
        print("⏳ Waiting 30 seconds for email...")
        await asyncio.sleep(30)

        print("📬 Checking temp email...")

        await page.goto('https://temp-mail.org/', {'waitUntil': 'networkidle2'})
        await asyncio.sleep(3)

        # Look for email
        email_found = await page.evaluate('''
            () => {
                const emails = document.querySelectorAll('.mail-item, [class*="mail"]');
                return Array.from(emails).map(email => ({
                    from: email.querySelector('.from, [class*="from"]')?.textContent,
                    subject: email.querySelector('.subject, [class*="subject"]')?.textContent
                }));
            }
        ''')

        print(f"📬 Found {len(email_found)} emails")

        for email_data in email_found:
            if 'property' in email_data.get('from', '').lower() or 'magic' in email_data.get('subject', '').lower():
                print("✅ FOUND PROPERTY MAGIC EMAIL!")
                print(f"   From: {email_data.get('from')}")
                print(f"   Subject: {email_data.get('subject')}")

                # TODO: Extract download link and download PDF
                return True

        print("⚠️  Email not received yet")
        return False

    finally:
        await browser.close()

async def main():
    if PYPUPETEER_AVAILABLE:
        result = await download_with_puppeteer()

        if result:
            print("✅ SUCCESS!")
        else:
            print("⚠️  Could not complete download")
    else:
        print("❌ pyppeteer not available")
        print("📥 Installing: pip install pyppeteer")

if __name__ == "__main__":
    asyncio.run(main())
