# Dutch Portal Search Scraping Tool

A powerful web scraping tool that extracts Google search results using the Serper.dev API. Perfect for SEO research, competitive analysis, and bulk data collection.

## Features

✅ **Dual Interface**: Command-line tool and web-based UI  
✅ **Smart Pagination**: Automatically fetches multiple pages  
✅ **Rate Limiting**: Built-in delay to respect API limits  
✅ **Multiple Formats**: Output as human-readable copy format or JSON  
✅ **Progress Tracking**: Real-time progress indicators  
✅ **URL Parsing**: Extract queries from existing Google URLs  
✅ **Copy-Ready Output**: Optimized format for easy sharing  

## Prerequisites

- **Node.js** (v14 or higher) for CLI usage
- **Serper.dev API Key** (already configured)
- Modern web browser for web interface

## Installation

1. Clone or download this repository
2. Navigate to the scraping tool directory:
```bash
cd /Users/northsea/clawd-dmitry/dutch-portal-search/scraping-tool/
```

3. No additional npm packages required (uses native Node.js modules)

## Usage

### Command-Line Interface

#### Basic Search
```bash
node cli.js "your search query"
```

#### Multiple Pages
```bash
node cli.js "your search query" --pages 5
```

#### From Google URL
```bash
node cli.js --url "https://google.com/search?q=your+query" --pages 3
```

#### JSON Output
```bash
node cli.js "your search query" --pages 2 --format json
```

#### CLI Options
```
--url        Extract query from Google URL instead of entering query directly
--pages N    Number of pages to scrape (default: 1)
--format     Output format: copy (default) or json
```

### Web Interface

1. **Open the web app:**
   - Double-click `web-app.html`, or
   - Open in browser: `file:///path/to/scraping-tool/web-app.html`, or
   - Deploy to web server for remote access

2. **Choose Input Source:**
   - **Enter Query**: Type your search query directly
   - **Paste URL**: Extract query from existing Google search URL

3. **Configure Options:**
   - Select number of pages (1-20)
   - Choose output format (Copy or JSON)

4. **Start Search:**
   - Click "🚀 Start Search"
   - Watch real-time progress
   - Results appear automatically

5. **Copy Results:**
   - Click "📋 Copy Results" or "📋 Copy to Clipboard"
   - Paste into your document/spreadsheet

## Output Formats

### Copy Format (Default)
Human-readable format optimized for sharing:

```
Query: Coinsnight.com backlinks
Total Results: 30
==================================================

[Page 1]

1. Coinsnight.com - The Best Backlinks Indexer
   Link: https://coinsnight.com
   Snippet: Get your backlinks indexed fast with our...

2. Best Backlink Indexer Services 2024
   Link: https://example.com/best-indexers
   Snippet: Compare the top backlink indexing services...

[Page 2]
...
```

### JSON Format
Machine-readable for automation:

```json
{
  "query": "Coinsnight.com backlinks",
  "totalResults": 30,
  "timestamp": "2026-02-12T20:15:30.456Z",
  "results": [
    {
      "title": "Coinsnight.com - The Best Backlinks Indexer",
      "link": "https://coinsnight.com",
      "snippet": "Get your backlinks indexed fast...",
      "position": 1,
      "page": 1
    }
  ]
}
```

## API Configuration

The tool is pre-configured with your Serper.dev API key:
```
API Key: e09ed258e1c8db784354868198bd915e1fb7181d
Endpoint: https://google.serper.dev/search
```

### API Limits
- **Free Tier**: 2,500 searches per month
- **Rate Limiting**: Built-in 100ms delay between requests
- **Pagination**: Uses `page` parameter for multi-page results

### Modifying API Key
If you need to change the API key:

**CLI (`cli.js`):**
```javascript
// Line 16
const API_KEY = 'your-new-api-key-here';
```

**Web App (`web-app.html`):**
```javascript
// Line 244
const API_KEY = 'your-new-api-key-here';
```

## Examples

### Example 1: SEO Research
```bash
# Search competitor backlinks
node cli.js "site:coinsnight.com backlinks" --pages 5
```

### Example 2: Bulk Data Collection
```bash
# Export to JSON for processing
node cli.js "Dutch crypto exchanges" --pages 10 --format json > results.json
```

### Example 3: URL Analysis
```bash
# Extract from existing search
node cli.js --url "https://google.com/search?q=best+seo+tools+2024" --pages 3
```

### Example 4: Web Interface
1. Open `web-app.html` in browser
2. Paste URL: `https://google.com/search?q=Netherlands+SEO+agencies`
3. Set pages to 10
4. Click Start
5. Copy results to spreadsheet

## Troubleshooting

### Issue: "API request failed"
**Solution**: Check your Serper.dev API key and quota
- Visit https://serper.dev to verify account status
- Ensure you haven't exceeded 2,500 searches/month limit

### Issue: "No more results found"
**Solution**: Google has no additional results for this query
- Try a broader search query
- Reduce page count

### Issue: "Invalid URL format"
**Solution**: Ensure URL is properly formatted
- Must be a valid Google search URL
- Should contain `?q=` parameter

### Issue: Slow performance
**Solution**: The tool includes rate limiting
- Default delay: 100ms between pages
- Adjust `RATE_LIMIT_DELAY` in `cli.js` if needed

## Advanced Usage

### Export to CSV
```bash
# Get JSON output, convert to CSV
node cli.js "your query" --pages 5 --format json | jq -r '.results[] | [.title, .link, .snippet] | @csv' > results.csv
```

### Batch Processing
```bash
# Process multiple queries from file
while IFS= read -r query; do
  node cli.js "$query" --pages 3 >> "results_$(date +%Y%m%d).txt"
done < queries.txt
```

### Integration with Other Tools
```javascript
// Import as module in Node.js
const { scrape, extractOrganicResults, formatCopyOutput } = require('./cli.js');

// Use programmatically
const results = await scrape({
  query: 'your query',
  pages: 5,
  format: 'json'
});
```

## File Structure

```
scraping-tool/
├── cli.js           # Command-line interface (Node.js)
├── web-app.html     # Web-based UI (HTML/CSS/JS)
└── README.md        # This documentation
```

## Technical Details

### Dependencies
- **CLI**: Native Node.js modules only (https, url)
- **Web App**: Vanilla JavaScript (no frameworks)

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ❌ Not supported (uses modern JS)

### Performance
- **Single page fetch**: ~0.5-2 seconds
- **10 pages**: ~5-20 seconds (with rate limiting)
- **100 results**: ~10-50KB output size

## Security Notes

⚠️ **API Key Exposure**: 
- The API key is embedded in the source files
- Don't commit public repositories with exposed keys
- For public deployment, use environment variables

✅ **Safe Usage**:
- Local development: ✅ Safe
- Private internal tools: ✅ Safe
- Public web deployment: ⚠️ Use backend proxy

## Support

For issues or questions:
1. Check Serper.dev documentation: https://serper.dev/playground
2. Review API status: https://serper.dev/status
3. Verify your API key and quota

## License

This tool is provided as-is for internal use.

## Changelog

### v1.0.0 (2026-02-12)
- Initial release
- CLI and web interface
- Serper.dev API integration
- Pagination support
- Copy and JSON output formats
- Progress tracking
- Rate limiting

---

**Built for Dutch portal search queries**  
*Powered by Serper.dev API*
