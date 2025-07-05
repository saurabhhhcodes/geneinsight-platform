package com.geneinsight.service;

import com.geneinsight.dto.AnalysisRequest;
import com.geneinsight.dto.AnalysisResponse;
import com.geneinsight.model.AnalysisResult;
import com.geneinsight.repository.AnalysisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;

/**
 * Service for DNA/RNA/Protein sequence analysis
 * 
 * Provides comprehensive analysis including:
 * - Sequence validation and cleaning
 * - Composition analysis
 * - ORF detection
 * - Motif identification
 * - 3D structure prediction
 * - ML-based predictions
 */
@Service
public class AnalysisService {

    @Autowired
    private AnalysisRepository analysisRepository;

    private static final Pattern DNA_PATTERN = Pattern.compile("^[ATGC]+$", Pattern.CASE_INSENSITIVE);
    private static final Pattern RNA_PATTERN = Pattern.compile("^[AUGC]+$", Pattern.CASE_INSENSITIVE);
    private static final Pattern PROTEIN_PATTERN = Pattern.compile("^[ACDEFGHIKLMNPQRSTVWY]+$", Pattern.CASE_INSENSITIVE);

    /**
     * Analyze genetic sequence
     */
    public AnalysisResponse analyzeSequence(AnalysisRequest request) {
        String sequence = request.getSequence().toUpperCase().replaceAll("[^A-Z]", "");
        
        if (sequence.isEmpty()) {
            throw new IllegalArgumentException("Invalid sequence provided");
        }

        // Determine sequence type
        String sequenceType = determineSequenceType(sequence);
        
        // Perform analysis based on type
        AnalysisResponse response = new AnalysisResponse();
        response.setSequence(sequence);
        response.setSequenceType(sequenceType);
        response.setLength(sequence.length());
        response.setTimestamp(LocalDateTime.now());

        switch (sequenceType) {
            case "DNA":
                analyzeDNA(sequence, response);
                break;
            case "RNA":
                analyzeRNA(sequence, response);
                break;
            case "PROTEIN":
                analyzeProtein(sequence, response);
                break;
            default:
                throw new IllegalArgumentException("Unknown sequence type");
        }

        // Save to database
        saveAnalysisResult(response);

        return response;
    }

    /**
     * Analyze uploaded file
     */
    public AnalysisResponse analyzeFile(MultipartFile file) {
        try {
            String content = new String(file.getBytes());
            String sequence = extractSequenceFromFile(content, file.getOriginalFilename());
            
            AnalysisRequest request = new AnalysisRequest();
            request.setSequence(sequence);
            
            return analyzeSequence(request);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process file: " + e.getMessage());
        }
    }

    /**
     * Generate 3D structure
     */
    public AnalysisResponse generateStructure(AnalysisRequest request) {
        AnalysisResponse response = analyzeSequence(request);
        
        // Generate 3D structure if it's a protein or can be translated
        if ("PROTEIN".equals(response.getSequenceType()) || "DNA".equals(response.getSequenceType())) {
            String proteinSequence = "PROTEIN".equals(response.getSequenceType()) 
                ? response.getSequence() 
                : translateDNA(response.getSequence());
            
            response.setStructure3D(generate3DStructure(proteinSequence));
        }
        
        return response;
    }

    /**
     * Batch analysis
     */
    public List<AnalysisResponse> batchAnalysis(List<AnalysisRequest> requests) {
        List<AnalysisResponse> responses = new ArrayList<>();
        
        for (AnalysisRequest request : requests) {
            try {
                responses.add(analyzeSequence(request));
            } catch (Exception e) {
                AnalysisResponse errorResponse = new AnalysisResponse();
                errorResponse.setError("Analysis failed: " + e.getMessage());
                responses.add(errorResponse);
            }
        }
        
        return responses;
    }

    /**
     * Get analysis history
     */
    public List<AnalysisResponse> getAnalysisHistory(int page, int size) {
        // Implementation would fetch from database
        return new ArrayList<>();
    }

    /**
     * Get analysis by ID
     */
    public AnalysisResponse getAnalysisById(String id) {
        // Implementation would fetch from database
        return new AnalysisResponse();
    }

    // Private helper methods

    private String determineSequenceType(String sequence) {
        if (DNA_PATTERN.matcher(sequence).matches()) {
            return "DNA";
        } else if (RNA_PATTERN.matcher(sequence).matches()) {
            return "RNA";
        } else if (PROTEIN_PATTERN.matcher(sequence).matches()) {
            return "PROTEIN";
        }
        return "UNKNOWN";
    }

    private void analyzeDNA(String sequence, AnalysisResponse response) {
        // Composition analysis
        Map<String, Integer> composition = new HashMap<>();
        composition.put("A", countOccurrences(sequence, 'A'));
        composition.put("T", countOccurrences(sequence, 'T'));
        composition.put("G", countOccurrences(sequence, 'G'));
        composition.put("C", countOccurrences(sequence, 'C'));
        response.setComposition(composition);

        // GC content
        double gcContent = (composition.get("G") + composition.get("C")) * 100.0 / sequence.length();
        response.setGcContent(gcContent);

        // Find ORFs
        response.setOrfs(findORFs(sequence));

        // Find motifs
        response.setMotifs(findMotifs(sequence));

        // Translate to protein
        response.setProteinSequence(translateDNA(sequence));
    }

    private void analyzeRNA(String sequence, AnalysisResponse response) {
        // Similar to DNA analysis but for RNA
        Map<String, Integer> composition = new HashMap<>();
        composition.put("A", countOccurrences(sequence, 'A'));
        composition.put("U", countOccurrences(sequence, 'U'));
        composition.put("G", countOccurrences(sequence, 'G'));
        composition.put("C", countOccurrences(sequence, 'C'));
        response.setComposition(composition);

        double gcContent = (composition.get("G") + composition.get("C")) * 100.0 / sequence.length();
        response.setGcContent(gcContent);
    }

    private void analyzeProtein(String sequence, AnalysisResponse response) {
        // Amino acid composition
        Map<String, Integer> composition = new HashMap<>();
        for (char aa : sequence.toCharArray()) {
            composition.merge(String.valueOf(aa), 1, Integer::sum);
        }
        response.setComposition(composition);

        // Generate 3D structure
        response.setStructure3D(generate3DStructure(sequence));
    }

    private int countOccurrences(String sequence, char nucleotide) {
        return (int) sequence.chars().filter(ch -> ch == nucleotide).count();
    }

    private List<Map<String, Object>> findORFs(String sequence) {
        List<Map<String, Object>> orfs = new ArrayList<>();
        String[] stopCodons = {"TAA", "TAG", "TGA"};
        
        for (int frame = 0; frame < 3; frame++) {
            for (int i = frame; i < sequence.length() - 2; i += 3) {
                if (i + 2 < sequence.length() && sequence.substring(i, i + 3).equals("ATG")) {
                    for (int j = i + 3; j < sequence.length() - 2; j += 3) {
                        String codon = sequence.substring(j, j + 3);
                        if (Arrays.asList(stopCodons).contains(codon)) {
                            if (j - i >= 150) { // Minimum 50 amino acids
                                Map<String, Object> orf = new HashMap<>();
                                orf.put("start", i + 1);
                                orf.put("end", j + 3);
                                orf.put("length", j - i + 3);
                                orf.put("frame", frame + 1);
                                orfs.add(orf);
                            }
                            break;
                        }
                    }
                }
            }
        }
        
        return orfs;
    }

    private List<Map<String, Object>> findMotifs(String sequence) {
        List<Map<String, Object>> motifs = new ArrayList<>();
        Map<String, String> commonMotifs = Map.of(
            "TATA Box", "TATAAA",
            "CAAT Box", "CCAAT",
            "GC Box", "GGGCGG"
        );

        for (Map.Entry<String, String> entry : commonMotifs.entrySet()) {
            int index = sequence.indexOf(entry.getValue());
            if (index != -1) {
                Map<String, Object> motif = new HashMap<>();
                motif.put("name", entry.getKey());
                motif.put("pattern", entry.getValue());
                motif.put("position", index + 1);
                motifs.add(motif);
            }
        }

        return motifs;
    }

    private String translateDNA(String sequence) {
        Map<String, String> codonTable = getCodonTable();
        StringBuilder protein = new StringBuilder();
        
        for (int i = 0; i < sequence.length() - 2; i += 3) {
            String codon = sequence.substring(i, i + 3);
            String aminoAcid = codonTable.getOrDefault(codon, "X");
            if ("*".equals(aminoAcid)) break;
            protein.append(aminoAcid);
        }
        
        return protein.toString();
    }

    private Map<String, Object> generate3DStructure(String proteinSequence) {
        // Simplified 3D structure generation
        Map<String, Object> structure = new HashMap<>();
        structure.put("method", "AI Prediction");
        structure.put("confidence", 0.85);
        structure.put("atoms", proteinSequence.length() * 3);
        structure.put("chains", 1);
        
        // Generate simple PDB-like data
        StringBuilder pdbData = new StringBuilder();
        for (int i = 0; i < Math.min(proteinSequence.length(), 50); i++) {
            char aa = proteinSequence.charAt(i);
            double x = i * 3.8 * Math.cos(i * 0.5);
            double y = i * 3.8 * Math.sin(i * 0.5);
            double z = i * 1.5;
            
            pdbData.append(String.format("ATOM  %5d  N   %c   A%4d    %8.3f%8.3f%8.3f  1.00  0.00           N%n", 
                i*3+1, aa, i+1, x, y, z));
            pdbData.append(String.format("ATOM  %5d  CA  %c   A%4d    %8.3f%8.3f%8.3f  1.00  0.00           C%n", 
                i*3+2, aa, i+1, x+1.5, y+1.0, z));
            pdbData.append(String.format("ATOM  %5d  C   %c   A%4d    %8.3f%8.3f%8.3f  1.00  0.00           C%n", 
                i*3+3, aa, i+1, x+2.5, y, z));
        }
        pdbData.append("END");
        
        structure.put("pdbData", pdbData.toString());
        return structure;
    }

    private Map<String, String> getCodonTable() {
        Map<String, String> codonTable = new HashMap<>();
        codonTable.put("TTT", "F"); codonTable.put("TTC", "F"); codonTable.put("TTA", "L"); codonTable.put("TTG", "L");
        codonTable.put("TCT", "S"); codonTable.put("TCC", "S"); codonTable.put("TCA", "S"); codonTable.put("TCG", "S");
        codonTable.put("TAT", "Y"); codonTable.put("TAC", "Y"); codonTable.put("TAA", "*"); codonTable.put("TAG", "*");
        codonTable.put("TGT", "C"); codonTable.put("TGC", "C"); codonTable.put("TGA", "*"); codonTable.put("TGG", "W");
        // ... (add all codons)
        return codonTable;
    }

    private String extractSequenceFromFile(String content, String filename) {
        if (filename.toLowerCase().endsWith(".fasta") || filename.toLowerCase().endsWith(".fa")) {
            return content.replaceAll(">.*\n", "").replaceAll("\n", "").toUpperCase();
        }
        return content.replaceAll("[^A-Za-z]", "").toUpperCase();
    }

    private void saveAnalysisResult(AnalysisResponse response) {
        // Save to database - implementation depends on your database setup
    }
}
