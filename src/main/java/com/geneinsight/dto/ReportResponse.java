package com.geneinsight.dto;

import com.geneinsight.entity.Report;
import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@Builder
public class ReportResponse {
    
    private Long id;
    private String name;
    private String type;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private LocalDateTime dateFrom;
    private LocalDateTime dateTo;
    private Boolean includeCharts;
    private Boolean includeRawData;
    private Long fileSize;
    private String errorMessage;
    private String downloadUrl;
    
    public static ReportResponse fromEntity(Report report) {
        return ReportResponse.builder()
                .id(report.getId())
                .name(report.getName())
                .type(report.getType())
                .description(report.getDescription())
                .status(report.getStatus().name().toLowerCase())
                .createdAt(report.getCreatedAt())
                .completedAt(report.getCompletedAt())
                .dateFrom(report.getDateFrom())
                .dateTo(report.getDateTo())
                .includeCharts(report.getIncludeCharts())
                .includeRawData(report.getIncludeRawData())
                .fileSize(report.getFileSize())
                .errorMessage(report.getErrorMessage())
                .downloadUrl(report.getStatus() == Report.ReportStatus.COMPLETED ? 
                    "/api/reports/" + report.getId() + "/download" : null)
                .build();
    }
}
