#!/usr/bin/env python3
"""
Conforama Email Scraper v2 - Enhanced Version
Uses serper.dev API to find seller contact information
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
MAX_PAGES = 20  # Full coverage - check all available pages

# Rate limiting variables
request_timestamps = []
total_requests = 0

# Email regex pattern - more comprehensive
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
        "page": page,
        "num": 10
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
    # Filter out common false positives and keep legitimate ones
    filtered = {
        email.lower() for email in emails 
        if not any(x in email.lower() for x in [
            'example.com', 'test.com', 'localhost', 'screenshot',
            'w3.org', 'example.test', 'your@email.com'
        ])
        and '@' in email
    }
    return filtered

def fetch_page_content(url: str) -> str:
    """Fetch page content and extract text"""
    rate_limit()
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
        response = requests.get(url, headers=headers, timeout=15, allow_redirects=True)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"  ⚠️  Failed to fetch {url}: {e}")
        return ""

def search_with_multiple_queries(domain: str, queries: List[str], max_pages: int = MAX_PAGES) -> List[Dict]:
    """
    Search using multiple queries to find seller contact pages
    Returns list of results with title, url, snippet
    Continues beyond max_pages if results are still available
    """
    all_results = []
    seen_urls = set()
    
    for query_template in queries:
        query = query_template.replace("{domain}", domain)
        print(f"\n🔍 Query: {query[:70]}...")
        
        page = 1
        while True:
            print(f"  📄 Page {page}...")
            
            data = make_serper_request(query, page)
            
            if not data or 'organic' not in data:
                print(f"  ⚠️  No more results or API error")
                break
            
            results = data.get('organic', [])
            if not results:
                print(f"  ✅ No more results for this query")
                break
            
            for result in results:
                url = result.get('link', '') or result.get('url', '')
                if url and url not in seen_urls:
                    seen_urls.add(url)
                    all_results.append(result)
            
            print(f"  📊 Found {len(results)} results (unique total: {len(all_results)})")
            
            # Check if we should continue
            page += 1
            if page > max_pages:
                # Check if there might be more results
                if len(results) < 10:
                    print(f"  ✅ Less than 10 results, assuming end of results")
                    break
                print(f"  ⚠️  Reached max_pages ({max_pages}) but results continue")
                print(f"  📌 Stopping at max_pages limit to preserve API quota")
                break
    
    return all_results

def scrape_conforama_enhanced(domain: str, country_code: str, output_file: str) -> Dict:
    """
    Enhanced scraping with multiple search strategies
    """
    emails_found = set()
    urls_processed = 0
    urls_fetched = 0
    errors = []
    email_sources = {}  # Track which URL each email came from
    
    # Define search queries for this country
    if country_code == 'fr':
        search_queries = [
            f'site:{domain}/marchand/*',
            f'site:{domain} intext:"@" intext:"marchand"',
            f'site:{domain} contact vendeur',
            f'site:{domain} email contact',
            f'site:{domain} marketplace seller',
        ]
    else:  # es
        search_queries = [
            f'site:{domain} intext:"@" vendedor',
            f'site:{domain} contacto vendedor',
            f'site:{domain} email contacto',
            f'site:{domain} vendedor mercado',
        ]
    
    # Step 1: Search for pages
    print(f"\n🔍 Searching {domain}...")
    results = search_with_multiple_queries(domain, search_queries, max_pages=MAX_PAGES)
    
    print(f"\n📝 Processing {len(results)} unique URLs...")
    
    # Step 2: Visit each URL and extract emails
    for i, result in enumerate(results, 1):
        url = result.get('link', '') or result.get('url', '')
        title = result.get('title', 'Unknown')
        snippet = result.get('snippet', '')
        
        if not url:
            continue
        
        print(f"\n  [{i}/{len(results)}] {title[:50]}...")
        print(f"      URL: {url[:70]}...")
        
        # First check if snippet already contains emails
        snippet_emails = extract_emails_from_text(snippet)
        if snippet_emails:
            print(f"    ✅ Found {len(snippet_emails)} email(s) in snippet!")
            for email in snippet_emails:
                if email not in email_sources:
                    email_sources[email] = f"{title} (snippet)"
            emails_found.update(snippet_emails)
        
        # Then fetch page content
        content = fetch_page_content(url)
        
        if content:
            urls_fetched += 1
            urls_processed += 1
            emails = extract_emails_from_text(content)
            
            if emails:
                print(f"    ✅ Found {len(emails)} email(s) in page content")
                for email in emails:
                    if email not in email_sources:
                        email_sources[email] = title
                emails_found.update(emails)
            else:
                print(f"    ℹ️  No emails found")
        else:
            errors.append(url)
    
    # Step 3: Save to CSV with more detail
    print(f"\n💾 Saving to {output_file}...")
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Email', 'Source', 'Domain'])
        for email in sorted(emails_found):
            writer.writerow([email, email_sources.get(email, 'Unknown'), domain])
    
    return {
        'domain': domain,
        'country': country_code,
        'urls_found': len(results),
        'urls_fetched': urls_fetched,
        'urls_processed': urls_processed,
        'unique_emails': len(emails_found),
        'errors': len(errors),
        'emails': list(emails_found),
        'email_sources': email_sources
    }

def main():
    """Main execution"""
    print("="*60)
    print("🔧 Conforama Email Scraper v2")
    print("="*60)
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📊 Rate limit: {MAX_REQUESTS_PER_SECOND} req/s, {DELAY_BETWEEN_REQUESTS}s delay")
    
    results = []
    
    # Phase 2: French site
    print("\n" + "="*60)
    print("🇫🇷 PHASE 2: Scraping Conforama France")
    print("="*60)
    
    fr_result = scrape_conforama_enhanced(
        "conforama.fr",
        "fr",
        "conforama-fr-full-emails.csv"
    )
    results.append(fr_result)
    
    # Phase 3: Spanish site
    print("\n" + "="*60)
    print("🇪🇸 PHASE 3: Scraping Conforama Spain")
    print("="*60)
    
    es_result = scrape_conforama_enhanced(
        "conforama.es",
        "es",
        "conforama-es-full-emails.csv"
    )
    results.append(es_result)
    
    # Summary
    print("\n" + "="*60)
    print("📊 SUMMARY")
    print("="*60)
    
    total_urls_found = sum(r['urls_found'] for r in results)
    total_urls_fetched = sum(r['urls_fetched'] for r in results)
    total_urls_processed = sum(r['urls_processed'] for r in results)
    total_emails = sum(r['unique_emails'] for r in results)
    
    for result in results:
        print(f"\n🌐 {result['domain']} ({result['country'].upper()}):")
        print(f"   URLs found: {result['urls_found']}")
        print(f"   URLs fetched: {result['urls_fetched']}")
        print(f"   URLs processed: {result['urls_processed']}")
        print(f"   Unique emails: {result['unique_emails']}")
        print(f"   Errors: {result['errors']}")
        
        if result['emails']:
            print(f"   Sample emails:")
            for email in list(result['emails'])[:5]:
                print(f"     - {email}")
    
    print(f"\n📈 TOTAL:")
    print(f"   URLs found: {total_urls_found}")
    print(f"   URLs fetched: {total_urls_fetched}")
    print(f"   URLs processed: {total_urls_processed}")
    print(f"   Unique emails: {total_emails}")
    print(f"   API requests: {total_requests}")
    print(f"⏰ Finished at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)
    
    # Save all emails to combined file
    all_emails = set()
    all_sources = {}
    for result in results:
        for email in result['emails']:
            all_emails.add(email)
            all_sources[email] = all_sources.get(email, []) + [result['country']]
    
    with open('conforama-all-emails.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Email', 'Countries'])
        for email in sorted(all_emails):
            countries = ', '.join(set(all_sources[email]))
            writer.writerow([email, countries])
    
    print(f"\n✅ Combined emails saved to: conforama-all-emails.csv")
    print(f"📁 Individual files:")
    print(f"   - conforama-fr-full-emails.csv")
    print(f"   - conforama-es-full-emails.csv")

if __name__ == "__main__":
    main()
