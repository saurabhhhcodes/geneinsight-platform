import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'geneInsightSecretKeyForJWTTokenGeneration2024'

// Mock database - In production, use a real database
let organizations = [
  {
    id: 'org-demo-001',
    name: 'Demo Organization',
    slug: 'demo-org',
    domain: null,
    logoUrl: null,
    planType: 'free',
    maxUsers: 5,
    maxAnalysesPerMonth: 100,
    maxStorageGb: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'org-research-001',
    name: 'Research Lab',
    slug: 'research-lab',
    domain: 'research.university.edu',
    logoUrl: null,
    planType: 'pro',
    maxUsers: 25,
    maxAnalysesPerMonth: 1000,
    maxStorageGb: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

let users = [
  {
    id: 'user-demo-001',
    organizationId: 'org-demo-001',
    email: 'demo@geneinsight.com',
    firstName: 'Demo',
    lastName: 'User',
    role: 'owner',
    emailVerified: true,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-research-001',
    organizationId: 'org-research-001',
    email: 'researcher@geneinsight.com',
    firstName: 'Dr. Sarah',
    lastName: 'Chen',
    role: 'owner',
    emailVerified: true,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-admin-001',
    organizationId: 'org-demo-001',
    email: 'admin@geneinsight.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    emailVerified: true,
    isActive: true,
    createdAt: new Date().toISOString()
  }
]

function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No valid authorization header')
  }

  const token = authHeader.substring(7)
  try {
    const decoded = verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// GET /api/organizations - Get user's organization
export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request)
    
    const userRecord = users.find(u => u.id === user.userId)
    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const organization = organizations.find(org => org.id === userRecord.organizationId)
    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Get organization members
    const members = users.filter(u => u.organizationId === organization.id)
      .map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        emailVerified: u.emailVerified,
        isActive: u.isActive,
        createdAt: u.createdAt
      }))

    return NextResponse.json({
      success: true,
      organization: {
        ...organization,
        members,
        memberCount: members.length
      }
    })

  } catch (error) {
    console.error('Get organization error:', error)
    return NextResponse.json(
      { error: 'Failed to get organization' },
      { status: 500 }
    )
  }
}

// POST /api/organizations - Create new organization
export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request)
    const body = await request.json()
    const { name, slug, domain } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug is already taken
    const existingOrg = organizations.find(org => org.slug === slug)
    if (existingOrg) {
      return NextResponse.json(
        { error: 'Organization slug already exists' },
        { status: 409 }
      )
    }

    // Create new organization
    const newOrg = {
      id: `org-${Date.now()}`,
      name,
      slug,
      domain: domain || null,
      logoUrl: null,
      planType: 'free',
      maxUsers: 5,
      maxAnalysesPerMonth: 100,
      maxStorageGb: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    organizations.push(newOrg)

    // Update user to be owner of new organization
    const userRecord = users.find(u => u.id === user.userId)
    if (userRecord) {
      userRecord.organizationId = newOrg.id
      userRecord.role = 'owner'
    }

    return NextResponse.json({
      success: true,
      organization: newOrg,
      message: 'Organization created successfully'
    })

  } catch (error) {
    console.error('Create organization error:', error)
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    )
  }
}

// PUT /api/organizations - Update organization
export async function PUT(request: NextRequest) {
  try {
    const user = authenticateRequest(request)
    const body = await request.json()
    const { name, domain, logoUrl } = body

    const userRecord = users.find(u => u.id === user.userId)
    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to update organization
    if (!['owner', 'admin'].includes(userRecord.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const orgIndex = organizations.findIndex(org => org.id === userRecord.organizationId)
    if (orgIndex === -1) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Update organization
    organizations[orgIndex] = {
      ...organizations[orgIndex],
      name: name || organizations[orgIndex].name,
      domain: domain !== undefined ? domain : organizations[orgIndex].domain,
      logoUrl: logoUrl !== undefined ? logoUrl : organizations[orgIndex].logoUrl,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      organization: organizations[orgIndex],
      message: 'Organization updated successfully'
    })

  } catch (error) {
    console.error('Update organization error:', error)
    return NextResponse.json(
      { error: 'Failed to update organization' },
      { status: 500 }
    )
  }
}
