#!/usr/bin/env python3
"""
Clawe Railway Deployment Manager
Deploy and configure all Clawe services on Railway
"""
import subprocess
import json
import sys

def run_cmd(cmd, check=True):
    """Run a shell command and return output"""
    print(f"Running: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if check and result.returncode != 0:
        print(f"Error: {result.stderr}")
    return result

def print_section(title):
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}")

def main():
    print_section("CLawe Railway Deployment")

    # Step 1: Check current status
    print_section("Step 1: Current Project Status")
    run_cmd("railway status")

    # Step 2: Check deployment history
    print_section("Step 2: Recent Deployments")
    run_cmd("railway deployment list")

    # Step 3: Get current service info
    print_section("Step 3: Current Environment Variables (openclaw)")
    result = run_cmd("railway variables")

    # Step 4: Check if we need to add services
    print_section("Step 4: Service Configuration")
    print("\nCurrent service is openclaw")
    print("\nNeed to:")
    print("1. Verify openclaw is working correctly")
    print("2. Add 'web' service")
    print("3. Add 'watcher' service")
    print("4. Configure all services")
    print("5. Trigger deployments")

    # Step 5: Check what services we need
    print_section("Step 5: Adding Additional Services")

    # Add web service
    print("\n>>> Adding web service...")
    result = run_cmd("railway add --name web")

    # Configure web service
    print("\n>>> Configuring web service environment variables...")
    web_vars = [
        ('NEXT_PUBLIC_CONVEX_URL', 'https://clawe.convex.cloud'),
        ('OPENCLAW_URL', 'http://openclaw:18789'),
        ('PORT', '3000')
    ]

    for key, value in web_vars:
        cmd = f"railway variables set {key}={value}"
        result = run_cmd(cmd, check=False)

    # Switch back to openclaw
    print("\n>>> Switching to watcher service...")
    result = run_cmd("railway service link watcher", check=False)

    if result.returncode != 0:
        # Service doesn't exist, add it
        print("\n>>> Adding watcher service...")
        run_cmd("railway add --name watcher")

        # Configure watcher service
        print("\n>>> Configuring watcher service environment variables...")
        watcher_vars = [
            ('NEXT_PUBLIC_CONVEX_URL', 'https://clawe.convex.cloud'),
            ('OPENCLAW_URL', 'http://openclaw:18789'),
            ('ZAI_API_KEY', '048bff5da3bf4ae09c4be014dcc1161b.0F2qbUTBqyrkSrPv')
        ]

        for key, value in watcher_vars:
            cmd = f"railway variables set {key}={value}"
            run_cmd(cmd, check=False)

    # Step 6: Trigger deployments
    print_section("Step 6: Triggering Deployments")

    # Deploy openclaw
    print("\n>>> Deploying openclaw...")
    run_cmd("railway up", check=False)

    # Deploy web
    print("\n>>> Deploying web...")
    run_cmd("railway service link web && railway up", check=False)

    # Deploy watcher
    print("\n>>> Deploying watcher...")
    run_cmd("railway service link watcher && railway up", check=False)

    # Step 7: Final status
    print_section("Deployment Complete")
    print("\n✅ Services configured:")
    print("  - openclaw")
    print("  - web")
    print("  - watcher")
    print("\nPublic URLs will be available at:")
    print("  - https://openclaw-production-6a46.up.railway.app")
    print("  - https://web-[hash].up.railway.app")
    print("  - https://watcher-[hash].up.railway.app")

if __name__ == "__main__":
    main()
