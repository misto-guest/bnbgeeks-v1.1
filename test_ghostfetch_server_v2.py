#!/usr/bin/env python3
"""Simple test for GhostFetch server with better debugging"""

import subprocess
import time
import urllib.request
import json
import sys
import os

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

# Give it more time to start (browsers take time to init)
print("⏳ Waiting for server to start (this may take 15-30 seconds)...")
max_wait = 30
start_time = time.time()

while time.time() - start_time < max_wait:
    try:
        response = urllib.request.urlopen("http://localhost:8000/health", timeout=2)
        if response.status == 200:
            print("✅ Server is ready!")
            break
    except:
        time.sleep(2)
        elapsed = int(time.time() - start_time)
        print(f"   Still waiting... ({elapsed}/{max_wait}s)")

# Test health endpoint
try:
    print("\n🏥 Testing health endpoint...")
    response = urllib.request.urlopen("http://localhost:8000/health", timeout=5)
    if response.status == 200:
        print("✅ Health check passed")

        # Test fetch endpoint
        print("\n📝 Testing fetch endpoint with example.com...")
        fetch_url = "http://localhost:8000/fetch/sync?url=https://example.com"
        print(f"   Fetching from: {fetch_url}")

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
    print("\n📋 Server output:")
    if server.poll() is not None:
        stdout, stderr = server.communicate()
        if stdout:
            print(f"STDOUT:\n{stdout}")
        if stderr:
            print(f"STDERR:\n{stderr}")
    else:
        print("   Server is still running")
finally:
    # Stop server
    print("\n🛑 Stopping server...")
    server.terminate()
    try:
        server.wait(timeout=10)
        print("✅ Server stopped")
    except subprocess.TimeoutExpired:
        print("⚠️  Server did not stop gracefully, killing...")
        server.kill()
        server.wait()
        print("✅ Server killed")
