#!/usr/bin/env python3
"""Test GhostFetch functionality"""

import json
import sys

try:
    from ghostfetch import fetch

    print("👻 Testing GhostFetch...")
    print("=" * 50)

    # Test 1: Simple URL
    print("\n📝 Test 1: Fetching example.com")
    print("-" * 50)
    result = fetch("https://example.com")

    if result and result.get("status") == "success":
        print("✅ SUCCESS")
        print(f"Title: {result.get('metadata', {}).get('title', 'N/A')}")
        print(f"URL: {result.get('url', 'N/A')}")
        print(f"Markdown length: {len(result.get('markdown', ''))} chars")

        # Show a preview of the markdown
        markdown = result.get('markdown', '')
        preview = markdown[:200] + "..." if len(markdown) > 200 else markdown
        print(f"\nPreview:\n{preview}")
    else:
        print("❌ FAILED")
        print(f"Result: {result}")
        sys.exit(1)

    # Test 2: Try a more complex site (wikipedia)
    print("\n\n📝 Test 2: Fetching Wikipedia page")
    print("-" * 50)
    result2 = fetch("https://en.wikipedia.org/wiki/Web_scraping")

    if result2 and result2.get("status") == "success":
        print("✅ SUCCESS")
        print(f"Title: {result2.get('metadata', {}).get('title', 'N/A')}")
        print(f"Author: {result2.get('metadata', {}).get('author', 'N/A')}")
        print(f"Markdown length: {len(result2.get('markdown', ''))} chars")

        # Show first line
        first_line = result2.get('markdown', '').split('\n')[0]
        print(f"\nFirst line: {first_line}")
    else:
        print("❌ FAILED")
        print(f"Result: {result2}")

    print("\n\n" + "=" * 50)
    print("🎉 GhostFetch is working!")
    print("=" * 50)

except ImportError as e:
    print(f"❌ Failed to import ghostfetch: {e}")
    print("\n💡 Try installing with: pipx install ghostfetch")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error during testing: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
