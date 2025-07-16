#!/bin/bash

# GeneInsight Platform - Apillon Deployment Script
# Deploy complete full-stack application with LangChain to Apillon

echo "🌐 GeneInsight Platform - Apillon Deployment"
echo "============================================="
echo ""
echo "🎯 Deploying to Apillon Web3 Platform:"
echo "   ✅ Frontend (Next.js)"
echo "   ✅ Backend (Python + LangChain)"
echo "   ✅ Database (PostgreSQL)"
echo "   ✅ All AI features working"
echo ""

# Check if Apillon CLI is installed
if ! command -v apillon &> /dev/null; then
    echo "📦 Installing Apillon CLI..."
    npm install -g @apillon/cli
    echo "✅ Apillon CLI installed"
fi

# Login to Apillon
echo "🔐 Please login to Apillon..."
apillon auth login

# Initialize Apillon project
echo "🆕 Initializing Apillon project..."
apillon init --config apillon.json

# Set environment variables
echo "⚙️ Setting environment variables..."
apillon env set NODE_ENV=production
apillon env set NEXT_TELEMETRY_DISABLED=1
apillon env set TRANSFORMERS_CACHE=/tmp/transformers_cache
apillon env set FLASK_ENV=production
apillon env set PYTHONUNBUFFERED=1

# Create database
echo "🗄️ Setting up PostgreSQL database..."
apillon database create --type postgresql --name geneinsight-db

# Deploy backend service
echo "🧠 Deploying ML service with LangChain..."
apillon deploy backend --service ml-service --path ml_service

# Build and deploy frontend
echo "🌐 Building and deploying frontend..."
npm run build
apillon deploy frontend --service frontend --path .next

# Configure domains and routing
echo "🔗 Configuring domains and routing..."
apillon domain configure --frontend geneinsight.apillon.io --backend api.geneinsight.apillon.io

# Run health checks
echo "🧪 Running health checks..."
apillon health check --all

# Get deployment URLs
echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "🌐 Your application is live at:"
echo "   Frontend: https://geneinsight.apillon.io"
echo "   Backend API: https://api.geneinsight.apillon.io"
echo "   AI Chat: https://geneinsight.apillon.io/ai-chat"
echo "   Dashboard: https://geneinsight.apillon.io/dashboard"
echo ""
echo "🧬 All Features Available:"
echo "   ✅ LangChain AI: Full conversational analysis"
echo "   ✅ COVID-19 Analysis: Expert viral protein insights"
echo "   ✅ Sequence Detection: Automatic protein recognition"
echo "   ✅ Molecular Docking: Protein-ligand simulations"
echo "   ✅ 3D Visualization: Interactive molecular viewer"
echo "   ✅ Database: PostgreSQL for data persistence"
echo ""
echo "📊 Monitor your deployment:"
echo "   apillon logs --service ml-service"
echo "   apillon status --all"
echo "   apillon metrics --service backend"
echo ""
echo "🎉 Your complete AI-powered molecular analysis platform is now live on Web3!"
