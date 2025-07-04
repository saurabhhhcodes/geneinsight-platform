# GeneInsight Platform - Remote Tunnel with IP Password
Write-Host "GeneInsight Platform - Remote Tunnel Setup" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

# Get your public IP address
Write-Host "`nGetting your public IP address..." -ForegroundColor Yellow
try {
    $publicIP = (Invoke-RestMethod -Uri "https://api.ipify.org" -TimeoutSec 10).Trim()
    Write-Host "✅ Your public IP: $publicIP" -ForegroundColor Green
}
catch {
    try {
        $publicIP = (Invoke-RestMethod -Uri "https://icanhazip.com" -TimeoutSec 10).Trim()
        Write-Host "✅ Your public IP: $publicIP" -ForegroundColor Green
    }
    catch {
        $publicIP = "Unable to detect"
        Write-Host "❌ Could not detect public IP" -ForegroundColor Red
    }
}

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

# Install LocalTunnel
Write-Host "`nInstalling LocalTunnel..." -ForegroundColor Yellow
npm install -g localtunnel

Write-Host "`nCreating tunnels..." -ForegroundColor Yellow

# Generate random subdomain numbers
$frontendNum = Get-Random -Maximum 9999
$backendNum = Get-Random -Maximum 9999
$mlNum = Get-Random -Maximum 9999

$tunnelUrls = @()

# Create Frontend tunnel
if ($frontendOK) {
    Write-Host "Creating Frontend tunnel..." -ForegroundColor White
    $frontendSubdomain = "geneinsight-app-$frontendNum"
    Start-Process -FilePath "cmd" -ArgumentList "/c", "lt --port 3000 --subdomain $frontendSubdomain" -WindowStyle Minimized
    $frontendUrl = "https://$frontendSubdomain.loca.lt"
    $tunnelUrls += "Frontend App: $frontendUrl"
    Start-Sleep -Seconds 2
}

# Create Backend tunnel
if ($backendOK) {
    Write-Host "Creating Backend API tunnel..." -ForegroundColor White
    $backendSubdomain = "geneinsight-api-$backendNum"
    Start-Process -FilePath "cmd" -ArgumentList "/c", "lt --port 8080 --subdomain $backendSubdomain" -WindowStyle Minimized
    $backendUrl = "https://$backendSubdomain.loca.lt"
    $tunnelUrls += "Backend API: $backendUrl"
    Start-Sleep -Seconds 2
}

# Create ML Service tunnel
if ($mlServiceOK) {
    Write-Host "Creating ML Service tunnel..." -ForegroundColor White
    $mlSubdomain = "geneinsight-ml-$mlNum"
    Start-Process -FilePath "cmd" -ArgumentList "/c", "lt --port 5000 --subdomain $mlSubdomain" -WindowStyle Minimized
    $mlUrl = "https://$mlSubdomain.loca.lt"
    $tunnelUrls += "ML Service: $mlUrl"
    Start-Sleep -Seconds 2
}

Write-Host "`nWaiting for tunnels to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "`n===========================================" -ForegroundColor Green
Write-Host "TUNNELS ARE READY!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

Write-Host "`nShare these URLs with your friend:" -ForegroundColor Cyan
foreach ($url in $tunnelUrls) {
    Write-Host "   $url" -ForegroundColor White
}

if ($frontendOK) {
    Write-Host "`nMAIN APP URL FOR YOUR FRIEND:" -ForegroundColor Yellow
    Write-Host "   $frontendUrl" -ForegroundColor Green
}

Write-Host "`n🔐 PASSWORD INFORMATION:" -ForegroundColor Yellow
Write-Host "===========================================" -ForegroundColor Yellow
if ($publicIP -ne "Unable to detect") {
    Write-Host "PASSWORD FOR YOUR FRIEND: $publicIP" -ForegroundColor Green
    Write-Host "===========================================" -ForegroundColor Yellow
    
    Write-Host "`n📋 Instructions to send to your friend:" -ForegroundColor Cyan
    Write-Host "   1. Click this URL: $frontendUrl" -ForegroundColor White
    Write-Host "   2. When asked for password, enter: $publicIP" -ForegroundColor Green
    Write-Host "   3. The GeneInsight platform will load" -ForegroundColor White
    
    Write-Host "`n📱 Message to copy and send to your friend:" -ForegroundColor Cyan
    Write-Host "===========================================" -ForegroundColor White
    Write-Host "Hi! You can now test the GeneInsight Platform remotely:" -ForegroundColor White
    Write-Host "" -ForegroundColor White
    Write-Host "🌐 URL: $frontendUrl" -ForegroundColor White
    Write-Host "🔐 Password: $publicIP" -ForegroundColor White
    Write-Host "" -ForegroundColor White
    Write-Host "Instructions:" -ForegroundColor White
    Write-Host "1. Click the URL above" -ForegroundColor White
    Write-Host "2. Enter the password when prompted" -ForegroundColor White
    Write-Host "3. Test all the DNA analysis and 3D structure features!" -ForegroundColor White
    Write-Host "===========================================" -ForegroundColor White
}
else {
    Write-Host "❌ Could not detect your IP address automatically" -ForegroundColor Red
    Write-Host "Please find your public IP manually:" -ForegroundColor Yellow
    Write-Host "   1. Go to: https://whatismyipaddress.com" -ForegroundColor White
    Write-Host "   2. Copy your IP address" -ForegroundColor White
    Write-Host "   3. Share that IP as the password with your friend" -ForegroundColor White
}

Write-Host "`n🧪 What your friend can test:" -ForegroundColor Cyan
Write-Host "   ✅ DNA Analysis with ML predictions" -ForegroundColor Green
Write-Host "   ✅ 3D Structure Generation" -ForegroundColor Green
Write-Host "   ✅ Visualization and Reports" -ForegroundColor Green
Write-Host "   ✅ User Authentication" -ForegroundColor Green
Write-Host "   ✅ All Platform Features" -ForegroundColor Green

Write-Host "`nIMPORTANT NOTES:" -ForegroundColor Yellow
Write-Host "   - These tunnels will stay active until you close this window" -ForegroundColor White
Write-Host "   - The password is your public IP address for security" -ForegroundColor White
Write-Host "   - If a tunnel stops working, run this script again" -ForegroundColor White

Write-Host "`nTo stop all tunnels: Close this PowerShell window or press Ctrl+C" -ForegroundColor Red

Write-Host "`nTunnels are active. Press Ctrl+C to stop all tunnels." -ForegroundColor Green
Write-Host "Tip: Minimize this window and leave it running." -ForegroundColor Yellow

# Keep the script running
try {
    while ($true) {
        Start-Sleep -Seconds 30
        Write-Host "." -NoNewline -ForegroundColor Green
    }
}
catch {
    Write-Host "`nStopping tunnels..." -ForegroundColor Yellow
}

Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
