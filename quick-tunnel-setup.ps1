# Quick Remote Tunnel Setup for GeneInsight Platform
# This creates instant tunnels for your friend to access the platform

Write-Host "GeneInsight Platform - Quick Remote Access Setup" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

# Check if services are running
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

Write-Host "`nChecking GeneInsight Services..." -ForegroundColor Yellow
$frontendOK = Test-Port -Port 3000 -ServiceName "Frontend"
$backendOK = Test-Port -Port 8080 -ServiceName "Backend API"
$mlServiceOK = Test-Port -Port 5000 -ServiceName "ML Service"

if (-not ($frontendOK -or $backendOK -or $mlServiceOK)) {
    Write-Host "`nNo services are running!" -ForegroundColor Red
    Write-Host "Please start the platform first:" -ForegroundColor Yellow
    Write-Host "   .\complete-setup.ps1" -ForegroundColor White
    Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

# Method 1: LocalTunnel (Simplest)
Write-Host "`nSetting up LocalTunnel (Recommended for quick testing)..." -ForegroundColor Cyan

# Check if Node.js is available
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js detected: $nodeVersion" -ForegroundColor Green
    
    # Install localtunnel if not present
    Write-Host "Installing LocalTunnel..." -ForegroundColor Yellow
    npm install -g localtunnel --silent

    Write-Host "`nCreating tunnels..." -ForegroundColor Yellow

    $tunnelUrls = @()

    if ($frontendOK) {
        Write-Host "Creating Frontend tunnel..." -ForegroundColor White
        $frontendSubdomain = "geneinsight-app-$((Get-Random -Maximum 9999))"
        Start-Process -FilePath "cmd" -ArgumentList "/c", "lt --port 3000 --subdomain $frontendSubdomain" -WindowStyle Minimized
        $frontendUrl = "https://$frontendSubdomain.loca.lt"
        $tunnelUrls += "Frontend App: $frontendUrl"
        Start-Sleep -Seconds 2
    }

    if ($backendOK) {
        Write-Host "Creating Backend API tunnel..." -ForegroundColor White
        $backendSubdomain = "geneinsight-api-$((Get-Random -Maximum 9999))"
        Start-Process -FilePath "cmd" -ArgumentList "/c", "lt --port 8080 --subdomain $backendSubdomain" -WindowStyle Minimized
        $backendUrl = "https://$backendSubdomain.loca.lt"
        $tunnelUrls += "Backend API: $backendUrl"
        Start-Sleep -Seconds 2
    }

    if ($mlServiceOK) {
        Write-Host "Creating ML Service tunnel..." -ForegroundColor White
        $mlSubdomain = "geneinsight-ml-$((Get-Random -Maximum 9999))"
        Start-Process -FilePath "cmd" -ArgumentList "/c", "lt --port 5000 --subdomain $mlSubdomain" -WindowStyle Minimized
        $mlUrl = "https://$mlSubdomain.loca.lt"
        $tunnelUrls += "ML Service: $mlUrl"
        Start-Sleep -Seconds 2
    }
    
    Write-Host "`nWaiting for tunnels to initialize..." -ForegroundColor Yellow
    Start-Sleep -Seconds 8

    Write-Host "`n=======================================================" -ForegroundColor Green
    Write-Host "TUNNELS ARE READY!" -ForegroundColor Green
    Write-Host "=======================================================" -ForegroundColor Green

    Write-Host "`nShare these URLs with your friend:" -ForegroundColor Cyan
    foreach ($url in $tunnelUrls) {
        Write-Host "   $url" -ForegroundColor White
    }

    if ($frontendOK) {
        Write-Host "`nMAIN APP URL FOR YOUR FRIEND:" -ForegroundColor Yellow
        Write-Host "   $frontendUrl" -ForegroundColor Green
        Write-Host "`nInstructions for your friend:" -ForegroundColor Cyan
        Write-Host "   1. Click the main app URL above" -ForegroundColor White
        Write-Host "   2. If prompted, click 'Click to Continue'" -ForegroundColor White
        Write-Host "   3. The GeneInsight platform will load" -ForegroundColor White
    }
    
    Write-Host "`nIMPORTANT NOTES:" -ForegroundColor Yellow
    Write-Host "   - These tunnels will stay active until you close this window" -ForegroundColor White
    Write-Host "   - Your friend may see a 'Click to Continue' page first (this is normal)" -ForegroundColor White
    Write-Host "   - If a tunnel stops working, run this script again" -ForegroundColor White

    Write-Host "`nTo stop all tunnels: Close this PowerShell window" -ForegroundColor Red

    # Keep the script running
    Write-Host "`nTunnels are active. Press Ctrl+C to stop all tunnels." -ForegroundColor Green
    Write-Host "Tip: Minimize this window and leave it running." -ForegroundColor Yellow
    
    try {
        while ($true) {
            Start-Sleep -Seconds 30
            Write-Host "." -NoNewline -ForegroundColor Green
        }
    }
    catch {
        Write-Host "`nStopping tunnels..." -ForegroundColor Yellow
    }
}
catch {
    Write-Host "`nNode.js not found. Trying alternative method..." -ForegroundColor Red
    
    # Method 2: SSH Tunnel (if available)
    try {
        $null = Get-Command ssh -ErrorAction Stop
        Write-Host "`nUsing SSH tunnel method..." -ForegroundColor Yellow

        if ($frontendOK) {
            Write-Host "Creating SSH tunnel for Frontend..." -ForegroundColor White
            $sshSubdomain = "geneinsight$((Get-Random -Maximum 999))"
            Start-Process -FilePath "ssh" -ArgumentList "-R", "${sshSubdomain}:80:localhost:3000", "serveo.net" -WindowStyle Minimized
            Write-Host "   Frontend URL: https://${sshSubdomain}.serveo.net" -ForegroundColor Green
        }

        Write-Host "`nSSH tunnels created! Check the URLs above." -ForegroundColor Green
    }
    catch {
        Write-Host "`nSSH not available either." -ForegroundColor Red
        Write-Host "`nManual Setup Required:" -ForegroundColor Yellow
        Write-Host "   1. Install Node.js from https://nodejs.org" -ForegroundColor White
        Write-Host "   2. Or install Git for Windows (includes SSH)" -ForegroundColor White
        Write-Host "   3. Run this script again" -ForegroundColor White

        Write-Host "`nAlternative: Use ngrok" -ForegroundColor Cyan
        Write-Host "   1. Download from https://ngrok.com/download" -ForegroundColor White
        Write-Host "   2. Run: ngrok http 3000" -ForegroundColor White
        Write-Host "   3. Share the https URL with your friend" -ForegroundColor White
    }
}

Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
