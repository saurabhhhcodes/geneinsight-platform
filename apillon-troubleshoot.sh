#!/bin/bash

# Apillon Deployment Troubleshooting Script
echo "🔍 GeneInsight Platform - Apillon Troubleshooting"
echo "================================================="

# Check Apillon CLI version
echo "📦 Checking Apillon CLI..."
if command -v apillon &> /dev/null; then
    echo "✅ Apillon CLI installed: $(apillon --version)"
else
    echo "❌ Apillon CLI not found. Installing..."
    npm install -g @apillon/cli
fi

# Check authentication
echo ""
echo "🔐 Checking authentication..."
apillon auth status
if [ $? -ne 0 ]; then
    echo "❌ Not authenticated. Please login:"
    apillon auth login
fi

# Check project status
echo ""
echo "📊 Checking project status..."
apillon status

# Check recent deployments
echo ""
echo "📋 Recent deployments..."
apillon deployments list --limit 5

# Check logs for errors
echo ""
echo "📝 Checking recent logs..."
apillon logs --tail 20

# Common fixes
echo ""
echo "🔧 COMMON APILLON DEPLOYMENT FIXES:"
echo "=================================="

echo ""
echo "1. 📦 DEPENDENCY ISSUES:"
echo "   Problem: Python dependencies fail to install"
echo "   Solution:"
echo "   apillon env set PYTHONUNBUFFERED=1"
echo "   apillon env set PIP_NO_CACHE_DIR=1"
echo "   apillon redeploy --service ml-service"

echo ""
echo "2. 💾 MEMORY ISSUES:"
echo "   Problem: Out of memory during model loading"
echo "   Solution:"
echo "   apillon scale --service ml-service --memory 4GB"
echo "   apillon env set TRANSFORMERS_CACHE=/tmp/cache"

echo ""
echo "3. ⏱️ TIMEOUT ISSUES:"
echo "   Problem: Build or startup timeout"
echo "   Solution:"
echo "   apillon env set BUILD_TIMEOUT=1800"
echo "   apillon env set STARTUP_TIMEOUT=300"

echo ""
echo "4. 🔗 NETWORK ISSUES:"
echo "   Problem: Cannot download models or dependencies"
echo "   Solution:"
echo "   apillon env set HTTP_TIMEOUT=300"
echo "   apillon env set REQUESTS_TIMEOUT=300"

echo ""
echo "5. 🐳 CONTAINER ISSUES:"
echo "   Problem: Docker build fails"
echo "   Solution:"
echo "   apillon build --dockerfile Dockerfile.apillon --no-cache"
echo "   apillon deploy --force-rebuild"

echo ""
echo "6. 📊 RESOURCE LIMITS:"
echo "   Problem: Service crashes due to resource limits"
echo "   Solution:"
echo "   apillon scale --service ml-service --cpu 2 --memory 4GB"
echo "   apillon env set MAX_WORKERS=1"

echo ""
echo "🧪 TESTING COMMANDS:"
echo "==================="
echo "# Test health endpoint"
echo "curl https://api.geneinsight.apillon.io/health"
echo ""
echo "# Test LangChain status"
echo "curl https://api.geneinsight.apillon.io/langchain/status"
echo ""
echo "# Test AI chat"
echo "curl -X POST https://api.geneinsight.apillon.io/langchain/chat \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"message\": \"hello\"}'"

echo ""
echo "🔄 QUICK FIXES TO TRY:"
echo "====================="
echo "1. apillon restart --service ml-service"
echo "2. apillon redeploy --service ml-service --force"
echo "3. apillon scale --service ml-service --memory 4GB"
echo "4. apillon env set TRANSFORMERS_CACHE=/tmp/transformers_cache"
echo "5. apillon logs --service ml-service --tail 100"

echo ""
echo "📞 If issues persist:"
echo "- Check Apillon dashboard for detailed error messages"
echo "- Contact Apillon support with deployment logs"
echo "- Try deploying individual services separately"
