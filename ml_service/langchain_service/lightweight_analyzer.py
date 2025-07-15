"""
Lightweight Molecular Analysis using Rule-Based AI

This module provides intelligent molecular analysis without requiring large language models:
- Rule-based sequence interpretation
- Pattern recognition for functional domains
- Knowledge-based therapeutic predictions
- Template-driven insights generation
"""

import logging
import re
from typing import Dict, List, Any, Optional
import json
from datetime import datetime

logger = logging.getLogger(__name__)

class LightweightMolecularAnalyzer:
    """Lightweight AI-powered molecular analysis using rule-based approaches"""
    
    def __init__(self):
        self.protein_domains = self._load_protein_domains()
        self.functional_patterns = self._load_functional_patterns()
        self.drug_targets = self._load_drug_targets()
        self.therapeutic_keywords = self._load_therapeutic_keywords()
    
    def _load_protein_domains(self) -> Dict[str, Dict[str, Any]]:
        """Load common protein domain patterns"""
        return {
            'kinase': {
                'patterns': [r'[KR].{2,4}[DE]', r'DFG', r'HRD'],
                'function': 'Protein phosphorylation and signal transduction',
                'therapeutic_relevance': 'High - many kinases are drug targets',
                'confidence': 0.8
            },
            'helix_turn_helix': {
                'patterns': [r'[RK].{15,25}[RK]', r'[AILV]{3,5}[RK]'],
                'function': 'DNA binding and transcriptional regulation',
                'therapeutic_relevance': 'Medium - transcription factor targeting',
                'confidence': 0.7
            },
            'zinc_finger': {
                'patterns': [r'C.{2,4}C.{12,14}H.{3,5}H', r'C.{2,4}C.{3,5}C.{2,4}C'],
                'function': 'DNA/RNA binding and protein interactions',
                'therapeutic_relevance': 'Medium - epigenetic regulation',
                'confidence': 0.75
            },
            'immunoglobulin': {
                'patterns': [r'C.{60,80}C', r'[FY].{5,15}[WY]'],
                'function': 'Immune recognition and binding',
                'therapeutic_relevance': 'High - antibody therapeutics',
                'confidence': 0.85
            },
            'enzyme_active_site': {
                'patterns': [r'[ST][AG].[GS]', r'GxSxG', r'[DE].{2,4}[DE]'],
                'function': 'Catalytic activity and metabolism',
                'therapeutic_relevance': 'High - enzyme inhibition',
                'confidence': 0.8
            }
        }
    
    def _load_functional_patterns(self) -> Dict[str, Dict[str, Any]]:
        """Load functional sequence patterns"""
        return {
            'signal_peptide': {
                'pattern': r'^M[AILV]{10,25}[AILV][AG]',
                'description': 'N-terminal signal sequence for protein targeting',
                'location': 'N-terminus'
            },
            'nuclear_localization': {
                'pattern': r'[KR]{4,6}|[KR].{10,12}[KR]{3,4}',
                'description': 'Nuclear localization signal',
                'location': 'Variable'
            },
            'transmembrane': {
                'pattern': r'[AILV]{15,25}',
                'description': 'Transmembrane domain',
                'location': 'Membrane-spanning'
            },
            'glycosylation': {
                'pattern': r'N[^P][ST]',
                'description': 'N-linked glycosylation site',
                'location': 'Extracellular/ER'
            }
        }
    
    def _load_drug_targets(self) -> Dict[str, Dict[str, Any]]:
        """Load known drug target classes"""
        return {
            'gpcr': {
                'indicators': ['transmembrane', 'G protein', 'receptor'],
                'druggability': 0.9,
                'examples': ['Beta-adrenergic receptors', 'Dopamine receptors']
            },
            'kinase': {
                'indicators': ['kinase', 'phosphorylation', 'ATP binding'],
                'druggability': 0.85,
                'examples': ['Tyrosine kinases', 'Serine/threonine kinases']
            },
            'protease': {
                'indicators': ['protease', 'peptidase', 'cleavage'],
                'druggability': 0.8,
                'examples': ['HIV protease', 'Renin']
            },
            'ion_channel': {
                'indicators': ['channel', 'ion transport', 'voltage-gated'],
                'druggability': 0.75,
                'examples': ['Calcium channels', 'Sodium channels']
            }
        }
    
    def _load_therapeutic_keywords(self) -> Dict[str, List[str]]:
        """Load therapeutic area keywords"""
        return {
            'oncology': ['cancer', 'tumor', 'oncogene', 'metastasis', 'apoptosis'],
            'neurology': ['neuron', 'synapse', 'neurotransmitter', 'brain', 'neural'],
            'cardiology': ['heart', 'cardiac', 'vascular', 'blood pressure', 'circulation'],
            'immunology': ['immune', 'antibody', 'T cell', 'B cell', 'inflammation'],
            'metabolism': ['metabolic', 'diabetes', 'glucose', 'insulin', 'lipid']
        }
    
    def analyze_sequence(self, sequence: str, sequence_type: str, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze sequence using rule-based AI"""
        try:
            result = {
                'timestamp': datetime.now().isoformat(),
                'sequence_type': sequence_type,
                'analysis_method': 'rule_based_ai'
            }
            
            if sequence_type.upper() == 'PROTEIN':
                result.update(self._analyze_protein_sequence(sequence, analysis_data))
            elif sequence_type.upper() == 'DNA':
                result.update(self._analyze_dna_sequence(sequence, analysis_data))
            else:
                result.update(self._analyze_generic_sequence(sequence, analysis_data))
            
            # Add confidence scoring
            result['confidence'] = self._calculate_confidence(result)
            
            return result
            
        except Exception as e:
            logger.error(f"Sequence analysis failed: {e}")
            return {
                'error': str(e),
                'confidence': 0.0,
                'analysis_method': 'rule_based_ai'
            }
    
    def _analyze_protein_sequence(self, sequence: str, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze protein sequence"""
        result = {}
        
        # Domain analysis
        domains_found = []
        for domain_name, domain_info in self.protein_domains.items():
            for pattern in domain_info['patterns']:
                if re.search(pattern, sequence):
                    domains_found.append({
                        'domain': domain_name,
                        'function': domain_info['function'],
                        'therapeutic_relevance': domain_info['therapeutic_relevance'],
                        'confidence': domain_info['confidence']
                    })
                    break
        
        result['domains'] = domains_found
        
        # Functional pattern analysis
        patterns_found = []
        for pattern_name, pattern_info in self.functional_patterns.items():
            if re.search(pattern_info['pattern'], sequence):
                patterns_found.append({
                    'pattern': pattern_name,
                    'description': pattern_info['description'],
                    'location': pattern_info['location']
                })
        
        result['functional_patterns'] = patterns_found
        
        # Drug target prediction
        target_prediction = self._predict_drug_target(sequence, domains_found)
        result['drug_target_prediction'] = target_prediction
        
        # Therapeutic area prediction
        therapeutic_areas = self._predict_therapeutic_areas(domains_found, patterns_found)
        result['therapeutic_areas'] = therapeutic_areas
        
        # Generate insights
        result['insights'] = self._generate_protein_insights(domains_found, patterns_found, target_prediction)
        
        # Generate recommendations
        result['recommendations'] = self._generate_protein_recommendations(result)
        
        return result
    
    def _analyze_dna_sequence(self, sequence: str, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze DNA sequence"""
        result = {}
        
        # ORF analysis from existing data
        orfs = analysis_data.get('orfs', [])
        if orfs:
            result['protein_coding_potential'] = 'High' if len(orfs) > 0 else 'Low'
            result['longest_orf'] = max([orf.get('length', 0) for orf in orfs]) if orfs else 0
        
        # Regulatory element prediction
        regulatory_elements = self._find_regulatory_elements(sequence)
        result['regulatory_elements'] = regulatory_elements
        
        # Generate insights for DNA
        result['insights'] = self._generate_dna_insights(analysis_data, regulatory_elements)
        result['recommendations'] = self._generate_dna_recommendations(result)
        
        return result
    
    def _analyze_generic_sequence(self, sequence: str, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generic sequence analysis"""
        return {
            'insights': ['Sequence analysis completed with basic pattern recognition'],
            'recommendations': ['Consider more specific sequence type for detailed analysis'],
            'confidence': 0.5
        }
    
    def _predict_drug_target(self, sequence: str, domains: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Predict drug target potential"""
        druggability_score = 0.0
        target_class = 'unknown'
        
        for domain in domains:
            domain_name = domain['domain']
            if domain_name in ['kinase', 'enzyme_active_site']:
                druggability_score = max(druggability_score, 0.8)
                target_class = 'enzyme'
            elif domain_name == 'immunoglobulin':
                druggability_score = max(druggability_score, 0.7)
                target_class = 'receptor'
        
        return {
            'druggability_score': druggability_score,
            'target_class': target_class,
            'rationale': f'Based on identified domains: {[d["domain"] for d in domains]}'
        }
    
    def _predict_therapeutic_areas(self, domains: List[Dict[str, Any]], patterns: List[Dict[str, Any]]) -> List[str]:
        """Predict relevant therapeutic areas"""
        areas = []
        
        for domain in domains:
            if domain['domain'] == 'kinase':
                areas.extend(['oncology', 'immunology'])
            elif domain['domain'] == 'immunoglobulin':
                areas.append('immunology')
            elif domain['domain'] == 'enzyme_active_site':
                areas.append('metabolism')
        
        return list(set(areas))
    
    def _find_regulatory_elements(self, sequence: str) -> List[Dict[str, Any]]:
        """Find regulatory elements in DNA sequence"""
        elements = []
        
        # TATA box
        if re.search(r'TATAAA', sequence):
            elements.append({'type': 'TATA_box', 'function': 'Transcription initiation'})
        
        # CpG islands
        cpg_count = len(re.findall(r'CG', sequence))
        if cpg_count > len(sequence) * 0.06:  # CpG frequency > 6%
            elements.append({'type': 'CpG_island', 'function': 'Gene regulation'})
        
        return elements
    
    def _generate_protein_insights(self, domains: List[Dict[str, Any]], patterns: List[Dict[str, Any]], 
                                 target_prediction: Dict[str, Any]) -> List[str]:
        """Generate insights for protein analysis"""
        insights = []
        
        if domains:
            insights.append(f"Identified {len(domains)} functional domains suggesting specific biological roles")
            
        if target_prediction['druggability_score'] > 0.7:
            insights.append("High druggability score indicates potential as therapeutic target")
            
        if patterns:
            insights.append(f"Found {len(patterns)} functional patterns indicating cellular localization and processing")
            
        return insights
    
    def _generate_protein_recommendations(self, analysis_result: Dict[str, Any]) -> List[str]:
        """Generate recommendations for protein analysis"""
        recommendations = []
        
        if analysis_result.get('drug_target_prediction', {}).get('druggability_score', 0) > 0.7:
            recommendations.append("Consider structure-based drug design approaches")
            
        if analysis_result.get('domains'):
            recommendations.append("Perform homology modeling to understand 3D structure")
            
        recommendations.append("Validate findings with experimental functional studies")
        
        return recommendations
    
    def _generate_dna_insights(self, analysis_data: Dict[str, Any], regulatory_elements: List[Dict[str, Any]]) -> List[str]:
        """Generate insights for DNA analysis"""
        insights = []
        
        gc_content = analysis_data.get('gc_content', 0)
        if gc_content > 60:
            insights.append("High GC content suggests gene-rich region")
        elif gc_content < 40:
            insights.append("Low GC content may indicate regulatory regions")
            
        if regulatory_elements:
            insights.append(f"Identified {len(regulatory_elements)} regulatory elements")
            
        return insights
    
    def _generate_dna_recommendations(self, analysis_result: Dict[str, Any]) -> List[str]:
        """Generate recommendations for DNA analysis"""
        return [
            "Consider promoter analysis for regulatory elements",
            "Perform comparative genomics analysis",
            "Validate regulatory predictions experimentally"
        ]
    
    def _calculate_confidence(self, result: Dict[str, Any]) -> float:
        """Calculate overall confidence score"""
        confidence_factors = []
        
        if 'domains' in result:
            confidence_factors.append(len(result['domains']) * 0.1)
            
        if 'functional_patterns' in result:
            confidence_factors.append(len(result['functional_patterns']) * 0.05)
            
        if 'drug_target_prediction' in result:
            confidence_factors.append(result['drug_target_prediction'].get('druggability_score', 0) * 0.3)
        
        return min(0.9, sum(confidence_factors) + 0.5)  # Base confidence of 0.5
    
    def analyze_docking(self, protein_info: Dict[str, Any], ligand_info: Dict[str, Any], 
                       docking_results: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze docking results using rule-based approach"""
        try:
            results = docking_results.get('results', [])
            if not results:
                return {'error': 'No docking results to analyze'}
            
            best_result = min(results, key=lambda x: x.get('affinity', 0))
            
            analysis = {
                'binding_analysis': self._analyze_binding_affinity(best_result['affinity']),
                'interaction_prediction': self._predict_interactions(protein_info, ligand_info),
                'drug_likeness': self._assess_drug_likeness(ligand_info),
                'optimization_suggestions': self._suggest_optimizations(best_result, ligand_info),
                'confidence': 0.8,
                'timestamp': datetime.now().isoformat()
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Docking analysis failed: {e}")
            return {'error': str(e), 'confidence': 0.0}
    
    def _analyze_binding_affinity(self, affinity: float) -> Dict[str, Any]:
        """Analyze binding affinity score"""
        if affinity < -10:
            strength = "Very Strong"
            interpretation = "Excellent binding affinity, promising lead compound"
        elif affinity < -8:
            strength = "Strong"
            interpretation = "Good binding affinity, suitable for optimization"
        elif affinity < -6:
            strength = "Moderate"
            interpretation = "Moderate binding, requires improvement"
        else:
            strength = "Weak"
            interpretation = "Weak binding, significant optimization needed"
        
        return {
            'affinity_kcal_mol': affinity,
            'strength': strength,
            'interpretation': interpretation
        }
    
    def _predict_interactions(self, protein_info: Dict[str, Any], ligand_info: Dict[str, Any]) -> List[str]:
        """Predict molecular interactions"""
        interactions = [
            "Hydrogen bonding with polar residues",
            "Hydrophobic interactions with aromatic residues",
            "Van der Waals forces contributing to binding"
        ]
        
        # Add specific predictions based on ligand properties
        if ligand_info.get('properties', {}).get('hbd', 0) > 2:
            interactions.append("Multiple hydrogen bond donors enhance binding")
            
        return interactions
    
    def _assess_drug_likeness(self, ligand_info: Dict[str, Any]) -> Dict[str, Any]:
        """Assess drug-likeness using Lipinski's Rule of Five"""
        properties = ligand_info.get('properties', {})
        violations = properties.get('lipinski_violations', 0)
        
        if violations == 0:
            assessment = "Excellent drug-like properties"
            score = 0.9
        elif violations == 1:
            assessment = "Good drug-like properties"
            score = 0.7
        elif violations == 2:
            assessment = "Moderate drug-like properties"
            score = 0.5
        else:
            assessment = "Poor drug-like properties"
            score = 0.3
        
        return {
            'lipinski_violations': violations,
            'assessment': assessment,
            'drug_likeness_score': score,
            'molecular_weight': properties.get('molecular_weight', 0),
            'logp': properties.get('logp', 0)
        }
    
    def _suggest_optimizations(self, docking_result: Dict[str, Any], ligand_info: Dict[str, Any]) -> List[str]:
        """Suggest optimization strategies"""
        suggestions = []
        
        affinity = docking_result.get('affinity', 0)
        if affinity > -8:
            suggestions.append("Increase binding affinity through structure-activity relationship studies")
            
        properties = ligand_info.get('properties', {})
        if properties.get('molecular_weight', 0) > 500:
            suggestions.append("Reduce molecular weight to improve drug-like properties")
            
        if properties.get('lipinski_violations', 0) > 1:
            suggestions.append("Optimize physicochemical properties to reduce Lipinski violations")
            
        suggestions.append("Perform selectivity studies against related targets")
        
        return suggestions
