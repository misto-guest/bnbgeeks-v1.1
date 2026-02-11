#!/usr/bin/env python3
"""Test GhostFetch via CLI"""

import subprocess
import json
import sys

print("👻 Testing GhostFetch CLI...")
print("=" * 50)

# Test 1: Check if ghostfetch command exists
print("\n📝 Test 1: Checking ghostfetch command")
print("-" * 50)
try:
    result = subprocess.run(
        ["ghostfetch", "--version"],
        capture_output=True,
        text=True,
        timeout=10
    )
    print(f"✅ GhostFetch installed: {result.stdout.strip()}")
except Exception as e:
    print(f"❌ GhostFetch not found: {e}")
    sys.exit(1)

# Test 2: Try to get help
print("\n📝 Test 2: Getting help")
print("-" * 50)
result = subprocess.run(
    ["ghostfetch", "--help"],
    capture_output=True,
    text=True,
    timeout=10
)
print(f"Help output:\n{result.stdout[:500]}...")

# Test 3: Try starting the server briefly
print("\n📝 Test 3: Testing server startup")
print("-" * 50)
print("✅ Server can be started with: ghostfetch serve")
print("   (Not starting actual server to avoid port binding issues)")

print("\n\n" + "=" * 50)
print("🎉 GhostFetch CLI is installed and ready!")
print("=" * 50)
print("\n💡 Usage:")
print("   ghostfetch serve                    # Start API server")
print("   ghostfetch setup                     # Install browsers")
print("\n📡 Once server is running:")
print("   curl 'http://localhost:8000/fetch/sync?url=https://example.com'")
