package com.geneinsight.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * Request DTO for sequence analysis
 */
public class AnalysisRequest {
    
    @NotBlank(message = "Sequence is required")
    @Size(min = 3, max = 50000, message = "Sequence must be between 3 and 50000 characters")
    private String sequence;
    
    private String sequenceType; // DNA, RNA, PROTEIN
    private String analysisType; // BASIC, COMPREHENSIVE, STRUCTURE_ONLY
    private boolean generateStructure = true;
    private boolean findMotifs = true;
    private boolean findOrfs = true;

    // Constructors
    public AnalysisRequest() {}

    public AnalysisRequest(String sequence) {
        this.sequence = sequence;
    }

    // Getters and Setters
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

    public String getAnalysisType() {
        return analysisType;
    }

    public void setAnalysisType(String analysisType) {
        this.analysisType = analysisType;
    }

    public boolean isGenerateStructure() {
        return generateStructure;
    }

    public void setGenerateStructure(boolean generateStructure) {
        this.generateStructure = generateStructure;
    }

    public boolean isFindMotifs() {
        return findMotifs;
    }

    public void setFindMotifs(boolean findMotifs) {
        this.findMotifs = findMotifs;
    }

    public boolean isFindOrfs() {
        return findOrfs;
    }

    public void setFindOrfs(boolean findOrfs) {
        this.findOrfs = findOrfs;
    }

    @Override
    public String toString() {
        return "AnalysisRequest{" +
                "sequence='" + (sequence != null ? sequence.substring(0, Math.min(sequence.length(), 50)) + "..." : null) + '\'' +
                ", sequenceType='" + sequenceType + '\'' +
                ", analysisType='" + analysisType + '\'' +
                ", generateStructure=" + generateStructure +
                ", findMotifs=" + findMotifs +
                ", findOrfs=" + findOrfs +
                '}';
    }
}
