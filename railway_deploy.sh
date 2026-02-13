#!/bin/bash

RAILWAY_TOKEN="32ba5665-43d2-4a41-9d22-0c70e8a4bdfd"
PROJECT_ID="3c382894-562f-444e-ba37-849dbcf25e26"
API_URL="https://backboard.railway.app/graphql/v2"

# Helper function for Railway API calls
railway_api() {
    local query="$1"
    curl -s -X POST "$API_URL" \
        -H "Authorization: Bearer $RAILWAY_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$query"
}

echo "=== Step 1: Getting Project Info ==="
GET_PROJECT_QUERY='{"query":"query(\$id: ID!) { project(id: \$id) { id name } }","variables":{"id":"'$PROJECT_ID'"}}'
railway_api "$GET_PROJECT_QUERY"
echo ""

echo "=== Step 2: Getting Existing Services ==="
GET_SERVICES_QUERY='{"query":"query(\$id: ID!) { project(id: \$id) { services { edges { node { id name } } } } }","variables":{"id":"'$PROJECT_ID'"}}'
railway_api "$GET_SERVICES_QUERY"
echo ""

echo "=== Step 3: Creating OpenClaw Service ==="
# Create a new service
CREATE_SERVICE_QUERY='{"query":"mutation(\$projectId: String!, \$name: String!) { projectServiceCreate(projectId: \$projectId, name: \$name) { id name } }","variables":{"projectId":"'$PROJECT_ID'","name":"openclaw"}}'
railway_api "$CREATE_SERVICE_QUERY"
echo ""
