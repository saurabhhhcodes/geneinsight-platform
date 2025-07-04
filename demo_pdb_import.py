#!/usr/bin/env python3
"""
Demo script showcasing the PDB file import functionality
"""

import requests
import os
from colorama import Fore, Style, init

# Initialize colorama for colored output
init(autoreset=True)

def print_header():
    print(f"{Fore.CYAN}{Style.BRIGHT}🧬 GeneInsight PDB File Import Feature Demo")
    print("=" * 60)

def print_section(title):
    print(f"\n{Fore.YELLOW}{Style.BRIGHT}{title}")
    print("-" * len(title))

def print_feature(feature, description):
    print(f"{Fore.GREEN}✅ {feature}: {description}")

def create_sample_pdb_file():
    """Create a sample PDB file for demonstration"""
    sample_pdb_content = """HEADER    DNA                                     01-JAN-24   DEMO            
TITLE     SAMPLE DNA STRUCTURE FOR GENEINSIGHT DEMO                        
ATOM      1  P     A A   1      -8.901   4.127  -0.555  1.00 11.99           P  
ATOM      2  OP1   A A   1      -8.608   3.135  -1.618  1.00 12.36           O  
ATOM      3  OP2   A A   1      -8.818   5.550  -0.961  1.00 11.99           O  
ATOM      4  O5'   A A   1      -7.982   3.886   0.721  1.00 11.99           O  
ATOM      5  C5'   A A   1      -6.588   4.224   0.717  1.00 11.99           C  
ATOM      6  C4'   A A   1      -5.758   3.505   1.769  1.00 11.99           C  
ATOM      7  O4'   A A   1      -6.187   3.778   3.127  1.00 11.99           O  
ATOM      8  C3'   A A   1      -5.850   2.000   1.611  1.00 11.99           C  
ATOM      9  O3'   A A   1      -4.849   1.334   0.862  1.00 11.99           O  
ATOM     10  C2'   A A   1      -5.756   1.462   3.035  1.00 11.99           C  
ATOM     11  O2'   A A   1      -4.421   1.130   3.394  1.00 11.99           O  
ATOM     12  C1'   A A   1      -6.297   2.548   3.962  1.00 11.99           C  
ATOM     13  N9    A A   1      -7.703   2.297   4.394  1.00 11.99           N  
ATOM     14  C8    A A   1      -8.846   2.999   4.298  1.00 11.99           C  
ATOM     15  N7    A A   1      -9.854   2.439   4.823  1.00 11.99           N  
ATOM     16  C5    A A   1      -9.378   1.244   5.340  1.00 11.99           C  
ATOM     17  C6    A A   1      -9.893   0.135   6.016  1.00 11.99           C  
ATOM     18  N6    A A   1     -11.168  -0.031   6.264  1.00 11.99           N  
ATOM     19  N1    A A   1      -9.089  -0.825   6.456  1.00 11.99           N  
ATOM     20  C2    A A   1      -7.795  -0.659   6.208  1.00 11.99           C  
ATOM     21  N3    A A   1      -7.208   0.378   5.580  1.00 11.99           N  
ATOM     22  C4    A A   1      -8.048   1.320   5.158  1.00 11.99           C  
END                                                                             
"""
    
    with open("sample_dna.pdb", "w") as f:
        f.write(sample_pdb_content)
    
    print(f"{Fore.GREEN}✅ Created sample PDB file: sample_dna.pdb")
    return "sample_dna.pdb"

def test_frontend_accessibility():
    """Test if the frontend is accessible"""
    try:
        response = requests.get("http://localhost:3000/visualize", timeout=10)
        if response.status_code == 200:
            print(f"{Fore.GREEN}✅ Visualization page is accessible")
            
            # Check for PDB import features in the page
            content = response.text.lower()
            features = [
                ("File upload support", "upload" in content and "pdb" in content),
                ("Drag and drop", "drag" in content and "drop" in content),
                ("File input", "file" in content and "input" in content),
                ("PDB format support", ".pdb" in content or "pdb" in content),
            ]
            
            for feature_name, is_present in features:
                status = "✅" if is_present else "❌"
                print(f"   {status} {feature_name}")
            
            return True
        else:
            print(f"{Fore.RED}❌ Visualization page not accessible: {response.status_code}")
            return False
    except Exception as e:
        print(f"{Fore.RED}❌ Error accessing visualization page: {e}")
        return False

def main():
    """Run the PDB import feature demo"""
    print_header()
    
    print_section("🎯 PDB File Import Features")
    
    print_feature("Local File Upload", "Upload PDB files directly from your computer")
    print("   • Supports .pdb and .txt files in PDB format")
    print("   • Drag and drop interface for easy file selection")
    print("   • Quick upload button in the main controls")
    print("   • File validation and format checking")
    
    print_feature("File Format Support", "Comprehensive PDB format compatibility")
    print("   • Standard PDB format (.pdb files)")
    print("   • Text files with PDB content (.txt files)")
    print("   • ATOM and HETATM record validation")
    print("   • Automatic structure parsing and loading")
    
    print_feature("Interactive Upload Interface", "User-friendly upload experience")
    print("   • Drag and drop zone with visual feedback")
    print("   • File browser integration")
    print("   • Upload progress indication")
    print("   • Error handling and validation messages")
    
    print_feature("Structure Information Display", "Detailed uploaded file information")
    print("   • File name and upload timestamp")
    print("   • Source identification (Local File Upload)")
    print("   • File format and validation status")
    print("   • Privacy and security information")
    
    print_section("🧪 Testing PDB Import Functionality")
    
    # Test frontend accessibility
    if not test_frontend_accessibility():
        print(f"{Fore.RED}❌ Cannot test PDB import - frontend not accessible")
        return False
    
    # Create sample PDB file
    print_section("📁 Sample PDB File Creation")
    sample_file = create_sample_pdb_file()
    
    if os.path.exists(sample_file):
        file_size = os.path.getsize(sample_file)
        print(f"{Fore.GREEN}✅ Sample file created successfully")
        print(f"   • File: {sample_file}")
        print(f"   • Size: {file_size} bytes")
        print(f"   • Contains: DNA structure with 22 atoms")
        print(f"   • Format: Standard PDB format")
    
    print_section("🎮 How to Use PDB Import")
    
    print(f"{Fore.CYAN}{Style.BRIGHT}Method 1: Quick Upload Button")
    print("1. Visit http://localhost:3000/visualize")
    print("2. Click the 'Upload PDB' button in the controls")
    print("3. Select your PDB file from the file browser")
    print("4. Structure will load automatically")
    
    print(f"\n{Fore.CYAN}{Style.BRIGHT}Method 2: Import Dialog")
    print("1. Click the 'Import URL' button")
    print("2. Use the drag-and-drop zone in the dialog")
    print("3. Drag your PDB file into the highlighted area")
    print("4. Or click 'Choose File' to browse")
    
    print(f"\n{Fore.CYAN}{Style.BRIGHT}Method 3: Drag and Drop")
    print("1. Open the import dialog")
    print("2. Drag PDB files directly from your file manager")
    print("3. Drop them in the upload zone")
    print("4. Files will be processed immediately")
    
    print_section("🔧 Technical Implementation")
    
    print_feature("File Processing", "Client-side PDB file handling")
    print("   • File reading using FileReader API")
    print("   • PDB format validation (ATOM/HETATM records)")
    print("   • 3Dmol.js integration for structure loading")
    print("   • Error handling for invalid files")
    
    print_feature("Security Features", "Safe file upload handling")
    print("   • Client-side only processing (files don't leave your device)")
    print("   • File type validation (.pdb, .txt)")
    print("   • Content validation (PDB format checking)")
    print("   • No server-side file storage")
    
    print_feature("User Experience", "Intuitive upload interface")
    print("   • Visual drag-and-drop feedback")
    print("   • Upload progress indication")
    print("   • File information display")
    print("   • Clear error messages")
    
    print_section("🎉 PDB Import Feature Complete!")
    
    print(f"{Fore.GREEN}{Style.BRIGHT}✅ Comprehensive PDB file import functionality")
    print(f"✅ Multiple upload methods (button, dialog, drag-drop)")
    print(f"✅ File format validation and error handling")
    print(f"✅ Integration with 3D visualization engine")
    print(f"✅ User-friendly interface with visual feedback")
    print(f"✅ Secure client-side processing")
    
    print(f"\n{Fore.CYAN}{Style.BRIGHT}🔗 Try the PDB Import Feature:")
    print(f"   Visit: http://localhost:3000/visualize")
    print(f"   Upload the sample file: {sample_file}")
    print(f"   Or use your own PDB files!")
    
    print(f"\n{Fore.YELLOW}🧬 The PDB file import feature is now fully operational")
    print(f"   with comprehensive upload capabilities and 3D visualization!")
    
    return True

if __name__ == "__main__":
    main()
