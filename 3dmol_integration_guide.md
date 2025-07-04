# 3Dmol.js Integration Guide for GeneInsight Platform

## Overview
This guide explains how to properly integrate 3Dmol.js for molecular visualization in the GeneInsight Platform.

## Current Status
- ✅ **Visualize page**: Loads without errors (demo mode)
- ✅ **UI Components**: All visualization controls working
- ⚠️ **3Dmol.js**: Not yet integrated (placeholder implementation)

## Integration Steps

### 1. Install 3Dmol.js

```bash
npm install 3dmol
```

### 2. Add Script Tag Method (Alternative)

Add to `app/layout.tsx` or create a custom hook:

```html
<Script 
  src="https://3Dmol.csb.pitt.edu/build/3Dmol-min.js"
  strategy="beforeInteractive"
/>
```

### 3. Update the Visualize Component

Replace the current `initializeMolecularViewer` function:

```typescript
const initializeMolecularViewer = () => {
  if (viewerRef.current && typeof window !== 'undefined' && window.$3Dmol) {
    // Initialize 3Dmol viewer
    const viewer = window.$3Dmol.createViewer(viewerRef.current, {
      defaultcolors: $3Dmol.rasmolElementColors
    });

    // Example: Load a PDB structure
    const pdbData = `
      ATOM      1  N   ALA A   1      20.154  16.967  27.462  1.00 11.18           N  
      ATOM      2  CA  ALA A   1      19.030  16.101  27.938  1.00 11.18           C  
      // ... more PDB data
    `;

    viewer.addModel(pdbData, "pdb");
    viewer.setStyle({}, {cartoon: {color: 'spectrum'}});
    viewer.zoomTo();
    viewer.render();

    return viewer;
  }
  return null;
};
```

### 4. Add TypeScript Declarations

Create `types/3dmol.d.ts`:

```typescript
declare global {
  interface Window {
    $3Dmol: any;
  }
}

declare module '3dmol' {
  export const $3Dmol: any;
}
```

### 5. Enhanced Integration with Controls

```typescript
const [viewer, setViewer] = useState<any>(null);

// Update visualization when controls change
useEffect(() => {
  if (viewer) {
    // Update representation
    viewer.setStyle({}, getStyleFromRepresentation(representation));
    
    // Update color scheme
    viewer.setStyle({}, getColorScheme(colorScheme));
    
    // Update zoom
    viewer.zoom(zoom[0] / 100);
    
    viewer.render();
  }
}, [viewer, representation, colorScheme, zoom]);

const getStyleFromRepresentation = (rep: string) => {
  switch (rep) {
    case 'cartoon': return {cartoon: {}};
    case 'stick': return {stick: {}};
    case 'sphere': return {sphere: {}};
    case 'surface': return {surface: {}};
    case 'ribbon': return {ribbon: {}};
    default: return {cartoon: {}};
  }
};
```

### 6. PDB Data Integration

Connect with backend to fetch real PDB data:

```typescript
const loadPDBStructure = async (pdbId: string) => {
  try {
    // Option 1: Fetch from RCSB PDB
    const response = await fetch(`https://files.rcsb.org/download/${pdbId}.pdb`);
    const pdbData = await response.text();
    
    // Option 2: Use backend endpoint
    // const response = await apiService.getPDBStructure(pdbId);
    // const pdbData = response.data;

    if (viewer) {
      viewer.clear();
      viewer.addModel(pdbData, "pdb");
      viewer.setStyle({}, {cartoon: {color: 'spectrum'}});
      viewer.zoomTo();
      viewer.render();
    }
  } catch (error) {
    console.error('Failed to load PDB structure:', error);
  }
};
```

### 7. Backend Integration

Add PDB endpoints to Spring Boot backend:

```java
@RestController
@RequestMapping("/api/structures")
public class StructureController {
    
    @GetMapping("/pdb/{pdbId}")
    public ResponseEntity<String> getPDBStructure(@PathVariable String pdbId) {
        // Fetch from RCSB PDB or local cache
        String pdbData = structureService.fetchPDBData(pdbId);
        return ResponseEntity.ok(pdbData);
    }
    
    @PostMapping("/predict-structure")
    public ResponseEntity<?> predictStructure(@RequestBody String sequence) {
        // Use AlphaFold or other structure prediction
        return structureService.predictStructure(sequence);
    }
}
```

### 8. Error Handling

```typescript
const initializeMolecularViewer = () => {
  try {
    if (!window.$3Dmol) {
      console.warn('3Dmol.js not loaded, showing placeholder');
      return;
    }
    
    // Initialize viewer...
    
  } catch (error) {
    console.error('Failed to initialize 3D viewer:', error);
    // Show error message to user
  }
};
```

## Features to Implement

### Core Features
- [x] Basic UI layout
- [x] Control panels
- [ ] 3Dmol.js integration
- [ ] PDB file loading
- [ ] Structure visualization

### Advanced Features
- [ ] Structure prediction from sequence
- [ ] Protein-protein interaction visualization
- [ ] Mutation highlighting
- [ ] Animation controls
- [ ] Export functionality
- [ ] Multiple structure comparison

## Testing

Create tests for 3D visualization:

```typescript
// __tests__/visualize.test.tsx
describe('Visualize Page', () => {
  it('should load without 3Dmol.js', () => {
    render(<VisualizePage />);
    expect(screen.getByText('3D Molecular Visualization')).toBeInTheDocument();
  });

  it('should initialize 3D viewer when library is available', () => {
    // Mock $3Dmol
    window.$3Dmol = {
      createViewer: jest.fn(),
      // ... other methods
    };
    
    render(<VisualizePage />);
    // Test viewer initialization
  });
});
```

## Resources

- **3Dmol.js Documentation**: https://3dmol.csb.pitt.edu/doc/
- **PDB Database**: https://www.rcsb.org/
- **AlphaFold Database**: https://alphafold.ebi.ac.uk/
- **Protein Data Bank**: https://www.wwpdb.org/

## Current Demo Features

The current implementation includes:
- ✅ Complete UI layout
- ✅ Visualization controls (representation, color, zoom)
- ✅ Structure information panel
- ✅ Sequence and feature tabs
- ✅ Placeholder 3D visualization
- ✅ Error-free loading

## Next Steps

1. Install 3Dmol.js library
2. Implement actual 3D viewer initialization
3. Add PDB data loading
4. Connect with sequence analysis results
5. Add structure prediction capabilities
6. Implement export functionality

The foundation is ready for full 3D molecular visualization integration!
