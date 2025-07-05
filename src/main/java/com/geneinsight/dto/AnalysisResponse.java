package com.geneinsight.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Response DTO for sequence analysis results
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AnalysisResponse {
    
    private boolean success = true;
    private String error;
    private String analysisId;
    private LocalDateTime timestamp;
    
    // Sequence information
    private String sequence;
    private String sequenceType;
    private int length;
    
    // Analysis results
    private Map<String, Integer> composition;
    private Double gcContent;
    private Double atContent;
    private List<Map<String, Object>> orfs;
    private List<Map<String, Object>> motifs;
    private String proteinSequence;
    private Map<String, Object> structure3D;
    
    // Quality metrics
    private Double confidence;
    private String quality;
    private Map<String, Object> analysis;

    // Constructors
    public AnalysisResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public static AnalysisResponse error(String errorMessage) {
        AnalysisResponse response = new AnalysisResponse();
        response.setSuccess(false);
        response.setError(errorMessage);
        return response;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getAnalysisId() {
        return analysisId;
    }

    public void setAnalysisId(String analysisId) {
        this.analysisId = analysisId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getSequence() {
        return sequence;
    }

    public void setSequence(String sequence) {
        this.sequence = sequence;
    }

    public String getSequenceType() {
        return sequenceType;
    }

    public void setSequenceType(String sequenceType) {
        this.sequenceType = sequenceType;
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public Map<String, Integer> getComposition() {
        return composition;
    }

    public void setComposition(Map<String, Integer> composition) {
        this.composition = composition;
    }

    public Double getGcContent() {
        return gcContent;
    }

    public void setGcContent(Double gcContent) {
        this.gcContent = gcContent;
    }

    public Double getAtContent() {
        return atContent;
    }

    public void setAtContent(Double atContent) {
        this.atContent = atContent;
    }

    public List<Map<String, Object>> getOrfs() {
        return orfs;
    }

    public void setOrfs(List<Map<String, Object>> orfs) {
        this.orfs = orfs;
    }

    public List<Map<String, Object>> getMotifs() {
        return motifs;
    }

    public void setMotifs(List<Map<String, Object>> motifs) {
        this.motifs = motifs;
    }

    public String getProteinSequence() {
        return proteinSequence;
    }

    public void setProteinSequence(String proteinSequence) {
        this.proteinSequence = proteinSequence;
    }

    public Map<String, Object> getStructure3D() {
        return structure3D;
    }

    public void setStructure3D(Map<String, Object> structure3D) {
        this.structure3D = structure3D;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getQuality() {
        return quality;
    }

    public void setQuality(String quality) {
        this.quality = quality;
    }

    public Map<String, Object> getAnalysis() {
        return analysis;
    }

    public void setAnalysis(Map<String, Object> analysis) {
        this.analysis = analysis;
    }
}
