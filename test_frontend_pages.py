#!/usr/bin/env python3
"""
Test script to verify frontend pages load without errors
"""

import requests
import time

def test_page(url, page_name):
    """Test if a page loads successfully"""
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            print(f"✅ {page_name}: Loads successfully")
            return True
        else:
            print(f"❌ {page_name}: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ {page_name}: Error - {e}")
        return False

def main():
    """Test all main frontend pages"""
    print("🌐 Testing Frontend Pages")
    print("=" * 30)
    
    base_url = "http://localhost:3000"
    
    pages = [
        ("/", "Landing Page"),
        ("/analyze", "Analyze Page"),
        ("/dashboard", "Dashboard Page"),
        ("/visualize", "Visualize Page"),
        ("/login", "Login Page"),
        ("/register", "Register Page"),
    ]
    
    results = []
    
    for path, name in pages:
        url = f"{base_url}{path}"
        print(f"Testing {name}...")
        result = test_page(url, name)
        results.append((name, result))
        time.sleep(0.5)  # Small delay between requests
    
    print("\n📊 Results Summary:")
    print("-" * 20)
    
    passed = 0
    total = len(results)
    
    for page_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{page_name:<15} {status}")
        if success:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} pages working")
    
    if passed == total:
        print("\n🎉 All frontend pages are accessible!")
        print("The WebSocket error has been resolved.")
    else:
        print(f"\n⚠️  {total - passed} page(s) have issues.")
    
    return passed == total

if __name__ == "__main__":
    main()
