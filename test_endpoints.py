#!/usr/bin/env python3
"""
Test script for LangServe endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_sequence_analysis():
    """Test sequence analysis endpoint"""
    print("\n🧬 Testing sequence analysis endpoint...")
    try:
        data = {
            "input": {
                "sequence": "ATCGATCGATCG",
                "sequence_type": "DNA"
            }
        }
        response = requests.post(f"{BASE_URL}/analyze/sequence/invoke", json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_chat():
    """Test chat endpoint"""
    print("\n💬 Testing chat endpoint...")
    try:
        data = {
            "input": {
                "message": "Hello, can you analyze a DNA sequence?"
            }
        }
        response = requests.post(f"{BASE_URL}/langchain/chat/invoke", json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_langchain_status():
    """Test LangChain status endpoint"""
    print("\n📊 Testing LangChain status endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/langchain/status")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_rest_endpoint():
    """Test REST compatibility endpoint"""
    print("\n🔄 Testing REST compatibility endpoint...")
    try:
        data = {
            "sequence": "ATCGATCGATCG",
            "sequence_type": "DNA"
        }
        response = requests.post(f"{BASE_URL}/analyze/langchain", json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing GeneInsight LangServe Endpoints")
    print("=" * 50)
    
    tests = [
        ("Health Check", test_health),
        ("Sequence Analysis (LangServe)", test_sequence_analysis),
        ("Chat (LangServe)", test_chat),
        ("LangChain Status", test_langchain_status),
        ("REST Compatibility", test_rest_endpoint)
    ]
    
    results = []
    for test_name, test_func in tests:
        success = test_func()
        results.append((test_name, success))
    
    print("\n" + "=" * 50)
    print("📋 Test Results:")
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"  {status} {test_name}")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    print(f"\n🎯 Overall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! LangServe is ready for deployment.")
    else:
        print("⚠️  Some tests failed. Check the errors above.")
