#!/usr/bin/env python3
"""
Simple LangServe Test Application
Tests basic LangServe functionality without heavy ML dependencies
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langserve import add_routes
from langchain.schema.runnable import RunnableLambda
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging
import os
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="GeneInsight LangServe Test API",
    description="Test API for LangServe deployment",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://geneinsight-platform.vercel.app",
        "https://*.vercel.app"
    ],
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

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status='UP',
        service='GeneInsight LangServe Test',
        version='1.0.0',
        timestamp=datetime.now().isoformat()
    )

# Create simple runnables for testing
def create_sequence_runnable():
    """Create a simple sequence analysis runnable"""
    def analyze_sequence(input_data: Dict[str, Any]) -> Dict[str, Any]:
        sequence = input_data.get('sequence', '')
        sequence_type = input_data.get('sequence_type', 'DNA')
        
        # Simple analysis
        analysis = {
            'sequence': sequence,
            'type': sequence_type,
            'length': len(sequence),
            'gc_content': (sequence.count('G') + sequence.count('C')) / len(sequence) * 100 if sequence else 0,
            'analysis_method': 'simple_test',
            'timestamp': datetime.now().isoformat()
        }
        
        return {
            'success': True,
            'data': analysis
        }
    
    return RunnableLambda(analyze_sequence)

def create_chat_runnable():
    """Create a simple chat runnable"""
    def chat_response(input_data: Dict[str, Any]) -> Dict[str, Any]:
        message = input_data.get('message', '')
        
        # Simple response
        response = f"You said: '{message}'. This is a test response from LangServe!"
        
        return {
            'success': True,
            'response': response,
            'timestamp': datetime.now().isoformat()
        }
    
    return RunnableLambda(chat_response)

# Create runnables
sequence_runnable = create_sequence_runnable()
chat_runnable = create_chat_runnable()

# Add LangServe routes
add_routes(
    app,
    sequence_runnable,
    path="/analyze/sequence",
)

add_routes(
    app,
    chat_runnable,
    path="/langchain/chat",
)

# Additional REST endpoints for compatibility
@app.post("/analyze/langchain")
async def langchain_analysis(request: SequenceRequest):
    """Simple sequence analysis endpoint"""
    try:
        sequence = request.sequence
        sequence_type = request.sequence_type
        
        analysis = {
            'sequence': sequence,
            'type': sequence_type,
            'length': len(sequence),
            'gc_content': (sequence.count('G') + sequence.count('C')) / len(sequence) * 100 if sequence else 0,
            'analysis_method': 'rest_endpoint',
            'timestamp': datetime.now().isoformat()
        }
        
        return {
            'success': True,
            'data': {
                'basic_analysis': analysis,
                'ai_insights': {'message': 'This is a test AI insight'},
                'sequence_type': sequence_type
            }
        }
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f'Analysis failed: {str(e)}')

@app.get("/langchain/status")
async def langchain_status():
    """Get LangChain status"""
    return {
        'success': True,
        'langchain': {
            'llm_available': False,
            'status': 'test_mode',
            'chains_count': 2
        },
        'capabilities': {
            'sequence_analysis': True,
            'chat': True,
            'test_mode': True
        },
        'timestamp': datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    
    logger.info("🧬 Starting GeneInsight LangServe Test...")
    
    port = int(os.environ.get('PORT', 8000))
    
    logger.info(f"🚀 LangServe Test starting on port {port}")
    logger.info(f"📊 Health check: http://localhost:{port}/health")
    logger.info(f"📚 API docs: http://localhost:{port}/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=port)
