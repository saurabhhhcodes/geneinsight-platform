#!/usr/bin/env python3
"""
Test Railway Deployment for GeneInsight Platform

This script tests the Railway deployment to ensure all LangChain features work.
"""

import requests
import time
import sys

def test_railway_deployment(base_url):
    """Test Railway deployment endpoints"""
    
    print(f"🚂 TESTING RAILWAY DEPLOYMENT")
    print(f"Base URL: {base_url}")
    print("=" * 60)
    
    tests = []
    
    # Test 1: Frontend health
    try:
        response = requests.get(f"{base_url}", timeout=30)
        if response.status_code == 200:
            print("✅ Frontend: Accessible")
            tests.append(("Frontend", True))
        else:
            print(f"❌ Frontend: Error {response.status_code}")
            tests.append(("Frontend", False))
    except Exception as e:
        print(f"❌ Frontend: {e}")
        tests.append(("Frontend", False))
    
    # Test 2: ML Service health
    try:
        response = requests.get(f"{base_url}/api/health", timeout=30)
        if response.status_code == 200:
            data = response.json()
            print("✅ ML Service: Running")
            print(f"   LangChain: {data.get('langchain', {}).get('llm_available', False)}")
            tests.append(("ML Service", True))
        else:
            print(f"❌ ML Service: Error {response.status_code}")
            tests.append(("ML Service", False))
    except Exception as e:
        print(f"❌ ML Service: {e}")
        tests.append(("ML Service", False))
    
    # Test 3: LangChain status
    try:
        response = requests.get(f"{base_url}/api/langchain/status", timeout=30)
        if response.status_code == 200:
            data = response.json()
            langchain = data.get('langchain', {})
            print("✅ LangChain: Active")
            print(f"   Model: {langchain.get('model_info', {}).get('name', 'Unknown')}")
            print(f"   Chains: {langchain.get('chains_initialized', 0)}")
            tests.append(("LangChain", True))
        else:
            print(f"❌ LangChain: Error {response.status_code}")
            tests.append(("LangChain", False))
    except Exception as e:
        print(f"❌ LangChain: {e}")
        tests.append(("LangChain", False))
    
    # Test 4: AI Chat
    try:
        response = requests.post(f"{base_url}/api/langchain/chat", 
                               json={"message": "covid 19"}, 
                               timeout=30)
        if response.status_code == 200:
            data = response.json()
            print("✅ AI Chat: Working")
            print(f"   Response: {data['data']['response'][:50]}...")
            tests.append(("AI Chat", True))
        else:
            print(f"❌ AI Chat: Error {response.status_code}")
            tests.append(("AI Chat", False))
    except Exception as e:
        print(f"❌ AI Chat: {e}")
        tests.append(("AI Chat", False))
    
    # Test 5: Sequence Analysis
    covid_sequence = "SGFRKMAFPSGKVEGCMVQVTCGTTTLNGLWLDDVVYCPRHVICTSEDMLNPNYEDLLIRKSNHNFLVQAGNVQLRVIGHSMQNCVLKLKVDTANPKTPKYKFVRIQPGQTFSVLACYNGSPSGVYQCAMRPNFTIKGSFLNGSCGSVGFNIDYDCVSFCYMHHMELPTGVHAGTDLEGNFYGPFVDRQTAQAAGTDTTITVNVLAWLYAAVINGDRWFLNRFTTTLNDFNLVAMKYNYEPLTQDHVDILGPLSAQTGIAVLDMCASLKELLQNGMNGRTILGSALLEDEFTPFDVVRQCSGVTFQ"
    
    try:
        response = requests.post(f"{base_url}/api/langchain/chat", 
                               json={"message": covid_sequence}, 
                               timeout=60)
        if response.status_code == 200:
            data = response.json()
            print("✅ Sequence Analysis: Working")
            if 'analysis' in data['data']:
                analysis = data['data']['analysis']
                print(f"   Domains: {len(analysis.get('domains', []))}")
                print(f"   Confidence: {analysis.get('confidence', 0)*100:.0f}%")
            tests.append(("Sequence Analysis", True))
        else:
            print(f"❌ Sequence Analysis: Error {response.status_code}")
            tests.append(("Sequence Analysis", False))
    except Exception as e:
        print(f"❌ Sequence Analysis: {e}")
        tests.append(("Sequence Analysis", False))
    
    # Summary
    print(f"\n📊 TEST RESULTS:")
    print("-" * 30)
    passed = 0
    for test_name, result in tests:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print(f"\n🎉 RAILWAY DEPLOYMENT SUCCESSFUL!")
        print(f"🧬 All LangChain features are working!")
        print(f"🌐 Access your app: {base_url}")
        print(f"💬 AI Chat: {base_url}/ai-chat")
        print(f"🎯 Docking: {base_url}/docking")
    else:
        print(f"\n⚠️  Some features may not be working correctly.")
        print(f"Check the Railway logs for more details.")
    
    return passed == len(tests)

def show_deployment_options():
    """Show all deployment options"""
    
    print(f"\n🚀 DEPLOYMENT OPTIONS FOR FULL LANGCHAIN")
    print("=" * 60)
    
    print("🚂 Railway.app (RECOMMENDED):")
    print("   • Free: $5 credit monthly")
    print("   • Command: railway up --dockerfile Dockerfile.railway")
    print("   • Features: Full LangChain + PostgreSQL")
    print("   • URL: https://railway.app")
    
    print(f"\n🎨 Render.com:")
    print("   • Free: Unlimited personal projects")
    print("   • Config: render.yaml")
    print("   • Features: Full LangChain + PostgreSQL")
    print("   • URL: https://render.com")
    
    print(f"\n✈️ Fly.io:")
    print("   • Free: 3 shared VMs")
    print("   • Command: flyctl deploy")
    print("   • Features: Docker + persistent volumes")
    print("   • URL: https://fly.io")
    
    print(f"\n🐳 Local Docker:")
    print("   • Command: docker-compose up -d")
    print("   • Features: Full stack locally")
    print("   • Access: http://localhost:3000")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        base_url = sys.argv[1].rstrip('/')
        test_railway_deployment(base_url)
    else:
        print("Usage: python test-railway-deployment.py <base_url>")
        print("Example: python test-railway-deployment.py https://your-app.railway.app")
        show_deployment_options()
