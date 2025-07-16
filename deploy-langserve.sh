#!/bin/bash

# GeneInsight LangServe Deployment Script
# This script deploys the LangChain backend to Railway for free hosting

set -e

echo "🚀 GeneInsight LangServe Deployment to Railway"
echo "=============================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "🔐 Please login to Railway..."
railway login

# Create new Railway project
echo "🆕 Creating Railway project..."
railway new geneinsight-langserve

# Link to the project
railway link

# Set environment variables
echo "⚙️ Setting environment variables..."
railway variables set PYTHONUNBUFFERED=1
railway variables set PORT=8000
railway variables set TRANSFORMERS_CACHE=/tmp/transformers_cache
railway variables set LANGCHAIN_MODEL=microsoft/DialoGPT-small
railway variables set FLASK_ENV=production

# Deploy the application
echo "🚀 Deploying LangServe application..."
railway up --detach

# Get the deployment URL
echo "🌐 Getting deployment URL..."
RAILWAY_URL=$(railway status --json | jq -r '.deployments[0].url')

echo ""
echo "✅ Deployment completed successfully!"
echo "🌐 Your LangServe API is available at: $RAILWAY_URL"
echo "📊 Health check: $RAILWAY_URL/health"
echo "📚 API documentation: $RAILWAY_URL/docs"
echo ""
echo "🔗 LangServe endpoints:"
echo "  - Sequence Analysis: $RAILWAY_URL/analyze/sequence"
echo "  - LangChain Chat: $RAILWAY_URL/langchain/chat"
echo "  - Molecular Docking: $RAILWAY_URL/analyze/docking"
echo "  - LangChain Status: $RAILWAY_URL/langchain/status"
echo ""
echo "📝 Next steps:"
echo "1. Update your Vercel frontend environment variables"
echo "2. Set NEXT_PUBLIC_API_URL=$RAILWAY_URL"
echo "3. Test the integration"
echo ""
echo "🎉 Your GeneInsight platform is now running on free infrastructure!"
