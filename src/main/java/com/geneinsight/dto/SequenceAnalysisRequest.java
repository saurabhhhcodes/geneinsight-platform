package com.geneinsight.dto;

import com.geneinsight.entity.Sequence;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SequenceAnalysisRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String sequenceData;

    private Sequence.SequenceType type = Sequence.SequenceType.DNA;
}
