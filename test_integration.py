#!/usr/bin/env python3
"""
Integration test script for GeneInsight Platform
Tests the full workflow: Frontend -> Backend -> ML Service
"""

import requests
import json
import time

def test_ml_service():
    """Test the ML service directly"""
    print("🧬 Testing ML Service...")
    
    # Test health endpoint
    try:
        response = requests.get("http://localhost:5000/health")
        if response.status_code == 200:
            print("✅ ML Service health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ ML Service health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ ML Service connection failed: {e}")
        return False
    
    # Test prediction endpoint
    try:
        test_data = {
            "features": {
                "gcContent": 45.5,
                "orfCount": 3,
                "length": 1500,
                "motifs": ["ATG", "TAA", "TATA"]
            }
        }
        
        response = requests.post("http://localhost:5000/predict", json=test_data)
        if response.status_code == 200:
            result = response.json()
            print("✅ ML Service prediction test passed")
            print(f"   Prediction: {result['prediction']}")
            print(f"   Confidence: {result['confidence']:.3f}")
            print(f"   Model Version: {result['modelVersion']}")
            return True
        else:
            print(f"❌ ML Service prediction failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ ML Service prediction error: {e}")
        return False

def test_backend_service():
    """Test the Spring Boot backend"""
    print("\n🚀 Testing Backend Service...")
    
    # Test health endpoint
    try:
        response = requests.get("http://localhost:8080/api/health")
        if response.status_code == 200:
            print("✅ Backend health check passed")
            health_data = response.json()
            print(f"   Service: {health_data['service']}")
            print(f"   Version: {health_data['version']}")
            print(f"   Status: {health_data['status']}")
            
            # Check component status
            components = health_data.get('components', {})
            for component, status in components.items():
                print(f"   {component}: {status}")
            
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend connection failed: {e}")
        return False

def test_frontend_service():
    """Test the Next.js frontend"""
    print("\n🌐 Testing Frontend Service...")
    
    try:
        response = requests.get("http://localhost:3000")
        if response.status_code == 200:
            print("✅ Frontend service is accessible")
            print(f"   Content length: {len(response.text)} bytes")
            
            # Check if it contains expected content
            if "GeneInsight" in response.text:
                print("✅ Frontend contains expected branding")
                return True
            else:
                print("⚠️  Frontend accessible but missing expected content")
                return False
        else:
            print(f"❌ Frontend service failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Frontend connection failed: {e}")
        return False

def test_full_integration():
    """Test the complete integration workflow"""
    print("\n🔄 Testing Full Integration Workflow...")
    
    # This would test a complete workflow through the backend
    # For now, we'll simulate it by testing the ML service through backend
    try:
        # Test if backend can communicate with ML service
        response = requests.get("http://localhost:8080/api/health")
        if response.status_code == 200:
            health_data = response.json()
            ml_status = health_data.get('components', {}).get('ml-service', 'UNKNOWN')
            
            if ml_status == 'UP':
                print("✅ Backend -> ML Service integration working")
                return True
            else:
                print(f"❌ Backend -> ML Service integration failed: {ml_status}")
                return False
        else:
            print("❌ Cannot test integration - backend not responding")
            return False
    except Exception as e:
        print(f"❌ Integration test error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 GeneInsight Platform Integration Tests")
    print("=" * 50)
    
    results = []
    
    # Test individual services
    results.append(("ML Service", test_ml_service()))
    results.append(("Backend Service", test_backend_service()))
    results.append(("Frontend Service", test_frontend_service()))
    results.append(("Full Integration", test_full_integration()))
    
    # Summary
    print("\n📊 Test Results Summary")
    print("=" * 30)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:<20} {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All systems operational! GeneInsight Platform is ready for use.")
        print("\n🔗 Access Points:")
        print("   Frontend:  http://localhost:3000")
        print("   Backend:   http://localhost:8080")
        print("   ML Service: http://localhost:5000")
        print("   H2 Console: http://localhost:8080/h2-console")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please check the services.")
    
    return passed == total

if __name__ == "__main__":
    main()
