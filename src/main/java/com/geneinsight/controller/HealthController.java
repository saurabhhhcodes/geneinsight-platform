package com.geneinsight.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", System.currentTimeMillis());
        status.put("service", "GeneInsight Platform");
        status.put("version", "1.0.0");
        
        Map<String, String> components = new HashMap<>();
        components.put("database", "UP");
        components.put("api", "UP");
        components.put("ml-service", "UP");
        
        status.put("components", components);
        
        return ResponseEntity.ok(status);
    }
}
