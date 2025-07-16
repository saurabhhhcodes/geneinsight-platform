@echo off
echo 🔑 GeneInsight Platform - Apillon Credentials Setup
echo ================================================

echo.
echo 📋 Please follow these steps:
echo.
echo 1. Go to: https://app.apillon.io
echo 2. Navigate to Dashboard → API Keys
echo 3. Create new API key (if you haven't already)
echo 4. Copy your API Key and API Secret
echo.

echo 🔐 Enter your Apillon API credentials:
echo.
set /p APILLON_API_KEY="Enter your API Key: "
set /p APILLON_API_SECRET="Enter your API Secret: "

echo.
echo ✅ Setting environment variables...
setx APILLON_API_KEY "%APILLON_API_KEY%"
setx APILLON_API_SECRET "%APILLON_API_SECRET%"

echo.
echo 🧪 Testing connection...
apillon hosting list-websites --key "%APILLON_API_KEY%" --secret "%APILLON_API_SECRET%"

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Apillon credentials are working!
    echo.
    echo 🚀 Ready to deploy! Run:
    echo    deploy-frontend-to-apillon.cmd
) else (
    echo.
    echo ❌ Connection failed. Please check your credentials.
    echo.
    echo 🔍 Troubleshooting:
    echo 1. Verify API key and secret are correct
    echo 2. Check if API key has proper permissions
    echo 3. Try creating a new API key
)

echo.
pause
