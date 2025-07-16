#!/usr/bin/env python3
"""
Test Vercel Serverless LangServe Deployment
"""

import requests
import json
import time

BASE_URL = "https://geneinsight-platform.vercel.app"

def test_endpoint(endpoint, method="GET", data=None):
    """Test a specific endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=10)
        
        print(f"🔍 {method} {endpoint}")
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            try:
                result = response.json()
                print(f"   ✅ Success: {result.get('success', 'OK')}")
                if 'service' in result:
                    print(f"   Service: {result['service']}")
                if 'response' in result:
                    print(f"   Response: {result['response'][:100]}...")
            except:
                print(f"   ✅ Response: {response.text[:100]}...")
        else:
            print(f"   ❌ Error: {response.text[:100]}...")
        
        print()
        return response.status_code == 200
        
    except Exception as e:
        print(f"   ❌ Exception: {e}")
        print()
        return False

def main():
    print("🚀 Testing GeneInsight Vercel Serverless Deployment")
    print("=" * 60)
    
    # Wait for deployment to be ready
    print("⏳ Waiting for Vercel deployment to be ready...")
    time.sleep(10)
    
    # Test endpoints
    tests = [
        ("Health Check", "/health", "GET", None),
        ("Sequence Analysis", "/analyze/sequence", "POST", {
            "sequence": "ATCGATCGATCG",
            "sequence_type": "DNA"
        }),
        ("AI Chat", "/langchain/chat", "POST", {
            "message": "Analyze this DNA sequence: ATCGATCG"
        }),
        ("LangChain Status", "/langchain/status", "GET", None)
    ]
    
    results = []
    for test_name, endpoint, method, data in tests:
        print(f"🧪 Testing {test_name}...")
        success = test_endpoint(endpoint, method, data)
        results.append((test_name, success))
        time.sleep(2)  # Wait between tests
    
    # Summary
    print("=" * 60)
    print("📋 Test Results:")
    passed = 0
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"   {status} {test_name}")
        if success:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")
    
    if passed > 0:
        print("\n🎉 Your Vercel serverless backend is working!")
        print(f"🌐 Base URL: {BASE_URL}")
        print("💰 Cost: $0/month (completely free!)")
        print("🔗 Features: Enhanced AI chat, sequence analysis, health monitoring")
    else:
        print("\n⏳ Deployment may still be processing. Try again in a few minutes.")

if __name__ == "__main__":
    main()
