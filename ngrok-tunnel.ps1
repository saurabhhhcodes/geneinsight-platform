# Ngrok Tunnel Setup for GeneInsight Platform (No Password Required)
Write-Host "GeneInsight Platform - Ngrok Tunnel Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check services
function Test-Port {
    param($Port, $ServiceName)
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.ConnectAsync("localhost", $Port).Wait(1000)
        if ($tcpClient.Connected) {
            $tcpClient.Close()
            Write-Host "✅ $ServiceName (port $Port) - Running" -ForegroundColor Green
            return $true
        }
    }
    catch { }
    Write-Host "❌ $ServiceName (port $Port) - Not running" -ForegroundColor Red
    return $false
}

Write-Host "`nChecking services..." -ForegroundColor Yellow
$frontendOK = Test-Port -Port 3000 -ServiceName "Frontend"
$backendOK = Test-Port -Port 8080 -ServiceName "Backend API"
$mlServiceOK = Test-Port -Port 5000 -ServiceName "ML Service"

if (-not ($frontendOK -or $backendOK -or $mlServiceOK)) {
    Write-Host "`nNo services running! Start with: docker-compose up" -ForegroundColor Red
    exit
}

# Check if ngrok is installed
$ngrokPath = $null
$possiblePaths = @(
    "ngrok",
    ".\ngrok.exe",
    "$env:LOCALAPPDATA\ngrok\ngrok.exe",
    "$env:PROGRAMFILES\ngrok\ngrok.exe",
    "$env:USERPROFILE\Downloads\ngrok.exe"
)

foreach ($path in $possiblePaths) {
    try {
        $null = Get-Command $path -ErrorAction Stop
        $ngrokPath = $path
        Write-Host "✅ Found ngrok at: $path" -ForegroundColor Green
        break
    }
    catch { }
}

if (-not $ngrokPath) {
    Write-Host "❌ Ngrok not found!" -ForegroundColor Red
    Write-Host "`n📥 Please download ngrok:" -ForegroundColor Yellow
    Write-Host "   1. Go to: https://ngrok.com/download" -ForegroundColor White
    Write-Host "   2. Download the Windows version" -ForegroundColor White
    Write-Host "   3. Extract ngrok.exe to this folder" -ForegroundColor White
    Write-Host "   4. Run this script again" -ForegroundColor White
    Write-Host "`n💡 Alternative: Use the password-free tunnel script:" -ForegroundColor Cyan
    Write-Host "   .\no-password-tunnel.ps1" -ForegroundColor White
    exit
}

Write-Host "`nCreating ngrok tunnels (NO PASSWORD REQUIRED)..." -ForegroundColor Yellow

$tunnelUrls = @()

# Create Frontend tunnel
if ($frontendOK) {
    Write-Host "Creating Frontend tunnel..." -ForegroundColor White
    Start-Process -FilePath $ngrokPath -ArgumentList "http", "3000" -WindowStyle Minimized
    Start-Sleep -Seconds 3
}

# Create Backend tunnel  
if ($backendOK) {
    Write-Host "Creating Backend tunnel..." -ForegroundColor White
    Start-Process -FilePath $ngrokPath -ArgumentList "http", "8080" -WindowStyle Minimized
    Start-Sleep -Seconds 3
}

# Create ML Service tunnel
if ($mlServiceOK) {
    Write-Host "Creating ML Service tunnel..." -ForegroundColor White
    Start-Process -FilePath $ngrokPath -ArgumentList "http", "5000" -WindowStyle Minimized
    Start-Sleep -Seconds 3
}

Write-Host "`nWaiting for ngrok tunnels to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Try to get ngrok URLs from API
try {
    $ngrokApi = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction Stop
    
    Write-Host "`n==========================================" -ForegroundColor Green
    Write-Host "NGROK TUNNELS ARE READY! (NO PASSWORD)" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    
    Write-Host "`nShare these URLs with your friend:" -ForegroundColor Cyan
    
    foreach ($tunnel in $ngrokApi.tunnels) {
        $port = $tunnel.config.addr -replace "http://localhost:", ""
        $serviceName = switch ($port) {
            "3000" { "Frontend App" }
            "8080" { "Backend API" }
            "5000" { "ML Service" }
            default { "Service (port $port)" }
        }
        
        $url = $tunnel.public_url
        Write-Host "   $serviceName`: $url" -ForegroundColor White
        $tunnelUrls += "$serviceName`: $url"
        
        if ($port -eq "3000") {
            $frontendUrl = $url
        }
    }
    
    if ($frontendUrl) {
        Write-Host "`nMAIN APP URL FOR YOUR FRIEND:" -ForegroundColor Yellow
        Write-Host "   $frontendUrl" -ForegroundColor Green
        
        Write-Host "`nInstructions for your friend:" -ForegroundColor Cyan
        Write-Host "   1. Click the main app URL above" -ForegroundColor White
        Write-Host "   2. NO PASSWORD REQUIRED!" -ForegroundColor Green
        Write-Host "   3. The GeneInsight platform will load immediately" -ForegroundColor White
    }
}
catch {
    Write-Host "`n⚠️  Could not retrieve ngrok URLs automatically" -ForegroundColor Yellow
    Write-Host "Please check the ngrok windows that opened for the URLs" -ForegroundColor White
    Write-Host "Or visit: http://localhost:4040 to see all tunnel URLs" -ForegroundColor Cyan
}

Write-Host "`n🎯 ADVANTAGES OF NGROK:" -ForegroundColor Cyan
Write-Host "   ✅ NO PASSWORD REQUIRED" -ForegroundColor Green
Write-Host "   ✅ Reliable and fast" -ForegroundColor Green
Write-Host "   ✅ HTTPS by default" -ForegroundColor Green
Write-Host "   ✅ Web interface at http://localhost:4040" -ForegroundColor Green

Write-Host "`nIMPORTANT NOTES:" -ForegroundColor Yellow
Write-Host "   - These tunnels will stay active until you close the ngrok windows" -ForegroundColor White
Write-Host "   - Visit http://localhost:4040 to see all active tunnels" -ForegroundColor White
Write-Host "   - Ngrok tunnels are secure and temporary" -ForegroundColor White

Write-Host "`nTo stop all tunnels: Close the ngrok windows or press Ctrl+C" -ForegroundColor Red

Write-Host "`nTunnels are active. Visit http://localhost:4040 for tunnel management." -ForegroundColor Green

Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
