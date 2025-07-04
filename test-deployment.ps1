# GeneInsight Platform - Deployment Test Script
param(
    [Parameter(Mandatory=$false)]
    [string]$BaseUrl = "http://localhost",
    
    [Parameter(Mandatory=$false)]
    [int]$FrontendPort = 3000,
    
    [Parameter(Mandatory=$false)]
    [int]$BackendPort = 8080,
    
    [Parameter(Mandatory=$false)]
    [int]$MLPort = 5000,
    
    [Parameter(Mandatory=$false)]
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Continue"

Write-Host "🧪 GeneInsight Platform - Deployment Test" -ForegroundColor Green
Write-Host "Testing deployment at: $BaseUrl" -ForegroundColor Yellow

$frontendUrl = "$BaseUrl`:$FrontendPort"
$backendUrl = "$BaseUrl`:$BackendPort"
$mlUrl = "$BaseUrl`:$MLPort"

$testResults = @()

# Test function
function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Name,
        [int]$ExpectedStatus = 200,
        [int]$TimeoutSeconds = 30
    )
    
    try {
        if ($Verbose) {
            Write-Host "Testing $Name at $Url..." -ForegroundColor Cyan
        }
        
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec $TimeoutSeconds -UseBasicParsing
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "✅ $Name - OK ($($response.StatusCode))" -ForegroundColor Green
            return @{
                Name = $Name
                Url = $Url
                Status = "PASS"
                StatusCode = $response.StatusCode
                ResponseTime = "< $TimeoutSeconds s"
            }
        } else {
            Write-Host "⚠️  $Name - Unexpected status ($($response.StatusCode))" -ForegroundColor Yellow
            return @{
                Name = $Name
                Url = $Url
                Status = "WARN"
                StatusCode = $response.StatusCode
                ResponseTime = "< $TimeoutSeconds s"
            }
        }
    } catch {
        Write-Host "❌ $Name - FAILED ($($_.Exception.Message))" -ForegroundColor Red
        return @{
            Name = $Name
            Url = $Url
            Status = "FAIL"
            StatusCode = "N/A"
            Error = $_.Exception.Message
        }
    }
}

# Test JSON endpoint
function Test-JsonEndpoint {
    param(
        [string]$Url,
        [string]$Name,
        [string]$ExpectedField = $null
    )
    
    try {
        if ($Verbose) {
            Write-Host "Testing $Name JSON at $Url..." -ForegroundColor Cyan
        }
        
        $response = Invoke-RestMethod -Uri $Url -TimeoutSec 30
        
        if ($ExpectedField -and $response.$ExpectedField) {
            Write-Host "✅ $Name - JSON OK (has $ExpectedField)" -ForegroundColor Green
            return @{
                Name = $Name
                Url = $Url
                Status = "PASS"
                Data = $response.$ExpectedField
            }
        } elseif (-not $ExpectedField) {
            Write-Host "✅ $Name - JSON OK" -ForegroundColor Green
            return @{
                Name = $Name
                Url = $Url
                Status = "PASS"
                Data = "JSON response received"
            }
        } else {
            Write-Host "⚠️  $Name - JSON missing field: $ExpectedField" -ForegroundColor Yellow
            return @{
                Name = $Name
                Url = $Url
                Status = "WARN"
                Data = "Missing expected field"
            }
        }
    } catch {
        Write-Host "❌ $Name - JSON FAILED ($($_.Exception.Message))" -ForegroundColor Red
        return @{
            Name = $Name
            Url = $Url
            Status = "FAIL"
            Error = $_.Exception.Message
        }
    }
}

Write-Host "`n🔍 Testing Core Services..." -ForegroundColor Cyan

# Test Frontend
$testResults += Test-Endpoint -Url $frontendUrl -Name "Frontend Application"

# Test Backend Health
$testResults += Test-JsonEndpoint -Url "$backendUrl/actuator/health" -Name "Backend Health Check" -ExpectedField "status"

# Test ML Service Health
$testResults += Test-JsonEndpoint -Url "$mlUrl/health" -Name "ML Service Health Check" -ExpectedField "status"

# Test ML Service Metrics
$testResults += Test-JsonEndpoint -Url "$mlUrl/metrics" -Name "ML Service Metrics" -ExpectedField "accuracy"

Write-Host "`n🔍 Testing API Endpoints..." -ForegroundColor Cyan

# Test Backend API endpoints
$apiEndpoints = @(
    @{ Path = "/api/auth/register"; Name = "Registration Endpoint"; Method = "POST" },
    @{ Path = "/api/auth/login"; Name = "Login Endpoint"; Method = "POST" },
    @{ Path = "/api/analysis/upload"; Name = "File Upload Endpoint"; Method = "POST" },
    @{ Path = "/swagger-ui.html"; Name = "API Documentation"; Method = "GET" }
)

foreach ($endpoint in $apiEndpoints) {
    if ($endpoint.Method -eq "GET") {
        $testResults += Test-Endpoint -Url "$backendUrl$($endpoint.Path)" -Name $endpoint.Name
    } else {
        # For POST endpoints, just check if they're reachable (will return 400/405 but that's expected)
        $testResults += Test-Endpoint -Url "$backendUrl$($endpoint.Path)" -Name $endpoint.Name -ExpectedStatus 405
    }
}

Write-Host "`n📊 Test Summary:" -ForegroundColor Cyan

$passCount = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$warnCount = ($testResults | Where-Object { $_.Status -eq "WARN" }).Count
$failCount = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$totalCount = $testResults.Count

Write-Host "Total Tests: $totalCount" -ForegroundColor White
Write-Host "✅ Passed: $passCount" -ForegroundColor Green
Write-Host "⚠️  Warnings: $warnCount" -ForegroundColor Yellow
Write-Host "❌ Failed: $failCount" -ForegroundColor Red

# Detailed results
if ($Verbose) {
    Write-Host "`n📋 Detailed Results:" -ForegroundColor Cyan
    $testResults | ForEach-Object {
        Write-Host "- $($_.Name): $($_.Status)" -ForegroundColor White
        if ($_.Error) {
            Write-Host "  Error: $($_.Error)" -ForegroundColor Red
        }
        if ($_.Data) {
            Write-Host "  Data: $($_.Data)" -ForegroundColor Gray
        }
    }
}

# Overall status
Write-Host "`n🎯 Overall Status:" -ForegroundColor Cyan
if ($failCount -eq 0 -and $warnCount -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED - Deployment is healthy!" -ForegroundColor Green
    exit 0
} elseif ($failCount -eq 0) {
    Write-Host "⚠️  DEPLOYMENT OK with warnings - Check warnings above" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "❌ DEPLOYMENT HAS ISSUES - Check failed tests above" -ForegroundColor Red
    exit 1
}

Write-Host "`n💡 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Fix any failed tests" -ForegroundColor White
Write-Host "2. Test user registration and login" -ForegroundColor White
Write-Host "3. Upload sample DNA files" -ForegroundColor White
Write-Host "4. Test 3D structure generation" -ForegroundColor White
Write-Host "5. Verify email OTP functionality" -ForegroundColor White
