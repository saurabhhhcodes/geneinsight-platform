# GeneInsight Platform - Simple Railway Deployment
Write-Host "Building GeneInsight Platform for Railway..." -ForegroundColor Green

# Check Docker
try {
    docker --version | Out-Null
    Write-Host "Docker is available" -ForegroundColor Green
} catch {
    Write-Host "Docker is not installed" -ForegroundColor Red
    exit 1
}

# Build images
Write-Host "Building Backend..." -ForegroundColor Yellow
docker build -t geneinsight-backend:latest -f Dockerfile .

Write-Host "Building Frontend..." -ForegroundColor Yellow  
docker build -t geneinsight-frontend:latest -f frontend.Dockerfile .

Write-Host "Building ML Service..." -ForegroundColor Yellow
docker build -t geneinsight-ml:latest -f ml_service/Dockerfile ./ml_service

Write-Host "All images built successfully!" -ForegroundColor Green
Write-Host "Ready for Railway deployment!" -ForegroundColor Cyan
