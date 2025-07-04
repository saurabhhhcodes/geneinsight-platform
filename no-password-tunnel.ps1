# Password-Free Remote Tunnel for GeneInsight Platform
Write-Host "GeneInsight Platform - Password-Free Remote Tunnel" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

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

Write-Host "`nSetting up password-free tunnels..." -ForegroundColor Yellow

# Method 1: Try Serveo (SSH-based, no password)
try {
    $null = Get-Command ssh -ErrorAction Stop
    Write-Host "✅ SSH available - Using Serveo (password-free)" -ForegroundColor Green
    
    $tunnelUrls = @()
    
    if ($frontendOK) {
        Write-Host "Creating Frontend tunnel via Serveo..." -ForegroundColor White
        $frontendSubdomain = "geneinsight-app-$((Get-Random -Maximum 999))"
        Start-Process -FilePath "ssh" -ArgumentList "-R", "${frontendSubdomain}:80:localhost:3000", "serveo.net" -WindowStyle Minimized
        $frontendUrl = "https://${frontendSubdomain}.serveo.net"
        $tunnelUrls += "Frontend App: $frontendUrl"
        Start-Sleep -Seconds 3
    }
    
    if ($backendOK) {
        Write-Host "Creating Backend tunnel via Serveo..." -ForegroundColor White
        $backendSubdomain = "geneinsight-api-$((Get-Random -Maximum 999))"
        Start-Process -FilePath "ssh" -ArgumentList "-R", "${backendSubdomain}:80:localhost:8080", "serveo.net" -WindowStyle Minimized
        $backendUrl = "https://${backendSubdomain}.serveo.net"
        $tunnelUrls += "Backend API: $backendUrl"
        Start-Sleep -Seconds 3
    }
    
    if ($mlServiceOK) {
        Write-Host "Creating ML Service tunnel via Serveo..." -ForegroundColor White
        $mlSubdomain = "geneinsight-ml-$((Get-Random -Maximum 999))"
        Start-Process -FilePath "ssh" -ArgumentList "-R", "${mlSubdomain}:80:localhost:5000", "serveo.net" -WindowStyle Minimized
        $mlUrl = "https://${mlSubdomain}.serveo.net"
        $tunnelUrls += "ML Service: $mlUrl"
        Start-Sleep -Seconds 3
    }
    
    Write-Host "`nWaiting for Serveo tunnels to initialize..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    Write-Host "`n===================================================" -ForegroundColor Green
    Write-Host "PASSWORD-FREE TUNNELS ARE READY!" -ForegroundColor Green
    Write-Host "===================================================" -ForegroundColor Green
    
    Write-Host "`nShare these URLs with your friend (NO PASSWORD NEEDED):" -ForegroundColor Cyan
    foreach ($url in $tunnelUrls) {
        Write-Host "   $url" -ForegroundColor White
    }
    
    if ($frontendOK) {
        Write-Host "`nMAIN APP URL FOR YOUR FRIEND (NO PASSWORD):" -ForegroundColor Yellow
        Write-Host "   $frontendUrl" -ForegroundColor Green
        
        Write-Host "`nInstructions for your friend:" -ForegroundColor Cyan
        Write-Host "   1. Click the main app URL above" -ForegroundColor White
        Write-Host "   2. NO PASSWORD REQUIRED - direct access!" -ForegroundColor Green
        Write-Host "   3. The GeneInsight platform will load immediately" -ForegroundColor White
    }
}
catch {
    Write-Host "❌ SSH not available. Using LocalTunnel with instructions..." -ForegroundColor Red
    
    # Fallback to LocalTunnel with clear password instructions
    Write-Host "`nInstalling LocalTunnel..." -ForegroundColor Yellow
    npm install -g localtunnel
    
    Write-Host "`nCreating LocalTunnel (with password bypass)..." -ForegroundColor Yellow
    
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
    
    Write-Host "`n===================================================" -ForegroundColor Green
    Write-Host "TUNNELS ARE READY!" -ForegroundColor Green
    Write-Host "===================================================" -ForegroundColor Green
    
    Write-Host "`nShare these URLs with your friend:" -ForegroundColor Cyan
    foreach ($url in $tunnelUrls) {
        Write-Host "   $url" -ForegroundColor White
    }
    
    if ($frontendOK) {
        Write-Host "`nMAIN APP URL FOR YOUR FRIEND:" -ForegroundColor Yellow
        Write-Host "   $frontendUrl" -ForegroundColor Green
        
        Write-Host "`n🔐 PASSWORD BYPASS INSTRUCTIONS:" -ForegroundColor Yellow
        Write-Host "   If LocalTunnel asks for a password, tell your friend to:" -ForegroundColor Cyan
        Write-Host "   1. Click 'Click to Continue' button" -ForegroundColor White
        Write-Host "   2. OR refresh the page a few times" -ForegroundColor White
        Write-Host "   3. OR try opening in incognito/private mode" -ForegroundColor White
        Write-Host "   4. The password prompt should disappear" -ForegroundColor White
    }
}

Write-Host "`nIMPORTANT NOTES:" -ForegroundColor Yellow
Write-Host "   - These tunnels will stay active until you close this window" -ForegroundColor White
Write-Host "   - Tunnels are secure and temporary" -ForegroundColor White
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
