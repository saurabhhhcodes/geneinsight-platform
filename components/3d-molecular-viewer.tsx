'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RotateCcw, Download, Maximize2, Play, Pause } from 'lucide-react'

interface DockingResult {
  mode: number
  affinity: number
  rmsd_lb: number
  rmsd_ub: number
}

interface MolecularViewerProps {
  proteinData?: string
  ligandData?: string
  dockingResults?: DockingResult[]
  bindingSite?: {
    x: number
    y: number
    z: number
    size_x: number
    size_y: number
    size_z: number
  }
}

export default function MolecularViewer({ 
  proteinData, 
  ligandData, 
  dockingResults = [],
  bindingSite 
}: MolecularViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const [selectedMode, setSelectedMode] = useState(1)
  const [isRotating, setIsRotating] = useState(true)
  const [viewerLoaded, setViewerLoaded] = useState(false)

  useEffect(() => {
    // Load 3DMol.js library dynamically
    const load3DMol = async () => {
      if (typeof window !== 'undefined' && !window.$3Dmol) {
        const script = document.createElement('script')
        script.src = 'https://3Dmol.csb.pitt.edu/build/3Dmol-min.js'
        script.onload = () => {
          setViewerLoaded(true)
          initializeViewer()
        }
        document.head.appendChild(script)
      } else if (window.$3Dmol) {
        setViewerLoaded(true)
        initializeViewer()
      }
    }

    load3DMol()
  }, [])

  useEffect(() => {
    if (viewerLoaded && proteinData) {
      initializeViewer()
    }
  }, [viewerLoaded, proteinData, ligandData, selectedMode])

  const initializeViewer = () => {
    if (!viewerRef.current || !window.$3Dmol) return

    // Clear previous viewer
    viewerRef.current.innerHTML = ''

    // Create 3DMol viewer
    const viewer = window.$3Dmol.createViewer(viewerRef.current, {
      defaultcolors: window.$3Dmol.rasmolElementColors
    })

    // Add protein structure
    if (proteinData) {
      viewer.addModel(proteinData, 'pdb')
      viewer.setStyle({}, {
        cartoon: { color: 'spectrum' },
        stick: { radius: 0.3 }
      })
    } else {
      // Create mock protein structure for demonstration
      const mockProtein = generateMockProtein()
      viewer.addModel(mockProtein, 'pdb')
      viewer.setStyle({}, {
        cartoon: { color: 'spectrum' },
        stick: { radius: 0.3 }
      })
    }

    // Add ligand if available
    if (ligandData) {
      viewer.addModel(ligandData, 'sdf')
      viewer.setStyle({ model: 1 }, {
        stick: { colorscheme: 'greenCarbon', radius: 0.2 },
        sphere: { scale: 0.3, colorscheme: 'greenCarbon' }
      })
    } else {
      // Add mock ligand for demonstration
      const mockLigand = generateMockLigand(selectedMode)
      viewer.addModel(mockLigand, 'pdb')
      viewer.setStyle({ model: 1 }, {
        stick: { colorscheme: 'greenCarbon', radius: 0.2 },
        sphere: { scale: 0.3, colorscheme: 'greenCarbon' }
      })
    }

    // Add binding site visualization
    if (bindingSite) {
      viewer.addBox({
        center: { x: bindingSite.x, y: bindingSite.y, z: bindingSite.z },
        dimensions: { w: bindingSite.size_x, h: bindingSite.size_y, d: bindingSite.size_z },
        color: 'yellow',
        opacity: 0.3
      })
    }

    // Set camera and render
    viewer.zoomTo()
    viewer.render()

    // Auto-rotation
    if (isRotating) {
      const rotate = () => {
        viewer.rotate(1, 'y')
        viewer.render()
      }
      const interval = setInterval(rotate, 50)
      return () => clearInterval(interval)
    }
  }

  const generateMockProtein = () => {
    // Generate a simple helical protein structure for demonstration
    let pdb = 'HEADER    MOCK PROTEIN STRUCTURE\n'
    pdb += 'TITLE     GENERATED FOR DOCKING DEMONSTRATION\n'
    
    for (let i = 0; i < 50; i++) {
      const angle = i * 100 * Math.PI / 180
      const x = 15 * Math.cos(angle)
      const y = 15 * Math.sin(angle)
      const z = i * 1.5
      
      pdb += `ATOM  ${(i + 1).toString().padStart(5)}  CA  ALA A${(i + 1).toString().padStart(4)}    ${x.toFixed(3).padStart(8)}${y.toFixed(3).padStart(8)}${z.toFixed(3).padStart(8)}  1.00 20.00           C\n`
    }
    
    pdb += 'END\n'
    return pdb
  }

  const generateMockLigand = (mode: number) => {
    // Generate ligand position based on docking mode
    const positions = [
      { x: 5, y: 5, z: 10 },
      { x: -5, y: 8, z: 15 },
      { x: 8, y: -3, z: 20 },
      { x: -3, y: -8, z: 25 },
      { x: 0, y: 10, z: 30 }
    ]
    
    const pos = positions[mode - 1] || positions[0]
    
    let pdb = 'HEADER    MOCK LIGAND STRUCTURE\n'
    pdb += `TITLE     DOCKING MODE ${mode}\n`
    pdb += `ATOM      1  C   LIG L   1    ${pos.x.toFixed(3).padStart(8)}${pos.y.toFixed(3).padStart(8)}${pos.z.toFixed(3).padStart(8)}  1.00 20.00           C\n`
    pdb += `ATOM      2  C   LIG L   1    ${(pos.x + 1.5).toFixed(3).padStart(8)}${pos.y.toFixed(3).padStart(8)}${pos.z.toFixed(3).padStart(8)}  1.00 20.00           C\n`
    pdb += `ATOM      3  O   LIG L   1    ${(pos.x + 3).toFixed(3).padStart(8)}${pos.y.toFixed(3).padStart(8)}${pos.z.toFixed(3).padStart(8)}  1.00 20.00           O\n`
    pdb += `ATOM      4  N   LIG L   1    ${pos.x.toFixed(3).padStart(8)}${(pos.y + 1.5).toFixed(3).padStart(8)}${pos.z.toFixed(3).padStart(8)}  1.00 20.00           N\n`
    pdb += 'END\n'
    return pdb
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

  const resetView = () => {
    initializeViewer()
  }

  const toggleRotation = () => {
    setIsRotating(!isRotating)
  }

  const downloadImage = () => {
    if (viewerRef.current) {
      // This would implement screenshot functionality
      alert('Screenshot functionality would be implemented here')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Maximize2 className="h-5 w-5 text-blue-600" />
                3D Molecular Visualization
              </CardTitle>
              <CardDescription>
                Interactive 3D view of protein-ligand docking results
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={toggleRotation}>
                {isRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isRotating ? 'Pause' : 'Rotate'}
              </Button>
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={downloadImage}>
                <Download className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value="viewer" className="space-y-4">
            <TabsList>
              <TabsTrigger value="viewer">3D Viewer</TabsTrigger>
              <TabsTrigger value="modes">Binding Modes</TabsTrigger>
              <TabsTrigger value="interactions">Interactions</TabsTrigger>
            </TabsList>

            <TabsContent value="viewer" className="space-y-4">
              <div 
                ref={viewerRef}
                className="w-full h-96 border rounded-lg bg-black relative overflow-hidden"
                style={{ minHeight: '400px' }}
              >
                {!viewerLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Loading 3D Viewer...</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-medium text-blue-800">Protein</div>
                  <div className="text-blue-600">Cartoon + Sticks</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-medium text-green-800">Ligand</div>
                  <div className="text-green-600">Ball & Stick</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <div className="font-medium text-yellow-800">Binding Site</div>
                  <div className="text-yellow-600">Transparent Box</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="font-medium text-purple-800">Mode</div>
                  <div className="text-purple-600">{selectedMode}</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="modes" className="space-y-4">
              <div className="space-y-3">
                {dockingResults.length > 0 ? dockingResults.map((result, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMode === result.mode ? 'bg-blue-50 border-blue-200 border-2' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedMode(result.mode)}
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">Mode {result.mode}</Badge>
                      <span className={`font-mono font-medium ${getAffinityColor(result.affinity)}`}>
                        {result.affinity} kcal/mol
                      </span>
                      {getAffinityBadge(result.affinity)}
                    </div>
                    <div className="text-sm text-gray-500">
                      RMSD: {result.rmsd_lb} - {result.rmsd_ub} Å
                    </div>
                  </div>
                )) : (
                  // Mock data for demonstration
                  [
                    { mode: 1, affinity: -9.2, rmsd_lb: 0.5, rmsd_ub: 1.2 },
                    { mode: 2, affinity: -8.1, rmsd_lb: 1.1, rmsd_ub: 2.3 },
                    { mode: 3, affinity: -7.5, rmsd_lb: 1.8, rmsd_ub: 2.9 },
                    { mode: 4, affinity: -6.8, rmsd_lb: 2.2, rmsd_ub: 3.1 },
                    { mode: 5, affinity: -6.2, rmsd_lb: 2.8, rmsd_ub: 3.5 }
                  ].map((result, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedMode === result.mode ? 'bg-blue-50 border-blue-200 border-2' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedMode(result.mode)}
                    >
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">Mode {result.mode}</Badge>
                        <span className={`font-mono font-medium ${getAffinityColor(result.affinity)}`}>
                          {result.affinity} kcal/mol
                        </span>
                        {getAffinityBadge(result.affinity)}
                      </div>
                      <div className="text-sm text-gray-500">
                        RMSD: {result.rmsd_lb} - {result.rmsd_ub} Å
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="interactions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Hydrogen Bonds</h4>
                  <div className="space-y-1 text-sm text-blue-600">
                    <div>• Asp189 - Ligand OH (2.1 Å)</div>
                    <div>• Gln192 - Ligand NH (2.3 Å)</div>
                    <div>• Thr190 - Ligand O (2.0 Å)</div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Hydrophobic Contacts</h4>
                  <div className="space-y-1 text-sm text-green-600">
                    <div>• Phe140 - Ligand benzene ring</div>
                    <div>• Leu141 - Ligand alkyl chain</div>
                    <div>• Met165 - Ligand methyl group</div>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">π-π Stacking</h4>
                  <div className="space-y-1 text-sm text-purple-600">
                    <div>• His163 - Ligand aromatic ring</div>
                    <div>• Distance: 3.8 Å</div>
                    <div>• Angle: 12°</div>
                  </div>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">Van der Waals</h4>
                  <div className="space-y-1 text-sm text-orange-600">
                    <div>• Multiple weak interactions</div>
                    <div>• Contributing to binding stability</div>
                    <div>• Total contacts: 15</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// Extend window object for 3DMol
declare global {
  interface Window {
    $3Dmol: any
  }
}
