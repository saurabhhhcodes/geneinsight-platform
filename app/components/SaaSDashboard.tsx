'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  Users, 
  Database, 
  Zap, 
  TrendingUp, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { getPlanById, calculateUsagePercentage, getUsageColor } from '@/lib/pricing'

interface UsageData {
  analyses: { current: number; limit: number; percentage: number; remaining: number }
  storage: { current: number; limit: number; percentage: number; remaining: number }
  users: { current: number; limit: number; percentage: number; remaining: number }
  apiCalls: { current: number; limit: number; percentage: number; remaining: number }
}

interface SubscriptionData {
  plan: any
  usage: UsageData
  billingPeriod: {
    start: string
    end: string
  }
  subscription: {
    status: string
    planType: string
  }
}

export default function SaaSDashboard() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      let token = localStorage.getItem('token')
      if (!token) {
        // Create demo JWT token for demo mode
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLWRlbW8tMDAxIiwib3JnYW5pemF0aW9uSWQiOiJvcmctZGVtby0wMDEiLCJlbWFpbCI6ImRlbW9AZ2VuZWluc2lnaHQuY29tIiwicm9sZSI6Im93bmVyIiwiaWF0IjoxNzUyNjc2MjAwLCJleHAiOjE3NTUyNjgyMDB9.vUzsYMzGP3jHkbYSXesqgdcU8fQ5XSs6OevDxxkuHXA'
        localStorage.setItem('token', token)
      }

      const response = await fetch('/api/subscriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()

        // Transform API response to match component expectations
        const plan = data.plan || { name: 'Free Plan', id: 'free' }
        const usage = data.usage || {}
        const usagePercentages = data.usagePercentages || {}

        const transformedData = {
          plan: plan,
          usage: {
            analyses: {
              current: usage.analyses || 3,
              limit: plan.limits?.analysesPerMonth || 10,
              percentage: usagePercentages.analyses || 30,
              remaining: (plan.limits?.analysesPerMonth || 10) - (usage.analyses || 3)
            },
            storage: {
              current: usage.storage || 45, // MB
              limit: plan.limits?.storageGB || 100, // MB
              percentage: usagePercentages.storage || 45,
              remaining: (plan.limits?.storageGB || 100) - (usage.storage || 45)
            },
            users: {
              current: usage.users || 1,
              limit: plan.limits?.users || 5,
              percentage: usagePercentages.users || 20,
              remaining: (plan.limits?.users || 5) - (usage.users || 1)
            },
            apiCalls: {
              current: usage.apiCalls || 127,
              limit: plan.limits?.apiCallsPerMonth || 1000,
              percentage: ((usage.apiCalls || 127) / (plan.limits?.apiCallsPerMonth || 1000)) * 100,
              remaining: (plan.limits?.apiCallsPerMonth || 1000) - (usage.apiCalls || 127)
            }
          },
          billingPeriod: data.billingPeriod || {
            start: new Date().toISOString(),
            end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          subscription: {
            status: data.subscription?.status || 'active',
            planType: plan.id || 'free'
          }
        }

        setSubscriptionData(transformedData)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch subscription data')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Subscription fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planType: 'pro',
          interval: 'month'
        })
      })

      if (response.ok) {
        alert('Successfully upgraded to Pro plan!')
        fetchSubscriptionData() // Refresh data
      } else {
        const error = await response.json()
        alert(`Upgrade failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      alert('Upgrade failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchSubscriptionData} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!subscriptionData) {
    return null
  }

  const { plan, usage, billingPeriod, subscription } = subscriptionData

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'trialing': return 'bg-blue-100 text-blue-800'
      case 'past_due': return 'bg-yellow-100 text-yellow-800'
      case 'canceled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const shouldShowUpgradePrompt = () => {
    return plan?.id === 'free' && (
      usage.analyses.percentage > 80 || 
      usage.storage.percentage > 80 || 
      usage.users.percentage > 80
    )
  }

  return (
    <div className="space-y-6">
      {/* Upgrade Prompt */}
      {shouldShowUpgradePrompt() && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Approaching Usage Limits</h3>
                  <p className="text-yellow-700 text-sm">
                    You're using most of your {plan.name} plan limits. Consider upgrading for more capacity.
                  </p>
                </div>
              </div>
              <Button onClick={handleUpgrade} className="bg-yellow-600 hover:bg-yellow-700">
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Current Plan: {plan?.name}</span>
              </CardTitle>
              <p className="text-gray-600 mt-1">{plan?.description}</p>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor(subscription.status)}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">
                {billingPeriod.start && billingPeriod.end && (
                  <>
                    {formatDate(billingPeriod.start)} - {formatDate(billingPeriod.end)}
                  </>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {plan?.price === 0 ? 'Free' : `$${plan?.price}/month`}
            </div>
            {plan?.id !== 'enterprise' && (
              <Button onClick={handleUpgrade} variant="outline">
                {plan?.id === 'free' ? 'Upgrade to Pro' : 'Upgrade to Enterprise'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Analyses</span>
              </div>
              <Badge variant="outline" className={getUsageColor(usage.analyses.percentage)}>
                {usage.analyses.percentage.toFixed(0)}%
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used: {usage.analyses.current.toLocaleString()}</span>
                <span>Limit: {usage.analyses.limit === -1 ? 'Unlimited' : usage.analyses.limit.toLocaleString()}</span>
              </div>
              {usage.analyses.limit > 0 && (
                <Progress value={usage.analyses.percentage} className="h-2" />
              )}
              <div className="text-xs text-gray-600">
                {usage.analyses.remaining === -1 ? 'Unlimited remaining' : `${usage.analyses.remaining} remaining`}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <span className="font-medium">Team Members</span>
              </div>
              <Badge variant="outline" className={getUsageColor(usage.users.percentage)}>
                {usage.users.percentage.toFixed(0)}%
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active: {usage.users.current}</span>
                <span>Limit: {usage.users.limit === -1 ? 'Unlimited' : usage.users.limit}</span>
              </div>
              {usage.users.limit > 0 && (
                <Progress value={usage.users.percentage} className="h-2" />
              )}
              <div className="text-xs text-gray-600">
                {usage.users.remaining === -1 ? 'Unlimited slots' : `${usage.users.remaining} slots available`}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Storage</span>
              </div>
              <Badge variant="outline" className={getUsageColor(usage.storage.percentage)}>
                {usage.storage.percentage.toFixed(0)}%
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used: {usage.storage.current.toFixed(1)}GB</span>
                <span>Limit: {usage.storage.limit}GB</span>
              </div>
              <Progress value={usage.storage.percentage} className="h-2" />
              <div className="text-xs text-gray-600">
                {usage.storage.remaining.toFixed(1)}GB remaining
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-orange-600" />
                <span className="font-medium">API Calls</span>
              </div>
              <Badge variant="outline" className={getUsageColor(usage.apiCalls?.percentage || 0)}>
                {(usage.apiCalls?.percentage || 0).toFixed(0)}%
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used: {(usage.apiCalls?.current || 0).toLocaleString()}</span>
                <span>Limit: {usage.apiCalls?.limit === -1 ? 'Unlimited' : (usage.apiCalls?.limit || 0).toLocaleString()}</span>
              </div>
              {usage.apiCalls && usage.apiCalls.limit > 0 && (
                <Progress value={usage.apiCalls.percentage} className="h-2" />
              )}
              <div className="text-xs text-gray-600">
                {usage.apiCalls?.remaining === -1 ? 'Unlimited' : `${(usage.apiCalls?.remaining || 0).toLocaleString()} remaining`}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
