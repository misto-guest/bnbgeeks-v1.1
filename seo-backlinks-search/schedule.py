#!/usr/bin/env python3
"""
Weekly Scheduler - Automated weekly scrapes with comparison
"""

import os
import json
import glob
from datetime import datetime, timedelta
from scraper import SEOScraper
from formatter import MarkdownFormatter


def get_latest_results(results_dir='results', query=None) -> dict:
    """Get the most recent results file"""
    pattern = os.path.join(results_dir, '*.json')
    files = glob.glob(pattern)
    
    if not files:
        return None
    
    # Sort by modification time
    files.sort(key=lambda x: os.path.getmtime(x), reverse=True)
    
    # Load latest
    try:
        with open(files[0], 'r') as f:
            data = json.load(f)
            return data
    except:
        return None


def run_weekly_scrape(queries: list, output_dir='results'):
    """
    Run weekly scraping for multiple queries
    
    Args:
        queries: List of queries to scrape
        output_dir: Output directory
    """
    print("📅 Starting Weekly SEO Scraping")
    print("="*60)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Queries: {len(queries)}")
    print("")
    
    scraper = SEOScraper()
    all_results = []
    
    for query in queries:
        print(f"\n🔍 Scraping: {query}")
        print("-"*60)
        
        try:
            results = scraper.scrape(query, max_pages=2)
            all_results.append(results)
            
            # Save individual query results
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            safe_query = "".join(c if c.isalnum() or c in (' ', '-', '_') else '_' for c in query)
            safe_query = safe_query.replace(' ', '_')[:50]
            
            base_filename = f"weekly_{safe_query}_{timestamp}"
            
            json_path = os.path.join(output_dir, f"{base_filename}.json")
            with open(json_path, 'w') as f:
                json.dump(results, f, indent=2)
            
            md_path = os.path.join(output_dir, f"{base_filename}.md")
            MarkdownFormatter.save_markdown(results, md_path)
            
            print(f"✅ {results['new_results']} new links")
            print(f"📁 {json_path}")
            print(f"📝 {md_path}")
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            continue
    
    # Create weekly summary
    print("\n" + "="*60)
    print("📊 WEEKLY SUMMARY")
    print("="*60)
    
    total_new = sum(r['new_results'] for r in all_results)
    total_found = sum(r['total_results'] for r in all_results)
    
    print(f"Queries: {len(queries)}")
    print(f"Total Results: {total_found}")
    print(f"New Unique: {total_new} ✨")
    print(f"Duplicates: {total_found - total_new}")
    print("")
    
    # Save combined summary
    summary_path = os.path.join(output_dir, f"weekly_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md")
    
    summary_md = []
    summary_md.append("# 📅 Weekly SEO Scraping Report")
    summary_md.append("")
    summary_md.append(f"**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    summary_md.append(f"**Queries:** {len(queries)}")
    summary_md.append(f"**Total Results:** {total_found}")
    summary_md.append(f"**New Unique Links:** {total_new} ✨")
    summary_md.append("")
    summary_md.append("---")
    summary_md.append("")
    
    for result in all_results:
        summary_md.append(f"## {result['query']}")
        summary_md.append(f"- New Links: {result['new_results']}")
        summary_md.append(f"- Total Found: {result['total_results']}")
        summary_md.append("")
        
        if result['new_results'] > 0:
            summary_md.append("### New Links:")
            for r in result['results'][:10]:  # Show top 10
                summary_md.append(f"- [{r['title']}]({r['link']})")
            if len(result['results']) > 10:
                summary_md.append(f"- ... and {len(result['results']) - 10} more")
            summary_md.append("")
    
    with open(summary_path, 'w') as f:
        f.write("\n".join(summary_md))
    
    print(f"📝 Weekly summary: {summary_path}")
    print("")
    
    # Send summary (would integrate with message tool in main agent)
    print("💡 To send this report, configure webhook/notification")
    
    return all_results


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Weekly SEO Scraping Scheduler')
    parser.add_argument('--queries', nargs='+', default=[
        'seo link building services',
        'backlink indexer tools',
        'guest posting services SEO',
        'blogger outreach link building',
        'white hat backlinks service'
    ], help='Queries to scrape')
    parser.add_argument('--output-dir', default='results', help='Output directory')
    
    args = parser.parse_args()
    
    run_weekly_scrape(args.queries, args.output_dir)
