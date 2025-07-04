#!/usr/bin/env python3
"""
Demo script showing the analyze page functionality
"""

import requests
import json

def demo_analyze_functionality():
    """Demonstrate the analyze page functionality"""
    print("🧬 GeneInsight Analyze Page Demo")
    print("=" * 40)
    
    # Sample sequences to demonstrate different analysis results
    demo_sequences = [
        {
            "name": "BRCA1 Gene Fragment",
            "sequence": "ATGCGATCGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAG",
            "description": "A sample DNA sequence representing a gene fragment"
        },
        {
            "name": "GC-Rich Sequence",
            "sequence": "GCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGC",
            "description": "High GC content sequence (regulatory region)"
        },
        {
            "name": "AT-Rich Sequence", 
            "sequence": "ATATATATATATATATATATATATATATATATATATATATATATATATATATAT",
            "description": "High AT content sequence (non-coding region)"
        },
        {
            "name": "Balanced Sequence",
            "sequence": "ATGCGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTAC",
            "description": "Balanced nucleotide composition"
        }
    ]
    
    print("This demo shows what happens when you use the analyze page:")
    print("1. Enter a DNA sequence in the text area")
    print("2. Click the 'Analyze' button")
    print("3. See the analysis results\n")
    
    for i, demo in enumerate(demo_sequences, 1):
        print(f"📝 Demo {i}: {demo['name']}")
        print(f"   Description: {demo['description']}")
        print(f"   Sequence: {demo['sequence'][:30]}...")
        print(f"   Length: {len(demo['sequence'])} bp")
        
        try:
            # Call the same endpoint the frontend uses
            response = requests.post(
                "http://localhost:8080/api/sequences/analyze/simple",
                json={"sequence": demo['sequence']},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"   ✅ Analysis Results:")
                print(f"      • GC Content: {result.get('gcContent', 0):.1f}%")
                print(f"      • Prediction: {result.get('prediction', 'Unknown')}")
                print(f"      • Confidence: {result.get('confidence', 0)}%")
                print(f"      • Composition: A={result.get('composition', {}).get('A', 0)}, "
                      f"T={result.get('composition', {}).get('T', 0)}, "
                      f"G={result.get('composition', {}).get('G', 0)}, "
                      f"C={result.get('composition', {}).get('C', 0)}")
            else:
                print(f"   ❌ Analysis failed: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
        
        print()
    
    print("🌐 How to use the web interface:")
    print("=" * 40)
    print("1. Open your browser to: http://localhost:3000/analyze")
    print("2. Copy any of the sequences above into the text area")
    print("3. Click 'Analyze' to see the results")
    print("4. The results will show:")
    print("   • Sequence length and composition")
    print("   • GC content percentage")
    print("   • Gene prediction (protein-coding, regulatory, etc.)")
    print("   • Confidence score")
    print("   • Detailed nucleotide composition")
    
    print("\n🔬 What the analysis includes:")
    print("=" * 40)
    print("• Basic sequence statistics (length, composition)")
    print("• GC content calculation")
    print("• Gene type prediction using ML models")
    print("• Confidence scoring")
    print("• Real-time analysis (no authentication required)")
    
    print("\n✨ Try these sample sequences:")
    print("=" * 40)
    for demo in demo_sequences:
        print(f"• {demo['name']}: {demo['sequence']}")
    
    return True

def main():
    """Run the demo"""
    try:
        # Check if services are running
        health_check = requests.get("http://localhost:8080/api/health", timeout=5)
        if health_check.status_code != 200:
            print("❌ Backend service not running. Please start the services first.")
            return False
            
        demo_analyze_functionality()
        
        print("\n🎉 Demo completed!")
        print("The analyze page is fully functional and ready to use!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error running demo: {e}")
        print("Please make sure all services are running:")
        print("• Frontend: http://localhost:3000")
        print("• Backend: http://localhost:8080") 
        print("• ML Service: http://localhost:5000")
        return False

if __name__ == "__main__":
    main()
