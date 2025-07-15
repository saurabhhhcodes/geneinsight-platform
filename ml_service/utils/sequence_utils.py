"""
Sequence utility functions for validation and processing
"""

import re
from typing import Dict, Any, Optional

def validate_sequence(sequence: str, sequence_type: str = 'DNA') -> Dict[str, Any]:
    """
    Validate a biological sequence
    
    Args:
        sequence: The sequence to validate
        sequence_type: Type of sequence ('DNA', 'RNA', 'PROTEIN')
        
    Returns:
        Dictionary with validation results
    """
    if not sequence or not isinstance(sequence, str):
        return {
            'valid': False,
            'error': 'Sequence must be a non-empty string'
        }
    
    sequence = sequence.upper().strip()
    
    if len(sequence) == 0:
        return {
            'valid': False,
            'error': 'Sequence cannot be empty'
        }
    
    # Define valid characters for each sequence type
    valid_chars = {
        'DNA': set('ATGCNRYWSMKHBVD'),  # Including ambiguous nucleotides
        'RNA': set('AUGCNRYWSMKHBVD'),  # Including ambiguous nucleotides
        'PROTEIN': set('ACDEFGHIKLMNPQRSTVWYXZB*')  # Including ambiguous amino acids
    }
    
    if sequence_type.upper() not in valid_chars:
        return {
            'valid': False,
            'error': f'Unsupported sequence type: {sequence_type}'
        }
    
    allowed_chars = valid_chars[sequence_type.upper()]
    invalid_chars = set(sequence) - allowed_chars
    
    if invalid_chars:
        return {
            'valid': False,
            'error': f'Invalid characters found: {", ".join(sorted(invalid_chars))}'
        }
    
    # Additional validation rules
    if sequence_type.upper() == 'DNA':
        if len(sequence) % 3 != 0 and len(sequence) > 100:
            # Only warn for longer sequences that might be coding
            return {
                'valid': True,
                'warning': 'Sequence length is not divisible by 3 (may not be a complete coding sequence)'
            }
    
    return {
        'valid': True,
        'length': len(sequence),
        'sequence_type': sequence_type.upper()
    }

def clean_sequence(sequence: str, sequence_type: str = 'DNA') -> str:
    """
    Clean and normalize a biological sequence
    
    Args:
        sequence: The sequence to clean
        sequence_type: Type of sequence ('DNA', 'RNA', 'PROTEIN')
        
    Returns:
        Cleaned sequence string
    """
    if not sequence:
        return ''
    
    # Remove whitespace and convert to uppercase
    cleaned = re.sub(r'\s+', '', str(sequence).upper())
    
    # Remove common non-sequence characters
    cleaned = re.sub(r'[0-9\-_\.\,\;\:\|\(\)\[\]\{\}]', '', cleaned)
    
    # Handle sequence type specific cleaning
    if sequence_type.upper() == 'DNA':
        # Convert U to T for DNA
        cleaned = cleaned.replace('U', 'T')
    elif sequence_type.upper() == 'RNA':
        # Convert T to U for RNA
        cleaned = cleaned.replace('T', 'U')
    
    return cleaned

def determine_sequence_type(sequence: str) -> str:
    """
    Automatically determine the type of a biological sequence
    
    Args:
        sequence: The sequence to analyze
        
    Returns:
        Predicted sequence type ('DNA', 'RNA', 'PROTEIN')
    """
    if not sequence:
        return 'UNKNOWN'
    
    sequence = sequence.upper().strip()
    
    # Count different character types
    dna_chars = set('ATGC')
    rna_chars = set('AUGC')
    protein_chars = set('ACDEFGHIKLMNPQRSTVWY')
    
    dna_count = sum(1 for c in sequence if c in dna_chars)
    rna_count = sum(1 for c in sequence if c in rna_chars)
    protein_count = sum(1 for c in sequence if c in protein_chars)
    
    total_length = len(sequence)
    
    # Calculate percentages
    dna_pct = dna_count / total_length if total_length > 0 else 0
    rna_pct = rna_count / total_length if total_length > 0 else 0
    protein_pct = protein_count / total_length if total_length > 0 else 0
    
    # Decision logic
    if 'U' in sequence and 'T' not in sequence and rna_pct > 0.8:
        return 'RNA'
    elif dna_pct > 0.8 and 'U' not in sequence:
        return 'DNA'
    elif protein_pct > 0.6:
        return 'PROTEIN'
    elif dna_pct > 0.6:
        return 'DNA'
    else:
        return 'UNKNOWN'

def translate_dna_to_protein(dna_sequence: str, frame: int = 0) -> str:
    """
    Translate DNA sequence to protein sequence
    
    Args:
        dna_sequence: DNA sequence to translate
        frame: Reading frame (0, 1, or 2)
        
    Returns:
        Protein sequence string
    """
    # Genetic code table
    codon_table = {
        'TTT': 'F', 'TTC': 'F', 'TTA': 'L', 'TTG': 'L',
        'TCT': 'S', 'TCC': 'S', 'TCA': 'S', 'TCG': 'S',
        'TAT': 'Y', 'TAC': 'Y', 'TAA': '*', 'TAG': '*',
        'TGT': 'C', 'TGC': 'C', 'TGA': '*', 'TGG': 'W',
        'CTT': 'L', 'CTC': 'L', 'CTA': 'L', 'CTG': 'L',
        'CCT': 'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P',
        'CAT': 'H', 'CAC': 'H', 'CAA': 'Q', 'CAG': 'Q',
        'CGT': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R',
        'ATT': 'I', 'ATC': 'I', 'ATA': 'I', 'ATG': 'M',
        'ACT': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T',
        'AAT': 'N', 'AAC': 'N', 'AAA': 'K', 'AAG': 'K',
        'AGT': 'S', 'AGC': 'S', 'AGA': 'R', 'AGG': 'R',
        'GTT': 'V', 'GTC': 'V', 'GTA': 'V', 'GTG': 'V',
        'GCT': 'A', 'GCC': 'A', 'GCA': 'A', 'GCG': 'A',
        'GAT': 'D', 'GAC': 'D', 'GAA': 'E', 'GAG': 'E',
        'GGT': 'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G'
    }
    
    if not dna_sequence:
        return ''
    
    dna_sequence = clean_sequence(dna_sequence, 'DNA')
    
    # Adjust for reading frame
    if frame > 0:
        dna_sequence = dna_sequence[frame:]
    
    protein = []
    
    # Translate codons
    for i in range(0, len(dna_sequence) - 2, 3):
        codon = dna_sequence[i:i+3]
        if len(codon) == 3:
            amino_acid = codon_table.get(codon, 'X')  # X for unknown
            protein.append(amino_acid)
    
    return ''.join(protein)

def find_orfs(dna_sequence: str, min_length: int = 30) -> list:
    """
    Find Open Reading Frames (ORFs) in a DNA sequence
    
    Args:
        dna_sequence: DNA sequence to analyze
        min_length: Minimum ORF length in nucleotides
        
    Returns:
        List of ORF dictionaries
    """
    if not dna_sequence:
        return []
    
    dna_sequence = clean_sequence(dna_sequence, 'DNA')
    orfs = []
    
    start_codons = ['ATG']
    stop_codons = ['TAA', 'TAG', 'TGA']
    
    # Check all three reading frames
    for frame in range(3):
        sequence = dna_sequence[frame:]
        
        i = 0
        while i < len(sequence) - 2:
            codon = sequence[i:i+3]
            
            if len(codon) == 3 and codon in start_codons:
                # Found start codon, look for stop codon
                start_pos = i + frame
                
                j = i + 3
                while j < len(sequence) - 2:
                    stop_codon = sequence[j:j+3]
                    
                    if len(stop_codon) == 3 and stop_codon in stop_codons:
                        # Found stop codon
                        end_pos = j + frame + 3
                        orf_length = end_pos - start_pos
                        
                        if orf_length >= min_length:
                            orf_sequence = dna_sequence[start_pos:end_pos]
                            protein_sequence = translate_dna_to_protein(orf_sequence)
                            
                            orfs.append({
                                'start': start_pos,
                                'end': end_pos,
                                'length': orf_length,
                                'frame': frame + 1,
                                'dna_sequence': orf_sequence,
                                'protein_sequence': protein_sequence,
                                'start_codon': codon,
                                'stop_codon': stop_codon
                            })
                        
                        i = j + 3
                        break
                    
                    j += 3
                else:
                    # No stop codon found, move to next position
                    i += 3
            else:
                i += 3
    
    # Sort ORFs by length (longest first)
    orfs.sort(key=lambda x: x['length'], reverse=True)
    
    return orfs

def calculate_gc_content(sequence: str) -> float:
    """
    Calculate GC content of a nucleotide sequence
    
    Args:
        sequence: Nucleotide sequence
        
    Returns:
        GC content as percentage (0-100)
    """
    if not sequence:
        return 0.0
    
    sequence = clean_sequence(sequence, 'DNA').upper()
    
    if len(sequence) == 0:
        return 0.0
    
    gc_count = sequence.count('G') + sequence.count('C')
    return (gc_count / len(sequence)) * 100

def reverse_complement(dna_sequence: str) -> str:
    """
    Get reverse complement of a DNA sequence
    
    Args:
        dna_sequence: DNA sequence
        
    Returns:
        Reverse complement sequence
    """
    if not dna_sequence:
        return ''
    
    complement_map = {
        'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G',
        'N': 'N', 'R': 'Y', 'Y': 'R', 'W': 'W',
        'S': 'S', 'M': 'K', 'K': 'M', 'H': 'D',
        'B': 'V', 'V': 'B', 'D': 'H'
    }
    
    dna_sequence = clean_sequence(dna_sequence, 'DNA').upper()
    
    # Get complement
    complement = ''.join(complement_map.get(base, base) for base in dna_sequence)
    
    # Return reverse complement
    return complement[::-1]
