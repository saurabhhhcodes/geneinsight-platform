"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Code, Database, Dna, FileText, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  const docSections = [
    {
      title: "Getting Started",
      description: "Learn the basics of genetic analysis with GeneInsight",
      icon: <Lightbulb className="h-6 w-6" />,
      articles: [
        "Quick Start Guide",
        "Understanding DNA Sequences",
        "Your First Analysis",
        "Interpreting Results"
      ]
    },
    {
      title: "API Documentation",
      description: "Integrate GeneInsight into your applications",
      icon: <Code className="h-6 w-6" />,
      articles: [
        "Authentication",
        "Analysis Endpoints",
        "3D Structure API",
        "Rate Limits"
      ]
    },
    {
      title: "Data Formats",
      description: "Supported file formats and data structures",
      icon: <Database className="h-6 w-6" />,
      articles: [
        "FASTA Files",
        "PDB Format",
        "JSON Responses",
        "Export Options"
      ]
    },
    {
      title: "Scientific Methods",
      description: "Understanding our analysis algorithms",
      icon: <Dna className="h-6 w-6" />,
      articles: [
        "Gene-Disease Association",
        "3D Structure Prediction",
        "Mutation Analysis",
        "Confidence Scoring"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive guides and API documentation for GeneInsight Platform
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Badge variant="secondary" className="px-4 py-2">
            <BookOpen className="h-4 w-4 mr-2" />
            User Guides
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <Code className="h-4 w-4 mr-2" />
            API Reference
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <FileText className="h-4 w-4 mr-2" />
            Tutorials
          </Badge>
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {docSections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {section.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <Link 
                        href="#" 
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {article}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Quick Start</CardTitle>
            <CardDescription>
              Get up and running with GeneInsight in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Upload Sequence</h3>
                <p className="text-sm text-gray-600">
                  Upload your DNA sequence in FASTA format
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Run Analysis</h3>
                <p className="text-sm text-gray-600">
                  Choose analysis type and start processing
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">View Results</h3>
                <p className="text-sm text-gray-600">
                  Explore results and generate reports
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center">
          <Link href="/dashboard">
            <Button size="lg" className="mr-4">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/tutorials">
            <Button variant="outline" size="lg">
              View Tutorials
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
