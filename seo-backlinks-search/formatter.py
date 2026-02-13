#!/usr/bin/env python3
"""
Markdown Formatter - Convert scraper results to copy-paste markdown
"""

import os
import json
from datetime import datetime
from typing import Dict, List


class MarkdownFormatter:
    """Format scraper results as markdown"""
    
    @staticmethod
    def format_results(data: Dict, include_all: bool = False) -> str:
        """
        Format results as markdown
        
        Args:
            data: Scraper results dict
            include_all: If False, only show new results
        
        Returns:
            Markdown formatted string
        """
        query = data.get('query', 'Unknown Query')
        scraped_at = data.get('scraped_at', '')
        total = data.get('total_results', 0)
        new = data.get('new_results', 0)
        results = data.get('results', [])
        
        # Parse timestamp
        try:
            dt = datetime.fromisoformat(scraped_at)
            date_str = dt.strftime("%Y-%m-%d %H:%M:%S")
        except:
            date_str = scraped_at
        
        # Build markdown
        md = []
        md.append(f"# 🔍 SEO Backlinks Search Results")
        md.append("")
        md.append(f"**Query:** `{query}`")
        md.append(f"**Scraped:** {date_str}")
        md.append(f"**Pages:** {data.get('pages_scraped', 0)} of {data.get('pages_requested', 0)}")
        md.append(f"**Total Found:** {total}")
        md.append(f"**New Unique Links:** {new} ✨")
        md.append("")
        md.append("---")
        md.append("")
        
        if not results:
            md.append("*No new unique links found. All results already in database.*")
            md.append("")
            return "\n".join(md)
        
        # Group results by domain
        by_domain = {}
        for result in results:
            domain = result.get('domain', 'unknown')
            if domain not in by_domain:
                by_domain[domain] = []
            by_domain[domain].append(result)
        
        # Results table
        md.append(f"## 📊 Results ({new} new links)")
        md.append("")
        md.append("| # | Domain | Title | Link |")
        md.append("|---|--------|-------|------|")
        
        for i, result in enumerate(results, 1):
            domain = result.get('domain', '')
            title = result.get('title', '')[:50] + '...' if len(result.get('title', '')) > 50 else result.get('title', '')
            link = result.get('link', '')
            
            md.append(f"| {i} | `{domain}` | {title} | [Link]({link}) |")
        
        md.append("")
        
        # Domain breakdown
        md.append("## 🌐 Domain Breakdown")
        md.append("")
        
        sorted_domains = sorted(by_domain.items(), key=lambda x: len(x[1]), reverse=True)
        for domain, items in sorted_domains:
            md.append(f"- **{domain}** - {len(items)} link(s)")
        
        md.append("")
        
        # Copy-paste section
        md.append("---")
        md.append("## 📋 Copy-Paste Links")
        md.append("")
        md.append("```")
        for result in results:
            md.append(result['link'])
        md.append("```")
        md.append("")
        
        # Metadata footer
        md.append("---")
        md.append(f"*Generated: {date_str}*")
        md.append(f"*Region: {data.get('region', 'us').upper()}*")
        
        return "\n".join(md)
    
    @staticmethod
    def save_markdown(data: Dict, output_path: str) -> str:
        """
        Save formatted markdown to file
        
        Args:
            data: Scraper results
            output_path: Path to save markdown file
        
        Returns:
            Path to saved file
        """
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        md_content = MarkdownFormatter.format_results(data)
        
        with open(output_path, 'w') as f:
            f.write(md_content)
        
        return output_path
    
    @staticmethod
    def format_weekly_summary(current_results: Dict, previous_results: Dict) -> str:
        """
        Format weekly comparison summary
        
        Args:
            current_results: This week's results
            previous_results: Last week's results
        
        Returns:
            Markdown formatted summary
        """
        md = []
        md.append("# 📅 Weekly SEO Scraping Summary")
        md.append("")
        
        current_new = current_results.get('new_results', 0)
        prev_new = previous_results.get('new_results', 0) if previous_results else 0
        current_query = current_results.get('query', 'Unknown')
        
        md.append(f"## This Week: {current_new} New Links ✨")
        md.append(f"**Query:** `{current_query}`")
        md.append(f"**Last Week:** {prev_new} new links")
        md.append("")
        
        if current_new > 0:
            md.append("### 🔗 New Links This Week:")
            md.append("")
            
            results = current_results.get('results', [])
            by_domain = {}
            for result in results:
                domain = result.get('domain', 'unknown')
                if domain not in by_domain:
                    by_domain[domain] = []
                by_domain[domain].append(result)
            
            for domain, items in sorted(by_domain.items(), key=lambda x: len(x[1]), reverse=True):
                md.append(f"#### {domain} ({len(items)} links)")
                for item in items:
                    md.append(f"- [{item['title']}]({item['link']})")
                md.append("")
        else:
            md.append("*No new unique links found this week.*")
            md.append("")
        
        # Comparison
        if previous_results:
            change = current_new - prev_new
            if change > 0:
                md.append(f"📈 **+{change}** more links than last week")
            elif change < 0:
                md.append(f"📉 **{change}** fewer links than last week")
            else:
                md.append("➡️ Same number of links as last week")
            md.append("")
        
        return "\n".join(md)


if __name__ == "__main__":
    # Test formatter
    test_data = {
        'query': 'test query',
        'scraped_at': datetime.now().isoformat(),
        'region': 'us',
        'pages_requested': 2,
        'pages_scraped': 2,
        'total_results': 3,
        'new_results': 3,
        'results': [
            {
                'position': 1,
                'title': 'Test Title 1',
                'link': 'https://example1.com',
                'domain': 'example1.com'
            },
            {
                'position': 2,
                'title': 'Test Title 2',
                'link': 'https://example2.com',
                'domain': 'example2.com'
            },
            {
                'position': 3,
                'title': 'Test Title 3',
                'link': 'https://example3.com',
                'domain': 'example3.com'
            }
        ]
    }
    
    md = MarkdownFormatter.format_results(test_data)
    print(md)
