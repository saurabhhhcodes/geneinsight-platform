package com.geneinsight.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value("${file.upload.dir}")
    private String uploadDir;

    public String uploadFile(MultipartFile file) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = UUID.randomUUID().toString() + extension;

        // Save file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filename;
    }

    public String parseFastaFile(MultipartFile file) throws IOException {
        StringBuilder sequences = new StringBuilder();
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isSequenceLine = false;
            
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                
                if (line.startsWith(">")) {
                    // Header line - skip for now, could be used for metadata
                    isSequenceLine = true;
                    if (sequences.length() > 0) {
                        sequences.append("\n");
                    }
                } else if (isSequenceLine && !line.isEmpty()) {
                    // Sequence line
                    sequences.append(line.toUpperCase().replaceAll("[^ATCGN]", ""));
                }
            }
        }
        
        return sequences.toString();
    }

    public List<String> parseCsvFile(MultipartFile file) throws IOException {
        List<String> sequences = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;
            
            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue; // Skip header
                }
                
                String[] columns = line.split(",");
                if (columns.length > 1) {
                    // Assuming sequence is in the second column
                    String sequence = columns[1].trim().toUpperCase().replaceAll("[^ATCGN]", "");
                    if (!sequence.isEmpty()) {
                        sequences.add(sequence);
                    }
                }
            }
        }
        
        return sequences;
    }

    public String validateSequence(String sequence) {
        // Remove whitespace and convert to uppercase
        sequence = sequence.replaceAll("\\s+", "").toUpperCase();
        
        // Validate DNA sequence (allow N for unknown nucleotides)
        if (!sequence.matches("[ATCGN]+")) {
            throw new IllegalArgumentException("Invalid DNA sequence. Only A, T, C, G, and N are allowed.");
        }
        
        if (sequence.length() < 10) {
            throw new IllegalArgumentException("Sequence too short. Minimum length is 10 nucleotides.");
        }
        
        if (sequence.length() > 100000) {
            throw new IllegalArgumentException("Sequence too long. Maximum length is 100,000 nucleotides.");
        }
        
        return sequence;
    }
}
