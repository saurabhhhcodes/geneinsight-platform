package com.geneinsight.service;

import com.geneinsight.dto.AnalysisResponse;
import com.geneinsight.dto.SequenceAnalysisRequest;
import com.geneinsight.entity.*;
import com.geneinsight.repository.SequenceRepository;
import com.geneinsight.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class SequenceService {

    @Autowired
    private SequenceRepository sequenceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BioinformaticsService bioinformaticsService;

    @Autowired
    private MLPredictionService mlPredictionService;

    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public ResponseEntity<?> analyzeSequence(SequenceAnalysisRequest request, String userEmail) {
        try {
            // Find user
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Validate sequence
            String validatedSequence = fileUploadService.validateSequence(request.getSequenceData());

            // Create sequence entity
            Sequence sequence = new Sequence();
            sequence.setName(request.getName());
            sequence.setSequenceData(validatedSequence);
            sequence.setLength(validatedSequence.length());
            sequence.setType(request.getType());
            sequence.setUser(user);
            sequence.setUploadTime(LocalDateTime.now());

            // Save sequence
            sequence = sequenceRepository.save(sequence);

            // Start async analysis
            Long sequenceId = sequence.getId();
            CompletableFuture.runAsync(() -> performAnalysis(sequenceId, userEmail));

            return ResponseEntity.ok(Map.of(
                    "sequenceId", sequenceId,
                    "status", "processing",
                    "message", "Analysis started successfully"
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private void performAnalysis(Long sequenceId, String userEmail) {
        try {
            // Send progress update
            sendProgressUpdate(userEmail, sequenceId, "feature_extraction", 25);

            Sequence sequence = sequenceRepository.findById(sequenceId)
                    .orElseThrow(() -> new RuntimeException("Sequence not found"));

            // Extract bioinformatics features
            Map<String, Object> features = bioinformaticsService.extractFeatures(sequence.getSequenceData());

            // Save features
            SequenceFeatures sequenceFeatures = new SequenceFeatures();
            sequenceFeatures.setSequence(sequence);
            sequenceFeatures.setGcContent((Double) features.get("gcContent"));
            sequenceFeatures.setOrfCount((Integer) features.get("orfCount"));
            sequenceFeatures.setCodonUsage(objectMapper.writeValueAsString(features.get("codonUsage")));
            sequenceFeatures.setMotifsDetected(objectMapper.writeValueAsString(features.get("motifs")));
            
            if (features.containsKey("aminoAcidFrequency")) {
                sequenceFeatures.setAminoAcidFrequency(objectMapper.writeValueAsString(features.get("aminoAcidFrequency")));
            }

            sequence.setFeatures(sequenceFeatures);

            // Send progress update
            sendProgressUpdate(userEmail, sequenceId, "ml_prediction", 75);

            // Get ML prediction
            long startTime = System.currentTimeMillis();
            Map<String, Object> predictionResult = mlPredictionService.predictDiseaseAssociation(features);
            long processingTime = System.currentTimeMillis() - startTime;

            // Save prediction
            Prediction prediction = new Prediction();
            prediction.setSequence(sequence);
            prediction.setResult(Prediction.PredictionResult.valueOf((String) predictionResult.get("prediction")));
            prediction.setConfidenceScore((Double) predictionResult.get("confidence"));
            prediction.setModelVersion((String) predictionResult.get("modelVersion"));
            prediction.setProcessingTimeMs(processingTime);
            prediction.setFeatureImportance(objectMapper.writeValueAsString(predictionResult.get("featureImportance")));
            prediction.setPredictionDate(LocalDateTime.now());

            sequence.setPrediction(prediction);
            sequenceRepository.save(sequence);

            // Send completion update
            sendProgressUpdate(userEmail, sequenceId, "completed", 100);

            // Send final result
            AnalysisResponse response = buildAnalysisResponse(sequence);
            messagingTemplate.convertAndSendToUser(userEmail, "/queue/analysis-result", response);

        } catch (Exception e) {
            // Send error update
            sendProgressUpdate(userEmail, sequenceId, "error", 0);
            messagingTemplate.convertAndSendToUser(userEmail, "/queue/analysis-error", 
                    Map.of("sequenceId", sequenceId, "error", e.getMessage()));
        }
    }

    private void sendProgressUpdate(String userEmail, Long sequenceId, String stage, int progress) {
        Map<String, Object> update = Map.of(
                "sequenceId", sequenceId,
                "stage", stage,
                "progress", progress,
                "timestamp", LocalDateTime.now()
        );
        messagingTemplate.convertAndSendToUser(userEmail, "/queue/analysis-progress", update);
    }

    public ResponseEntity<?> uploadSequenceFile(MultipartFile file, String name, String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String filename = file.getOriginalFilename().toLowerCase();
            String sequenceData;

            if (filename.endsWith(".fasta") || filename.endsWith(".fa")) {
                sequenceData = fileUploadService.parseFastaFile(file);
            } else if (filename.endsWith(".txt")) {
                sequenceData = new String(file.getBytes()).trim().toUpperCase().replaceAll("[^ATCGN]", "");
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Unsupported file format"));
            }

            // Validate sequence
            sequenceData = fileUploadService.validateSequence(sequenceData);

            // Create analysis request
            SequenceAnalysisRequest request = new SequenceAnalysisRequest();
            request.setName(name);
            request.setSequenceData(sequenceData);
            request.setType(Sequence.SequenceType.DNA);

            return analyzeSequence(request, userEmail);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    public ResponseEntity<?> getUserSequences(String userEmail, Pageable pageable, 
                                            String search, String status, String prediction) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Sequence> sequenceList = sequenceRepository.findByUserId(user.getId());
            Page<Sequence> sequences = new PageImpl<>(sequenceList, pageable, sequenceList.size());

            Page<AnalysisResponse> responses = sequences.map(this::buildAnalysisResponse);

            return ResponseEntity.ok(responses);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    public ResponseEntity<?> getSequenceById(Long id, String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Sequence> sequenceOpt = sequenceRepository.findByIdAndUserId(id, user.getId());
            
            if (sequenceOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            AnalysisResponse response = buildAnalysisResponse(sequenceOpt.get());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    public ResponseEntity<?> getAnalysisResult(Long id, String userEmail) {
        return getSequenceById(id, userEmail);
    }

    public ResponseEntity<?> deleteSequence(Long id, String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Sequence> sequenceOpt = sequenceRepository.findByIdAndUserId(id, user.getId());
            
            if (sequenceOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            sequenceRepository.delete(sequenceOpt.get());
            return ResponseEntity.ok(Map.of("message", "Sequence deleted successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    public ResponseEntity<?> downloadSequence(Long id, String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Sequence> sequenceOpt = sequenceRepository.findByIdAndUserId(id, user.getId());
            
            if (sequenceOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Sequence sequence = sequenceOpt.get();
            String fastaContent = ">" + sequence.getName() + "\n" + sequence.getSequenceData();

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=" + sequence.getName() + ".fasta")
                    .header("Content-Type", "text/plain")
                    .body(fastaContent);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private AnalysisResponse buildAnalysisResponse(Sequence sequence) {
        AnalysisResponse.AnalysisResponseBuilder builder = AnalysisResponse.builder()
                .sequenceId(sequence.getId())
                .sequenceName(sequence.getName())
                .sequenceLength(sequence.getLength())
                .analysisDate(sequence.getUploadTime());

        if (sequence.getPrediction() != null) {
            Prediction prediction = sequence.getPrediction();
            builder.prediction(prediction.getResult())
                   .confidence(prediction.getConfidenceScore())
                   .modelVersion(prediction.getModelVersion())
                   .processingTimeMs(prediction.getProcessingTimeMs());

            try {
                if (prediction.getFeatureImportance() != null) {
                    Map<String, Double> featureImportance = objectMapper.readValue(
                            prediction.getFeatureImportance(), Map.class);
                    builder.featureImportance(featureImportance);
                }
            } catch (Exception e) {
                // Log error but continue
            }
        }

        if (sequence.getFeatures() != null) {
            SequenceFeatures features = sequence.getFeatures();
            Map<String, Object> featuresMap = Map.of(
                    "gcContent", features.getGcContent(),
                    "orfCount", features.getOrfCount(),
                    "length", sequence.getLength()
            );
            builder.features(featuresMap);
        }

        return builder.build();
    }
}
