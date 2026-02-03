# Chrome Warm-up Automation

Puppeteer-based Chrome automation for warm-up routine using Google Trends and Google News.

## Features

- ✅ Fetches top 10 trending keywords from Google Trends
- ✅ Searches for the #1 trending topic on Google News
- ✅ Clicks and visits the first news article
- ✅ Configurable time-on-page delays (human-like behavior)
- ✅ Randomized typing and navigation patterns
- ✅ Anti-detection measures (custom user agent, hidden webdriver flag)

## Installation

```bash
cd warmup-automation
npm install
```

## Configuration

Edit `config.json` to customize:

```json
{
  "timeOnPage": {
    "trends": {
      "min": 5,
      "max": 10
    },
    "newsSearch": {
      "min": 3,
      "max": 7
    },
    "article": {
      "min": 10,
      "max": 30
    }
  },
  "automation": {
    "numTrendsToProcess": 1
  }
}
```

### Time-on-Page Settings

- **trends**: Min/max seconds to stay on Google Trends page
- **newsSearch**: Min/max seconds on search results
- **article**: Min/max seconds reading the article

### Automation Settings

- **numTrendsToProcess**: Process top 1-10 trending keywords (default: 1)

## Usage

### Run warm-up script
```bash
npm start
```

### Run in headless mode (no visible browser)
Edit `warmup.js`, set `headless: true`

## What It Does

1. Opens Chrome and visits `trends.google.com`
2. Extracts top 10 trending keywords
3. Navigates to `news.google.com`
4. Searches for the #1 trending keyword
5. Clicks the first news result
6. Stays on the article for randomized time (10-30s by default)
7. Logs all actions to console

## Example Output

```
🚀 Starting warm-up routine...

⏱️  Waiting 7s...
📊 Fetching top 10 trending keywords...
✅ Found 10 trending keywords:
   1. Election Results
   2. New iPhone Release
   ...

📌 Processing trend 1/1: Election Results

🔍 Searching for: "Election Results"
⌨️  Typing search query...
⏱️  Waiting 5s...
📰 Clicking first article...
🔗 Opening: https://example.com/article
📖 Reading article for 22s...

✅ Completed warm-up for: Election Results

✅ Warm-up routine completed successfully!
👋 Browser closed.
```

## Notes

- Headless mode (`headless: true`) for production
- Adjust time delays based on your needs
- Can process multiple trends by changing `numTrendsToProcess`
- All delays are randomized to simulate human behavior
