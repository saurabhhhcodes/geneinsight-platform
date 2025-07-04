package com.geneinsight.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "sequence_features")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SequenceFeatures {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "gc_content")
    private Double gcContent;

    @Column(name = "orf_count")
    private Integer orfCount;

    @Lob
    @Column(name = "codon_usage", columnDefinition = "JSON")
    private String codonUsage;

    @Lob
    @Column(name = "motifs_detected", columnDefinition = "JSON")
    private String motifsDetected;

    @Column(name = "amino_acid_frequency", columnDefinition = "JSON")
    private String aminoAcidFrequency;

    @Column(name = "molecular_weight")
    private Double molecularWeight;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sequence_id")
    private Sequence sequence;
}
