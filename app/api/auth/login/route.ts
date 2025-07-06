import { NextRequest, NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'geneInsightSecretKeyForJWTTokenGeneration2024'

// Mock database - In production, use a real database
const organizations = [
  {
    id: 'org-demo-001',
    name: 'Demo Organization',
    slug: 'demo-org',
    planType: 'free'
  },
  {
    id: 'org-research-001',
    name: 'Research Lab',
    slug: 'research-lab',
    planType: 'pro'
  }
]

const users = [
  {
    id: 'user-demo-001',
    organizationId: 'org-demo-001',
    email: 'demo@geneinsight.com',
    password: 'demo123', // In production, use hashed passwords
    firstName: 'Demo',
    lastName: 'User',
    role: 'owner',
    emailVerified: true,
    isActive: true
  },
  {
    id: 'user-research-001',
    organizationId: 'org-research-001',
    email: 'researcher@geneinsight.com',
    password: 'password123',
    firstName: 'Dr. Sarah',
    lastName: 'Chen',
    role: 'owner',
    emailVerified: true,
    isActive: true
  },
  {
    id: 'user-admin-001',
    organizationId: 'org-demo-001',
    email: 'admin@geneinsight.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    emailVerified: true,
    isActive: true
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      )
    }

    // Get user's organization
    const organization = organizations.find(org => org.id === user.organizationId)
    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Generate JWT token
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Return user data and token
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        emailVerified: user.emailVerified,
        organization: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          planType: organization.planType
        }
      },
      token,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Authentication API',
    version: '1.0.0',
    endpoints: {
      login: 'POST /api/auth/login',
      register: 'POST /api/auth/register'
    }
  })
}
