'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RotateCcw, Download, Maximize2, Play, Pause, Eye } from 'lucide-react'

interface DockingResult {
  mode: number
  affinity: number
  rmsd_lb: number
  rmsd_ub: number
}

interface Simple3DViewerProps {
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

export default function Simple3DViewer({ 
  dockingResults = [],
  bindingSite 
}: Simple3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedMode, setSelectedMode] = useState(1)
  const [isRotating, setIsRotating] = useState(true)
  const [rotation, setRotation] = useState(0)

  // Mock docking results if none provided
  const mockResults = dockingResults.length > 0 ? dockingResults : [
    { mode: 1, affinity: -9.2, rmsd_lb: 0.5, rmsd_ub: 1.2 },
    { mode: 2, affinity: -8.1, rmsd_lb: 1.1, rmsd_ub: 2.3 },
    { mode: 3, affinity: -7.5, rmsd_lb: 1.8, rmsd_ub: 2.9 },
    { mode: 4, affinity: -6.8, rmsd_lb: 2.2, rmsd_ub: 3.1 },
    { mode: 5, affinity: -6.2, rmsd_lb: 2.8, rmsd_ub: 3.5 }
  ]

  useEffect(() => {
    let animationId: number

    if (isRotating) {
      const animate = () => {
        setRotation(prev => (prev + 1) % 360)
        animationId = requestAnimationFrame(animate)
      }
      animationId = requestAnimationFrame(animate)
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isRotating])

  useEffect(() => {
    drawMolecularStructure()
  }, [rotation, selectedMode])

  const drawMolecularStructure = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Clear canvas with gradient background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(canvas.width, canvas.height) / 2)
    gradient.addColorStop(0, '#1e3a8a')
    gradient.addColorStop(0.5, '#7c3aed')
    gradient.addColorStop(1, '#000000')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw protein backbone (helix)
    ctx.strokeStyle = '#60a5fa'
    ctx.lineWidth = 3
    ctx.beginPath()

    const helixRadius = 80
    const helixHeight = 200
    const turns = 3

    for (let i = 0; i <= 100; i++) {
      const t = i / 100
      const angle = t * turns * 2 * Math.PI + (rotation * Math.PI / 180)
      const x = centerX + helixRadius * Math.cos(angle)
      const y = centerY - helixHeight / 2 + t * helixHeight
      const z = helixRadius * Math.sin(angle)

      // Simple 3D projection
      const scale = 1 + z / 200
      const projX = centerX + (x - centerX) * scale
      const projY = centerY + (y - centerY) * scale

      if (i === 0) {
        ctx.moveTo(projX, projY)
      } else {
        ctx.lineTo(projX, projY)
      }
    }
    ctx.stroke()

    // Draw protein atoms
    for (let i = 0; i <= 20; i++) {
      const t = i / 20
      const angle = t * turns * 2 * Math.PI + (rotation * Math.PI / 180)
      const x = centerX + helixRadius * Math.cos(angle)
      const y = centerY - helixHeight / 2 + t * helixHeight
      const z = helixRadius * Math.sin(angle)

      const scale = 1 + z / 200
      const projX = centerX + (x - centerX) * scale
      const projY = centerY + (y - centerY) * scale

      // Draw atom
      ctx.fillStyle = z > 0 ? '#3b82f6' : '#1e40af'
      ctx.beginPath()
      ctx.arc(projX, projY, 4 * scale, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Draw ligand based on selected mode
    const ligandPositions = [
      { x: centerX + 60, y: centerY - 20, color: '#10b981' },
      { x: centerX - 40, y: centerY + 30, color: '#059669' },
      { x: centerX + 20, y: centerY - 50, color: '#047857' },
      { x: centerX - 60, y: centerY + 10, color: '#065f46' },
      { x: centerX + 40, y: centerY + 40, color: '#064e3b' }
    ]

    const ligandPos = ligandPositions[selectedMode - 1] || ligandPositions[0]
    
    // Rotate ligand position
    const ligandAngle = rotation * Math.PI / 180
    const rotatedX = centerX + (ligandPos.x - centerX) * Math.cos(ligandAngle) - (ligandPos.y - centerY) * Math.sin(ligandAngle)
    const rotatedY = centerY + (ligandPos.x - centerX) * Math.sin(ligandAngle) + (ligandPos.y - centerY) * Math.cos(ligandAngle)

    // Draw ligand molecule
    ctx.fillStyle = ligandPos.color
    ctx.beginPath()
    ctx.arc(rotatedX, rotatedY, 8, 0, 2 * Math.PI)
    ctx.fill()

    // Draw ligand bonds
    ctx.strokeStyle = ligandPos.color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(rotatedX - 15, rotatedY)
    ctx.lineTo(rotatedX + 15, rotatedY)
    ctx.moveTo(rotatedX, rotatedY - 15)
    ctx.lineTo(rotatedX, rotatedY + 15)
    ctx.stroke()

    // Draw binding site box
    if (bindingSite) {
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.strokeRect(
        centerX - bindingSite.size_x / 4,
        centerY - bindingSite.size_y / 4,
        bindingSite.size_x / 2,
        bindingSite.size_y / 2
      )
      ctx.setLineDash([])
    }

    // Draw labels
    ctx.fillStyle = '#ffffff'
    ctx.font = '14px Arial'
    ctx.fillText('Protein', 20, 30)
    ctx.fillStyle = ligandPos.color
    ctx.fillText(`Ligand (Mode ${selectedMode})`, 20, 50)
    ctx.fillStyle = '#fbbf24'
    ctx.fillText('Binding Site', 20, 70)
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

  const toggleRotation = () => {
    setIsRotating(!isRotating)
  }

  const resetView = () => {
    setRotation(0)
    setSelectedMode(1)
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const link = document.createElement('a')
      link.download = `molecular-docking-mode-${selectedMode}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              3D Molecular Visualization
            </CardTitle>
            <CardDescription>
              Interactive visualization of protein-ligand docking results
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
        <Tabs defaultValue="viewer" className="space-y-4">
          <TabsList>
            <TabsTrigger value="viewer">3D Viewer</TabsTrigger>
            <TabsTrigger value="modes">Binding Modes</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
          </TabsList>

          <TabsContent value="viewer" className="space-y-4">
            <canvas 
              ref={canvasRef}
              className="w-full h-96 border rounded-lg cursor-pointer"
              style={{ minHeight: '400px' }}
              onClick={() => setIsRotating(!isRotating)}
            />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-medium text-blue-800">Protein</div>
                <div className="text-blue-600">Helix Structure</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-medium text-green-800">Ligand</div>
                <div className="text-green-600">Mode {selectedMode}</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="font-medium text-yellow-800">Binding Site</div>
                <div className="text-yellow-600">Active Area</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="font-medium text-purple-800">Rotation</div>
                <div className="text-purple-600">{rotation.toFixed(0)}°</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="modes" className="space-y-4">
            <div className="space-y-3">
              {mockResults.map((result, index) => (
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
              ))}
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
  )
}
