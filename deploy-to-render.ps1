# GeneInsight Platform - FREE Render.com Deployment Script
Write-Host "🚀 GeneInsight Platform - FREE Render.com Deployment" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Cyan

Write-Host "`n🎯 Why Render.com?" -ForegroundColor Yellow
Write-Host "✅ 100% FREE Forever - No time limits, no credit cards" -ForegroundColor Green
Write-Host "✅ Unlimited Usage - No sleep mode like Heroku" -ForegroundColor Green
Write-Host "✅ Automatic HTTPS - SSL certificates included" -ForegroundColor Green
Write-Host "✅ GitHub Integration - Deploy directly from your repo" -ForegroundColor Green
Write-Host "✅ Multi-Service Support - Perfect for your architecture" -ForegroundColor Green
Write-Host "✅ Free Database - PostgreSQL included" -ForegroundColor Green

Write-Host "`n📋 Deployment Steps:" -ForegroundColor Cyan
Write-Host "1. Create Render account" -ForegroundColor White
Write-Host "2. Connect GitHub repository" -ForegroundColor White
Write-Host "3. Deploy with Blueprint" -ForegroundColor White
Write-Host "4. Configure environment variables" -ForegroundColor White
Write-Host "5. Test your live application" -ForegroundColor White

Write-Host "`n🔗 Step 1: Create Render Account" -ForegroundColor Yellow
Write-Host "1. Go to: https://render.com" -ForegroundColor Gray
Write-Host "2. Click 'Get Started for Free'" -ForegroundColor Gray
Write-Host "3. Sign up with GitHub (8packcoder)" -ForegroundColor Gray
Write-Host "4. Authorize Render to access repositories" -ForegroundColor Gray

Write-Host "`n🚀 Step 2: Deploy with Blueprint" -ForegroundColor Yellow
Write-Host "1. In Render dashboard, click 'New +'" -ForegroundColor Gray
Write-Host "2. Select 'Blueprint'" -ForegroundColor Gray
Write-Host "3. Connect repository: 8packcoder/geneinsight-platform" -ForegroundColor Gray
Write-Host "4. Click 'Connect'" -ForegroundColor Gray
Write-Host "5. Render will read render.yaml and deploy all services!" -ForegroundColor Gray

Write-Host "`n⏱️ Step 3: Wait for Deployment (10-15 minutes)" -ForegroundColor Yellow
Write-Host "🗄️  Database: ~2-3 minutes" -ForegroundColor Gray
Write-Host "🤖 ML Service: ~3-4 minutes" -ForegroundColor Gray
Write-Host "⚙️  Backend: ~4-5 minutes" -ForegroundColor Gray
Write-Host "🌐 Frontend: ~3-4 minutes" -ForegroundColor Gray

Write-Host "`n⚙️ Step 4: Configure Environment Variables" -ForegroundColor Yellow
Write-Host "Set these in Backend service environment:" -ForegroundColor Gray
Write-Host "   MAIL_USERNAME=your_email@gmail.com" -ForegroundColor White
Write-Host "   MAIL_PASSWORD=your_gmail_app_password" -ForegroundColor White
Write-Host "   JWT_SECRET=your_very_long_random_secret_key" -ForegroundColor White

Write-Host "`n📧 Gmail App Password Setup:" -ForegroundColor Cyan
Write-Host "1. Enable 2-Factor Authentication on Gmail" -ForegroundColor White
Write-Host "2. Go to Google Account Settings" -ForegroundColor White
Write-Host "3. Security → App Passwords" -ForegroundColor White
Write-Host "4. Generate password for 'Mail'" -ForegroundColor White
Write-Host "5. Use this 16-character password in MAIL_PASSWORD" -ForegroundColor White

Write-Host "`n🌍 Step 5: Your Live URLs" -ForegroundColor Yellow
Write-Host "After deployment, your app will be available at:" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 Main Application:" -ForegroundColor Cyan
Write-Host "   https://geneinsight-frontend.onrender.com" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 API Endpoints:" -ForegroundColor Cyan
Write-Host "   Backend API:    https://geneinsight-backend.onrender.com" -ForegroundColor White
Write-Host "   ML Service:     https://geneinsight-ml.onrender.com" -ForegroundColor White
Write-Host "   Health Check:   https://geneinsight-backend.onrender.com/actuator/health" -ForegroundColor White
Write-Host "   API Docs:       https://geneinsight-backend.onrender.com/swagger-ui.html" -ForegroundColor White

Write-Host "`n🧪 Step 6: Test Your Deployment" -ForegroundColor Yellow
Write-Host "Test these features:" -ForegroundColor Gray
Write-Host "✓ User registration with OTP email" -ForegroundColor White
Write-Host "✓ DNA file upload and analysis" -ForegroundColor White
Write-Host "✓ 3D structure generation" -ForegroundColor White
Write-Host "✓ Report generation and export" -ForegroundColor White
Write-Host "✓ Authentication system" -ForegroundColor White

Write-Host "`n📊 Free Tier Benefits:" -ForegroundColor Yellow
Write-Host "✅ 4 Web Services (512MB RAM each)" -ForegroundColor Green
Write-Host "✅ 1 PostgreSQL Database (1GB storage)" -ForegroundColor Green
Write-Host "✅ Unlimited Bandwidth" -ForegroundColor Green
Write-Host "✅ Automatic HTTPS" -ForegroundColor Green
Write-Host "✅ Custom Domains (optional)" -ForegroundColor Green
Write-Host "✅ No Sleep Mode (always active)" -ForegroundColor Green

Write-Host "`n💡 Pro Tips:" -ForegroundColor Yellow
Write-Host "• Render automatically configures service connections" -ForegroundColor White
Write-Host "• Use Render dashboard to monitor logs and metrics" -ForegroundColor White
Write-Host "• Set up custom domain in service settings if needed" -ForegroundColor White
Write-Host "• All services stay active 24/7 (no sleep mode)" -ForegroundColor White

Write-Host "`n📚 Documentation:" -ForegroundColor Yellow
Write-Host "• Complete guide: RENDER_DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host "• Render docs: https://render.com/docs" -ForegroundColor White
Write-Host "• Your repository: https://github.com/8packcoder/geneinsight-platform" -ForegroundColor White

Write-Host "`n🎉 Ready for FREE Deployment!" -ForegroundColor Green
Write-Host "Your GeneInsight Platform is configured for unlimited free hosting!" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 Start deployment: https://render.com" -ForegroundColor Blue
Write-Host "📖 Full guide: RENDER_DEPLOYMENT_GUIDE.md" -ForegroundColor Blue
Write-Host ""
Write-Host "🧬✨ Your bioinformatics platform will be live in 15 minutes! ✨🧬" -ForegroundColor Green
