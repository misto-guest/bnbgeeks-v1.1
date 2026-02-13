#!/bin/bash

# Fix Railway GitHub integration and trigger deployment

RAILWAY_TOKEN="32ba5665-43d2-4a41-9d22-0c70e8a4bdfd"
PROJECT_ID="304d57d9-0378-4065-91ad-140105e7071c"
SERVICE_ID="0d8c45bd-2218-4766-b390-4d102b757157"
API_URL="https://backboard.railway.app/graphql/v2"

echo "=== Step 1: Checking current service ==="
curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query($id: String!) { service(id: $id) { id name createdAt } }",
    "variables": {"id":"'$SERVICE_ID'"}
  }' | python3 -m json.tool

echo ""
echo "=== Step 2: Getting project details ==="
curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query($id: String!) { project(id: $id) { id name } }",
    "variables": {"id":"'$PROJECT_ID'"}
  }' | python3 -m json.tool

echo ""
echo "=== Step 3: Checking if we can list available repos ==="
curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { githubRepositories { edges { node { id name owner { login } } } } }"
  }' | python3 -m json.tool 2>&1 | head -30

echo ""
echo "=== Step 4: Attempting to connect service to GitHub repo ==="
curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation($serviceId: String!, $input: ServiceUpdateInput!) { serviceUpdate(id: $serviceId, input: $input) { id name } }",
    "variables": {
      "serviceId": "'$SERVICE_ID'",
      "input": {
        "source": {
          "owner": "misto-guest",
          "repo": "bol-outreach",
          "branch": "main"
        }
      }
    }
  }' | python3 -m json.tool

echo ""
echo "=== Step 5: Triggering deployment ==="
sleep 5
curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation($serviceId: String!) { serviceRestart(id: $serviceId) }",
    "variables": {"serviceId":"'$SERVICE_ID'"}
  }' | python3 -m json.tool

echo ""
echo "=== Deployment Status Check ==="
sleep 10
curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query($id: String!) { service(id: $id) { deployments(first: 3, orderBy: CREATED_AT_DESC) { edges { node { id status createdAt } } } } }",
    "variables": {"id":"'$SERVICE_ID'"}
  }' | python3 -m json.tool

echo ""
echo "=== Checking endpoint after 60 seconds ==="
sleep 60
curl -s -X POST https://bol-outreach-production.up.railway.app/api/campaigns/1/sellers \
  -H "Content-Type: application/json" \
  -d '{"sellerIds":[1,2]}' | head -10
