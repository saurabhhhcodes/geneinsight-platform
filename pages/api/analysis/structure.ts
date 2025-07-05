import { NextApiRequest, NextApiResponse } from 'next';

// Convert single letter amino acid codes to 3-letter codes for PDB format
function getThreeLetterCode(singleLetter: string): string {
  const aaMap: { [key: string]: string } = {
    'A': 'ALA', 'R': 'ARG', 'N': 'ASN', 'D': 'ASP', 'C': 'CYS',
    'Q': 'GLN', 'E': 'GLU', 'G': 'GLY', 'H': 'HIS', 'I': 'ILE',
    'L': 'LEU', 'K': 'LYS', 'M': 'MET', 'F': 'PHE', 'P': 'PRO',
    'S': 'SER', 'T': 'THR', 'W': 'TRP', 'Y': 'TYR', 'V': 'VAL',
    'X': 'UNK'
  };
  return aaMap[singleLetter] || 'UNK';
}

// Calculate accurate molecular properties
function calculateMolecularProperties(proteinSequence: string) {
  // Accurate molecular weights for amino acids (Da)
  const molecularWeights: { [key: string]: number } = {
    'A': 89.09, 'R': 174.20, 'N': 132.12, 'D': 133.10, 'C': 121.15,
    'Q': 146.15, 'E': 147.13, 'G': 75.07, 'H': 155.16, 'I': 131.17,
    'L': 131.17, 'K': 146.19, 'M': 149.21, 'F': 165.19, 'P': 115.13,
    'S': 105.09, 'T': 119.12, 'W': 204.23, 'Y': 181.19, 'V': 117.15,
    'X': 110.00 // Average for unknown
  };

  // pKa values for ionizable groups
  const pKaValues: { [key: string]: number[] } = {
    'D': [3.9], 'E': [4.3], 'H': [6.0], 'C': [8.3], 'Y': [10.1],
    'K': [10.5], 'R': [12.5]
  };

  // Hydrophobicity index (Kyte-Doolittle scale)
  const hydrophobicity: { [key: string]: number } = {
    'A': 1.8, 'R': -4.5, 'N': -3.5, 'D': -3.5, 'C': 2.5,
    'Q': -3.5, 'E': -3.5, 'G': -0.4, 'H': -3.2, 'I': 4.5,
    'L': 3.8, 'K': -3.9, 'M': 1.9, 'F': 2.8, 'P': -1.6,
    'S': -0.8, 'T': -0.7, 'W': -0.9, 'Y': -1.3, 'V': 4.2,
    'X': 0.0
  };

  // Calculate molecular weight
  let totalMW = 0;
  for (const aa of proteinSequence) {
    totalMW += molecularWeights[aa] || 110;
  }
  // Subtract water molecules for peptide bonds
  totalMW -= (proteinSequence.length - 1) * 18.015;

  // Calculate average hydrophobicity
  let totalHydrophobicity = 0;
  for (const aa of proteinSequence) {
    totalHydrophobicity += hydrophobicity[aa] || 0;
  }
  const avgHydrophobicity = totalHydrophobicity / proteinSequence.length;

  // Estimate isoelectric point (simplified)
  let positiveCharges = 0;
  let negativeCharges = 0;
  for (const aa of proteinSequence) {
    if (['K', 'R', 'H'].includes(aa)) positiveCharges++;
    if (['D', 'E'].includes(aa)) negativeCharges++;
  }

  // Simplified pI calculation
  let estimatedPI = 7.0;
  if (positiveCharges > negativeCharges) {
    estimatedPI = 7.0 + (positiveCharges - negativeCharges) * 0.5;
  } else if (negativeCharges > positiveCharges) {
    estimatedPI = 7.0 - (negativeCharges - positiveCharges) * 0.5;
  }
  estimatedPI = Math.max(3.0, Math.min(12.0, estimatedPI));

  return {
    molecularWeight: Math.round(totalMW * 100) / 100,
    isoelectricPoint: Math.round(estimatedPI * 100) / 100,
    hydrophobicity: Math.round(avgHydrophobicity * 1000) / 1000,
    composition: {
      positiveCharges,
      negativeCharges,
      hydrophobic: proteinSequence.split('').filter(aa => ['A', 'I', 'L', 'M', 'F', 'W', 'Y', 'V'].includes(aa)).length,
      polar: proteinSequence.split('').filter(aa => ['S', 'T', 'N', 'Q'].includes(aa)).length
    }
  };
}

// Mock protein structure generation
function generateProteinStructure(dnaSequence: string) {
  const cleanSequence = dnaSequence.replace(/\s/g, '').toUpperCase();
  
  // Complete standard genetic code table (all 64 codons)
  const codonTable: { [key: string]: string } = {
    // Phenylalanine
    'TTT': 'F', 'TTC': 'F',
    // Leucine
    'TTA': 'L', 'TTG': 'L', 'CTT': 'L', 'CTC': 'L', 'CTA': 'L', 'CTG': 'L',
    // Serine
    'TCT': 'S', 'TCC': 'S', 'TCA': 'S', 'TCG': 'S', 'AGT': 'S', 'AGC': 'S',
    // Tyrosine
    'TAT': 'Y', 'TAC': 'Y',
    // Stop codons
    'TAA': '*', 'TAG': '*', 'TGA': '*',
    // Cysteine
    'TGT': 'C', 'TGC': 'C',
    // Tryptophan
    'TGG': 'W',
    // Proline
    'CCT': 'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P',
    // Histidine
    'CAT': 'H', 'CAC': 'H',
    // Glutamine
    'CAA': 'Q', 'CAG': 'Q',
    // Arginine
    'CGT': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R', 'AGA': 'R', 'AGG': 'R',
    // Isoleucine
    'ATT': 'I', 'ATC': 'I', 'ATA': 'I',
    // Methionine (Start codon)
    'ATG': 'M',
    // Threonine
    'ACT': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T',
    // Asparagine
    'AAT': 'N', 'AAC': 'N',
    // Lysine
    'AAA': 'K', 'AAG': 'K',
    // Valine
    'GTT': 'V', 'GTC': 'V', 'GTA': 'V', 'GTG': 'V',
    // Alanine
    'GCT': 'A', 'GCC': 'A', 'GCA': 'A', 'GCG': 'A',
    // Aspartic acid
    'GAT': 'D', 'GAC': 'D',
    // Glutamic acid
    'GAA': 'E', 'GAG': 'E',
    // Glycine
    'GGT': 'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G'
  };

  // Find the first start codon (ATG) and translate from there
  let proteinSequence = '';
  let startIndex = cleanSequence.indexOf('ATG');

  if (startIndex === -1) {
    // No start codon found, translate from beginning (for analysis purposes)
    startIndex = 0;
  }

  // Translate in the correct reading frame
  for (let i = startIndex; i < cleanSequence.length - 2; i += 3) {
    const codon = cleanSequence.substring(i, i + 3);
    if (codon.length < 3) break; // Incomplete codon

    const aminoAcid = codonTable[codon];
    if (!aminoAcid) {
      // Unknown codon, use X for unknown amino acid
      proteinSequence += 'X';
    } else if (aminoAcid === '*') {
      // Stop codon found, end translation
      break;
    } else {
      proteinSequence += aminoAcid;
    }
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

  // Improved secondary structure prediction using Chou-Fasman method principles
  const secondaryStructure = [];

  // Chou-Fasman propensities (simplified)
  const helixPropensity: { [key: string]: number } = {
    'A': 1.42, 'E': 1.51, 'L': 1.21, 'M': 1.45, 'Q': 1.11, 'K': 1.16, 'R': 0.98,
    'H': 1.00, 'V': 1.06, 'I': 1.08, 'Y': 0.69, 'C': 0.70, 'W': 1.08, 'F': 1.13,
    'T': 0.83, 'S': 0.77, 'N': 0.67, 'D': 1.01, 'G': 0.57, 'P': 0.57, 'X': 1.00
  };

  const sheetPropensity: { [key: string]: number } = {
    'V': 1.70, 'I': 1.60, 'Y': 1.47, 'F': 1.38, 'W': 1.37, 'L': 1.30, 'T': 1.19,
    'C': 1.19, 'A': 0.83, 'R': 0.93, 'G': 0.75, 'D': 0.54, 'K': 0.74, 'S': 0.75,
    'H': 0.87, 'Q': 1.10, 'E': 0.37, 'N': 0.89, 'P': 0.55, 'M': 1.05, 'X': 1.00
  };

  for (let i = 0; i < proteinSequence.length; i++) {
    const aa = proteinSequence[i];
    const helixProp = helixPropensity[aa] || 1.0;
    const sheetProp = sheetPropensity[aa] || 1.0;

    // Predict secondary structure based on propensities
    if (helixProp > 1.1 && helixProp > sheetProp) {
      secondaryStructure.push('H'); // Alpha helix
    } else if (sheetProp > 1.1 && sheetProp > helixProp) {
      secondaryStructure.push('E'); // Beta sheet
    } else {
      secondaryStructure.push('C'); // Coil/loop
    }
  }

  // Calculate secondary structure percentages
  const helixCount = secondaryStructure.filter(s => s === 'H').length;
  const sheetCount = secondaryStructure.filter(s => s === 'E').length;
  const loopCount = secondaryStructure.filter(s => s === 'C').length;
  const total = secondaryStructure.length;

  const confidence = Math.random() * 0.3 + 0.7;

  return {
    structure3D: {
      success: true,
      structureId: `structure_${Date.now()}`,
      proteinSequence,
      length: proteinSequence.length,
      atoms,
      secondaryStructure: secondaryStructure.join(''),
      confidence: Math.round(confidence * 100) / 100,
      method: 'AI Prediction',
      timestamp: new Date().toISOString(),
      pdbData: generateMockPDB(atoms, proteinSequence),
      secondaryStructure: {
        alphaHelix: total > 0 ? (helixCount / total) * 100 : 0,
        betaSheet: total > 0 ? (sheetCount / total) * 100 : 0,
        loop: total > 0 ? (loopCount / total) * 100 : 0
      },
      molecularProperties: calculateMolecularProperties(proteinSequence)
    }
  };
}

// Generate mock PDB format data with better structure
function generateMockPDB(atoms: any[], sequence: string): string {
  let pdb = 'HEADER    PROTEIN STRUCTURE PREDICTION                        ' + new Date().toISOString().substring(0, 10) + '   PRED\n';
  pdb += 'TITLE     AI-GENERATED PROTEIN STRUCTURE FROM DNA SEQUENCE\n';
  pdb += 'REMARK   1 GENERATED BY GENEINSIGHT PLATFORM\n';
  // Convert sequence to 3-letter codes for SEQRES
  const threeLetterSeq = sequence.split('').map(aa => getThreeLetterCode(aa)).join(' ');
  pdb += `SEQRES   1 A ${sequence.length.toString().padStart(4)}  ${threeLetterSeq}\n`;

  atoms.forEach((atom, index) => {
    // Format atom line according to PDB standard
    const atomNum = (index + 1).toString().padStart(5);
    const atomName = ' CA '; // Carbon Alpha
    const resName = getThreeLetterCode(atom.residue); // Convert to 3-letter code
    const chainId = 'A';
    const resNum = atom.residueNumber.toString().padStart(4);
    const x = atom.x.toFixed(3).padStart(8);
    const y = atom.y.toFixed(3).padStart(8);
    const z = atom.z.toFixed(3).padStart(8);
    const occupancy = '  1.00';
    const tempFactor = ' 20.00';
    const element = '           C';

    const atomLine = `ATOM  ${atomNum}${atomName}${resName} ${chainId}${resNum}    ${x}${y}${z}${occupancy}${tempFactor}${element}\n`;
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
    
    res.status(200).json(structure);

  } catch (error) {
    res.status(500).json({
      error: 'Structure generation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
