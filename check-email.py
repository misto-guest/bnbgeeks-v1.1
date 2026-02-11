#!/usr/bin/env python3

import requests
import time
import re
import sys

def check_10minutemail_inbox(email_address):
    """Check 10minutemail inbox for Property Magic email"""

    print(f"🔍 Checking inbox for: {email_address}")

    # 10minutemail API endpoint
    api_url = "https://10minutemail.com/api"

    try:
        # Get session token (from the email)
        session_response = requests.get(f"{api_url}/mail/{email_address}/timeout", timeout=10)

        if session_response.status_code == 200:
            print("✅ Connected to 10minutemail")

        # Get mailbox
        mailbox_response = requests.get(f"{api_url}/mail/{email_address}", timeout=10)

        if mailbox_response.status_code == 200:
            emails = mailbox_response.json()

            print(f"📬 Found {len(emails)} emails")

            for email in emails:
                from_name = email.get('from', '').lower()
                subject = email.get('subject', '').lower()

                print(f"\n📨 Email from: {email.get('from')}")
                print(f"   Subject: {email.get('subject')}")

                if 'property' in from_name or 'rick' in from_name or 'magic' in subject:
                    print("✅ FOUND PROPERTY MAGIC EMAIL!")

                    # Get email body
                    body = email.get('body', email.get('text', ''))

                    # Look for download link
                    download_links = re.findall(r'https?://[^\s<>"]+\.pdf[^\s<>"]*', body)

                    if download_links:
                        print(f"📥 Found PDF link: {download_links[0]}")

                        # Download the PDF
                        download_pdf(download_links[0])
                        return True
                    else:
                        # Try to find any link
                        all_links = re.findall(r'https?://[^\s<>"]+', body)
                        print(f"🔗 Found {len(all_links)} links")
                        for link in all_links:
                            print(f"   - {link}")

                        return True

        else:
            print(f"❌ Failed to get mailbox: {mailbox_response.status_code}")

    except Exception as e:
        print(f"❌ Error checking email: {e}")

    return False

def download_pdf(url):
    """Download PDF from URL"""

    print(f"\n📥 Downloading PDF from: {url}")

    try:
        response = requests.get(url, timeout=30, stream=True)

        if response.status_code == 200:
            filename = '/Users/northsea/clawd-dmitry/Property-Magic-Book.pdf'

            with open(filename, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)

            print(f"✅ PDF saved to: {filename}")
            return True
        else:
            print(f"❌ Failed to download: {response.status_code}")

    except Exception as e:
        print(f"❌ Error downloading PDF: {e}")

    return False

if __name__ == "__main__":
    email = "temp1770641295@10minutemail.com"

    print("=" * 50)
    print("Property Magic Book - Email Checker")
    print("=" * 50)
    print()

    # Check immediately
    if check_10minutemail_inbox(email):
        print("\n✅ SUCCESS!")
        sys.exit(0)
    else:
        print("\n⏳ Email not received yet, waiting 30 seconds...")
        time.sleep(30)

        # Check again
        if check_10minutemail_inbox(email):
            print("\n✅ SUCCESS!")
            sys.exit(0)
        else:
            print("\n❌ Email not received")
            print("📋 Manual check needed:")
            print(f"   Visit: https://10minutemail.com")
            print(f"   Email: {email}")
            sys.exit(1)
