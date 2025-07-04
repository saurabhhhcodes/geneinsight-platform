"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dna,
  Brain,
  Eye,
  Database,
  Zap,
  Play,
  ArrowRight,
  CheckCircle,
  Microscope,
  BarChart3,
  Cpu,
  Globe,
  Download,
  Upload,
  Settings,
  Users,
  Shield
} from "lucide-react"

// Sample data for demonstrations
const sampleSequences = [
  {
    id: 1,
    name: "BRCA1 Gene Fragment",
    sequence: "ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAAATCTTAGAGTGTCCCATCTGTCTGGAGTTGATCAAGGAACCTGTCTCCACAAAGTGTGACCACATATTTTGCAAATTTTGCATGCTGAAACTTCTCAACCAGAAGAAAGGGCCTTCACAGTGTCCTTTATGTAAGAATGAT",
    type: "Tumor Suppressor",
    description: "Breast cancer susceptibility gene fragment",
    gcContent: 42.5,
    length: 180
  },
  {
    id: 2,
    name: "p53 Regulatory Region",
    sequence: "TATAAAAGGGGCGCGCCCTCGAGGTCGACGGTATCGATAAGCTTGATATCGAATTCCTGCAGCCCGGGGGATCCACTAGTTCTAGAGCGGCCGCCACCGCGGTGGAGCTCCAGCTTTTGTTCCCTTTAGTGAGGGTTAATTGCGCGCTTGGCGTAATCATGGTCATAGCTGTTTCCTGTGTGAAATTGTTATCCGCTCACAATTCCACACAACATACGAGCCGGAAGCATAAAGTGTAAAGCCTGGGGTGCCTAATGAGTGAGCTAACTCACATTAATTGCGTTGCGCTCACTGCCCGCTTTCCAGTCGGGAAACCTGTCGTGCCAGCTGCATTAATGAATCGGCCAACGCGCGGGGAGAGGCGGTTTGCGTATTGGGCGCTCTTCCGCTTCCTCGCTCACTGACTCGCTGCGCTCGGTCGTTCGGCTGCGGCGAGCGGTATCAGCTCACTCAAAGGCGGTAATACGGTTATCCACAGAATCAGGGGATAACGCAGGAAAGAACATGTGAGCAAAAGGCCAGCAAAAGGCCAGGAACCGTAAAAAGGCCGCGTTGCTGGCGTTTTTCCATAGGCTCCGCCCCCCTGACGAGCATCACAAAAATCGACGCTCAAGTCAGAGGTGGCGAAACCCGACAGGACTATAAAGATACCAGGCGTTTCCCCCTGGAAGCTCCCTCGTGCGCTCTCCTGTTCCGACCCTGCCGCTTACCGGATACCTGTCCGCCTTTCTCCCTTCGGGAAGCGTGGCGCTTTCTCATAGCTCACGCTGTAGGTATCTCAGTTCGGTGTAGGTCGTTCGCTCCAAGCTGGGCTGTGTGCACGAACCCCCCGTTCAGCCCGACCGCTGCGCCTTATCCGGTAACTATCGTCTTGAGTCCAACCCGGTAAGACACGACTTATCGCCACTGGCAGCAGCCACTGGTAACAGGATTAGCAGAGCGAGGTATGTAGGCGGTGCTACAGAGTTCTTGAAGTGGTGGCCTAACTACGGCTACACTAGAAGGACAGTATTTGGTATCTGCGCTCTGCTGAAGCCAGTTACCTTCGGAAAAAGAGTTGGTAGCTCTTGATCCGGCAAACAAACCACCGCTGGTAGCGGTGGTTTTTTTGTTTGCAAGCAGCAGATTACGCGCAGAAAAAAAGGATCTCAAGAAGATCCTTTGATCTTTTCTACGGGGTCTGACGCTCAGTGGAACGAAAACTCACGTTAAGGGATTTTGGTCATGAGATTATCAAAAAGGATCTTCACCTAGATCCTTTTAAATTAAAAATGAAGTTTTAAATCAATCTAAAGTATATATGAGTAAACTTGGTCTGACAGTTACCAATGCTTAATCAGTGAGGCACCTATCTCAGCGATCTGTCTATTTCGTTCATCCATAGTTGCCTGACTCCCCGTCGTGTAGATAACTACGATACGGGAGGGCTTACCATCTGGCCCCAGTGCTGCAATGATACCGCGAGACCCACGCTCACCGGCTCCAGATTTATCAGCAATAAACCAGCCAGCCGGAAGGGCCGAGCGCAGAAGTGGTCCTGCAACTTTATCCGCCTCCATCCAGTCTATTAATTGTTGCCGGGAAGCTAGAGTAAGTAGTTCGCCAGTTAATAGTTTGCGCAACGTTGTTGCCATTGCTACAGGCATCGTGGTGTCACGCTCGTCGTTTGGTATGGCTTCATTCAGCTCCGGTTCCCAACGATCAAGGCGAGTTACATGATCCCCCATGTTGTGCAAAAAAGCGGTTAGCTCCTTCGGTCCTCCGATCGTTGTCAGAAGTAAGTTGGCCGCAGTGTTATCACTCATGGTTATGGCAGCACTGCATAATTCTCTTACTGTCATGCCATCCGTAAGATGCTTTTCTGTGACTGGTGAGTACTCAACCAAGTCATTCTGAGAATAGTGTATGCGGCGACCGAGTTGCTCTTGCCCGGCGTCAATACGGGATAATACCGCGCCACATAGCAGAACTTTAAAAGTGCTCATCATTGGAAAACGTTCTTCGGGGCGAAAACTCTCAAGGATCTTACCGCTGTTGAGATCCAGTTCGATGTAACCCACTCGTGCACCCAACTGATCTTCAGCATCTTTTACTTTCACCAGCGTTTCTGGGTGAGCAAAAACAGGAAGGCAAAATGCCGCAAAAAAGGGAATAAGGGCGACACGGAAATGTTGAATACTCATACTCTTCCTTTTTCAATATTATTGAAGCATTTATCAGGGTTATTGTCTCATGAGCGGATACATATTTGAATGTATTTAGAAAAATAAACAAATAGGGGTTCCGCGCACATTTCCCCGAAAAGTGCCACCTGACGTCTAAGAAACCATTATTATCATGACATTAACCTATAAAAATAGGCGTATCACGAGGCCCTTTCGTCTCGCGCGTTTCGGTGATGACGGTGAAAACCTCTGACACATGCAGCTCCCGGAGACGGTCACAGCTTGTCTGTAAGCGGATGCCGGGAGCAGACAAGCCCGTCAGGGCGCGTCAGCGGGTGTTGGCGGGTGTCGGGGCTGGCTTAACTATGCGGCATCAGAGCAGATTGTACTGAGAGTGCACCATATGCGGTGTGAAATACCGCACAGATGCGTAAGGAGAAAATACCGCATCAGGCGCCATTCGCCATTCAGGCTGCGCAACTGTTGGGAAGGGCGATCGGTGCGGGCCTCTTCGCTATTACGCCAGCTGGCGAAAGGGGGATGTGCTGCAAGGCGATTAAGTTGGGTAACGCCAGGGTTTTCCCAGTCACGACGTTGTAAAACGACGGCCAGTGAATTGTAATACGACTCACTATAGGGCGAATTGGAGCTCCACCGCGGTGGCGGCCGCTCTAGAACTAGTGGATCCCCCGGGCTGCAGGAATTCGATATCAAGCTTATCGATACCGTCGACCTCGAGGGGGCGCGCCCTTTATATAA",
    type: "Regulatory",
    description: "p53 tumor suppressor regulatory sequence",
    gcContent: 48.2,
    length: 2847
  },
  {
    id: 3,
    name: "Insulin Gene",
    sequence: "ATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGGGGACCTGACCCAGCCGCAGCCTTTGTGAACCAACACCTGTGCGGCTCACACCTGGTGGAAGCTCTCTACCTAGTGTGCGGGGAACGAGGCTTCTTCTACACACCCAAGACCCGCCGGGAGGCAGAGGACCTGCAGGTGGGGCAGGTGGAGCTGGGCGGGGGCCCTGGTGCAGGCAGCCTGCAGCCCTTGGCCCTGGAGGGGTCCCTGCAGAAGCGTGGCATTGTGGAACAATGCTGTACCAGCATCTGCTCCCTCTACCAGCTGGAGAACTACTGCAACTAGACGCAGCCCGCAGGCAGCCCCACACCCGCCGCCTCCTGCACCGAGAGAGATGGAATAAAGCCCTTGAACCAGC",
    type: "Hormone",
    description: "Human insulin gene sequence",
    gcContent: 58.7,
    length: 333
  }
]

const molecularStructures = [
  {
    id: "1BNA",
    name: "DNA Double Helix",
    type: "DNA",
    description: "Classic B-form DNA structure",
    organism: "Synthetic",
    resolution: "1.9 Å"
  },
  {
    id: "1HHO",
    name: "Hemoglobin",
    type: "Protein",
    description: "Oxygen-carrying protein",
    organism: "Human",
    resolution: "1.74 Å"
  },
  {
    id: "1LYZ",
    name: "Lysozyme",
    type: "Enzyme",
    description: "Antimicrobial enzyme",
    organism: "Chicken",
    resolution: "1.33 Å"
  }
]

export default function DemoPage() {
  const [currentDemo, setCurrentDemo] = useState("overview")
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedSequence, setSelectedSequence] = useState(sampleSequences[0])
  const [selectedStructure, setSelectedStructure] = useState(molecularStructures[0])

  // Simulate analysis progress
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            setIsAnalyzing(false)
            return 100
          }
          return prev + 10
        })
      }, 300)
      return () => clearInterval(interval)
    }
  }, [isAnalyzing])

  const startAnalysisDemo = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Dna className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">GeneInsight Demo</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link href="/analyze">
              <Button>Try Analysis</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            🧬 Interactive Platform Demo
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Experience GeneInsight
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}in Action
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore our AI-powered genomics platform through interactive demonstrations.
            See how researchers and clinicians use GeneInsight for DNA analysis, disease prediction,
            and molecular visualization.
          </p>
        </div>

        {/* Demo Navigation */}
        <Tabs value={currentDemo} onValueChange={setCurrentDemo} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="visualization">3D Viewer</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <Brain className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle>AI-Powered Analysis</CardTitle>
                  <CardDescription>
                    Advanced machine learning models for gene-disease association prediction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Deep learning classification</li>
                    <li>• 95%+ accuracy on test datasets</li>
                    <li>• Real-time sequence analysis</li>
                    <li>• Confidence scoring</li>
                  </ul>
                  <Link href="/analyze">
                    <Button className="w-full mt-4" variant="outline">
                      Try Analysis <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-purple-200 transition-colors">
                <CardHeader>
                  <Eye className="h-12 w-12 text-purple-600 mb-4" />
                  <CardTitle>3D Molecular Visualization</CardTitle>
                  <CardDescription>
                    Interactive 3D rendering of DNA structures and proteins
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Real-time 3D manipulation</li>
                    <li>• PDB structure support</li>
                    <li>• Multiple visualization styles</li>
                    <li>• Export capabilities</li>
                  </ul>
                  <Link href="/visualize">
                    <Button className="w-full mt-4" variant="outline">
                      View 3D Structures <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-green-200 transition-colors">
                <CardHeader>
                  <Database className="h-12 w-12 text-green-600 mb-4" />
                  <CardTitle>Comprehensive Database</CardTitle>
                  <CardDescription>
                    Extensive genomic data storage and retrieval system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Sequence history tracking</li>
                    <li>• Analysis result storage</li>
                    <li>• Batch processing support</li>
                    <li>• Export and reporting</li>
                  </ul>
                  <Link href="/history">
                    <Button className="w-full mt-4" variant="outline">
                      View History <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Platform Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
                  Platform Statistics
                </CardTitle>
                <CardDescription>
                  Real-time metrics from the GeneInsight platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">10,000+</div>
                    <div className="text-sm text-gray-600">Sequences Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">95.7%</div>
                    <div className="text-sm text-gray-600">Prediction Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">500+</div>
                    <div className="text-sm text-gray-600">3D Structures</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">24/7</div>
                    <div className="text-sm text-gray-600">System Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Demo Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Microscope className="h-6 w-6 text-blue-600 mr-2" />
                  Interactive Analysis Demo
                </CardTitle>
                <CardDescription>
                  Experience our AI-powered sequence analysis with real sample data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sample Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Choose a Sample Sequence</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {sampleSequences.map((seq) => (
                      <Card
                        key={seq.id}
                        className={`cursor-pointer transition-colors ${
                          selectedSequence.id === seq.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedSequence(seq)}
                      >
                        <CardContent className="p-4">
                          <div className="font-semibold text-sm">{seq.name}</div>
                          <div className="text-xs text-gray-600 mt-1">{seq.description}</div>
                          <div className="flex justify-between mt-2 text-xs">
                            <span>Type: {seq.type}</span>
                            <span>{seq.length} bp</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Selected Sequence Details */}
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Selected: {selectedSequence.name}</h4>
                    <div className="text-sm text-gray-600 mb-3">{selectedSequence.description}</div>
                    <div className="bg-white p-3 rounded border font-mono text-xs break-all">
                      {selectedSequence.sequence.substring(0, 200)}
                      {selectedSequence.sequence.length > 200 && "..."}
                    </div>
                    <div className="flex justify-between mt-3 text-sm">
                      <span>Length: {selectedSequence.length} bp</span>
                      <span>GC Content: {selectedSequence.gcContent}%</span>
                      <span>Type: {selectedSequence.type}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Controls */}
                <div className="flex justify-center">
                  <Button
                    onClick={startAnalysisDemo}
                    disabled={isAnalyzing}
                    size="lg"
                    className="px-8"
                  >
                    {isAnalyzing ? (
                      <>
                        <Cpu className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start Analysis Demo
                      </>
                    )}
                  </Button>
                </div>

                {/* Progress and Results */}
                {(isAnalyzing || analysisProgress > 0) && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Analysis Progress</span>
                            <span>{analysisProgress}%</span>
                          </div>
                          <Progress value={analysisProgress} className="h-2" />
                        </div>

                        {analysisProgress === 100 && (
                          <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-5 w-5 mr-2" />
                              <span className="font-semibold">Analysis Complete!</span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h4 className="font-semibold">Sequence Analysis</h4>
                                <div className="text-sm space-y-1">
                                  <div>Length: {selectedSequence.length} base pairs</div>
                                  <div>GC Content: {selectedSequence.gcContent}%</div>
                                  <div>Predicted Type: {selectedSequence.type}</div>
                                  <div>Confidence: 94.2%</div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-semibold">Disease Association</h4>
                                <div className="text-sm space-y-1">
                                  <div>Risk Level: {selectedSequence.type === 'Tumor Suppressor' ? 'High' : 'Low'}</div>
                                  <div>Associated Conditions: {selectedSequence.type === 'Tumor Suppressor' ? 'Breast Cancer' : 'None detected'}</div>
                                  <div>Recommendation: {selectedSequence.type === 'Tumor Suppressor' ? 'Further screening advised' : 'Normal monitoring'}</div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                              <Link href="/analyze">
                                <Button variant="outline" size="sm">
                                  Try Real Analysis
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm" onClick={() => setAnalysisProgress(0)}>
                                Reset Demo
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 3D Visualization Demo Tab */}
          <TabsContent value="visualization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-6 w-6 text-purple-600 mr-2" />
                  3D Molecular Visualization Demo
                </CardTitle>
                <CardDescription>
                  Explore interactive 3D molecular structures with our advanced visualization engine
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Structure Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Choose a Molecular Structure</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {molecularStructures.map((structure) => (
                      <Card
                        key={structure.id}
                        className={`cursor-pointer transition-colors ${
                          selectedStructure.id === structure.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedStructure(structure)}
                      >
                        <CardContent className="p-4">
                          <div className="font-semibold text-sm">{structure.name}</div>
                          <div className="text-xs text-gray-600 mt-1">{structure.description}</div>
                          <div className="flex justify-between mt-2 text-xs">
                            <span>PDB: {structure.id}</span>
                            <span>{structure.resolution}</span>
                          </div>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {structure.type}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Structure Preview */}
                <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                        <Dna className="h-16 w-16 text-white animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{selectedStructure.name}</h3>
                        <p className="text-gray-600">{selectedStructure.description}</p>
                        <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
                          <span>PDB ID: {selectedStructure.id}</span>
                          <span>Resolution: {selectedStructure.resolution}</span>
                          <span>Organism: {selectedStructure.organism}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          This is a preview of the 3D molecular visualization.
                          Click below to experience the full interactive 3D viewer.
                        </p>
                        <Link href="/visualize">
                          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600">
                            <Eye className="mr-2 h-4 w-4" />
                            Launch 3D Viewer
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Visualization Features */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Interactive Controls</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Mouse drag to rotate structures
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Scroll wheel to zoom in/out
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Multiple visualization styles
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Color scheme customization
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Export high-quality images
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Supported Formats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Database className="h-4 w-4 text-blue-500 mr-2" />
                          PDB files from RCSB database
                        </li>
                        <li className="flex items-center">
                          <Globe className="h-4 w-4 text-blue-500 mr-2" />
                          AlphaFold predicted structures
                        </li>
                        <li className="flex items-center">
                          <Upload className="h-4 w-4 text-blue-500 mr-2" />
                          Custom PDB file uploads
                        </li>
                        <li className="flex items-center">
                          <Download className="h-4 w-4 text-blue-500 mr-2" />
                          Direct URL imports
                        </li>
                        <li className="flex items-center">
                          <Settings className="h-4 w-4 text-blue-500 mr-2" />
                          Real-time structure analysis
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow Demo Tab */}
          <TabsContent value="workflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-6 w-6 text-orange-600 mr-2" />
                  Complete Analysis Workflow
                </CardTitle>
                <CardDescription>
                  See how researchers use GeneInsight from sequence input to final results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Workflow Steps */}
                  <div className="grid gap-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">1</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">Data Input</h3>
                        <p className="text-gray-600 mb-3">
                          Upload DNA sequences through multiple channels: direct input, file upload, or database import.
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="outline">FASTA Files</Badge>
                          <Badge variant="outline">Direct Input</Badge>
                          <Badge variant="outline">Batch Upload</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">2</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">AI Analysis</h3>
                        <p className="text-gray-600 mb-3">
                          Advanced machine learning models analyze sequence patterns, predict gene functions, and assess disease associations.
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="outline">Deep Learning</Badge>
                          <Badge variant="outline">Pattern Recognition</Badge>
                          <Badge variant="outline">Risk Assessment</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">3</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">3D Visualization</h3>
                        <p className="text-gray-600 mb-3">
                          Generate interactive 3D molecular structures for visual analysis and presentation.
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="outline">3D Rendering</Badge>
                          <Badge variant="outline">Interactive Controls</Badge>
                          <Badge variant="outline">Export Options</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold text-sm">4</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">Results & Reports</h3>
                        <p className="text-gray-600 mb-3">
                          Comprehensive analysis reports with actionable insights, confidence scores, and recommendations.
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="outline">PDF Reports</Badge>
                          <Badge variant="outline">Data Export</Badge>
                          <Badge variant="outline">Clinical Insights</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-200">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-bold mb-2">Ready to Try the Complete Workflow?</h3>
                      <p className="text-gray-600 mb-4">
                        Experience the full power of GeneInsight with your own data
                      </p>
                      <div className="flex justify-center gap-4">
                        <Link href="/analyze">
                          <Button size="lg">
                            Start Analysis
                          </Button>
                        </Link>
                        <Link href="/dashboard">
                          <Button variant="outline" size="lg">
                            View Dashboard
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <Brain className="h-10 w-10 text-blue-600 mb-3" />
                  <CardTitle className="text-lg">Advanced AI Models</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Deep neural networks for sequence analysis</li>
                    <li>• Ensemble learning for improved accuracy</li>
                    <li>• Continuous model updates and training</li>
                    <li>• Explainable AI for transparent results</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-purple-200 transition-colors">
                <CardHeader>
                  <Eye className="h-10 w-10 text-purple-600 mb-3" />
                  <CardTitle className="text-lg">3D Visualization Engine</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• WebGL-powered 3D rendering</li>
                    <li>• Real-time molecular manipulation</li>
                    <li>• Multiple visualization styles</li>
                    <li>• High-resolution image export</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-green-200 transition-colors">
                <CardHeader>
                  <Database className="h-10 w-10 text-green-600 mb-3" />
                  <CardTitle className="text-lg">Scalable Infrastructure</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Cloud-native architecture</li>
                    <li>• Auto-scaling compute resources</li>
                    <li>• High-availability database systems</li>
                    <li>• Enterprise-grade security</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-orange-200 transition-colors">
                <CardHeader>
                  <Zap className="h-10 w-10 text-orange-600 mb-3" />
                  <CardTitle className="text-lg">Real-time Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Sub-second analysis response times</li>
                    <li>• Streaming data processing</li>
                    <li>• Live progress tracking</li>
                    <li>• Instant result visualization</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-red-200 transition-colors">
                <CardHeader>
                  <Shield className="h-10 w-10 text-red-600 mb-3" />
                  <CardTitle className="text-lg">Security & Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• HIPAA-compliant data handling</li>
                    <li>• End-to-end encryption</li>
                    <li>• Role-based access control</li>
                    <li>• Audit trail logging</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-indigo-200 transition-colors">
                <CardHeader>
                  <Users className="h-10 w-10 text-indigo-600 mb-3" />
                  <CardTitle className="text-lg">Collaboration Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Team workspace management</li>
                    <li>• Shared analysis projects</li>
                    <li>• Real-time collaboration</li>
                    <li>• Version control for sequences</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Technical Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-6 w-6 text-gray-600 mr-2" />
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-3">Performance Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Analysis Speed:</span>
                        <span className="font-mono">~0.5s per sequence</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prediction Accuracy:</span>
                        <span className="font-mono">95.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Concurrent Users:</span>
                        <span className="font-mono">1000+</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Throughput:</span>
                        <span className="font-mono">10GB/hour</span>
                      </div>
                      <div className="flex justify-between">
                        <span>System Uptime:</span>
                        <span className="font-mono">99.9%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Supported Formats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sequence Formats:</span>
                        <span>FASTA, GenBank, EMBL</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Structure Formats:</span>
                        <span>PDB, mmCIF, SDF</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Export Formats:</span>
                        <span>PDF, CSV, JSON, XML</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Image Formats:</span>
                        <span>PNG, JPG, SVG, TIFF</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API Integration:</span>
                        <span>REST, GraphQL, WebSocket</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Getting Started */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Join thousands of researchers and clinicians who trust GeneInsight
                  for their genomic analysis and molecular visualization needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button size="lg" variant="secondary">
                      Create Free Account
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                      Explore Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Dna className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">GeneInsight Platform</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
              <Link href="/analyze" className="hover:text-blue-600">Analysis</Link>
              <Link href="/visualize" className="hover:text-blue-600">Visualization</Link>
              <Link href="/history" className="hover:text-blue-600">History</Link>
            </div>
          </div>
          <div className="border-t mt-6 pt-6 text-center text-sm text-gray-500">
            <p>&copy; 2024 GeneInsight Platform. Advanced genomic analysis and molecular visualization.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}