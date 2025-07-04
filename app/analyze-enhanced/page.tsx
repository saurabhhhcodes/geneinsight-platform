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
    const structureWindow = window.open('', '_blank', 'width=1000,height=700')
    if (structureWindow) {
      structureWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>3D Protein Structure - ${results.structure3D.structureId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 20px; }
            .main-content { display: grid; grid-template-columns: 1fr 400px; gap: 20px; }
            .viewer-section { background: #f8f9fa; border-radius: 8px; padding: 20px; }
            .info-section { }
            .viewer-container { width: 100%; height: 400px; border: 2px solid #ddd; border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position: relative; overflow: hidden; }
            .molecule-canvas { width: 100%; height: 100%; }
            .viewer-controls { margin-top: 10px; text-align: center; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
            .info-card { background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #007bff; }
            .info-card h3 { margin: 0 0 5px 0; color: #007bff; font-size: 14px; }
            .info-card p { margin: 0; font-size: 18px; font-weight: bold; }
            .sequence-box { background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .sequence { font-family: monospace; word-break: break-all; line-height: 1.4; font-size: 12px; max-height: 150px; overflow-y: auto; }
            .pdb-section { margin-top: 20px; }
            .pdb-data { background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 11px; max-height: 200px; overflow-y: auto; }
            .btn { background: #007bff; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; font-size: 12px; }
            .btn:hover { background: #0056b3; }
            .btn-secondary { background: #6c757d; }
            .btn-secondary:hover { background: #545b62; }
            .upload-section { margin: 15px 0; padding: 15px; background: #e9ecef; border-radius: 6px; }
            .file-input { margin: 10px 0; }
            .atom { position: absolute; border-radius: 50%; animation: float 6s ease-in-out infinite; }
            .atom:nth-child(1) { animation-delay: 0s; }
            .atom:nth-child(2) { animation-delay: 1s; }
            .atom:nth-child(3) { animation-delay: 2s; }
            .atom:nth-child(4) { animation-delay: 3s; }
            .atom:nth-child(5) { animation-delay: 4s; }
            @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(180deg); } }
            .structure-info { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 10px; border-radius: 6px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧬 3D Protein Structure Viewer</h1>
              <p>Structure ID: <strong>${results.structure3D.structureId}</strong></p>
            </div>

            <div class="main-content">
              <div class="viewer-section">
                <h3>🎯 3D Protein Structure Visualization</h3>
                <div id="viewer" class="viewer-container">
                  <div class="structure-info">
                    <strong>${results.structure3D.structureId}</strong><br>
                    ${results.structure3D.length} amino acids<br>
                    Confidence: ${(results.structure3D.confidence * 100).toFixed(1)}%
                  </div>
                </div>
                <div class="viewer-controls">
                  <button class="btn" onclick="animateStructure()">Animate</button>
                  <button class="btn" onclick="showAtoms()">Show Atoms</button>
                  <button class="btn" onclick="showBonds()">Show Bonds</button>
                  <button class="btn btn-secondary" onclick="resetAnimation()">Reset</button>
                </div>

                <div class="upload-section">
                  <h4>📁 Import PDB File</h4>
                  <input type="file" id="pdbFileInput" class="file-input" accept=".pdb" onchange="loadPDBFile(event)">
                  <button class="btn" onclick="document.getElementById('pdbFileInput').click()">Choose PDB File</button>
                  <p style="font-size: 12px; color: #666; margin: 5px 0;">Upload your own PDB file to visualize</p>
                </div>
              </div>

              <div class="info-section">
                <div class="info-grid">
                  <div class="info-card">
                    <h3>Confidence</h3>
                    <p>${(results.structure3D.confidence * 100).toFixed(1)}%</p>
                  </div>
                  <div class="info-card">
                    <h3>Method</h3>
                    <p>${results.structure3D.method}</p>
                  </div>
                  <div class="info-card">
                    <h3>Length</h3>
                    <p>${results.structure3D.length} AA</p>
                  </div>
                  <div class="info-card">
                    <h3>Mol. Weight</h3>
                    <p>${results.structure3D.molecularProperties?.molecularWeight?.toFixed(0) || 'N/A'} Da</p>
                  </div>
                </div>

                <div class="sequence-box">
                  <h3>🔤 Protein Sequence</h3>
                  <div class="sequence">${results.structure3D.proteinSequence}</div>
                </div>

                <div class="info-grid">
                  <div class="info-card">
                    <h3>α-Helix</h3>
                    <p>${results.structure3D.secondaryStructure?.alphaHelix?.toFixed(1) || 'N/A'}%</p>
                  </div>
                  <div class="info-card">
                    <h3>β-Sheet</h3>
                    <p>${results.structure3D.secondaryStructure?.betaSheet?.toFixed(1) || 'N/A'}%</p>
                  </div>
                  <div class="info-card">
                    <h3>Loops</h3>
                    <p>${results.structure3D.secondaryStructure?.loop?.toFixed(1) || 'N/A'}%</p>
                  </div>
                  <div class="info-card">
                    <h3>pI</h3>
                    <p>${results.structure3D.molecularProperties?.isoelectricPoint?.toFixed(2) || 'N/A'}</p>
                  </div>
                </div>

                <div class="pdb-section">
                  <h3>📄 PDB Data</h3>
                  <button class="btn" onclick="downloadPDB()">Download PDB</button>
                  <button class="btn" onclick="copyPDB()">Copy PDB</button>
                  <div class="pdb-data" id="pdbData">${results.structure3D.pdbData}</div>
                </div>
              </div>
            </div>
          </div>

          <script>
            let animationRunning = false;
            let atomCount = 0;

            // Create animated atoms representing the protein structure
            function createAtoms() {
              const viewer = document.getElementById('viewer');
              const atoms = ${JSON.stringify(results.structure3D.atoms || [])};

              // Clear existing atoms
              const existingAtoms = viewer.querySelectorAll('.atom');
              existingAtoms.forEach(atom => atom.remove());

              // Create visual atoms based on structure data
              const maxAtoms = Math.min(atoms.length, 20); // Limit for performance

              for (let i = 0; i < maxAtoms; i++) {
                const atom = document.createElement('div');
                atom.className = 'atom';

                // Position atoms in a helix pattern
                const angle = (i * 30) * Math.PI / 180;
                const radius = 80;
                const x = 50 + radius * Math.cos(angle) / 2;
                const y = 50 + radius * Math.sin(angle) / 2 + (i * 5);

                // Color based on amino acid type
                const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
                const color = colors[i % colors.length];

                atom.style.cssText = \`
                  left: \${x}%;
                  top: \${y % 80}%;
                  width: 12px;
                  height: 12px;
                  background: \${color};
                  box-shadow: 0 0 10px \${color};
                  animation-delay: \${i * 0.2}s;
                \`;

                viewer.appendChild(atom);
              }

              atomCount = maxAtoms;
            }

            // Animate the structure
            function animateStructure() {
              if (animationRunning) return;
              animationRunning = true;

              const atoms = document.querySelectorAll('.atom');
              atoms.forEach((atom, index) => {
                atom.style.animationDuration = '3s';
                atom.style.animationIterationCount = '3';
              });

              setTimeout(() => {
                animationRunning = false;
              }, 9000);
            }

            // Show atoms visualization
            function showAtoms() {
              createAtoms();
            }

            // Show bonds between atoms
            function showBonds() {
              const viewer = document.getElementById('viewer');

              // Create connecting lines between atoms
              const atoms = viewer.querySelectorAll('.atom');

              // Remove existing bonds
              const existingBonds = viewer.querySelectorAll('.bond');
              existingBonds.forEach(bond => bond.remove());

              for (let i = 0; i < atoms.length - 1; i++) {
                const bond = document.createElement('div');
                bond.className = 'bond';
                bond.style.cssText = \`
                  position: absolute;
                  height: 2px;
                  background: rgba(255,255,255,0.3);
                  transform-origin: left center;
                  z-index: 1;
                \`;

                const atom1 = atoms[i];
                const atom2 = atoms[i + 1];

                if (atom1 && atom2) {
                  const rect1 = atom1.getBoundingClientRect();
                  const rect2 = atom2.getBoundingClientRect();
                  const viewerRect = viewer.getBoundingClientRect();

                  const x1 = rect1.left - viewerRect.left + 6;
                  const y1 = rect1.top - viewerRect.top + 6;
                  const x2 = rect2.left - viewerRect.left + 6;
                  const y2 = rect2.top - viewerRect.top + 6;

                  const length = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
                  const angle = Math.atan2(y2-y1, x2-x1) * 180 / Math.PI;

                  bond.style.left = x1 + 'px';
                  bond.style.top = y1 + 'px';
                  bond.style.width = length + 'px';
                  bond.style.transform = \`rotate(\${angle}deg)\`;

                  viewer.appendChild(bond);
                }
              }
            }

            // Reset animation
            function resetAnimation() {
              const viewer = document.getElementById('viewer');
              const atoms = viewer.querySelectorAll('.atom');
              const bonds = viewer.querySelectorAll('.bond');

              atoms.forEach(atom => atom.remove());
              bonds.forEach(bond => bond.remove());

              animationRunning = false;

              // Show initial structure
              setTimeout(createAtoms, 100);
            }

            // Load PDB file functionality
            function loadPDBFile(event) {
              const file = event.target.files[0];
              if (!file) return;

              if (!file.name.toLowerCase().endsWith('.pdb')) {
                alert('Please select a valid PDB file (.pdb extension)');
                return;
              }

              const reader = new FileReader();
              reader.onload = function(e) {
                try {
                  const pdbContent = e.target.result;

                  // Update PDB data display
                  document.getElementById('pdbData').textContent = pdbContent;

                  // Reset and show new structure
                  resetAnimation();

                  alert('PDB file loaded successfully! Structure visualization updated.');
                } catch (error) {
                  alert('Error loading PDB file: ' + error.message);
                }
              };

              reader.onerror = function() {
                alert('Error reading file. Please try again.');
              };

              reader.readAsText(file);
            }

            // Load external PDB file
            function loadPDBFile(event) {
              const file = event.target.files[0];
              if (!file) return;

              if (!file.name.toLowerCase().endsWith('.pdb')) {
                alert('Please select a valid PDB file (.pdb extension)');
                return;
              }

              const reader = new FileReader();
              reader.onload = function(e) {
                try {
                  const pdbContent = e.target.result;

                  // Clear current model
                  viewer.removeAllModels();

                  // Add new model
                  viewer.addModel(pdbContent, 'pdb');
                  viewer.setStyle({}, {cartoon: {color: 'spectrum'}});
                  viewer.zoomTo();
                  viewer.render();

                  // Update PDB data display
                  document.getElementById('pdbData').textContent = pdbContent;

                  alert('PDB file loaded successfully!');
                } catch (error) {
                  alert('Error loading PDB file: ' + error.message);
                }
              };

              reader.onerror = function() {
                alert('Error reading file. Please try again.');
              };

              reader.readAsText(file);
            }

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
              }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = pdbData;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('PDB data copied to clipboard!');
              });
            }

            // Initialize viewer when page loads
            window.onload = function() {
              // Initialize the simple 3D viewer
              setTimeout(() => {
                createAtoms();
                showBonds();
              }, 500);
            };
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
