package com.geneinsight.dto;

import com.geneinsight.entity.OtpToken;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OtpVerificationRequest {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "OTP code is required")
    @Pattern(regexp = "\\d{6}", message = "OTP code must be 6 digits")
    private String otpCode;
    
    @NotNull(message = "OTP type is required")
    private OtpToken.OtpType type;
}
