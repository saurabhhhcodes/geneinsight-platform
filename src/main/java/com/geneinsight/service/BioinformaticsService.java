package com.geneinsight.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class BioinformaticsService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final StructureGenerationService structureGenerationService;

    public Map<String, Object> extractFeatures(String sequence) {
        Map<String, Object> features = new HashMap<>();
        
        // Basic sequence statistics
        features.put("length", sequence.length());
        features.put("gcContent", calculateGCContent(sequence));
        features.put("atContent", calculateATContent(sequence));
        
        // Codon usage analysis
        features.put("codonUsage", analyzeCodonUsage(sequence));
        
        // ORF detection
        features.put("orfs", detectORFs(sequence));
        features.put("orfCount", ((List<?>) features.get("orfs")).size());
        
        // Motif detection
        features.put("motifs", detectMotifs(sequence));
        
        // Amino acid composition (if translatable)
        if (sequence.length() % 3 == 0) {
            features.put("aminoAcidFrequency", analyzeAminoAcidFrequency(sequence));
        }
        
        return features;
    }

    private double calculateGCContent(String sequence) {
        long gcCount = sequence.chars()
                .filter(c -> c == 'G' || c == 'C')
                .count();
        return (double) gcCount / sequence.length() * 100;
    }

    private double calculateATContent(String sequence) {
        long atCount = sequence.chars()
                .filter(c -> c == 'A' || c == 'T')
                .count();
        return (double) atCount / sequence.length() * 100;
    }

    private Map<String, Integer> analyzeCodonUsage(String sequence) {
        Map<String, Integer> codonCount = new HashMap<>();
        
        for (int i = 0; i <= sequence.length() - 3; i += 3) {
            String codon = sequence.substring(i, i + 3);
            codonCount.put(codon, codonCount.getOrDefault(codon, 0) + 1);
        }
        
        return codonCount;
    }

    private List<Map<String, Object>> detectORFs(String sequence) {
        List<Map<String, Object>> orfs = new ArrayList<>();
        String[] startCodons = {"ATG"};
        String[] stopCodons = {"TAA", "TAG", "TGA"};
        
        for (String startCodon : startCodons) {
            Pattern startPattern = Pattern.compile(startCodon);
            Matcher startMatcher = startPattern.matcher(sequence);
            
            while (startMatcher.find()) {
                int startPos = startMatcher.start();
                
                // Look for stop codon in the same reading frame
                for (int i = startPos + 3; i <= sequence.length() - 3; i += 3) {
                    String codon = sequence.substring(i, i + 3);
                    
                    if (Arrays.asList(stopCodons).contains(codon)) {
                        Map<String, Object> orf = new HashMap<>();
                        orf.put("start", startPos);
                        orf.put("end", i + 3);
                        orf.put("length", i + 3 - startPos);
                        orf.put("sequence", sequence.substring(startPos, i + 3));
                        orfs.add(orf);
                        break;
                    }
                }
            }
        }
        
        return orfs;
    }

    private List<Map<String, Object>> detectMotifs(String sequence) {
        List<Map<String, Object>> motifs = new ArrayList<>();
        
        // Common DNA motifs
        Map<String, String> motifPatterns = new HashMap<>();
        motifPatterns.put("TATA Box", "TATAWAAW");
        motifPatterns.put("CAAT Box", "CCAAT");
        motifPatterns.put("GC Box", "GGGCGG");
        motifPatterns.put("Kozak Sequence", "GCCRCCATGG");
        
        for (Map.Entry<String, String> entry : motifPatterns.entrySet()) {
            String motifName = entry.getKey();
            String pattern = entry.getValue()
                    .replace("W", "[AT]")
                    .replace("R", "[AG]")
                    .replace("Y", "[CT]")
                    .replace("N", "[ATCG]");
            
            Pattern motifPattern = Pattern.compile(pattern);
            Matcher matcher = motifPattern.matcher(sequence);
            
            while (matcher.find()) {
                Map<String, Object> motif = new HashMap<>();
                motif.put("name", motifName);
                motif.put("start", matcher.start());
                motif.put("end", matcher.end());
                motif.put("sequence", matcher.group());
                motifs.add(motif);
            }
        }
        
        return motifs;
    }

    private Map<String, Integer> analyzeAminoAcidFrequency(String sequence) {
        Map<String, String> geneticCode = getGeneticCode();
        Map<String, Integer> aaFrequency = new HashMap<>();
        
        for (int i = 0; i <= sequence.length() - 3; i += 3) {
            String codon = sequence.substring(i, i + 3);
            String aminoAcid = geneticCode.getOrDefault(codon, "X");
            aaFrequency.put(aminoAcid, aaFrequency.getOrDefault(aminoAcid, 0) + 1);
        }
        
        return aaFrequency;
    }

    private Map<String, String> getGeneticCode() {
        Map<String, String> geneticCode = new HashMap<>();
        
        // Standard genetic code
        geneticCode.put("TTT", "F"); geneticCode.put("TTC", "F"); geneticCode.put("TTA", "L"); geneticCode.put("TTG", "L");
        geneticCode.put("TCT", "S"); geneticCode.put("TCC", "S"); geneticCode.put("TCA", "S"); geneticCode.put("TCG", "S");
        geneticCode.put("TAT", "Y"); geneticCode.put("TAC", "Y"); geneticCode.put("TAA", "*"); geneticCode.put("TAG", "*");
        geneticCode.put("TGT", "C"); geneticCode.put("TGC", "C"); geneticCode.put("TGA", "*"); geneticCode.put("TGG", "W");
        
        geneticCode.put("CTT", "L"); geneticCode.put("CTC", "L"); geneticCode.put("CTA", "L"); geneticCode.put("CTG", "L");
        geneticCode.put("CCT", "P"); geneticCode.put("CCC", "P"); geneticCode.put("CCA", "P"); geneticCode.put("CCG", "P");
        geneticCode.put("CAT", "H"); geneticCode.put("CAC", "H"); geneticCode.put("CAA", "Q"); geneticCode.put("CAG", "Q");
        geneticCode.put("CGT", "R"); geneticCode.put("CGC", "R"); geneticCode.put("CGA", "R"); geneticCode.put("CGG", "R");
        
        geneticCode.put("ATT", "I"); geneticCode.put("ATC", "I"); geneticCode.put("ATA", "I"); geneticCode.put("ATG", "M");
        geneticCode.put("ACT", "T"); geneticCode.put("ACC", "T"); geneticCode.put("ACA", "T"); geneticCode.put("ACG", "T");
        geneticCode.put("AAT", "N"); geneticCode.put("AAC", "N"); geneticCode.put("AAA", "K"); geneticCode.put("AAG", "K");
        geneticCode.put("AGT", "S"); geneticCode.put("AGC", "S"); geneticCode.put("AGA", "R"); geneticCode.put("AGG", "R");
        
        geneticCode.put("GTT", "V"); geneticCode.put("GTC", "V"); geneticCode.put("GTA", "V"); geneticCode.put("GTG", "V");
        geneticCode.put("GCT", "A"); geneticCode.put("GCC", "A"); geneticCode.put("GCA", "A"); geneticCode.put("GCG", "A");
        geneticCode.put("GAT", "D"); geneticCode.put("GAC", "D"); geneticCode.put("GAA", "E"); geneticCode.put("GAG", "E");
        geneticCode.put("GGT", "G"); geneticCode.put("GGC", "G"); geneticCode.put("GGA", "G"); geneticCode.put("GGG", "G");
        
        return geneticCode;
    }

    public String translateToProtein(String dnaSequence) {
        Map<String, String> geneticCode = getGeneticCode();
        StringBuilder protein = new StringBuilder();
        
        for (int i = 0; i <= dnaSequence.length() - 3; i += 3) {
            String codon = dnaSequence.substring(i, i + 3);
            String aminoAcid = geneticCode.getOrDefault(codon, "X");
            
            if (aminoAcid.equals("*")) {
                break; // Stop codon
            }
            
            protein.append(aminoAcid);
        }
        
        return protein.toString();
    }

    /**
     * Generate 3D structure from DNA sequence
     */
    public Map<String, Object> generate3DStructure(String dnaSequence) {
        try {
            log.info("Starting 3D structure generation for DNA sequence of length: {}", dnaSequence.length());

            // Validate DNA sequence
            if (!isValidDNASequence(dnaSequence)) {
                throw new IllegalArgumentException("Invalid DNA sequence provided");
            }

            // Generate 3D structure using the structure generation service
            Map<String, Object> structureResult = structureGenerationService.generateStructureFromDNA(dnaSequence);

            // Add additional analysis information
            Map<String, Object> analysisFeatures = extractFeatures(dnaSequence);
            structureResult.put("sequenceAnalysis", analysisFeatures);

            log.info("3D structure generation completed successfully");
            return structureResult;

        } catch (Exception e) {
            log.error("Error generating 3D structure from DNA sequence", e);
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("success", false);
            errorResult.put("error", "Failed to generate 3D structure: " + e.getMessage());
            return errorResult;
        }
    }

    /**
     * Validate DNA sequence
     */
    private boolean isValidDNASequence(String sequence) {
        if (sequence == null || sequence.trim().isEmpty()) {
            return false;
        }

        // Check if sequence contains only valid DNA bases
        String cleanSequence = sequence.toUpperCase().replaceAll("\\s", "");
        return cleanSequence.matches("[ATCG]+");
    }

    /**
     * Enhanced analysis with 3D structure prediction capability
     */
    public Map<String, Object> analyzeSequenceWithStructure(String sequence, boolean include3D) {
        Map<String, Object> result = new HashMap<>();

        try {
            // Basic sequence analysis
            Map<String, Object> basicAnalysis = extractFeatures(sequence);
            result.put("basicAnalysis", basicAnalysis);

            // Add 3D structure if requested
            if (include3D) {
                Map<String, Object> structureData = generate3DStructure(sequence);
                result.put("structure3D", structureData);
            }

            result.put("success", true);
            result.put("timestamp", System.currentTimeMillis());

        } catch (Exception e) {
            log.error("Error in enhanced sequence analysis", e);
            result.put("success", false);
            result.put("error", e.getMessage());
        }

        return result;
    }
}
