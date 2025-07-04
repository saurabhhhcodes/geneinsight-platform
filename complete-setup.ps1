# Complete GeneInsight Platform Setup Script
# Run this after installing Node.js, Python, and Java

param(
    [switch]$SkipInstallCheck,
    [switch]$InstallOnly,
    [switch]$StartOnly
)

Write-Host "=== GeneInsight Platform Complete Setup ===" -ForegroundColor Green

if (-not $StartOnly) {
    Write-Host "`n=== Step 1: Checking Tool Installations ===" -ForegroundColor Yellow
    
    $toolsInstalled = $true
    
    # Check Node.js
    try {
        $nodeVersion = node --version 2>$null
        Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
        $npmVersion = npm --version 2>$null
        Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Node.js not found. Please install nodejs-installer.msi first." -ForegroundColor Red
        $toolsInstalled = $false
    }
    
    # Check Python
    try {
        $pythonVersion = python --version 2>$null
        Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
        $pipVersion = pip --version 2>$null
        Write-Host "✅ pip: $pipVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Python not found. Please install python-installer.exe first." -ForegroundColor Red
        $toolsInstalled = $false
    }
    
    # Check Java
    try {
        $javaVersion = java -version 2>&1 | Select-Object -First 1
        Write-Host "✅ Java: $javaVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Java not found. Please install Java 17+ first." -ForegroundColor Red
        $toolsInstalled = $false
    }
    
    if (-not $toolsInstalled -and -not $SkipInstallCheck) {
        Write-Host "`n❌ Some tools are missing. Please install them first:" -ForegroundColor Red
        Write-Host "1. Right-click nodejs-installer.msi → Run as administrator" -ForegroundColor Yellow
        Write-Host "2. Right-click python-installer.exe → Run as administrator" -ForegroundColor Yellow
        Write-Host "3. Download and install Java from https://adoptium.net/" -ForegroundColor Yellow
        Write-Host "`nThen run this script again." -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "`n=== Step 2: Setting up Maven ===" -ForegroundColor Yellow
    $mavenPath = "$PWD\apache-maven-3.9.6\bin"
    $env:PATH = "$mavenPath;$env:PATH"
    Write-Host "✅ Maven configured" -ForegroundColor Green
    
    Write-Host "`n=== Step 3: Installing Dependencies ===" -ForegroundColor Yellow
    
    # Install Node.js dependencies
    Write-Host "Installing Node.js dependencies..." -ForegroundColor Cyan
    try {
        npm install --silent
        Write-Host "✅ Node.js dependencies installed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Node.js dependencies" -ForegroundColor Red
        Write-Host "Trying to fix..." -ForegroundColor Yellow
        npm cache clean --force
        npm install
    }
    
    # Install Python dependencies
    Write-Host "Installing Python dependencies for ML service..." -ForegroundColor Cyan
    try {
        Set-Location ml_service
        pip install -r requirements.txt --quiet
        Set-Location ..
        Write-Host "✅ Python dependencies installed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Python dependencies" -ForegroundColor Red
        Set-Location ..
    }
}

if ($InstallOnly) {
    Write-Host "`n✅ Installation complete! Run with -StartOnly to start services." -ForegroundColor Green
    exit 0
}

Write-Host "`n=== Step 4: Starting Services ===" -ForegroundColor Yellow

# Create logs directory if it doesn't exist
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
}

Write-Host "Starting services in order..." -ForegroundColor Cyan

# Start ML Service
Write-Host "1. Starting ML Service on port 5000..." -ForegroundColor Yellow
$mlJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location ml_service
    python app.py
}
Start-Sleep -Seconds 3

# Start Backend
Write-Host "2. Starting Backend on port 8080..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    $env:PATH = "$using:PWD\apache-maven-3.9.6\bin;$env:PATH"
    mvn spring-boot:run -q
}
Start-Sleep -Seconds 10

# Test if services are running
Write-Host "`n=== Step 5: Verifying Services ===" -ForegroundColor Yellow

# Test ML Service
try {
    $mlTest = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ ML Service is running" -ForegroundColor Green
} catch {
    Write-Host "⚠️  ML Service may still be starting..." -ForegroundColor Yellow
}

# Test Backend
try {
    $backendTest = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend may still be starting..." -ForegroundColor Yellow
}

Write-Host "`n=== Step 6: Starting Frontend ===" -ForegroundColor Yellow
Write-Host "Starting Frontend on port 3000..." -ForegroundColor Cyan
Write-Host "The frontend will start in this window. Press Ctrl+C to stop all services." -ForegroundColor Yellow

# Start Frontend (in foreground)
try {
    npm run dev
} finally {
    Write-Host "`n=== Stopping Background Services ===" -ForegroundColor Yellow
    if ($mlJob) { Stop-Job $mlJob; Remove-Job $mlJob }
    if ($backendJob) { Stop-Job $backendJob; Remove-Job $backendJob }
    Write-Host "All services stopped." -ForegroundColor Green
}

Write-Host "`n=== GeneInsight Platform URLs ===" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:8080" -ForegroundColor White
Write-Host "ML Service: http://localhost:5000" -ForegroundColor White
Write-Host "H2 Database Console: http://localhost:8080/h2-console" -ForegroundColor White
Write-Host "API Documentation: http://localhost:8080/swagger-ui.html" -ForegroundColor White
