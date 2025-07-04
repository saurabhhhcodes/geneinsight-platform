import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

// DNA sequence validation
function validateDNASequence(sequence: string): boolean {
  const dnaPattern = /^[ATCG\s\n\r]+$/i;
  return dnaPattern.test(sequence.replace(/\s/g, ''));
}

// Mock ML analysis
function analyzeDNASequence(sequence: string) {
  const cleanSequence = sequence.replace(/\s/g, '').toUpperCase();
  const length = cleanSequence.length;
  
  // Mock analysis results
  const gcContent = (cleanSequence.match(/[GC]/g) || []).length / length * 100;
  const confidence = Math.random() * 0.3 + 0.7; // 0.7-1.0
  
  // Mock gene predictions
  const genes = ['BRCA1', 'TP53', 'EGFR', 'KRAS', 'PIK3CA'];
  const detectedGenes = genes.slice(0, Math.floor(Math.random() * 3) + 1);
  
  // Mock risk assessment
  const riskLevels = ['Low', 'Moderate', 'High'];
  const riskLevel = riskLevels[Math.floor(Math.random() * 3)];
  
  // Calculate additional metrics
  const atContent = 100 - gcContent;
  const orfCount = Math.floor(length / 300) + Math.floor(Math.random() * 3); // Mock ORF count
  const motifs = ['TATA', 'CAAT', 'GC-box'].filter(() => Math.random() > 0.5); // Mock motifs

  return {
    basicAnalysis: {
      id: `analysis_${Date.now()}`,
      sequence: cleanSequence.substring(0, 100) + '...', // Truncate for display
      length,
      gcContent: Math.round(gcContent * 100) / 100,
      atContent: Math.round(atContent * 100) / 100,
      orfCount,
      motifs,
      confidence: Math.round(confidence * 100) / 100,
      detectedGenes,
      riskLevel,
      predictions: {
        diseaseRisk: Math.round(Math.random() * 30 + 10), // 10-40%
        functionalImpact: confidence > 0.8 ? 'High' : confidence > 0.6 ? 'Moderate' : 'Low',
        pathogenicity: Math.random() > 0.7 ? 'Pathogenic' : 'Benign'
      },
      timestamp: new Date().toISOString(),
      status: 'completed'
    }
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await form.parse(req);
    
    let sequence = '';
    
    // Handle file upload
    if (files.file && files.file[0]) {
      const file = files.file[0];
      const fileContent = fs.readFileSync(file.filepath, 'utf8');
      
      // Parse FASTA format
      if (file.originalFilename?.endsWith('.fasta') || file.originalFilename?.endsWith('.fa')) {
        const lines = fileContent.split('\n');
        sequence = lines.filter(line => !line.startsWith('>')).join('');
      } else {
        sequence = fileContent;
      }
    }
    
    // Handle direct sequence input
    if (fields.sequence && fields.sequence[0]) {
      sequence = fields.sequence[0];
    }

    if (!sequence) {
      return res.status(400).json({ error: 'No DNA sequence provided' });
    }

    // Validate DNA sequence
    if (!validateDNASequence(sequence)) {
      return res.status(400).json({ error: 'Invalid DNA sequence. Only A, T, C, G characters are allowed.' });
    }

    // Analyze sequence
    const analysis = analyzeDNASequence(sequence);

    // Return the exact format the frontend expects
    res.status(200).json(analysis);

  } catch (error) {
    res.status(500).json({
      error: 'Analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
