const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock model metrics
const mockMetrics = {
    accuracy: 0.85,
    precision: 0.82,
    recall: 0.88,
    f1Score: 0.85,
    lastTrained: new Date().toISOString(),
    trainingDataSize: 8000
};

// Mock prediction endpoint
app.post('/predict', (req, res) => {
    try {
        const { features } = req.body;
        
        // Simple mock prediction logic
        const gcContent = features.gcContent || 50;
        const orfCount = features.orfCount || 1;
        const length = features.length || 1000;
        const motifCount = features.motifs ? features.motifs.length : 0;
        
        // Mock prediction based on features
        const riskScore = (gcContent / 100) * 0.4 + (orfCount / 10) * 0.3 + (motifCount / 10) * 0.3;
        const prediction = riskScore > 0.5;
        const confidence = Math.min(0.95, Math.max(0.55, riskScore + Math.random() * 0.1));
        
        const result = {
            prediction: prediction ? 'DISEASE_ASSOCIATED' : 'NON_DISEASE',
            confidence: confidence,
            modelVersion: 'MockML-v1.0',
            featureImportance: {
                gcContent: 0.35,
                orfCount: 0.25,
                length: 0.20,
                motifs: 0.20
            },
            processingTime: Math.floor(Math.random() * 200) + 50
        };
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mock metrics endpoint
app.get('/metrics', (req, res) => {
    res.json(mockMetrics);
});

// Mock training endpoint
app.post('/train', (req, res) => {
    res.json({
        status: 'success',
        message: 'Mock model trained successfully',
        metrics: mockMetrics
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        model_loaded: true,
        timestamp: new Date().toISOString()
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Mock ML Service running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  POST /predict - Make predictions');
    console.log('  GET  /metrics - Get model metrics');
    console.log('  POST /train   - Train model');
    console.log('  GET  /health  - Health check');
});
