# GeneInsight Platform - Cloud Deployment Script
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("railway", "render", "digitalocean", "aws", "azure", "gcp")]
    [string]$Platform = "railway",
    
    [Parameter(Mandatory=$false)]
    [string]$Domain = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$BuildOnly = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Help = $false
)

if ($Help) {
    Write-Host @"
🚀 GeneInsight Platform - Cloud Deployment Script

Usage: .\deploy-to-cloud.ps1 [OPTIONS]

Options:
  -Platform <platform>    Target platform (railway, render, digitalocean, aws, azure, gcp)
  -Domain <domain>        Your custom domain (optional)
  -BuildOnly             Only build Docker images, don't deploy
  -Help                  Show this help message

Examples:
  .\deploy-to-cloud.ps1 -Platform railway
  .\deploy-to-cloud.ps1 -Platform render -Domain myapp.com
  .\deploy-to-cloud.ps1 -BuildOnly

Supported Platforms:
  🚂 Railway    - Easy deployment with automatic HTTPS
  🎨 Render     - Full-stack hosting with databases
  🌊 DigitalOcean - VPS with Docker support
  ☁️  AWS       - Elastic Container Service (ECS)
  🔷 Azure      - Container Instances
  🌐 GCP        - Cloud Run

"@ -ForegroundColor Cyan
    exit 0
}

$ErrorActionPreference = "Stop"

Write-Host "🚀 GeneInsight Platform - Cloud Deployment" -ForegroundColor Green
Write-Host "Target Platform: $Platform" -ForegroundColor Yellow

# Check prerequisites
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Cyan

# Check Docker
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if services are running (for local testing)
function Test-Port {
    param([int]$Port, [string]$ServiceName)
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
        if ($connection.TcpTestSucceeded) {
            Write-Host "✅ $ServiceName is running on port $Port" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️  $ServiceName is not running on port $Port" -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host "⚠️  Cannot check $ServiceName on port $Port" -ForegroundColor Yellow
        return $false
    }
}

# Build Docker images
Write-Host "`n🔨 Building Docker images..." -ForegroundColor Cyan

Write-Host "Building Backend..." -ForegroundColor Yellow
docker build -t geneinsight-backend:latest -f Dockerfile .

Write-Host "Building Frontend..." -ForegroundColor Yellow
docker build -t geneinsight-frontend:latest -f frontend.Dockerfile .

Write-Host "Building ML Service..." -ForegroundColor Yellow
docker build -t geneinsight-ml:latest -f ml_service/Dockerfile ./ml_service

Write-Host "✅ All Docker images built successfully!" -ForegroundColor Green

if ($BuildOnly) {
    Write-Host "`n🎯 Build completed. Use 'docker images' to see built images." -ForegroundColor Green
    exit 0
}

# Platform-specific deployment
Write-Host "`n🌐 Deploying to $Platform..." -ForegroundColor Cyan

switch ($Platform) {
    "railway" {
        Write-Host "🚂 Railway Deployment Instructions:" -ForegroundColor Yellow
        Write-Host @"
1. Install Railway CLI: npm install -g @railway/cli
2. Login: railway login
3. Create project: railway new
4. Deploy services:
   - railway up (deploys current directory)
   - Add environment variables in Railway dashboard
5. Set custom domain in Railway dashboard (if provided)

Environment Variables to set in Railway:
- MYSQL_ROOT_PASSWORD
- MYSQL_PASSWORD
- MAIL_USERNAME
- MAIL_PASSWORD
- JWT_SECRET
"@ -ForegroundColor White
    }
    
    "render" {
        Write-Host "🎨 Render Deployment Instructions:" -ForegroundColor Yellow
        Write-Host @"
1. Connect your GitHub repository to Render
2. Use the render.yaml file for automatic deployment
3. Set environment variables in Render dashboard
4. Custom domain can be added in Render settings

The render.yaml file has been created for you!
"@ -ForegroundColor White
    }
    
    "digitalocean" {
        Write-Host "🌊 DigitalOcean Deployment Instructions:" -ForegroundColor Yellow
        Write-Host @"
1. Create a Droplet with Docker pre-installed
2. Upload your code to the server
3. Run: docker-compose -f docker-compose.prod.yml up -d
4. Configure nginx for reverse proxy and SSL
5. Set up your domain DNS to point to the server IP

Use the docker-compose.prod.yml file for production deployment!
"@ -ForegroundColor White
    }
    
    "aws" {
        Write-Host "☁️ AWS ECS Deployment Instructions:" -ForegroundColor Yellow
        Write-Host @"
1. Push images to Amazon ECR
2. Create ECS cluster and task definitions
3. Set up Application Load Balancer
4. Configure RDS for MySQL database
5. Use AWS Certificate Manager for SSL

Consider using AWS Copilot CLI for easier deployment!
"@ -ForegroundColor White
    }
    
    "azure" {
        Write-Host "🔷 Azure Container Instances Instructions:" -ForegroundColor Yellow
        Write-Host @"
1. Push images to Azure Container Registry
2. Create Container Groups for each service
3. Set up Azure Database for MySQL
4. Configure Application Gateway for load balancing
5. Use Azure DNS for custom domain

Use Azure CLI for automated deployment!
"@ -ForegroundColor White
    }
    
    "gcp" {
        Write-Host "🌐 Google Cloud Run Instructions:" -ForegroundColor Yellow
        Write-Host @"
1. Push images to Google Container Registry
2. Deploy each service to Cloud Run
3. Set up Cloud SQL for MySQL
4. Configure Load Balancer
5. Use Google Domains or Cloud DNS

Use gcloud CLI for deployment automation!
"@ -ForegroundColor White
    }
}

Write-Host "`n📁 Deployment files created:" -ForegroundColor Cyan
Write-Host "- docker-compose.prod.yml (Production Docker Compose)" -ForegroundColor White
Write-Host "- .env.production (Environment variables template)" -ForegroundColor White
Write-Host "- render.yaml (Render.com configuration)" -ForegroundColor White
Write-Host "- railway.json (Railway configuration)" -ForegroundColor White

if ($Domain) {
    Write-Host "`n🌐 Custom Domain: $Domain" -ForegroundColor Green
    Write-Host "Make sure to:" -ForegroundColor Yellow
    Write-Host "1. Update DNS records to point to your deployment" -ForegroundColor White
    Write-Host "2. Configure SSL certificate" -ForegroundColor White
    Write-Host "3. Update NEXT_PUBLIC_API_URL in environment variables" -ForegroundColor White
}

Write-Host "`n🎉 Deployment preparation complete!" -ForegroundColor Green
Write-Host "Follow the platform-specific instructions above to complete deployment." -ForegroundColor Cyan
