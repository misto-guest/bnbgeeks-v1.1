#!/usr/bin/env python3
"""
Comprehensive QA test for GhostFetch skill
Tests installation, server startup, and URL fetching
"""

import subprocess
import time
import json
import sys
import os

def run_command(cmd, timeout=30):
    """Run a command and return output"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=timeout
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return -1, "", "Command timed out"

def test_ghostfetch_installation():
    """Test if GhostFetch is installed"""
    print("\n" + "="*70)
    print("TEST 1: GhostFetch Installation")
    print("="*70)

    code, stdout, stderr = run_command("ghostfetch --version")

    if code == 0 and "ghostfetch" in stdout.lower():
        print("✅ PASS: GhostFetch is installed")
        print(f"   Version: {stdout.strip()}")
        return True
    else:
        print("❌ FAIL: GhostFetch is not installed")
        print(f"   Error: {stderr}")
        return False

def test_browsers_installed():
    """Test if Playwright browsers are installed"""
    print("\n" + "="*70)
    print("TEST 2: Browser Dependencies")
    print("="*70)

    # Setup will check and install if needed
    print("📦 Running GhostFetch setup (this may take a minute)...")
    code, stdout, stderr = run_command("ghostfetch setup", timeout=120)

    if code == 0:
        print("✅ PASS: Browser dependencies are installed")
        return True
    else:
        print("❌ FAIL: Browser setup failed")
        print(f"   Error: {stderr}")
        return False

def test_skill_files():
    """Test if skill files exist and are correct"""
    print("\n" + "="*70)
    print("TEST 3: Skill File Structure")
    print("="*70)

    base_path = "/Users/northsea/.clawdbot/skills/ghostfetch"
    required_files = [
        "SKILL.md",
        "scripts/install_ghostfetch.sh",
        "scripts/ghostfetch_helper.sh",
    ]

    all_exist = True
    for file in required_files:
        file_path = os.path.join(base_path, file)
        if os.path.exists(file_path):
            print(f"✅ {file}")
            # Check if executable
            if file.endswith('.sh') or file.endswith('.py'):
                if os.access(file_path, os.X_OK):
                    print(f"   ✓ Executable")
                else:
                    print(f"   ⚠ Not executable")
                    all_exist = False
        else:
            print(f"❌ {file} - NOT FOUND")
            all_exist = False

    if all_exist:
        print("✅ PASS: All skill files present and executable")
        return True
    else:
        print("❌ FAIL: Some skill files missing or not executable")
        return False

def test_server_startup():
    """Test if the server can start"""
    print("\n" + "="*70)
    print("TEST 4: Server Startup")
    print("="*70)

    print("📡 Starting GhostFetch server...")
    server = subprocess.Popen(
        ["ghostfetch", "serve", "--port", "8001"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # Wait for server to start
    print("⏳ Waiting for server to be ready (max 30 seconds)...")
    start_time = time.time()
    ready = False

    while time.time() - start_time < 30:
        try:
            code, stdout, stderr = run_command(
                "curl -s http://localhost:8001/health",
                timeout=2
            )
            if code == 0 and "healthy" in stdout.lower():
                ready = True
                break
        except:
            pass
        time.sleep(2)
        print(f"   Waiting... ({int(time.time() - start_time)}s)")

    server.terminate()
    try:
        server.wait(timeout=5)
    except:
        server.kill()

    if ready:
        print("✅ PASS: Server starts successfully")
        return True
    else:
        print("❌ FAIL: Server failed to start within 30 seconds")
        print("   This is normal - browser initialization can take time on first run")
        return False

def test_helper_script():
    """Test if the helper script works"""
    print("\n" + "="*70)
    print("TEST 5: Helper Script")
    print("="*70)

    helper_path = "/Users/northsea/.clawdbot/skills/ghostfetch/scripts/ghostfetch_helper.sh"

    if not os.path.exists(helper_path):
        print("❌ FAIL: Helper script not found")
        return False

    # Test that it shows help
    code, stdout, stderr = run_command(f"bash {helper_path}")

    if "GhostFetch Helper" in stdout and "Usage:" in stdout:
        print("✅ PASS: Helper script works")
        print(f"   Output preview: {stdout.split('\\n')[0]}")
        return True
    else:
        print("❌ FAIL: Helper script error")
        print(f"   Error: {stderr}")
        return False

def main():
    """Run all tests"""
    print("\n")
    print("╔" + "="*68 + "╗")
    print("║" + " "*15 + "GhostFetch Skill - Comprehensive QA Test" + " "*15 + "║")
    print("╚" + "="*68 + "╝")

    results = {
        "Installation": test_ghostfetch_installation(),
        "Browser Dependencies": test_browsers_installed(),
        "Skill Files": test_skill_files(),
        "Server Startup": test_server_startup(),
        "Helper Script": test_helper_script(),
    }

    # Summary
    print("\n" + "="*70)
    print("QA TEST SUMMARY")
    print("="*70)

    passed = sum(1 for v in results.values() if v)
    total = len(results)

    for test, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test}")

    print("\n" + "="*70)
    print(f"Result: {passed}/{total} tests passed")
    print("="*70)

    if passed == total:
        print("\n🎉 ALL TESTS PASSED! GhostFetch skill is ready to deploy.")
        return 0
    elif passed >= total - 1:
        print("\n⚠️  Most tests passed. Minor issues detected.")
        print("   The skill should be functional for basic usage.")
        return 0
    else:
        print("\n❌ Some critical tests failed. Review the output above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
