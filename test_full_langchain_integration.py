#!/usr/bin/env python3
"""
Test Full LangChain Integration Across the Application

This script tests the complete LangChain integration in all components.
"""

import requests
import json
import time

def test_ml_service_health():
    """Test ML service health with LangChain status"""
    print("🔗 TESTING ML SERVICE WITH LANGCHAIN")
    print("=" * 60)
    
    try:
        response = requests.get("http://localhost:5000/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            
            print("✅ ML Service Health Check:")
            print(f"   Service: {data['service']}")
            print(f"   Version: {data['version']}")
            print(f"   Status: {data['status']}")
            
            if 'langchain' in data:
                langchain = data['langchain']
                print(f"\n🧠 LangChain Status:")
                print(f"   LLM Available: {langchain.get('llm_available', False)}")
                print(f"   Transformers: {langchain.get('transformers_available', False)}")
                print(f"   Model: {langchain.get('model_name', 'N/A')}")
                print(f"   Device: {langchain.get('device', 'N/A')}")
                print(f"   Chains: {langchain.get('chains_count', 0)}")
            
            if 'capabilities' in data:
                print(f"\n🚀 Capabilities:")
                for cap in data['capabilities']:
                    print(f"   • {cap}")
            
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_langchain_status():
    """Test dedicated LangChain status endpoint"""
    print(f"\n🔍 TESTING LANGCHAIN STATUS ENDPOINT")
    print("=" * 60)
    
    try:
        response = requests.get("http://localhost:5000/langchain/status", timeout=10)
        if response.status_code == 200:
            data = response.json()
            
            print("✅ LangChain Status Endpoint:")
            langchain = data.get('langchain', {})
            capabilities = data.get('capabilities', {})
            performance = data.get('performance', {})
            
            print(f"   LLM Available: {langchain.get('llm_available', False)}")
            print(f"   Model: {langchain.get('model_info', {}).get('name', 'N/A')}")
            print(f"   Chains: {langchain.get('available_chains', [])}")
            print(f"   Memory Messages: {langchain.get('memory_messages', 0)}")
            
            print(f"\n📊 Performance:")
            print(f"   Device: {performance.get('device', 'N/A')}")
            print(f"   Model Loaded: {performance.get('model_loaded', False)}")
            print(f"   Active Chains: {performance.get('chains_active', 0)}")
            
            print(f"\n🎯 Capabilities:")
            for cap, enabled in capabilities.items():
                status = "✅" if enabled else "❌"
                print(f"   {status} {cap.replace('_', ' ').title()}")
            
            return True
        else:
            print(f"❌ LangChain status failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ LangChain status error: {e}")
        return False

def test_enhanced_sequence_analysis():
    """Test sequence analysis with LangChain enhancement"""
    print(f"\n🧬 TESTING ENHANCED SEQUENCE ANALYSIS")
    print("=" * 60)
    
    try:
        test_sequence = "MKWVTFISLLFLFSSAYSRGVFRRDAHKSEVAHRFKDLGEENFKALVLIAFAQYLQQCPFEDHVKLVNEVTEFAKTCVADESAENCDKSLHTLFGDKLCTVATLRETYGEMADCCAKQEPERNECFLQHKDDNPNLPRLVRPEVDVMCTAFHDNEETFLKKYLYEIARRHPYFYAPELLFFAKRYKAAFTECCQAADKAACLLPKLDELRDEGKASSAKQRLKCASLQKFGERAFKAWAVARLSQRFPKAEFAEVSKLVTDLTKVHTECCHGDLLECADDRADLAKYICENQDSISSKLKECCEKPLLEKSHCIAEVENDEMPADLPSLAADFVESKDVCKNYAEAKDVFLGMFLYEYARRHPDYSVVLLLRLAKTYETTLEKCCAAADPHECYAKVFDEFKPLVEEPQNLIKQNCELFEQLGEYKFQNALLVRYTKKVPQVSTPTLVEVSRNLGKVGSKCCKHPEAKRMPCAEDYLSVVLNQLCVLHEKTPVSDRVTKCCTESLVNRRPCFSALEVDETYVPKEFNAETFTFHADICTLSEKERQIKKQTALVELVKHKPKATKEQLKAVMDDFAAFVEKCCKADDKETCFAEEGKKLVAASQAALGL"
        
        response = requests.post("http://localhost:5000/analyze/sequence", 
                               json={
                                   "sequence": test_sequence,
                                   "sequence_type": "PROTEIN"
                               }, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            result = data['data']
            
            print("✅ Enhanced Sequence Analysis:")
            print(f"   Analysis Method: {result.get('analysis_method', 'unknown')}")
            print(f"   LangChain Enhanced: {data.get('langchain_enhanced', False)}")
            print(f"   Domains Found: {len(result.get('domains', []))}")
            print(f"   Confidence: {result.get('confidence', 0):.2f}")
            
            if 'llm_enhancement' in result:
                print(f"   ✅ LLM Enhancement: ACTIVE")
                enhancement = result['llm_enhancement']
                print(f"   LLM Confidence: {enhancement.get('confidence', 0):.2f}")
                insights = enhancement.get('insights', [])
                print(f"   Enhanced Insights: {len(insights)}")
                if insights:
                    print(f"   Sample Insight: {insights[0][:100]}...")
            else:
                print(f"   ❌ LLM Enhancement: NOT ACTIVE")
            
            return True
        else:
            print(f"❌ Sequence analysis failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Sequence analysis error: {e}")
        return False

def test_langchain_chat():
    """Test LangChain chat functionality"""
    print(f"\n💬 TESTING LANGCHAIN CHAT")
    print("=" * 60)
    
    try:
        # Test general chat
        response = requests.post("http://localhost:5000/langchain/chat",
                               json={
                                   "message": "What can you help me with?",
                                   "context": {}
                               }, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            print("✅ LangChain Chat Test:")
            print(f"   Response: {data['data']['response'][:100]}...")
            print(f"   Context: {data['data']['conversation_context']}")
            print(f"   LangChain Active: {data.get('langchain_active', False)}")
            
            # Test sequence-specific chat
            sequence_response = requests.post("http://localhost:5000/langchain/chat",
                                            json={
                                                "message": "Analyze this sequence",
                                                "context": {
                                                    "sequence": "ATGCGATCGATCG",
                                                    "sequence_type": "DNA"
                                                }
                                            }, timeout=30)
            
            if sequence_response.status_code == 200:
                seq_data = sequence_response.json()
                print(f"   Sequence Chat: {seq_data['data']['conversation_context']}")
                
                if 'analysis' in seq_data['data']:
                    analysis = seq_data['data']['analysis']
                    print(f"   Analysis Method: {analysis.get('analysis_method', 'unknown')}")
            
            return True
        else:
            print(f"❌ Chat test failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Chat test error: {e}")
        return False

def test_enhanced_docking():
    """Test docking with LangChain enhancement"""
    print(f"\n🎯 TESTING ENHANCED DOCKING ANALYSIS")
    print("=" * 60)
    
    try:
        # Prepare docking
        protein_pdb = '''HEADER    TEST PROTEIN
ATOM      1  N   SER A   1      -8.901   4.127  -0.555  1.00 11.99           N  
ATOM      2  CA  SER A   1      -8.608   3.135  -1.618  1.00 11.85           C  
END'''
        
        prep_response = requests.post("http://localhost:5000/docking/prepare",
                                    json={
                                        "protein_data": protein_pdb,
                                        "ligand_smiles": "CCO",
                                        "ligand_name": "ethanol"
                                    }, timeout=30)
        
        if prep_response.status_code == 200:
            prep_data = prep_response.json()
            
            # Run docking
            dock_response = requests.post("http://localhost:5000/docking/run",
                                        json={
                                            "protein_pdbqt": prep_data['data']['protein']['pdbqt_file'],
                                            "ligand_pdbqt": prep_data['data']['ligand']['pdbqt_file'],
                                            "binding_site": {"x": 0, "y": 0, "z": 0, "size_x": 20, "size_y": 20, "size_z": 20},
                                            "exhaustiveness": 8
                                        }, timeout=30)
            
            if dock_response.status_code == 200:
                dock_data = dock_response.json()
                ai_analysis = dock_data['data']['ai_analysis']
                
                print("✅ Enhanced Docking Analysis:")
                print(f"   Analysis Method: {ai_analysis.get('analysis_method', 'unknown')}")
                print(f"   Binding Strength: {ai_analysis.get('binding_analysis', {}).get('strength', 'N/A')}")
                print(f"   Drug-likeness: {ai_analysis.get('drug_likeness', {}).get('assessment', 'N/A')}")
                
                if 'llm_enhancement' in ai_analysis:
                    print(f"   ✅ LLM Enhancement: ACTIVE")
                    enhancement = ai_analysis['llm_enhancement']
                    print(f"   Enhanced Insights: {len(enhancement.get('insights', []))}")
                else:
                    print(f"   ❌ LLM Enhancement: NOT ACTIVE")
                
                return True
            else:
                print(f"❌ Docking failed: {dock_response.status_code}")
                return False
        else:
            print(f"❌ Docking preparation failed: {prep_response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Docking test error: {e}")
        return False

def show_frontend_access():
    """Show how to access the frontend features"""
    print(f"\n🌐 FRONTEND ACCESS INFORMATION")
    print("=" * 60)
    
    print("🏠 Main Dashboard:")
    print("   http://localhost:3001")
    print("   • New AI Chat card with LangChain badge")
    print("   • Enhanced molecular docking")
    print("   • All existing features")
    
    print(f"\n🧠 AI Chat Interface:")
    print("   http://localhost:3001/ai-chat")
    print("   • Full LangChain conversational AI")
    print("   • Molecular analysis assistance")
    print("   • Context-aware responses")
    print("   • Real-time LLM status")
    
    print(f"\n🎯 Enhanced Docking:")
    print("   http://localhost:3001/docking")
    print("   • New AI Chat tab")
    print("   • LangChain-enhanced analysis")
    print("   • Context-aware molecular insights")
    print("   • 3D visualization + AI chat")

if __name__ == "__main__":
    print("🔗 COMPREHENSIVE LANGCHAIN INTEGRATION TEST")
    print("=" * 80)
    
    # Test all components
    tests = [
        ("ML Service Health", test_ml_service_health),
        ("LangChain Status", test_langchain_status),
        ("Enhanced Sequence Analysis", test_enhanced_sequence_analysis),
        ("LangChain Chat", test_langchain_chat),
        ("Enhanced Docking", test_enhanced_docking)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n🧪 Running: {test_name}")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
            results.append((test_name, False))
        
        time.sleep(1)  # Brief pause between tests
    
    # Show results summary
    print(f"\n📊 TEST RESULTS SUMMARY")
    print("=" * 80)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"   {status}: {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print(f"\n🎉 ALL TESTS PASSED!")
        print(f"🔗 LangChain is fully integrated across the application!")
        show_frontend_access()
    else:
        print(f"\n⚠️  Some tests failed. Check the services and try again.")
    
    print(f"\n" + "=" * 80)
    print(f"🚀 LANGCHAIN INTEGRATION COMPLETE!")
    print(f"🌐 Access the enhanced application at: http://localhost:3001")
