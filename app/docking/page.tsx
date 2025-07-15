'use client'

import { useState, useEffect, useRef } from 'react'

// Declare 3DMol global variable
declare global {
  interface Window {
    $3Dmol: any
  }
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, Atom, Target, Zap, Info, CheckCircle, AlertCircle, Eye, Maximize, Download, RotateCcw, Brain } from 'lucide-react'
import Simple3DViewer from '@/components/simple-3d-viewer'
import LangChainChat from '@/components/langchain-chat'

interface DockingResult {
  mode: number
  affinity: number
  rmsd_lb: number
  rmsd_ub: number
}

interface AIAnalysis {
  binding_analysis: {
    affinity_kcal_mol: number
    strength: string
    interpretation: string
  }
  interaction_prediction: string[]
  drug_likeness: {
    assessment: string
    drug_likeness_score: number
    lipinski_violations: number
  }
  optimization_suggestions: string[]
  confidence: number
}

export default function DockingPage() {
  const [proteinData, setProteinData] = useState('')
  const [ligandSmiles, setLigandSmiles] = useState('')
  const [ligandName, setLigandName] = useState('ligand')
  const [bindingSite, setBindingSite] = useState({
    x: 0,
    y: 0,
    z: 0,
    size_x: 20,
    size_y: 20,
    size_z: 20
  })
  const [exhaustiveness, setExhaustiveness] = useState(8)
  
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<'input' | 'prepare' | 'dock' | 'results'>('input')
  const [preparationResult, setPreparationResult] = useState<any>(null)
  const [dockingResults, setDockingResults] = useState<DockingResult[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showVisualization, setShowVisualization] = useState(false)
  const [selectedMode, setSelectedMode] = useState<number>(1)
  const [visualizationLoading, setVisualizationLoading] = useState(false)

  const viewerRef = useRef<HTMLDivElement>(null)

  // Load 3DMol.js script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://3Dmol.csb.pitt.edu/build/3Dmol-min.js'
    script.async = true

    script.onload = () => {
      console.log('3DMol.js loaded successfully')
    }

    script.onerror = () => {
      console.error('Failed to load 3DMol.js')
      setError('Failed to load 3D visualization library')
    }

    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  // Initialize 3D visualization
  const initialize3DVisualization = () => {
    if (!viewerRef.current) {
      console.error('Viewer reference not available')
      return
    }

    if (!window.$3Dmol) {
      console.error('3DMol.js not loaded')
      setError('3D visualization library not loaded. Please refresh the page.')
      return
    }

    if (!preparationResult) {
      console.error('No preparation result available')
      return
    }

    setVisualizationLoading(true)
    setError(null)

    try {
      // Clear previous viewer
      viewerRef.current.innerHTML = ''

      const viewer = window.$3Dmol.createViewer(viewerRef.current, {
        defaultcolors: window.$3Dmol.rasmolElementColors,
        backgroundColor: 'black'
      })

      // Clear any existing models
      viewer.clear()

      console.log('3DMol viewer created successfully')

    // Generate mock protein structure for visualization
    const proteinPDB = generateMockProteinPDB()
    const proteinModel = viewer.addModel(proteinPDB, 'pdb')
    viewer.setStyle({ model: 0 }, { cartoon: { color: 'spectrum', thickness: 0.8 } })

    console.log('Protein PDB loaded:', proteinPDB.substring(0, 200))

    // Add ligand if docking results exist
    if (dockingResults.length > 0) {
      const ligandPDB = generateMockLigandPDB(selectedMode)
      const ligandModel = viewer.addModel(ligandPDB, 'pdb')
      viewer.setStyle({ model: 1 }, { stick: { colorscheme: 'Jmol', radius: 0.4 } })

      console.log('Ligand PDB loaded:', ligandPDB)

      // Add binding site sphere
      viewer.addSphere({
        center: { x: bindingSite.x, y: bindingSite.y, z: bindingSite.z },
        radius: Math.min(bindingSite.size_x, bindingSite.size_y, bindingSite.size_z) / 3,
        color: 'yellow',
        alpha: 0.2
      })

      // Add interaction lines (mock hydrogen bonds)
      addInteractionLines(viewer)

      // Add labels for binding affinity
      const result = dockingResults.find(r => r.mode === selectedMode)
      if (result) {
        viewer.addLabel(`Mode ${selectedMode}\n${result.affinity} kcal/mol`, {
          position: { x: bindingSite.x + 5, y: bindingSite.y + 5, z: bindingSite.z + 5 },
          backgroundColor: 'black',
          fontColor: 'white',
          fontSize: 12
        })
      }
    }

      // Ensure proper rendering
      viewer.zoomTo()
      viewer.render()

      // Force a second render after a short delay to ensure everything loads
      setTimeout(() => {
        try {
          viewer.render()
          setVisualizationLoading(false)
          console.log('3D visualization initialized successfully')
        } catch (renderError) {
          console.error('Rendering error:', renderError)
          setError('Failed to render 3D visualization')
          setVisualizationLoading(false)
        }
      }, 1500)

    } catch (initError) {
      console.error('3D visualization initialization error:', initError)
      setError('Failed to initialize 3D visualization')
      setVisualizationLoading(false)
    }
  }

  // Add interaction lines to show binding interactions
  const addInteractionLines = (viewer: any) => {
    // Mock hydrogen bond interactions between protein and ligand
    const modeOffset = (selectedMode - 1) * 2
    const ligandX = bindingSite.x + Math.cos(modeOffset) * 3
    const ligandY = bindingSite.y + Math.sin(modeOffset) * 3
    const ligandZ = bindingSite.z + (selectedMode - 3) * 1

    const interactions = [
      {
        from: { x: ligandX + 1, y: ligandY, z: ligandZ },
        to: { x: bindingSite.x - 1, y: bindingSite.y + 1, z: bindingSite.z },
        type: 'hydrogen'
      },
      {
        from: { x: ligandX - 1, y: ligandY + 1, z: ligandZ },
        to: { x: bindingSite.x + 2, y: bindingSite.y - 1, z: bindingSite.z + 1 },
        type: 'hydrogen'
      },
      {
        from: { x: ligandX, y: ligandY - 1, z: ligandZ + 1 },
        to: { x: bindingSite.x - 2, y: bindingSite.y, z: bindingSite.z - 1 },
        type: 'hydrogen'
      }
    ]

    interactions.forEach(interaction => {
      viewer.addCylinder({
        start: interaction.from,
        end: interaction.to,
        radius: 0.05,
        color: interaction.type === 'hydrogen' ? 'cyan' : 'orange',
        alpha: 0.8
      })
    })
  }

  // Generate mock protein PDB for visualization
  const generateMockProteinPDB = (): string => {
    const lines = [
      'HEADER    MOCK PROTEIN STRUCTURE FOR VISUALIZATION',
      'REMARK    Generated for docking visualization',
      'REMARK    Contains alpha helix and beta sheet structures'
    ]

    let atomNum = 1

    // Generate alpha helix (residues 1-30)
    for (let i = 0; i < 30; i++) {
      const angle = i * 100 * Math.PI / 180
      const radius = 2.3 // Standard alpha helix radius
      const rise = 1.5   // Rise per residue

      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle)
      const z = i * rise

      // Add backbone atoms (N, CA, C, O)
      lines.push(
        `ATOM  ${atomNum.toString().padStart(5)}  N   ALA A${(i + 1).toString().padStart(4)}    ${(x - 0.5).toFixed(3).padStart(8)}${(y - 0.3).toFixed(3).padStart(8)}${(z - 0.2).toFixed(3).padStart(8)}  1.00 20.00           N`
      )
      atomNum++

      lines.push(
        `ATOM  ${atomNum.toString().padStart(5)}  CA  ALA A${(i + 1).toString().padStart(4)}    ${x.toFixed(3).padStart(8)}${y.toFixed(3).padStart(8)}${z.toFixed(3).padStart(8)}  1.00 20.00           C`
      )
      atomNum++

      lines.push(
        `ATOM  ${atomNum.toString().padStart(5)}  C   ALA A${(i + 1).toString().padStart(4)}    ${(x + 0.5).toFixed(3).padStart(8)}${(y + 0.3).toFixed(3).padStart(8)}${(z + 0.2).toFixed(3).padStart(8)}  1.00 20.00           C`
      )
      atomNum++

      lines.push(
        `ATOM  ${atomNum.toString().padStart(5)}  O   ALA A${(i + 1).toString().padStart(4)}    ${(x + 1.0).toFixed(3).padStart(8)}${(y + 0.6).toFixed(3).padStart(8)}${(z + 0.4).toFixed(3).padStart(8)}  1.00 20.00           O`
      )
      atomNum++
    }

    // Generate beta sheet (residues 31-50)
    for (let i = 0; i < 20; i++) {
      const x = i * 3.5 - 35  // Extended conformation
      const y = Math.sin(i * 0.5) * 2  // Slight wave
      const z = 50 + i * 0.5

      lines.push(
        `ATOM  ${atomNum.toString().padStart(5)}  N   VAL A${(i + 31).toString().padStart(4)}    ${(x - 0.5).toFixed(3).padStart(8)}${(y - 0.3).toFixed(3).padStart(8)}${(z - 0.2).toFixed(3).padStart(8)}  1.00 20.00           N`
      )
      atomNum++

      lines.push(
        `ATOM  ${atomNum.toString().padStart(5)}  CA  VAL A${(i + 31).toString().padStart(4)}    ${x.toFixed(3).padStart(8)}${y.toFixed(3).padStart(8)}${z.toFixed(3).padStart(8)}  1.00 20.00           C`
      )
      atomNum++

      lines.push(
        `ATOM  ${atomNum.toString().padStart(5)}  C   VAL A${(i + 31).toString().padStart(4)}    ${(x + 0.5).toFixed(3).padStart(8)}${(y + 0.3).toFixed(3).padStart(8)}${(z + 0.2).toFixed(3).padStart(8)}  1.00 20.00           C`
      )
      atomNum++

      lines.push(
        `ATOM  ${atomNum.toString().padStart(5)}  O   VAL A${(i + 31).toString().padStart(4)}    ${(x + 1.0).toFixed(3).padStart(8)}${(y + 0.6).toFixed(3).padStart(8)}${(z + 0.4).toFixed(3).padStart(8)}  1.00 20.00           O`
      )
      atomNum++
    }

    lines.push('END')
    return lines.join('\n')
  }

  // Generate mock ligand PDB for selected binding mode
  const generateMockLigandPDB = (mode: number): string => {
    const result = dockingResults.find(r => r.mode === mode)
    if (!result) return ''

    const lines = [
      'HEADER    LIGAND BINDING MODE ' + mode,
      'REMARK    Binding affinity: ' + result.affinity + ' kcal/mol',
      'REMARK    RMSD: ' + result.rmsd_lb + ' - ' + result.rmsd_ub + ' A'
    ]

    // Generate ligand coordinates near binding site with mode-specific positioning
    const modeOffset = (mode - 1) * 2 // Different position for each mode
    const baseX = bindingSite.x + Math.cos(modeOffset) * 3
    const baseY = bindingSite.y + Math.sin(modeOffset) * 3
    const baseZ = bindingSite.z + (mode - 3) * 1

    // Create a more realistic ligand structure based on common drug-like molecules
    const ligandAtoms = [
      { atom: 'C', name: 'C1', x: 0, y: 0, z: 0 },
      { atom: 'C', name: 'C2', x: 1.4, y: 0, z: 0 },
      { atom: 'C', name: 'C3', x: 2.1, y: 1.2, z: 0 },
      { atom: 'C', name: 'C4', x: 1.4, y: 2.4, z: 0 },
      { atom: 'C', name: 'C5', x: 0, y: 2.4, z: 0 },
      { atom: 'C', name: 'C6', x: -0.7, y: 1.2, z: 0 },
      { atom: 'O', name: 'O1', x: 3.5, y: 1.2, z: 0 },
      { atom: 'N', name: 'N1', x: -2.1, y: 1.2, z: 0 },
      { atom: 'C', name: 'C7', x: 2.1, y: -1.2, z: 0 },
      { atom: 'O', name: 'O2', x: 1.4, y: -2.4, z: 0 }
    ]

    ligandAtoms.forEach((atomData, i) => {
      const x = baseX + atomData.x
      const y = baseY + atomData.y
      const z = baseZ + atomData.z

      lines.push(
        `HETATM${(i + 1).toString().padStart(5)}  ${atomData.name.padEnd(3)} LIG A 999    ${x.toFixed(3).padStart(8)}${y.toFixed(3).padStart(8)}${z.toFixed(3).padStart(8)}  1.00 50.00           ${atomData.atom}`
      )
    })

    // Add connectivity information
    lines.push('CONECT    1    2    6')
    lines.push('CONECT    2    1    3    9')
    lines.push('CONECT    3    2    4    7')
    lines.push('CONECT    4    3    5')
    lines.push('CONECT    5    4    6')
    lines.push('CONECT    6    1    5    8')
    lines.push('CONECT    7    3')
    lines.push('CONECT    8    6')
    lines.push('CONECT    9    2   10')
    lines.push('CONECT   10    9')

    lines.push('END')
    return lines.join('\n')
  }

  // Update visualization when mode changes
  useEffect(() => {
    if (showVisualization && dockingResults.length > 0) {
      setTimeout(initialize3DVisualization, 100)
    }
  }, [showVisualization, selectedMode, dockingResults])

  // Export visualization as PNG
  const exportVisualization = () => {
    if (!viewerRef.current || !window.$3Dmol) return

    const viewer = window.$3Dmol.viewers[viewerRef.current.id]
    if (viewer) {
      const imgData = viewer.pngURI()
      const link = document.createElement('a')
      link.download = `docking_mode_${selectedMode}_${ligandName}.png`
      link.href = imgData
      link.click()
    }
  }

  const handlePrepareDocking = async () => {
    if (!proteinData.trim() || !ligandSmiles.trim()) {
      setError('Please provide both protein data and ligand SMILES')
      return
    }

    setIsLoading(true)
    setError(null)
    setCurrentStep('prepare')

    try {
      const response = await fetch('/api/ml-service/docking/prepare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          protein_data: proteinData,
          ligand_smiles: ligandSmiles,
          ligand_name: ligandName
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Preparation failed')
      }

      setPreparationResult(data.data)
      setCurrentStep('dock')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Preparation failed')
      setCurrentStep('input')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRunDocking = async () => {
    if (!preparationResult) {
      setError('Please prepare the docking first')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ml-service/docking/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          protein_pdbqt: preparationResult.protein.pdbqt_file,
          ligand_pdbqt: preparationResult.ligand.pdbqt_file,
          binding_site: bindingSite,
          exhaustiveness: exhaustiveness
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Docking failed')
      }

      setDockingResults(data.data.docking_results)
      setAiAnalysis(data.data.ai_analysis)
      setCurrentStep('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Docking failed')
    } finally {
      setIsLoading(false)
    }
  }

  const resetDocking = () => {
    setCurrentStep('input')
    setPreparationResult(null)
    setDockingResults([])
    setAiAnalysis(null)
    setError(null)
  }

  const getAffinityColor = (affinity: number) => {
    if (affinity < -10) return 'text-green-600'
    if (affinity < -8) return 'text-blue-600'
    if (affinity < -6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAffinityBadge = (affinity: number) => {
    if (affinity < -10) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (affinity < -8) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    if (affinity < -6) return <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>
    return <Badge className="bg-red-100 text-red-800">Weak</Badge>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Target className="h-8 w-8 text-blue-600" />
            Molecular Docking
          </h1>
          <p className="text-gray-600">
            Perform protein-ligand docking analysis with AI-powered insights
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={currentStep} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="input" className="flex items-center gap-2">
              <Atom className="h-4 w-4" />
              Input
            </TabsTrigger>
            <TabsTrigger value="prepare" disabled={currentStep === 'input'}>
              <Zap className="h-4 w-4" />
              Prepare
            </TabsTrigger>
            <TabsTrigger value="dock" disabled={!preparationResult}>
              <Target className="h-4 w-4" />
              Dock
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!dockingResults.length}>
              <Info className="h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="ai-chat">
              <Brain className="h-4 w-4" />
              AI Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Protein Structure</CardTitle>
                  <CardDescription>
                    Provide protein structure in PDB format
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="protein-data">PDB Data</Label>
                    <Textarea
                      id="protein-data"
                      placeholder="Paste PDB file content here..."
                      value={proteinData}
                      onChange={(e) => setProteinData(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ligand Information</CardTitle>
                  <CardDescription>
                    Provide ligand structure as SMILES string
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="ligand-name">Ligand Name</Label>
                    <Input
                      id="ligand-name"
                      value={ligandName}
                      onChange={(e) => setLigandName(e.target.value)}
                      placeholder="Enter ligand name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ligand-smiles">SMILES String</Label>
                    <Textarea
                      id="ligand-smiles"
                      placeholder="Enter SMILES string (e.g., CCO for ethanol)"
                      value={ligandSmiles}
                      onChange={(e) => setLigandSmiles(e.target.value)}
                      className="min-h-[100px] font-mono text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Binding Site Configuration</CardTitle>
                <CardDescription>
                  Define the binding site coordinates and search space
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <Label htmlFor="center-x">Center X</Label>
                    <Input
                      id="center-x"
                      type="number"
                      value={bindingSite.x}
                      onChange={(e) => setBindingSite({...bindingSite, x: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="center-y">Center Y</Label>
                    <Input
                      id="center-y"
                      type="number"
                      value={bindingSite.y}
                      onChange={(e) => setBindingSite({...bindingSite, y: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="center-z">Center Z</Label>
                    <Input
                      id="center-z"
                      type="number"
                      value={bindingSite.z}
                      onChange={(e) => setBindingSite({...bindingSite, z: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="size-x">Size X</Label>
                    <Input
                      id="size-x"
                      type="number"
                      value={bindingSite.size_x}
                      onChange={(e) => setBindingSite({...bindingSite, size_x: parseFloat(e.target.value) || 20})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="size-y">Size Y</Label>
                    <Input
                      id="size-y"
                      type="number"
                      value={bindingSite.size_y}
                      onChange={(e) => setBindingSite({...bindingSite, size_y: parseFloat(e.target.value) || 20})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="size-z">Size Z</Label>
                    <Input
                      id="size-z"
                      type="number"
                      value={bindingSite.size_z}
                      onChange={(e) => setBindingSite({...bindingSite, size_z: parseFloat(e.target.value) || 20})}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="exhaustiveness">Exhaustiveness</Label>
                  <Input
                    id="exhaustiveness"
                    type="number"
                    min="1"
                    max="32"
                    value={exhaustiveness}
                    onChange={(e) => setExhaustiveness(parseInt(e.target.value) || 8)}
                    className="w-32"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Higher values increase accuracy but take longer (1-32)
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                onClick={handlePrepareDocking}
                disabled={isLoading || !proteinData.trim() || !ligandSmiles.trim()}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                Prepare Docking
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="prepare" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preparation Status</CardTitle>
                <CardDescription>
                  Preparing protein and ligand structures for docking
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Preparing structures...
                  </div>
                ) : preparationResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Preparation completed successfully
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800">Protein</h4>
                        <p className="text-sm text-green-600">
                          Atoms: {preparationResult.protein.validation?.atom_count || 'N/A'}
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800">Ligand</h4>
                        <p className="text-sm text-blue-600">
                          MW: {preparationResult.ligand.mol_weight?.toFixed(2) || 'N/A'} Da
                        </p>
                        <p className="text-sm text-blue-600">
                          Atoms: {preparationResult.ligand.num_atoms || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleRunDocking} className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Run Docking
                      </Button>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dock" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Docking Execution</CardTitle>
                <CardDescription>
                  Running molecular docking simulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running docking simulation...
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Button onClick={handleRunDocking} className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Start Docking
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {dockingResults.length > 0 && (
              <>
                {/* 3D Molecular Visualization */}
                <Simple3DViewer
                  dockingResults={dockingResults}
                  bindingSite={bindingSite}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Docking Results</CardTitle>
                      <CardDescription>
                        Binding poses ranked by affinity
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dockingResults.map((result, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedMode === result.mode
                                ? 'bg-blue-50 border-2 border-blue-200'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                            onClick={() => setSelectedMode(result.mode)}
                          >
                            <div className="flex items-center gap-4">
                              <Badge variant={selectedMode === result.mode ? "default" : "outline"}>
                                Mode {result.mode}
                              </Badge>
                              <span className={`font-mono font-medium ${getAffinityColor(result.affinity)}`}>
                                {result.affinity} kcal/mol
                              </span>
                              {getAffinityBadge(result.affinity)}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                RMSD: {result.rmsd_lb} - {result.rmsd_ub} Å
                              </span>
                              {selectedMode === result.mode && (
                                <Eye className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <Button
                          onClick={() => setShowVisualization(!showVisualization)}
                          className="w-full flex items-center gap-2"
                          variant={showVisualization ? "secondary" : "default"}
                        >
                          <Maximize className="h-4 w-4" />
                          {showVisualization ? 'Hide' : 'Show'} 3D Visualization
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {showVisualization && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          3D Structure Visualization
                        </CardTitle>
                        <CardDescription>
                          Interactive protein-ligand complex (Mode {selectedMode})
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="relative">
                            <div
                              ref={viewerRef}
                              className="w-full h-96 border rounded-lg bg-black"
                              style={{ minHeight: '400px' }}
                            />
                            {visualizationLoading && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                <div className="text-white flex items-center gap-2">
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                  Loading 3D visualization...
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <h4 className="font-medium text-blue-800">Selected Mode</h4>
                              <p className="text-blue-600">Mode {selectedMode}</p>
                              <p className="text-blue-600">
                                {dockingResults.find(r => r.mode === selectedMode)?.affinity} kcal/mol
                              </p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                              <h4 className="font-medium text-green-800">Visualization</h4>
                              <p className="text-green-600">Protein: Cartoon</p>
                              <p className="text-green-600">Ligand: Stick model</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                              <h4 className="font-medium text-purple-800">Debug Info</h4>
                              <p className="text-purple-600 text-xs">3DMol: {typeof window !== 'undefined' && window.$3Dmol ? '✅' : '❌'}</p>
                              <p className="text-purple-600 text-xs">Viewer: {viewerRef.current ? '✅' : '❌'}</p>
                              <p className="text-purple-600 text-xs">Data: {preparationResult ? '✅' : '❌'}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={initialize3DVisualization}
                              className="flex items-center gap-1"
                              disabled={visualizationLoading}
                            >
                              {visualizationLoading ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <RotateCcw className="h-3 w-3" />
                              )}
                              {visualizationLoading ? 'Loading...' : 'Reset View'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const nextMode = selectedMode < dockingResults.length ? selectedMode + 1 : 1
                                setSelectedMode(nextMode)
                              }}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Next Mode
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={exportVisualization}
                              className="flex items-center gap-1"
                            >
                              <Download className="h-3 w-3" />
                              Export PNG
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {aiAnalysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Analysis</CardTitle>
                      <CardDescription>
                        Intelligent interpretation of docking results
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Binding Analysis</h4>
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="font-medium text-blue-800">
                              {aiAnalysis.binding_analysis.strength} Binding
                            </p>
                            <p className="text-sm text-blue-600 mt-1">
                              {aiAnalysis.binding_analysis.interpretation}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Drug-likeness</h4>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <p className="font-medium text-green-800">
                              {aiAnalysis.drug_likeness.assessment}
                            </p>
                            <p className="text-sm text-green-600 mt-1">
                              Score: {(aiAnalysis.drug_likeness.drug_likeness_score * 100).toFixed(0)}%
                            </p>
                            <p className="text-sm text-green-600">
                              Lipinski violations: {aiAnalysis.drug_likeness.lipinski_violations}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Predicted Interactions</h4>
                        <div className="space-y-2">
                          {aiAnalysis.interaction_prediction.map((interaction, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm">{interaction}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Optimization Suggestions</h4>
                        <div className="space-y-2">
                          {aiAnalysis.optimization_suggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-sm">{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-center">
                  <Button onClick={resetDocking} variant="outline">
                    New Docking Analysis
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="ai-chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LangChainChat
                  context={{
                    sequence: proteinData,
                    sequence_type: 'PROTEIN',
                    analysis: dockingResults.length > 0 ? {
                      docking_results: dockingResults,
                      binding_site: bindingSite,
                      ligand_smiles: ligandSmiles
                    } : undefined
                  }}
                />
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Docking Context</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span className="text-gray-600">{proteinData ? 'Loaded' : 'Not loaded'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ligand:</span>
                        <span className="text-gray-600">{ligandSmiles || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Results:</span>
                        <span className="text-gray-600">{dockingResults.length} modes</span>
                      </div>
                      {dockingResults.length > 0 && (
                        <div className="flex justify-between">
                          <span>Best Affinity:</span>
                          <span className="text-gray-600">{dockingResults[0].affinity} kcal/mol</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Ask the AI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-xs">
                      <div className="p-2 bg-gray-50 rounded">
                        "Explain these docking results"
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        "What does this binding affinity mean?"
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        "How can I optimize this ligand?"
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        "Interpret the molecular interactions"
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
