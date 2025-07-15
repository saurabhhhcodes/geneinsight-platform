import { NextRequest, NextResponse } from 'next/server'

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['protein_pdbqt', 'ligand_pdbqt', 'binding_site']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate binding site structure
    const bindingSite = body.binding_site
    const requiredSiteFields = ['x', 'y', 'z']
    const missingSiteFields = requiredSiteFields.filter(field => 
      typeof bindingSite[field] !== 'number'
    )
    
    if (missingSiteFields.length > 0) {
      return NextResponse.json(
        { error: `Invalid binding site: missing ${missingSiteFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Forward request to ML service
    const response = await fetch(`${ML_SERVICE_URL}/docking/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Docking execution failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Docking execution error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Molecular Docking Execution API',
    version: '1.0.0',
    endpoints: {
      run: 'POST /api/ml-service/docking/run'
    }
  })
}
