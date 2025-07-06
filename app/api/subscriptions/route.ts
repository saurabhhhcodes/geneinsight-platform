import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { PRICING_PLANS, getPlanById } from '@/lib/pricing'

const JWT_SECRET = process.env.JWT_SECRET || 'geneInsightSecretKeyForJWTTokenGeneration2024'

// Mock database - In production, use a real database
let subscriptions = [
  {
    id: 'sub-demo-001',
    organizationId: 'org-demo-001',
    stripeSubscriptionId: null,
    stripeCustomerId: null,
    planType: 'free',
    status: 'active',
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    trialStart: null,
    trialEnd: null,
    canceledAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sub-research-001',
    organizationId: 'org-research-001',
    stripeSubscriptionId: 'sub_stripe_example_123',
    stripeCustomerId: 'cus_stripe_example_123',
    planType: 'pro',
    status: 'active',
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    trialStart: null,
    trialEnd: null,
    canceledAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

let usageRecords = [
  {
    id: 'usage-001',
    organizationId: 'org-demo-001',
    userId: 'user-demo-001',
    resourceType: 'analysis',
    quantity: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usage-002',
    organizationId: 'org-research-001',
    userId: 'user-research-001',
    resourceType: 'analysis',
    quantity: 150,
    createdAt: new Date().toISOString()
  }
]

let organizations = [
  {
    id: 'org-demo-001',
    name: 'Demo Organization',
    planType: 'free'
  },
  {
    id: 'org-research-001',
    name: 'Research Lab',
    planType: 'pro'
  }
]

let users = [
  {
    id: 'user-demo-001',
    organizationId: 'org-demo-001',
    email: 'demo@geneinsight.com',
    role: 'owner'
  },
  {
    id: 'user-research-001',
    organizationId: 'org-research-001',
    email: 'researcher@geneinsight.com',
    role: 'owner'
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

function calculateUsage(organizationId: string, resourceType: string, period: 'current_month' | 'all_time' = 'current_month') {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  return usageRecords
    .filter(record => {
      if (record.organizationId !== organizationId) return false
      if (record.resourceType !== resourceType) return false
      
      if (period === 'current_month') {
        const recordDate = new Date(record.createdAt)
        return recordDate >= startOfMonth
      }
      
      return true
    })
    .reduce((total, record) => total + record.quantity, 0)
}

// GET /api/subscriptions - Get organization subscription and usage
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

    const subscription = subscriptions.find(sub => sub.organizationId === organization.id)
    const plan = getPlanById(organization.planType)

    // Calculate current usage
    const currentUsage = {
      analyses: calculateUsage(organization.id, 'analysis', 'current_month'),
      storage: calculateUsage(organization.id, 'storage', 'current_month'),
      apiCalls: calculateUsage(organization.id, 'api_call', 'current_month'),
      users: users.filter(u => u.organizationId === organization.id).length
    }

    // Calculate usage percentages
    const usagePercentages = plan ? {
      analyses: plan.limits.analysesPerMonth === -1 ? 0 : (currentUsage.analyses / plan.limits.analysesPerMonth) * 100,
      storage: plan.limits.storageGB === -1 ? 0 : (currentUsage.storage / plan.limits.storageGB) * 100,
      users: plan.limits.users === -1 ? 0 : (currentUsage.users / plan.limits.users) * 100
    } : null

    return NextResponse.json({
      success: true,
      subscription: subscription || null,
      plan,
      usage: currentUsage,
      usagePercentages,
      billingPeriod: {
        start: subscription?.currentPeriodStart,
        end: subscription?.currentPeriodEnd
      }
    })

  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription' },
      { status: 500 }
    )
  }
}

// POST /api/subscriptions/upgrade - Upgrade subscription
export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request)
    const body = await request.json()
    const { planType, interval = 'month' } = body

    if (!['pro', 'enterprise'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
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

    // Check if user has permission to manage subscription
    if (!['owner', 'admin'].includes(userRecord.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const organization = organizations.find(org => org.id === userRecord.organizationId)
    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const plan = getPlanById(planType)
    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      )
    }

    // In a real implementation, this would:
    // 1. Create Stripe checkout session
    // 2. Handle payment processing
    // 3. Update subscription in database
    
    // For demo purposes, we'll simulate the upgrade
    const subscriptionIndex = subscriptions.findIndex(sub => sub.organizationId === organization.id)
    const now = new Date()
    const periodEnd = new Date(now.getTime() + (interval === 'year' ? 365 : 30) * 24 * 60 * 60 * 1000)

    if (subscriptionIndex >= 0) {
      // Update existing subscription
      subscriptions[subscriptionIndex] = {
        ...subscriptions[subscriptionIndex],
        planType,
        status: 'active',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        updatedAt: now.toISOString()
      }
    } else {
      // Create new subscription
      const newSubscription = {
        id: `sub-${Date.now()}`,
        organizationId: organization.id,
        stripeSubscriptionId: `sub_demo_${Date.now()}`,
        stripeCustomerId: `cus_demo_${Date.now()}`,
        planType,
        status: 'active',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        trialStart: null,
        trialEnd: null,
        canceledAt: null,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }
      subscriptions.push(newSubscription)
    }

    // Update organization plan
    const orgIndex = organizations.findIndex(org => org.id === organization.id)
    if (orgIndex >= 0) {
      organizations[orgIndex].planType = planType
    }

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${plan.name} plan`,
      subscription: subscriptions.find(sub => sub.organizationId === organization.id),
      plan
    })

  } catch (error) {
    console.error('Upgrade subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to upgrade subscription' },
      { status: 500 }
    )
  }
}
