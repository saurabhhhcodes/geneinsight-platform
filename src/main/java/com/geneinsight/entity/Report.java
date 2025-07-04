package com.geneinsight.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String type;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status;
    
    @Column(name = "file_path")
    private String filePath;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "date_from")
    private LocalDateTime dateFrom;
    
    @Column(name = "date_to")
    private LocalDateTime dateTo;
    
    @Column(name = "include_charts")
    private Boolean includeCharts;
    
    @Column(name = "include_raw_data")
    private Boolean includeRawData;
    
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = ReportStatus.GENERATING;
        }
    }
    
    public enum ReportStatus {
        GENERATING,
        COMPLETED,
        FAILED
    }
}
