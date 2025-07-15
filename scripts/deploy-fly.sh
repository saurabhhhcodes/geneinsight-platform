#!/bin/bash

# GeneInsight Platform - Fly.io Deployment Script
# This script deploys to Fly.io with full LangChain support

echo "✈️ GeneInsight Platform - Fly.io Deployment"
echo "==========================================="

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ Fly CLI not found. Installing..."
    curl -L https://fly.io/install.sh | sh
    echo "✅ Fly CLI installed. Please restart your terminal and run this script again."
    exit 1
fi

# Login to Fly.io
echo "🔐 Logging into Fly.io..."
flyctl auth login

# Launch the app
echo "🚀 Launching app on Fly.io..."
flyctl launch --dockerfile Dockerfile.railway --no-deploy

# Create volume for model storage
echo "💾 Creating persistent volume for model storage..."
flyctl volumes create model_cache --size 2

# Set environment variables
echo "⚙️ Setting environment variables..."
flyctl secrets set NODE_ENV=production
flyctl secrets set NEXT_TELEMETRY_DISABLED=1
flyctl secrets set TRANSFORMERS_CACHE=/data/transformers_cache
flyctl secrets set FLASK_ENV=production

# Deploy the application
echo "🚀 Deploying to Fly.io..."
flyctl deploy

# Show app info
echo "✅ Deployment complete!"
echo ""
flyctl info
echo ""
echo "🌐 Your application is available at:"
flyctl status --json | jq -r '.Hostname' | sed 's/^/https:\/\//'
echo ""
echo "🧠 LangChain AI features are fully functional!"
echo "💬 AI Chat: https://$(flyctl status --json | jq -r '.Hostname')/ai-chat"
echo "🎯 Enhanced Docking: https://$(flyctl status --json | jq -r '.Hostname')/docking"
echo ""
echo "📊 Monitor deployment:"
echo "   flyctl logs"
echo "   flyctl status"
echo "   flyctl ssh console"
