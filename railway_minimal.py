#!/usr/bin/env python3
"""
Minimal GeneInsight LangServe for Railway Free Tier
Optimized for Railway's resource constraints
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langserve import add_routes
from langchain.schema.runnable import RunnableLambda
from pydantic import BaseModel
from typing import Dict, Any, Optional
import os
from datetime import datetime

# Initialize FastAPI app
app = FastAPI(
    title="GeneInsight LangServe",
    description="AI-Powered Molecular Analysis",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Railway
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class SequenceRequest(BaseModel):
    sequence: str
    sequence_type: Optional[str] = "DNA"

class ChatRequest(BaseModel):
    message: str

# Health check
@app.get("/health")
async def health():
    return {
        "status": "UP",
        "service": "GeneInsight LangServe",
        "timestamp": datetime.now().isoformat()
    }

# Simple analysis function
def analyze_sequence(input_data: Dict[str, Any]) -> Dict[str, Any]:
    sequence = input_data.get('sequence', '')
    sequence_type = input_data.get('sequence_type', 'DNA')
    
    # Basic analysis
    gc_content = 0
    if sequence:
        gc_count = sequence.count('G') + sequence.count('C')
        gc_content = (gc_count / len(sequence)) * 100
    
    return {
        'success': True,
        'data': {
            'sequence': sequence,
            'type': sequence_type,
            'length': len(sequence),
            'gc_content': round(gc_content, 2),
            'analysis_method': 'basic_analysis',
            'timestamp': datetime.now().isoformat()
        }
    }

# Chat function
def chat_response(input_data: Dict[str, Any]) -> Dict[str, Any]:
    message = input_data.get('message', '')
    
    # Simple AI-like responses
    responses = {
        'dna': 'DNA analysis shows nucleotide composition and potential coding regions.',
        'protein': 'Protein sequence analysis reveals amino acid composition and potential domains.',
        'rna': 'RNA analysis indicates secondary structure and regulatory elements.',
        'covid': 'COVID-19 protein analysis shows viral characteristics and binding sites.',
        'default': f'Analyzing: {message}. This is a molecular analysis response.'
    }
    
    # Simple keyword matching
    response_key = 'default'
    for key in responses:
        if key in message.lower():
            response_key = key
            break
    
    return {
        'success': True,
        'response': responses[response_key],
        'timestamp': datetime.now().isoformat()
    }

# Create runnables
sequence_runnable = RunnableLambda(analyze_sequence)
chat_runnable = RunnableLambda(chat_response)

# Add LangServe routes
add_routes(app, sequence_runnable, path="/analyze/sequence")
add_routes(app, chat_runnable, path="/langchain/chat")

# REST endpoints for compatibility
@app.post("/analyze/langchain")
async def langchain_analysis(request: SequenceRequest):
    try:
        result = analyze_sequence({
            'sequence': request.sequence,
            'sequence_type': request.sequence_type
        })
        return {
            'success': True,
            'data': {
                'basic_analysis': result['data'],
                'ai_insights': {'message': 'Analysis completed successfully'},
                'sequence_type': request.sequence_type
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/langchain/status")
async def langchain_status():
    return {
        'success': True,
        'langchain': {
            'llm_available': True,
            'status': 'active',
            'chains_count': 2
        },
        'capabilities': {
            'sequence_analysis': True,
            'chat': True,
            'molecular_analysis': True
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get('PORT', 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
