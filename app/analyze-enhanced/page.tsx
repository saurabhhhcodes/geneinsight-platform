"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Dna, BarChart3, FileText, Loader2, AlertCircle, CheckCircle, Atom, Zap, Eye, Download } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EnhancedAnalyzePage() {
  const [sequence, setSequence] = useState("")
  const [include3D, setInclude3D] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState("")

  // Export functions
  const downloadJSON = () => {
    if (!results) return

    const dataStr = JSON.stringify(results, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = `geneinsight-analysis-${Date.now()}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const generatePDFReport = () => {
    if (!results) return

    // Create a comprehensive report
    const reportContent = `
GeneInsight Analysis Report
Generated: ${new Date().toLocaleString()}

SEQUENCE INFORMATION:
Length: ${results.basicAnalysis?.length || 'N/A'} bp
GC Content: ${results.basicAnalysis?.gcContent?.toFixed(2) || 'N/A'}%
AT Content: ${results.basicAnalysis?.atContent?.toFixed(2) || 'N/A'}%

${results.structure3D?.success ? `
3D STRUCTURE ANALYSIS:
Confidence: ${results.structure3D.confidence || 'N/A'}
Method: ${results.structure3D.method || 'N/A'}
Protein Length: ${results.structure3D.length || 'N/A'} amino acids
Structure ID: ${results.structure3D.structureId || 'N/A'}

SECONDARY STRUCTURE:
Alpha Helix: ${results.structure3D.secondaryStructure?.alphaHelix?.toFixed(1) || 'N/A'}%
Beta Sheet: ${results.structure3D.secondaryStructure?.betaSheet?.toFixed(1) || 'N/A'}%
Loop: ${results.structure3D.secondaryStructure?.loop?.toFixed(1) || 'N/A'}%

MOLECULAR PROPERTIES:
Molecular Weight: ${results.structure3D.molecularProperties?.molecularWeight?.toFixed(2) || 'N/A'} Da
Isoelectric Point: ${results.structure3D.molecularProperties?.isoelectricPoint?.toFixed(2) || 'N/A'}
Hydrophobicity: ${results.structure3D.molecularProperties?.hydrophobicity?.toFixed(2) || 'N/A'}
` : '3D Structure analysis not performed.'}

ORIGINAL SEQUENCE:
${sequence}
    `.trim()

    // Create and download PDF-like text file (for now)
    const dataStr = reportContent
    const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = `geneinsight-report-${Date.now()}.txt`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const exportFASTA = () => {
    if (!sequence) return

    const fastaContent = `>GeneInsight_Analysis_${Date.now()}
${sequence}`

    const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(fastaContent)
    const exportFileDefaultName = `sequence-${Date.now()}.fasta`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const openIn3DVisualizer = () => {
    if (!results?.structure3D?.success) {
      alert('3D structure data not available. Please run analysis with 3D structure generation enabled.')
      return
    }

    // Create a new window with 3D structure data
    const structureWindow = window.open('', '_blank', 'width=800,height=600')
    if (structureWindow) {
      structureWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>3D Protein Structure - ${results.structure3D.structureId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 20px; }
            .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
            .info-card { background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #007bff; }
            .info-card h3 { margin: 0 0 5px 0; color: #007bff; }
            .sequence-box { background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .sequence { font-family: monospace; word-break: break-all; line-height: 1.4; }
            .pdb-section { margin-top: 20px; }
            .pdb-data { background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 12px; max-height: 300px; overflow-y: auto; }
            .download-btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 10px 5px; }
            .download-btn:hover { background: #0056b3; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧬 3D Protein Structure Analysis</h1>
              <p>Structure ID: <strong>${results.structure3D.structureId}</strong></p>
            </div>

            <div class="info-grid">
              <div class="info-card">
                <h3>Confidence Score</h3>
                <p>${(results.structure3D.confidence * 100).toFixed(1)}%</p>
              </div>
              <div class="info-card">
                <h3>Method</h3>
                <p>${results.structure3D.method}</p>
              </div>
              <div class="info-card">
                <h3>Protein Length</h3>
                <p>${results.structure3D.length} amino acids</p>
              </div>
              <div class="info-card">
                <h3>Molecular Weight</h3>
                <p>${results.structure3D.molecularProperties?.molecularWeight?.toFixed(0) || 'N/A'} Da</p>
              </div>
            </div>

            <div class="sequence-box">
              <h3>🔤 Protein Sequence</h3>
              <div class="sequence">${results.structure3D.proteinSequence}</div>
            </div>

            <div class="info-grid">
              <div class="info-card">
                <h3>Alpha Helix</h3>
                <p>${results.structure3D.secondaryStructure?.alphaHelix?.toFixed(1) || 'N/A'}%</p>
              </div>
              <div class="info-card">
                <h3>Beta Sheet</h3>
                <p>${results.structure3D.secondaryStructure?.betaSheet?.toFixed(1) || 'N/A'}%</p>
              </div>
              <div class="info-card">
                <h3>Loop Regions</h3>
                <p>${results.structure3D.secondaryStructure?.loop?.toFixed(1) || 'N/A'}%</p>
              </div>
              <div class="info-card">
                <h3>Isoelectric Point</h3>
                <p>${results.structure3D.molecularProperties?.isoelectricPoint?.toFixed(2) || 'N/A'}</p>
              </div>
            </div>

            <div class="pdb-section">
              <h3>📄 PDB Structure Data</h3>
              <button class="download-btn" onclick="downloadPDB()">Download PDB File</button>
              <button class="download-btn" onclick="copyPDB()">Copy to Clipboard</button>
              <div class="pdb-data" id="pdbData">${results.structure3D.pdbData}</div>
            </div>
          </div>

          <script>
            function downloadPDB() {
              const pdbData = document.getElementById('pdbData').textContent;
              const blob = new Blob([pdbData], { type: 'text/plain' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = '${results.structure3D.structureId}.pdb';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }

            function copyPDB() {
              const pdbData = document.getElementById('pdbData').textContent;
              navigator.clipboard.writeText(pdbData).then(() => {
                alert('PDB data copied to clipboard!');
              });
            }
          </script>
        </body>
        </html>
      `)
      structureWindow.document.close()
    }
  }
  const [progress, setProgress] = useState(0)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        // Simple parsing - in production, you'd want more robust FASTA parsing
        const cleanSequence = content
          .replace(/^>.*$/gm, '') // Remove FASTA headers
          .replace(/\s/g, '') // Remove whitespace
          .toUpperCase()
        setSequence(cleanSequence)
      }
      reader.readAsText(file)
    }
  }

  const handleAnalyze = async () => {
    if (!sequence.trim()) {
      setError("Please enter a DNA sequence")
      return
    }

    setIsAnalyzing(true)
    setError("")
    setResults(null)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      const response = await fetch('/api/analysis/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          sequence: sequence.trim()
        }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (response.ok) {
        const data = await response.json()
        // Temporary debug - remove after testing
        if (typeof window !== 'undefined') {
          console.log('API Response:', data)
        }
        setResults(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Analysis failed')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerate3D = async () => {
    if (!sequence.trim()) {
      setError("Please enter a DNA sequence")
      return
    }

    setIsAnalyzing(true)
    setError("")

    try {
      const response = await fetch('/api/analysis/structure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          sequence: sequence.trim()
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(prev => ({
          ...prev,
          structure3D: data.structure3D
        }))
      } else {
        const errorData = await response.json()
        setError(errorData.error || '3D structure generation failed')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const sampleSequences = [
    {
      name: "BRCA1 Gene Fragment",
      sequence: "ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAAATCTTAGAGTGTCCCATCTGTCTGGAGTTGATCAAGGAACCTGTCTCCACAAAGTGTGACCACATATTTTGCAAATTTTGCATGCTGAAACTTCTCAACCAGAAGAAAGGGCCTTCACAGTGTCCTTTATGTAAGAATGATATCCCCGCTTGGCCCAGCCCTCCGCTGCTGGACCTGGCTGGTGGCCATGCTTCTTGCCCCTTGGGCCTCCCCCCAGCCTCTGAGCCCAGAAAGCGAAACCGGATCCTTGG"
    },
    {
      name: "p53 Tumor Suppressor",
      sequence: "ATGGAGGAGCCGCAGTCAGATCCTAGCGTCGAGCCCCCTCTGAGTCAGGAAACATTTTCAGACCTATGGAAACTACTTCCTGAAAACAACGTTCTGTCCCCCTTGCCGTCCCAAGCAATGGATGATTTGATGCTGTCCCCGGACGATATTGAACAATGGTTCACTGAAGACCCAGGTCCAGATGAAGCTCCCAGAATGCCAGAGGCTGCTCCCCCCGTGGCCCCTGCACCAGCAGCTCCTACACCGGCGGCCCCTGCACCAGCCCCCTCCTGGCCCCTGTCATCTTCT"
    },
    {
      name: "Insulin Gene",
      sequence: "ATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGGGGACCTGACCCAGCCGCAGCCTTTGTGAACCAACACCTGTGCGGCTCACACCTGGTGGAAGCTCTCTACCTAGTGTGCGGGGAACGAGGCTTCTTCTACACACCCAAGACCCGCCGGGAGGCAGAGGACCTGCAGGTGGGGCAGGTGGAGCTGGGCGGGGGCCCTGGTGCAGGCAGCCTGCAGCCCTTGGCCCTGGAGGGGTCCCTGCAGAAGCGTGGCATTGTGGAACAATGCTGTACCAGCATCTGCTCCCTCTACCAGCTGGAGAACTACTGCAAC"
    }
  ]

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced DNA Analysis</h1>
        <p className="text-gray-600">Analyze DNA sequences with optional 3D structure generation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dna className="h-5 w-5" />
                DNA Sequence Input
              </CardTitle>
              <CardDescription>
                Enter your DNA sequence or upload a FASTA file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter DNA sequence (ATCG format)..."
                value={sequence}
                onChange={(e) => setSequence(e.target.value.toUpperCase())}
                rows={8}
                className="font-mono text-sm"
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept=".fasta,.fa,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File
                      </span>
                    </Button>
                  </label>
                </div>
                
                <div className="text-sm text-gray-500">
                  Length: {sequence.length} bp
                </div>
              </div>

              {/* 3D Structure Option */}
              <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                <Checkbox
                  id="include3d"
                  checked={include3D}
                  onCheckedChange={(checked) => setInclude3D(checked as boolean)}
                />
                <label htmlFor="include3d" className="text-sm font-medium cursor-pointer">
                  Generate 3D protein structure from DNA sequence
                </label>
                <Atom className="h-4 w-4 text-blue-600" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !sequence.trim()}
                  className="flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analyze Sequence
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleGenerate3D}
                  disabled={isAnalyzing || !sequence.trim()}
                  variant="outline"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Generate 3D
                </Button>
              </div>

              {/* Progress Bar */}
              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sample Sequences */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sample Sequences</CardTitle>
              <CardDescription>
                Click to load a sample sequence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sampleSequences.map((sample, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSequence(sample.sequence)}
                >
                  <div className="font-medium text-sm">{sample.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {sample.sequence.length} bp
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Analysis</TabsTrigger>
                <TabsTrigger value="structure" disabled={!results.structure3D}>
                  3D Structure
                </TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                {results.basicAnalysis && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.basicAnalysis.length}
                      </div>
                      <div className="text-sm text-gray-600">Base Pairs</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {results.basicAnalysis.gcContent?.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">GC Content</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {results.basicAnalysis.orfCount || 0}
                      </div>
                      <div className="text-sm text-gray-600">ORFs Found</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {results.basicAnalysis.motifs?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Motifs</div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="structure" className="space-y-4">
                {results.structure3D && results.structure3D.success ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {results.structure3D.confidence?.toFixed(1) || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Confidence</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {results.structure3D.length || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Amino Acids</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {results.structure3D.method || 'AI-Predicted'}
                        </div>
                        <div className="text-sm text-gray-600">Method</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {results.structure3D.structureId || 'Generated'}
                        </div>
                        <div className="text-sm text-gray-600">Structure ID</div>
                      </div>
                    </div>
                    
                    <Alert>
                      <Atom className="h-4 w-4" />
                      <AlertDescription>
                        3D structure generated successfully! The structure can be visualized in the 3D Viewer.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No 3D structure data available. Enable 3D generation in the analysis options.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
              
              <TabsContent value="export" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col hover:bg-blue-50 hover:border-blue-200"
                    onClick={downloadJSON}
                    disabled={!results}
                  >
                    <Download className="h-6 w-6 mb-2 text-blue-600" />
                    <span className="text-sm font-medium">Download Results (JSON)</span>
                    <span className="text-xs text-gray-500">Complete analysis data</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col hover:bg-green-50 hover:border-green-200"
                    onClick={generatePDFReport}
                    disabled={!results}
                  >
                    <FileText className="h-6 w-6 mb-2 text-green-600" />
                    <span className="text-sm font-medium">Generate Report (TXT)</span>
                    <span className="text-xs text-gray-500">Formatted analysis report</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col hover:bg-purple-50 hover:border-purple-200"
                    onClick={openIn3DVisualizer}
                    disabled={!results?.structure3D?.success}
                  >
                    <Eye className="h-6 w-6 mb-2 text-purple-600" />
                    <span className="text-sm font-medium">View in 3D Visualizer</span>
                    <span className="text-xs text-gray-500">Interactive 3D structure</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col hover:bg-orange-50 hover:border-orange-200"
                    onClick={exportFASTA}
                    disabled={!sequence}
                  >
                    <Dna className="h-6 w-6 mb-2 text-orange-600" />
                    <span className="text-sm font-medium">Export FASTA</span>
                    <span className="text-xs text-gray-500">Sequence in FASTA format</span>
                  </Button>
                </div>

                {!results && (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Results</h3>
                    <p className="text-gray-600">Run an analysis first to enable export options.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
