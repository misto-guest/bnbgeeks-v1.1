#!/bin/bash

RAILWAY_TOKEN="32ba5665-43d2-4a41-9d22-0c70e8a4bdfd"
PROJECT_ID="304d57d9-0378-4065-91ad-140105e7071c"
API_URL="https://backboard.railway.app/graphql/v2"

echo "=== Attempting to get services ==="

# Try a simpler query
curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "operationName": "ProjectServices",
    "query": "query ProjectServices($id: String!) { project(id: $id) { services { edges { node { id name } } } } }",
    "variables": { "id": "'$PROJECT_ID'" }
  }' | python3 -m json.tool