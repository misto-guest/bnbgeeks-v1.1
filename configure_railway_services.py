#!/usr/bin/env python3
"""
Railway Service Configuration Script
Configure each service with correct Dockerfile and root directory
"""
import subprocess
import json
import sys
import os

def run_cmd(cmd, check=True):
    """Run a shell command and return output"""
    print(f"Running: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if check and result.returncode != 0:
        print(f"Error: {result.stderr}")
        return None
    return result.stdout or result.stderr

def print_section(title):
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}")

def main():
    print_section("Railway Service Configuration for Clawe")

    # Get project ID from railway status
    result = run_cmd("railway status")
    print(result)

    # We need to configure each service with:
    # - Root directory
    # - Dockerfile path
    # - Environment variables

    print_section("Configuration Required")

    services = {
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

    print("\n⚠️  Manual Configuration Required")
    print("\nRailway CLI doesn't support configuring Dockerfile paths directly.")
    print("\nYou need to:")
    print("1. Open Railway Dashboard: https://railway.com/project/3c382894-562f-444e-ba37-849dbcf25e26")
    print("2. For each service (openclaw, web, watcher):")
    print("   - Click on the service")
    print("   - Go to Settings")
    print("   - Set 'Root Directory' to the docker subdirectory:")
    print(f"     * openclaw → {services['openclaw']['root_dir']}")
    print(f"     * web → {services['web']['root_dir']}")
    print(f"     * watcher → {services['watcher']['root_dir']}")
    print("   - Set 'Dockerfile Path' to: ./Dockerfile")
    print("3. Set environment variables for each service")
    print("4. Trigger deployments")

    print("\n\nAlternatively, use railway.toml configuration file")

    # Create railway.toml for each service context
    print_section("Creating railway.toml Configuration")

    railway_toml_content = """[build]
dockerfile = "Dockerfile"

[deploy]
startCommand = ""
healthcheckPath = "/"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"

[[services]]
name = "openclaw"
"""

    with open('/Users/northsea/clawd-dmitry/railway.toml', 'w') as f:
        f.write(railway_toml_content)

    print("✓ Created railway.toml")
    print("\n  Note: This configures the default service build settings")
    print("  Each service needs to be configured via Railway Dashboard")

if __name__ == "__main__":
    main()
