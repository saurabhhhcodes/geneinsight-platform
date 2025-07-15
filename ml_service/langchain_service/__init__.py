"""
LangChain Service Module for GeneInsight Platform

This module provides AI-powered analysis and conversational capabilities for:
- Natural language processing of molecular data
- Scientific literature retrieval and analysis
- Conversational explanations of analysis results
- RAG-based molecular insights
"""

from .molecular_chain import MolecularAnalysisChain
# from .conversation_handler import ConversationHandler
# from .literature_retriever import LiteratureRetriever
# from .analysis_explainer import AnalysisExplainer

__all__ = [
    'MolecularAnalysisChain',
    # 'ConversationHandler',
    # 'LiteratureRetriever',
    # 'AnalysisExplainer'
]
