import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { checkUsageLimit, getPlanById } from '@/lib/pricing'

const JWT_SECRET = process.env.JWT_SECRET || 'geneInsightSecretKeyForJWTTokenGeneration2024'

// Mock database - In production, use a real database
let usageRecords: any[] = []
let organizations = [
  { id: 'org-demo-001', planType: 'free' },
  { id: 'org-research-001', planType: 'pro' }
]
let users = [
  { id: 'user-demo-001', organizationId: 'org-demo-001' },
  { id: 'user-research-001', organizationId: 'org-research-001' }
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

function getCurrentMonthUsage(organizationId: string, resourceType: string): number {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  return usageRecords
    .filter(record => {
      const recordDate = new Date(record.createdAt)
      return record.organizationId === organizationId && 
             record.resourceType === resourceType &&
             recordDate >= startOfMonth
    })
    .reduce((total, record) => total + record.quantity, 0)
}

// POST /api/usage/track - Track usage for billing and limits
export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request)
    const body = await request.json()
    const { resourceType, quantity = 1, metadata = {} } = body

    if (!resourceType || !['analysis', 'storage', 'api_call', 'export'].includes(resourceType)) {
      return NextResponse.json(
        { error: 'Invalid resource type' },
        { status: 400 }
      )
    }

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

    // Check usage limits before tracking
    const currentUsage = getCurrentMonthUsage(organization.id, resourceType)
    const limitType = resourceType === 'analysis' ? 'analysesPerMonth' : 
                     resourceType === 'api_call' ? 'apiCallsPerMonth' : null

    if (limitType) {
      const usageCheck = checkUsageLimit(organization.planType, limitType, currentUsage + quantity)
      
      if (!usageCheck.allowed) {
        const plan = getPlanById(organization.planType)
        return NextResponse.json({
          error: 'Usage limit exceeded',
          details: {
            resourceType,
            currentUsage,
            limit: usageCheck.limit,
            planType: organization.planType,
            planName: plan?.name,
            upgradeRequired: true
          }
        }, { status: 429 }) // Too Many Requests
      }
    }

    // Track the usage
    const usageRecord = {
      id: `usage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      organizationId: organization.id,
      userId: user.userId,
      resourceType,
      quantity,
      metadata,
      createdAt: new Date().toISOString()
    }

    usageRecords.push(usageRecord)

    // Calculate updated usage stats
    const updatedUsage = getCurrentMonthUsage(organization.id, resourceType)
    const plan = getPlanById(organization.planType)
    
    let usagePercentage = 0
    let remainingUsage = -1
    
    if (plan && limitType) {
      const limit = plan.limits[limitType] as number
      if (limit > 0) {
        usagePercentage = (updatedUsage / limit) * 100
        remainingUsage = limit - updatedUsage
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Usage tracked successfully',
      usage: {
        resourceType,
        current: updatedUsage,
        limit: plan?.limits[limitType as keyof typeof plan.limits] || -1,
        percentage: usagePercentage,
        remaining: remainingUsage
      },
      record: {
        id: usageRecord.id,
        quantity: usageRecord.quantity,
        createdAt: usageRecord.createdAt
      }
    })

  } catch (error) {
    console.error('Track usage error:', error)
    return NextResponse.json(
      { error: 'Failed to track usage' },
      { status: 500 }
    )
  }
}

// GET /api/usage/track - Get usage statistics
export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request)
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'current_month'
    const resourceType = searchParams.get('resourceType')

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

    const plan = getPlanById(organization.planType)
    
    // Calculate usage for different resource types
    const resourceTypes = resourceType ? [resourceType] : ['analysis', 'storage', 'api_call', 'export']
    const usageStats: any = {}

    for (const type of resourceTypes) {
      const usage = getCurrentMonthUsage(organization.id, type)
      const limitKey = type === 'analysis' ? 'analysesPerMonth' : 
                      type === 'api_call' ? 'apiCallsPerMonth' : 
                      type === 'storage' ? 'storageGB' : null

      let limit = -1
      let percentage = 0
      
      if (plan && limitKey) {
        limit = plan.limits[limitKey as keyof typeof plan.limits] as number
        if (limit > 0) {
          percentage = (usage / limit) * 100
        }
      }

      usageStats[type] = {
        current: usage,
        limit,
        percentage: Math.round(percentage * 100) / 100,
        remaining: limit > 0 ? limit - usage : -1
      }
    }

    // Get recent usage records for charts/history
    const recentRecords = usageRecords
      .filter(record => record.organizationId === organization.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50)

    return NextResponse.json({
      success: true,
      organization: {
        id: organization.id,
        planType: organization.planType,
        planName: plan?.name
      },
      period,
      usage: usageStats,
      recentActivity: recentRecords.map(record => ({
        id: record.id,
        resourceType: record.resourceType,
        quantity: record.quantity,
        createdAt: record.createdAt,
        metadata: record.metadata
      }))
    })

  } catch (error) {
    console.error('Get usage error:', error)
    return NextResponse.json(
      { error: 'Failed to get usage statistics' },
      { status: 500 }
    )
  }
}
