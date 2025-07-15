"""
Molecular Docking Engine using AutoDock Vina

This module provides the core docking functionality including:
- Protein preparation and validation
- Ligand preparation and conformer generation
- AutoDock Vina docking execution
- Result processing and scoring
"""

import os
import tempfile
import subprocess
import logging
from typing import Dict, List, Any, Optional, Tuple
import numpy as np
# from rdkit import Chem
# from rdkit.Chem import AllChem, Descriptors, rdMolDescriptors
import json
from pathlib import Path

logger = logging.getLogger(__name__)

class DockingEngine:
    """Core molecular docking engine using AutoDock Vina"""
    
    def __init__(self, vina_executable: Optional[str] = None):
        self.vina_executable = vina_executable or self._find_vina_executable()
        self.temp_dir = tempfile.mkdtemp(prefix="geneinsight_docking_")
        self.docking_results = {}
        
    def _find_vina_executable(self) -> str:
        """Find AutoDock Vina executable"""
        possible_paths = [
            'vina',
            '/usr/local/bin/vina',
            '/opt/vina/bin/vina',
            'autodock_vina'
        ]
        
        for path in possible_paths:
            try:
                result = subprocess.run([path, '--help'], 
                                      capture_output=True, text=True, timeout=10)
                if result.returncode == 0:
                    logger.info(f"Found Vina executable: {path}")
                    return path
            except (subprocess.TimeoutExpired, FileNotFoundError):
                continue
        
        logger.warning("AutoDock Vina not found. Using mock docking.")
        return None
    
    def prepare_protein(self, protein_data: str, protein_format: str = 'pdb') -> Dict[str, Any]:
        """Prepare protein structure for docking"""
        try:
            protein_file = os.path.join(self.temp_dir, f"protein.{protein_format}")
            
            # Save protein data to file
            with open(protein_file, 'w') as f:
                f.write(protein_data)
            
            # Basic protein validation
            validation_result = self._validate_protein_structure(protein_file)
            
            # Convert to PDBQT format (simplified - in real implementation use MGLTools)
            pdbqt_file = os.path.join(self.temp_dir, "protein.pdbqt")
            self._convert_to_pdbqt(protein_file, pdbqt_file, is_protein=True)
            
            return {
                'success': True,
                'protein_file': protein_file,
                'pdbqt_file': pdbqt_file,
                'validation': validation_result,
                'binding_sites': self._identify_binding_sites(protein_file)
            }
            
        except Exception as e:
            logger.error(f"Protein preparation failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def prepare_ligand(self, ligand_smiles: str, ligand_name: str = "ligand") -> Dict[str, Any]:
        """Prepare ligand for docking (simplified version without RDKit)"""
        try:
            # Basic SMILES validation
            if not ligand_smiles or not isinstance(ligand_smiles, str):
                raise ValueError("Invalid SMILES string")

            ligand_smiles = ligand_smiles.strip()
            if len(ligand_smiles) < 2:
                raise ValueError("SMILES string too short")

            # Mock molecular properties calculation
            properties = self._calculate_ligand_properties_mock(ligand_smiles)

            # Create mock files
            sdf_file = os.path.join(self.temp_dir, f"{ligand_name}.sdf")
            pdbqt_file = os.path.join(self.temp_dir, f"{ligand_name}.pdbqt")

            # Create mock SDF file
            with open(sdf_file, 'w') as f:
                f.write(f"# Mock SDF file for {ligand_name}\n")
                f.write(f"# SMILES: {ligand_smiles}\n")

            # Convert to PDBQT format
            self._convert_to_pdbqt(sdf_file, pdbqt_file, is_protein=False)

            return {
                'success': True,
                'ligand_name': ligand_name,
                'smiles': ligand_smiles,
                'sdf_file': sdf_file,
                'pdbqt_file': pdbqt_file,
                'properties': properties,
                'mol_weight': properties.get('molecular_weight', 0),
                'num_atoms': properties.get('atom_count', 0)
            }
            
        except Exception as e:
            logger.error(f"Ligand preparation failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def perform_docking(self, protein_pdbqt: str, ligand_pdbqt: str, 
                       binding_site: Dict[str, float], 
                       exhaustiveness: int = 8) -> Dict[str, Any]:
        """Perform molecular docking using AutoDock Vina"""
        try:
            if not self.vina_executable:
                return self._mock_docking_result(protein_pdbqt, ligand_pdbqt, binding_site)
            
            output_file = os.path.join(self.temp_dir, "docking_result.pdbqt")
            log_file = os.path.join(self.temp_dir, "docking.log")
            
            # Prepare Vina command
            vina_cmd = [
                self.vina_executable,
                '--receptor', protein_pdbqt,
                '--ligand', ligand_pdbqt,
                '--out', output_file,
                '--log', log_file,
                '--center_x', str(binding_site['x']),
                '--center_y', str(binding_site['y']),
                '--center_z', str(binding_site['z']),
                '--size_x', str(binding_site.get('size_x', 20)),
                '--size_y', str(binding_site.get('size_y', 20)),
                '--size_z', str(binding_site.get('size_z', 20)),
                '--exhaustiveness', str(exhaustiveness)
            ]
            
            # Run docking
            logger.info(f"Running docking command: {' '.join(vina_cmd)}")
            result = subprocess.run(vina_cmd, capture_output=True, text=True, timeout=300)
            
            if result.returncode != 0:
                raise RuntimeError(f"Vina failed: {result.stderr}")
            
            # Parse results
            docking_results = self._parse_vina_output(log_file, output_file)
            
            return {
                'success': True,
                'results': docking_results,
                'output_file': output_file,
                'log_file': log_file,
                'command': ' '.join(vina_cmd)
            }
            
        except Exception as e:
            logger.error(f"Docking failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _validate_protein_structure(self, protein_file: str) -> Dict[str, Any]:
        """Basic protein structure validation"""
        try:
            with open(protein_file, 'r') as f:
                content = f.read()
            
            atom_count = content.count('ATOM')
            hetatm_count = content.count('HETATM')
            
            return {
                'valid': atom_count > 0,
                'atom_count': atom_count,
                'hetatm_count': hetatm_count,
                'has_coordinates': 'ATOM' in content,
                'warnings': []
            }
            
        except Exception as e:
            return {
                'valid': False,
                'error': str(e)
            }
    
    def _identify_binding_sites(self, protein_file: str) -> List[Dict[str, float]]:
        """Identify potential binding sites (simplified implementation)"""
        # In a real implementation, this would use cavity detection algorithms
        # For now, return a default binding site at the center of the protein
        return [{
            'name': 'default_site',
            'x': 0.0,
            'y': 0.0,
            'z': 0.0,
            'size_x': 20.0,
            'size_y': 20.0,
            'size_z': 20.0,
            'confidence': 0.8
        }]
    
    def _calculate_ligand_properties_mock(self, smiles: str) -> Dict[str, float]:
        """Calculate molecular properties for drug-likeness assessment (mock version)"""
        # Simple estimation based on SMILES string
        atom_count = len([c for c in smiles if c.isupper()])

        return {
            'molecular_weight': atom_count * 12.5,  # Rough estimate
            'logp': len(smiles) * 0.1 - 2.0,  # Mock LogP
            'hbd': smiles.count('O') + smiles.count('N'),
            'hba': smiles.count('O') + smiles.count('N'),
            'tpsa': atom_count * 5.0,  # Mock TPSA
            'rotatable_bonds': smiles.count('-'),
            'aromatic_rings': smiles.count('c'),
            'atom_count': atom_count,
            'lipinski_violations': self._count_lipinski_violations_mock(smiles)
        }
    
    def _count_lipinski_violations_mock(self, smiles: str) -> int:
        """Count Lipinski Rule of Five violations (mock version)"""
        violations = 0
        atom_count = len([c for c in smiles if c.isupper()])

        mw = atom_count * 12.5
        logp = len(smiles) * 0.1 - 2.0
        hbd = smiles.count('O') + smiles.count('N')
        hba = smiles.count('O') + smiles.count('N')

        if mw > 500: violations += 1
        if logp > 5: violations += 1
        if hbd > 5: violations += 1
        if hba > 10: violations += 1

        return violations
    
    def _convert_to_pdbqt(self, input_file: str, output_file: str, is_protein: bool):
        """Convert structure to PDBQT format (simplified)"""
        # In a real implementation, this would use MGLTools or similar
        # For now, create a mock PDBQT file
        with open(output_file, 'w') as f:
            f.write(f"# Mock PDBQT file for {'protein' if is_protein else 'ligand'}\n")
            f.write(f"# Generated from: {input_file}\n")
    
    def _parse_vina_output(self, log_file: str, output_file: str) -> List[Dict[str, Any]]:
        """Parse AutoDock Vina output"""
        results = []
        
        try:
            with open(log_file, 'r') as f:
                log_content = f.read()
            
            # Parse binding affinities from log
            lines = log_content.split('\n')
            for i, line in enumerate(lines):
                if 'REMARK VINA RESULT:' in line:
                    parts = line.split()
                    if len(parts) >= 4:
                        results.append({
                            'mode': len(results) + 1,
                            'affinity': float(parts[3]),
                            'rmsd_lb': float(parts[4]) if len(parts) > 4 else 0.0,
                            'rmsd_ub': float(parts[5]) if len(parts) > 5 else 0.0
                        })
            
            return results
            
        except Exception as e:
            logger.error(f"Failed to parse Vina output: {e}")
            return []
    
    def _mock_docking_result(self, protein_pdbqt: str, ligand_pdbqt: str, 
                           binding_site: Dict[str, float]) -> Dict[str, Any]:
        """Generate mock docking results when Vina is not available"""
        mock_results = []
        
        # Generate multiple binding modes with different affinities
        for i in range(5):
            affinity = -8.5 + np.random.normal(0, 1.5)  # Random affinity around -8.5
            mock_results.append({
                'mode': i + 1,
                'affinity': round(affinity, 1),
                'rmsd_lb': round(np.random.uniform(0, 2), 1),
                'rmsd_ub': round(np.random.uniform(2, 4), 1)
            })
        
        # Sort by affinity (most negative = best)
        mock_results.sort(key=lambda x: x['affinity'])
        
        return {
            'success': True,
            'results': mock_results,
            'output_file': 'mock_output.pdbqt',
            'log_file': 'mock_log.txt',
            'mock': True,
            'binding_site': binding_site
        }
    
    def cleanup(self):
        """Clean up temporary files"""
        try:
            import shutil
            shutil.rmtree(self.temp_dir)
            logger.info("Temporary files cleaned up")
        except Exception as e:
            logger.warning(f"Failed to clean up temporary files: {e}")
