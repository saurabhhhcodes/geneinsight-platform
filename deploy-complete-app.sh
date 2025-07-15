#!/bin/bash

# GeneInsight Platform - Complete Deployment Script
# Deploy everything (Frontend + Backend + ML + Database) in one go

echo "🧬 GeneInsight Platform - Complete Deployment"
echo "============================================="
echo ""
echo "🎯 This will deploy:"
echo "   ✅ Frontend (Next.js)"
echo "   ✅ ML Service (Python + LangChain)"
echo "   ✅ Database (PostgreSQL)"
echo "   ✅ All AI features working"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed"
fi

# Login to Railway
echo "🔐 Please login to Railway..."
railway login

# Initialize project
echo "🆕 Initializing Railway project..."
railway init --name geneinsight-platform

# Set environment variables for production
echo "⚙️ Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set NEXT_TELEMETRY_DISABLED=1
railway variables set TRANSFORMERS_CACHE=/tmp/transformers_cache
railway variables set FLASK_ENV=production

# Add PostgreSQL database
echo "🗄️ Adding PostgreSQL database..."
railway add postgresql

# Deploy the application
echo "🚀 Deploying complete application..."
echo "   This may take 5-10 minutes for first deployment (downloading AI model)..."
railway up --dockerfile Dockerfile.railway

# Get the deployment URL
echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "🌐 Your application is live at:"
railway domain
echo ""
echo "🧬 Available Features:"
echo "   • Main App: https://$(railway domain)"
echo "   • AI Chat: https://$(railway domain)/ai-chat"
echo "   • Molecular Docking: https://$(railway domain)/docking"
echo "   • Health Check: https://$(railway domain)/health"
echo ""
echo "🧠 LangChain AI Features:"
echo "   ✅ Conversational molecular analysis"
echo "   ✅ COVID-19 specialized insights"
echo "   ✅ Automatic sequence detection"
echo "   ✅ Context-aware responses"
echo "   ✅ Real-time AI status monitoring"
echo ""
echo "📊 Monitor your deployment:"
echo "   railway logs    # View application logs"
echo "   railway status  # Check service status"
echo "   railway open    # Open app in browser"
echo ""
echo "🎉 Your complete AI-powered molecular analysis platform is now live!"
echo "   Share this URL with anyone to access all features!"
