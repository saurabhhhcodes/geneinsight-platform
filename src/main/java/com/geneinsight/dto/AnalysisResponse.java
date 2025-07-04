package com.geneinsight.dto;

import com.geneinsight.entity.Prediction;
import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class AnalysisResponse {
    private Long sequenceId;
    private String sequenceName;
    private Integer sequenceLength;
    private Prediction.PredictionResult prediction;
    private Double confidence;
    private String modelVersion;
    private Long processingTimeMs;
    private LocalDateTime analysisDate;
    private Map<String, Object> features;
    private Map<String, Double> featureImportance;
}
