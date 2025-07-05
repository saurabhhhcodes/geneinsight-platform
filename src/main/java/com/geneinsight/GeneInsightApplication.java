package com.geneinsight;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Main Spring Boot Application for GeneInsight Platform
 * 
 * This application provides:
 * - RESTful API for DNA sequence analysis
 * - JWT-based authentication
 * - Integration with ML services
 * - Database persistence for analysis results
 * - Real-time WebSocket communication
 */
@SpringBootApplication
public class GeneInsightApplication {

    public static void main(String[] args) {
        SpringApplication.run(GeneInsightApplication.class, args);
        System.out.println("🧬 GeneInsight Platform Backend Started Successfully!");
        System.out.println("📊 API Documentation: http://localhost:8080/swagger-ui.html");
        System.out.println("🔍 Health Check: http://localhost:8080/api/health");
    }

    /**
     * Configure CORS to allow frontend access
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(
                            "http://localhost:3000",
                            "http://localhost:3001", 
                            "https://geneinsight-platform.vercel.app",
                            "https://*.vercel.app"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
