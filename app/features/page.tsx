"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Dna, 
  Brain, 
  Shield, 
  Zap, 
  BarChart3, 
  FileText, 
  Globe, 
  Clock,
  Database,
  Microscope,
  Download,
  Share2
} from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
  const coreFeatures = [
    {
      icon: <Dna className="h-8 w-8" />,
      title: "DNA Sequence Analysis",
      description: "Advanced analysis of genetic sequences with high accuracy",
      features: ["FASTA format support", "Quality scoring", "Variant detection", "Mutation analysis"]
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Insights",
      description: "Machine learning algorithms for intelligent genetic analysis",
      features: ["Disease association", "Pathogenicity prediction", "Pattern recognition", "Risk assessment"]
    },
    {
      icon: <Microscope className="h-8 w-8" />,
      title: "3D Structure Prediction",
      description: "Generate and visualize protein 3D structures",
      features: ["Structure modeling", "Interactive 3D viewer", "PDB export", "Molecular visualization"]
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Comprehensive Reports",
      description: "Detailed analysis reports with actionable insights",
      features: ["PDF generation", "Custom templates", "Data visualization", "Executive summaries"]
    }
  ]

  const additionalFeatures = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Bank-level security with complete data privacy"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Results in seconds, not hours or days"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Cloud-Based",
      description: "Access from anywhere with internet connection"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Availability",
      description: "Always available when you need it"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Data Management",
      description: "Secure storage and organization of all analyses"
    },
    {
      icon: <Share2 className="h-8 w-8" />,
      title: "Collaboration Tools",
      description: "Share results and collaborate with team members"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Discover the comprehensive suite of tools and capabilities that make 
            GeneInsight the leading platform for genetic analysis and research.
          </p>
          <Badge variant="secondary" className="px-6 py-3 text-lg">
            <Zap className="h-5 w-5 mr-2" />
            All Features Included
          </Badge>
        </div>

        {/* Core Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Core Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Additional Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature Comparison */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Feature Comparison</CardTitle>
            <CardDescription>See how GeneInsight compares to traditional methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">Feature</th>
                    <th className="text-center py-4 px-4">Traditional Methods</th>
                    <th className="text-center py-4 px-4">GeneInsight</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Analysis Speed</td>
                    <td className="py-4 px-4 text-center text-red-600">Hours to Days</td>
                    <td className="py-4 px-4 text-center text-green-600">Seconds</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">3D Visualization</td>
                    <td className="py-4 px-4 text-center text-red-600">Limited</td>
                    <td className="py-4 px-4 text-center text-green-600">Interactive 3D</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">AI Integration</td>
                    <td className="py-4 px-4 text-center text-red-600">None</td>
                    <td className="py-4 px-4 text-center text-green-600">Advanced ML</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Report Generation</td>
                    <td className="py-4 px-4 text-center text-red-600">Manual</td>
                    <td className="py-4 px-4 text-center text-green-600">Automated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Experience All Features</h2>
          <p className="text-lg text-gray-600 mb-8">
            Start your free trial today and explore all the powerful features GeneInsight has to offer
          </p>
          <div className="space-x-4">
            <Link href="/login">
              <Button size="lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg">
                <Download className="h-4 w-4 mr-2" />
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
