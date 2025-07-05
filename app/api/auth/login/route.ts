import { NextRequest, NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'geneInsightSecretKeyForJWTTokenGeneration2024'

// Mock user database (in production, use a real database)
const users = [
  {
    id: 1,
    email: 'researcher@geneinsight.com',
    password: 'password123', // In production, use hashed passwords
    name: 'Dr. Sarah Chen',
    role: 'researcher'
  },
  {
    id: 2,
    email: 'admin@geneinsight.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: 3,
    email: 'demo@geneinsight.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'user'
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

    // Generate JWT token
    const token = sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
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
        name: user.name,
        role: user.role
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
