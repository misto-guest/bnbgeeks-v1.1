#!/usr/bin/env python3
"""
Railway API Configuration Script
Configure services with correct build settings via Railway API
"""
import requests
import json
import sys
import subprocess

# Configuration
RAILWAY_TOKEN = "32ba5665-43d2-4a41-9d22-0c70e8a4bdfd"
PROJECT_ID = "3c382894-562f-444e-ba37-849dbcf25e26"
API_URL = "https://backboard.railway.app/graphql/v2"

headers = {
    "Authorization": f"Bearer {RAILWAY_TOKEN}",
    "Content-Type": "application/json"
}

def railway_query(query, variables=None):
    """Execute a Railway GraphQL query/mutation"""
    payload = {"query": query}
    if variables:
        payload["variables"] = variables

    response = requests.post(API_URL, json=payload, headers=headers)
    response.raise_for_status()
    return response.json()

def print_section(title):
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}")

def main():
    print_section("Railway API Configuration for Clawe")

    # Get existing services
    print_section("Getting Project Services")

    get_services_query = """
    query($id: ID!) {
        project(id: $id) {
            services {
                edges {
                    node {
                        id
                        name
                        serviceId
                    }
                }
            }
        }
    }
    """

    try:
        result = railway_query(get_services_query, {"id": PROJECT_ID})
        services = result['data']['project']['services']['edges']

        print(f"Found {len(services)} services:")
        for edge in services:
            service = edge['node']
            print(f"  - {service['name']} (ID: {service['id']}, ServiceID: {service.get('serviceId', 'N/A')})")

    except Exception as e:
        print(f"✗ Error: {e}")
        return

    # Configuration for each service
    services_config = {
        'openclaw': {
            'root_dir': 'docker/openclaw',
            'dockerfile': './Dockerfile',
            'vars': {
                'ZAI_API_KEY': '048bff5da3bf4ae09c4be014dcc1161b.0F2qbUTBqyrkSrPv',
                'OPENCLAW_PORT': '18789',
                'NEXT_PUBLIC_CONVEX_URL': 'https://clawe.convex.cloud'
            }
        },
        'web': {
            'root_dir': 'docker/web',
            'dockerfile': './Dockerfile',
            'vars': {
                'NEXT_PUBLIC_CONVEX_URL': 'https://clawe.convex.cloud',
                'OPENCLAW_URL': 'http://openclaw:18789',
                'PORT': '3000'
            }
        },
        'watcher': {
            'root_dir': 'docker/watcher',
            'dockerfile': './Dockerfile',
            'vars': {
                'NEXT_PUBLIC_CONVEX_URL': 'https://clawe.convex.cloud',
                'OPENCLAW_URL': 'http://openclaw:18789',
                'ZAI_API_KEY': '048bff5da3bf4ae09c4be014dcc1161b.0F2qbUTBqyrkSrPv'
            }
        }
    }

    print_section("Configuration Summary")

    print("\nServices to configure:")
    for service_name, config in services_config.items():
        print(f"\n  {service_name}:")
        print(f"    Root Directory: {config['root_dir']}")
        print(f"    Dockerfile: {config['dockerfile']}")
        print(f"    Environment Variables:")
        for key, value in config['vars'].items():
            if key == 'ZAI_API_KEY':
                print(f"      {key} = ****{value[-10:]}")
            else:
                print(f"      {key} = {value}")

    print_section("Next Steps")
    print("\n⚠️  Railway API does not expose build configuration endpoints")
    print("   Build settings must be configured via Railway Dashboard:")
    print(f"\n   1. Open: https://railway.com/project/{PROJECT_ID}")
    print("   2. For each service:")
    print("      - Click service → Settings → Root Directory")
    print("      - Set the path to the docker subdirectory")
    print("      - Set Dockerfile path to ./Dockerfile")
    print("      - Deploy")

if __name__ == "__main__":
    main()
