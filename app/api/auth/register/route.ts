import { NextRequest, NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'geneInsightSecretKeyForJWTTokenGeneration2024'

// Mock user database (in production, use a real database)
let users = [
  {
    id: 1,
    email: 'researcher@geneinsight.com',
    password: 'password123',
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
    const { email, password, name } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password, // In production, hash the password
      name,
      role: 'user'
    }

    users.push(newUser)

    // Generate JWT token
    const token = sign(
      { 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Return user data and token
    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      token,
      message: 'Registration successful'
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Registration API',
    version: '1.0.0',
    endpoints: {
      register: 'POST /api/auth/register'
    }
  })
}
