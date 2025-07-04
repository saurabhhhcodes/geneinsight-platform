# Quick Installation Checker
# Run this to verify if all tools are installed correctly

Write-Host "=== Checking Development Tool Installations ===" -ForegroundColor Green

$allInstalled = $true

# Check Node.js
Write-Host "`nChecking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    $npmVersion = npm --version 2>$null
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
    Write-Host "   → Install: Right-click nodejs-installer.msi → Run as administrator" -ForegroundColor Yellow
    $allInstalled = $false
}

# Check Python
Write-Host "`nChecking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>$null
    $pipVersion = pip --version 2>$null
    Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
    Write-Host "✅ pip: $pipVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found" -ForegroundColor Red
    Write-Host "   → Install: Right-click python-installer.exe → Run as administrator" -ForegroundColor Yellow
    Write-Host "   → Make sure to check 'Add Python to PATH' during installation" -ForegroundColor Yellow
    $allInstalled = $false
}

# Check Java
Write-Host "`nChecking Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "✅ Java: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java not found" -ForegroundColor Red
    Write-Host "   → Download and install from: https://adoptium.net/" -ForegroundColor Yellow
    $allInstalled = $false
}

# Check Maven (should be available after extraction)
Write-Host "`nChecking Maven..." -ForegroundColor Yellow
if (Test-Path "apache-maven-3.9.6\bin\mvn.cmd") {
    Write-Host "✅ Maven: Available (apache-maven-3.9.6)" -ForegroundColor Green
} else {
    Write-Host "❌ Maven not found" -ForegroundColor Red
    $allInstalled = $false
}

# Summary
Write-Host "`n" + "="*50 -ForegroundColor Cyan
if ($allInstalled) {
    Write-Host "🎉 All tools are installed! You can now run:" -ForegroundColor Green
    Write-Host "   .\complete-setup.ps1" -ForegroundColor White
    Write-Host "`nOr run step by step:" -ForegroundColor Yellow
    Write-Host "   .\complete-setup.ps1 -InstallOnly    # Install dependencies only" -ForegroundColor White
    Write-Host "   .\complete-setup.ps1 -StartOnly      # Start services only" -ForegroundColor White
} else {
    Write-Host "❌ Some tools are missing. Please install them first." -ForegroundColor Red
    Write-Host "`nAfter installation:" -ForegroundColor Yellow
    Write-Host "1. Close and reopen PowerShell as Administrator" -ForegroundColor White
    Write-Host "2. Navigate back to this directory" -ForegroundColor White
    Write-Host "3. Run: .\check-installations.ps1" -ForegroundColor White
}
Write-Host "="*50 -ForegroundColor Cyan
