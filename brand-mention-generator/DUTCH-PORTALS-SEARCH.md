# Dutch Portals Search Results Extraction

## Overview

This project extracts search results for Dutch portal queries related to Coinsnight.com. It provides both API-based extraction (Serper.dev) and web scraping alternatives, along with a web interface to view and analyze the results.

## Features

- **Dual Extraction Methods:**
  - Primary: Serper.dev API (fast, reliable, 100+ results per query)
  - Fallback: Perplexity Sonar API (available via web_search tool)
  - Alternative: Web scraping (for when APIs are unavailable)

- **Target Queries:**
  1. "【 Coinsnight.com The Best Backlinks Indexer 】【 30% OFF code:Link2023 】,instant index google,back"
  2. "Best FC coins Site: Coinsnight.com NO"

- **Output Format:** JSON with complete search results including:
  - Title, link, and snippet for each result
  - Position ranking
  - Analysis and insights
  - Export capabilities

## Quick Start

### Option 1: Using the Pre-Extracted Results

The search results have already been extracted and saved to:
```
/backend/data/dutch-portals-search-results.json
```

To view them:

1. Start the web app:
```bash
cd frontend
npm run dev
```

2. Open in browser:
```
http://localhost:3000/dutch-portals
```

### Option 2: Fresh Extraction with Serper.dev API

1. Get your API key from https://serper.dev/

2. Set environment variable:
```bash
export SERPER_API_KEY=your_api_key_here
```

3. Run the extraction script:
```bash
cd backend
./scripts/run-dutch-portals-extraction.sh
```

### Option 3: Using Perplexity Sonar API

The `web_search` tool was used to extract results. This method is currently implemented and provides good results for the queries.

## Project Structure

```
brand-mention-generator/
├── backend/
│   ├── scripts/
│   │   ├── serper-search.ts          # Serper.dev API extraction (TypeScript)
│   │   ├── serper-search.js          # Serper.dev API extraction (JavaScript)
│   │   ├── extract-search-results.js # Web scraping fallback
│   │   └── run-dutch-portals-extraction.sh # Main extraction script
│   └── data/
│       └── dutch-portals-search-results.json # Extracted results
└── frontend/
    ├── app/
    │   ├── dutch-portals/
    │   │   └── page.tsx              # Results viewer page
    │   └── api/
    │       └── dutch-portals/
    │           └── route.ts         # API endpoint to serve JSON data
```

## API Endpoints

### Get Dutch Portals Search Results

**Endpoint:** `GET /api/dutch-portals`

**Response:**
```json
{
  "extractedAt": "2025-02-11T20:30:00.000Z",
  "queries": [
    {
      "query": "...",
      "searchResults": [
        {
          "title": "...",
          "link": "https://...",
          "snippet": "...",
          "position": 1
        }
      ],
      "totalResults": 9,
      "method": "perplexity_sonar_api",
      "analysis": "..."
    }
  ],
  "summary": {
    "totalQueries": 2,
    "totalResults": 14,
    "extractionMethod": "perplexity_sonar_api",
    "extractedAt": "2025-02-11T20:30:00.000Z",
    "note": "..."
  }
}
```

## JSON Data Format

The extracted results are saved in this format:

```json
{
  "extractedAt": "ISO timestamp",
  "queries": [
    {
      "query": "search query string",
      "searchResults": [
        {
          "title": "Result title",
          "link": "https://example.com",
          "snippet": "Result description",
          "position": 1
        }
      ],
      "totalResults": 100,
      "method": "extraction_method",
      "analysis": "Analysis of results"
    }
  ],
  "summary": {
    "totalQueries": 2,
    "totalResults": 200,
    "extractionMethod": "method_used",
    "extractedAt": "timestamp",
    "note": "Additional notes"
  }
}
```

## Web Interface Features

### Main Features:
- **Query Selection**: Switch between different search queries
- **Search Filter**: Filter results by title, snippet, or URL
- **Detailed Results**: View all search results with full metadata
- **Analysis Display**: See AI-generated analysis for each query
- **Export Options**: Download results as JSON

### Components:
1. **Header**: Shows total queries and results count
2. **Query Selector**: Choose which query to view
3. **Query Info**: Shows current query, result count, and analysis
4. **Search Filter**: Real-time filtering of results
5. **Results List**: All search results with full details
6. **Export Options**: Download data

## Deployment

### Vercel Deployment (Recommended)

1. **Deploy Backend API:**
   The backend API routes are already in the frontend Next.js app, so no separate backend deployment is needed.

2. **Build and Deploy:**
```bash
cd frontend
npm run build
vercel deploy
```

3. **Environment Variables:**
   - Set `SERPER_API_KEY` in Vercel environment variables (optional, for future extractions)

### Manual Deployment

1. **Build the frontend:**
```bash
cd frontend
npm run build
npm start
```

2. **Access the application:**
   - Main dashboard: `http://localhost:3000`
   - Dutch portals results: `http://localhost:3000/dutch-portals`

## Analysis Results

### Query 1: Backlinks Indexer
- **Results Found**: 9
- **Key Finding**: The query appears to be promotional spam for Coinsnight.com, showing up in search results across unrelated websites (religious catalogs, job boards, gear reviews, house plans)
- **No Credible Information**: No legitimate reviews or verifications of the service

### Query 2: FC Coins
- **Results Found**: 5
- **Key Finding**: No credible evidence supports Coinsnight.com as a legitimate FC coins seller
- **Warning Signs**: Results appear in spammy promotional queries on unrelated sites (credit unions, banks)
- **Recommendation**: Use official platforms like EA Sports FC in-game store

## Troubleshooting

### Issue: "SERPER_API_KEY not set"
**Solution:**
1. Get API key from https://serper.dev/
2. Set environment variable: `export SERPER_API_KEY=your_key`
3. Or use the pre-extracted results

### Issue: "No results found"
**Solution:**
- Check if the JSON file exists in `/backend/data/`
- Verify the API endpoint is accessible
- Check browser console for errors

### Issue: "Module not found"
**Solution:**
```bash
cd backend
npm install

cd frontend
npm install
```

## Future Enhancements

1. **Real-time Updates**: Auto-refresh results periodically
2. **Advanced Filters**: Filter by date, source type, relevance
3. **Comparison View**: Compare results from multiple queries side-by-side
4. **Export Formats**: Add CSV, Excel export options
5. **Historical Tracking**: Track changes in search results over time
6. **Alerts**: Get notified when new results appear

## API Keys and Services

### Serper.dev
- **Purpose**: Fast, reliable Google search API
- **Cost**: Free tier available (100 searches/month)
- **Website**: https://serper.dev/
- **Setup**:
  1. Sign up at serper.dev
  2. Get API key from dashboard
  3. Set `SERPER_API_KEY` environment variable

### Perplexity Sonar (via web_search tool)
- **Purpose**: AI-powered search with citations
- **Availability**: Built into Clawdbot
- **Usage**: Already configured and working

## License

ISC

## Support

For issues or questions:
1. Check this README
2. Review the extraction script logs
3. Check browser console for errors
4. Verify API keys are correctly set

---

**Last Updated:** February 11, 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready
