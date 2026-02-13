#!/bin/bash
# Extract ALL search results using Serper.dev API with proper pagination

set -e

API_KEY="e09ed258e1c8db784354868198bd915e1fb7181d"

QUERY1='Coinsnight.com The Best Backlinks Indexer 30% OFF code:Link2023 instant index google back'
QUERY2='Best FC coins Site: Coinsnight.com NO'

OUTPUT_DIR="/Users/northsea/clawd-dmitry/dutch-portal-search"

# Function to extract all paginated results for a query
extract_all_pages() {
    local query="$1"
    local output_file="$2"
    local start=0
    local all_results="[]"
    local total_from_api=0
    local page=1
    local consecutive_empty=0
    
    echo "Fetching results for: $query"
    echo "---"
    
    while true; do
        # Fetch page of results
        local encoded_query=$(printf '%s' "$query" | jq -sRr '@uri')
        local url="https://google.serper.dev/search?q=${encoded_query}&start=${start}"
        
        echo "Page $page (start=$start)..."
        
        local response=$(curl -s "$url" \
            -H "serper_api_key: $API_KEY" \
            -H "Content-Type: application/json")
        
        # Extract totalResults from API if available (first page only)
        if [ $page -eq 1 ]; then
            total_from_api=$(echo "$response" | jq -r '.searchParameters.totalResults // 0')
            if [ "$total_from_api" != "null" ] && [ "$total_from_api" -gt 0 ]; then
                echo "  API reports totalResults: $total_from_api"
            fi
        fi
        
        # Extract organic search results (filter out ads)
        local page_results=$(echo "$response" | jq -r '
            if .organic == null then 
                []
            else 
                [.organic[] | select(.position != null) | select(.link != null)]
            end
        ')
        
        local count=$(echo "$page_results" | jq 'length')
        local current_total=$(echo "$all_results" | jq 'length')
        
        echo "  Found $count organic results on this page (total so far: $current_total)"
        
        # Check if we got results
        if [ "$count" -eq 0 ]; then
            consecutive_empty=$((consecutive_empty + 1))
            echo "  No results on this page"
            
            # Stop if we get 2 consecutive empty pages
            if [ $consecutive_empty -ge 2 ]; then
                echo "  Stopping: consecutive empty pages"
                break
            fi
        else
            consecutive_empty=0
            
            # Append results to all_results
            all_results=$(echo "$all_results" "$page_results" | jq -s 'add')
        fi
        
        # Check stopping conditions
        current_total=$(echo "$all_results" | jq 'length')
        
        # Stop if total < 125 (target reached or no more available)
        if [ "$current_total" -ge 125 ]; then
            echo "  Stopping: reached target of 125 results"
            break
        fi
        
        # Stop if we've fetched enough pages (safety limit)
        if [ $page -ge 20 ]; then
            echo "  Stopping: reached max pages (20)"
            break
        fi
        
        # Move to next page (Serper uses start=0, 10, 20, 30...)
        start=$((start + 10))
        page=$((page + 1))
        
        # Small delay to avoid rate limiting
        sleep 0.5
    done
    
    # Save results with metadata
    local final_count=$(echo "$all_results" | jq 'length')
    echo "---"
    echo "Total extracted: $final_count organic results"
    
    # Create final JSON with metadata
    jq -n \
        --arg query "$query" \
        --argjson results "$all_results" \
        --argjson total "$final_count" \
        '{
            query: $query,
            totalResults: $total,
            searchResults: $results
        }' > "$output_file"
    
    echo "Saved to: $output_file"
    echo ""
}

# Main execution
echo "=== Serper.dev Extraction (with Pagination) ==="
echo ""

# Extract Query 1
echo "=== QUERY 1 ==="
extract_all_pages "$QUERY1" "$OUTPUT_DIR/query1-results.json"

# Extract Query 2  
echo "=== QUERY 2 ==="
extract_all_pages "$QUERY2" "$OUTPUT_DIR/query2-results.json"

# Summary
TOTAL_1=$(jq -r '.totalResults' "$OUTPUT_DIR/query1-results.json")
TOTAL_2=$(jq -r '.totalResults' "$OUTPUT_DIR/query2-results.json")

echo "=== EXTRACTION COMPLETE ==="
echo "Query 1: $TOTAL_1 results"
echo "Query 2: $TOTAL_2 results"
echo "Combined total: $((TOTAL_1 + TOTAL_2)) results"
echo ""
echo "Files created:"
echo "  - $OUTPUT_DIR/query1-results.json"
echo "  - $OUTPUT_DIR/query2-results.json"
