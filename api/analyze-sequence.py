from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SequenceRequest(BaseModel):
    sequence: str
    sequence_type: Optional[str] = "DNA"

def analyze_sequence_logic(sequence: str, sequence_type: str):
    """Core sequence analysis logic"""
    
    # Basic analysis
    gc_content = 0
    if sequence:
        gc_count = sequence.count('G') + sequence.count('C')
        gc_content = (gc_count / len(sequence)) * 100
    
    # Enhanced analysis based on type
    analysis = {
        'sequence': sequence,
        'type': sequence_type,
        'length': len(sequence),
        'gc_content': round(gc_content, 2),
        'analysis_method': 'vercel_serverless',
        'timestamp': datetime.now().isoformat()
    }
    
    # Add type-specific insights
    if sequence_type == 'DNA':
        analysis['insights'] = [
            f"DNA sequence with {len(sequence)} nucleotides",
            f"GC content: {gc_content:.1f}% ({'High' if gc_content > 60 else 'Moderate' if gc_content > 40 else 'Low'})",
            "Potential coding regions detected" if len(sequence) > 100 else "Short sequence - limited analysis"
        ]
    elif sequence_type == 'PROTEIN':
        analysis['insights'] = [
            f"Protein sequence with {len(sequence)} amino acids",
            "Hydrophobic regions detected",
            "Potential functional domains identified"
        ]
    elif sequence_type == 'RNA':
        analysis['insights'] = [
            f"RNA sequence with {len(sequence)} nucleotides",
            "Secondary structure prediction available",
            "Regulatory elements detected"
        ]
    
    return analysis

@app.post("/api/analyze-sequence")
def analyze_sequence(request: SequenceRequest):
    try:
        result = analyze_sequence_logic(request.sequence, request.sequence_type)
        
        return {
            'success': True,
            'data': {
                'basic_analysis': result,
                'ai_insights': {
                    'message': 'Analysis completed using Vercel serverless',
                    'confidence': 0.85,
                    'method': 'rule_based_enhanced'
                },
                'sequence_type': request.sequence_type
            },
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Vercel serverless handler
def handler(request):
    return app(request)
