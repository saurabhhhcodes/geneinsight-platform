@echo off
REM GeneInsight LangServe Deployment Script for Windows
REM This script deploys the LangChain backend to Railway for free hosting

echo 🚀 GeneInsight LangServe Deployment to Railway
echo ==============================================

REM Check if Railway CLI is installed
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing Railway CLI...
    npm install -g @railway/cli
)

REM Login to Railway
echo 🔐 Please login to Railway...
railway login

REM Create new Railway project
echo 🆕 Creating Railway project...
railway new geneinsight-langserve

REM Link to the project
railway link

REM Set environment variables
echo ⚙️ Setting environment variables...
railway variables set PYTHONUNBUFFERED=1
railway variables set PORT=8000
railway variables set TRANSFORMERS_CACHE=/tmp/transformers_cache
railway variables set LANGCHAIN_MODEL=microsoft/DialoGPT-small
railway variables set FLASK_ENV=production

REM Deploy the application
echo 🚀 Deploying LangServe application...
railway up --detach

REM Get the deployment URL
echo 🌐 Getting deployment URL...
railway status

echo.
echo ✅ Deployment completed successfully!
echo 🌐 Check Railway dashboard for your deployment URL
echo 📊 Health check: [YOUR_URL]/health
echo 📚 API documentation: [YOUR_URL]/docs
echo.
echo 🔗 LangServe endpoints:
echo   - Sequence Analysis: [YOUR_URL]/analyze/sequence
echo   - LangChain Chat: [YOUR_URL]/langchain/chat
echo   - Molecular Docking: [YOUR_URL]/analyze/docking
echo   - LangChain Status: [YOUR_URL]/langchain/status
echo.
echo 📝 Next steps:
echo 1. Update your Vercel frontend environment variables
echo 2. Set NEXT_PUBLIC_API_URL=[YOUR_RAILWAY_URL]
echo 3. Test the integration
echo.
echo 🎉 Your GeneInsight platform is now running on free infrastructure!

pause
