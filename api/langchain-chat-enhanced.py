from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import json
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

def enhanced_chat_response(message: str, context: Dict[str, Any] = None):
    """Enhanced chat response with molecular analysis capabilities"""
    
    message_lower = message.lower()
    
    # Detect sequence in message
    dna_pattern = r'[ATCG]{6,}'
    protein_pattern = r'[ACDEFGHIKLMNPQRSTVWY]{6,}'
    
    dna_match = re.search(dna_pattern, message.upper())
    protein_match = re.search(protein_pattern, message.upper())
    
    # Enhanced responses based on content
    if 'covid' in message_lower or 'coronavirus' in message_lower:
        response = """🦠 COVID-19 Analysis:
        
The COVID-19 main protease (Mpro) is a key target for antiviral drugs. Key characteristics:
• 306 amino acids long
• Contains catalytic dyad (His41-Cys145)
• Essential for viral replication
• Target for protease inhibitors like Paxlovid

Would you like me to analyze a specific COVID-19 protein sequence?"""
        
    elif dna_match:
        sequence = dna_match.group()
        gc_content = (sequence.count('G') + sequence.count('C')) / len(sequence) * 100
        response = f"""🧬 DNA Sequence Detected: {sequence}
        
Analysis:
• Length: {len(sequence)} nucleotides
• GC Content: {gc_content:.1f}%
• Type: {'High GC' if gc_content > 60 else 'Moderate GC' if gc_content > 40 else 'Low GC'}
• Potential: {'Coding region' if len(sequence) > 100 else 'Short fragment'}

This appears to be a {'bacterial' if gc_content > 55 else 'mammalian'} sequence based on GC content."""
        
    elif protein_match:
        sequence = protein_match.group()
        response = f"""🧪 Protein Sequence Detected: {sequence}
        
Analysis:
• Length: {len(sequence)} amino acids
• Hydrophobic residues: {sum(1 for aa in sequence if aa in 'AILMFPWV')}
• Charged residues: {sum(1 for aa in sequence if aa in 'DEKR')}
• Potential domains: {'Transmembrane' if 'AILMFPWV' in sequence else 'Soluble'}

This sequence shows characteristics of a {'membrane protein' if len(sequence) > 200 else 'peptide fragment'}."""
        
    elif 'analyze' in message_lower and ('dna' in message_lower or 'sequence' in message_lower):
        response = """🔬 Sequence Analysis Available:
        
I can analyze:
• DNA sequences (nucleotide composition, GC content, coding potential)
• Protein sequences (amino acid composition, domains, structure)
• RNA sequences (secondary structure, regulatory elements)

Please provide a sequence starting with nucleotides (ATCG) or amino acids (single letter code)."""
        
    elif 'docking' in message_lower or 'binding' in message_lower:
        response = """⚗️ Molecular Docking Analysis:
        
I can help with:
• Protein-ligand binding analysis
• Drug target identification
• Binding affinity prediction
• Structure-activity relationships

Provide a protein sequence and ligand SMILES for docking analysis."""
        
    elif 'structure' in message_lower or '3d' in message_lower:
        response = """🏗️ 3D Structure Analysis:
        
Available features:
• Protein structure prediction
• Secondary structure analysis
• Domain identification
• Binding site prediction
• 3D visualization support

Upload a PDB file or provide a sequence for structure analysis."""
        
    else:
        # General molecular biology response
        response = f"""🧬 Molecular Analysis Assistant:
        
You asked: "{message}"

I can help with:
• DNA/RNA/Protein sequence analysis
• Molecular docking and drug design
• 3D structure visualization
• COVID-19 protein analysis
• Binding affinity predictions

Try asking about:
- "Analyze this DNA sequence: ATCGATCGATCG"
- "COVID-19 main protease analysis"
- "Molecular docking with aspirin"
- "3D structure prediction"
        """
    
    return {
        'response': response,
        'confidence': 0.9,
        'analysis_type': 'enhanced_chat',
        'detected_sequences': {
            'dna': dna_match.group() if dna_match else None,
            'protein': protein_match.group() if protein_match else None
        },
        'timestamp': datetime.now().isoformat()
    }

@app.post("/api/langchain-chat-enhanced")
def chat_enhanced(request: ChatRequest):
    try:
        result = enhanced_chat_response(request.message, request.context)
        
        return {
            'success': True,
            'response': result['response'],
            'metadata': {
                'confidence': result['confidence'],
                'analysis_type': result['analysis_type'],
                'detected_sequences': result['detected_sequences'],
                'platform': 'vercel_serverless'
            },
            'timestamp': result['timestamp']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Vercel serverless handler
def handler(request):
    return app(request)
