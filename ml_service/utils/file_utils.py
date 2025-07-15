"""
File utility functions for parsing biological file formats
"""

import re
from typing import Dict, List, Any, Optional, Tuple

def parse_fasta(file_content: str) -> List[Dict[str, str]]:
    """
    Parse FASTA format file content
    
    Args:
        file_content: Content of FASTA file as string
        
    Returns:
        List of dictionaries with 'id', 'description', and 'sequence' keys
    """
    sequences = []
    
    if not file_content:
        return sequences
    
    # Split by lines and process
    lines = file_content.strip().split('\n')
    current_sequence = None
    current_seq_lines = []
    
    for line in lines:
        line = line.strip()
        
        if line.startswith('>'):
            # Save previous sequence if exists
            if current_sequence is not None:
                current_sequence['sequence'] = ''.join(current_seq_lines)
                sequences.append(current_sequence)
            
            # Start new sequence
            header = line[1:]  # Remove '>'
            parts = header.split(' ', 1)
            seq_id = parts[0]
            description = parts[1] if len(parts) > 1 else ''
            
            current_sequence = {
                'id': seq_id,
                'description': description,
                'sequence': ''
            }
            current_seq_lines = []
            
        elif line and current_sequence is not None:
            # Add to current sequence
            current_seq_lines.append(line.upper())
    
    # Don't forget the last sequence
    if current_sequence is not None:
        current_sequence['sequence'] = ''.join(current_seq_lines)
        sequences.append(current_sequence)
    
    return sequences

def parse_pdb(file_content: str) -> Dict[str, Any]:
    """
    Parse PDB format file content
    
    Args:
        file_content: Content of PDB file as string
        
    Returns:
        Dictionary with parsed PDB information
    """
    if not file_content:
        return {'atoms': [], 'header': {}, 'chains': []}
    
    lines = file_content.strip().split('\n')
    atoms = []
    header_info = {}
    chains = set()
    
    for line in lines:
        if line.startswith('HEADER'):
            # Parse header information
            if len(line) >= 50:
                header_info['classification'] = line[10:50].strip()
            if len(line) >= 59:
                header_info['deposition_date'] = line[50:59].strip()
            if len(line) >= 66:
                header_info['id_code'] = line[62:66].strip()
                
        elif line.startswith('TITLE'):
            title = line[10:].strip()
            if 'title' in header_info:
                header_info['title'] += ' ' + title
            else:
                header_info['title'] = title
                
        elif line.startswith('ATOM') or line.startswith('HETATM'):
            # Parse atom information
            try:
                atom = {
                    'record_type': line[0:6].strip(),
                    'atom_number': int(line[6:11].strip()),
                    'atom_name': line[12:16].strip(),
                    'residue_name': line[17:20].strip(),
                    'chain_id': line[21:22].strip(),
                    'residue_number': int(line[22:26].strip()),
                    'x': float(line[30:38].strip()),
                    'y': float(line[38:46].strip()),
                    'z': float(line[46:54].strip()),
                    'occupancy': float(line[54:60].strip()) if len(line) > 54 and line[54:60].strip() else 1.0,
                    'temp_factor': float(line[60:66].strip()) if len(line) > 60 and line[60:66].strip() else 0.0,
                    'element': line[76:78].strip() if len(line) > 76 else ''
                }
                atoms.append(atom)
                chains.add(atom['chain_id'])
            except (ValueError, IndexError):
                # Skip malformed lines
                continue
    
    return {
        'atoms': atoms,
        'header': header_info,
        'chains': sorted(list(chains)),
        'atom_count': len(atoms)
    }

def parse_genbank(file_content: str) -> Dict[str, Any]:
    """
    Parse GenBank format file content (simplified)
    
    Args:
        file_content: Content of GenBank file as string
        
    Returns:
        Dictionary with parsed GenBank information
    """
    if not file_content:
        return {'features': [], 'sequence': '', 'metadata': {}}
    
    lines = file_content.strip().split('\n')
    features = []
    sequence_lines = []
    metadata = {}
    in_sequence = False
    current_feature = None
    
    for line in lines:
        if line.startswith('LOCUS'):
            parts = line.split()
            if len(parts) >= 3:
                metadata['locus'] = parts[1]
                metadata['length'] = parts[2]
                
        elif line.startswith('DEFINITION'):
            metadata['definition'] = line[12:].strip()
            
        elif line.startswith('ACCESSION'):
            metadata['accession'] = line[12:].strip()
            
        elif line.startswith('VERSION'):
            metadata['version'] = line[12:].strip()
            
        elif line.startswith('ORGANISM'):
            metadata['organism'] = line[12:].strip()
            
        elif line.startswith('FEATURES'):
            in_sequence = False
            
        elif line.startswith('ORIGIN'):
            in_sequence = True
            
        elif line.startswith('//'):
            break
            
        elif in_sequence:
            # Extract sequence (remove numbers and spaces)
            seq_part = re.sub(r'[^a-zA-Z]', '', line)
            sequence_lines.append(seq_part.upper())
            
        elif line.startswith('     ') and not in_sequence:
            # Feature line
            feature_match = re.match(r'\s+(\w+)\s+(.+)', line)
            if feature_match:
                feature_type = feature_match.group(1)
                location = feature_match.group(2)
                
                current_feature = {
                    'type': feature_type,
                    'location': location,
                    'qualifiers': {}
                }
                features.append(current_feature)
    
    return {
        'features': features,
        'sequence': ''.join(sequence_lines),
        'metadata': metadata
    }

def validate_file_format(file_content: str, expected_format: str) -> Dict[str, Any]:
    """
    Validate file format
    
    Args:
        file_content: File content to validate
        expected_format: Expected format ('fasta', 'pdb', 'genbank')
        
    Returns:
        Dictionary with validation results
    """
    if not file_content:
        return {'valid': False, 'error': 'Empty file content'}
    
    file_content = file_content.strip()
    
    if expected_format.lower() == 'fasta':
        if not file_content.startswith('>'):
            return {'valid': False, 'error': 'FASTA files must start with ">"'}
        
        # Check for valid FASTA structure
        lines = file_content.split('\n')
        has_sequence = False
        
        for line in lines:
            line = line.strip()
            if line.startswith('>'):
                continue
            elif line:
                has_sequence = True
                # Check for valid sequence characters
                if not re.match(r'^[A-Za-z\-\*]+$', line):
                    return {'valid': False, 'error': f'Invalid sequence characters in line: {line[:50]}...'}
        
        if not has_sequence:
            return {'valid': False, 'error': 'No sequence data found'}
            
    elif expected_format.lower() == 'pdb':
        # Check for PDB format indicators
        pdb_keywords = ['HEADER', 'ATOM', 'HETATM', 'END']
        has_pdb_content = any(keyword in file_content for keyword in pdb_keywords)
        
        if not has_pdb_content:
            return {'valid': False, 'error': 'No PDB format indicators found'}
            
    elif expected_format.lower() == 'genbank':
        if not file_content.startswith('LOCUS'):
            return {'valid': False, 'error': 'GenBank files must start with "LOCUS"'}
        
        if 'ORIGIN' not in file_content:
            return {'valid': False, 'error': 'GenBank files must contain "ORIGIN" section'}
            
    else:
        return {'valid': False, 'error': f'Unsupported format: {expected_format}'}
    
    return {'valid': True, 'format': expected_format}

def extract_sequences_from_file(file_content: str, file_format: str) -> List[str]:
    """
    Extract sequences from various file formats
    
    Args:
        file_content: File content
        file_format: Format of the file ('fasta', 'genbank', 'raw')
        
    Returns:
        List of extracted sequences
    """
    sequences = []
    
    if file_format.lower() == 'fasta':
        fasta_data = parse_fasta(file_content)
        sequences = [entry['sequence'] for entry in fasta_data]
        
    elif file_format.lower() == 'genbank':
        genbank_data = parse_genbank(file_content)
        if genbank_data['sequence']:
            sequences = [genbank_data['sequence']]
            
    elif file_format.lower() == 'raw':
        # Treat as raw sequence data
        cleaned = re.sub(r'[^A-Za-z]', '', file_content)
        if cleaned:
            sequences = [cleaned.upper()]
    
    return sequences

def get_file_stats(file_content: str, file_format: str) -> Dict[str, Any]:
    """
    Get statistics about a biological file
    
    Args:
        file_content: File content
        file_format: Format of the file
        
    Returns:
        Dictionary with file statistics
    """
    stats = {
        'file_size': len(file_content),
        'line_count': len(file_content.split('\n')),
        'format': file_format
    }
    
    if file_format.lower() == 'fasta':
        fasta_data = parse_fasta(file_content)
        stats.update({
            'sequence_count': len(fasta_data),
            'total_sequence_length': sum(len(entry['sequence']) for entry in fasta_data),
            'average_sequence_length': sum(len(entry['sequence']) for entry in fasta_data) / len(fasta_data) if fasta_data else 0
        })
        
    elif file_format.lower() == 'pdb':
        pdb_data = parse_pdb(file_content)
        stats.update({
            'atom_count': len(pdb_data['atoms']),
            'chain_count': len(pdb_data['chains']),
            'chains': pdb_data['chains']
        })
        
    elif file_format.lower() == 'genbank':
        genbank_data = parse_genbank(file_content)
        stats.update({
            'sequence_length': len(genbank_data['sequence']),
            'feature_count': len(genbank_data['features']),
            'organism': genbank_data['metadata'].get('organism', 'Unknown')
        })
    
    return stats
