#!/usr/bin/env python3
"""Simple test for GhostFetch server"""

import subprocess
import time
import urllib.request
import json
import sys

print("👻 Testing GhostFetch Server")
print("=" * 60)

# Start server
print("\n📡 Starting GhostFetch server...")
server = subprocess.Popen(
    ["ghostfetch", "serve", "--port", "8000"],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

# Give it time to start
print("⏳ Waiting for server to start...")
time.sleep(5)

# Test health endpoint
try:
    print("\n🏥 Testing health endpoint...")
    response = urllib.request.urlopen("http://localhost:8000/health", timeout=5)
    if response.status == 200:
        print("✅ Health check passed")

        # Test fetch endpoint
        print("\n📝 Testing fetch endpoint with example.com...")
        fetch_url = "http://localhost:8000/fetch/sync?url=https://example.com"
        response = urllib.request.urlopen(fetch_url, timeout=60)

        if response.status == 200:
            data = json.loads(response.read().decode('utf-8'))
            print("✅ Fetch test passed")
            print(f"   Status: {data.get('status')}")
            print(f"   Title: {data.get('metadata', {}).get('title', 'N/A')}")
            print(f"   Markdown length: {len(data.get('markdown', ''))} chars")

            # Show preview
            markdown = data.get('markdown', '')
            preview = markdown[:150] + "..." if len(markdown) > 150 else markdown
            print(f"\n   Preview:\n   {preview}")

    print("\n" + "=" * 60)
    print("🎉 GhostFetch server is working!")
    print("=" * 60)

except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    # Stop server
    print("\n🛑 Stopping server...")
    server.terminate()
    server.wait(timeout=5)
    print("✅ Done")
