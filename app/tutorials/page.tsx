"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Clock, Users, BookOpen, Video, FileText, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function TutorialsPage() {
  const tutorials = [
    {
      title: "Getting Started with GeneInsight",
      description: "Learn the basics of genetic analysis and how to navigate the platform",
      duration: "15 min",
      level: "Beginner",
      type: "Video",
      icon: <Play className="h-5 w-5" />,
      topics: ["Platform overview", "Account setup", "First analysis", "Understanding results"]
    },
    {
      title: "DNA Sequence Analysis Deep Dive",
      description: "Comprehensive guide to analyzing DNA sequences and interpreting results",
      duration: "30 min",
      level: "Intermediate",
      type: "Interactive",
      icon: <BookOpen className="h-5 w-5" />,
      topics: ["FASTA format", "Quality control", "Variant calling", "Annotation"]
    },
    {
      title: "3D Structure Prediction and Visualization",
      description: "Master the art of protein structure prediction and 3D visualization",
      duration: "25 min",
      level: "Intermediate",
      type: "Video",
      icon: <Video className="h-5 w-5" />,
      topics: ["Structure prediction", "3D viewer", "PDB export", "Molecular analysis"]
    },
    {
      title: "Advanced AI Analysis Features",
      description: "Explore machine learning capabilities for disease association",
      duration: "40 min",
      level: "Advanced",
      type: "Workshop",
      icon: <Lightbulb className="h-5 w-5" />,
      topics: ["AI models", "Disease prediction", "Risk assessment", "Clinical interpretation"]
    },
    {
      title: "Report Generation and Export",
      description: "Create professional reports and export data in various formats",
      duration: "20 min",
      level: "Beginner",
      type: "Guide",
      icon: <FileText className="h-5 w-5" />,
      topics: ["Report templates", "Custom formatting", "PDF export", "Data sharing"]
    },
    {
      title: "API Integration and Automation",
      description: "Integrate GeneInsight into your existing workflows using our API",
      duration: "45 min",
      level: "Advanced",
      type: "Technical",
      icon: <BookOpen className="h-5 w-5" />,
      topics: ["API authentication", "Endpoints", "Batch processing", "Webhooks"]
    }
  ]

  const quickStart = [
    {
      step: 1,
      title: "Create Account",
      description: "Sign up for your free GeneInsight account"
    },
    {
      step: 2,
      title: "Upload Sequence",
      description: "Upload your first DNA sequence file"
    },
    {
      step: 3,
      title: "Run Analysis",
      description: "Start your genetic analysis with one click"
    },
    {
      step: 4,
      title: "View Results",
      description: "Explore results and generate reports"
    }
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800"
      case "Intermediate": return "bg-yellow-100 text-yellow-800"
      case "Advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Video": return "bg-blue-100 text-blue-800"
      case "Interactive": return "bg-purple-100 text-purple-800"
      case "Workshop": return "bg-orange-100 text-orange-800"
      case "Guide": return "bg-teal-100 text-teal-800"
      case "Technical": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Learn GeneInsight
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Master genetic analysis with our comprehensive tutorials, guides, and workshops. 
            From beginner basics to advanced techniques, we've got you covered.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              50,000+ Students
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              Self-Paced Learning
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <BookOpen className="h-4 w-4 mr-2" />
              Free Access
            </Badge>
          </div>
        </div>

        {/* Quick Start Guide */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Quick Start Guide</CardTitle>
            <CardDescription>Get up and running in just 4 simple steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {quickStart.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/login">
                <Button size="lg">
                  Start Learning Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tutorials Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Tutorials</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutorials.map((tutorial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {tutorial.icon}
                      <Badge className={getTypeColor(tutorial.type)}>
                        {tutorial.type}
                      </Badge>
                    </div>
                    <Badge className={getLevelColor(tutorial.level)}>
                      {tutorial.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                  <CardDescription>{tutorial.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{tutorial.duration}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">What you'll learn:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {tutorial.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Start Tutorial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Paths */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Learning Paths</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Beginner Path</CardTitle>
                <CardDescription>Perfect for those new to genetic analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-left space-y-2 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Platform Introduction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Basic Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Report Generation</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Start Path
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle>Researcher Path</CardTitle>
                <CardDescription>Advanced techniques for research professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-left space-y-2 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Advanced Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">3D Visualization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">AI Integration</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Start Path
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle>Developer Path</CardTitle>
                <CardDescription>API integration and automation techniques</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-left space-y-2 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">API Basics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Automation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Integration</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Start Path
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our community of learners and master genetic analysis today
          </p>
          <div className="space-x-4">
            <Link href="/login">
              <Button size="lg">
                Access All Tutorials
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
