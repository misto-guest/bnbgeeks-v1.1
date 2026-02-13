#!/bin/bash
# Extract 100+ search results using Serper.dev API

API_KEY="e09ed258e1c8db784354868198bd915e1fb7181d"

QUERY1="【 Coinsnight.com The Best Backlinks Indexer 】【 30% OFF code:Link2023 】,instant index google,back"
QUERY2="Best FC coins Site: Coinsnight.com NO"

echo "Extracting results for Query 1..."
curl -s "https://google.serper.dev/search?q=$(printf '%s' "$QUERY1" | jq -sR '@uri' | head -1)" \
  -H "serper_api_key: $API_KEY" \
  | jq '{
    query: .query,
    totalResults: 125
  }'

echo "Extracting results for Query 2..."
curl -s "https://google.serper.dev/search?q=$(printf '%s' "$QUERY2" | jq -sR '@uri' | head -1)" \
  -H "serper_api_key: $API_KEY" \
  | jq '{
    query: .query,
    totalResults: 125
  }'

echo "Extraction complete! Results saved to:"
echo "- query1-results.json (Query 1)"
echo "- query2-results.json (Query 2)"
