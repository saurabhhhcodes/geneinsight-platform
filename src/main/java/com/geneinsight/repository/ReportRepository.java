package com.geneinsight.repository;

import com.geneinsight.entity.Report;
import com.geneinsight.entity.Report.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    List<Report> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Page<Report> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    List<Report> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, ReportStatus status);
    
    Optional<Report> findByIdAndUserId(Long id, Long userId);
    
    @Query("SELECT r FROM Report r WHERE r.user.id = :userId AND r.createdAt BETWEEN :startDate AND :endDate ORDER BY r.createdAt DESC")
    List<Report> findByUserIdAndDateRange(@Param("userId") Long userId, 
                                         @Param("startDate") LocalDateTime startDate, 
                                         @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.user.id = :userId AND r.status = :status")
    Long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") ReportStatus status);
    
    @Query("SELECT r FROM Report r WHERE r.status = :status AND r.createdAt < :cutoffTime")
    List<Report> findStaleReports(@Param("status") ReportStatus status, @Param("cutoffTime") LocalDateTime cutoffTime);
}
