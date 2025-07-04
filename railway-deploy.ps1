# GeneInsight Platform - Railway Deployment Script
param(
    [Parameter(Mandatory=$false)]
    [switch]$BuildOnly = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Help = $false
)

if ($Help) {
    Write-Host @"
🚂 GeneInsight Platform - Railway Deployment

Usage: .\railway-deploy.ps1 [OPTIONS]

Options:
  -BuildOnly    Only build Docker images, don't deploy
  -Help         Show this help message

Steps:
1. Build Docker images
2. Install Railway CLI
3. Deploy to Railway
4. Configure environment variables

"@ -ForegroundColor Cyan
    exit 0
}

$ErrorActionPreference = "Stop"

Write-Host "🚂 GeneInsight Platform - Railway Deployment" -ForegroundColor Green

# Check Docker
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Cyan
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

# Build Docker images
Write-Host "`n🔨 Building Docker images..." -ForegroundColor Cyan

Write-Host "Building Backend..." -ForegroundColor Yellow
try {
    docker build -t geneinsight-backend:latest -f Dockerfile .
    Write-Host "✅ Backend image built" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to build backend image" -ForegroundColor Red
    exit 1
}

Write-Host "Building Frontend..." -ForegroundColor Yellow
try {
    docker build -t geneinsight-frontend:latest -f frontend.Dockerfile .
    Write-Host "✅ Frontend image built" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to build frontend image" -ForegroundColor Red
    exit 1
}

Write-Host "Building ML Service..." -ForegroundColor Yellow
try {
    docker build -t geneinsight-ml:latest -f ml_service/Dockerfile ./ml_service
    Write-Host "✅ ML Service image built" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to build ML service image" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ All Docker images built successfully!" -ForegroundColor Green

if ($BuildOnly) {
    Write-Host "`n🎯 Build completed. Images ready for deployment!" -ForegroundColor Green
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Install Railway CLI: npm install -g @railway/cli" -ForegroundColor White
    Write-Host "2. Login: railway login" -ForegroundColor White
    Write-Host "3. Create project: railway new" -ForegroundColor White
    Write-Host "4. Deploy: railway up" -ForegroundColor White
    exit 0
}

# Check Node.js for Railway CLI
Write-Host "`n📦 Checking Node.js for Railway CLI..." -ForegroundColor Cyan
try {
    node --version | Out-Null
    npm --version | Out-Null
    Write-Host "✅ Node.js and npm are installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Installing Railway CLI requires Node.js." -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Install Railway CLI
Write-Host "`n🚂 Installing Railway CLI..." -ForegroundColor Cyan
try {
    npm install -g @railway/cli
    Write-Host "✅ Railway CLI installed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Railway CLI installation failed. You can install it manually:" -ForegroundColor Yellow
    Write-Host "npm install -g @railway/cli" -ForegroundColor White
}

Write-Host "`n🎉 Ready for Railway deployment!" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Login to Railway:" -ForegroundColor White
Write-Host "   railway login" -ForegroundColor Gray
Write-Host "`n2. Create new project:" -ForegroundColor White
Write-Host "   railway new" -ForegroundColor Gray
Write-Host "`n3. Deploy your application:" -ForegroundColor White
Write-Host "   railway up" -ForegroundColor Gray
Write-Host "`n4. Set environment variables in Railway dashboard:" -ForegroundColor White
Write-Host "   - MYSQL_ROOT_PASSWORD=your_secure_password" -ForegroundColor Gray
Write-Host "   - MYSQL_PASSWORD=your_db_password" -ForegroundColor Gray
Write-Host "   - MAIL_USERNAME=your_email@gmail.com" -ForegroundColor Gray
Write-Host "   - MAIL_PASSWORD=your_app_password" -ForegroundColor Gray
Write-Host "   - JWT_SECRET=your_very_long_random_secret" -ForegroundColor Gray

Write-Host "`n🌐 After deployment, your app will be available at:" -ForegroundColor Cyan
Write-Host "https://your-app-name.railway.app" -ForegroundColor Green

Write-Host "`n💡 Pro tip: Railway will automatically:" -ForegroundColor Yellow
Write-Host "- Provide HTTPS certificates" -ForegroundColor White
Write-Host "- Handle load balancing" -ForegroundColor White
Write-Host "- Scale your services" -ForegroundColor White
Write-Host "- Provide monitoring dashboards" -ForegroundColor White
