package com.geneinsight.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpToken {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false, length = 6)
    private String otpCode;
    
    @Column(nullable = false)
    private LocalDateTime expiryTime;
    
    @Column(nullable = false)
    private Boolean isUsed = false;
    
    @Column(nullable = false)
    private Boolean isVerified = false;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OtpType type;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
    
    @Column(name = "attempts")
    private Integer attempts = 0;
    
    @Column(name = "max_attempts")
    private Integer maxAttempts = 3;
    
    public enum OtpType {
        REGISTRATION,
        LOGIN,
        PASSWORD_RESET,
        EMAIL_VERIFICATION
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryTime);
    }
    
    public boolean isValid() {
        return !isUsed && !isExpired() && attempts < maxAttempts;
    }
    
    public void incrementAttempts() {
        this.attempts++;
    }
    
    public void markAsUsed() {
        this.isUsed = true;
        this.verifiedAt = LocalDateTime.now();
    }
    
    public void markAsVerified() {
        this.isVerified = true;
        this.verifiedAt = LocalDateTime.now();
    }
}
