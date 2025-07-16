@echo off
echo 🌐 GeneInsight Platform - Apillon Frontend Deployment
echo ===================================================

echo.
echo 📋 This will deploy the frontend to Apillon Web3 hosting
echo    Backend will be deployed separately to Render/Railway
echo.

REM Check if credentials are set
if "%APILLON_API_KEY%"=="" (
    echo ❌ APILLON_API_KEY not set!
    echo Please run: set APILLON_API_KEY=your_key
    pause
    exit /b 1
)

if "%APILLON_API_SECRET%"=="" (
    echo ❌ APILLON_API_SECRET not set!
    echo Please run: set APILLON_API_SECRET=your_secret
    pause
    exit /b 1
)

echo ✅ API credentials found
echo.

echo 🔨 Building frontend...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)

echo ✅ Frontend built successfully!
echo.

echo 🚀 Deploying to Apillon...
apillon hosting deploy-website .next --key "%APILLON_API_KEY%" --secret "%APILLON_API_SECRET%"

if %errorlevel% equ 0 (
    echo.
    echo ✅ FRONTEND DEPLOYMENT SUCCESSFUL!
    echo.
    echo 🌐 Your frontend is now live on Apillon Web3 hosting!
    echo.
    echo 📋 Next Steps:
    echo 1. Deploy backend to Render.com for full LangChain AI
    echo 2. Update API URLs to connect frontend to backend
    echo 3. Test the complete platform
    echo.
    echo 🔗 Backend Deployment Options:
    echo    • Render.com: Free tier with Python + LangChain
    echo    • Railway: $5/month with full AI functionality
    echo.
) else (
    echo ❌ Deployment failed!
    echo.
    echo 🔍 Troubleshooting:
    echo 1. Check your API credentials
    echo 2. Verify build output exists in .next folder
    echo 3. Check Apillon dashboard for detailed errors
)

echo.
pause
