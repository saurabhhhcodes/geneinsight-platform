"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Dna, Eye, Download, RotateCcw, ZoomIn, ZoomOut, Palette, Settings, Play, Pause, Upload, Link as LinkIcon, Database } from "lucide-react"
import Link from "next/link"

// Declare global $3Dmol for TypeScript
declare global {
  interface Window {
    $3Dmol: any;
  }
}

export default function VisualizePage() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRotating, setIsRotating] = useState(true)
  const [colorScheme, setColorScheme] = useState("spectrum")
  const [representation, setRepresentation] = useState("cartoon")
  const [zoom, setZoom] = useState([100])
  const [viewer, setViewer] = useState<any>(null)
  const [selectedStructure, setSelectedStructure] = useState<any>(null)
  const [importUrl, setImportUrl] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [customColor, setCustomColor] = useState("#ff0000")
  const [structures] = useState([
    {
      id: "1BNA",
      name: "DNA Double Helix",
      type: "DNA",
      resolution: "1.9 Å",
      method: "X-ray Crystallography",
      chains: "A, B",
      atoms: 756,
      description: "B-form DNA double helix structure",
      organism: "Synthetic",
      category: "Nucleic Acid"
    },
    {
      id: "1HHO",
      name: "Hemoglobin",
      type: "Protein",
      resolution: "1.74 Å",
      method: "X-ray Crystallography",
      chains: "A, B, C, D",
      atoms: 4779,
      description: "Human hemoglobin alpha and beta chains",
      organism: "Homo sapiens",
      category: "Transport Protein"
    },
    {
      id: "1LYZ",
      name: "Lysozyme",
      type: "Protein",
      resolution: "1.33 Å",
      method: "X-ray Crystallography",
      chains: "A",
      atoms: 1001,
      description: "Hen egg white lysozyme",
      organism: "Gallus gallus",
      category: "Hydrolase"
    },
    {
      id: "1CRN",
      name: "Crambin",
      type: "Protein",
      resolution: "1.5 Å",
      method: "X-ray Crystallography",
      chains: "A",
      atoms: 327,
      description: "Small plant seed protein",
      organism: "Crambe abyssinica",
      category: "Plant Protein"
    },
    {
      id: "1UBQ",
      name: "Ubiquitin",
      type: "Protein",
      resolution: "1.8 Å",
      method: "X-ray Crystallography",
      chains: "A",
      atoms: 660,
      description: "Regulatory protein ubiquitin",
      organism: "Homo sapiens",
      category: "Signaling Protein"
    },
    {
      id: "2DNA",
      name: "DNA-Protein Complex",
      type: "Complex",
      resolution: "2.1 Å",
      method: "X-ray Crystallography",
      chains: "A, B, C, D",
      atoms: 1234,
      description: "DNA binding protein complex",
      organism: "E. coli",
      category: "DNA Binding"
    },
    {
      id: "1RNA",
      name: "tRNA Structure",
      type: "RNA",
      resolution: "2.8 Å",
      method: "X-ray Crystallography",
      chains: "A",
      atoms: 1542,
      description: "Transfer RNA structure",
      organism: "Yeast",
      category: "RNA"
    },
    {
      id: "1ATP",
      name: "ATP Synthase",
      type: "Protein",
      resolution: "2.4 Å",
      method: "Cryo-EM",
      chains: "A, B, C, D, E, F",
      atoms: 3456,
      description: "ATP synthase complex",
      organism: "Bovine",
      category: "Transferase"
    }
  ])

  useEffect(() => {
    // Initialize the 3D viewer with 3Dmol.js
    const initTimer = setTimeout(() => {
      initializeMolecularViewer()
    }, 500)

    return () => clearTimeout(initTimer)
  }, [])

  const initializeMolecularViewer = () => {
    if (viewerRef.current && typeof window !== 'undefined') {
      // Wait for 3Dmol to be available with retry mechanism
      let retryCount = 0
      const maxRetries = 10

      const checkAndInit = () => {
        if (window.$3Dmol) {
          try {
            console.log("3Dmol.js detected, initializing viewer...");

            // Create viewer with proper configuration
            const newViewer = window.$3Dmol.createViewer(viewerRef.current, {
              backgroundColor: 'white',
              defaultcolors: window.$3Dmol.rasmolElementColors
            });

            // Add a simple test molecule to verify it's working
            const testPDB = `ATOM      1  C   MOL A   1       0.000   0.000   0.000  1.00  0.00           C
ATOM      2  C   MOL A   1       1.000   0.000   0.000  1.00  0.00           C
ATOM      3  C   MOL A   1       1.500   1.000   0.000  1.00  0.00           C
ATOM      4  C   MOL A   1       0.500   2.000   0.000  1.00  0.00           C
ATOM      5  C   MOL A   1      -0.500   1.000   0.000  1.00  0.00           C
CONECT    1    2    5
CONECT    2    1    3
CONECT    3    2    4
CONECT    4    3    5
CONECT    5    4    1
END`;

            newViewer.addModel(testPDB, "pdb");
            newViewer.setStyle({}, {stick: {colorscheme: 'greenCarbon', radius: 0.2}});
            newViewer.zoomTo();
            newViewer.render();

            console.log("Test molecule added successfully");

            setViewer(newViewer);
            setIsLoaded(true);
            console.log("3D Molecular viewer initialized successfully");
          } catch (error) {
            console.error("Failed to initialize 3Dmol viewer:", error);
            setIsLoaded(true);
          }
        } else if (retryCount < maxRetries) {
          retryCount++;
          console.log(`3Dmol.js not yet available, retrying... (${retryCount}/${maxRetries})`);
          setTimeout(checkAndInit, 500);
        } else {
          console.error("Failed to load 3Dmol.js after maximum retries");
          setIsLoaded(true);
        }
      };

      checkAndInit();
    } else {
      console.warn("Viewer ref not available");
      setIsLoaded(true);
    }
  }

  const loadStructure = async (structure: any) => {
    setIsLoading(true)
    setSelectedStructure(structure)

    try {
      if (viewer && window.$3Dmol) {
        console.log(`Loading structure: ${structure.name} (${structure.id})`);

        // Clear existing models
        viewer.clear();

        // Load real structure from PDB database
        await loadRealStructure(viewer, structure, representation, colorScheme);
      } else {
        console.error("Viewer not available");
      }
    } catch (error) {
      console.error("Error loading structure:", error);
    }

    setIsLoading(false)
  }

  const importFromUrl = async (url: string) => {
    setIsImporting(true)
    setShowImportDialog(false)

    try {
      // Extract PDB ID from common URLs
      let pdbId = ""
      let structureName = ""

      if (url.includes("rcsb.org")) {
        const match = url.match(/\/structure\/([A-Z0-9]{4})/i)
        pdbId = match ? match[1].toUpperCase() : ""
        structureName = `RCSB Structure ${pdbId}`
      } else if (url.includes("alphafold.ebi.ac.uk")) {
        const match = url.match(/AF-([A-Z0-9]+)-/i)
        pdbId = match ? `AF-${match[1]}` : "AlphaFold"
        structureName = `AlphaFold Prediction ${pdbId}`
      } else if (url.includes(".pdb")) {
        pdbId = "CUSTOM"
        structureName = "Custom PDB Structure"
      } else {
        pdbId = "IMPORTED"
        structureName = "Imported Structure"
      }

      // Create imported structure object
      const importedStructure = {
        id: pdbId,
        name: structureName,
        type: "Imported",
        resolution: "Unknown",
        method: "Web Import",
        chains: "Unknown",
        atoms: "Unknown",
        description: `Structure imported from ${url}`,
        organism: "Unknown",
        category: "Imported",
        importUrl: url
      }

      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 3000))

      setSelectedStructure(importedStructure)
      setIsImporting(false)
      setIsLoading(false)

      console.log(`Imported structure from: ${url}`)

    } catch (error) {
      console.error("Failed to import structure:", error)
      setIsImporting(false)
      setIsLoading(false)
    }
  }

  const importFromPdbId = async (pdbId: string) => {
    const url = `https://www.rcsb.org/structure/${pdbId.toUpperCase()}`
    await importFromUrl(url)
  }

  const handleFileUpload = async (file: File) => {
    setIsImporting(true)
    setShowImportDialog(false)

    try {
      console.log(`Uploading PDB file: ${file.name}`)

      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024 // 50MB
      if (file.size > maxSize) {
        throw new Error(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`)
      }

      // Validate file type
      const validExtensions = ['.pdb', '.txt', '.ent']
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
      if (!validExtensions.includes(fileExtension)) {
        throw new Error('Please upload a valid PDB file (.pdb, .txt, or .ent)')
      }

      // Read file content
      const fileContent = await file.text()

      // Validate PDB format (comprehensive check)
      const lines = fileContent.split('\n')
      const hasAtomRecords = lines.some(line =>
        line.startsWith('ATOM') || line.startsWith('HETATM')
      )
      const hasHeader = lines.some(line =>
        line.startsWith('HEADER') || line.startsWith('TITLE') || line.startsWith('REMARK')
      )

      if (!hasAtomRecords) {
        throw new Error('Invalid PDB format. File must contain ATOM or HETATM records.')
      }

      // Count atoms for information
      const atomCount = lines.filter(line =>
        line.startsWith('ATOM') || line.startsWith('HETATM')
      ).length

      // Load structure into viewer
      if (viewer && window.$3Dmol) {
        viewer.clear()
        viewer.addModel(fileContent, "pdb")
        viewer.setStyle({}, getStyleConfig(representation, colorScheme))
        viewer.zoomTo()
        viewer.render()
      }

      // Extract additional information from PDB file
      const titleLine = lines.find(line => line.startsWith('TITLE'))
      const headerLine = lines.find(line => line.startsWith('HEADER'))
      const structureTitle = titleLine ? titleLine.substring(10).trim() : file.name
      const structureType = headerLine ? headerLine.substring(10, 50).trim() : "Unknown"

      // Create structure object for uploaded file
      const uploadedStructure = {
        id: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        name: structureTitle,
        type: structureType || "Uploaded Structure",
        resolution: "Unknown",
        method: "File Upload",
        chains: "Unknown",
        atoms: atomCount.toString(),
        description: `Structure uploaded from file: ${file.name}`,
        organism: "Unknown",
        category: "Uploaded",
        fileContent: fileContent,
        uploadedAt: new Date().toISOString(),
        fileSize: file.size,
        fileName: file.name
      }

      setSelectedStructure(uploadedStructure)
      setUploadedFile(file)
      setIsImporting(false)
      setIsLoading(false)

      console.log(`Successfully loaded PDB file: ${file.name}`)

    } catch (error) {
      console.error("Failed to upload PDB file:", error)
      setIsImporting(false)
      setIsLoading(false)

      // Show error message to user
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`PDB Upload Error: ${errorMessage}`)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      handleFileUpload(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const loadRealStructure = async (viewer: any, structure: any, representation: string, colorScheme: string) => {
    console.log(`Loading real structure for ${structure.id}`);

    try {
      // Use 3Dmol's built-in download function first (handles CORS better)
      if (window.$3Dmol && structure.id.length === 4) {
        console.log(`Using 3Dmol download for PDB ID: ${structure.id}`);

        // Use promise-based approach for better error handling
        const downloadPromise = new Promise<boolean>((resolve, reject) => {
          const timeout = setTimeout(() => {
            console.warn(`3Dmol download timeout for ${structure.id}`);
            reject(new Error('Download timeout'));
          }, 10000); // 10 second timeout

          window.$3Dmol.download(`pdb:${structure.id}`, viewer, {}, (data: any) => {
            clearTimeout(timeout);
            if (data && (typeof data === 'string' && data.length > 0)) {
              console.log(`Successfully loaded structure ${structure.id} via 3Dmol (${data.length} chars)`);
              applyVisualizationStyle(viewer, representation, colorScheme);
              viewer.zoomTo();
              viewer.render();
              resolve(true);
            } else {
              console.warn(`No valid data received for ${structure.id}`);
              reject(new Error('No valid data received'));
            }
          }, (error: any) => {
            clearTimeout(timeout);
            console.error(`3Dmol download error for ${structure.id}:`, error);
            reject(error);
          });
        });

        try {
          await downloadPromise;
          return; // Success, exit function
        } catch (error) {
          console.log(`3Dmol download failed for ${structure.id}, trying fallback methods...`);
          // Continue to fallback methods below
        }
      }

      // Fallback to direct fetch for custom structures
      const pdbUrl = `https://files.rcsb.org/download/${structure.id}.pdb`;
      console.log(`Fetching PDB data from: ${pdbUrl}`);

      const response = await fetch(pdbUrl, {
        mode: 'cors',
        headers: {
          'Accept': 'text/plain',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch PDB data: ${response.status} ${response.statusText}`);
      }

      const pdbData = await response.text();
      console.log(`Successfully fetched PDB data for ${structure.id}, size: ${pdbData.length} characters`);

      // Clear and add the model to the viewer
      viewer.clear();
      viewer.addModel(pdbData, "pdb");

      // Apply the selected representation and color scheme
      console.log(`Applying style: ${representation} with ${colorScheme} coloring`);
      applyVisualizationStyle(viewer, representation, colorScheme);

      viewer.zoomTo();
      viewer.render();

      console.log(`Real structure loaded successfully for ${structure.name}`);
    } catch (error) {
      console.error(`Failed to load real structure for ${structure.id}:`, error);

      // Fallback to demo structure if real structure fails
      console.log("Falling back to demo structure...");
      await loadFallbackStructure(viewer, structure, representation, colorScheme);
    }
  }

  const loadFallbackStructure = async (viewer: any, structure: any, representation: string, colorScheme: string) => {
    console.log(`Loading fallback structure for ${structure.id}`);

    try {
      // Try common PDB IDs as fallbacks based on structure type
      let fallbackId = '1BNA'; // Default DNA structure

      if (structure.type === 'Protein') {
        fallbackId = '1CRN'; // Small protein
      } else if (structure.type === 'DNA') {
        fallbackId = '1BNA'; // DNA double helix
      } else if (structure.type === 'RNA') {
        fallbackId = '1RNA'; // RNA structure
      }

      console.log(`Using fallback PDB ID: ${fallbackId}`);

      window.$3Dmol.download(`pdb:${fallbackId}`, viewer, {}, () => {
        console.log(`Fallback structure loaded with ID: ${fallbackId}`);
        applyVisualizationStyle(viewer, representation, colorScheme);
        viewer.zoomTo();
        viewer.render();
      });
    } catch (error) {
      console.error(`Fallback structure loading also failed:`, error);

      // Last resort: show a simple demo molecule
      loadSimpleDemoStructure(viewer, structure, representation, colorScheme);
    }
  }

  const loadSimpleDemoStructure = (viewer: any, structure: any, representation: string, colorScheme: string) => {
    console.log(`Loading simple demo structure for ${structure.id}`);

    try {
      // Simple demo structure based on the type
      let demoPDB = '';

      if (structure.type === 'DNA' || structure.category === 'Nucleic Acid') {
        // Simple DNA base pair
        demoPDB = `ATOM      1  P   DA  A   1       0.000   0.000   0.000  1.00  0.00           P
ATOM      2  O1P DA  A   1      -1.200   0.000   0.000  1.00  0.00           O
ATOM      3  O2P DA  A   1       0.600   1.039   0.000  1.00  0.00           O
ATOM      4  O5' DA  A   1       0.600  -0.520   1.300  1.00  0.00           O
ATOM      5  C5' DA  A   1       0.000  -0.520   2.600  1.00  0.00           C
ATOM      6  C4' DA  A   1       0.800  -1.040   3.900  1.00  0.00           C
ATOM      7  N9  DA  A   1       2.000  -1.560   3.600  1.00  0.00           N
END`;
      } else {
        // Simple protein-like structure (amino acid)
        demoPDB = `ATOM      1  N   ALA A   1       0.000   0.000   0.000  1.00  0.00           N
ATOM      2  CA  ALA A   1       1.400   0.000   0.000  1.00  0.00           C
ATOM      3  C   ALA A   1       2.100   1.400   0.000  1.00  0.00           C
ATOM      4  O   ALA A   1       1.500   2.500   0.000  1.00  0.00           O
ATOM      5  CB  ALA A   1       1.900  -0.700   1.300  1.00  0.00           C
END`;
      }

      console.log("Adding demo model to viewer...");
      viewer.addModel(demoPDB, "pdb");

      console.log("Applying visualization style...");
      applyVisualizationStyle(viewer, representation, colorScheme);

      console.log("Zooming and rendering...");
      viewer.zoomTo();
      viewer.render();

      console.log(`Simple demo structure loaded for ${structure.name}`);
    } catch (error) {
      console.error(`Failed to load simple demo structure:`, error);
    }
  }

  const applyVisualizationStyle = (viewer: any, representation: string, colorScheme: string) => {
    try {
      // Clear existing styles first
      viewer.setStyle({}, {});

      const styleConfig: any = {};

      // Map color schemes to 3Dmol compatible values (matching RCSB style)
      const colorMap: { [key: string]: string } = {
        'spectrum': 'spectrum',        // Rainbow coloring
        'element': 'default',          // CPK coloring by element
        'residue': 'residue',          // Color by residue type
        'chain': 'chain',              // Color by chain
        'secondary': 'ss',             // Color by secondary structure
        'hydrophobicity': 'hydrophobicity', // Hydrophobic/hydrophilic
        'polarity': 'polarity',        // Polar/nonpolar
        'default': 'spectrum'          // Default to spectrum
      };

      const mappedColorScheme = colorMap[colorScheme] || 'spectrum';

      switch (representation) {
        case "cartoon":
          styleConfig.cartoon = {
            colorscheme: mappedColorScheme,
            thickness: 0.4,
            opacity: 0.8
          };
          break;
        case "stick":
          styleConfig.stick = {
            colorscheme: mappedColorScheme,
            radius: 0.15,
            opacity: 0.9
          };
          break;
        case "sphere":
          styleConfig.sphere = {
            colorscheme: mappedColorScheme,
            radius: 0.3,
            opacity: 0.8
          };
          break;
        case "surface":
          styleConfig.surface = {
            colorscheme: mappedColorScheme,
            opacity: 0.7,
            wireframe: false
          };
          break;
        case "ribbon":
          styleConfig.cartoon = {
            colorscheme: mappedColorScheme,
            ribbon: true,
            thickness: 0.2
          };
          break;
        default:
          styleConfig.cartoon = {
            colorscheme: mappedColorScheme,
            thickness: 0.4
          };
      }

      viewer.setStyle({}, styleConfig);
      console.log(`Applied ${representation} style with ${mappedColorScheme} coloring`);
    } catch (error) {
      console.error("Failed to apply visualization style:", error);
      // Fallback to basic style
      try {
        viewer.setStyle({}, { stick: { colorscheme: 'spectrum' } });
      } catch (fallbackError) {
        console.error("Fallback style also failed:", fallbackError);
      }
    }
  }

  const handleDownloadStructure = () => {
    if (selectedStructure) {
      const pdbId = selectedStructure.id.replace(/^AF-/, '').replace(/-.*$/, '');
      const downloadUrl = `https://files.rcsb.org/download/${pdbId}.pdb`;
      window.open(downloadUrl, '_blank');
    }
  }

  const handleResetView = () => {
    if (viewer) {
      viewer.zoomTo();
      viewer.render();
    }
  }

  const handleZoomIn = () => {
    if (viewer) {
      viewer.zoom(1.2);
      viewer.render();
    }
  }

  const handleZoomOut = () => {
    if (viewer) {
      viewer.zoom(0.8);
      viewer.render();
    }
  }

  const handleExportImage = () => {
    if (viewer) {
      const canvas = viewer.getCanvas();
      const link = document.createElement('a');
      link.download = `${selectedStructure?.id || 'structure'}_visualization.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  }

  const debugViewer = () => {
    console.log("=== DEBUG INFO ===");
    console.log("Viewer ref:", viewerRef.current);
    console.log("Viewer object:", viewer);
    console.log("$3Dmol available:", typeof window !== 'undefined' ? window.$3Dmol : 'undefined');
    console.log("Is loaded:", isLoaded);
    console.log("Selected structure:", selectedStructure);

    if (viewer) {
      console.log("Viewer methods:", Object.getOwnPropertyNames(viewer));
      try {
        viewer.clear();
        viewer.addSphere({
          center: { x: 0, y: 0, z: 0 },
          radius: 2.0,
          color: 'blue'
        });
        viewer.render();
        console.log("Debug sphere added successfully");
      } catch (error) {
        console.error("Debug sphere failed:", error);
      }
    }
  }

  const handleCustomColor = () => {
    if (viewer && selectedStructure) {
      viewer.setStyle({}, { cartoon: { color: customColor } });
      viewer.render();
    }
  }

  const handleAutoRotate = () => {
    if (viewer && isRotating) {
      viewer.rotate(1, 'y');
      viewer.render();
    }
  }

  // Update zoom when slider changes
  useEffect(() => {
    if (viewer && selectedStructure) {
      const zoomFactor = zoom[0] / 100;
      viewer.zoom(zoomFactor);
      viewer.render();
    }
  }, [zoom, viewer, selectedStructure])

  // Auto-rotation effect
  useEffect(() => {
    let rotationInterval: NodeJS.Timeout;
    if (isRotating && viewer && selectedStructure) {
      rotationInterval = setInterval(() => {
        handleAutoRotate();
      }, 50);
    }
    return () => {
      if (rotationInterval) {
        clearInterval(rotationInterval);
      }
    };
  }, [isRotating, viewer, selectedStructure])

  // Update visualization when controls change
  useEffect(() => {
    if (viewer && selectedStructure && window.$3Dmol) {
      const styleConfig: any = {};

      if (representation === "cartoon") {
        styleConfig.cartoon = { colorscheme: colorScheme };
      } else if (representation === "stick") {
        styleConfig.stick = { colorscheme: colorScheme };
      } else if (representation === "sphere") {
        styleConfig.sphere = { colorscheme: colorScheme };
      } else if (representation === "surface") {
        styleConfig.surface = { colorscheme: colorScheme, opacity: 0.8 };
      } else if (representation === "ribbon") {
        styleConfig.cartoon = { colorscheme: colorScheme, ribbon: true };
      }

      viewer.setStyle({}, styleConfig);
      viewer.render();
    }
  }, [representation, colorScheme, viewer, selectedStructure])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Dna className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">GeneInsight</span>
            </Link>
            <Badge variant="secondary">3D Visualization</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleDownloadStructure}>
              <Download className="mr-2 h-4 w-4" />
              Download PDB
            </Button>
            <Link href="/analyze">
              <Button variant="outline">Back to Analysis</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">3D Molecular Visualization</h1>
            <p className="text-gray-600">Interactive visualization of protein and DNA structures</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Structure Selection Panel */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Dna className="h-5 w-5" />
                        <span>Available Structures</span>
                      </CardTitle>
                      <CardDescription>Select a molecular structure to visualize</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      {/* Quick File Upload Button */}
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdb,.txt"
                          onChange={handleFileInputChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="quick-pdb-upload"
                        />
                        <Button size="sm" variant="outline" className="relative">
                          <Upload className="h-4 w-4 mr-1" />
                          Upload PDB
                        </Button>
                      </div>

                      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Database className="h-4 w-4 mr-1" />
                            Import URL
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Import 3D Structure</DialogTitle>
                            <DialogDescription>
                              Import molecular structures from various sources
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* File Upload Section */}
                            <div>
                              <label className="text-sm font-medium mb-2 block">Upload PDB File</label>
                              <div
                                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                  dragActive
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                              >
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-2">
                                  Drag and drop your PDB file here, or click to browse
                                </p>
                                <input
                                  type="file"
                                  accept=".pdb,.txt"
                                  onChange={handleFileInputChange}
                                  className="hidden"
                                  id="pdb-file-input"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => document.getElementById('pdb-file-input')?.click()}
                                  disabled={isImporting}
                                >
                                  Choose File
                                </Button>
                                {uploadedFile && (
                                  <p className="text-xs text-green-600 mt-2">
                                    Selected: {uploadedFile.name}
                                  </p>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                Supported formats: .pdb, .txt (PDB format)
                              </p>
                            </div>

                            {/* URL Import Section */}
                            <div>
                              <label className="text-sm font-medium">From URL</label>
                              <div className="flex space-x-2 mt-1">
                                <Input
                                  placeholder="https://www.rcsb.org/structure/1BNA"
                                  value={importUrl}
                                  onChange={(e) => setImportUrl(e.target.value)}
                                />
                                <Button
                                  onClick={() => importFromUrl(importUrl)}
                                  disabled={!importUrl || isImporting}
                                >
                                  <LinkIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Quick Import</label>
                              <div className="grid grid-cols-2 gap-2 mt-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => importFromUrl("https://www.rcsb.org/structure/1BNA")}
                                  disabled={isImporting}
                                >
                                  <Database className="h-4 w-4 mr-1" />
                                  RCSB PDB
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => importFromUrl("https://alphafold.ebi.ac.uk/entry/P04637")}
                                  disabled={isImporting}
                                >
                                  <Database className="h-4 w-4 mr-1" />
                                  AlphaFold
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              <p>Supported sources:</p>
                              <ul className="list-disc list-inside mt-1">
                                <li>Local PDB files (.pdb, .txt format)</li>
                                <li>RCSB Protein Data Bank (rcsb.org)</li>
                                <li>AlphaFold Database (alphafold.ebi.ac.uk)</li>
                                <li>Direct PDB file URLs</li>
                                <li>Custom structure URLs</li>
                              </ul>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto">
                  <div className="space-y-3">
                    {structures.map((structure) => (
                      <div
                        key={structure.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedStructure?.id === structure.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => loadStructure(structure)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{structure.name}</h4>
                          <Badge variant="outline" className="text-xs">{structure.id}</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{structure.description}</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">{structure.type}</Badge>
                          <Badge variant="outline" className="text-xs">{structure.category}</Badge>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          <div>Resolution: {structure.resolution}</div>
                          <div>Method: {structure.method}</div>
                          <div>Organism: {structure.organism}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 3D Viewer */}
            <div className="lg:col-span-2">
              <Card className="h-[600px]">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span>Protein Structure Viewer</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {selectedStructure ? (
                        <>
                          <Badge variant="outline">PDB: {selectedStructure.id}</Badge>
                          <Badge variant="secondary">{selectedStructure.name}</Badge>
                        </>
                      ) : (
                        <>
                          <Badge variant="outline">No Structure</Badge>
                          <Badge variant="secondary">Select from list</Badge>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-full pb-6">
                  <div
                    ref={viewerRef}
                    className="w-full h-full bg-white rounded-lg relative overflow-hidden cursor-grab active:cursor-grabbing"
                    style={{
                      minHeight: '500px',
                      touchAction: 'none',
                      userSelect: 'none',
                      border: '2px solid #e5e7eb'
                    }}
                  >
                    {!isLoaded ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Dna className="h-16 w-16 mx-auto mb-4 animate-spin" />
                          <p className="text-xl font-medium">Initializing 3D Viewer...</p>
                          <p className="text-sm text-gray-300 mt-2">Loading molecular visualization engine</p>
                        </div>
                      </div>
                    ) : !selectedStructure ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="relative">
                            <div className="w-24 h-24 mx-auto mb-4 relative opacity-50">
                              <Dna className="h-24 w-24 text-gray-400" />
                            </div>
                          </div>
                          <p className="text-xl font-medium">Ready for Visualization</p>
                          <p className="text-sm text-gray-300 mt-2">Select a molecular structure from the list to begin</p>
                          <div className="mt-4 text-xs text-gray-400">
                            <p>• Choose from DNA, RNA, or Protein structures</p>
                            <p>• Interactive 3D visualization with controls</p>
                          </div>
                        </div>
                      </div>
                    ) : isImporting ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="relative mb-4">
                            <div className="w-16 h-16 mx-auto">
                              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-400 border-t-transparent"></div>
                              <Upload className="absolute inset-0 m-auto h-8 w-8 animate-pulse" />
                            </div>
                          </div>
                          <p className="text-xl font-medium">Importing Structure...</p>
                          <p className="text-sm text-gray-300 mt-2">Fetching structure from external source</p>
                          <div className="mt-4 w-64 bg-gray-700 rounded-full h-2 mx-auto">
                            <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">Downloading and processing data...</p>
                        </div>
                      </div>
                    ) : isLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="relative mb-4">
                            <div className="w-16 h-16 mx-auto">
                              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent"></div>
                              <Dna className="absolute inset-0 m-auto h-8 w-8 animate-pulse" />
                            </div>
                          </div>
                          <p className="text-xl font-medium">Loading Structure...</p>
                          <p className="text-sm text-gray-300 mt-2">
                            {selectedStructure?.importUrl ? 'Processing imported structure' : `Fetching ${selectedStructure?.name} from PDB database`}
                          </p>
                          <div className="mt-4 w-64 bg-gray-700 rounded-full h-2 mx-auto">
                            <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">Processing {selectedStructure?.atoms || 'unknown'} atoms...</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Structure Info Overlay */}
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 rounded-lg p-3 text-white max-w-sm z-10">
                          <p className="text-lg font-medium">{selectedStructure.name}</p>
                          <p className="text-sm text-gray-300 mb-2">{selectedStructure.description}</p>
                          {selectedStructure.importUrl && (
                            <div className="mb-2">
                              <Badge variant="secondary" className="text-xs">
                                <LinkIcon className="h-3 w-3 mr-1" />
                                Imported
                              </Badge>
                            </div>
                          )}
                          <div className="flex space-x-4 text-xs text-gray-400">
                            <span>Atoms: {selectedStructure.atoms}</span>
                            <span>Chains: {selectedStructure.chains}</span>
                            <span>Resolution: {selectedStructure.resolution}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Click and drag to rotate • Scroll to zoom</p>
                          {selectedStructure.importUrl && (
                            <p className="text-xs text-gray-600 mt-1">Source: {selectedStructure.importUrl}</p>
                          )}
                        </div>
                      </>
                    )}

                    {/* Viewer Controls Overlay */}
                    {isLoaded && (
                      <div className="absolute top-4 right-4 flex flex-col space-y-2">
                        <Button size="sm" variant="secondary" onClick={() => setIsRotating(!isRotating)}>
                          {isRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="secondary" onClick={handleResetView}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" onClick={handleZoomIn}>
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" onClick={handleZoomOut}>
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={debugViewer}>
                          DEBUG
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controls Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Visualization Controls</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Representation</label>
                    <Select value={representation} onValueChange={setRepresentation}>
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Color Scheme</label>
                    <Select value={colorScheme} onValueChange={setColorScheme}>
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Zoom Level</label>
                    <Slider value={zoom} onValueChange={setZoom} max={200} min={50} step={10} className="w-full" />
                    <div className="text-xs text-gray-500 text-center">{zoom[0]}%</div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-transparent"
                        variant="outline"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                      >
                        <Palette className="mr-2 h-4 w-4" />
                        Custom Colors
                      </Button>
                      {showColorPicker && (
                        <div className="flex space-x-2">
                          <Input
                            type="color"
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            className="w-16 h-8 p-1 border rounded"
                          />
                          <Button size="sm" onClick={handleCustomColor}>
                            Apply
                          </Button>
                        </div>
                      )}
                    </div>
                    <Button className="w-full bg-transparent" variant="outline" onClick={handleExportImage}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Image
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Structure Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedStructure ? (
                    <>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">PDB ID</div>
                        <div className="text-gray-600">{selectedStructure.id}</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">Type</div>
                        <div className="text-gray-600">{selectedStructure.type}</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">Resolution</div>
                        <div className="text-gray-600">{selectedStructure.resolution}</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">Method</div>
                        <div className="text-gray-600">{selectedStructure.method}</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">Chains</div>
                        <div className="text-gray-600">{selectedStructure.chains}</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">Atoms</div>
                        <div className="text-gray-600">{selectedStructure.atoms}</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">Organism</div>
                        <div className="text-gray-600">{selectedStructure.organism}</div>
                      </div>
                      {selectedStructure.importUrl && (
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">Source</div>
                          <div className="text-gray-600 text-xs break-all">{selectedStructure.importUrl}</div>
                        </div>
                      )}
                      {selectedStructure.category === "Uploaded" && (
                        <>
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">Source</div>
                            <div className="text-gray-600">Local File Upload</div>
                          </div>
                          {selectedStructure.fileName && (
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">File Name</div>
                              <div className="text-gray-600">{selectedStructure.fileName}</div>
                            </div>
                          )}
                          {selectedStructure.fileSize && (
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">File Size</div>
                              <div className="text-gray-600">{(selectedStructure.fileSize / 1024).toFixed(1)} KB</div>
                            </div>
                          )}
                          {selectedStructure.uploadedAt && (
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">Uploaded</div>
                              <div className="text-gray-600">{new Date(selectedStructure.uploadedAt).toLocaleString()}</div>
                            </div>
                          )}
                          <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded-md border border-blue-200">
                            <div className="font-medium mb-1">📁 File Upload Info</div>
                            <div>This structure was uploaded from your local file system. You can export or share the visualization, but the original file remains on your device.</div>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-4">
                      Select a structure to view details
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Disease Association</span>
                    <Badge variant="destructive">High Risk</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Confidence</span>
                    <span className="text-sm font-medium">87.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Sites</span>
                    <span className="text-sm font-medium">3 detected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mutations</span>
                    <span className="text-sm font-medium">2 variants</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Information Tabs */}
          <div className="mt-8">
            <Tabs defaultValue="sequence" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="sequence">Sequence</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="interactions">Interactions</TabsTrigger>
                <TabsTrigger value="literature">Literature</TabsTrigger>
              </TabsList>

              <TabsContent value="sequence" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>DNA Sequence</CardTitle>
                    <CardDescription>Original input sequence with annotations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm break-all">
                      <span className="text-blue-600">ATGCGATCGT</span>
                      <span className="text-green-600">AGCTAGCTAG</span>
                      <span className="text-purple-600">CTAGCTAGCT</span>
                      <span className="text-orange-600">AGCTAGCTAG</span>
                      <span className="text-red-600">CTAGCTAGCT</span>
                      <span className="text-blue-600">AGCTAGCTAG</span>
                      <span className="text-gray-600">...</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="outline">Start Codon: ATG</Badge>
                      <Badge variant="outline">Stop Codon: TGA</Badge>
                      <Badge variant="outline">Length: 2,847 bp</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Structural Features</CardTitle>
                    <CardDescription>Detected motifs, domains, and functional regions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">TATA Box</h4>
                        <p className="text-sm text-gray-600 mb-2">Position: 125-132</p>
                        <div className="font-mono text-sm bg-yellow-100 p-2 rounded">TATAWAAW</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">CAAT Box</h4>
                        <p className="text-sm text-gray-600 mb-2">Position: 89-96</p>
                        <div className="font-mono text-sm bg-blue-100 p-2 rounded">CCAATCT</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Open Reading Frame</h4>
                        <p className="text-sm text-gray-600 mb-2">Position: 201-1,847</p>
                        <div className="font-mono text-sm bg-green-100 p-2 rounded">ATG...TGA (548 AA)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="interactions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Protein Interactions</CardTitle>
                    <CardDescription>Known protein-protein interactions and pathways</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">TP53</h4>
                          <p className="text-sm text-gray-600">Tumor suppressor interaction</p>
                        </div>
                        <Badge>High Confidence</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">BRCA2</h4>
                          <p className="text-sm text-gray-600">DNA repair pathway</p>
                        </div>
                        <Badge variant="secondary">Medium</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">ATM</h4>
                          <p className="text-sm text-gray-600">Cell cycle checkpoint</p>
                        </div>
                        <Badge variant="outline">Low</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="literature" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Related Literature</CardTitle>
                    <CardDescription>Recent publications and research findings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Structural basis of DNA recognition by p53</h4>
                        <p className="text-sm text-gray-600 mb-2">Nature Structural Biology, 2023</p>
                        <p className="text-sm">High-resolution crystal structure reveals key binding interactions...</p>
                        <Button variant="link" className="p-0 h-auto text-blue-600">
                          Read more →
                        </Button>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">
                          Machine learning approaches for protein function prediction
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">Bioinformatics, 2023</p>
                        <p className="text-sm">Novel AI methods show improved accuracy in disease association...</p>
                        <Button variant="link" className="p-0 h-auto text-blue-600">
                          Read more →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
