package com.geneinsight.controller;

import com.geneinsight.dto.SequenceAnalysisRequest;
import com.geneinsight.service.BioinformaticsService;
import com.geneinsight.service.MLService;
import com.geneinsight.service.SequenceService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/sequences")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class SequenceController {

    @Autowired
    private SequenceService sequenceService;

    @Autowired
    private MLService mlService;

    @Autowired
    private BioinformaticsService bioinformaticsService;

    @PostMapping("/analyze/simple")
    public ResponseEntity<?> analyzeSimple(@RequestBody Map<String, String> request) {
        try {
            String sequence = request.get("sequence");
            if (sequence == null || sequence.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Sequence is required");
            }

            Map<String, Object> result = mlService.analyzeSequence(sequence.trim());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Analysis failed: " + e.getMessage());
        }
    }

    @PostMapping("/analyze")
    @PreAuthorize("hasRole('RESEARCHER') or hasRole('ADMIN') or hasRole('CLINICIAN')")
    public ResponseEntity<?> analyzeSequence(
            @Valid @RequestBody SequenceAnalysisRequest request,
            Authentication authentication) {
        return sequenceService.analyzeSequence(request, authentication.getName());
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('RESEARCHER') or hasRole('ADMIN') or hasRole('CLINICIAN')")
    public ResponseEntity<?> uploadSequenceFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            Authentication authentication) {
        return sequenceService.uploadSequenceFile(file, name, authentication.getName());
    }

    @GetMapping("/history")
    public ResponseEntity<?> getUserSequences(
            Authentication authentication,
            Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prediction) {
        return sequenceService.getUserSequences(authentication.getName(), pageable, search, status, prediction);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSequenceById(
            @PathVariable Long id,
            Authentication authentication) {
        return sequenceService.getSequenceById(id, authentication.getName());
    }

    @GetMapping("/{id}/analysis")
    public ResponseEntity<?> getAnalysisResult(
            @PathVariable Long id,
            Authentication authentication) {
        return sequenceService.getAnalysisResult(id, authentication.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSequence(
            @PathVariable Long id,
            Authentication authentication) {
        return sequenceService.deleteSequence(id, authentication.getName());
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadSequence(
            @PathVariable Long id,
            Authentication authentication) {
        return sequenceService.downloadSequence(id, authentication.getName());
    }

    // 3D Structure Generation Endpoints
    @PostMapping("/generate-3d-structure")
    public ResponseEntity<?> generate3DStructure(@RequestBody Map<String, String> request) {
        try {
            String sequence = request.get("sequence");
            if (sequence == null || sequence.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("DNA sequence is required");
            }

            log.info("Generating 3D structure for sequence of length: {}", sequence.length());

            // Generate 3D structure from DNA sequence
            Map<String, Object> structureResult = bioinformaticsService.generate3DStructure(sequence);

            return ResponseEntity.ok(structureResult);
        } catch (Exception e) {
            log.error("Error generating 3D structure", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/analyze-with-structure")
    public ResponseEntity<?> analyzeWithStructure(@RequestBody Map<String, Object> request) {
        try {
            String sequence = (String) request.get("sequence");
            Boolean include3D = (Boolean) request.getOrDefault("include3D", false);

            if (sequence == null || sequence.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("DNA sequence is required");
            }

            log.info("Analyzing sequence with 3D structure option: {}", include3D);

            // Enhanced analysis with optional 3D structure
            Map<String, Object> result = bioinformaticsService.analyzeSequenceWithStructure(sequence, include3D);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error in enhanced sequence analysis", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
