"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Download,
  Share2,
  Eye,
  BarChart3,
  Dna,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"

export default function AnalysisPage() {
  const params = useParams()
  const analysisId = params.id

  // Mock analysis data
  const analysis = {
    id: analysisId,
    name: `Analysis ${analysisId}`,
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    completedAt: "2024-01-15T10:30:45Z",
    type: "Enhanced DNA Analysis",
    confidence: 87.5,
    sequence: {
      length: 1247,
      gcContent: 42.3,
      composition: {
        A: 312,
        T: 298,
        G: 318,
        C: 319
      }
    },
    results: {
      diseaseAssociation: "Moderate Risk",
      pathogenicity: "Likely Benign",
      variantsFound: 3,
      structurePredicted: true
    },
    processing: {
      sequenceAnalysis: 100,
      diseaseAssociation: 100,
      structurePrediction: 100,
      reportGeneration: 100
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "processing": return "bg-yellow-100 text-yellow-800"
      case "failed": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />
      case "processing": return <Clock className="h-4 w-4" />
      case "failed": return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{analysis.name}</h1>
              <p className="text-gray-600">Analysis ID: {analysis.id}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(analysis.status)}>
                {getStatusIcon(analysis.status)}
                <span className="ml-1 capitalize">{analysis.status}</span>
              </Badge>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
            <Link href="/visualize">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View in 3D
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analysis Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Analysis Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Key Results</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Disease Association:</span>
                        <Badge variant="outline">{analysis.results.diseaseAssociation}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Pathogenicity:</span>
                        <Badge variant="outline">{analysis.results.pathogenicity}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Variants Found:</span>
                        <span className="font-medium">{analysis.results.variantsFound}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence Score:</span>
                        <span className="font-medium">{analysis.confidence}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Processing Status</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Sequence Analysis</span>
                          <span>{analysis.processing.sequenceAnalysis}%</span>
                        </div>
                        <Progress value={analysis.processing.sequenceAnalysis} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Disease Association</span>
                          <span>{analysis.processing.diseaseAssociation}%</span>
                        </div>
                        <Progress value={analysis.processing.diseaseAssociation} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Structure Prediction</span>
                          <span>{analysis.processing.structurePrediction}%</span>
                        </div>
                        <Progress value={analysis.processing.structurePrediction} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sequence Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Dna className="h-5 w-5" />
                  <span>Sequence Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Basic Properties</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Length:</span>
                        <span className="font-medium">{analysis.sequence.length} bp</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GC Content:</span>
                        <span className="font-medium">{analysis.sequence.gcContent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Analysis Type:</span>
                        <span className="font-medium">{analysis.type}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Base Composition</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Adenine (A):</span>
                        <span className="font-medium">{analysis.sequence.composition.A}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thymine (T):</span>
                        <span className="font-medium">{analysis.sequence.composition.T}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Guanine (G):</span>
                        <span className="font-medium">{analysis.sequence.composition.G}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cytosine (C):</span>
                        <span className="font-medium">{analysis.sequence.composition.C}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analysis Results</CardTitle>
                <CardDescription>
                  Comprehensive findings from your genetic sequence analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Disease Association Analysis</h3>
                    <p className="text-gray-700 text-sm">
                      Based on our AI analysis, this sequence shows moderate risk associations
                      with certain genetic conditions. The confidence score of {analysis.confidence}%
                      indicates reliable predictions.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Variant Analysis</h3>
                    <p className="text-gray-700 text-sm">
                      {analysis.results.variantsFound} genetic variants were identified in this sequence.
                      Most variants appear to be benign based on current scientific knowledge.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">3D Structure Prediction</h3>
                    <p className="text-gray-700 text-sm">
                      {analysis.results.structurePredicted ?
                        "3D protein structure has been successfully predicted and is available for visualization." :
                        "3D structure prediction is not available for this sequence type."
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analysis Info */}
            <Card>
              <CardHeader>
                <CardTitle>Analysis Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Created:</span>
                  <p className="font-medium">
                    {new Date(analysis.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Completed:</span>
                  <p className="font-medium">
                    {new Date(analysis.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Processing Time:</span>
                  <p className="font-medium">45 seconds</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Analysis ID:</span>
                  <p className="font-mono text-sm">{analysis.id}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                <Link href="/visualize" className="block">
                  <Button className="w-full" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    3D Visualization
                  </Button>
                </Link>
                <Button className="w-full" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Analysis
                </Button>
              </CardContent>
            </Card>

            {/* Related Analyses */}
            <Card>
              <CardHeader>
                <CardTitle>Related Analyses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">BRCA1 Analysis</p>
                    <p className="text-xs text-gray-600">Similar sequence pattern</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">TP53 Study</p>
                    <p className="text-xs text-gray-600">Related gene family</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Related
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}