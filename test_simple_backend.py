#!/usr/bin/env python3
"""
Test Simple Backend Endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Service: {data['service']}")
            print(f"   ✅ Status: {data['status']}")
            return True
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_sequence_analysis():
    """Test sequence analysis"""
    print("\n🧬 Testing sequence analysis...")
    try:
        data = {
            "sequence": "ATCGATCGATCGAAATTTCCCGGG",
            "sequence_type": "DNA"
        }
        response = requests.post(f"{BASE_URL}/analyze/langchain", json=data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Success: {result['success']}")
            analysis = result['data']['basic_analysis']
            print(f"   ✅ Length: {analysis['length']} bp")
            print(f"   ✅ GC Content: {analysis['gc_content']}%")
            print(f"   ✅ Insights: {len(analysis['insights'])} findings")
            return True
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_chat():
    """Test chat endpoint"""
    print("\n💬 Testing chat endpoint...")
    try:
        data = {
            "message": "Analyze this DNA sequence: ATCGATCGATCG"
        }
        response = requests.post(f"{BASE_URL}/langchain/chat", json=data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Success: {result['success']}")
            print(f"   ✅ Response length: {len(result['response'])} chars")
            print(f"   ✅ Confidence: {result['metadata']['confidence']}")
            return True
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_status():
    """Test status endpoint"""
    print("\n📊 Testing status endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/langchain/status")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Success: {result['success']}")
            print(f"   ✅ Capabilities: {len(result['capabilities'])} features")
            print(f"   ✅ LLM Available: {result['langchain']['llm_available']}")
            return True
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    print("🚀 Testing GeneInsight Simple Backend")
    print("=" * 50)

    tests = [
        ("Health Check", test_health),
        ("Sequence Analysis", test_sequence_analysis),
        ("AI Chat", test_chat),
        ("System Status", test_status)
    ]

    results = []
    for test_name, test_func in tests:
        success = test_func()
        results.append((test_name, success))

    print("\n" + "=" * 50)
    print("📋 Test Results:")
    passed = 0
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"   {status} {test_name}")
        if success:
            passed += 1

    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")

    if passed == len(results):
        print("\n🎉 All tests passed! Backend is ready for deployment!")
        print(f"🌐 Local URL: {BASE_URL}")
        print(f"📚 API Docs: {BASE_URL}/docs")
        print("💡 Ready to deploy to Replit, Render, or any platform!")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")

if __name__ == "__main__":
    main()