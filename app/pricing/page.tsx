'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Check, Star, Zap, Shield, Users, BarChart3, Headphones } from 'lucide-react'
import { PRICING_PLANS, getAnnualPrice, formatPrice } from '@/lib/pricing'

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') {
      // Redirect to signup
      window.location.href = '/register'
      return
    }

    if (planId === 'enterprise') {
      // Redirect to contact sales
      window.location.href = 'mailto:sales@geneinsight.com?subject=Enterprise Plan Inquiry'
      return
    }

    // For Pro plan, handle subscription upgrade
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planType: planId,
          interval: isAnnual ? 'year' : 'month'
        })
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Successfully upgraded to ${data.plan.name} plan!`)
        window.location.href = '/dashboard'
      } else {
        const error = await response.json()
        alert(`Upgrade failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      alert('Upgrade failed. Please try again.')
    }
  }

  const getDisplayPrice = (plan: any) => {
    if (plan.price === 0) return 'Free'

    const price = isAnnual ? getAnnualPrice(plan.price) : plan.price
    const interval = isAnnual ? 'year' : 'month'

    if (isAnnual && plan.price > 0) {
      return (
        <div>
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-lg text-gray-600">/year</span>
          <div className="text-sm text-green-600 font-medium">
            Save ${plan.price * 12 - price} annually
          </div>
        </div>
      )
    }

    return (
      <div>
        <span className="text-3xl font-bold">${price}</span>
        <span className="text-lg text-gray-600">/{interval === 'month' ? 'mo' : 'yr'}</span>
      </div>
    )
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Users className="h-6 w-6" />
      case 'pro': return <Zap className="h-6 w-6" />
      case 'enterprise': return <Shield className="h-6 w-6" />
      default: return <BarChart3 className="h-6 w-6" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Scale your bioinformatics research with flexible pricing that grows with your team
          </p>

          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-lg ${!isAnnual ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className={`text-lg ${isAnnual ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Save 20%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl scale-105' : 'shadow-lg'} hover:shadow-xl transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1 flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Most Popular</span>
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    plan.id === 'free' ? 'bg-gray-100 text-gray-600' :
                    plan.id === 'pro' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {getPlanIcon(plan.id)}
                  </div>
                </div>

                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <p className="text-gray-600 mb-4">{plan.description}</p>

                <div className="mb-4">
                  {getDisplayPrice(plan)}
                </div>

                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : plan.id === 'enterprise'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Features included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Usage Limits:</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Team members:</span>
                        <span className="font-medium">
                          {plan.limits.users === -1 ? 'Unlimited' : plan.limits.users}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Analyses/month:</span>
                        <span className="font-medium">
                          {plan.limits.analysesPerMonth === -1 ? 'Unlimited' : plan.limits.analysesPerMonth.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage:</span>
                        <span className="font-medium">{plan.limits.storageGB}GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Support:</span>
                        <span className="font-medium capitalize">{plan.limits.supportLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately,
                and we'll prorate any billing differences.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I exceed my limits?
              </h3>
              <p className="text-gray-600">
                We'll notify you when you're approaching your limits. You can upgrade your plan
                or purchase additional usage as needed.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is my data secure?
              </h3>
              <p className="text-gray-600">
                Absolutely. We use enterprise-grade security measures and comply with industry
                standards to protect your sensitive research data.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer academic discounts?
              </h3>
              <p className="text-gray-600">
                Yes! We offer special pricing for academic institutions and students.
                Contact us for more information about educational discounts.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <Headphones className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need help choosing a plan?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team is here to help you find the perfect plan for your research needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                Schedule a Demo
              </Button>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
