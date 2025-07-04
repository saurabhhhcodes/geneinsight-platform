package com.geneinsight.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReportRequest {
    
    @NotBlank(message = "Report type is required")
    private String type;
    
    @NotBlank(message = "Report name is required")
    private String name;
    
    private String description;
    
    private DateRange dateRange;
    
    private ReportOptions options;
    
    @Data
    public static class DateRange {
        private String from;
        private String to;
    }
    
    @Data
    public static class ReportOptions {
        private Boolean includeCharts = true;
        private Boolean includeRawData = false;
    }
}
