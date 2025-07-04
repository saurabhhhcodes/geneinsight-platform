package com.geneinsight.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;

@Configuration
public class ServiceUrlConfig {

    @Value("${ML_SERVICE_URL:http://localhost:5000}")
    private String mlServiceUrl;

    @Bean
    public String mlServiceUrl() {
        // Add https:// if the URL doesn't already have a protocol
        if (mlServiceUrl != null && !mlServiceUrl.startsWith("http")) {
            return "https://" + mlServiceUrl;
        }
        return mlServiceUrl;
    }
}
