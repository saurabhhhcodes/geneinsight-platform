"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Star, Zap, Building, Users } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for students and individual researchers",
      icon: <Star className="h-6 w-6" />,
      features: [
        "10 analyses per month",
        "Basic DNA sequence analysis",
        "Standard reports",
        "Community support",
        "Basic 3D visualization"
      ],
      limitations: [
        "No API access",
        "Limited file formats",
        "Standard processing speed"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      description: "Ideal for researchers and small labs",
      icon: <Zap className="h-6 w-6" />,
      features: [
        "500 analyses per month",
        "Advanced AI analysis",
        "3D structure prediction",
        "Custom reports",
        "Priority support",
        "API access",
        "All file formats",
        "Collaboration tools"
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large organizations and institutions",
      icon: <Building className="h-6 w-6" />,
      features: [
        "Unlimited analyses",
        "Custom AI models",
        "Advanced 3D visualization",
        "White-label reports",
        "24/7 dedicated support",
        "Full API access",
        "Custom integrations",
        "Team management",
        "SLA guarantees",
        "On-premise deployment"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ]

  const faqs = [
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer: "Yes, you can change your plan at any time. Changes take effect immediately and billing is prorated."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers."
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "Yes, all paid plans come with a 14-day free trial. No credit card required to start."
    },
    {
      question: "Do you offer academic discounts?",
      answer: "Yes, we offer special pricing for academic institutions and students. Contact us for details."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your research needs. All plans include our core features 
            with no hidden fees or surprise charges.
          </p>
          <Badge variant="secondary" className="px-4 py-2">
            <Users className="h-4 w-4 mr-2" />
            Trusted by 10,000+ researchers worldwide
          </Badge>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative hover:shadow-lg transition-shadow ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit mb-4">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {plan.price}
                  {plan.price !== "Free" && plan.price !== "Custom" && (
                    <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Feature Comparison</CardTitle>
            <CardDescription>Compare features across all plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">Feature</th>
                    <th className="text-center py-4 px-4">Starter</th>
                    <th className="text-center py-4 px-4">Professional</th>
                    <th className="text-center py-4 px-4">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Monthly Analyses</td>
                    <td className="py-4 px-4 text-center">10</td>
                    <td className="py-4 px-4 text-center">500</td>
                    <td className="py-4 px-4 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">3D Visualization</td>
                    <td className="py-4 px-4 text-center">Basic</td>
                    <td className="py-4 px-4 text-center">Advanced</td>
                    <td className="py-4 px-4 text-center">Premium</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">API Access</td>
                    <td className="py-4 px-4 text-center">❌</td>
                    <td className="py-4 px-4 text-center">✅</td>
                    <td className="py-4 px-4 text-center">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Support</td>
                    <td className="py-4 px-4 text-center">Community</td>
                    <td className="py-4 px-4 text-center">Priority</td>
                    <td className="py-4 px-4 text-center">24/7 Dedicated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of researchers already using GeneInsight
          </p>
          <div className="space-x-4">
            <Link href="/login">
              <Button size="lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
