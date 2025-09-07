"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Users, Zap, Shield, Globe, Heart } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Advanced AI Analysis",
      description: "State-of-the-art machine learning algorithms for genetic analysis"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Enterprise-grade security with complete data privacy protection"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Accessibility",
      description: "Cloud-based platform accessible from anywhere in the world"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Healthcare Focus",
      description: "Designed specifically for medical and research applications"
    }
  ]

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Scientific Officer",
      description: "PhD in Computational Biology, 15+ years in genetic research"
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Head of AI Development",
      description: "Former Google AI researcher, expert in machine learning"
    },
    {
      name: "Dr. Emily Watson",
      role: "Clinical Director",
      description: "MD with specialization in genetic medicine and diagnostics"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About GeneInsight
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            We&apos;re revolutionizing genetic analysis with cutting-edge AI technology, 
            making advanced genomic insights accessible to researchers and healthcare 
            professionals worldwide.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              Award Winning
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              10,000+ Users
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Globe className="h-4 w-4 mr-2" />
              50+ Countries
            </Badge>
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              To democratize genetic analysis by providing powerful, AI-driven tools 
              that enable breakthrough discoveries in medicine, research, and personalized 
              healthcare. We believe that advanced genomic insights should be accessible 
              to every researcher and healthcare professional, regardless of their 
              computational expertise.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose GeneInsight?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="font-semibold text-blue-600">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <Card className="mb-16">
          <CardContent className="py-12">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">1M+</div>
                <div className="text-gray-600">Sequences Analyzed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
                <div className="text-gray-600">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600">Support Available</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">2.3s</div>
                <div className="text-gray-600">Average Analysis Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of researchers and healthcare professionals using GeneInsight
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
