#!/usr/bin/env python3
"""
SEO Query Manager - Scheduler
Integrates with cron for scheduled scraping
"""

import os
import sys
from datetime import datetime
from typing import Optional

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import Database, QueryManager, ResultManager, LogManager
from scraper import SEOScraper


def run_scheduled_scrapes(schedule: str):
    """
    Run all queries with a specific schedule
    
    Args:
        schedule: One of 'daily', 'weekly', 'monthly'
    """
    print(f"📅 Starting {schedule} scrape run")
    print("="*60)
    
    # Initialize database and managers
    db = Database()
    query_manager = QueryManager(db)
    result_manager = ResultManager(db)
    log_manager = LogManager(db)
    
    # Get queries for this schedule
    queries = query_manager.get_scheduled_queries(schedule)
    
    if not queries:
        print(f"No queries found for {schedule} schedule")
        return
    
    print(f"Found {len(queries)} queries to process")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("")
    
    # Initialize scraper
    scraper = SEOScraper()
    
    total_new = 0
    total_errors = 0
    
    for query in queries:
        print(f"\n🔍 Query: {query['query']}")
        print("-"*60)
        
        # Log start
        log_id = log_manager.log_start(query['id'], f'{schedule}_scrape')
        
        try:
            # Scrape
            results = scraper.scrape(
                query['query'],
                max_pages=query['max_pages'],
                region=query['region']
            )
            
            # Save results
            result_id = result_manager.add_result(query['id'], results)
            
            # Log completion
            log_manager.log_complete(
                log_id,
                f"Scraped {results['new_results']} new results (ID: {result_id})"
            )
            
            total_new += results['new_results']
            
            print(f"✅ Total: {results['total_results']}")
            print(f"✨ New: {results['new_results']}")
            print(f"📄 Pages: {results['pages_scraped']}/{results['pages_requested']}")
            
        except Exception as e:
            error_msg = str(e)
            log_manager.log_error(log_id, error_msg)
            total_errors += 1
            print(f"❌ Error: {error_msg}")
    
    # Print summary
    print("\n" + "="*60)
    print("📊 SUMMARY")
    print("="*60)
    print(f"Queries processed: {len(queries)}")
    print(f"Total new results: {total_new} ✨")
    print(f"Errors: {total_errors}")
    print(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("")
    
    db.close()


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='SEO Query Manager Scheduler')
    parser.add_argument(
        'schedule',
        choices=['daily', 'weekly', 'monthly'],
        help='Schedule type to run'
    )
    
    args = parser.parse_args()
    
    run_scheduled_scrapes(args.schedule)
