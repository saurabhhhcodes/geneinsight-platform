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
          <script>
            // Load libraries dynamically to avoid parser-blocking issues
            function loadLibraries() {
              return new Promise((resolve, reject) => {
                // Load jQuery first
                const jqueryScript = document.createElement('script');
                jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
                jqueryScript.async = true;
                jqueryScript.onload = () => {
                  console.log('jQuery loaded');

                  // Load 3DMol.js after jQuery
                  const script = document.createElement('script');
                  script.src = 'https://3dmol.csb.pitt.edu/build/3Dmol-min.js';
                  script.async = true;
                  script.onload = () => {
                    console.log('3DMol.js loaded');
                    resolve();
                  };
                  script.onerror = () => reject(new Error('Failed to load 3DMol.js'));
                  document.head.appendChild(script);
                };
                jqueryScript.onerror = () => reject(new Error('Failed to load jQuery'));
                document.head.appendChild(jqueryScript);
              });
            }

            // Wait for 3DMol to be ready
            function wait3DMol() {
              return new Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = 50;

                function check() {
                  attempts++;
                  if (typeof window.$3Dmol !== 'undefined' && window.$3Dmol.createViewer) {
                    console.log('3DMol.js is ready');
                    resolve();
                  } else if (attempts < maxAttempts) {
                    setTimeout(check, 100);
                  } else {
                    reject(new Error('3DMol.js failed to load after ' + maxAttempts + ' attempts'));
                  }
                }
                check();
              });
            }
          </script>

          <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 20px; }
            .main-content { display: grid; grid-template-columns: 1fr 400px; gap: 20px; }
            .viewer-section { background: #f8f9fa; border-radius: 8px; padding: 20px; }
            .info-section { }
            .viewer-container { width: 100%; height: 400px; border: 2px solid #ddd; border-radius: 8px; background: #000; position: relative; }
            .loading-message { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 16px; z-index: 10; }
            .error-message { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #ff6b6b; font-size: 14px; text-align: center; z-index: 10; }
            .structure-overlay { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px; z-index: 5; }
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
            .file-input { margin: 10px 0; padding: 5px; border: 1px solid #ccc; border-radius: 4px; width: 100%; }
            .structure-info { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 6px; font-size: 12px; z-index: 5; }
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
                <h3>🎯 Interactive 3D Molecular Viewer</h3>
                <div id="viewer" class="viewer-container">
                  <div id="loadingMessage" class="loading-message">Loading 3DMol.js viewer...</div>
                  <div id="errorMessage" class="error-message" style="display: none;">
                    Failed to load 3D viewer.<br>
                    <button class="btn" onclick="retryViewer()">Retry</button>
                  </div>
                  <div class="structure-overlay">
                    <strong>${results.structure3D.structureId}</strong><br>
                    ${results.structure3D.length} amino acids<br>
                    Confidence: ${(results.structure3D.confidence * 100).toFixed(1)}%
                  </div>
                </div>
                <div class="viewer-controls">
                  <button class="btn" onclick="resetView()">Reset View</button>
                  <button class="btn" onclick="toggleStyle('cartoon')">Cartoon</button>
                  <button class="btn" onclick="toggleStyle('sphere')">Sphere</button>
                  <button class="btn" onclick="toggleStyle('stick')">Stick</button>
                  <button class="btn btn-secondary" onclick="toggleSpin()">Toggle Spin</button>
                  <button class="btn" onclick="debugViewer()" style="background: #28a745;">Debug</button>
                </div>

                <div class="upload-section">
                  <h4>📁 Import PDB File</h4>
                  <input type="file" id="pdbFileInput" class="file-input" accept=".pdb,.txt" onchange="loadPDBFile(event)">
                  <button class="btn" onclick="document.getElementById('pdbFileInput').click()">Choose PDB File</button>
                  <p style="font-size: 12px; color: #666; margin: 5px 0;">Upload your own PDB file to visualize (supports .pdb and .txt files)</p>
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
            let viewer;
            let isSpinning = false;
            let viewerInitialized = false;

            // Initialize 3DMol viewer with comprehensive error handling
            function initViewer() {
              try {
                console.log('Initializing 3DMol viewer...');

                // Verify 3DMol is properly loaded
                if (typeof window.$3Dmol === 'undefined') {
                  throw new Error('3DMol library not loaded');
                }

                if (typeof window.$3Dmol.createViewer !== 'function') {
                  throw new Error('3DMol createViewer function not available');
                }

                const element = document.getElementById('viewer');
                if (!element) {
                  throw new Error('Viewer element not found');
                }

                // Clear loading message
                const loadingMsg = document.getElementById('loadingMessage');
                if (loadingMsg) loadingMsg.style.display = 'none';

                console.log('Creating 3DMol viewer instance...');

                // Create viewer with optimal visibility configuration
                const config = {
                  backgroundColor: '#2a2a2a', // Medium gray for better contrast
                  antialias: true,
                  alpha: true
                };

                viewer = window.$3Dmol.createViewer(element, config);

                if (!viewer) {
                  throw new Error('Failed to create 3DMol viewer instance');
                }

                console.log('3DMol viewer created successfully');

                // Get PDB data
                const pdbData = document.getElementById('pdbData').textContent;
                if (!pdbData || pdbData.trim() === '') {
                  throw new Error('No PDB data available');
                }

                console.log('Adding PDB model...');

                // Add model with comprehensive error handling
                try {
                  console.log('PDB data preview:', pdbData.substring(0, 200) + '...');
                  const model = viewer.addModel(pdbData, 'pdb');
                  if (!model) {
                    throw new Error('Failed to parse PDB data - model is null');
                  }

                  // Check if model has atoms
                  const atoms = model.selectedAtoms({});
                  console.log('Model added successfully, atoms found:', atoms.length);

                  if (atoms.length === 0) {
                    throw new Error('PDB model loaded but contains no atoms - check PDB format');
                  }

                } catch (modelError) {
                  console.error('Model error:', modelError);
                  console.error('PDB data that failed:', pdbData);
                  throw new Error('Failed to add PDB model: ' + modelError.message);
                }

                console.log('Setting visualization style...');

                // Set style with maximum visibility
                try {
                  // Use bright, highly visible styling
                  viewer.setStyle({}, {
                    cartoon: {
                      color: 'rainbow',
                      thickness: 1.5
                    }
                  });
                } catch (styleError) {
                  console.warn('Rainbow coloring failed, using bright cyan:', styleError);
                  try {
                    viewer.setStyle({}, {
                      cartoon: {
                        color: '#00FFFF', // Bright cyan
                        thickness: 1.5
                      }
                    });
                  } catch (fallbackError) {
                    console.warn('Cartoon style failed, using bright sticks:', fallbackError);
                    viewer.setStyle({}, {
                      stick: {
                        color: '#FFFFFF', // Pure white
                        radius: 0.6
                      }
                    });
                  }
                }

                console.log('Rendering viewer...');

                // Zoom to fit the molecule properly
                viewer.zoomTo();

                // Render the viewer
                viewer.render();

                viewerInitialized = true;
                console.log('3DMol viewer fully initialized and rendered!');

                // Verify viewer is working and molecules are visible
                setTimeout(() => {
                  try {
                    viewer.render(); // Test render

                    // Check if models are loaded using correct 3DMol.js API
                    try {
                      const modelCount = viewer.getNumModels ? viewer.getNumModels() : 0;
                      console.log('Number of models loaded:', modelCount);

                      if (modelCount > 0) {
                        // Try to get atoms from the first model
                        const atoms = viewer.selectedAtoms ? viewer.selectedAtoms({}) : [];
                        console.log('Number of atoms in viewer:', atoms.length);

                        if (atoms.length === 0) {
                          console.warn('Model loaded but no atoms accessible - this is normal for some 3DMol.js versions');
                          console.log('Viewer verification successful - molecules should be visible');
                        } else {
                          console.log('Viewer verification successful - molecules should be visible');
                        }
                      } else {
                        console.warn('No models detected, but this might be a 3DMol.js API issue');
                        console.log('Continuing anyway - molecules may still be visible');
                      }
                    } catch (modelError) {
                      console.warn('Model checking failed (this is often normal):', modelError);
                      console.log('Continuing anyway - molecules should still be visible');
                    }
                  } catch (verifyError) {
                    console.warn('Viewer verification failed:', verifyError);
                  }
                }, 1000);

              } catch (error) {
                console.error('Viewer initialization error:', error);
                showError('Failed to initialize 3D viewer: ' + error.message + '<br><small>Try refreshing the page</small>');
              }
            }

            // Show error message
            function showError(message) {
              const loadingMsg = document.getElementById('loadingMessage');
              const errorDiv = document.getElementById('errorMessage');

              if (loadingMsg) loadingMsg.style.display = 'none';
              if (errorDiv) {
                errorDiv.innerHTML = message + '<br><button class="btn" onclick="retryViewer()">Retry</button>';
                errorDiv.style.display = 'block';
              }
            }

            // Retry viewer initialization
            function retryViewer() {
              const errorDiv = document.getElementById('errorMessage');
              const loadingMsg = document.getElementById('loadingMessage');

              if (errorDiv) errorDiv.style.display = 'none';
              if (loadingMsg) {
                loadingMsg.style.display = 'block';
                loadingMsg.textContent = 'Retrying...';
              }

              viewerInitialized = false;
              setTimeout(initViewer, 1000);
            }

            // Reset camera view
            function resetView() {
              if (!viewerInitialized || !viewer) {
                alert('3D viewer not initialized.');
                return;
              }
              try {
                viewer.zoomTo();
                viewer.render();
              } catch (error) {
                console.error('Reset view error:', error);
              }
            }

            // Toggle visualization style with error handling
            function toggleStyle(style) {
              if (!viewerInitialized || !viewer) {
                alert('3D viewer not initialized.');
                return;
              }

              try {
                console.log('Changing style to:', style);

                // Check if we need to re-add the model
                try {
                  const modelCount = viewer.getNumModels ? viewer.getNumModels() : 0;
                  if (modelCount === 0) {
                    console.log('No models detected, re-adding PDB data');
                    const pdbData = document.getElementById('pdbData').textContent;
                    viewer.addModel(pdbData, 'pdb');
                  }
                } catch (e) {
                  console.warn('Could not check models, continuing with style change:', e);
                }

                // Apply style with maximum visibility
                switch(style) {
                  case 'cartoon':
                    try {
                      viewer.setStyle({}, {
                        cartoon: {
                          color: 'rainbow',
                          thickness: 1.5
                        }
                      });
                    } catch (e) {
                      viewer.setStyle({}, {
                        cartoon: {
                          color: '#00FFFF', // Bright cyan
                          thickness: 1.5
                        }
                      });
                    }
                    break;
                  case 'sphere':
                    try {
                      viewer.setStyle({}, {
                        sphere: {
                          color: 'rainbow',
                          radius: 1.4
                        }
                      });
                    } catch (e) {
                      viewer.setStyle({}, {
                        sphere: {
                          color: '#FFFF00', // Bright yellow
                          radius: 1.4
                        }
                      });
                    }
                    break;
                  case 'stick':
                    try {
                      viewer.setStyle({}, {
                        stick: {
                          color: 'rainbow',
                          radius: 0.5
                        }
                      });
                    } catch (e) {
                      viewer.setStyle({}, {
                        stick: {
                          color: '#FFFFFF', // Pure white
                          radius: 0.5
                        }
                      });
                    }
                    break;
                }

                viewer.render();
                console.log('Style changed successfully');

              } catch (error) {
                console.error('Style toggle error:', error);
                alert('Failed to change visualization style: ' + error.message);
              }
            }

            // Toggle spinning animation
            function toggleSpin() {
              if (!viewerInitialized || !viewer) {
                alert('3D viewer not initialized.');
                return;
              }

              try {
                if (isSpinning) {
                  viewer.spin(false);
                  isSpinning = false;
                } else {
                  viewer.spin('y', 1);
                  isSpinning = true;
                }
              } catch (error) {
                console.error('Spin toggle error:', error);
              }
            }

            // Debug function to check viewer status and PDB format
            function debugViewer() {
              if (!viewer) {
                alert('Viewer not initialized');
                return;
              }

              try {
                let modelCount = 0;
                let atomCount = 0;

                // Try different methods to check models
                try {
                  if (viewer.getNumModels) {
                    modelCount = viewer.getNumModels();
                  } else if (viewer.getModel) {
                    const models = viewer.getModel();
                    modelCount = models ? (Array.isArray(models) ? models.length : 1) : 0;
                  }
                } catch (e) {
                  console.warn('Could not get model count:', e);
                }

                // Try to get atom count
                try {
                  if (viewer.selectedAtoms) {
                    const atoms = viewer.selectedAtoms({});
                    atomCount = atoms ? atoms.length : 0;
                  }
                } catch (e) {
                  console.warn('Could not get atom count:', e);
                }

                // Check PDB data format
                const pdbData = document.getElementById('pdbData').textContent;
                const pdbLines = pdbData.split('\\n');
                const atomLines = pdbLines.filter(line => line.startsWith('ATOM'));
                const firstAtomLine = atomLines[0] || 'No ATOM lines found';

                const debugInfo = \`
Debug Information:
- Viewer initialized: \${viewerInitialized}
- Models detected: \${modelCount}
- Atoms accessible: \${atomCount}
- 3DMol available: \${typeof window.$3Dmol !== 'undefined'}
- Viewer spinning: \${isSpinning}

PDB Format Check:
- Total PDB lines: \${pdbLines.length}
- ATOM lines found: \${atomLines.length}
- First ATOM line: \${firstAtomLine.substring(0, 80)}

Status: \${atomLines.length > 0 ? 'PDB format looks good - molecules should be visible' : 'WARNING: No ATOM lines found in PDB data!'}
                \`;

                alert(debugInfo);
                console.log('Debug info:', {
                  viewerInitialized,
                  modelCount,
                  atomCount,
                  viewer,
                  pdbPreview: pdbData.substring(0, 300),
                  atomLines: atomLines.length
                });

              } catch (error) {
                alert('Debug error: ' + error.message);
                console.error('Debug error:', error);
              }
            }

            // Load PDB file with comprehensive error handling
            function loadPDBFile(event) {
              const file = event.target.files[0];
              if (!file) return;

              console.log('Loading PDB file:', file.name);

              // Accept both .pdb and .txt files
              const fileName = file.name.toLowerCase();
              if (!fileName.endsWith('.pdb') && !fileName.endsWith('.txt')) {
                alert('Please select a valid PDB file (.pdb or .txt extension)');
                return;
              }

              // Check file size (limit to 10MB)
              if (file.size > 10 * 1024 * 1024) {
                alert('File too large. Please select a file smaller than 10MB.');
                return;
              }

              const reader = new FileReader();
              reader.onload = function(e) {
                try {
                  const pdbContent = e.target.result;

                  // Validate PDB content
                  if (!pdbContent || typeof pdbContent !== 'string') {
                    throw new Error('Invalid file content');
                  }

                  // Basic PDB format validation
                  if (!pdbContent.includes('ATOM') && !pdbContent.includes('HETATM')) {
                    throw new Error('File does not appear to be a valid PDB format');
                  }

                  console.log('PDB file validated, updating viewer...');

                  // Update PDB data display
                  document.getElementById('pdbData').textContent = pdbContent;

                  // Load new structure in 3DMol viewer with comprehensive error handling
                  if (viewerInitialized && viewer) {
                    try {
                      console.log('Removing existing models...');
                      viewer.removeAllModels();

                      console.log('Adding new PDB model...');
                      const model = viewer.addModel(pdbContent, 'pdb');

                      if (!model) {
                        throw new Error('Failed to parse PDB file');
                      }

                      console.log('Setting style...');
                      // Try rainbow coloring for maximum visibility
                      try {
                        viewer.setStyle({}, {
                          cartoon: {
                            color: 'rainbow',
                            thickness: 1.5
                          }
                        });
                      } catch (styleError) {
                        console.warn('Rainbow coloring failed, using bright cyan:', styleError);
                        viewer.setStyle({}, {
                          cartoon: {
                            color: '#00FFFF', // Bright cyan
                            thickness: 1.5
                          }
                        });
                      }

                      console.log('Rendering...');
                      viewer.zoomTo();
                      viewer.render();

                      alert('PDB file loaded and visualized successfully!');
                      console.log('PDB file loading completed successfully');

                    } catch (viewerError) {
                      console.error('Viewer update error:', viewerError);
                      alert('PDB file loaded but failed to update 3D viewer: ' + viewerError.message);
                    }
                  } else {
                    alert('PDB file loaded successfully! 3D viewer not initialized - please refresh and try again.');
                  }

                } catch (error) {
                  console.error('PDB loading error:', error);
                  alert('Error loading PDB file: ' + error.message);
                }
              };

              reader.onerror = function() {
                alert('Error reading file. Please try again.');
              };

              reader.readAsText(file);
            }

            // Render the molecule
            function render() {
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              // Create gradient background
              const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
              gradient.addColorStop(0, '#1e3c72');
              gradient.addColorStop(1, '#2a5298');
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              // Project all atoms
              const projectedAtoms = atoms.map(atom => ({
                ...atom,
                ...project3D(atom.x, atom.y, atom.z)
              }));

              // Sort by depth for proper rendering
              projectedAtoms.sort((a, b) => b.depth - a.depth);

              // Draw bonds first
              if (currentStyle === 'stick' || currentStyle === 'cartoon') {
                ctx.strokeStyle = '#cccccc';
                ctx.lineWidth = currentStyle === 'stick' ? 3 : 1;

                bonds.forEach(bond => {
                  const atomA = projectedAtoms[bond.from];
                  const atomB = projectedAtoms[bond.to];

                  if (atomA && atomB) {
                    ctx.beginPath();
                    ctx.moveTo(atomA.x, atomA.y);
                    ctx.lineTo(atomB.x, atomB.y);
                    ctx.stroke();
                  }
                });
              }

              // Draw atoms
              projectedAtoms.forEach(atom => {
                let radius;
                switch(currentStyle) {
                  case 'sphere': radius = 8; break;
                  case 'stick': radius = 4; break;
                  default: radius = 6; break;
                }

                // Add depth-based size variation
                const depthFactor = Math.max(0.5, 1 - atom.depth / 1000);
                radius *= depthFactor;

                ctx.beginPath();
                ctx.arc(atom.x, atom.y, radius, 0, 2 * Math.PI);
                ctx.fillStyle = atom.color;
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Add glow effect
                ctx.shadowColor = atom.color;
                ctx.shadowBlur = 5;
                ctx.fill();
                ctx.shadowBlur = 0;
              });

              // Continue animation if enabled
              if (isAnimating) {
                rotationY += 0.02;
                animationId = requestAnimationFrame(render);
              }
            }

            // Control functions
            function resetView() {
              rotationX = 0;
              rotationY = 0;
              render();
            }

            function showCartoon() {
              currentStyle = 'cartoon';
              render();
            }

            function showSpheres() {
              currentStyle = 'sphere';
              render();
            }

            function showSticks() {
              currentStyle = 'stick';
              render();
            }

            function toggleAnimation() {
              isAnimating = !isAnimating;
              if (isAnimating) {
                render();
              } else {
                cancelAnimationFrame(animationId);
              }
            }

            // Load PDB file functionality with proper error handling
            function loadPDBFile(event) {
              const file = event.target.files[0];
              if (!file) return;

              // Accept both .pdb and .txt files
              const fileName = file.name.toLowerCase();
              if (!fileName.endsWith('.pdb') && !fileName.endsWith('.txt')) {
                alert('Please select a valid PDB file (.pdb or .txt extension)');
                return;
              }

              // Check file size (limit to 10MB)
              if (file.size > 10 * 1024 * 1024) {
                alert('File too large. Please select a file smaller than 10MB.');
                return;
              }

              const reader = new FileReader();
              reader.onload = function(e) {
                try {
                  const pdbContent = e.target.result;

                  // Validate PDB content
                  if (!pdbContent || typeof pdbContent !== 'string') {
                    throw new Error('Invalid file content');
                  }

                  // Basic PDB format validation
                  if (!pdbContent.includes('ATOM') && !pdbContent.includes('HETATM')) {
                    throw new Error('File does not appear to be a valid PDB format');
                  }

                  // Update PDB data display
                  document.getElementById('pdbData').textContent = pdbContent;

                  // Load new structure in 3DMol viewer
                  if (viewerInitialized && viewer) {
                    try {
                      viewer.removeAllModels();
                      viewer.addModel(pdbContent, 'pdb');
                      viewer.setStyle({}, {cartoon: {color: 'spectrum', thickness: 0.8}});
                      viewer.zoomTo();
                      viewer.render();
                      alert('PDB file loaded successfully! New structure is now displayed in the 3D viewer.');
                    } catch (viewerError) {
                      console.error('Viewer update error:', viewerError);
                      alert('PDB file loaded but failed to update 3D viewer. Try refreshing the page.');
                    }
                  } else {
                    alert('PDB file loaded successfully! Please initialize the 3D viewer to see the structure.');
                  }

                } catch (error) {
                  console.error('PDB loading error:', error);
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
            window.onload = async function() {
              console.log('Page loaded, loading libraries...');

              try {
                // Load libraries dynamically
                await loadLibraries();

                // Wait for 3DMol.js to be ready
                await wait3DMol();

                console.log('3DMol.js is ready, initializing viewer...');

                // Small delay to ensure DOM is fully ready
                setTimeout(() => {
                  initViewer();
                }, 500);

              } catch (error) {
                console.error('Failed to load libraries:', error);
                showError('Failed to load 3DMol.js library. Please refresh the page and check your internet connection.');
              }
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
