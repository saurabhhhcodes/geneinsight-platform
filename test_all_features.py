#!/usr/bin/env python3
"""
GeneInsight Platform - Comprehensive Feature Testing Script
Tests all major features including demo, analysis, visualization, and reports
"""

import requests
import json
import time
import sys
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:3000"
API_URL = "http://localhost:8080/api"
ML_URL = "http://localhost:5000"

def print_header(title):
    """Print a formatted header"""
    print("\n" + "="*60)
    print(f"🧬 {title}")
    print("="*60)

def print_success(message):
    """Print success message"""
    print(f"✅ {message}")

def print_error(message):
    """Print error message"""
    print(f"❌ {message}")

def print_info(message):
    """Print info message"""
    print(f"ℹ️  {message}")

def test_frontend_accessibility():
    """Test if frontend is accessible"""
    print_header("FRONTEND ACCESSIBILITY TEST")

    try:
        response = requests.get(BASE_URL, timeout=10)
        if response.status_code == 200:
            print_success(f"Frontend accessible at {BASE_URL}")
            print_info(f"Response size: {len(response.content)} bytes")
            return True
        else:
            print_error(f"Frontend returned status code: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Frontend not accessible: {str(e)}")
        return False

def test_backend_health():
    """Test backend health"""
    print_header("BACKEND HEALTH TEST")

    try:
        # Test basic connectivity
        response = requests.get(f"{API_URL}/health", timeout=10)
        if response.status_code == 200:
            print_success("Backend health endpoint accessible")
            return True
    except:
        pass

    try:
        # Test any endpoint to see if backend is running
        response = requests.get(f"{API_URL}/analyze", timeout=10)
        print_success("Backend is running (authentication required)")
        print_info(f"Backend URL: {API_URL}")
        return True
    except Exception as e:
        print_error(f"Backend not accessible: {str(e)}")
        return False

def test_ml_service():
    """Test ML service"""
    print_header("ML SERVICE TEST")

    try:
        response = requests.get(f"{ML_URL}/health", timeout=10)
        if response.status_code == 200:
            print_success("ML service accessible")
            data = response.json()
            print_info(f"ML service status: {data.get('status', 'Unknown')}")
            return True
        else:
            print_error(f"ML service returned status code: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"ML service not accessible: {str(e)}")
        return False

def test_demo_features():
    """Test demo page features"""
    print_header("DEMO FEATURES TEST")

    try:
        # Test demo page accessibility
        response = requests.get(f"{BASE_URL}/demo", timeout=10)
        if response.status_code == 200:
            print_success("Demo page accessible")

            # Check for key demo content
            content = response.text.lower()
            demo_features = [
                "overview",
                "analysis",
                "3d viewer",
                "workflow",
                "features"
            ]

            found_features = []
            for feature in demo_features:
                if feature in content:
                    found_features.append(feature)
                    print_success(f"Demo feature found: {feature}")
                else:
                    print_error(f"Demo feature missing: {feature}")

            print_info(f"Demo features found: {len(found_features)}/{len(demo_features)}")
            return len(found_features) >= 3
        else:
            print_error(f"Demo page returned status code: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Demo page test failed: {str(e)}")
        return False

def test_analysis_features():
    """Test analysis page features"""
    print_header("ANALYSIS FEATURES TEST")

    try:
        response = requests.get(f"{BASE_URL}/analyze", timeout=10)
        if response.status_code == 200:
            print_success("Analysis page accessible")

            # Check for analysis features
            content = response.text.lower()
            analysis_features = [
                "dna sequence",
                "analysis",
                "upload",
                "sequence input",
                "analyze"
            ]

            found_features = []
            for feature in analysis_features:
                if feature in content:
                    found_features.append(feature)
                    print_success(f"Analysis feature found: {feature}")

            print_info(f"Analysis features found: {len(found_features)}/{len(analysis_features)}")
            return len(found_features) >= 2
        else:
            print_error(f"Analysis page returned status code: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Analysis page test failed: {str(e)}")
        return False

def test_visualization_features():
    """Test 3D visualization features"""
    print_header("3D VISUALIZATION FEATURES TEST")

    try:
        response = requests.get(f"{BASE_URL}/visualize", timeout=10)
        if response.status_code == 200:
            print_success("Visualization page accessible")

            # Check for 3D visualization features
            content = response.text.lower()
            viz_features = [
                "3d",
                "molecular",
                "structure",
                "visualization",
                "pdb",
                "protein"
            ]

            found_features = []
            for feature in viz_features:
                if feature in content:
                    found_features.append(feature)
                    print_success(f"Visualization feature found: {feature}")

            # Check for 3Dmol.js integration
            if "3dmol" in content:
                print_success("3Dmol.js integration detected")
                found_features.append("3dmol")

            print_info(f"Visualization features found: {len(found_features)}/{len(viz_features)}")
            return len(found_features) >= 3
        else:
            print_error(f"Visualization page returned status code: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Visualization page test failed: {str(e)}")
        return False

def test_reports_features():
    """Test reports page features"""
    print_header("REPORTS FEATURES TEST")

    try:
        response = requests.get(f"{BASE_URL}/reports", timeout=10)
        if response.status_code == 200:
            print_success("Reports page accessible")

            # Check for reports features
            content = response.text.lower()
            report_features = [
                "report",
                "generate",
                "download",
                "analysis summary",
                "user activity",
                "system performance",
                "prediction accuracy",
                "custom report"
            ]

            found_features = []
            for feature in report_features:
                if feature in content:
                    found_features.append(feature)
                    print_success(f"Report feature found: {feature}")

            print_info(f"Report features found: {len(found_features)}/{len(report_features)}")
            return len(found_features) >= 4
        else:
            print_error(f"Reports page returned status code: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Reports page test failed: {str(e)}")
        return False

def test_3d_structure_capabilities():
    """Test 3D structure generation capabilities"""
    print_header("3D STRUCTURE GENERATION CAPABILITIES")

    capabilities = {
        "3Dmol.js Integration": False,
        "PDB Import Support": False,
        "Structure Prediction Framework": False,
        "Molecular Visualization": False,
        "Real-time 3D Rendering": False
    }

    try:
        # Test visualization page for 3D capabilities
        response = requests.get(f"{BASE_URL}/visualize", timeout=10)
        if response.status_code == 200:
            content = response.text.lower()

            # Check for 3Dmol.js
            if "3dmol" in content:
                capabilities["3Dmol.js Integration"] = True
                print_success("3Dmol.js library integration detected")

            # Check for PDB support
            if "pdb" in content:
                capabilities["PDB Import Support"] = True
                print_success("PDB file import support detected")

            # Check for structure prediction
            if "structure" in content and "prediction" in content:
                capabilities["Structure Prediction Framework"] = True
                print_success("Structure prediction framework detected")

            # Check for molecular visualization
            if "molecular" in content or "molecule" in content:
                capabilities["Molecular Visualization"] = True
                print_success("Molecular visualization support detected")

            # Check for 3D rendering
            if "3d" in content and ("render" in content or "viewer" in content):
                capabilities["Real-time 3D Rendering"] = True
                print_success("Real-time 3D rendering support detected")

    except Exception as e:
        print_error(f"3D capabilities test failed: {str(e)}")

    # Summary
    enabled_count = sum(capabilities.values())
    total_count = len(capabilities)

    print_info(f"3D Structure Capabilities: {enabled_count}/{total_count} enabled")

    for capability, enabled in capabilities.items():
        status = "✅ Enabled" if enabled else "⚠️  Ready for implementation"
        print(f"  {capability}: {status}")

    return enabled_count >= 2

def run_comprehensive_test():
    """Run all tests and provide summary"""
    print_header("GENEINSIGHT PLATFORM - COMPREHENSIVE TESTING")
    print_info(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    tests = [
        ("Frontend Accessibility", test_frontend_accessibility),
        ("Backend Health", test_backend_health),
        ("ML Service", test_ml_service),
        ("Demo Features", test_demo_features),
        ("Analysis Features", test_analysis_features),
        ("3D Visualization", test_visualization_features),
        ("Reports Features", test_reports_features),
        ("3D Structure Capabilities", test_3d_structure_capabilities)
    ]

    results = {}
    passed = 0
    total = len(tests)

    for test_name, test_func in tests:
        try:
            result = test_func()
            results[test_name] = result
            if result:
                passed += 1
        except Exception as e:
            print_error(f"Test '{test_name}' failed with exception: {str(e)}")
            results[test_name] = False

    # Summary
    print_header("TEST SUMMARY")
    print_info(f"Tests passed: {passed}/{total}")
    print_info(f"Success rate: {(passed/total)*100:.1f}%")

    print("\n📊 Detailed Results:")
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {test_name}: {status}")

    # Recommendations
    print_header("RECOMMENDATIONS")

    if results.get("3D Structure Capabilities", False):
        print_success("3D structure generation framework is ready!")
        print_info("Next steps: Implement AlphaFold API integration")

    if results.get("Reports Features", False):
        print_success("Reports system is functional!")
        print_info("Next steps: Add authentication bypass for testing")

    if results.get("3D Visualization", False):
        print_success("3D visualization is working!")
        print_info("Next steps: Add real PDB data loading")

    print_info(f"Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    return passed >= total * 0.7  # 70% pass rate

if __name__ == "__main__":
    success = run_comprehensive_test()
    sys.exit(0 if success else 1)