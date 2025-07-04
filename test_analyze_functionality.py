#!/usr/bin/env python3
"""
Test script to verify the analyze functionality works end-to-end
"""

import requests
import json
import time

def test_simple_analysis_endpoint():
    """Test the simple analysis endpoint directly"""
    print("🧪 Testing Simple Analysis Endpoint")
    print("-" * 40)
    
    test_sequence = "ATGCGATCGTAGCTAGCTAGCTAGCTAGCTAGC"
    
    try:
        response = requests.post(
            "http://localhost:8080/api/sequences/analyze/simple",
            json={"sequence": test_sequence},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Simple analysis endpoint working!")
            print(f"   Sequence length: {result.get('length')}")
            print(f"   GC Content: {result.get('gcContent'):.2f}%")
            print(f"   Prediction: {result.get('prediction')}")
            print(f"   Confidence: {result.get('confidence')}%")
            print(f"   Composition: {result.get('composition')}")
            return True
        else:
            print(f"❌ Endpoint failed with status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing endpoint: {e}")
        return False

def test_frontend_api_integration():
    """Test if the frontend can call the API"""
    print("\n🌐 Testing Frontend API Integration")
    print("-" * 40)
    
    # This simulates what the frontend does
    test_sequence = "ATGCGATCGTAGCTAGCTAGCTAGCTAGCTAGC"
    
    try:
        # Test the API endpoint that the frontend should be calling
        response = requests.post(
            "http://localhost:8080/api/sequences/analyze/simple",
            json={"sequence": test_sequence},
            headers={
                "Content-Type": "application/json",
                "Origin": "http://localhost:3000"  # Simulate frontend origin
            },
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Frontend API integration should work!")
            print("   CORS headers present:", "Access-Control-Allow-Origin" in response.headers)
            return True
        else:
            print(f"❌ API call failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing API integration: {e}")
        return False

def test_ml_service_integration():
    """Test if the backend can communicate with ML service"""
    print("\n🤖 Testing ML Service Integration")
    print("-" * 40)
    
    # Test ML service directly
    try:
        ml_response = requests.post(
            "http://localhost:5000/predict",
            json={
                "features": {
                    "gcContent": 50.0,
                    "orfCount": 2,
                    "length": 100,
                    "motifs": ["ATG", "TAG"]
                }
            },
            timeout=10
        )
        
        if ml_response.status_code == 200:
            ml_result = ml_response.json()
            print("✅ ML Service responding!")
            print(f"   Prediction: {ml_result.get('prediction')}")
            print(f"   Confidence: {ml_result.get('confidence')}")
            print(f"   Model: {ml_result.get('modelVersion')}")
            return True
        else:
            print(f"❌ ML Service failed: {ml_response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ ML Service error: {e}")
        return False

def test_complete_workflow():
    """Test the complete analysis workflow"""
    print("\n🔄 Testing Complete Analysis Workflow")
    print("-" * 40)
    
    # Test with different types of sequences
    test_cases = [
        ("DNA Sequence", "ATGCGATCGTAGCTAGCTAGCTAGCTAGCTAGC"),
        ("GC Rich", "GCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGC"),
        ("AT Rich", "ATATATATATATATATATATATATATATATA"),
        ("Mixed", "ATGCGTACGTACGTACGTACGTACGTACGTAC"),
    ]
    
    results = []
    
    for name, sequence in test_cases:
        print(f"\n📝 Testing {name}...")
        
        try:
            response = requests.post(
                "http://localhost:8080/api/sequences/analyze/simple",
                json={"sequence": sequence},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                results.append({
                    "name": name,
                    "length": result.get('length'),
                    "gcContent": result.get('gcContent'),
                    "prediction": result.get('prediction'),
                    "confidence": result.get('confidence')
                })
                print(f"   ✅ Success - GC: {result.get('gcContent'):.1f}%, Prediction: {result.get('prediction')}")
            else:
                print(f"   ❌ Failed - Status: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    if results:
        print(f"\n📊 Workflow Summary:")
        print("-" * 30)
        for result in results:
            print(f"{result['name']:<12} | GC: {result['gcContent']:5.1f}% | {result['prediction']}")
        
        return True
    else:
        return False

def main():
    """Run all tests"""
    print("🧬 GeneInsight Analyze Functionality Tests")
    print("=" * 50)
    
    tests = [
        ("Simple Analysis Endpoint", test_simple_analysis_endpoint),
        ("Frontend API Integration", test_frontend_api_integration),
        ("ML Service Integration", test_ml_service_integration),
        ("Complete Workflow", test_complete_workflow),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n🔍 Running: {test_name}")
        result = test_func()
        results.append((test_name, result))
        time.sleep(1)  # Small delay between tests
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{test_name:<25} {status}")
        if success:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All analyze functionality tests passed!")
        print("The analyze page should now work properly.")
        print("\n🔗 Try it out:")
        print("   1. Go to http://localhost:3000/analyze")
        print("   2. Enter a DNA sequence (e.g., ATGCGATCGTAGCTAGC)")
        print("   3. Click 'Analyze' button")
        print("   4. See the analysis results!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed.")
        print("Some functionality may not work as expected.")
    
    return passed == total

if __name__ == "__main__":
    main()
