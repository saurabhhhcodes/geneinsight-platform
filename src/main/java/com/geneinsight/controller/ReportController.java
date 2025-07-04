package com.geneinsight.controller;

import com.geneinsight.dto.ReportRequest;
import com.geneinsight.dto.ReportResponse;
import com.geneinsight.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReportController {

    private final ReportService reportService;

    // Test endpoint without authentication
    @GetMapping("/test")
    public ResponseEntity<List<ReportResponse>> getTestReports() {
        try {
            // Create mock reports for testing
            List<ReportResponse> mockReports = List.of(
                ReportResponse.builder()
                    .id(1L)
                    .name("Sample Analysis Report")
                    .type("analysis_summary")
                    .status("completed")
                    .createdAt(java.time.LocalDateTime.now().minusDays(1))
                    .completedAt(java.time.LocalDateTime.now().minusDays(1).plusHours(2))
                    .downloadUrl("/api/reports/1/download")
                    .build(),
                ReportResponse.builder()
                    .id(2L)
                    .name("User Activity Report")
                    .type("user_activity")
                    .status("generating")
                    .createdAt(java.time.LocalDateTime.now().minusHours(1))
                    .build(),
                ReportResponse.builder()
                    .id(3L)
                    .name("System Performance Report")
                    .type("system_performance")
                    .status("failed")
                    .createdAt(java.time.LocalDateTime.now().minusHours(3))
                    .errorMessage("Database connection timeout")
                    .build()
            );
            return ResponseEntity.ok(mockReports);
        } catch (Exception e) {
            log.error("Failed to get test reports", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/test/generate")
    public ResponseEntity<?> generateTestReport(@RequestBody Map<String, Object> request) {
        try {
            // Create mock report response
            ReportResponse mockReport = ReportResponse.builder()
                .id(System.currentTimeMillis()) // Use timestamp as ID
                .name((String) request.get("name"))
                .type((String) request.get("type"))
                .status("generating")
                .createdAt(java.time.LocalDateTime.now())
                .build();

            log.info("Generated test report: {}", mockReport.getName());
            return ResponseEntity.ok(mockReport);
        } catch (Exception e) {
            log.error("Failed to generate test report", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    @PreAuthorize("hasRole('RESEARCHER') or hasRole('ADMIN') or hasRole('CLINICIAN')")
    public ResponseEntity<List<ReportResponse>> getUserReports(Authentication authentication) {
        try {
            List<ReportResponse> reports = reportService.getUserReports(authentication.getName());
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            log.error("Failed to get user reports", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/generate")
    @PreAuthorize("hasRole('RESEARCHER') or hasRole('ADMIN') or hasRole('CLINICIAN')")
    public ResponseEntity<?> generateReport(
            @Valid @RequestBody ReportRequest request,
            Authentication authentication) {
        try {
            ReportResponse report = reportService.generateReport(request, authentication.getName());
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            log.error("Failed to generate report", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{reportId}/status")
    @PreAuthorize("hasRole('RESEARCHER') or hasRole('ADMIN') or hasRole('CLINICIAN')")
    public ResponseEntity<?> getReportStatus(
            @PathVariable Long reportId,
            Authentication authentication) {
        try {
            ReportResponse report = reportService.getReportStatus(reportId, authentication.getName());
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            log.error("Failed to get report status", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{reportId}/download")
    @PreAuthorize("hasRole('RESEARCHER') or hasRole('ADMIN') or hasRole('CLINICIAN')")
    public ResponseEntity<Resource> downloadReport(
            @PathVariable Long reportId,
            Authentication authentication) {
        try {
            Resource resource = reportService.downloadReport(reportId, authentication.getName());
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                           "attachment; filename=\"report_" + reportId + ".pdf\"")
                    .body(resource);
                    
        } catch (IOException e) {
            log.error("Failed to download report", e);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Failed to download report", e);
            return ResponseEntity.badRequest().build();
        }
    }
}
