"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  MessageCircle, 
  Book, 
  Video, 
  Mail, 
  Phone, 
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Lightbulb
} from "lucide-react"
import Link from "next/link"

export default function SupportPage() {
  const supportOptions = [
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "Mon-Fri, 9 AM - 6 PM EST",
      action: "Start Chat",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "24/7 - Response within 4 hours",
      action: "Send Email",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Phone Support",
      description: "Speak directly with our experts",
      availability: "Mon-Fri, 9 AM - 6 PM EST",
      action: "Call Now",
      color: "bg-purple-100 text-purple-600"
    }
  ]

  const faqs = [
    {
      category: "Getting Started",
      icon: <Lightbulb className="h-5 w-5" />,
      questions: [
        {
          q: "How do I upload my first DNA sequence?",
          a: "Go to the Analysis page, click 'Upload Sequence', and select your FASTA file. Our system supports various formats including .fasta, .fa, and .txt files."
        },
        {
          q: "What file formats are supported?",
          a: "We support FASTA (.fasta, .fa), plain text (.txt), and PDB (.pdb) formats. Files should be under 10MB for optimal processing."
        },
        {
          q: "How long does analysis take?",
          a: "Most analyses complete within 2-5 seconds. Complex 3D structure predictions may take up to 30 seconds."
        }
      ]
    },
    {
      category: "Analysis & Results",
      icon: <CheckCircle className="h-5 w-5" />,
      questions: [
        {
          q: "How accurate are the disease predictions?",
          a: "Our AI models achieve 85-95% accuracy depending on the gene and condition. Confidence scores are provided with each prediction."
        },
        {
          q: "Can I export my results?",
          a: "Yes, you can export results as PDF reports, CSV data files, or PDB files for 3D structures."
        },
        {
          q: "How do I interpret confidence scores?",
          a: "Scores above 80% are considered high confidence, 60-80% moderate, and below 60% low confidence. Always consult with medical professionals for clinical decisions."
        }
      ]
    },
    {
      category: "Technical Issues",
      icon: <AlertCircle className="h-5 w-5" />,
      questions: [
        {
          q: "Why is my 3D viewer showing a black screen?",
          a: "This usually indicates a browser compatibility issue. Try refreshing the page, clearing your browser cache, or using a different browser like Chrome or Firefox."
        },
        {
          q: "My analysis is stuck in 'Processing' status",
          a: "If an analysis takes longer than 5 minutes, try refreshing the page. If the issue persists, contact support with your analysis ID."
        },
        {
          q: "I'm getting upload errors",
          a: "Check that your file is under 10MB and in a supported format. Ensure your internet connection is stable during upload."
        }
      ]
    }
  ]

  const resources = [
    {
      icon: <Book className="h-6 w-6" />,
      title: "Documentation",
      description: "Comprehensive guides and API reference",
      link: "/docs"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      link: "/tutorials"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Community Forum",
      description: "Connect with other researchers",
      link: "#"
    },
    {
      icon: <HelpCircle className="h-6 w-6" />,
      title: "Knowledge Base",
      description: "Searchable help articles",
      link: "#"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Support Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get help when you need it. Our support team and comprehensive resources 
            are here to ensure your success with GeneInsight.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              24/7 Email Support
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <MessageCircle className="h-4 w-4 mr-2" />
              Live Chat Available
            </Badge>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-16">
          <CardContent className="py-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for help articles, tutorials, or common issues..."
                  className="pl-10 py-3 text-lg"
                />
              </div>
              <p className="text-center text-gray-600 mt-4">
                Popular searches: "upload sequence", "3D viewer", "export results", "API documentation"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Get Help Now</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`mx-auto p-4 rounded-full w-fit mb-4 ${option.color}`}>
                    {option.icon}
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{option.availability}</p>
                  <Button className="w-full">
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {category.icon}
                    </div>
                    <CardTitle className="text-xl">{category.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {category.questions.map((faq, faqIndex) => (
                      <div key={faqIndex}>
                        <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                        <p className="text-gray-700">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Help Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit mb-4">
                    {resource.icon}
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <Link href={resource.link}>
                    <Button variant="outline" className="w-full">
                      Explore
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Status */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">System Status</CardTitle>
            <CardDescription>Current status of GeneInsight services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Analysis Engine</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Operational</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">3D Visualization</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Operational</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">API Services</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Operational</Badge>
              </div>
            </div>
            <div className="text-center mt-6">
              <Button variant="outline">
                View Full Status Page
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Our support team is ready to assist you with any questions or issues
          </p>
          <div className="space-x-4">
            <Link href="/contact">
              <Button size="lg">
                Contact Support
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
