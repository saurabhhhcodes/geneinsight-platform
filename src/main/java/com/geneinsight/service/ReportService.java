package com.geneinsight.service;

import com.geneinsight.dto.ReportRequest;
import com.geneinsight.dto.ReportResponse;
import com.geneinsight.entity.Report;
import com.geneinsight.entity.User;
import com.geneinsight.entity.Sequence;
import com.geneinsight.repository.ReportRepository;
import com.geneinsight.repository.UserRepository;
import com.geneinsight.repository.SequenceRepository;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {
    
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final SequenceRepository sequenceRepository;
    
    @Value("${app.reports.storage-path:./reports}")
    private String reportsStoragePath;
    
    public List<ReportResponse> getUserReports(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Report> reports = reportRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return reports.stream()
                .map(ReportResponse::fromEntity)
                .toList();
    }
    
    @Transactional
    public ReportResponse generateReport(ReportRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Parse date range
        LocalDateTime dateFrom = null;
        LocalDateTime dateTo = null;
        
        if (request.getDateRange() != null) {
            if (request.getDateRange().getFrom() != null) {
                dateFrom = LocalDateTime.parse(request.getDateRange().getFrom().substring(0, 19));
            }
            if (request.getDateRange().getTo() != null) {
                dateTo = LocalDateTime.parse(request.getDateRange().getTo().substring(0, 19));
            }
        }
        
        // Create report entity
        Report report = Report.builder()
                .name(request.getName())
                .type(request.getType())
                .description(request.getDescription())
                .status(Report.ReportStatus.GENERATING)
                .dateFrom(dateFrom)
                .dateTo(dateTo)
                .includeCharts(request.getOptions() != null ? request.getOptions().getIncludeCharts() : true)
                .includeRawData(request.getOptions() != null ? request.getOptions().getIncludeRawData() : false)
                .user(user)
                .build();
        
        report = reportRepository.save(report);
        
        // Generate report asynchronously
        generateReportAsync(report);
        
        return ReportResponse.fromEntity(report);
    }
    
    @Async
    public void generateReportAsync(Report report) {
        try {
            log.info("Starting report generation for report ID: {}", report.getId());
            
            // Create reports directory if it doesn't exist
            Path reportsDir = Paths.get(reportsStoragePath);
            if (!Files.exists(reportsDir)) {
                Files.createDirectories(reportsDir);
            }
            
            // Generate report content based on type
            String htmlContent = generateReportContent(report);
            
            // Generate PDF
            String fileName = "report_" + report.getId() + "_" + 
                            LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".pdf";
            Path filePath = reportsDir.resolve(fileName);
            
            try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
                HtmlConverter.convertToPdf(htmlContent, fos);
            }
            
            // Update report status
            report.setStatus(Report.ReportStatus.COMPLETED);
            report.setCompletedAt(LocalDateTime.now());
            report.setFilePath(filePath.toString());
            report.setFileSize(Files.size(filePath));
            
            reportRepository.save(report);
            
            log.info("Report generation completed for report ID: {}", report.getId());
            
        } catch (Exception e) {
            log.error("Report generation failed for report ID: {}", report.getId(), e);
            
            report.setStatus(Report.ReportStatus.FAILED);
            report.setErrorMessage(e.getMessage());
            reportRepository.save(report);
        }
    }
    
    private String generateReportContent(Report report) {
        Map<String, Object> data = collectReportData(report);
        
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html><head>");
        html.append("<meta charset='UTF-8'>");
        html.append("<title>").append(report.getName()).append("</title>");
        html.append("<style>");
        html.append("body { font-family: Arial, sans-serif; margin: 40px; }");
        html.append("h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }");
        html.append("h2 { color: #1e40af; margin-top: 30px; }");
        html.append("table { width: 100%; border-collapse: collapse; margin: 20px 0; }");
        html.append("th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }");
        html.append("th { background-color: #f8fafc; font-weight: bold; }");
        html.append(".summary-box { background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; }");
        html.append(".metric { display: inline-block; margin: 10px 20px 10px 0; }");
        html.append(".metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }");
        html.append(".metric-label { font-size: 14px; color: #64748b; }");
        html.append("</style>");
        html.append("</head><body>");
        
        // Report header
        html.append("<h1>").append(report.getName()).append("</h1>");
        html.append("<p><strong>Report Type:</strong> ").append(getReportTypeLabel(report.getType())).append("</p>");
        html.append("<p><strong>Generated:</strong> ").append(report.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("</p>");
        
        if (report.getDescription() != null && !report.getDescription().trim().isEmpty()) {
            html.append("<p><strong>Description:</strong> ").append(report.getDescription()).append("</p>");
        }
        
        if (report.getDateFrom() != null || report.getDateTo() != null) {
            html.append("<p><strong>Date Range:</strong> ");
            if (report.getDateFrom() != null) {
                html.append("From ").append(report.getDateFrom().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            }
            if (report.getDateTo() != null) {
                html.append(" To ").append(report.getDateTo().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            }
            html.append("</p>");
        }
        
        // Report content based on type
        switch (report.getType()) {
            case "analysis_summary":
                generateAnalysisSummaryContent(html, data);
                break;
            case "user_activity":
                generateUserActivityContent(html, data);
                break;
            case "system_performance":
                generateSystemPerformanceContent(html, data);
                break;
            case "prediction_accuracy":
                generatePredictionAccuracyContent(html, data);
                break;
            default:
                generateCustomReportContent(html, data);
                break;
        }
        
        html.append("</body></html>");
        return html.toString();
    }
    
    private Map<String, Object> collectReportData(Report report) {
        Map<String, Object> data = new HashMap<>();
        
        User user = report.getUser();
        
        // Get user's sequences within date range
        List<Sequence> sequences;
        if (report.getDateFrom() != null && report.getDateTo() != null) {
            sequences = sequenceRepository.findByUserIdAndCreatedAtBetween(
                user.getId(), report.getDateFrom(), report.getDateTo());
        } else {
            sequences = sequenceRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        }
        
        data.put("sequences", sequences);
        data.put("user", user);
        data.put("totalSequences", sequences.size());
        
        // Calculate statistics
        long diseaseAssociated = sequences.stream()
                .filter(s -> s.getPrediction() != null && 
                           s.getPrediction().getResult() == com.geneinsight.entity.Prediction.PredictionResult.DISEASE_ASSOCIATED)
                .count();
        
        data.put("diseaseAssociatedCount", diseaseAssociated);
        data.put("nonDiseaseCount", sequences.size() - diseaseAssociated);
        
        if (!sequences.isEmpty()) {
            double avgConfidence = sequences.stream()
                    .filter(s -> s.getPrediction() != null && s.getPrediction().getConfidenceScore() != null)
                    .mapToDouble(s -> s.getPrediction().getConfidenceScore())
                    .average()
                    .orElse(0.0);
            data.put("averageConfidence", avgConfidence);
        }
        
        return data;
    }
    
    private void generateAnalysisSummaryContent(StringBuilder html, Map<String, Object> data) {
        html.append("<h2>Analysis Summary</h2>");
        
        html.append("<div class='summary-box'>");
        html.append("<div class='metric'>");
        html.append("<div class='metric-value'>").append(data.get("totalSequences")).append("</div>");
        html.append("<div class='metric-label'>Total Sequences Analyzed</div>");
        html.append("</div>");
        
        html.append("<div class='metric'>");
        html.append("<div class='metric-value'>").append(data.get("diseaseAssociatedCount")).append("</div>");
        html.append("<div class='metric-label'>Disease Associated</div>");
        html.append("</div>");
        
        html.append("<div class='metric'>");
        html.append("<div class='metric-value'>").append(data.get("nonDiseaseCount")).append("</div>");
        html.append("<div class='metric-label'>Non-Disease</div>");
        html.append("</div>");
        
        if (data.containsKey("averageConfidence")) {
            html.append("<div class='metric'>");
            html.append("<div class='metric-value'>").append(String.format("%.1f%%", (Double) data.get("averageConfidence") * 100)).append("</div>");
            html.append("<div class='metric-label'>Average Confidence</div>");
            html.append("</div>");
        }
        html.append("</div>");
        
        // Recent sequences table
        @SuppressWarnings("unchecked")
        List<Sequence> sequences = (List<Sequence>) data.get("sequences");
        
        if (!sequences.isEmpty()) {
            html.append("<h3>Recent Sequences</h3>");
            html.append("<table>");
            html.append("<tr><th>Name</th><th>Length</th><th>Prediction</th><th>Confidence</th><th>Date</th></tr>");
            
            sequences.stream().limit(10).forEach(seq -> {
                html.append("<tr>");
                html.append("<td>").append(seq.getName()).append("</td>");
                html.append("<td>").append(seq.getSequenceData().length()).append("</td>");
                html.append("<td>").append(seq.getPrediction() != null ? seq.getPrediction().getResult() : "N/A").append("</td>");
                html.append("<td>").append(seq.getPrediction() != null && seq.getPrediction().getConfidenceScore() != null ? String.format("%.1f%%", seq.getPrediction().getConfidenceScore() * 100) : "N/A").append("</td>");
                html.append("<td>").append(seq.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))).append("</td>");
                html.append("</tr>");
            });
            
            html.append("</table>");
        }
    }
    
    private void generateUserActivityContent(StringBuilder html, Map<String, Object> data) {
        html.append("<h2>User Activity Report</h2>");
        html.append("<p>This report shows user activity and engagement metrics.</p>");
        
        html.append("<div class='summary-box'>");
        html.append("<div class='metric'>");
        html.append("<div class='metric-value'>").append(data.get("totalSequences")).append("</div>");
        html.append("<div class='metric-label'>Sequences Submitted</div>");
        html.append("</div>");
        html.append("</div>");
    }
    
    private void generateSystemPerformanceContent(StringBuilder html, Map<String, Object> data) {
        html.append("<h2>System Performance Report</h2>");
        html.append("<p>This report shows system performance metrics and statistics.</p>");
        
        html.append("<div class='summary-box'>");
        html.append("<div class='metric'>");
        html.append("<div class='metric-value'>").append(data.get("totalSequences")).append("</div>");
        html.append("<div class='metric-label'>Total Analyses</div>");
        html.append("</div>");
        html.append("</div>");
    }
    
    private void generatePredictionAccuracyContent(StringBuilder html, Map<String, Object> data) {
        html.append("<h2>Prediction Accuracy Report</h2>");
        html.append("<p>This report shows ML model performance and prediction accuracy metrics.</p>");
        
        if (data.containsKey("averageConfidence")) {
            html.append("<div class='summary-box'>");
            html.append("<div class='metric'>");
            html.append("<div class='metric-value'>").append(String.format("%.1f%%", (Double) data.get("averageConfidence") * 100)).append("</div>");
            html.append("<div class='metric-label'>Average Prediction Confidence</div>");
            html.append("</div>");
            html.append("</div>");
        }
    }
    
    private void generateCustomReportContent(StringBuilder html, Map<String, Object> data) {
        html.append("<h2>Custom Report</h2>");
        html.append("<p>This is a custom report with selected data and metrics.</p>");
        
        html.append("<div class='summary-box'>");
        html.append("<div class='metric'>");
        html.append("<div class='metric-value'>").append(data.get("totalSequences")).append("</div>");
        html.append("<div class='metric-label'>Total Records</div>");
        html.append("</div>");
        html.append("</div>");
    }
    
    private String getReportTypeLabel(String type) {
        return switch (type) {
            case "analysis_summary" -> "Analysis Summary";
            case "user_activity" -> "User Activity";
            case "system_performance" -> "System Performance";
            case "prediction_accuracy" -> "Prediction Accuracy";
            case "custom" -> "Custom Report";
            default -> type.replace("_", " ").toUpperCase();
        };
    }
    
    public Resource downloadReport(Long reportId, String userEmail) throws IOException {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Report report = reportRepository.findByIdAndUserId(reportId, user.getId())
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        if (report.getStatus() != Report.ReportStatus.COMPLETED) {
            throw new RuntimeException("Report is not ready for download");
        }
        
        Path filePath = Paths.get(report.getFilePath());
        if (!Files.exists(filePath)) {
            throw new RuntimeException("Report file not found");
        }
        
        return new UrlResource(filePath.toUri());
    }
    
    public ReportResponse getReportStatus(Long reportId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Report report = reportRepository.findByIdAndUserId(reportId, user.getId())
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        return ReportResponse.fromEntity(report);
    }
}
