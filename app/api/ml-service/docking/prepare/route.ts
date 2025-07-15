import { NextRequest, NextResponse } from 'next/server'

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.protein_data || !body.ligand_smiles) {
      return NextResponse.json(
        { error: 'Protein data and ligand SMILES are required' },
        { status: 400 }
      )
    }

    // Forward request to ML service
    const response = await fetch(`${ML_SERVICE_URL}/docking/prepare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Docking preparation failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Docking preparation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Molecular Docking Preparation API',
    version: '1.0.0',
    endpoints: {
      prepare: 'POST /api/ml-service/docking/prepare'
    }
  })
}
