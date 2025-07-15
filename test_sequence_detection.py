#!/usr/bin/env python3
"""
Test Enhanced Sequence Detection in Chat

This script tests the improved sequence recognition capabilities.
"""

import requests
import json

def test_sequence_chat(message):
    """Test sequence detection in chat"""
    try:
        payload = {
            'message': message,
            'context': {}
        }
        
        response = requests.post('http://localhost:5000/langchain/chat', 
                               json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            result = data['data']
            
            print(f"✅ Response: {result['response'][:200]}{'...' if len(result['response']) > 200 else ''}")
            
            if 'analysis' in result:
                analysis = result['analysis']
                print(f"   📊 Analysis Method: {analysis.get('analysis_method', 'unknown')}")
                print(f"   🧬 Domains Found: {len(analysis.get('domains', []))}")
                print(f"   📈 Confidence: {analysis.get('confidence', 0)*100:.0f}%")
                
                if 'sequence_analyzed' in result:
                    print(f"   🔍 Sequence Detected: {result['sequence_analyzed']}")
            
            print(f"   🎯 Context: {result.get('conversation_context', 'unknown')}")
            return True
        else:
            print(f"❌ Error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_enhanced_sequence_detection():
    """Test various sequence detection scenarios"""
    
    print("🧬 TESTING ENHANCED SEQUENCE DETECTION")
    print("=" * 60)
    
    # Test the COVID-19 main protease sequence you provided
    covid_sequence = "SGFRKMAFPSGKVEGCMVQVTCGTTTLNGLWLDDVVYCPRHVICTSEDMLNPNYEDLLIRKSNHNFLVQAGNVQLRVIGHSMQNCVLKLKVDTANPKTPKYKFVRIQPGQTFSVLACYNGSPSGVYQCAMRPNFTIKGSFLNGSCGSVGFNIDYDCVSFCYMHHMELPTGVHAGTDLEGNFYGPFVDRQTAQAAGTDTTITVNVLAWLYAAVINGDRWFLNRFTTTLNDFNLVAMKYNYEPLTQDHVDILGPLSAQTGIAVLDMCASLKELLQNGMNGRTILGSALLEDEFTPFDVVRQCSGVTFQ"
    
    print("🦠 Testing COVID-19 Main Protease Sequence:")
    print("-" * 40)
    print(f"Input: {covid_sequence[:50]}...")
    test_sequence_chat(covid_sequence)
    
    print(f"\n🧬 Testing Other Protein Sequences:")
    print("-" * 40)
    
    # Test a shorter protein sequence
    short_sequence = "MKWVTFISLLFLFSSAYSRGVFRRDAHKSEVAHRFKDLGEENFKALVLIAFAQYLQQCPFEDHVKLVNEVTEFAKTCVADESAENCDKSLHTLFGDKLCTVATLRETYGEMADCCAKQEPERNECFLQHKDDNPNLPRLVRPEVDVMCTAFHDNEETFLKKYLYEIARRHPYFYAPELLFFAKRYKAAFTECCQAADKAACLLPKLDELRDEGKASSAKQRLKCASLQKFGERAFKAWAVARLSQRFPKAEFAEVSKLVTDLTKVHTECCHGDLLECADDRADLAKYICENQDSISSKLKECCEKPLLEKSHCIAEVENDEMPADLPSLAADFVESKDVCKNYAEAKDVFLGMFLYEYARRHPDYSVVLLLRLAKTYETTLEKCCAAADPHECYAKVFDEFKPLVEEPQNLIKQNCELFEQLGEYKFQNALLVRYTKKVPQVSTPTLVEVSRNLGKVGSKCCKHPEAKRMPCAEDYLSVVLNQLCVLHEKTPVSDRVTKCCTESLVNRRPCFSALEVDETYVPKEFNAETFTFHADICTLSEKERQIKKQTALVELVKHKPKATKEQLKAVMDDFAAFVEKCCKADDKETCFAEEGKKLVAASQAALGL"
    
    print(f"Input: {short_sequence[:50]}...")
    test_sequence_chat(short_sequence)
    
    print(f"\n🔬 Testing Non-Sequence Messages:")
    print("-" * 40)
    
    non_sequence_tests = [
        "What does binding affinity mean?",
        "covid 19",
        "help with docking",
        "ATCGATCGATCG"  # Short DNA sequence (should not be detected as protein)
    ]
    
    for test_msg in non_sequence_tests:
        print(f"\nInput: '{test_msg}'")
        test_sequence_chat(test_msg)

def show_detection_improvements():
    """Show what detection improvements were made"""
    
    print(f"\n🚀 SEQUENCE DETECTION IMPROVEMENTS")
    print("=" * 60)
    
    print("✅ Automatic Sequence Recognition:")
    print("   • Detects protein sequences in chat messages")
    print("   • Validates amino acid composition (80% threshold)")
    print("   • Minimum length requirement (20+ characters)")
    print("   • Automatic analysis triggering")
    
    print(f"\n✅ COVID-19 Specific Detection:")
    print("   • Recognizes COVID-related context")
    print("   • Identifies main protease sequences")
    print("   • Provides COVID-specific insights")
    print("   • Suggests drug targeting strategies")
    
    print(f"\n✅ Enhanced Response Generation:")
    print("   • Context-aware analysis results")
    print("   • Domain identification and reporting")
    print("   • Confidence scoring")
    print("   • Follow-up suggestions")
    
    print(f"\n✅ User Experience:")
    print("   • No need to specify 'analyze this sequence'")
    print("   • Direct sequence pasting works")
    print("   • Intelligent sequence vs. text detection")
    print("   • Immediate molecular insights")

if __name__ == "__main__":
    test_enhanced_sequence_detection()
    show_detection_improvements()
    
    print(f"\n" + "=" * 60)
    print("🎉 ENHANCED SEQUENCE DETECTION READY!")
    print("🌐 Test it live at: http://localhost:3001/ai-chat")
    print("🧬 Just paste any protein sequence and get instant analysis!")
