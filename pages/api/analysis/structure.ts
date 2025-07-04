import { NextApiRequest, NextApiResponse } from 'next';

// Mock protein structure generation
function generateProteinStructure(dnaSequence: string) {
  const cleanSequence = dnaSequence.replace(/\s/g, '').toUpperCase();
  
  // Mock translation to amino acids (simplified)
  const codonTable: { [key: string]: string } = {
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
  };

  let proteinSequence = '';
  for (let i = 0; i < cleanSequence.length - 2; i += 3) {
    const codon = cleanSequence.substring(i, i + 3);
    const aminoAcid = codonTable[codon] || 'X';
    if (aminoAcid === '*') break; // Stop codon
    proteinSequence += aminoAcid;
  }

  // Mock 3D coordinates (simplified alpha helix)
  const atoms = [];
  for (let i = 0; i < Math.min(proteinSequence.length, 50); i++) {
    const angle = (i * 100) * Math.PI / 180; // 100 degrees per residue
    const radius = 2.3; // Alpha helix radius
    const rise = 1.5; // Rise per residue
    
    atoms.push({
      element: 'C',
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
      z: i * rise,
      residue: proteinSequence[i],
      residueNumber: i + 1
    });
  }

  // Generate mock secondary structure
  const secondaryStructure = [];
  for (let i = 0; i < proteinSequence.length; i++) {
    const structures = ['H', 'E', 'C']; // Helix, Sheet, Coil
    secondaryStructure.push(structures[Math.floor(Math.random() * 3)]);
  }

  return {
    id: `structure_${Date.now()}`,
    proteinSequence,
    length: proteinSequence.length,
    atoms,
    secondaryStructure: secondaryStructure.join(''),
    confidence: Math.random() * 0.3 + 0.7,
    method: 'AI Prediction',
    timestamp: new Date().toISOString(),
    pdbData: generateMockPDB(atoms, proteinSequence)
  };
}

// Generate mock PDB format data
function generateMockPDB(atoms: any[], sequence: string): string {
  let pdb = 'HEADER    PROTEIN STRUCTURE PREDICTION\n';
  pdb += 'TITLE     AI-GENERATED PROTEIN STRUCTURE\n';
  pdb += `SEQRES   1 A ${sequence.length}  ${sequence.split('').join(' ')}\n`;
  
  atoms.forEach((atom, index) => {
    const atomLine = `ATOM  ${(index + 1).toString().padStart(5)} CA  ${atom.residue} A${(atom.residueNumber).toString().padStart(4)}    ${atom.x.toFixed(3).padStart(8)}${atom.y.toFixed(3).padStart(8)}${atom.z.toFixed(3).padStart(8)}  1.00 20.00           C\n`;
    pdb += atomLine;
  });
  
  pdb += 'END\n';
  return pdb;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sequence } = req.body;

    if (!sequence) {
      return res.status(400).json({ error: 'DNA sequence is required' });
    }

    // Validate DNA sequence
    const dnaPattern = /^[ATCG\s\n\r]+$/i;
    if (!dnaPattern.test(sequence.replace(/\s/g, ''))) {
      return res.status(400).json({ error: 'Invalid DNA sequence' });
    }

    // Generate protein structure
    const structure = generateProteinStructure(sequence);
    
    res.status(200).json({
      success: true,
      data: structure
    });

  } catch (error) {
    console.error('Structure generation error:', error);
    res.status(500).json({ 
      error: 'Structure generation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
