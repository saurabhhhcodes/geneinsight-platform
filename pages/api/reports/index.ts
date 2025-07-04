import { NextApiRequest, NextApiResponse } from 'next';

// Mock reports data
const mockReports = [
  {
    id: '1',
    name: 'BRCA1 Gene Analysis Report',
    type: 'Genetic Analysis',
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    description: 'Comprehensive analysis of BRCA1 gene mutations and disease associations',
    confidence: 89.0,
    analysisId: 'analysis_1'
  },
  {
    id: '2',
    name: 'TP53 Mutation Study Report',
    type: 'Mutation Analysis',
    status: 'completed',
    createdAt: '2024-01-14T14:20:00Z',
    description: 'Detailed study of TP53 mutations and their clinical significance',
    confidence: 76.0,
    analysisId: 'analysis_2'
  },
  {
    id: '3',
    name: 'CFTR Gene Sequence Report',
    type: 'Sequence Analysis',
    status: 'processing',
    createdAt: '2024-01-13T09:15:00Z',
    description: 'Analysis of CFTR gene sequence variations',
    confidence: null,
    analysisId: 'analysis_3'
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Return all reports
      res.status(200).json({
        success: true,
        data: mockReports,
        total: mockReports.length
      });
      break;

    case 'POST':
      // Create new report
      const { name, type, description, analysisId } = req.body;
      
      const newReport = {
        id: `report_${Date.now()}`,
        name: name || 'New Analysis Report',
        type: type || 'Genetic Analysis',
        status: 'processing',
        createdAt: new Date().toISOString(),
        description: description || 'Generated analysis report',
        confidence: null,
        analysisId: analysisId || `analysis_${Date.now()}`
      };

      res.status(201).json({
        success: true,
        data: newReport,
        message: 'Report created successfully'
      });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        error: `Method ${method} Not Allowed`
      });
      break;
  }
}
