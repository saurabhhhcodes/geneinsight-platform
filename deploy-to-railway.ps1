# GeneInsight Platform - Complete Railway Deployment
Write-Host "🚂 GeneInsight Platform - Railway Deployment" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

# Check if Railway CLI is installed
try {
    railway --version | Out-Null
    Write-Host "✅ Railway CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

Write-Host "`n📋 Deployment Steps:" -ForegroundColor Cyan
Write-Host "1. Login to Railway" -ForegroundColor White
Write-Host "2. Create new project" -ForegroundColor White
Write-Host "3. Deploy services" -ForegroundColor White
Write-Host "4. Configure environment variables" -ForegroundColor White
Write-Host "5. Test deployment" -ForegroundColor White

Write-Host "`n🔐 Step 1: Login to Railway" -ForegroundColor Yellow
Write-Host "This will open your browser for authentication..." -ForegroundColor Gray
railway login

Write-Host "`n🆕 Step 2: Create New Project" -ForegroundColor Yellow
Write-Host "Creating a new Railway project..." -ForegroundColor Gray
railway new

Write-Host "`n🚀 Step 3: Deploy Services" -ForegroundColor Yellow
Write-Host "Deploying your GeneInsight platform..." -ForegroundColor Gray
railway up

Write-Host "`n⚙️ Step 4: Environment Variables Setup" -ForegroundColor Yellow
Write-Host "You need to set these environment variables in Railway dashboard:" -ForegroundColor Gray
Write-Host ""
Write-Host "🔹 For Backend Service:" -ForegroundColor Cyan
Write-Host "   SPRING_PROFILES_ACTIVE=production" -ForegroundColor White
Write-Host "   MYSQL_ROOT_PASSWORD=your_secure_password_123" -ForegroundColor White
Write-Host "   MYSQL_DATABASE=geneinsight" -ForegroundColor White
Write-Host "   MYSQL_USER=geneinsight_user" -ForegroundColor White
Write-Host "   MYSQL_PASSWORD=your_db_password_123" -ForegroundColor White
Write-Host "   MAIL_USERNAME=your_email@gmail.com" -ForegroundColor White
Write-Host "   MAIL_PASSWORD=your_gmail_app_password" -ForegroundColor White
Write-Host "   JWT_SECRET=your_very_long_random_secret_key_64_chars_minimum" -ForegroundColor White

Write-Host "`n🔹 For Frontend Service:" -ForegroundColor Cyan
Write-Host "   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app" -ForegroundColor White
Write-Host "   NODE_ENV=production" -ForegroundColor White

Write-Host "`n🔹 For ML Service:" -ForegroundColor Cyan
Write-Host "   FLASK_ENV=production" -ForegroundColor White
Write-Host "   FLASK_DEBUG=false" -ForegroundColor White

Write-Host "`n🔹 For Database Service:" -ForegroundColor Cyan
Write-Host "   MYSQL_ROOT_PASSWORD=your_secure_password_123" -ForegroundColor White
Write-Host "   MYSQL_DATABASE=geneinsight" -ForegroundColor White
Write-Host "   MYSQL_USER=geneinsight_user" -ForegroundColor White
Write-Host "   MYSQL_PASSWORD=your_db_password_123" -ForegroundColor White

Write-Host "`n📧 Gmail App Password Setup:" -ForegroundColor Yellow
Write-Host "1. Go to Google Account Settings" -ForegroundColor White
Write-Host "2. Security → 2-Step Verification (enable if not already)" -ForegroundColor White
Write-Host "3. Security → App Passwords" -ForegroundColor White
Write-Host "4. Generate password for 'Mail'" -ForegroundColor White
Write-Host "5. Use this 16-character password in MAIL_PASSWORD" -ForegroundColor White

Write-Host "`n🌐 Step 5: Access Your Deployed App" -ForegroundColor Yellow
Write-Host "After setting environment variables, your app will be available at:" -ForegroundColor Gray
Write-Host "Frontend: https://your-app-name.railway.app" -ForegroundColor Green
Write-Host "Backend API: https://your-backend-name.railway.app" -ForegroundColor Green
Write-Host "ML Service: https://your-ml-name.railway.app" -ForegroundColor Green

Write-Host "`n🧪 Step 6: Test Your Deployment" -ForegroundColor Yellow
Write-Host "Test these features:" -ForegroundColor Gray
Write-Host "✓ User registration with OTP email" -ForegroundColor White
Write-Host "✓ DNA file upload and analysis" -ForegroundColor White
Write-Host "✓ 3D structure generation" -ForegroundColor White
Write-Host "✓ Report generation and export" -ForegroundColor White
Write-Host "✓ Authentication system" -ForegroundColor White

Write-Host "`n💡 Pro Tips:" -ForegroundColor Yellow
Write-Host "• Railway automatically provides HTTPS certificates" -ForegroundColor White
Write-Host "• Use Railway dashboard to monitor logs and metrics" -ForegroundColor White
Write-Host "• Set up custom domain in Railway settings if needed" -ForegroundColor White
Write-Host "• Railway scales automatically based on usage" -ForegroundColor White

Write-Host "`n🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "Your GeneInsight Platform is now live on the web!" -ForegroundColor Cyan
Write-Host "Visit Railway dashboard to manage your deployment: https://railway.app/dashboard" -ForegroundColor Blue
