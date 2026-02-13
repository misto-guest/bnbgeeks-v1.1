#!/usr/bin/env python3
"""
SEO Backlinks Scraper - Main Module
Fetches SERP results from Serper.dev API with deduplication and logging
"""

import os
import json
import logging
from datetime import datetime
from typing import List, Dict, Optional
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ScraperLogger:
    """Centralized logging system for scrapes"""
    
    def __init__(self, log_dir: str = "logs"):
        self.log_dir = log_dir
        os.makedirs(log_dir, exist_ok=True)
        
        # Setup logging
        log_file = os.path.join(log_dir, "scrapes.log")
        
        # Configure logger
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s | %(levelname)s | %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def log_scrape_start(self, query: str, pages: int):
        """Log the start of a scrape operation"""
        self.logger.info(f"SCRAPER START | Query: '{query}' | Pages: {pages}")
    
    def log_scrape_complete(self, query: str, pages: int, total_results: int, new_results: int):
        """Log completion with stats"""
        self.logger.info(
            f"SCRAPER COMPLETE | Query: '{query}' | "
            f"Pages: {pages} | Total: {total_results} | New: {new_results}"
        )
    
    def log_error(self, message: str):
        """Log error"""
        self.logger.error(f"ERROR | {message}")
    
    def log_dedup(self, total: int, duplicates: int, unique: int):
        """Log deduplication stats"""
        self.logger.info(f"DEDUPLICATION | Total: {total} | Duplicates: {duplicates} | Unique: {unique}")


class DeduplicationDB:
    """Master URL database for deduplication"""
    
    def __init__(self, db_path: str = "data/master-urls.json"):
        self.db_path = db_path
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        self.urls = self._load_db()
    
    def _load_db(self) -> set:
        """Load existing URLs from database"""
        if os.path.exists(self.db_path):
            with open(self.db_path, 'r') as f:
                data = json.load(f)
                return set(data.get('urls', []))
        return set()
    
    def save_db(self):
        """Save URLs to database"""
        with open(self.db_path, 'w') as f:
            json.dump({'urls': list(self.urls)}, f, indent=2)
    
    def add_urls(self, urls: List[str]) -> int:
        """Add new URLs to database, return count of new URLs"""
        new_urls = [url for url in urls if url not in self.urls]
        for url in new_urls:
            self.urls.add(url)
        self.save_db()
        return len(new_urls)
    
    def filter_new(self, results: List[Dict]) -> List[Dict]:
        """Filter results to only include new URLs"""
        new_results = [r for r in results if r['link'] not in self.urls]
        return new_results


class SEOScraper:
    """Main SEO backlinks scraper using Serper.dev API"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('SERPER_API_KEY')
        if not self.api_key:
            raise ValueError("Serper API key not found. Set SERPER_API_KEY in .env")
        
        self.base_url = "https://google.serper.dev/search"
        self.logger = ScraperLogger()
        self.dedup = DeduplicationDB()
    
    def fetch_page(self, query: str, start: int = 0, num: int = 10) -> Dict:
        """Fetch a single page of results"""
        params = {
            'q': query,
            'start': start,
            'num': num
        }
        
        headers = {
            'X-API-KEY': self.api_key,
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.get(self.base_url, params=params, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            self.logger.log_error(f"API request failed: {str(e)}")
            raise
    
    def scrape(self, query: str, max_pages: int = 1, region: str = "us", gl: str = "us") -> Dict:
        """
        Scrape SERP results for a query
        
        Args:
            query: Search query
            max_pages: Number of pages to scrape (1-10)
            region: Region code (default: us)
            gl: Geolocation parameter (default: us)
        
        Returns:
            Dict with results and metadata
        """
        self.logger.log_scrape_start(query, max_pages)
        
        all_results = []
        consecutive_empty = 0
        pages_scraped = 0
        
        for page in range(max_pages):
            start = page * 10
            
            try:
                self.logger.logger.info(f"Fetching page {page + 1} (start={start})...")
                
                data = self.fetch_page(query, start=start)
                
                # Extract organic results
                organic = data.get('organic', [])
                
                if not organic:
                    consecutive_empty += 1
                    self.logger.logger.warning(f"No results on page {page + 1}")
                    
                    if consecutive_empty >= 2:
                        self.logger.logger.info("Stopping: 2 consecutive empty pages")
                        break
                    continue
                
                consecutive_empty = 0
                pages_scraped += 1
                
                # Normalize results
                for result in organic:
                    if result.get('link'):
                        all_results.append({
                            'position': result.get('position'),
                            'title': result.get('title'),
                            'link': result.get('link'),
                            'snippet': result.get('snippet', ''),
                            'domain': self._extract_domain(result.get('link', '')),
                            'scraped_at': datetime.now().isoformat()
                        })
                
                # Rate limiting
                import time
                time.sleep(0.5)
                
            except Exception as e:
                self.logger.log_error(f"Failed to fetch page {page + 1}: {str(e)}")
                continue
        
        # Filter out duplicates against master DB
        total_results = len(all_results)
        new_results = self.dedup.filter_new(all_results)
        
        # Add new URLs to database
        new_urls = [r['link'] for r in new_results]
        new_count = self.dedup.add_urls(new_urls)
        
        self.logger.log_dedup(total_results, total_results - len(new_results), len(new_results))
        
        result = {
            'query': query,
            'scraped_at': datetime.now().isoformat(),
            'region': region,
            'pages_requested': max_pages,
            'pages_scraped': pages_scraped,
            'total_results': total_results,
            'new_results': len(new_results),
            'duplicate_results': total_results - len(new_results),
            'results': new_results
        }
        
        self.logger.log_scrape_complete(
            query,
            pages_scraped,
            total_results,
            len(new_results)
        )
        
        return result
    
    def _extract_domain(self, url: str) -> str:
        """Extract domain from URL"""
        try:
            from urllib.parse import urlparse
            parsed = urlparse(url)
            return parsed.netloc
        except:
            return url


if __name__ == "__main__":
    import argparse
    from formatter import MarkdownFormatter
    
    parser = argparse.ArgumentParser(description='SEO Backlinks Scraper')
    parser.add_argument('query', help='Search query')
    parser.add_argument('--pages', type=int, default=1, help='Number of pages (1-10, default: 1)')
    parser.add_argument('--region', default='us', help='Region code (default: us)')
    parser.add_argument('--output-dir', default='results', help='Output directory')
    
    args = parser.parse_args()
    
    # Initialize scraper
    scraper = SEOScraper()
    
    # Scrape
    results = scraper.scrape(args.query, max_pages=args.pages, region=args.region)
    
    # Create output directory
    os.makedirs(args.output_dir, exist_ok=True)
    
    # Generate filename from query
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_query = "".join(c if c.isalnum() or c in (' ', '-', '_') else '_' for c in args.query)
    safe_query = safe_query.replace(' ', '_')[:50]
    
    base_filename = f"{safe_query}_{timestamp}"
    
    # Save JSON
    json_path = os.path.join(args.output_dir, f"{base_filename}.json")
    with open(json_path, 'w') as f:
        json.dump(results, f, indent=2)
    
    # Save Markdown
    md_path = os.path.join(args.output_dir, f"{base_filename}.md")
    MarkdownFormatter.save_markdown(results, md_path)
    
    # Print summary
    print("\n" + "="*60)
    print("✅ SCRAPING COMPLETE")
    print("="*60)
    print(f"Query: {args.query}")
    print(f"Pages: {results['pages_scraped']} of {results['pages_requested']}")
    print(f"Total Found: {results['total_results']}")
    print(f"New Unique: {results['new_results']} ✨")
    print(f"Duplicates: {results['duplicate_results']}")
    print("")
    print(f"📁 JSON saved: {json_path}")
    print(f"📝 Markdown: {md_path}")
    print("="*60)
    print("")
    
    # Print markdown to console
    print(MarkdownFormatter.format_results(results))
