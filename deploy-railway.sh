#!/bin/bash

# GeneInsight Platform - Railway Deployment Script
# This script deploys the full LangChain-enabled application to Railway

echo "🚂 GeneInsight Platform - Railway Deployment"
echo "============================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

# Create new Railway project
echo "🆕 Creating Railway project..."
railway init

# Set environment variables
echo "⚙️  Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set NEXT_TELEMETRY_DISABLED=1
railway variables set TRANSFORMERS_CACHE=/tmp/transformers_cache
railway variables set FLASK_ENV=production
railway variables set PORT=3000

# Add PostgreSQL database
echo "🗄️  Adding PostgreSQL database..."
railway add postgresql

# Deploy the application
echo "🚀 Deploying to Railway..."
railway up --dockerfile Dockerfile.railway

echo "✅ Deployment initiated!"
echo ""
echo "🌐 Your application will be available at:"
echo "   https://your-app.railway.app"
echo ""
echo "🧠 LangChain AI features will be fully functional!"
echo "💬 AI Chat: https://your-app.railway.app/ai-chat"
echo "🎯 Enhanced Docking: https://your-app.railway.app/docking"
echo ""
echo "📊 Monitor deployment:"
echo "   railway logs"
echo "   railway status"
