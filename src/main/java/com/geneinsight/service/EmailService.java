package com.geneinsight.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username:noreply@geneinsight.com}")
    private String fromEmail;
    
    @Value("${app.name:GeneInsight Platform}")
    private String appName;
    
    public void sendOtpEmail(String toEmail, String otpCode, String purpose) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(getSubject(purpose));
            message.setText(getEmailBody(otpCode, purpose));
            
            // For development/testing, just log the OTP instead of sending email
            if (isTestEnvironment()) {
                log.info("=== OTP EMAIL (TEST MODE) ===");
                log.info("To: {}", toEmail);
                log.info("Subject: {}", message.getSubject());
                log.info("OTP Code: {}", otpCode);
                log.info("Purpose: {}", purpose);
                log.info("=============================");
            } else {
                mailSender.send(message);
                log.info("OTP email sent successfully to: {}", toEmail);
            }
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {}", toEmail, e);
            // In test mode, still log the OTP for development
            if (isTestEnvironment()) {
                log.info("=== OTP EMAIL (FALLBACK) ===");
                log.info("To: {}", toEmail);
                log.info("OTP Code: {}", otpCode);
                log.info("Purpose: {}", purpose);
                log.info("============================");
            }
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
    
    private String getSubject(String purpose) {
        switch (purpose.toLowerCase()) {
            case "registration":
                return appName + " - Verify Your Registration";
            case "login":
                return appName + " - Login Verification Code";
            case "password_reset":
                return appName + " - Password Reset Code";
            default:
                return appName + " - Verification Code";
        }
    }
    
    private String getEmailBody(String otpCode, String purpose) {
        StringBuilder body = new StringBuilder();
        body.append("Hello,\n\n");
        
        switch (purpose.toLowerCase()) {
            case "registration":
                body.append("Welcome to ").append(appName).append("!\n\n");
                body.append("Please use the following verification code to complete your registration:\n\n");
                break;
            case "login":
                body.append("Someone is trying to log in to your ").append(appName).append(" account.\n\n");
                body.append("Please use the following verification code to complete your login:\n\n");
                break;
            case "password_reset":
                body.append("You have requested to reset your password for ").append(appName).append(".\n\n");
                body.append("Please use the following verification code to reset your password:\n\n");
                break;
            default:
                body.append("Please use the following verification code:\n\n");
                break;
        }
        
        body.append("Verification Code: ").append(otpCode).append("\n\n");
        body.append("This code will expire in 10 minutes.\n\n");
        body.append("If you didn't request this code, please ignore this email.\n\n");
        body.append("Best regards,\n");
        body.append("The ").append(appName).append(" Team");
        
        return body.toString();
    }
    
    private boolean isTestEnvironment() {
        // Check if we're in test/development mode
        String profile = System.getProperty("spring.profiles.active", "");
        return profile.contains("test") || profile.contains("dev") || profile.isEmpty();
    }
    
    public void sendWelcomeEmail(String toEmail, String firstName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Welcome to " + appName + "!");
            
            StringBuilder body = new StringBuilder();
            body.append("Hello ").append(firstName).append(",\n\n");
            body.append("Welcome to ").append(appName).append("!\n\n");
            body.append("Your account has been successfully created and verified.\n\n");
            body.append("You can now:\n");
            body.append("• Analyze DNA sequences with our advanced AI algorithms\n");
            body.append("• Generate 3D molecular structures\n");
            body.append("• Create comprehensive analysis reports\n");
            body.append("• Visualize complex genomic data\n\n");
            body.append("Get started by logging in to your dashboard.\n\n");
            body.append("Best regards,\n");
            body.append("The ").append(appName).append(" Team");
            
            message.setText(body.toString());
            
            if (isTestEnvironment()) {
                log.info("=== WELCOME EMAIL (TEST MODE) ===");
                log.info("To: {}", toEmail);
                log.info("Subject: {}", message.getSubject());
                log.info("================================");
            } else {
                mailSender.send(message);
                log.info("Welcome email sent successfully to: {}", toEmail);
            }
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", toEmail, e);
        }
    }
}
