package com.geneinsight.repository;

import com.geneinsight.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {
    
    Optional<OtpToken> findByEmailAndOtpCodeAndType(String email, String otpCode, OtpToken.OtpType type);
    
    @Query("SELECT o FROM OtpToken o WHERE o.email = :email AND o.type = :type AND o.isUsed = false AND o.expiryTime > :now ORDER BY o.createdAt DESC")
    List<OtpToken> findValidOtpsByEmailAndType(@Param("email") String email, @Param("type") OtpToken.OtpType type, @Param("now") LocalDateTime now);
    
    @Query("SELECT o FROM OtpToken o WHERE o.email = :email AND o.type = :type ORDER BY o.createdAt DESC")
    List<OtpToken> findByEmailAndTypeOrderByCreatedAtDesc(@Param("email") String email, @Param("type") OtpToken.OtpType type);
    
    @Query("SELECT o FROM OtpToken o WHERE o.expiryTime < :now")
    List<OtpToken> findExpiredTokens(@Param("now") LocalDateTime now);
    
    void deleteByExpiryTimeBefore(LocalDateTime dateTime);
    
    @Query("SELECT COUNT(o) FROM OtpToken o WHERE o.email = :email AND o.type = :type AND o.createdAt > :since")
    long countByEmailAndTypeAndCreatedAtAfter(@Param("email") String email, @Param("type") OtpToken.OtpType type, @Param("since") LocalDateTime since);
}
