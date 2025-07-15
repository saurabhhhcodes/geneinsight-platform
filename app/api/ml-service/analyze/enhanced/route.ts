import { NextRequest, NextResponse } from 'next/server'

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.sequence) {
      return NextResponse.json(
        { error: 'Sequence is required' },
        { status: 400 }
      )
    }

    // Clean and validate sequence
    const sequence = body.sequence.toString().trim()
    if (sequence.length === 0) {
      return NextResponse.json(
        { error: 'Sequence cannot be empty' },
        { status: 400 }
      )
    }

    // Set default sequence type if not provided
    const sequenceType = body.sequence_type || 'DNA'

    // Forward request to ML service
    const response = await fetch(`${ML_SERVICE_URL}/analyze/enhanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sequence: sequence,
        sequence_type: sequenceType
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Enhanced analysis failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Enhanced analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Enhanced Sequence Analysis API',
    version: '1.0.0',
    description: 'AI-powered sequence analysis with intelligent insights',
    endpoints: {
      analyze: 'POST /api/ml-service/analyze/enhanced'
    },
    supported_types: ['DNA', 'RNA', 'PROTEIN']
  })
}
