package com.geneinsight.service;

import com.geneinsight.entity.OtpToken;
import com.geneinsight.repository.OtpTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {
    
    private final OtpTokenRepository otpTokenRepository;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();
    
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final int MAX_OTP_REQUESTS_PER_HOUR = 5;
    
    @Transactional
    public String generateAndSendOtp(String email, OtpToken.OtpType type) {
        // Check rate limiting
        if (isRateLimited(email, type)) {
            throw new RuntimeException("Too many OTP requests. Please try again later.");
        }
        
        // Invalidate any existing OTPs for this email and type
        invalidateExistingOtps(email, type);
        
        // Generate new OTP
        String otpCode = generateOtpCode();
        
        // Create and save OTP token
        OtpToken otpToken = OtpToken.builder()
                .email(email)
                .otpCode(otpCode)
                .type(type)
                .expiryTime(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .isUsed(false)
                .isVerified(false)
                .attempts(0)
                .maxAttempts(3)
                .build();
        
        otpTokenRepository.save(otpToken);
        
        // Send OTP via email
        try {
            emailService.sendOtpEmail(email, otpCode, type.name().toLowerCase());
            log.info("OTP generated and sent for email: {} with type: {}", email, type);
        } catch (Exception e) {
            log.error("Failed to send OTP email for: {}", email, e);
            throw new RuntimeException("Failed to send OTP email");
        }
        
        return otpCode; // Return for testing purposes
    }
    
    @Transactional
    public boolean verifyOtp(String email, String otpCode, OtpToken.OtpType type) {
        List<OtpToken> validOtps = otpTokenRepository.findValidOtpsByEmailAndType(
                email, type, LocalDateTime.now());
        
        for (OtpToken otp : validOtps) {
            if (otp.getOtpCode().equals(otpCode)) {
                if (otp.isValid()) {
                    otp.markAsUsed();
                    otp.markAsVerified();
                    otpTokenRepository.save(otp);
                    log.info("OTP verified successfully for email: {} with type: {}", email, type);
                    return true;
                } else {
                    otp.incrementAttempts();
                    otpTokenRepository.save(otp);
                    log.warn("Invalid OTP attempt for email: {} with type: {}", email, type);
                }
            } else {
                otp.incrementAttempts();
                otpTokenRepository.save(otp);
            }
        }
        
        log.warn("OTP verification failed for email: {} with type: {}", email, type);
        return false;
    }
    
    private String generateOtpCode() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(secureRandom.nextInt(10));
        }
        return otp.toString();
    }
    
    private boolean isRateLimited(String email, OtpToken.OtpType type) {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        long recentRequests = otpTokenRepository.countByEmailAndTypeAndCreatedAtAfter(
                email, type, oneHourAgo);
        return recentRequests >= MAX_OTP_REQUESTS_PER_HOUR;
    }
    
    private void invalidateExistingOtps(String email, OtpToken.OtpType type) {
        List<OtpToken> existingOtps = otpTokenRepository.findValidOtpsByEmailAndType(
                email, type, LocalDateTime.now());
        
        for (OtpToken otp : existingOtps) {
            otp.setIsUsed(true);
        }
        
        if (!existingOtps.isEmpty()) {
            otpTokenRepository.saveAll(existingOtps);
        }
    }
    
    @Transactional
    public void cleanupExpiredOtps() {
        LocalDateTime now = LocalDateTime.now();
        List<OtpToken> expiredTokens = otpTokenRepository.findExpiredTokens(now);
        
        if (!expiredTokens.isEmpty()) {
            otpTokenRepository.deleteAll(expiredTokens);
            log.info("Cleaned up {} expired OTP tokens", expiredTokens.size());
        }
    }
    
    public boolean hasValidOtp(String email, OtpToken.OtpType type) {
        List<OtpToken> validOtps = otpTokenRepository.findValidOtpsByEmailAndType(
                email, type, LocalDateTime.now());
        return !validOtps.isEmpty();
    }
    
    public int getRemainingAttempts(String email, OtpToken.OtpType type) {
        List<OtpToken> otps = otpTokenRepository.findValidOtpsByEmailAndType(
                email, type, LocalDateTime.now());
        
        if (otps.isEmpty()) {
            return 0;
        }
        
        OtpToken latestOtp = otps.get(0);
        return Math.max(0, latestOtp.getMaxAttempts() - latestOtp.getAttempts());
    }
}
