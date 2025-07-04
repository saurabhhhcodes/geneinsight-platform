import { NextApiRequest, NextApiResponse } from 'next';

// Mock database of analyses
const mockAnalyses: { [key: string]: any } = {
  'analysis_1': {
    id: 'analysis_1',
    sequence: 'ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAAATCTTAGAGTGTCCCATCTGTCTGGAGTTGATCAAGGAACCTGTCTCCACAAAGTGTGACCACATATTTTGCAAATTTTGCATGCTGAAACTTCTCAACCAGAAGAAAGGGCCTTCACAGTGTCCTTTATGTAAGAATGATATCCCCGCTTGGCCCAGCCCTCCGCTGCTGGACCTGGCTGGTGGCCATGCTTCTTGCCCCTTGGGCCTCCCCCCAGCCTCTGAGCCCAGAAAGCGAAACCGGATCCTTGG',
    length: 311,
    gcContent: 52.4,
    confidence: 0.89,
    detectedGenes: ['BRCA1', 'TP53'],
    riskLevel: 'Low',
    predictions: {
      diseaseRisk: 15,
      functionalImpact: 'Moderate',
      pathogenicity: 'Benign'
    },
    timestamp: '2024-07-04T16:30:00Z',
    status: 'completed'
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const analysis = mockAnalyses[id as string];

      if (!analysis) {
        return res.status(404).json({ error: 'Analysis not found' });
      }

      res.status(200).json({
        success: true,
        data: analysis
      });

    } catch (error) {
      console.error('Get analysis error:', error);
      res.status(500).json({
        error: 'Failed to retrieve analysis',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}