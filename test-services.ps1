# Test Services Script
# Run this to verify each service is working

Write-Host "=== Testing GeneInsight Services ===" -ForegroundColor Green

# Test ML Service
Write-Host "`nTesting ML Service (http://localhost:5000)..." -ForegroundColor Yellow
try {
    $mlResponse = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET -TimeoutSec 5
    Write-Host "✅ ML Service is running" -ForegroundColor Green
} catch {
    Write-Host "❌ ML Service not responding. Make sure it's started." -ForegroundColor Red
}

# Test Backend API
Write-Host "`nTesting Backend API (http://localhost:8080)..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend API is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend API not responding. Make sure it's started." -ForegroundColor Red
}

# Test Frontend
Write-Host "`nTesting Frontend (http://localhost:3000)..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend is running" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend not responding. Make sure it's started." -ForegroundColor Red
}

Write-Host "`n=== Service URLs ===" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:8080" -ForegroundColor White
Write-Host "ML Service: http://localhost:5000" -ForegroundColor White
Write-Host "H2 Database Console: http://localhost:8080/h2-console" -ForegroundColor White
Write-Host "API Documentation: http://localhost:8080/swagger-ui.html" -ForegroundColor White
