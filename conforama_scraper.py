#!/usr/bin/env python3
"""
Conforama Email Scraper with Rate Limiting
Uses serper.dev API to find seller pages and extract email addresses
"""

import requests
import re
import csv
import time
import json
from datetime import datetime
from typing import List, Set, Dict
import os

# Configuration
SERPER_API_KEY = "e09ed258e1c8db784354868198bd915e1fb7181d"
MAX_REQUESTS_PER_SECOND = 5
DELAY_BETWEEN_REQUESTS = 1.0  # seconds
MAX_PAGES = 10  # Maximum pages to iterate per site

# Rate limiting variables
request_timestamps = []
total_requests = 0

# Email regex pattern
EMAIL_PATTERN = re.compile(
    r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
)

def rate_limit():
    """Implement rate limiting - max 5 requests per second, 1s delay between requests"""
    global request_timestamps, total_requests
    
    current_time = time.time()
    
    # Remove timestamps older than 1 second
    request_timestamps = [t for t in request_timestamps if current_time - t < 1.0]
    
    # If we've hit the limit, wait
    if len(request_timestamps) >= MAX_REQUESTS_PER_SECOND:
        sleep_time = 1.0 - (current_time - request_timestamps[0])
        if sleep_time > 0:
            print(f"  ⏳ Rate limit reached, waiting {sleep_time:.2f}s...")
            time.sleep(sleep_time)
            current_time = time.time()
    
    # Always add at least 1 second delay between requests
    if request_timestamps:
        time_since_last = current_time - request_timestamps[-1]
        if time_since_last < DELAY_BETWEEN_REQUESTS:
            time.sleep(DELAY_BETWEEN_REQUESTS - time_since_last)
    
    # Record this request
    request_timestamps.append(time.time())
    total_requests += 1

def make_serper_request(query: str, page: int = 1) -> Dict:
    """Make a request to serper.dev API with rate limiting"""
    rate_limit()
    
    url = "https://google.serper.dev/search"
    headers = {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "q": query,
        "page": page
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"  ❌ API request failed: {e}")
        return {}

def extract_emails_from_text(text: str) -> Set[str]:
    """Extract all email addresses from text"""
    emails = set(EMAIL_PATTERN.findall(text))
    # Filter out common false positives
    filtered = {
        email for email in emails 
        if not any(x in email for x in ['example.com', 'test.com', 'localhost', 'screenshot'])
    }
    return filtered

def fetch_page_content(url: str) -> str:
    """Fetch page content and extract text"""
    rate_limit()
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=15, allow_redirects=True)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"  ⚠️  Failed to fetch {url}: {e}")
        return ""

def search_site(domain: str, start_page: int = 1, max_pages: int = MAX_PAGES) -> List[Dict]:
    """
    Search for pages on a domain using serper.dev
    Returns list of results with title, url, snippet
    """
    all_results = []
    
    print(f"\n🔍 Searching {domain}...")
    
    for page in range(start_page, start_page + max_pages):
        query = f"site:{domain}"
        print(f"\n  📄 Page {page}:")
        
        data = make_serper_request(query, page)
        
        if not data or 'organic' not in data:
            print(f"  ⚠️  No more results or API error on page {page}")
            break
        
        results = data.get('organic', [])
        if not results:
            print(f"  ✅ No more results on page {page}")
            break
        
        print(f"  📊 Found {len(results)} results")
        all_results.extend(results)
        
        # Check if there are more pages available
        if data.get('searchInformation', {}).get('totalResults', 0) <= len(all_results):
            break
    
    return all_results

def scrape_conforama_site(domain: str, output_file: str) -> Dict:
    """
    Scrape a Conforama site for emails
    Returns summary dict with stats
    """
    emails_found = set()
    urls_processed = 0
    errors = []
    
    # Step 1: Search for seller/marchand pages
    search_query = f"site:{domain}"
    if 'conforama.fr' in domain:
        search_query = f"site:https://www.conforama.fr/marchand/*"
    elif 'conforama.es' in domain:
        search_query = f"site:https://www.conforama.es/"
    
    results = search_site(domain, max_pages=MAX_PAGES)
    
    print(f"\n📝 Processing {len(results)} URLs...")
    
    # Step 2: Visit each URL and extract emails
    for i, result in enumerate(results, 1):
        url = result.get('link', '') or result.get('url', '')
        title = result.get('title', 'Unknown')
        
        print(f"\n  [{i}/{len(results)}] {title[:60]}...")
        
        if not url:
            continue
        
        # Fetch page content
        content = fetch_page_content(url)
        
        if content:
            urls_processed += 1
            emails = extract_emails_from_text(content)
            
            if emails:
                print(f"    ✅ Found {len(emails)} email(s)")
                emails_found.update(emails)
            else:
                print(f"    ℹ️  No emails found")
        else:
            errors.append(url)
    
    # Step 3: Save to CSV
    print(f"\n💾 Saving to {output_file}...")
    
    os.makedirs(os.path.dirname(output_file) if os.path.dirname(output_file) else '.', exist_ok=True)
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Email', 'Source'])
        for email in sorted(emails_found):
            writer.writerow([email, domain])
    
    return {
        'domain': domain,
        'urls_processed': urls_processed,
        'urls_found': len(results),
        'unique_emails': len(emails_found),
        'errors': len(errors),
        'emails': list(emails_found)
    }

def main():
    """Main execution"""
    print("="*60)
    print("🔧 Conforama Email Scraper")
    print("="*60)
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📊 Rate limit: {MAX_REQUESTS_PER_SECOND} req/s, {DELAY_BETWEEN_REQUESTS}s delay")
    
    results = []
    
    # Phase 2: French site
    print("\n" + "="*60)
    print("🇫🇷 PHASE 2: Scraping Conforama France")
    print("="*60)
    
    fr_result = scrape_conforama_site(
        "https://www.conforama.fr/marchand/",
        "conforama-fr-emails.csv"
    )
    results.append(fr_result)
    
    # Phase 3: Spanish site
    print("\n" + "="*60)
    print("🇪🇸 PHASE 3: Scraping Conforama Spain")
    print("="*60)
    
    es_result = scrape_conforama_site(
        "https://www.conforama.es/",
        "conforama-es-emails.csv"
    )
    results.append(es_result)
    
    # Summary
    print("\n" + "="*60)
    print("📊 SUMMARY")
    print("="*60)
    
    total_urls = sum(r['urls_processed'] for r in results)
    total_emails = sum(r['unique_emails'] for r in results)
    
    for result in results:
        print(f"\n🌐 {result['domain']}:")
        print(f"   URLs found: {result['urls_found']}")
        print(f"   URLs processed: {result['urls_processed']}")
        print(f"   Unique emails: {result['unique_emails']}")
        print(f"   Errors: {result['errors']}")
    
    print(f"\n📈 TOTAL:")
    print(f"   URLs processed: {total_urls}")
    print(f"   Unique emails: {total_emails}")
    print(f"   API requests: {total_requests}")
    print(f"⏰ Finished at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)
    
    # Save all emails to combined file
    all_emails = set()
    for result in results:
        all_emails.update(result['emails'])
    
    with open('conforama-all-emails.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Email', 'Source'])
        for email in sorted(all_emails):
            source = 'FR' if email in results[0]['emails'] else 'ES'
            if email in results[0]['emails'] and email in results[1]['emails']:
                source = 'Both'
            writer.writerow([email, source])
    
    print(f"\n✅ Combined emails saved to: conforama-all-emails.csv")

if __name__ == "__main__":
    main()
