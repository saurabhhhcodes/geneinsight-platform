package com.geneinsight.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "sequences")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sequence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "sequence_name")
    private String name;

    @NotBlank
    @Lob
    @Column(name = "sequence_data", columnDefinition = "LONGTEXT")
    private String sequenceData;

    @NotNull
    @Column(name = "sequence_length")
    private Integer length;

    @Enumerated(EnumType.STRING)
    @Column(name = "sequence_type")
    private SequenceType type = SequenceType.DNA;

    @CreationTimestamp
    @Column(name = "upload_time")
    private LocalDateTime uploadTime;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne(mappedBy = "sequence", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private SequenceFeatures features;

    @OneToOne(mappedBy = "sequence", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Prediction prediction;

    public enum SequenceType {
        DNA, RNA, PROTEIN
    }
}
