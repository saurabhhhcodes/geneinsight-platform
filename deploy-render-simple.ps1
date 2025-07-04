# GeneInsight Platform - FREE Render.com Deployment
Write-Host "GeneInsight Platform - FREE Render.com Deployment" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan

Write-Host "`nWhy Render.com?" -ForegroundColor Yellow
Write-Host "- 100% FREE Forever - No time limits, no credit cards" -ForegroundColor Green
Write-Host "- Unlimited Usage - No sleep mode like Heroku" -ForegroundColor Green
Write-Host "- Automatic HTTPS - SSL certificates included" -ForegroundColor Green
Write-Host "- GitHub Integration - Deploy directly from your repo" -ForegroundColor Green

Write-Host "`nDeployment Steps:" -ForegroundColor Cyan
Write-Host "1. Create Render account" -ForegroundColor White
Write-Host "2. Connect GitHub repository" -ForegroundColor White
Write-Host "3. Deploy with Blueprint" -ForegroundColor White
Write-Host "4. Configure environment variables" -ForegroundColor White

Write-Host "`nStep 1: Create Render Account" -ForegroundColor Yellow
Write-Host "1. Go to: https://render.com" -ForegroundColor Gray
Write-Host "2. Click 'Get Started for Free'" -ForegroundColor Gray
Write-Host "3. Sign up with GitHub (8packcoder)" -ForegroundColor Gray
Write-Host "4. Authorize Render to access repositories" -ForegroundColor Gray

Write-Host "`nStep 2: Deploy with Blueprint" -ForegroundColor Yellow
Write-Host "1. In Render dashboard, click 'New +'" -ForegroundColor Gray
Write-Host "2. Select 'Blueprint'" -ForegroundColor Gray
Write-Host "3. Connect repository: 8packcoder/geneinsight-platform" -ForegroundColor Gray
Write-Host "4. Click 'Connect'" -ForegroundColor Gray
Write-Host "5. Render will read render.yaml and deploy all services!" -ForegroundColor Gray

Write-Host "`nStep 3: Wait for Deployment (10-15 minutes)" -ForegroundColor Yellow
Write-Host "Database: ~2-3 minutes" -ForegroundColor Gray
Write-Host "ML Service: ~3-4 minutes" -ForegroundColor Gray
Write-Host "Backend: ~4-5 minutes" -ForegroundColor Gray
Write-Host "Frontend: ~3-4 minutes" -ForegroundColor Gray

Write-Host "`nStep 4: Configure Environment Variables" -ForegroundColor Yellow
Write-Host "Set these in Backend service environment:" -ForegroundColor Gray
Write-Host "   MAIL_USERNAME=your_email@gmail.com" -ForegroundColor White
Write-Host "   MAIL_PASSWORD=your_gmail_app_password" -ForegroundColor White
Write-Host "   JWT_SECRET=your_very_long_random_secret_key" -ForegroundColor White

Write-Host "`nYour Live URLs (after deployment):" -ForegroundColor Yellow
Write-Host "Main Application: https://geneinsight-frontend.onrender.com" -ForegroundColor Green
Write-Host "Backend API: https://geneinsight-backend.onrender.com" -ForegroundColor White
Write-Host "ML Service: https://geneinsight-ml.onrender.com" -ForegroundColor White

Write-Host "`nFree Tier Benefits:" -ForegroundColor Yellow
Write-Host "- 4 Web Services (512MB RAM each)" -ForegroundColor Green
Write-Host "- 1 PostgreSQL Database (1GB storage)" -ForegroundColor Green
Write-Host "- Unlimited Bandwidth" -ForegroundColor Green
Write-Host "- Automatic HTTPS" -ForegroundColor Green
Write-Host "- No Sleep Mode (always active)" -ForegroundColor Green

Write-Host "`nReady for FREE Deployment!" -ForegroundColor Green
Write-Host "Start deployment: https://render.com" -ForegroundColor Blue
Write-Host "Full guide: RENDER_DEPLOYMENT_GUIDE.md" -ForegroundColor Blue

Write-Host "`nYour bioinformatics platform will be live in 15 minutes!" -ForegroundColor Green
