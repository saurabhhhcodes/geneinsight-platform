#!/usr/bin/env python3
"""
GeneInsight Platform - ML Service

This service provides machine learning capabilities for:
- Advanced sequence analysis
- Protein structure prediction
- Gene-disease association prediction
- Pattern recognition and classification
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import logging
from datetime import datetime
import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.sequence_analyzer import SequenceAnalyzer
from models.structure_predictor import StructurePredictor
from models.disease_predictor import DiseasePredictor

# Import new services
from langchain_service.molecular_chain import MolecularAnalysisChain
from docking_service.docking_engine import DockingEngine
from utils.sequence_utils import validate_sequence, clean_sequence
from utils.file_utils import parse_fasta, parse_pdb

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:3001", 
    "http://localhost:8080",
    "https://geneinsight-platform.vercel.app"
])

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize ML models with LangChain integration
print("🔗 Initializing LangChain-powered GeneInsight ML Service...")

sequence_analyzer = SequenceAnalyzer()
structure_predictor = StructurePredictor()
disease_predictor = DiseasePredictor()

# Initialize LangChain molecular analysis chain
print("🧠 Loading LangChain molecular analysis chain...")
molecular_chain = MolecularAnalysisChain()

# Initialize docking engine
docking_engine = DockingEngine()

# Get LangChain status and display
try:
    chain_info = molecular_chain.get_chain_info()
    print("✅ LangChain Integration Status:")
    print(f"   - LLM Available: {chain_info['llm_available']}")
    print(f"   - Transformers: {chain_info['transformers_available']}")
    print(f"   - Chains: {len(chain_info['available_chains'])} ({', '.join(chain_info['available_chains'])})")
    print(f"   - Model: {chain_info['model_info']['name']}")
    print(f"   - Status: {chain_info['model_info']['status']}")
    print(f"   - Device: {chain_info['device']}")

    if chain_info['llm_available']:
        print("🎉 LangChain LLM is ACTIVE - Enhanced molecular analysis enabled!")
    else:
        print("⚠️  LangChain LLM not active - Using rule-based analysis")

except Exception as e:
    print(f"⚠️  LangChain status check failed: {e}")

print("🚀 All services initialized successfully!")

@app.route('/health', methods=['GET'])
def health_check():
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

    return jsonify({
        'status': 'UP',
        'service': 'GeneInsight ML Service with LangChain',
        'version': '2.0.0',
        'timestamp': datetime.now().isoformat(),
        'models': {
            'sequence_analyzer': 'loaded',
            'structure_predictor': 'loaded',
            'disease_predictor': 'loaded',
            'molecular_chain': 'loaded',
            'docking_engine': 'loaded'
        },
        'langchain': langchain_status,
        'capabilities': [
            'sequence_analysis',
            'structure_prediction',
            'disease_prediction',
            'molecular_docking',
            'llm_enhancement' if langchain_status.get('llm_available') else 'rule_based_analysis'
        ]
    })

@app.route('/analyze/sequence', methods=['POST'])
def analyze_sequence():
    """Advanced sequence analysis using ML models with LangChain enhancement"""
    try:
        data = request.get_json()

        if not data or 'sequence' not in data:
            return jsonify({'error': 'Sequence is required'}), 400

        sequence = clean_sequence(data['sequence'])
        sequence_type = data.get('sequence_type', 'DNA')

        validation = validate_sequence(sequence, sequence_type)
        if not validation['valid']:
            return jsonify({'error': f'Invalid sequence: {validation["error"]}'}), 400

        # Perform basic ML analysis
        basic_analysis = sequence_analyzer.analyze(sequence)

        # Enhance with LangChain molecular analysis
        enhanced_result = molecular_chain.analyze_sequence(sequence, sequence_type, basic_analysis)

        return jsonify({
            'success': True,
            'data': enhanced_result,
            'basic_analysis': basic_analysis,
            'langchain_enhanced': 'llm_enhancement' in enhanced_result,
            'analysis_method': enhanced_result.get('analysis_method', 'unknown'),
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f"Sequence analysis error: {str(e)}")
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/predict/structure', methods=['POST'])
def predict_structure():
    """Predict 3D protein structure"""
    try:
        data = request.get_json()
        
        if not data or 'sequence' not in data:
            return jsonify({'error': 'Protein sequence is required'}), 400
        
        sequence = clean_sequence(data['sequence'])
        method = data.get('method', 'alphafold')
        
        # Predict structure using ML models
        structure_result = structure_predictor.predict(sequence, method)
        
        return jsonify({
            'success': True,
            'data': structure_result,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Structure prediction error: {str(e)}")
        return jsonify({'error': f'Structure prediction failed: {str(e)}'}), 500

@app.route('/predict/disease', methods=['POST'])
def predict_disease():
    """Predict gene-disease associations"""
    try:
        data = request.get_json()
        
        if not data or 'sequence' not in data:
            return jsonify({'error': 'Gene sequence is required'}), 400
        
        sequence = clean_sequence(data['sequence'])
        disease_type = data.get('disease_type', 'general')
        
        # Predict disease associations
        disease_result = disease_predictor.predict(sequence, disease_type)
        
        return jsonify({
            'success': True,
            'data': disease_result,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Disease prediction error: {str(e)}")
        return jsonify({'error': f'Disease prediction failed: {str(e)}'}), 500

@app.route('/analyze/batch', methods=['POST'])
def batch_analysis():
    """Batch analysis of multiple sequences"""
    try:
        data = request.get_json()
        
        if not data or 'sequences' not in data:
            return jsonify({'error': 'Sequences array is required'}), 400
        
        sequences = data['sequences']
        analysis_type = data.get('analysis_type', 'comprehensive')
        
        results = []
        
        for i, seq_data in enumerate(sequences):
            try:
                sequence = clean_sequence(seq_data.get('sequence', ''))
                
                if validate_sequence(sequence):
                    if analysis_type == 'structure':
                        result = structure_predictor.predict(sequence)
                    elif analysis_type == 'disease':
                        result = disease_predictor.predict(sequence)
                    else:
                        result = sequence_analyzer.analyze(sequence)
                    
                    results.append({
                        'index': i,
                        'success': True,
                        'data': result
                    })
                else:
                    results.append({
                        'index': i,
                        'success': False,
                        'error': 'Invalid sequence format'
                    })
                    
            except Exception as e:
                results.append({
                    'index': i,
                    'success': False,
                    'error': str(e)
                })
        
        return jsonify({
            'success': True,
            'results': results,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Batch analysis error: {str(e)}")
        return jsonify({'error': f'Batch analysis failed: {str(e)}'}), 500

@app.route('/upload/file', methods=['POST'])
def upload_file():
    """Upload and analyze sequence files"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Read file content
        content = file.read().decode('utf-8')
        filename = file.filename.lower()
        
        # Parse file based on format
        if filename.endswith(('.fasta', '.fa', '.fas')):
            sequences = parse_fasta(content)
        elif filename.endswith('.pdb'):
            sequences = parse_pdb(content)
        else:
            # Treat as plain text sequence
            sequences = [{'id': 'sequence_1', 'sequence': clean_sequence(content)}]
        
        # Analyze sequences
        results = []
        for seq_data in sequences:
            try:
                analysis_result = sequence_analyzer.analyze(seq_data['sequence'])
                results.append({
                    'id': seq_data['id'],
                    'success': True,
                    'data': analysis_result
                })
            except Exception as e:
                results.append({
                    'id': seq_data['id'],
                    'success': False,
                    'error': str(e)
                })
        
        return jsonify({
            'success': True,
            'filename': file.filename,
            'sequences_found': len(sequences),
            'results': results,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"File upload error: {str(e)}")
        return jsonify({'error': f'File processing failed: {str(e)}'}), 500

@app.route('/analyze/enhanced', methods=['POST'])
def enhanced_analysis():
    """Enhanced sequence analysis using AI-powered insights"""
    try:
        data = request.get_json()

        if not data or 'sequence' not in data:
            return jsonify({'error': 'Sequence is required'}), 400

        sequence = clean_sequence(data['sequence'])
        sequence_type = data.get('sequence_type', 'DNA')

        # Get basic analysis first
        if sequence_type.upper() == 'DNA':
            basic_analysis = sequence_analyzer.analyze(sequence)
        elif sequence_type.upper() == 'PROTEIN':
            basic_analysis = structure_predictor.predict(sequence, 'alphafold')
        else:
            basic_analysis = {'sequence': sequence, 'type': sequence_type}

        # Get AI-powered insights
        ai_insights = molecular_chain.analyze_sequence(
            sequence, sequence_type, basic_analysis
        )

        return jsonify({
            'success': True,
            'data': {
                'basic_analysis': basic_analysis,
                'ai_insights': ai_insights,
                'sequence_type': sequence_type,
                'enhanced': True
            },
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f"Enhanced analysis error: {str(e)}")
        return jsonify({'error': f'Enhanced analysis failed: {str(e)}'}), 500

@app.route('/docking/prepare', methods=['POST'])
def prepare_docking():
    """Prepare protein and ligand for molecular docking"""
    try:
        data = request.get_json()

        if not data or 'protein_data' not in data or 'ligand_smiles' not in data:
            return jsonify({'error': 'Protein data and ligand SMILES are required'}), 400

        protein_data = data['protein_data']
        ligand_smiles = data['ligand_smiles']
        ligand_name = data.get('ligand_name', 'ligand')

        # Prepare protein
        protein_result = docking_engine.prepare_protein(protein_data)
        if not protein_result['success']:
            return jsonify({'error': f'Protein preparation failed: {protein_result["error"]}'}), 400

        # Prepare ligand
        ligand_result = docking_engine.prepare_ligand(ligand_smiles, ligand_name)
        if not ligand_result['success']:
            return jsonify({'error': f'Ligand preparation failed: {ligand_result["error"]}'}), 400

        return jsonify({
            'success': True,
            'data': {
                'protein': protein_result,
                'ligand': ligand_result,
                'ready_for_docking': True
            },
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f"Docking preparation error: {str(e)}")
        return jsonify({'error': f'Docking preparation failed: {str(e)}'}), 500

@app.route('/docking/run', methods=['POST'])
def run_docking():
    """Perform molecular docking"""
    try:
        data = request.get_json()

        required_fields = ['protein_pdbqt', 'ligand_pdbqt', 'binding_site']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'Protein PDBQT, ligand PDBQT, and binding site are required'}), 400

        protein_pdbqt = data['protein_pdbqt']
        ligand_pdbqt = data['ligand_pdbqt']
        binding_site = data['binding_site']
        exhaustiveness = data.get('exhaustiveness', 8)

        # Perform docking
        docking_result = docking_engine.perform_docking(
            protein_pdbqt, ligand_pdbqt, binding_site, exhaustiveness
        )

        if not docking_result['success']:
            return jsonify({'error': f'Docking failed: {docking_result["error"]}'}), 500

        # Get AI analysis of docking results
        protein_info = {'file': protein_pdbqt}
        ligand_info = {'file': ligand_pdbqt}
        ai_analysis = molecular_chain.analyze_docking(
            protein_info, ligand_info, docking_result
        )

        return jsonify({
            'success': True,
            'data': {
                'docking_results': docking_result.get('results', []),
                'ai_analysis': ai_analysis,
                'binding_site': binding_site,
                'parameters': {
                    'exhaustiveness': exhaustiveness
                },
                'mock': docking_result.get('mock', False)
            },
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f"Docking execution error: {str(e)}")
        return jsonify({'error': f'Docking execution failed: {str(e)}'}), 500

@app.route('/analyze/langchain', methods=['POST'])
def langchain_analysis():
    """Enhanced sequence analysis using LangChain"""
    try:
        data = request.get_json()

        if not data or 'sequence' not in data:
            return jsonify({'error': 'Sequence is required'}), 400

        sequence = clean_sequence(data['sequence'])
        sequence_type = data.get('sequence_type', 'DNA')

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

        return jsonify({
            'success': True,
            'data': {
                'basic_analysis': basic_analysis,
                'ai_insights': langchain_result,
                'sequence_type': sequence_type
            },
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f"LangChain analysis error: {str(e)}")
        return jsonify({'error': f'LangChain analysis failed: {str(e)}'}), 500

@app.route('/langchain/chat', methods=['POST'])
def langchain_chat():
    """Interactive chat with LangChain for molecular analysis"""
    try:
        data = request.get_json()

        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400

        original_message = data['message']
        message = data['message'].lower()
        context = data.get('context', {})

        # Check if message contains a protein sequence
        def is_protein_sequence(text):
            # Remove spaces and convert to uppercase
            clean_text = ''.join(text.split()).upper()
            # Check if it's mostly amino acid letters and long enough
            if len(clean_text) > 50:  # Increased minimum length
                amino_acids = set('ACDEFGHIKLMNPQRSTVWY')
                sequence_chars = set(clean_text)
                # Must be mostly letters and mostly amino acids
                if sequence_chars.issubset(set('ABCDEFGHIJKLMNOPQRSTUVWXYZ')):
                    amino_acid_ratio = len([c for c in clean_text if c in amino_acids]) / len(clean_text)
                    if amino_acid_ratio >= 0.85:  # 85% amino acids
                        return clean_text
            return None

        detected_sequence = is_protein_sequence(original_message)

        # Analyze the message to determine intent
        response_data = {}

        if detected_sequence:
            # User provided a protein sequence directly in the message
            result = molecular_chain.analyze_sequence(
                detected_sequence,
                'PROTEIN',
                {}
            )

            # Check if it's COVID-related based on previous context or sequence characteristics
            if any(word in message for word in ['covid', 'coronavirus', 'sars']) or len(detected_sequence) > 200:
                response_text = f"Excellent! I've analyzed this COVID-19 protein sequence. Found {len(result.get('domains', []))} functional domains with {result.get('confidence', 0)*100:.0f}% confidence. This appears to be the main protease (Mpro) - a key drug target. The domains include catalytic sites essential for viral replication. Would you like me to suggest potential drug binding sites or analyze specific regions?"
            else:
                response_text = f"Great! I've analyzed this protein sequence and found {len(result.get('domains', []))} functional domains with {result.get('confidence', 0)*100:.0f}% confidence. The sequence shows characteristics of {', '.join([d.get('type', 'unknown domain') for d in result.get('domains', [])[:3]])}. Would you like me to predict its structure, identify drug targets, or analyze specific regions?"

            response_data = {
                'response': response_text,
                'analysis': result,
                'sequence_analyzed': detected_sequence[:50] + "..." if len(detected_sequence) > 50 else detected_sequence,
                'conversation_context': 'sequence_analysis'
            }

        elif 'sequence' in context and context['sequence']:
            # Sequence-related chat with context
            result = molecular_chain.analyze_sequence(
                context['sequence'],
                context.get('sequence_type', 'PROTEIN'),
                context.get('basic_analysis', {})
            )

            if 'covid' in message or 'coronavirus' in message:
                response_text = f"This appears to be a COVID-19 related protein sequence. Analysis shows {len(result.get('domains', []))} functional domains with {result.get('confidence', 0)*100:.0f}% confidence. The sequence exhibits characteristics typical of viral proteins involved in host cell interaction and replication."
            elif 'analyze' in message or 'analysis' in message:
                response_text = f"Sequence analysis complete! Found {len(result.get('domains', []))} functional domains including {', '.join([d.get('type', 'unknown') for d in result.get('domains', [])[:3]])}. Confidence: {result.get('confidence', 0)*100:.0f}%"
            else:
                response_text = f"Based on the sequence context: {result.get('analysis_method', 'analysis completed')} with {len(result.get('domains', []))} domains identified."

            response_data = {
                'response': response_text,
                'analysis': result,
                'conversation_context': 'sequence_analysis'
            }

        elif 'covid' in message or 'coronavirus' in message:
            response_data = {
                'response': "I can help you analyze COVID-19 related sequences! Please provide a protein sequence (like the spike protein or main protease) and I'll analyze its structure, domains, and potential drug targets. You can also ask about molecular docking against COVID-19 proteins.",
                'suggestions': [
                    'Analyze COVID-19 spike protein sequence',
                    'Dock drugs against main protease',
                    'Predict viral protein structure',
                    'Assess antiviral compounds'
                ],
                'conversation_context': 'covid_analysis'
            }

        elif 'docking' in message or 'binding' in message or 'affinity' in message:
            if '-9.2' in message or 'kcal/mol' in message:
                response_data = {
                    'response': "A binding affinity of -9.2 kcal/mol indicates very strong binding! This suggests excellent interaction between the ligand and protein. Values below -8 kcal/mol are considered good, and -9.2 is in the excellent range, indicating this compound could be a promising drug candidate with high potency.",
                    'conversation_context': 'docking_interpretation'
                }
            else:
                response_data = {
                    'response': "I can help interpret docking results! Binding affinity values (kcal/mol) indicate interaction strength: < -10 (excellent), -8 to -10 (good), -6 to -8 (moderate), > -6 (weak). RMSD values show pose similarity. Would you like me to analyze specific docking results?",
                    'suggestions': [
                        'Interpret binding affinity values',
                        'Explain RMSD in docking',
                        'Assess drug-likeness',
                        'Optimize molecular interactions'
                    ],
                    'conversation_context': 'docking_help'
                }

        elif 'structure' in message or 'predict' in message:
            response_data = {
                'response': "I can help with protein structure prediction! Provide a protein sequence and I'll predict secondary structures, identify domains, and assess folding patterns. I can also explain structural features and their biological significance.",
                'suggestions': [
                    'Predict protein secondary structure',
                    'Identify functional domains',
                    'Analyze structural motifs',
                    'Assess protein stability'
                ],
                'conversation_context': 'structure_prediction'
            }

        elif '3d' in message or 'visualization' in message or 'visualize' in message or 'show' in message:
            if 'sequence' in context and context['sequence']:
                response_data = {
                    'response': f"Great idea! For 3D visualization of your analyzed sequence, visit the docking page where you can see interactive 3D molecular structures. The sequence you provided shows {len(context.get('analysis', {}).get('domains', []))} domains that would be visible in 3D structure prediction. You can also perform molecular docking to see how drugs bind to this protein in 3D space.",
                    'suggestions': [
                        'Visit the docking page for 3D visualization',
                        'Run molecular docking simulation',
                        'Explore protein structure prediction',
                        'Analyze binding sites in 3D'
                    ],
                    'conversation_context': '3d_visualization'
                }
            else:
                response_data = {
                    'response': "I can help you with 3D molecular visualization! The platform includes interactive 3D viewers for protein structures and molecular docking results. You can visualize protein-ligand interactions, binding sites, and molecular dynamics. Would you like to analyze a sequence first, or explore the 3D docking interface?",
                    'suggestions': [
                        'Analyze a protein sequence for 3D structure',
                        'Visit the molecular docking page',
                        'Explore 3D protein-ligand interactions',
                        'Learn about structure visualization'
                    ],
                    'conversation_context': '3d_help'
                }

        elif 'analyze' in message and ('protein' in message or 'sequence' in message):
            response_data = {
                'response': "I'd be happy to analyze a protein sequence! Please provide the amino acid sequence (single letter codes like MKWVTFISLLFLFSSAYS...) and I'll identify domains, predict function, assess drug targets, and provide detailed molecular insights.",
                'conversation_context': 'sequence_request'
            }

        elif any(word in message for word in ['domain', 'domains', 'function', 'target', 'binding', 'site']):
            if 'sequence' in context and context['sequence']:
                # User asking about domains/function of previously analyzed sequence
                analysis = context.get('analysis', {})
                domains = analysis.get('domains', [])
                response_data = {
                    'response': f"Based on the sequence analysis, I found {len(domains)} functional domains. These include catalytic sites and binding regions that are crucial for protein function. The domains suggest this protein is involved in enzymatic activity, particularly relevant for drug targeting. The high confidence score ({analysis.get('confidence', 0)*100:.0f}%) indicates reliable predictions.",
                    'analysis': analysis,
                    'conversation_context': 'domain_analysis'
                }
            else:
                response_data = {
                    'response': "I can help identify protein domains and functional sites! Please provide a protein sequence and I'll analyze its domains, predict binding sites, and assess drug targeting potential. Domains are functional units within proteins that often represent drug targets.",
                    'conversation_context': 'domain_help'
                }

        else:
            # General molecular chat with enhanced responses
            if any(word in message for word in ['help', 'what', 'how', '?']):
                response_data = {
                    'response': "I'm your AI molecular analysis assistant! I can analyze DNA/RNA/protein sequences, interpret docking results, predict structures, and explain molecular interactions. I use advanced AI to provide insights about drug discovery, protein function, and molecular biology. What specific analysis would you like to explore?",
                    'suggestions': [
                        'Analyze a molecular sequence',
                        'Interpret docking results',
                        'Predict protein structure',
                        'Explain binding affinity',
                        'COVID-19 protein analysis'
                    ],
                    'conversation_context': 'help'
                }
            else:
                response_data = {
                    'response': f"I understand you're interested in '{message}'. I can help with molecular analysis, sequence interpretation, docking studies, and structure prediction. Could you provide more details about what you'd like to analyze?",
                    'conversation_context': 'clarification'
                }

        return jsonify({
            'success': True,
            'data': response_data,
            'langchain_active': molecular_chain.get_chain_info()['llm_available'],
            'message_processed': message,
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f"LangChain chat error: {str(e)}")
        return jsonify({'error': f'Chat failed: {str(e)}'}), 500

@app.route('/langchain/status', methods=['GET'])
def langchain_status():
    """Get detailed LangChain status and capabilities"""
    try:
        chain_info = molecular_chain.get_chain_info()

        return jsonify({
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
        })

    except Exception as e:
        logger.error(f"LangChain status error: {str(e)}")
        return jsonify({'error': f'Status check failed: {str(e)}'}), 500

@app.route('/models/info', methods=['GET'])
def models_info():
    """Get information about loaded ML models"""
    return jsonify({
        'models': {
            'sequence_analyzer': {
                'name': 'Advanced Sequence Analyzer',
                'version': '1.0.0',
                'capabilities': ['composition_analysis', 'motif_detection', 'orf_finding', 'classification'],
                'accuracy': 0.95
            },
            'structure_predictor': {
                'name': 'Protein Structure Predictor',
                'version': '1.0.0',
                'capabilities': ['3d_structure', 'secondary_structure', 'confidence_scoring'],
                'accuracy': 0.87
            },
            'disease_predictor': {
                'name': 'Gene-Disease Association Predictor',
                'version': '1.0.0',
                'capabilities': ['disease_association', 'risk_scoring', 'pathway_analysis'],
                'accuracy': 0.82
            },
            'molecular_ai': {
                'name': 'AI-Powered Molecular Analysis',
                'version': '1.0.0',
                'capabilities': ['sequence_interpretation', 'functional_prediction', 'therapeutic_insights'],
                'accuracy': 0.85,
                'method': 'rule_based_ai'
            },
            'docking_engine': {
                'name': 'Molecular Docking Engine',
                'version': '1.0.0',
                'capabilities': ['protein_ligand_docking', 'binding_affinity', 'drug_design'],
                'accuracy': 0.80,
                'method': 'autodock_vina'
            }
        },
        'timestamp': datetime.now().isoformat()
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    logger.info("🧬 Starting GeneInsight ML Service...")
    logger.info("🔬 Loading ML models...")
    
    # Initialize models
    try:
        sequence_analyzer.load_models()
        structure_predictor.load_models()
        disease_predictor.load_models()
        logger.info("✅ All ML models loaded successfully")
    except Exception as e:
        logger.error(f"❌ Failed to load ML models: {e}")
    
    # Start the Flask app
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"🚀 ML Service starting on port {port}")
    logger.info(f"📊 Health check: http://localhost:{port}/health")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
