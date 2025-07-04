from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Global model variable
model = None
model_metrics = {}

def load_model():
    global model, model_metrics
    try:
        model = joblib.load('models/disease_prediction_model.pkl')
        with open('models/model_metrics.json', 'r') as f:
            import json
            model_metrics = json.load(f)
        print("Model loaded successfully")
    except FileNotFoundError:
        print("No pre-trained model found. Training new model...")
        train_default_model()

def train_default_model():
    global model, model_metrics
    
    # Generate synthetic training data for demonstration
    np.random.seed(42)
    n_samples = 10000
    
    # Features: GC content, ORF count, sequence length, motif count
    gc_content = np.random.normal(50, 15, n_samples)
    orf_count = np.random.poisson(2, n_samples)
    seq_length = np.random.normal(2000, 800, n_samples)
    motif_count = np.random.poisson(3, n_samples)
    
    X = np.column_stack([gc_content, orf_count, seq_length, motif_count])
    
    # Generate labels based on some logic
    # Higher GC content + more ORFs = higher disease risk
    disease_prob = (gc_content / 100) * 0.4 + (orf_count / 10) * 0.3 + (motif_count / 10) * 0.3
    y = (disease_prob + np.random.normal(0, 0.1, n_samples)) > 0.5
    
    # Train model
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Calculate metrics
    y_pred = model.predict(X_test)
    model_metrics = {
        'accuracy': float(accuracy_score(y_test, y_pred)),
        'precision': float(precision_score(y_test, y_pred)),
        'recall': float(recall_score(y_test, y_pred)),
        'f1Score': float(f1_score(y_test, y_pred)),
        'lastTrained': datetime.now().isoformat(),
        'trainingDataSize': len(X_train)
    }
    
    # Save model
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/disease_prediction_model.pkl')
    
    import json
    with open('models/model_metrics.json', 'w') as f:
        json.dump(model_metrics, f)
    
    print(f"Model trained successfully. Accuracy: {model_metrics['accuracy']:.3f}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        features = data['features']
        
        # Extract features for prediction
        feature_vector = [
            features.get('gcContent', 50),
            features.get('orfCount', 1),
            features.get('length', 1000),
            len(features.get('motifs', []))
        ]
        
        # Make prediction
        prediction_proba = model.predict_proba([feature_vector])[0]
        prediction = model.predict([feature_vector])[0]
        confidence = float(max(prediction_proba))
        
        # Get feature importance
        feature_importance = {
            'gcContent': float(model.feature_importances_[0]),
            'orfCount': float(model.feature_importances_[1]),
            'length': float(model.feature_importances_[2]),
            'motifs': float(model.feature_importances_[3])
        }
        
        result = {
            'prediction': 'DISEASE_ASSOCIATED' if prediction else 'NON_DISEASE',
            'confidence': confidence,
            'modelVersion': 'RandomForest-v1.0',
            'featureImportance': feature_importance,
            'processingTime': 150  # milliseconds
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/metrics', methods=['GET'])
def get_metrics():
    return jsonify(model_metrics)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for deployment monitoring"""
    try:
        # Check if model is loaded
        model_status = "loaded" if model_metrics else "not_loaded"

        return jsonify({
            'status': 'healthy',
            'service': 'GeneInsight ML Service',
            'version': '1.0.0',
            'model_status': model_status,
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/train', methods=['POST'])
def train_model():
    try:
        # This would handle training with uploaded data
        # For now, retrain with synthetic data
        train_default_model()
        
        return jsonify({
            'status': 'success',
            'message': 'Model trained successfully',
            'metrics': model_metrics
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    import os
    load_model()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
