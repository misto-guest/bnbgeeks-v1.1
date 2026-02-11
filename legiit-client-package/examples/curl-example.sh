#!/bin/bash

################################################################################
# Legiit Automation API - cURL Examples
# 
# Usage:
#   chmod +x examples/curl-example.sh
#   ./examples/curl-example.sh
################################################################################

# Configuration
API_BASE_URL="${API_BASE_URL:-http://localhost:3000}"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo -e "\n${BLUE}╔══════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   Legiit Automation API - cURL Examples      ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}\n"
}

print_section() {
    echo -e "\n${YELLOW}--- $1 ---${NC}\n"
}

check_health() {
    echo -e "${BLUE}🏥 Checking API health...${NC}"
    
    response=$(curl -s -X GET "${API_BASE_URL}/health")
    
    if echo "$response" | jq -e '.status == "ok"' > /dev/null 2>&1; then
        echo -e "${GREEN}✅ API is healthy${NC}"
        echo "$response" | jq '.'
    else
        echo -e "${RED}❌ API health check failed${NC}"
        echo "$response"
        return 1
    fi
}

################################################################################
# Purchase Examples
################################################################################

quick_purchase() {
    print_section "Example 1: Quick Purchase (Standard Package)"
    
    echo -e "${BLUE}🛒 Purchasing service...${NC}"
    
    response=$(curl -s -X POST "${API_BASE_URL}/api/purchase/standard" \
        -H "Content-Type: application/json" \
        -d '{
            "domain": "mybusiness.com",
            "businessName": "My Business LLC",
            "address": "123 Main St, City, State 12345"
        }')
    
    if echo "$response" | jq -e '.success == true' > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Purchase successful!${NC}"
        echo "$response" | jq '.'
    else
        echo -e "${RED}❌ Purchase failed!${NC}"
        echo "$response" | jq '.'
    fi
}

full_purchase() {
    print_section "Example 2: Full Purchase with Custom Service URL"
    
    echo -e "${BLUE}🛒 Purchasing service with custom URL...${NC}"
    
    response=$(curl -s -X POST "${API_BASE_URL}/api/purchase" \
        -H "Content-Type: application/json" \
        -d '{
            "serviceUrl": "https://legiit.com/Toplocalcitations/350-usa-local-citations-listings-and-directories-1679073072",
            "package": "Standard",
            "details": {
                "domain": "example.com",
                "businessName": "Example Business LLC",
                "address": "123 Main St, City, State 12345"
            }
        }')
    
    if echo "$response" | jq -e '.success == true' > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Purchase successful!${NC}"
        echo "$response" | jq '.'
    else
        echo -e "${RED}❌ Purchase failed!${NC}"
        echo "$response" | jq '.'
    fi
}

purchase_from_file() {
    print_section "Example 3: Purchase from JSON File"
    
    # Create example JSON file
    cat > /tmp/legiit-purchase.json <<EOF
{
    "domain": "filebusiness.com",
    "businessName": "File Business Inc",
    "address": "456 Oak Ave, Town, State 67890"
}
EOF
    
    echo -e "${BLUE}🛒 Purchasing service from file...${NC}"
    echo -e "📄 Reading from: /tmp/legiit-purchase.json"
    
    response=$(curl -s -X POST "${API_BASE_URL}/api/purchase/standard" \
        -H "Content-Type: application/json" \
        -d @/tmp/legiit-purchase.json)
    
    if echo "$response" | jq -e '.success == true' > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Purchase successful!${NC}"
        echo "$response" | jq '.'
    else
        echo -e "${RED}❌ Purchase failed!${NC}"
        echo "$response" | jq '.'
    fi
}

################################################################################
# Batch Purchase Example
################################################################################

batch_purchase() {
    print_section "Example 4: Batch Purchase (Multiple Businesses)"
    
    # Create batch file
    cat > /tmp/legiit-batch.json <<EOF
{
    "businesses": [
        {
            "domain": "business1.com",
            "businessName": "Business One LLC",
            "address": "111 First St, City, State 11111"
        },
        {
            "domain": "business2.com",
            "businessName": "Business Two Inc",
            "address": "222 Second Ave, City, State 22222"
        }
    ]
}
EOF
    
    echo -e "${BLUE}🛒 Processing batch purchase...${NC}"
    
    # Read businesses from file and process each
    businesses=$(jq -c '.businesses[]' /tmp/legiit-batch.json)
    
    i=1
    echo "$businesses" | while read -r business; do
        echo -e "\n${BLUE}📦 Processing business $i:${NC}"
        echo "$business" | jq '.'
        
        response=$(curl -s -X POST "${API_BASE_URL}/api/purchase/standard" \
            -H "Content-Type: application/json" \
            -d "$business")
        
        if echo "$response" | jq -e '.success == true' > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Purchase ${i} successful!${NC}"
        else
            echo -e "${RED}❌ Purchase ${i} failed!${NC}"
            echo "$response" | jq '.error'
        fi
        
        ((i++))
        sleep 1  # Brief pause between requests
    done
}

################################################################################
# Main Execution
################################################################################

main() {
    print_header
    
    # Check if jq is installed
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}❌ jq is required but not installed${NC}"
        echo "Install jq: brew install jq (macOS) or apt-get install jq (Linux)"
        exit 1
    fi
    
    # Check API health
    check_health || exit 1
    
    # Run examples (comment out the ones you don't want to run)
    
    # Example 1: Quick purchase
    quick_purchase
    
    # Example 2: Full purchase with custom URL
    # full_purchase
    
    # Example 3: Purchase from file
    # purchase_from_file
    
    # Example 4: Batch purchase
    # batch_purchase
    
    echo -e "\n${GREEN}✅ Examples completed!${NC}\n"
}

# Check if API_BASE_URL is set
if [ -z "$API_BASE_URL" ]; then
    echo -e "${YELLOW}⚠️  API_BASE_URL not set, using default: http://localhost:3000${NC}"
fi

# Run main function
main
