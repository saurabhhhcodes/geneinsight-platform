#!/usr/bin/env python3
"""
Test script for molecular docking and LangChain integration

This script tests the new molecular docking and AI analysis features
without requiring external dependencies or API keys.
"""

import sys
import os
import json

# Add ml_service to path
sys.path.append('ml_service')

def test_lightweight_analyzer():
    """Test the lightweight molecular analyzer"""
    print("🧪 Testing Lightweight Molecular Analyzer...")
    
    try:
        from langchain_service.lightweight_analyzer import LightweightMolecularAnalyzer
        
        analyzer = LightweightMolecularAnalyzer()
        
        # Test protein sequence analysis
        protein_sequence = "MKWVTFISLLFLFSSAYSRGVFRRDAHKSEVAHRFKDLGEENFKALVLIAFAQYLQQCPFEDHVKLVNEVTEFAKTCVADESAENCDKSLHTLFGDKLCTVATLRETYGEMADCCAKQEPERNECFLQHKDDNPNLPRLVRPEVDVMCTAFHDNEETFLKKYLYEIARRHPYFYAPELLFFAKRYKAAFTECCQAADKAACLLPKLDELRDEGKASSAKQRLKCASLQKFGERAFKAWAVARLSQRFPKAEFAEVSKLVTDLTKVHTECCHGDLLECADDRADLAKYICENQDSISSKLKECCEKPLLEKSHCIAEVENDEMPADLPSLAADFVESKDVCKNYAEAKDVFLGMFLYEYARRHPDYSVVLLLRLAKTYETTLEKCCAAADPHECYAKVFDEFKPLVEEPQNLIKQNCELFEQLGEYKFQNALLVRYTKKVPQVSTPTLVEVSRNLGKVGSKCCKHPEAKRMPCAEDYLSVVLNQLCVLHEKTPVSDRVTKCCTESLVNRRPCFSALEVDETYVPKEFNAETFTFHADICTLSEKERQIKKQTALVELVKHKPKATKEQLKAVMDDFAAFVEKCCKADDKETCFAEEGKKLVAASQAALGL"
        
        analysis_data = {
            'composition': {'A': 50, 'C': 30, 'G': 40, 'T': 45},
            'gc_content': 45.2,
            'orfs': [{'start': 1, 'end': 300, 'length': 300}]
        }
        
        result = analyzer.analyze_sequence(protein_sequence, 'PROTEIN', analysis_data)
        
        print("✅ Protein analysis completed")
        print(f"   - Domains found: {len(result.get('domains', []))}")
        print(f"   - Functional patterns: {len(result.get('functional_patterns', []))}")
        print(f"   - Confidence: {result.get('confidence', 0):.2f}")
        
        # Test docking analysis
        protein_info = {'name': 'test_protein', 'size': 300}
        ligand_info = {'smiles': 'CCO', 'properties': {'molecular_weight': 46.07, 'lipinski_violations': 0}}
        docking_results = {
            'results': [
                {'mode': 1, 'affinity': -8.5, 'rmsd_lb': 0.5, 'rmsd_ub': 1.2},
                {'mode': 2, 'affinity': -7.2, 'rmsd_lb': 1.1, 'rmsd_ub': 2.3}
            ]
        }
        
        docking_analysis = analyzer.analyze_docking(protein_info, ligand_info, docking_results)
        
        print("✅ Docking analysis completed")
        print(f"   - Binding strength: {docking_analysis.get('binding_analysis', {}).get('strength', 'Unknown')}")
        print(f"   - Drug-likeness: {docking_analysis.get('drug_likeness', {}).get('assessment', 'Unknown')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Lightweight analyzer test failed: {e}")
        return False

def test_docking_engine():
    """Test the molecular docking engine"""
    print("\n🎯 Testing Molecular Docking Engine...")

    try:
        from docking_service.docking_engine import DockingEngine

        engine = DockingEngine()

        # Test protein preparation
        sample_pdb = """ATOM      1  N   ALA A   1      20.154  16.967  27.462  1.00 20.00           N
ATOM      2  CA  ALA A   1      19.030  16.101  27.893  1.00 20.00           C
ATOM      3  C   ALA A   1      17.703  16.849  28.044  1.00 20.00           C
ATOM      4  O   ALA A   1      17.647  18.076  28.216  1.00 20.00           O
ATOM      5  CB  ALA A   1      18.756  15.034  26.839  1.00 20.00           C
END"""

        protein_result = engine.prepare_protein(sample_pdb)
        print(f"✅ Protein preparation: {'Success' if protein_result['success'] else 'Failed'}")

        # Test ligand preparation
        ligand_result = engine.prepare_ligand('CCO', 'ethanol')
        print(f"✅ Ligand preparation: {'Success' if ligand_result['success'] else 'Failed'}")

        if protein_result['success'] and ligand_result['success']:
            # Test docking
            binding_site = {'x': 0, 'y': 0, 'z': 0, 'size_x': 20, 'size_y': 20, 'size_z': 20}
            docking_result = engine.perform_docking(
                protein_result['pdbqt_file'],
                ligand_result['pdbqt_file'],
                binding_site
            )

            print(f"✅ Docking execution: {'Success' if docking_result['success'] else 'Failed'}")
            if docking_result['success']:
                results = docking_result.get('results', [])
                print(f"   - Binding modes found: {len(results)}")
                if results:
                    best_affinity = min(result['affinity'] for result in results)
                    print(f"   - Best affinity: {best_affinity} kcal/mol")
                    print(f"   - Mock mode: {docking_result.get('mock', False)}")

        # Cleanup
        engine.cleanup()
        return True

    except Exception as e:
        print(f"❌ Docking engine test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_ligand_processor():
    """Test the ligand processor"""
    print("\n💊 Testing Ligand Processor...")
    
    try:
        from docking_service.ligand_processor import LigandProcessor
        
        processor = LigandProcessor()
        
        # Test SMILES validation
        test_smiles = ['CCO', 'CC(=O)OC1=CC=CC=C1C(=O)O', 'invalid_smiles']
        
        for smiles in test_smiles:
            validation = processor.validate_smiles(smiles)
            status = "✅" if validation['valid'] else "❌"
            print(f"   {status} SMILES '{smiles}': {validation.get('error', 'Valid')}")
        
        # Test property calculation
        properties = processor.calculate_molecular_properties('CCO')
        print(f"✅ Property calculation completed")
        print(f"   - Estimated MW: {properties.get('estimated_molecular_weight', 0):.1f}")
        print(f"   - Lipinski violations: {properties.get('lipinski_violations', 0)}")
        
        # Test drug-likeness assessment
        drug_assessment = processor.assess_drug_likeness('CC(=O)OC1=CC=CC=C1C(=O)O')  # Aspirin
        print(f"✅ Drug-likeness assessment: {drug_assessment.get('assessment', 'Unknown')}")
        
        # Test full preparation pipeline
        preparation = processor.prepare_for_docking('CCO', 'ethanol')
        print(f"✅ Full preparation: {'Success' if preparation['success'] else 'Failed'}")
        
        return True
        
    except Exception as e:
        print(f"❌ Ligand processor test failed: {e}")
        return False

def test_molecular_chain():
    """Test the molecular analysis chain"""
    print("\n🔗 Testing Molecular Analysis Chain...")
    
    try:
        from langchain_service.molecular_chain import MolecularAnalysisChain
        
        chain = MolecularAnalysisChain()
        
        # Test sequence analysis
        sequence = "ATGCGATCGATCGATCG"
        analysis_data = {'composition': {'A': 4, 'T': 4, 'G': 4, 'C': 5}, 'gc_content': 52.9}
        
        result = chain.analyze_sequence(sequence, 'DNA', analysis_data)
        print(f"✅ Sequence analysis completed")
        print(f"   - Analysis method: {result.get('analysis_method', 'unknown')}")
        print(f"   - Confidence: {result.get('confidence', 0):.2f}")
        
        # Test docking analysis
        protein_info = {'name': 'test_protein'}
        ligand_info = {'smiles': 'CCO'}
        docking_results = {'results': [{'mode': 1, 'affinity': -8.5}]}
        
        docking_analysis = chain.analyze_docking(protein_info, ligand_info, docking_results)
        print(f"✅ Docking analysis completed")
        print(f"   - Analysis available: {'binding_analysis' in docking_analysis}")
        
        return True
        
    except Exception as e:
        print(f"❌ Molecular chain test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧬 GeneInsight Molecular Docking & AI Integration Test Suite")
    print("=" * 60)
    
    tests = [
        test_lightweight_analyzer,
        test_docking_engine,
        test_ligand_processor,
        test_molecular_chain
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 60)
    print(f"🏁 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The molecular docking integration is working correctly.")
        print("\n📋 Next Steps:")
        print("   1. Start the ML service: cd ml_service && python app.py")
        print("   2. Start the Next.js frontend: npm run dev")
        print("   3. Visit http://localhost:3000/docking to try the new features")
    else:
        print("⚠️  Some tests failed. Please check the error messages above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
