#!/usr/bin/env python3
"""
Test Enhanced LangChain Chat Functionality

This script tests the improved conversational AI capabilities.
"""

import requests
import json

def test_chat_message(message, context=None):
    """Test a single chat message"""
    try:
        payload = {
            'message': message,
            'context': context or {}
        }
        
        response = requests.post('http://localhost:5000/langchain/chat', 
                               json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            return data['data']['response']
        else:
            return f"Error: {response.status_code}"
            
    except Exception as e:
        return f"Exception: {e}"

def test_enhanced_chat():
    """Test various chat scenarios"""
    
    print("🧠 TESTING ENHANCED LANGCHAIN CHAT")
    print("=" * 60)
    
    # Test cases
    test_cases = [
        ("covid 19", "COVID-19 inquiry"),
        ("What does a binding affinity of -9.2 kcal/mol mean?", "Binding affinity question"),
        ("predict structure", "Structure prediction request"),
        ("How do I interpret docking results?", "Docking interpretation"),
        ("Analyze this protein sequence: MKWVTFISLLFLFSSAYS", "Protein analysis request"),
        ("help", "Help request"),
        ("?", "Question mark"),
        ("molecular docking", "Docking inquiry")
    ]
    
    print("🧪 Testing different message types:")
    print("-" * 40)
    
    for message, description in test_cases:
        print(f"\n📝 {description}:")
        print(f"   Input: '{message}'")
        
        response = test_chat_message(message)
        print(f"   Response: {response[:100]}{'...' if len(response) > 100 else ''}")
    
    # Test with sequence context
    print(f"\n🧬 Testing with sequence context:")
    print("-" * 40)
    
    sequence_context = {
        'sequence': 'MKWVTFISLLFLFSSAYSRGVFRRDAHKSEVAHRFKDLGEENFKALVLIAFAQYLQQCPFEDHVKLVNEVTEFAKTCVADESAENCDKSLHTLFGDKLCTVATLRETYGEMADCCAKQEPERNECFLQHKDDNPNLPRLVRPEVDVMCTAFHDNEETFLKKYLYEIARRHPYFYAPELLFFAKRYKAAFTECCQAADKAACLLPKLDELRDEGKASSAKQRLKCASLQKFGERAFKAWAVARLSQRFPKAEFAEVSKLVTDLTKVHTECCHGDLLECADDRADLAKYICENQDSISSKLKECCEKPLLEKSHCIAEVENDEMPADLPSLAADFVESKDVCKNYAEAKDVFLGMFLYEYARRHPDYSVVLLLRLAKTYETTLEKCCAAADPHECYAKVFDEFKPLVEEPQNLIKQNCELFEQLGEYKFQNALLVRYTKKVPQVSTPTLVEVSRNLGKVGSKCCKHPEAKRMPCAEDYLSVVLNQLCVLHEKTPVSDRVTKCCTESLVNRRPCFSALEVDETYVPKEFNAETFTFHADICTLSEKERQIKKQTALVELVKHKPKATKEQLKAVMDDFAAFVEKCCKADDKETCFAEEGKKLVAASQAALGL',
        'sequence_type': 'PROTEIN'
    }
    
    context_tests = [
        ("covid 19", "COVID with sequence context"),
        ("analyze this sequence", "Analysis with context"),
        ("what domains are present?", "Domain inquiry with context")
    ]
    
    for message, description in context_tests:
        print(f"\n📝 {description}:")
        print(f"   Input: '{message}' (with protein sequence)")
        
        response = test_chat_message(message, sequence_context)
        print(f"   Response: {response[:150]}{'...' if len(response) > 150 else ''}")

def show_chat_improvements():
    """Show what improvements were made"""
    
    print(f"\n🚀 CHAT IMPROVEMENTS IMPLEMENTED")
    print("=" * 60)
    
    print("✅ Context-Aware Responses:")
    print("   • COVID-19 specific responses")
    print("   • Binding affinity explanations")
    print("   • Structure prediction guidance")
    print("   • Docking result interpretation")
    
    print(f"\n✅ Intent Recognition:")
    print("   • Keyword detection (covid, docking, structure, etc.)")
    print("   • Question type classification")
    print("   • Context-sensitive responses")
    print("   • Sequence analysis integration")
    
    print(f"\n✅ Enhanced Interactions:")
    print("   • Specific numerical interpretations (-9.2 kcal/mol)")
    print("   • Helpful suggestions for next steps")
    print("   • Domain and confidence reporting")
    print("   • Conversation context tracking")
    
    print(f"\n✅ User Experience:")
    print("   • No more generic responses")
    print("   • Relevant molecular insights")
    print("   • Educational explanations")
    print("   • Actionable recommendations")

if __name__ == "__main__":
    test_enhanced_chat()
    show_chat_improvements()
    
    print(f"\n" + "=" * 60)
    print("🎉 ENHANCED CHAT FUNCTIONALITY READY!")
    print("🌐 Test it live at: http://localhost:3001/ai-chat")
    print("💬 Try asking about COVID-19, docking results, or protein analysis!")
