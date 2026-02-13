#!/usr/bin/env python3
"""
Railway API Deployment Script for Clawe
"""
import requests
import json
import sys

# Configuration
RAILWAY_TOKEN = "32ba5665-43d2-4a41-9d22-0c70e8a4bdfd"
PROJECT_ID = "3c382894-562f-444e-ba37-849dbcf25e26"
API_URL = "https://backboard.railway.app/graphql/v2"

headers = {
    "Authorization": f"Bearer {RAILWAY_TOKEN}",
    "Content-Type": "application/json"
}

def railway_query(query, variables=None):
    """Execute a Railway GraphQL query"""
    payload = {"query": query}
    if variables:
        payload["variables"] = variables

    response = requests.post(API_URL, json=payload, headers=headers)
    response.raise_for_status()
    return response.json()

def print_section(title):
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")

def main():
    print_section("RAILWAY API DEPLOYMENT FOR CLAWE")

    # Step 1: Get Project Info
    print_section("Step 1: Verifying Project Access")
    project_query = """
    query($id: ID!) {
        project(id: $id) {
            id
            name
        }
    }
    """
    try:
        result = railway_query(project_query, {"id": PROJECT_ID})
        print(f"✓ Project: {result['data']['project']['name']}")
        print(f"  ID: {result['data']['project']['id']}")
    except Exception as e:
        print(f"✗ Error accessing project: {e}")
        sys.exit(1)

    # Step 2: Get Existing Services
    print_section("Step 2: Checking Existing Services")
    services_query = """
    query($id: ID!) {
        project(id: $id) {
            services {
                edges {
                    node {
                        id
                        name
                    }
                }
            }
        }
    }
    """
    result = railway_query(services_query, {"id": PROJECT_ID})
    existing_services = result['data']['project']['services']['edges']
    print(f"Found {len(existing_services)} existing services:")
    for edge in existing_services:
        service = edge['node']
        print(f"  - {service['name']} ({service['id']})")

    # Step 3: Create OpenClaw Service
    print_section("Step 3: Creating OpenClaw Service")

    # First check if openclaw already exists
    openclaw_exists = any(edge['node']['name'] == 'openclaw' for edge in existing_services)

    if openclaw_exists:
        print("ℹ openclaw service already exists, will configure it")
        # Get the service ID
        for edge in existing_services:
            if edge['node']['name'] == 'openclaw':
                openclaw_id = edge['node']['id']
                break
    else:
        create_service_query = """
        mutation($projectId: String!, $name: String!) {
            projectServiceCreate(projectId: $projectId, name: $name) {
                id
                name
            }
        }
        """
        try:
            result = railway_query(create_service_query, {"projectId": PROJECT_ID, "name": "openclaw"})
            openclaw_id = result['data']['projectServiceCreate']['id']
            print(f"✓ Created openclaw service: {openclaw_id}")
        except Exception as e:
            print(f"✗ Error creating service: {e}")
            print(json.dumps(result, indent=2))

    # Step 4: Configure OpenClaw Service
    print_section("Step 4: Configuring OpenClaw Service")

    # Get GitHub repo info - need to link to the repo first
    # This requires knowing the GitHub repo details

    # For now, let's list what we need to do
    print("\n⚠ Railway API requires GitHub repo to be connected first.")
    print("\nNext steps needed:")
    print("1. Connect GitHub repo to Railway project")
    print("2. Configure root directory: docker/openclaw")
    print("3. Set Dockerfile path: ./Dockerfile")
    print("4. Set environment variables:")
    print("   - ZAI_API_KEY=048bff5da3bf4ae09c4be014dcc1161b.0F2qbUTBqyrkSrPv")
    print("   - OPENCLAW_PORT=18789")
    print("   - NEXT_PUBLIC_CONVEX_URL=https://clawe.convex.cloud")
    print("5. Trigger deployment")

    print_section("DEPLOYMENT STATUS")
    print("The Railway API requires additional steps for full deployment.")
    print("\nRecommended approach:")
    print("1. Use Railway CLI or Dashboard to connect GitHub repo")
    print("2. Then use API to configure services")
    print("\nOr deploy via Railway Dashboard directly.")

if __name__ == "__main__":
    main()
