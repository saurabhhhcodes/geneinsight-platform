#!/usr/bin/env python3
"""
Test 3D Structure Generation Feature
"""

import requests
import json

def test_3d_structure():
    # Test 3D structure generation
    test_sequence = 'ATGGCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGGGGACCTGACCCAGCCGCAGCCTTTGTGAACCAACACCTGTGCGGCTCACACCTGGTGGAAGCTCTCTACCTAGTGTGCGGGGAACGAGGCTTCTTCTACACACCCAAGACCCGCCGGGAGGCAGAGGACCTGCAGGTGGGGCAGGTGGAGCTGGGCGGGGGCCCTGGTGCAGGCAGCCTGCAGCCCTTGGCCCTGGAGGGGTCCCTGCAGAAGCGTGGCATTGTGGAACAATGCTGTACCAGCATCTGCTCCCTCTACCAGCTGGAGAACTACTGCAAC'

    print('🧬 Testing 3D Structure Generation...')
    try:
        response = requests.post('http://localhost:8080/api/sequences/generate-3d-structure', 
                                json={'sequence': test_sequence}, 
                                timeout=30)

        if response.status_code == 200:
            data = response.json()
            print('✅ 3D Structure Generation SUCCESS!')
            print(f'   Confidence: {data.get("confidence", "N/A")}')
            print(f'   Method: {data.get("method", "N/A")}')
            print(f'   Protein Length: {data.get("length", "N/A")} amino acids')
            print(f'   Structure ID: {data.get("structureId", "N/A")}')
            if data.get('secondaryStructure'):
                ss = data['secondaryStructure']
                print(f'   Alpha Helix: {ss.get("alphaHelix", 0):.1f}%')
                print(f'   Beta Sheet: {ss.get("betaSheet", 0):.1f}%')
                print(f'   Loop: {ss.get("loop", 0):.1f}%')
            
            # Test enhanced analysis
            print('\n🧬 Testing Enhanced Analysis with 3D...')
            response2 = requests.post('http://localhost:8080/api/sequences/analyze-with-structure',
                                     json={'sequence': test_sequence, 'include3D': True},
                                     timeout=60)
            
            if response2.status_code == 200:
                data2 = response2.json()
                print('✅ Enhanced Analysis SUCCESS!')
                if data2.get('success'):
                    basic = data2.get('basicAnalysis', {})
                    structure = data2.get('structure3D', {})
                    print(f'   Basic Analysis - Length: {basic.get("length", "N/A")} bp')
                    print(f'   Basic Analysis - GC Content: {basic.get("gcContent", "N/A")}%')
                    if structure.get('success'):
                        print(f'   3D Structure - Confidence: {structure.get("confidence", "N/A")}')
                        print(f'   3D Structure - Method: {structure.get("method", "N/A")}')
                else:
                    print(f'❌ Enhanced analysis failed: {data2.get("error", "Unknown error")}')
            else:
                print(f'❌ Enhanced Analysis FAILED: {response2.status_code}')
                print(f'   Response: {response2.text}')
        else:
            print(f'❌ 3D Structure Generation FAILED: {response.status_code}')
            print(f'   Response: {response.text}')
    except Exception as e:
        print(f'❌ Test failed with exception: {str(e)}')

if __name__ == "__main__":
    test_3d_structure()
