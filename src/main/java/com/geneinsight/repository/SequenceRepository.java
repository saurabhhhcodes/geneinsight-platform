package com.geneinsight.repository;

import com.geneinsight.entity.Sequence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SequenceRepository extends JpaRepository<Sequence, Long> {
    
    List<Sequence> findByUserId(Long userId);
    
    Optional<Sequence> findByIdAndUserId(Long id, Long userId);
    
    @Query("SELECT s FROM Sequence s WHERE s.user.id = :userId ORDER BY s.uploadTime DESC")
    List<Sequence> findByUserIdOrderByUploadTimeDesc(@Param("userId") Long userId);

    @Query("SELECT s FROM Sequence s WHERE s.user.id = :userId ORDER BY s.createdAt DESC")
    List<Sequence> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT s FROM Sequence s WHERE s.user.id = :userId AND s.createdAt BETWEEN :startDate AND :endDate ORDER BY s.createdAt DESC")
    List<Sequence> findByUserIdAndCreatedAtBetween(@Param("userId") Long userId,
                                                  @Param("startDate") LocalDateTime startDate,
                                                  @Param("endDate") LocalDateTime endDate);

    @Query("SELECT s FROM Sequence s WHERE s.sequenceData LIKE %:pattern%")
    List<Sequence> findBySequenceDataContaining(@Param("pattern") String pattern);

    long countByUserId(Long userId);
}
