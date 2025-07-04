package com.geneinsight.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class MLService {
    
    private final Random random = new Random();
    
    public Map<String, Object> analyzeSequence(String sequence) {
        Map<String, Object> result = new HashMap<>();
        
        // Basic sequence analysis
        result.put("length", sequence.length());
        result.put("gcContent", calculateGCContent(sequence));
        
        // Simulate ML prediction
        result.put("prediction", generatePrediction());
        result.put("confidence", 85 + random.nextInt(15)); // 85-99%
        
        // Additional analysis
        result.put("composition", getComposition(sequence));
        result.put("timestamp", System.currentTimeMillis());
        
        return result;
    }
    
    private double calculateGCContent(String sequence) {
        if (sequence.isEmpty()) return 0.0;
        
        long gcCount = sequence.toUpperCase().chars()
            .filter(c -> c == 'G' || c == 'C')
            .count();
        
        return Math.round((gcCount * 100.0 / sequence.length()) * 100.0) / 100.0;
    }
    
    private String generatePrediction() {
        String[] predictions = {
            "Protein-coding gene",
            "Non-coding RNA",
            "Regulatory sequence",
            "Intergenic region",
            "Pseudogene"
        };
        return predictions[random.nextInt(predictions.length)];
    }
    
    private Map<String, Integer> getComposition(String sequence) {
        Map<String, Integer> composition = new HashMap<>();
        composition.put("A", 0);
        composition.put("T", 0);
        composition.put("G", 0);
        composition.put("C", 0);
        composition.put("N", 0);
        
        for (char c : sequence.toUpperCase().toCharArray()) {
            String base = String.valueOf(c);
            if (composition.containsKey(base)) {
                composition.put(base, composition.get(base) + 1);
            } else {
                composition.put("N", composition.get("N") + 1);
            }
        }
        
        return composition;
    }
}
