#!/usr/bin/env python3
"""
Molecular Docking Test Demo for GeneInsight Platform

This script demonstrates the complete molecular docking workflow:
1. Protein preparation from PDB data
2. Ligand preparation from SMILES strings
3. Docking execution with binding site configuration
4. AI-powered result analysis and interpretation

Run this test to verify all docking functionality is working correctly.
"""

import requests
import json
import time
from typing import Dict, Any

# Configuration
ML_SERVICE_URL = "http://localhost:5000"
FRONTEND_URL = "http://localhost:3000"

# Test data
SAMPLE_PROTEIN_PDB = """HEADER    HYDROLASE/HYDROLASE INHIBITOR           20-JUL-98   1HTM              
TITLE     HUMAN CARBONIC ANHYDRASE II IN COMPLEX WITH A SULFONAMIDE INHIBITOR
ATOM      1  N   MET A   1      10.626  19.462  11.708  1.00 20.00           N  
ATOM      2  CA  MET A   1      10.135  18.142  12.115  1.00 20.00           C  
ATOM      3  C   MET A   1       8.635  18.002  11.895  1.00 20.00           C  
ATOM      4  O   MET A   1       8.149  17.012  11.356  1.00 20.00           O  
ATOM      5  CB  MET A   1      10.461  17.912  13.588  1.00 20.00           C  
ATOM      6  CG  MET A   1      11.943  18.067  13.896  1.00 20.00           C  
ATOM      7  SD  MET A   1      12.308  18.018  15.651  1.00 20.00           S  
ATOM      8  CE  MET A   1      13.965  17.345  15.661  1.00 20.00           C  
ATOM      9  N   ALA A   2       7.962  19.063  12.334  1.00 20.00           N  
ATOM     10  CA  ALA A   2       6.530  19.089  12.179  1.00 20.00           C  
ATOM     11  C   ALA A   2       6.002  18.012  11.245  1.00 20.00           C  
ATOM     12  O   ALA A   2       5.123  17.267  11.516  1.00 20.00           O  
ATOM     13  CB  ALA A   2       5.825  19.012  13.521  1.00 20.00           C  
ATOM     14  N   SER A   3       6.512  17.945  10.025  1.00 20.00           N  
ATOM     15  CA  SER A   3       6.089  16.967   9.045  1.00 20.00           C  
ATOM     16  C   SER A   3       6.789  15.625   9.156  1.00 20.00           C  
ATOM     17  O   SER A   3       6.234  14.612   9.567  1.00 20.00           O  
ATOM     18  CB  SER A   3       6.289  17.523   7.639  1.00 20.00           C  
ATOM     19  OG  SER A   3       5.598  18.748   7.512  1.00 20.00           O  
ATOM     20  N   HIS A   4       8.067  15.623   8.789  1.00 20.00           N  
END"""

SAMPLE_LIGANDS = [
    {
        "name": "Aspirin",
        "smiles": "CC(=O)OC1=CC=CC=C1C(=O)O",
        "description": "Anti-inflammatory drug"
    },
    {
        "name": "Caffeine", 
        "smiles": "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
        "description": "Stimulant compound"
    },
    {
        "name": "Ibuprofen",
        "smiles": "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O", 
        "description": "NSAID pain reliever"
    },
    {
        "name": "Ethanol",
        "smiles": "CCO",
        "description": "Simple alcohol"
    },
    {
        "name": "Acetaminophen",
        "smiles": "CC(=O)NC1=CC=C(C=C1)O",
        "description": "Pain reliever and fever reducer"
    }
]

BINDING_SITES = [
    {
        "name": "Active Site",
        "x": 0.0, "y": 0.0, "z": 0.0,
        "size_x": 20.0, "size_y": 20.0, "size_z": 20.0
    },
    {
        "name": "Allosteric Site",
        "x": 15.0, "y": -10.0, "z": 5.0,
        "size_x": 15.0, "size_y": 15.0, "size_z": 15.0
    }
]

def print_header(title: str):
    """Print a formatted header"""
    print("\n" + "="*60)
    print(f"🧬 {title}")
    print("="*60)

def print_step(step: str):
    """Print a formatted step"""
    print(f"\n🔬 {step}")
    print("-" * 40)

def check_service_health() -> bool:
    """Check if ML service is running"""
    try:
        response = requests.get(f"{ML_SERVICE_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ ML Service is running")
            print(f"   Status: {data.get('status', 'Unknown')}")
            models = data.get('models', {})
            for model, status in models.items():
                print(f"   {model}: {status}")
            return True
        else:
            print(f"❌ ML Service returned status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to ML Service: {e}")
        return False

def test_docking_preparation(protein_data: str, ligand_smiles: str, ligand_name: str) -> Dict[str, Any]:
    """Test the docking preparation endpoint"""
    print_step(f"Testing Docking Preparation for {ligand_name}")
    
    try:
        payload = {
            "protein_data": protein_data,
            "ligand_smiles": ligand_smiles,
            "ligand_name": ligand_name
        }
        
        response = requests.post(
            f"{ML_SERVICE_URL}/docking/prepare",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Preparation successful")
            
            # Display protein info
            protein_info = data['data']['protein']
            print(f"   Protein atoms: {protein_info.get('validation', {}).get('atom_count', 'N/A')}")
            print(f"   Protein valid: {protein_info.get('success', False)}")
            
            # Display ligand info
            ligand_info = data['data']['ligand']
            print(f"   Ligand: {ligand_info.get('ligand_name', 'Unknown')}")
            print(f"   Molecular weight: {ligand_info.get('mol_weight', 0):.1f} Da")
            print(f"   Atom count: {ligand_info.get('num_atoms', 0)}")
            
            # Display properties
            properties = ligand_info.get('properties', {})
            print(f"   Lipinski violations: {properties.get('lipinski_violations', 'N/A')}")
            print(f"   LogP: {properties.get('logp', 'N/A')}")
            
            return data['data']
        else:
            error_data = response.json()
            print(f"❌ Preparation failed: {error_data.get('error', 'Unknown error')}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return None

def test_docking_execution(protein_pdbqt: str, ligand_pdbqt: str, binding_site: Dict[str, float], 
                          ligand_name: str, site_name: str) -> Dict[str, Any]:
    """Test the docking execution endpoint"""
    print_step(f"Testing Docking Execution: {ligand_name} at {site_name}")
    
    try:
        payload = {
            "protein_pdbqt": protein_pdbqt,
            "ligand_pdbqt": ligand_pdbqt,
            "binding_site": binding_site,
            "exhaustiveness": 8
        }
        
        response = requests.post(
            f"{ML_SERVICE_URL}/docking/run",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Docking successful")
            
            # Display docking results
            docking_results = data['data']['docking_results']
            print(f"   Binding modes found: {len(docking_results)}")
            
            if docking_results:
                best_result = min(docking_results, key=lambda x: x['affinity'])
                print(f"   Best affinity: {best_result['affinity']} kcal/mol")
                print(f"   RMSD range: {best_result['rmsd_lb']} - {best_result['rmsd_ub']} Å")
                
                # Display all binding modes
                print("   All binding modes:")
                for result in docking_results:
                    strength = "Strong" if result['affinity'] < -8 else "Moderate" if result['affinity'] < -6 else "Weak"
                    print(f"     Mode {result['mode']}: {result['affinity']} kcal/mol ({strength})")
            
            # Display AI analysis
            ai_analysis = data['data'].get('ai_analysis', {})
            if ai_analysis:
                print("\n   🤖 AI Analysis:")
                
                binding_analysis = ai_analysis.get('binding_analysis', {})
                if binding_analysis:
                    print(f"     Binding strength: {binding_analysis.get('strength', 'Unknown')}")
                    print(f"     Interpretation: {binding_analysis.get('interpretation', 'N/A')}")
                
                drug_likeness = ai_analysis.get('drug_likeness', {})
                if drug_likeness:
                    print(f"     Drug-likeness: {drug_likeness.get('assessment', 'Unknown')}")
                    print(f"     Score: {drug_likeness.get('drug_likeness_score', 0)*100:.0f}%")
                
                interactions = ai_analysis.get('interaction_prediction', [])
                if interactions:
                    print("     Predicted interactions:")
                    for interaction in interactions[:3]:  # Show first 3
                        print(f"       • {interaction}")
                
                suggestions = ai_analysis.get('optimization_suggestions', [])
                if suggestions:
                    print("     Optimization suggestions:")
                    for suggestion in suggestions[:2]:  # Show first 2
                        print(f"       • {suggestion}")
            
            return data['data']
        else:
            error_data = response.json()
            print(f"❌ Docking failed: {error_data.get('error', 'Unknown error')}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return None

def test_enhanced_analysis(sequence: str, sequence_type: str = "DNA") -> Dict[str, Any]:
    """Test the enhanced analysis endpoint"""
    print_step(f"Testing Enhanced Analysis for {sequence_type}")
    
    try:
        payload = {
            "sequence": sequence,
            "sequence_type": sequence_type
        }
        
        response = requests.post(
            f"{ML_SERVICE_URL}/analyze/enhanced",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Enhanced analysis successful")
            
            ai_insights = data['data'].get('ai_insights', {})
            if ai_insights:
                print(f"   Analysis method: {ai_insights.get('analysis_method', 'Unknown')}")
                print(f"   Confidence: {ai_insights.get('confidence', 0):.2f}")
                
                insights = ai_insights.get('insights', [])
                if insights:
                    print("   Key insights:")
                    for insight in insights[:3]:
                        print(f"     • {insight}")
                
                recommendations = ai_insights.get('recommendations', [])
                if recommendations:
                    print("   Recommendations:")
                    for rec in recommendations[:2]:
                        print(f"     • {rec}")
            
            return data['data']
        else:
            error_data = response.json()
            print(f"❌ Analysis failed: {error_data.get('error', 'Unknown error')}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return None

def run_comprehensive_docking_test():
    """Run comprehensive molecular docking test"""
    print_header("MOLECULAR DOCKING COMPREHENSIVE TEST")
    
    # Check service health
    if not check_service_health():
        print("\n❌ Cannot proceed - ML Service is not running")
        print("Please start the ML service with: python ml_service/app.py")
        return False
    
    # Test enhanced analysis first
    test_sequence = "ATGCGATCGATCGATCGTAGCTAGCTAGC"
    enhanced_result = test_enhanced_analysis(test_sequence, "DNA")
    
    success_count = 0
    total_tests = 0
    
    # Test each ligand with different binding sites
    for ligand in SAMPLE_LIGANDS[:3]:  # Test first 3 ligands
        for binding_site in BINDING_SITES[:1]:  # Test first binding site
            total_tests += 1
            
            # Step 1: Prepare docking
            prep_result = test_docking_preparation(
                SAMPLE_PROTEIN_PDB, 
                ligand["smiles"], 
                ligand["name"]
            )
            
            if prep_result:
                # Step 2: Execute docking
                docking_result = test_docking_execution(
                    prep_result['protein']['pdbqt_file'],
                    prep_result['ligand']['pdbqt_file'],
                    binding_site,
                    ligand["name"],
                    binding_site["name"]
                )
                
                if docking_result:
                    success_count += 1
                    print(f"✅ Complete workflow successful for {ligand['name']}")
                else:
                    print(f"❌ Docking execution failed for {ligand['name']}")
            else:
                print(f"❌ Preparation failed for {ligand['name']}")
            
            # Small delay between tests
            time.sleep(1)
    
    # Summary
    print_header("TEST SUMMARY")
    print(f"✅ Successful tests: {success_count}/{total_tests}")
    print(f"📊 Success rate: {(success_count/total_tests)*100:.1f}%")
    
    if success_count == total_tests:
        print("\n🎉 ALL TESTS PASSED!")
        print("The molecular docking system is working perfectly!")
        print("\n📋 Next steps:")
        print("1. Visit http://localhost:3000/docking to try the web interface")
        print("2. Use the sample data provided above")
        print("3. Explore different ligands and binding sites")
    else:
        print(f"\n⚠️  {total_tests - success_count} tests failed")
        print("Please check the error messages above")
    
    return success_count == total_tests

def print_sample_data():
    """Print sample data for manual testing"""
    print_header("SAMPLE DATA FOR MANUAL TESTING")
    
    print("\n🧪 Sample Protein (PDB format):")
    print("Copy this into the protein data field:")
    print("-" * 40)
    print(SAMPLE_PROTEIN_PDB[:500] + "...")
    
    print("\n💊 Sample Ligands (SMILES format):")
    for ligand in SAMPLE_LIGANDS:
        print(f"• {ligand['name']}: {ligand['smiles']}")
        print(f"  Description: {ligand['description']}")
    
    print("\n🎯 Sample Binding Sites:")
    for site in BINDING_SITES:
        print(f"• {site['name']}: Center({site['x']}, {site['y']}, {site['z']}) Size({site['size_x']}, {site['size_y']}, {site['size_z']})")
    
    print("\n🌐 Web Interface URLs:")
    print(f"• Docking Page: {FRONTEND_URL}/docking")
    print(f"• Dashboard: {FRONTEND_URL}/dashboard")
    print(f"• Main Page: {FRONTEND_URL}/")

def main():
    """Main test function"""
    print("🧬 GeneInsight Molecular Docking Test Suite")
    print("Choose an option:")
    print("1. Run comprehensive automated test")
    print("2. Show sample data for manual testing")
    print("3. Both")
    
    try:
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == "1":
            run_comprehensive_docking_test()
        elif choice == "2":
            print_sample_data()
        elif choice == "3":
            run_comprehensive_docking_test()
            print_sample_data()
        else:
            print("Invalid choice. Running comprehensive test...")
            run_comprehensive_docking_test()
            
    except KeyboardInterrupt:
        print("\n\n⏹️  Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()
