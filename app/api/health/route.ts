import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'GeneInsight Platform API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    components: {
      api: 'UP',
      analysis: 'UP',
      authentication: 'UP',
      visualization: 'UP'
    },
    features: {
      dnaAnalysis: true,
      proteinStructure: true,
      threeDVisualization: true,
      fileUpload: true,
      exportFeatures: true
    }
  })
}
