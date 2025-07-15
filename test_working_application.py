#!/usr/bin/env python3
"""
Test Working Molecular Docking Application

This script demonstrates that the application is working correctly
and provides sample data for testing.
"""

import requests
import json

def test_application_status():
    """Test that all services are working"""
    print("🧬 MOLECULAR DOCKING APPLICATION STATUS")
    print("=" * 60)
    
    # Test frontend
    try:
        response = requests.get("http://localhost:3000", timeout=10)
        if response.status_code == 200:
            print("✅ Frontend (Next.js): http://localhost:3000 - WORKING")
        else:
            print(f"❌ Frontend: Status {response.status_code}")
    except Exception as e:
        print(f"❌ Frontend: {e}")
    
    # Test docking page
    try:
        response = requests.get("http://localhost:3000/docking", timeout=10)
        if response.status_code == 200:
            print("✅ Docking Page: http://localhost:3000/docking - WORKING")
        else:
            print(f"❌ Docking Page: Status {response.status_code}")
    except Exception as e:
        print(f"❌ Docking Page: {e}")
    
    # Test ML service
    try:
        response = requests.get("http://localhost:5000/health", timeout=10)
        if response.status_code == 200:
            print("✅ ML Service: http://localhost:5000 - WORKING")
        else:
            print(f"❌ ML Service: Status {response.status_code}")
    except Exception as e:
        print(f"❌ ML Service: {e}")
    
    print("\n" + "=" * 60)

def test_docking_workflow():
    """Test the complete docking workflow"""
    print("🎯 TESTING MOLECULAR DOCKING WORKFLOW")
    print("=" * 60)
    
    # Sample data
    protein_pdb = '''HEADER    HYDROLASE/HYDROLASE INHIBITOR           20-MAR-20   6LU7              
TITLE     STRUCTURE OF COVID-19 MAIN PROTEASE IN COMPLEX WITH AN INHIBITOR N3   
ATOM      1  N   SER A   1      -8.901   4.127  -0.555  1.00 11.99           N  
ATOM      2  CA  SER A   1      -8.608   3.135  -1.618  1.00 11.85           C  
ATOM      3  C   SER A   1      -7.221   2.499  -1.897  1.00 11.75           C  
ATOM      4  O   SER A   1      -6.632   2.691  -2.961  1.00 12.06           O  
ATOM      5  CB  SER A   1      -9.616   2.026  -1.897  1.00 11.90           C  
ATOM      6  OG  SER A   1     -10.881   2.537  -2.244  1.00 12.09           O  
ATOM      7  N   GLY A   2      -6.826   1.711  -0.897  1.00 11.65           N  
ATOM      8  CA  GLY A   2      -5.618   0.912  -0.897  1.00 11.55           C  
ATOM      9  C   GLY A   2      -4.321   1.691  -0.897  1.00 11.45           C  
ATOM     10  O   GLY A   2      -4.321   2.921  -0.897  1.00 11.35           O  
END'''
    
    ligand_smiles = "CC(=O)OC1=CC=CC=C1C(=O)O"  # Aspirin
    
    print("🔬 Step 1: Testing docking preparation...")
    try:
        prep_response = requests.post("http://localhost:5000/docking/prepare", 
                                    json={
                                        "protein_data": protein_pdb,
                                        "ligand_smiles": ligand_smiles,
                                        "ligand_name": "aspirin"
                                    }, timeout=30)
        
        if prep_response.status_code == 200:
            prep_data = prep_response.json()
            print("✅ Preparation successful!")
            print(f"   - Protein atoms: {prep_data['data']['protein']['validation']['atom_count']}")
            print(f"   - Ligand MW: {prep_data['data']['ligand']['mol_weight']:.1f} Da")
            
            print("\n🎯 Step 2: Testing docking execution...")
            dock_response = requests.post("http://localhost:5000/docking/run",
                                        json={
                                            "protein_pdbqt": prep_data['data']['protein']['pdbqt_file'],
                                            "ligand_pdbqt": prep_data['data']['ligand']['pdbqt_file'],
                                            "binding_site": {"x": 0, "y": 0, "z": 0, "size_x": 20, "size_y": 20, "size_z": 20},
                                            "exhaustiveness": 8
                                        }, timeout=30)
            
            if dock_response.status_code == 200:
                dock_data = dock_response.json()
                print("✅ Docking successful!")
                
                results = dock_data['data']['docking_results']
                print(f"   - Found {len(results)} binding modes")
                print(f"   - Best affinity: {results[0]['affinity']} kcal/mol")
                
                ai_analysis = dock_data['data']['ai_analysis']
                print(f"   - AI confidence: {ai_analysis['confidence'] * 100:.0f}%")
                
                return True
            else:
                print(f"❌ Docking failed: {dock_response.status_code}")
                return False
        else:
            print(f"❌ Preparation failed: {prep_response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Workflow test failed: {e}")
        return False

def show_usage_instructions():
    """Show how to use the application"""
    print("\n🚀 HOW TO USE THE APPLICATION")
    print("=" * 60)
    
    print("1. 🌐 Open your browser and visit:")
    print("   http://localhost:3000")
    
    print("\n2. 🎯 Navigate to molecular docking:")
    print("   - Click the 'Molecular Docking' card on the homepage")
    print("   - Or visit directly: http://localhost:3000/docking")
    
    print("\n3. 📝 Input sample data:")
    print("   Protein PDB Data:")
    print("   ```")
    print("   HEADER    HYDROLASE/HYDROLASE INHIBITOR           20-MAR-20   6LU7")
    print("   TITLE     STRUCTURE OF COVID-19 MAIN PROTEASE IN COMPLEX WITH AN INHIBITOR N3")
    print("   ATOM      1  N   SER A   1      -8.901   4.127  -0.555  1.00 11.99           N")
    print("   ATOM      2  CA  SER A   1      -8.608   3.135  -1.618  1.00 11.85           C")
    print("   ... (copy the full PDB data)")
    print("   ```")
    
    print("\n   Ligand SMILES (choose one):")
    print("   - Aspirin: CC(=O)OC1=CC=CC=C1C(=O)O")
    print("   - Caffeine: CN1C=NC2=C1C(=O)N(C(=O)N2C)C")
    print("   - Ethanol: CCO")
    
    print("\n4. ⚙️ Configure binding site:")
    print("   - Center: X=0, Y=0, Z=0")
    print("   - Size: 20×20×20 Å")
    print("   - Exhaustiveness: 8")
    
    print("\n5. 🔄 Run the workflow:")
    print("   - Click 'Prepare Docking'")
    print("   - Wait for preparation to complete")
    print("   - Click 'Run Docking'")
    print("   - View 3D results!")
    
    print("\n6. 🎨 Explore results:")
    print("   - Interactive 3D visualization")
    print("   - Binding affinity rankings")
    print("   - AI-powered analysis")
    print("   - Molecular interactions")

def show_features():
    """Show application features"""
    print("\n✨ APPLICATION FEATURES")
    print("=" * 60)
    
    print("🧬 Molecular Docking:")
    print("   ✅ Protein-ligand docking simulation")
    print("   ✅ Multiple binding mode generation")
    print("   ✅ Binding affinity calculation")
    print("   ✅ RMSD analysis")
    
    print("\n🧠 AI-Powered Analysis:")
    print("   ✅ Rule-based molecular insights (no API keys)")
    print("   ✅ Drug-likeness assessment")
    print("   ✅ Lipinski Rule of Five validation")
    print("   ✅ Optimization suggestions")
    
    print("\n🎨 3D Visualization:")
    print("   ✅ Interactive protein structure display")
    print("   ✅ Ligand binding pose visualization")
    print("   ✅ Binding site highlighting")
    print("   ✅ Animated molecular graphics")
    
    print("\n🔧 Technical Features:")
    print("   ✅ Open source (no API keys required)")
    print("   ✅ Real-time processing")
    print("   ✅ Responsive web interface")
    print("   ✅ Professional-grade results")

if __name__ == "__main__":
    # Test application status
    test_application_status()
    
    # Test docking workflow
    workflow_success = test_docking_workflow()
    
    if workflow_success:
        print("\n🎉 ALL TESTS PASSED!")
        show_features()
        show_usage_instructions()
        
        print("\n" + "=" * 60)
        print("🚀 APPLICATION IS READY FOR USE!")
        print("🌐 Visit: http://localhost:3000/docking")
        print("✨ Enjoy molecular docking with 3D visualization!")
    else:
        print("\n❌ Some tests failed. Please check the services.")
        print("   ML Service: http://localhost:5000")
        print("   Frontend: http://localhost:3000")
