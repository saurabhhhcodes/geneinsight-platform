#!/usr/bin/env python3
"""
GeneInsight Platform - LangServe Application

This application converts the Flask ML service to LangServe for better
LangChain integration and free deployment options.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langserve import add_routes
from langchain.schema.runnable import RunnableLambda
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging
import os
import sys
from datetime import datetime

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ml_service'))

# Import existing services
from ml_service.langchain_service.molecular_chain import MolecularAnalysisChain
from ml_service.models.sequence_analyzer import SequenceAnalyzer
from ml_service.models.structure_predictor import StructurePredictor
from ml_service.models.disease_predictor import DiseasePredictor
from ml_service.docking_service.docking_engine import DockingEngine
from ml_service.utils.sequence_utils import validate_sequence, clean_sequence
from ml_service.utils.file_utils import parse_fasta, parse_pdb

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="GeneInsight LangServe API",
    description="AI-Powered Molecular Analysis Platform with LangChain",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for Vercel integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:8080",
        "https://geneinsight-platform.vercel.app",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
print("🔗 Initializing LangChain-powered GeneInsight LangServe...")

sequence_analyzer = SequenceAnalyzer()
structure_predictor = StructurePredictor()
disease_predictor = DiseasePredictor()
molecular_chain = MolecularAnalysisChain()
docking_engine = DockingEngine()

print("🚀 All services initialized successfully!")

# Pydantic models for request/response
class SequenceAnalysisRequest(BaseModel):
    sequence: str
    sequence_type: Optional[str] = "DNA"

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class DockingRequest(BaseModel):
    protein_sequence: str
    ligand_smiles: str
    binding_site: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str
    models: Dict[str, str]
    langchain: Dict[str, Any]
    capabilities: list

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint with LangChain status"""
    try:
        chain_info = molecular_chain.get_chain_info()
        langchain_status = {
            'llm_available': chain_info['llm_available'],
            'transformers_available': chain_info['transformers_available'],
            'chains_count': len(chain_info['available_chains']),
            'model_name': chain_info['model_info']['name'],
            'model_status': chain_info['model_info']['status'],
            'device': chain_info['device']
        }
    except Exception as e:
        langchain_status = {'error': str(e), 'status': 'unavailable'}

    return HealthResponse(
        status='UP',
        service='GeneInsight LangServe with LangChain',
        version='2.0.0',
        timestamp=datetime.now().isoformat(),
        models={
            'sequence_analyzer': 'loaded',
            'structure_predictor': 'loaded',
            'disease_predictor': 'loaded',
            'molecular_chain': 'loaded',
            'docking_engine': 'loaded'
        },
        langchain=langchain_status,
        capabilities=[
            'sequence_analysis',
            'structure_prediction',
            'disease_prediction',
            'molecular_docking',
            'llm_enhancement' if langchain_status.get('llm_available') else 'rule_based_analysis'
        ]
    )

# Create LangChain runnables for LangServe integration
def create_sequence_analysis_runnable():
    """Create a runnable for sequence analysis"""
    def analyze_sequence(input_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            sequence = clean_sequence(input_data['sequence'])
            sequence_type = input_data.get('sequence_type', 'DNA')
            
            # Validate sequence
            if not validate_sequence(sequence, sequence_type):
                raise ValueError(f"Invalid {sequence_type} sequence")
            
            # Perform basic ML analysis
            basic_analysis = sequence_analyzer.analyze(sequence)
            
            # Enhance with LangChain molecular analysis
            enhanced_result = molecular_chain.analyze_sequence(sequence, sequence_type, basic_analysis)
            
            return {
                'success': True,
                'data': enhanced_result,
                'basic_analysis': basic_analysis,
                'langchain_enhanced': 'llm_enhancement' in enhanced_result,
                'analysis_method': enhanced_result.get('analysis_method', 'unknown'),
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Sequence analysis error: {str(e)}")
            raise HTTPException(status_code=500, detail=f'Analysis failed: {str(e)}')
    
    return RunnableLambda(analyze_sequence)

def create_chat_runnable():
    """Create a runnable for LangChain chat"""
    def chat_with_langchain(input_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            message = input_data['message']
            context = input_data.get('context', {})
            
            # Get chat response from molecular chain
            response = molecular_chain.chat(message, context)
            
            return {
                'success': True,
                'response': response,
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Chat error: {str(e)}")
            raise HTTPException(status_code=500, detail=f'Chat failed: {str(e)}')
    
    return RunnableLambda(chat_with_langchain)

def create_docking_runnable():
    """Create a runnable for molecular docking"""
    def perform_docking(input_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            protein_sequence = input_data['protein_sequence']
            ligand_smiles = input_data['ligand_smiles']
            binding_site = input_data.get('binding_site')
            
            # Perform docking analysis
            docking_result = docking_engine.dock_ligand(
                protein_sequence, ligand_smiles, binding_site
            )
            
            # Enhance with LangChain analysis
            enhanced_result = molecular_chain.analyze_docking(docking_result)
            
            return {
                'success': True,
                'docking_result': docking_result,
                'ai_insights': enhanced_result,
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Docking error: {str(e)}")
            raise HTTPException(status_code=500, detail=f'Docking failed: {str(e)}')
    
    return RunnableLambda(perform_docking)

# Add LangServe routes
sequence_runnable = create_sequence_analysis_runnable()
chat_runnable = create_chat_runnable()
docking_runnable = create_docking_runnable()

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

add_routes(
    app,
    docking_runnable,
    path="/analyze/docking",
)

# Additional REST endpoints for compatibility
@app.post("/analyze/langchain")
async def langchain_analysis(request: SequenceAnalysisRequest):
    """Enhanced sequence analysis using LangChain"""
    try:
        sequence = clean_sequence(request.sequence)
        sequence_type = request.sequence_type
        
        # Get basic analysis first
        if sequence_type == 'DNA':
            basic_analysis = sequence_analyzer.analyze(sequence)
        elif sequence_type == 'PROTEIN':
            basic_analysis = structure_predictor.predict(sequence, 'alphafold')
        else:
            basic_analysis = {'sequence': sequence, 'type': sequence_type}
        
        # Get LangChain-powered insights
        langchain_result = molecular_chain.analyze_sequence(
            sequence, sequence_type, basic_analysis
        )
        
        return {
            'success': True,
            'data': {
                'basic_analysis': basic_analysis,
                'ai_insights': langchain_result,
                'sequence_type': sequence_type
            },
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"LangChain analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f'LangChain analysis failed: {str(e)}')

@app.get("/langchain/status")
async def langchain_status():
    """Get detailed LangChain status and capabilities"""
    try:
        chain_info = molecular_chain.get_chain_info()
        
        return {
            'success': True,
            'langchain': chain_info,
            'capabilities': {
                'sequence_analysis': True,
                'docking_analysis': True,
                'conversational_memory': chain_info['memory_messages'] > 0,
                'llm_enhancement': chain_info['llm_available'],
                'natural_language_insights': chain_info['llm_available']
            },
            'performance': {
                'device': chain_info['device'],
                'model_loaded': chain_info['model_info']['status'] == 'loaded',
                'chains_active': len(chain_info['available_chains'])
            },
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Status check error: {str(e)}")
        raise HTTPException(status_code=500, detail=f'Status check failed: {str(e)}')

if __name__ == "__main__":
    import uvicorn
    
    logger.info("🧬 Starting GeneInsight LangServe...")
    logger.info("🔬 Loading ML models...")
    
    # Initialize models
    try:
        sequence_analyzer.load_models()
        structure_predictor.load_models()
        disease_predictor.load_models()
        logger.info("✅ All ML models loaded successfully")
    except Exception as e:
        logger.error(f"❌ Failed to load ML models: {e}")
    
    # Start the FastAPI app with uvicorn
    port = int(os.environ.get('PORT', 8000))
    
    logger.info(f"🚀 LangServe starting on port {port}")
    logger.info(f"📊 Health check: http://localhost:{port}/health")
    logger.info(f"📚 API docs: http://localhost:{port}/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=port)
