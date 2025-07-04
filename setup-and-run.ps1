# GeneInsight Platform Setup and Run Script
# Run this script after installing Node.js, Python, and Java

Write-Host "=== GeneInsight Platform Setup ===" -ForegroundColor Green

# Check if tools are installed
Write-Host "Checking installed tools..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

try {
    $pythonVersion = python --version
    Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python first." -ForegroundColor Red
    exit 1
}

try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "✅ Java: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java not found. Please install Java first." -ForegroundColor Red
    exit 1
}

# Set up Maven
$mavenPath = "$PWD\apache-maven-3.9.6\bin"
$env:PATH = "$mavenPath;$env:PATH"

Write-Host "`n=== Installing Dependencies ===" -ForegroundColor Green

# Install Node.js dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
npm install

# Install Python dependencies for ML service
Write-Host "Installing Python dependencies for ML service..." -ForegroundColor Yellow
Set-Location ml_service
pip install -r requirements.txt
Set-Location ..

Write-Host "`n=== Starting Services ===" -ForegroundColor Green

# Start ML Service in background
Write-Host "Starting ML Service on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd '$PWD\ml_service'; python app.py" -WindowStyle Minimized

# Wait a moment for ML service to start
Start-Sleep -Seconds 3

# Start Backend in background
Write-Host "Starting Backend on port 8080..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; .\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run" -WindowStyle Minimized

# Wait a moment for backend to start
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Starting Frontend on port 3000..." -ForegroundColor Yellow
Write-Host "Frontend will open in this window. Press Ctrl+C to stop all services." -ForegroundColor Cyan
npm run dev

Write-Host "`n=== Services Started ===" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:8080" -ForegroundColor Cyan
Write-Host "ML Service: http://localhost:5000" -ForegroundColor Cyan
Write-Host "H2 Database Console: http://localhost:8080/h2-console" -ForegroundColor Cyan
