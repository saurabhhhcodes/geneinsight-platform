package com.geneinsight.controller;

import com.geneinsight.dto.*;
import com.geneinsight.entity.OtpToken;
import com.geneinsight.service.AuthService;
import com.geneinsight.service.OtpService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private OtpService otpService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        try {
            return ResponseEntity.ok(authService.login(loginRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        try {
            return ResponseEntity.ok(authService.register(signUpRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // OTP Endpoints
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@Valid @RequestBody OtpRequest otpRequest) {
        try {
            otpService.generateAndSendOtp(otpRequest.getEmail(), otpRequest.getType());
            log.info("OTP sent successfully to: {}", otpRequest.getEmail());
            return ResponseEntity.ok(Map.of(
                "message", "OTP sent successfully",
                "email", otpRequest.getEmail(),
                "type", otpRequest.getType().toString()
            ));
        } catch (Exception e) {
            log.error("Failed to send OTP to: {}", otpRequest.getEmail(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody OtpVerificationRequest verificationRequest) {
        try {
            boolean isValid = otpService.verifyOtp(
                verificationRequest.getEmail(),
                verificationRequest.getOtpCode(),
                verificationRequest.getType()
            );

            if (isValid) {
                log.info("OTP verified successfully for: {}", verificationRequest.getEmail());
                return ResponseEntity.ok(Map.of(
                    "message", "OTP verified successfully",
                    "verified", true,
                    "email", verificationRequest.getEmail()
                ));
            } else {
                int remainingAttempts = otpService.getRemainingAttempts(
                    verificationRequest.getEmail(),
                    verificationRequest.getType()
                );

                log.warn("OTP verification failed for: {}", verificationRequest.getEmail());
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid OTP code",
                    "verified", false,
                    "remainingAttempts", remainingAttempts
                ));
            }
        } catch (Exception e) {
            log.error("Error verifying OTP for: {}", verificationRequest.getEmail(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register-with-otp")
    public ResponseEntity<?> registerWithOtp(@Valid @RequestBody RegisterRequest signUpRequest) {
        try {
            // First, send OTP for registration verification
            otpService.generateAndSendOtp(signUpRequest.getEmail(), OtpToken.OtpType.REGISTRATION);

            // Store registration data temporarily (in a real app, you might use Redis or database)
            // For now, we'll return a message asking for OTP verification

            return ResponseEntity.ok(Map.of(
                "message", "Registration initiated. Please verify your email with the OTP sent to your email address.",
                "email", signUpRequest.getEmail(),
                "step", "otp_verification_required"
            ));
        } catch (Exception e) {
            log.error("Failed to initiate registration for: {}", signUpRequest.getEmail(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/complete-registration")
    public ResponseEntity<?> completeRegistration(
            @Valid @RequestBody RegisterRequest signUpRequest,
            @RequestParam String otpCode) {
        try {
            // Verify OTP first
            boolean isOtpValid = otpService.verifyOtp(
                signUpRequest.getEmail(),
                otpCode,
                OtpToken.OtpType.REGISTRATION
            );

            if (!isOtpValid) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid or expired OTP code"
                ));
            }

            // If OTP is valid, complete registration
            return ResponseEntity.ok(authService.register(signUpRequest));
        } catch (Exception e) {
            log.error("Failed to complete registration for: {}", signUpRequest.getEmail(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok("Refresh token functionality not implemented yet");
    }
}
