#!/usr/bin/env python3
"""
Test Replit Backend Connection
"""

import requests
import json

REPLIT_URL = "https://6d441999-17f0-47ac-94c8-e10957d4469c-00-1aa6zmzvlz1jf.pike.replit.dev"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{REPLIT_URL}/health")
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

def test_langchain_status():
    """Test LangChain status endpoint"""
    print("\n📊 Testing LangChain status endpoint...")
    try:
        response = requests.get(f"{REPLIT_URL}/langchain/status")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success: {data['success']}")
            print(f"   ✅ LLM Available: {data['langchain']['llm_available']}")
            print(f"   ✅ Capabilities: {len(data['capabilities'])} features")
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
            "message": "covid 19"
        }
        response = requests.post(f"{REPLIT_URL}/langchain/chat", json=data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Success: {result['success']}")
            print(f"   ✅ Response: {result['response'][:100]}...")
            return True
        else:
            print(f"   ❌ Error response: {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_sequence_analysis():
    """Test sequence analysis endpoint"""
    print("\n🧬 Testing sequence analysis endpoint...")
    try:
        data = {
            "sequence": "ATCGATCGATCG",
            "sequence_type": "DNA"
        }
        response = requests.post(f"{REPLIT_URL}/analyze/langchain", json=data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Success: {result['success']}")
            analysis = result['data']['basic_analysis']
            print(f"   ✅ Length: {analysis['length']} bp")
            print(f"   ✅ GC Content: {analysis['gc_content']}%")
            return True
        else:
            print(f"   ❌ Error response: {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    print("🚀 Testing GeneInsight Replit Backend")
    print("=" * 50)
    print(f"🌐 Backend URL: {REPLIT_URL}")
    
    tests = [
        ("Health Check", test_health),
        ("LangChain Status", test_langchain_status),
        ("Chat Endpoint", test_chat),
        ("Sequence Analysis", test_sequence_analysis)
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
        print("\n🎉 All tests passed! Replit backend is working perfectly!")
        print("🔗 Your frontend should now connect successfully.")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")

if __name__ == "__main__":
    main()
