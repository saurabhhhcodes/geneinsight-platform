package com.geneinsight.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "prediction_result")
    private PredictionResult result;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(name = "model_version")
    private String modelVersion;

    @Column(name = "processing_time_ms")
    private Long processingTimeMs;

    @Lob
    @Column(name = "feature_importance", columnDefinition = "JSON")
    private String featureImportance;

    @CreationTimestamp
    @Column(name = "prediction_date")
    private LocalDateTime predictionDate;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sequence_id")
    private Sequence sequence;

    public enum PredictionResult {
        DISEASE_ASSOCIATED, NON_DISEASE, UNCERTAIN
    }
}
