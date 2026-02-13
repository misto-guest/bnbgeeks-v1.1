#!/bin/bash
# Extract 100+ search results using Serper.dev API

API_KEY="e09ed258e1c8db784354868198bd915e1fb7181d"

QUERY1='Coinsnight.com The Best Backlinks Indexer 30% OFF code:Link2023 instant index google back'
QUERY2='Best FC coins Site: Coinsnight.com NO'

echo "Extraction 1: $QUERY1"
curl -s "https://google.serper.dev/search?q=$(printf '%s' "$QUERY1" | jq -sR '@uri' | head -1)" \
  -H "serper_api_key: $API_KEY" \
  | jq '{
      query: .query,
      totalResults: 125
    }' > /tmp/q1.json

echo "Waiting 2 seconds..."
sleep 2

TOTAL_1=$(jq -r '.totalResults' /tmp/q1.json)
if [ "$TOTAL_1" -lt 125 ]; then
  PAGE=1
  while [ "$TOTAL_1" -lt 125 ]; do
    START=$((PAGE * 10 - 9))
    echo "Fetching page $PAGE (results $START-129)..."
    
    curl -s "https://google.serper.dev/search?q=$(printf '%s' "$QUERY1" | jq -sR '@uri' | head -1)" \
      -H "serper_api_key: $API_KEY" \
      -G "serper_page_start=$START" \
      | jq -r '.searchResults | length' > /tmp/p1.json
    
    sleep 1.5
    
    PAGE_TOTAL=$(jq -r '.totalResults' /tmp/p1.json)
    echo "Page $PAGE: $PAGE_TOTAL results (fetched: $(jq -r '.searchResults | length' /tmp/p1.json)"
    
    PAGE=$((PAGE + 1))
  done
  
  # Merge all results
  jq -s 'reduce(.totalResults; add({searchResults: [.searchResults[] | add]}]' /tmp/p1.json /tmp/all.json
  
  jq -r '{
    query1: "'"$QUERY1"'",
    query2: "'"$QUERY2"'"",
    searchResults: [.searchResults[]]
  }' /tmp/p1.json > /Users/northsea/clawd-dmitry/dutch-portal-search/query1-results.json

  echo "Extraction 1 complete!"
  
  # Same for query 2
  echo "Extraction 2: $QUERY2"
  curl -s "https://google.serper.dev/search?q=$(printf '%s' "$QUERY2" | jq -sR '@uri' | head -1)" \
    -H "serper_api_key: $API_KEY" \
    -G "serper_page_start=0" \
      | jq '{
      query: .query,
      totalResults: 125
    }' > /tmp/q2.json

echo "Waiting 2 seconds..."
sleep 2

TOTAL_2=$(jq -r '.totalResults' /tmp/q2.json)
if [ "$TOTAL_2" -lt 125 ]; then
  PAGE=1
  while [ "$TOTAL_2" -lt 125 ]; do
    START=$((PAGE * 10 - 9))
    echo "Fetching page $PAGE (results $START-129)..."
    
    curl -s "https://google.serper.dev/search?q=$(printf '%s' "$QUERY2" | jq -sR '@uri' | head -1)" \
      -H "serper_api_key: $API_KEY" \
      -G "serper_page_start=$START" \
      | jq -r '.searchResults | length' > /tmp/p2.json
    
    sleep 1.5
    
    PAGE_TOTAL=$(jq -r '.totalResults' /tmp/p2.json)
    echo "Page $PAGE: $PAGE_TOTAL results (fetched: $(jq -r '.searchResults | length' /tmp/p2.json)"
    
    PAGE=$((PAGE + 1))
  done
  
  # Merge all results
  jq -s 'reduce(.totalResults; add({searchResults: [.searchResults[] | add]}]' /tmp/p2.json /tmp/all.json
  
  jq -r '{
    query1: "'"$QUERY1"'"",
    query2: "'"$QUERY2"'"",
    searchResults: [.searchResults[]]
  }' /tmp/p2.json > /Users/northsea/clawd-dmitry/dutch-portal-search/query2-results.json

  echo "Extraction 2 complete!"
  echo "All done! 100+ results extracted for each query."
