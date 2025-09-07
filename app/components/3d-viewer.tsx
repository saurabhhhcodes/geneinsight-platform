"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, Download } from "lucide-react"

declare global {
  interface Window {
    $3Dmol: any
  }
}

interface MolecularViewerProps {
  pdbId?: string
  pdbData?: string
  width?: number
  height?: number
  onStructureLoad?: () => void
}

export function MolecularViewer({
  pdbId = "1BNA",
  pdbData,
  width = 800,
  height = 600,
  onStructureLoad,
}: MolecularViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const [viewer, setViewer] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isRotating, setIsRotating] = useState(true)
  const [colorScheme, setColorScheme] = useState("spectrum")
  const [representation, setRepresentation] = useState("cartoon")
  const [zoom, setZoom] = useState([100])

  useEffect(() => {
    // Load 3Dmol.js script
    const script = document.createElement("script")
    script.src = "https://3Dmol.org/build/3Dmol-min.js"
    script.async = true
    script.onload = () => {
      initializeViewer()
    }
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [initializeViewer])

  const initializeViewer = () => {
    if (!viewerRef.current || !window.$3Dmol) return

    const config = {
      defaultcolors: window.$3Dmol.rasmolElementColors,
    }

    const newViewer = window.$3Dmol.createViewer(viewerRef.current, config)
    setViewer(newViewer)

    // Load structure
    if (pdbData) {
      newViewer.addModel(pdbData, "pdb")
      applyStyles(newViewer)
    } else if (pdbId) {
      window.$3Dmol.download(`pdb:${pdbId}`, newViewer, {}, () => {
        applyStyles(newViewer)
      })
    }
  }

  const applyStyles = (viewerInstance: any) => {
    // Apply default styling
    viewerInstance.setStyle({}, { cartoon: { color: "spectrum" } })

    // Highlight DNA bases with different colors
    viewerInstance.setStyle({ resn: "DA" }, { stick: { colorscheme: "blueCarbon" } })
    viewerInstance.setStyle({ resn: "DT" }, { stick: { colorscheme: "redCarbon" } })
    viewerInstance.setStyle({ resn: "DG" }, { stick: { colorscheme: "greenCarbon" } })
    viewerInstance.setStyle({ resn: "DC" }, { stick: { colorscheme: "yellowCarbon" } })

    viewerInstance.zoomTo()
    viewerInstance.render()
    viewerInstance.zoom(1.2, 1000)

    setIsLoaded(true)
    onStructureLoad?.()
  }

  useEffect(() => {
    if (!viewer || !isLoaded) return

    let animationId: number

    const rotate = () => {
      if (isRotating) {
        viewer.rotate(1, "y")
        viewer.render()
      }
      animationId = requestAnimationFrame(rotate)
    }

    animationId = requestAnimationFrame(rotate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [viewer, isRotating, isLoaded])

  const handleRepresentationChange = (newRepresentation: string) => {
    if (!viewer) return

    setRepresentation(newRepresentation)

    const styleMap: { [key: string]: any } = {
      cartoon: { cartoon: { color: colorScheme } },
      stick: { stick: { colorscheme: colorScheme } },
      sphere: { sphere: { colorscheme: colorScheme } },
      surface: { surface: { color: colorScheme, opacity: 0.8 } },
      ribbon: { ribbon: { color: colorScheme } },
    }

    viewer.setStyle({}, styleMap[newRepresentation] || styleMap.cartoon)
    viewer.render()
  }

  const handleColorSchemeChange = (newColorScheme: string) => {
    if (!viewer) return

    setColorScheme(newColorScheme)
    handleRepresentationChange(representation) // Reapply with new color scheme
  }

  const handleZoomChange = (newZoom: number[]) => {
    if (!viewer) return

    setZoom(newZoom)
    viewer.zoom(newZoom[0] / 100, 500)
    viewer.render()
  }

  const handleResetView = () => {
    if (!viewer) return

    viewer.zoomTo()
    viewer.render()
    setZoom([100])
  }

  const handleDownloadImage = () => {
    if (!viewer) return

    viewer.pngURI((uri: string) => {
      const link = document.createElement("a")
      link.href = uri
      link.download = `molecular_structure_${pdbId || "custom"}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>3D Molecular Structure</span>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={() => setIsRotating(!isRotating)}>
                {isRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="outline" onClick={handleResetView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownloadImage}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-4 gap-6">
            {/* 3D Viewer */}
            <div className="lg:col-span-3">
              <div
                ref={viewerRef}
                style={{ width: "100%", height: `${height}px` }}
                className="border rounded-lg bg-gray-900 relative"
              >
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p>Loading 3D Structure...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Representation</label>
                <Select value={representation} onValueChange={handleRepresentationChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cartoon">Cartoon</SelectItem>
                    <SelectItem value="stick">Stick</SelectItem>
                    <SelectItem value="sphere">Sphere</SelectItem>
                    <SelectItem value="surface">Surface</SelectItem>
                    <SelectItem value="ribbon">Ribbon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Color Scheme</label>
                <Select value={colorScheme} onValueChange={handleColorSchemeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spectrum">Spectrum</SelectItem>
                    <SelectItem value="element">By Element</SelectItem>
                    <SelectItem value="residue">By Residue</SelectItem>
                    <SelectItem value="chain">By Chain</SelectItem>
                    <SelectItem value="secondary">Secondary Structure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Zoom Level</label>
                <Slider value={zoom} onValueChange={handleZoomChange} max={200} min={50} step={10} className="w-full" />
                <div className="text-xs text-gray-500 text-center mt-1">{zoom[0]}%</div>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full bg-transparent" variant="outline" onClick={handleDownloadImage}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Image
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
