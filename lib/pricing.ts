// GeneInsight Platform SaaS Pricing Configuration

export interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  interval: 'month' | 'year'
  stripePriceId?: string
  features: string[]
  limits: {
    users: number
    analysesPerMonth: number
    storageGB: number
    apiCallsPerMonth: number
    supportLevel: 'community' | 'email' | 'priority'
    customIntegrations: boolean
    advancedAnalytics: boolean
    whiteLabel: boolean
  }
  popular?: boolean
  cta: string
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for students and individual researchers',
    price: 0,
    interval: 'month',
    features: [
      'Up to 5 team members',
      '100 analyses per month',
      '1GB storage',
      'Basic sequence analysis',
      '3D structure visualization',
      'Community support',
      'Export to common formats'
    ],
    limits: {
      users: 5,
      analysesPerMonth: 100,
      storageGB: 1,
      apiCallsPerMonth: 1000,
      supportLevel: 'community',
      customIntegrations: false,
      advancedAnalytics: false,
      whiteLabel: false
    },
    cta: 'Get Started Free'
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For research teams and small organizations',
    price: 49,
    interval: 'month',
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Up to 25 team members',
      '1,000 analyses per month',
      '10GB storage',
      'Advanced ML predictions',
      'Batch processing',
      'API access',
      'Priority email support',
      'Advanced analytics dashboard',
      'Custom export formats',
      'Team collaboration tools'
    ],
    limits: {
      users: 25,
      analysesPerMonth: 1000,
      storageGB: 10,
      apiCallsPerMonth: 10000,
      supportLevel: 'email',
      customIntegrations: true,
      advancedAnalytics: true,
      whiteLabel: false
    },
    popular: true,
    cta: 'Start Pro Trial'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    price: 199,
    interval: 'month',
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Unlimited team members',
      'Unlimited analyses',
      '100GB storage',
      'Custom ML model training',
      'Advanced batch processing',
      'Full API access',
      'Priority phone & email support',
      'Custom integrations',
      'White-label options',
      'Advanced security features',
      'Custom deployment options',
      'Dedicated account manager'
    ],
    limits: {
      users: -1, // unlimited
      analysesPerMonth: -1, // unlimited
      storageGB: 100,
      apiCallsPerMonth: -1, // unlimited
      supportLevel: 'priority',
      customIntegrations: true,
      advancedAnalytics: true,
      whiteLabel: true
    },
    cta: 'Contact Sales'
  }
]

export const ANNUAL_DISCOUNT = 0.2 // 20% discount for annual billing

export function getPlanById(planId: string): PricingPlan | undefined {
  return PRICING_PLANS.find(plan => plan.id === planId)
}

export function getAnnualPrice(monthlyPrice: number): number {
  return Math.round(monthlyPrice * 12 * (1 - ANNUAL_DISCOUNT))
}

export function formatPrice(price: number, interval: 'month' | 'year' = 'month'): string {
  if (price === 0) return 'Free'
  return `$${price}/${interval === 'month' ? 'mo' : 'yr'}`
}

export function canAccessFeature(userPlan: string, feature: keyof PricingPlan['limits']): boolean {
  const plan = getPlanById(userPlan)
  if (!plan) return false
  
  const limit = plan.limits[feature]
  if (typeof limit === 'boolean') return limit
  if (typeof limit === 'number') return limit > 0 || limit === -1 // -1 means unlimited
  return false
}

export function checkUsageLimit(
  userPlan: string, 
  limitType: 'users' | 'analysesPerMonth' | 'storageGB' | 'apiCallsPerMonth',
  currentUsage: number
): { allowed: boolean; limit: number; remaining: number } {
  const plan = getPlanById(userPlan)
  if (!plan) {
    return { allowed: false, limit: 0, remaining: 0 }
  }
  
  const limit = plan.limits[limitType] as number
  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1 } // unlimited
  }
  
  const remaining = Math.max(0, limit - currentUsage)
  return {
    allowed: currentUsage < limit,
    limit,
    remaining
  }
}

// Usage tracking helpers
export interface UsageStats {
  analyses: number
  storage: number
  apiCalls: number
  users: number
}

export function calculateUsagePercentage(usage: number, limit: number): number {
  if (limit === -1) return 0 // unlimited
  if (limit === 0) return 100
  return Math.min(100, (usage / limit) * 100)
}

export function getUsageColor(percentage: number): string {
  if (percentage >= 90) return 'text-red-600'
  if (percentage >= 75) return 'text-yellow-600'
  return 'text-green-600'
}

export function shouldShowUpgradePrompt(userPlan: string, usage: UsageStats): boolean {
  if (userPlan === 'enterprise') return false
  
  const plan = getPlanById(userPlan)
  if (!plan) return true
  
  // Show upgrade prompt if any usage is above 80%
  const analysisUsage = calculateUsagePercentage(usage.analyses, plan.limits.analysesPerMonth)
  const storageUsage = calculateUsagePercentage(usage.storage, plan.limits.storageGB)
  const userUsage = calculateUsagePercentage(usage.users, plan.limits.users)
  
  return analysisUsage > 80 || storageUsage > 80 || userUsage > 80
}
