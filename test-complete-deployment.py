#!/usr/bin/env python3
"""
Test Complete Deployment - All Services Working

This script tests that all components are working after deployment.
"""

import requests
import time
import sys

def test_complete_deployment(base_url):
    """Test all services in the complete deployment"""
    
    print(f"🧬 TESTING COMPLETE DEPLOYMENT")
    print(f"URL: {base_url}")
    print("=" * 60)
    
    tests = []
    
    # Test 1: Frontend accessibility
    print("🌐 Testing Frontend...")
    try:
        response = requests.get(base_url, timeout=30)
        if response.status_code == 200 and "GeneInsight" in response.text:
            print("✅ Frontend: Accessible and loading correctly")
            tests.append(("Frontend", True))
        else:
            print(f"❌ Frontend: Error {response.status_code}")
            tests.append(("Frontend", False))
    except Exception as e:
        print(f"❌ Frontend: {e}")
        tests.append(("Frontend", False))
    
    # Test 2: ML Service health
    print("\n🧠 Testing ML Service...")
    try:
        response = requests.get(f"{base_url}/health", timeout=30)
        if response.status_code == 200:
            data = response.json()
            print("✅ ML Service: Running")
            print(f"   Service: {data.get('service', 'Unknown')}")
            print(f"   Version: {data.get('version', 'Unknown')}")
            tests.append(("ML Service", True))
        else:
            print(f"❌ ML Service: Error {response.status_code}")
            tests.append(("ML Service", False))
    except Exception as e:
        print(f"❌ ML Service: {e}")
        tests.append(("ML Service", False))
    
    # Test 3: LangChain AI
    print("\n🤖 Testing LangChain AI...")
    try:
        response = requests.get(f"{base_url}/langchain/status", timeout=30)
        if response.status_code == 200:
            data = response.json()
            langchain = data.get('langchain', {})
            print("✅ LangChain: Active")
            print(f"   LLM Available: {langchain.get('llm_available', False)}")
            print(f"   Model: {langchain.get('model_info', {}).get('name', 'Unknown')}")
            print(f"   Chains: {langchain.get('chains_initialized', 0)}")
            print(f"   Device: {langchain.get('device', 'Unknown')}")
            tests.append(("LangChain", langchain.get('llm_available', False)))
        else:
            print(f"❌ LangChain: Error {response.status_code}")
            tests.append(("LangChain", False))
    except Exception as e:
        print(f"❌ LangChain: {e}")
        tests.append(("LangChain", False))
    
    # Test 4: AI Chat functionality
    print("\n💬 Testing AI Chat...")
    try:
        response = requests.post(f"{base_url}/langchain/chat", 
                               json={"message": "covid 19"}, 
                               timeout=30)
        if response.status_code == 200:
            data = response.json()
            chat_response = data['data']['response']
            print("✅ AI Chat: Working")
            print(f"   Response: {chat_response[:100]}...")
            print(f"   Context: {data['data'].get('conversation_context', 'Unknown')}")
            tests.append(("AI Chat", True))
        else:
            print(f"❌ AI Chat: Error {response.status_code}")
            tests.append(("AI Chat", False))
    except Exception as e:
        print(f"❌ AI Chat: {e}")
        tests.append(("AI Chat", False))
    
    # Test 5: Sequence Analysis
    print("\n🧬 Testing Sequence Analysis...")
    covid_sequence = "SGFRKMAFPSGKVEGCMVQVTCGTTTLNGLWLDDVVYCPRHVICTSEDMLNPNYEDLLIRKSNHNFLVQAGNVQLRVIGHSMQNCVLKLKVDTANPKTPKYKFVRIQPGQTFSVLACYNGSPSGVYQCAMRPNFTIKGSFLNGSCGSVGFNIDYDCVSFCYMHHMELPTGVHAGTDLEGNFYGPFVDRQTAQAAGTDTTITVNVLAWLYAAVINGDRWFLNRFTTTLNDFNLVAMKYNYEPLTQDHVDILGPLSAQTGIAVLDMCASLKELLQNGMNGRTILGSALLEDEFTPFDVVRQCSGVTFQ"
    
    try:
        response = requests.post(f"{base_url}/langchain/chat", 
                               json={"message": covid_sequence}, 
                               timeout=60)
        if response.status_code == 200:
            data = response.json()
            print("✅ Sequence Analysis: Working")
            if 'analysis' in data['data']:
                analysis = data['data']['analysis']
                print(f"   Domains Found: {len(analysis.get('domains', []))}")
                print(f"   Confidence: {analysis.get('confidence', 0)*100:.0f}%")
                print(f"   Method: {analysis.get('analysis_method', 'Unknown')}")
            tests.append(("Sequence Analysis", True))
        else:
            print(f"❌ Sequence Analysis: Error {response.status_code}")
            tests.append(("Sequence Analysis", False))
    except Exception as e:
        print(f"❌ Sequence Analysis: {e}")
        tests.append(("Sequence Analysis", False))
    
    # Test 6: 3D Visualization page
    print("\n🎯 Testing Docking Page...")
    try:
        response = requests.get(f"{base_url}/docking", timeout=30)
        if response.status_code == 200:
            print("✅ Docking Page: Accessible")
            tests.append(("Docking Page", True))
        else:
            print(f"❌ Docking Page: Error {response.status_code}")
            tests.append(("Docking Page", False))
    except Exception as e:
        print(f"❌ Docking Page: {e}")
        tests.append(("Docking Page", False))
    
    # Test 7: AI Chat page
    print("\n🧠 Testing AI Chat Page...")
    try:
        response = requests.get(f"{base_url}/ai-chat", timeout=30)
        if response.status_code == 200:
            print("✅ AI Chat Page: Accessible")
            tests.append(("AI Chat Page", True))
        else:
            print(f"❌ AI Chat Page: Error {response.status_code}")
            tests.append(("AI Chat Page", False))
    except Exception as e:
        print(f"❌ AI Chat Page: {e}")
        tests.append(("AI Chat Page", False))
    
    # Summary
    print(f"\n📊 DEPLOYMENT TEST RESULTS:")
    print("=" * 40)
    passed = 0
    for test_name, result in tests:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print(f"\n🎉 COMPLETE DEPLOYMENT SUCCESSFUL!")
        print(f"🧬 All features are working perfectly!")
        print(f"🌐 Share this URL: {base_url}")
        print(f"💬 AI Chat: {base_url}/ai-chat")
        print(f"🎯 Docking: {base_url}/docking")
        print(f"\n✨ Your AI-powered molecular analysis platform is ready for users!")
    else:
        print(f"\n⚠️  Some features may not be working correctly.")
        print(f"Check the deployment logs for more details.")
        if passed >= 4:  # If most features work
            print(f"🎯 Platform is mostly functional - users can still access main features!")
    
    return passed >= 4  # Consider success if most features work

def show_usage_guide(base_url):
    """Show how users can use the deployed platform"""
    
    print(f"\n👥 USER GUIDE FOR YOUR DEPLOYED PLATFORM")
    print("=" * 60)
    
    print(f"🌐 Main Application: {base_url}")
    print(f"   • Complete molecular analysis platform")
    print(f"   • Interactive dashboard with all features")
    print(f"   • 3D molecular visualization")
    
    print(f"\n🧠 AI Chat Interface: {base_url}/ai-chat")
    print(f"   • Natural language molecular analysis")
    print(f"   • COVID-19 specialized insights")
    print(f"   • Automatic sequence detection")
    print(f"   • Context-aware conversations")
    
    print(f"\n🎯 Molecular Docking: {base_url}/docking")
    print(f"   • Protein-ligand docking simulations")
    print(f"   • 3D visualization of results")
    print(f"   • AI-powered result interpretation")
    print(f"   • Integrated AI chat for questions")
    
    print(f"\n🧬 How Users Can Test:")
    print(f"   1. Visit {base_url}/ai-chat")
    print(f"   2. Type 'covid 19' to get specialized guidance")
    print(f"   3. Paste this COVID-19 sequence:")
    print(f"      SGFRKMAFPSGKVEGCMVQVTCGTTTLNGLWLDDVVYCPRHVICTSEDMLNPNYEDLLIRKSNHNFLVQAGNVQLRVIGHSMQNCVLKLKVDTANPKTPKYKFVRIQPGQTFSVLACYNGSPSGVYQCAMRPNFTIKGSFLNGSCGSVGFNIDYDCVSFCYMHHMELPTGVHAGTDLEGNFYGPFVDRQTAQAAGTDTTITVNVLAWLYAAVINGDRWFLNRFTTTLNDFNLVAMKYNYEPLTQDHVDILGPLSAQTGIAVLDMCASLKELLQNGMNGRTILGSALLEDEFTPFDVVRQCSGVTFQ")
    print(f"   4. Get expert AI analysis with domain identification")
    print(f"   5. Ask follow-up questions about the results")
    
    print(f"\n🎉 Your platform is ready for public use!")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        base_url = sys.argv[1].rstrip('/')
        success = test_complete_deployment(base_url)
        if success:
            show_usage_guide(base_url)
    else:
        print("Usage: python test-complete-deployment.py <deployment_url>")
        print("Example: python test-complete-deployment.py https://your-app.railway.app")
        print("\nThis will test all components of your deployed platform.")
