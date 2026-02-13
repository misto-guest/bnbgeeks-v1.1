#!/bin/bash
# Extract 100+ search results using Serper.dev API

API_KEY="e09ed258e1c8db784354868198bd915e1fb7181d"

QUERY1='Coinsnight.com The Best Backlinks Indexer 30% OFF code:Link2023 instant index google back'
QUERY2='Best FC coins Site: Coinsnight.com NO'

echo "=== Extraction 1: $QUERY1 ==="
curl -s "https://google.serper.dev/search?q=$(printf '%s' "$QUERY1" | jq -sR '@uri' | head -1)" \
  -H "serper_api_key: $API_KEY" \
  | jq '{
      query: .query,
      totalResults: .totalResults,
      searchResults: .searchResults
    }' > /tmp/q1.json

TOTAL_1=$(jq -r '.totalResults' /tmp/q1.json)
echo "Query 1: $TOTAL_1 total results available"

# Pagination for query 1
if [ "$TOTAL_1" -gt 10 ]; then
  echo "Fetching additional pages for query 1..."
  PAGE=2
  while [ $((PAGE * 10)) -lt 125 ]; do
    START=$(((PAGE - 1) * 10))
    echo "Fetching page $PAGE (start=$START)..."
    
    curl -s "https://google.serper.dev/search?q=$(printf '%s' "$QUERY1" | jq -sR '@uri' | head -1)" \
      -H "serper_api_key: $API_KEY" \
      -d "serper_page_start=$START" \
      | jq '.searchResults' >> /tmp/q1-all.json
    
    sleep 2
    PAGE=$((PAGE + 1))
  done
  
  # Combine results
  jq -s '{query: .[0].query, totalResults: (.[0].totalResults), searchResults: (.[0].searchResults + .[1:])}' /tmp/q1.json <(jq -s 'add' /tmp/q1-all.json) > /Users/northsea/clawd-dmitry/dutch-portal-search/query1-results.json
else
  cp /tmp/q1.json /Users/northsea/clawd-dmitry/dutch-portal-search/query1-results.json
fi

echo "Query 1 extraction complete!"
echo ""

echo "=== Extraction 2: $QUERY2 ==="
curl -s "https://google.serper.dev/search?q=$(printf '%s' "$QUERY2" | jq -sR '@uri' | head -1)" \
  -H "serper_api_key: $API_KEY" \
  | jq '{
      query: .query,
      totalResults: .totalResults,
      searchResults: .searchResults
    }' > /tmp/q2.json

TOTAL_2=$(jq -r '.totalResults' /tmp/q2.json)
echo "Query 2: $TOTAL_2 total results available"

# Pagination for query 2
if [ "$TOTAL_2" -gt 10 ]; then
  echo "Fetching additional pages for query 2..."
  PAGE=2
  while [ $((PAGE * 10)) -lt 125 ]; do
    START=$(((PAGE - 1) * 10))
    echo "Fetching page $PAGE (start=$START)..."
    
    curl -s "https://google.serper.dev/search?q=$(printf '%s' "$QUERY2" | jq -sR '@uri' | head -1)" \
      -H "serper_api_key: $API_KEY" \
      -d "serper_page_start=$START" \
      | jq '.searchResults' >> /tmp/q2-all.json
    
    sleep 2
    PAGE=$((PAGE + 1))
  done
  
  # Combine results
  jq -s '{query: .[0].query, totalResults: (.[0].totalResults), searchResults: (.[0].searchResults + .[1:])}' /tmp/q2.json <(jq -s 'add' /tmp/q2-all.json) > /Users/northsea/clawd-dmitry/dutch-portal-search/query2-results.json
else
  cp /tmp/q2.json /Users/northsea/clawd-dmitry/dutch-portal-search/query2-results.json
fi

echo "Query 2 extraction complete!"
echo ""
echo "=== All Done! ==="
echo "Extracted 100+ results for each query:"
echo "- query1-results.json ($(jq -r '.searchResults | length' /Users/northsea/clawd-dmitry/dutch-portal-search/query1-results.json) results)"
echo "- query2-results.json ($(jq -r '.searchResults | length' /Users/northsea/clawd-dmitry/dutch-portal-search/query2-results.json) results)"
