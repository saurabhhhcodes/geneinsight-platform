#!/bin/bash

# Correct Apillon Deployment - Frontend Only
echo "🌐 GeneInsight Platform - Apillon Frontend Deployment"
echo "====================================================="

echo "ℹ️  Note: Apillon is for static website hosting."
echo "   Backend will be deployed to Render/Railway separately."
echo ""

# Check if API keys are set
if [ -z "$APILLON_API_KEY" ] || [ -z "$APILLON_API_SECRET" ]; then
    echo "❌ Apillon API credentials not found!"
    echo ""
    echo "🔑 Please set your Apillon API credentials:"
    echo "   1. Go to https://app.apillon.io"
    echo "   2. Navigate to Dashboard → API Keys"
    echo "   3. Create new API key"
    echo "   4. Set environment variables:"
    echo ""
    echo "   export APILLON_API_KEY=your_api_key"
    echo "   export APILLON_API_SECRET=your_api_secret"
    echo ""
    echo "   Or on Windows:"
    echo "   set APILLON_API_KEY=your_api_key"
    echo "   set APILLON_API_SECRET=your_api_secret"
    echo ""
    exit 1
fi

# Build the frontend
echo "🔨 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Frontend built successfully!"

# Deploy to Apillon hosting
echo ""
echo "🚀 Deploying to Apillon hosting..."

# Deploy the built frontend
apillon hosting deploy-website .next --key $APILLON_API_KEY --secret $APILLON_API_SECRET

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ FRONTEND DEPLOYMENT SUCCESSFUL!"
    echo ""
    echo "🌐 Your frontend is now live on Apillon!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Deploy backend to Render.com or Railway"
    echo "2. Update frontend API URLs to point to backend"
    echo "3. Configure custom domain (optional)"
    echo ""
    echo "🔗 Backend Deployment Options:"
    echo "   • Render.com: Free tier with Python support"
    echo "   • Railway: $5/month with full LangChain"
    echo "   • Fly.io: Free tier with Docker support"
else
    echo "❌ Deployment failed!"
    echo ""
    echo "🔍 Troubleshooting:"
    echo "1. Check API credentials"
    echo "2. Verify build output in .next folder"
    echo "3. Check Apillon dashboard for errors"
fi
