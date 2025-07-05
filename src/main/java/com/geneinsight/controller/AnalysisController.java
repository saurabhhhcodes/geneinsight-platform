package com.geneinsight.controller;

import com.geneinsight.dto.AnalysisRequest;
import com.geneinsight.dto.AnalysisResponse;
import com.geneinsight.service.AnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;

/**
 * REST Controller for DNA/RNA/Protein Analysis
 * 
 * Provides endpoints for:
 * - Sequence analysis
 * - File upload and processing
 * - 3D structure generation
 * - Batch processing
 */
@RestController
@RequestMapping("/api/analysis")
@Tag(name = "Analysis", description = "DNA/RNA/Protein sequence analysis endpoints")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "https://geneinsight-platform.vercel.app"})
public class AnalysisController {

    @Autowired
    private AnalysisService analysisService;

    /**
     * Analyze DNA/RNA/Protein sequence
     */
    @PostMapping("/analyze")
    @Operation(summary = "Analyze genetic sequence", description = "Performs comprehensive analysis of DNA, RNA, or protein sequences")
    public ResponseEntity<AnalysisResponse> analyzeSequence(@Valid @RequestBody AnalysisRequest request) {
        try {
            AnalysisResponse response = analysisService.analyzeSequence(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(AnalysisResponse.error("Analysis failed: " + e.getMessage()));
        }
    }

    /**
     * Upload and analyze file
     */
    @PostMapping("/upload")
    @Operation(summary = "Upload and analyze file", description = "Upload FASTA, PDB, or other sequence files for analysis")
    public ResponseEntity<AnalysisResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(AnalysisResponse.error("File is empty"));
            }
            
            AnalysisResponse response = analysisService.analyzeFile(file);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(AnalysisResponse.error("File analysis failed: " + e.getMessage()));
        }
    }

    /**
     * Generate 3D protein structure
     */
    @PostMapping("/structure")
    @Operation(summary = "Generate 3D structure", description = "Generate 3D protein structure from sequence")
    public ResponseEntity<AnalysisResponse> generateStructure(@Valid @RequestBody AnalysisRequest request) {
        try {
            AnalysisResponse response = analysisService.generateStructure(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(AnalysisResponse.error("Structure generation failed: " + e.getMessage()));
        }
    }

    /**
     * Batch analysis
     */
    @PostMapping("/batch")
    @Operation(summary = "Batch analysis", description = "Analyze multiple sequences in batch")
    public ResponseEntity<List<AnalysisResponse>> batchAnalysis(@Valid @RequestBody List<AnalysisRequest> requests) {
        try {
            List<AnalysisResponse> responses = analysisService.batchAnalysis(requests);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get analysis history
     */
    @GetMapping("/history")
    @Operation(summary = "Get analysis history", description = "Retrieve user's analysis history")
    public ResponseEntity<List<AnalysisResponse>> getHistory(@RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size) {
        try {
            List<AnalysisResponse> history = analysisService.getAnalysisHistory(page, size);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get specific analysis by ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get analysis by ID", description = "Retrieve specific analysis result")
    public ResponseEntity<AnalysisResponse> getAnalysis(@PathVariable String id) {
        try {
            AnalysisResponse response = analysisService.getAnalysisById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
