# Simple Remote Tunnel for GeneInsight Platform
# Creates tunnels using LocalTunnel (easiest method)

Write-Host "GeneInsight Platform - Simple Remote Tunnel Setup" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# Function to check if a port is open
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
    Write-Host "`nNo services are running!" -ForegroundColor Red
    Write-Host "Please start Docker containers first:" -ForegroundColor Yellow
    Write-Host "   docker-compose up --build" -ForegroundColor White
    Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

# Check if Node.js is available
try {
    $nodeVersion = node --version 2>$null
    Write-Host "`nNode.js detected: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "`nNode.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

# Install LocalTunnel
Write-Host "`nInstalling LocalTunnel..." -ForegroundColor Yellow
try {
    npm install -g localtunnel --silent
    Write-Host "LocalTunnel installed successfully" -ForegroundColor Green
}
catch {
    Write-Host "Failed to install LocalTunnel" -ForegroundColor Red
    Write-Host "Please run as Administrator or install manually:" -ForegroundColor Yellow
    Write-Host "   npm install -g localtunnel" -ForegroundColor White
    exit
}

Write-Host "`nCreating tunnels..." -ForegroundColor Yellow

$tunnelUrls = @()
$processes = @()

# Create tunnels for running services
if ($frontendOK) {
    Write-Host "Creating Frontend tunnel..." -ForegroundColor White
    $frontendSubdomain = "geneinsight-app-$((Get-Random -Maximum 9999))"
    $process = Start-Process -FilePath "npx" -ArgumentList "localtunnel", "--port", "3000", "--subdomain", $frontendSubdomain -WindowStyle Hidden -PassThru
    $processes += $process
    $frontendUrl = "https://$frontendSubdomain.loca.lt"
    $tunnelUrls += "Frontend App: $frontendUrl"
    Start-Sleep -Seconds 2
}

if ($backendOK) {
    Write-Host "Creating Backend API tunnel..." -ForegroundColor White
    $backendSubdomain = "geneinsight-api-$((Get-Random -Maximum 9999))"
    $process = Start-Process -FilePath "npx" -ArgumentList "localtunnel", "--port", "8080", "--subdomain", $backendSubdomain -WindowStyle Hidden -PassThru
    $processes += $process
    $backendUrl = "https://$backendSubdomain.loca.lt"
    $tunnelUrls += "Backend API: $backendUrl"
    Start-Sleep -Seconds 2
}

if ($mlServiceOK) {
    Write-Host "Creating ML Service tunnel..." -ForegroundColor White
    $mlSubdomain = "geneinsight-ml-$((Get-Random -Maximum 9999))"
    $process = Start-Process -FilePath "npx" -ArgumentList "localtunnel", "--port", "5000", "--subdomain", $mlSubdomain -WindowStyle Hidden -PassThru
    $processes += $process
    $mlUrl = "https://$mlSubdomain.loca.lt"
    $tunnelUrls += "ML Service: $mlUrl"
    Start-Sleep -Seconds 2
}

Write-Host "`nWaiting for tunnels to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "`n====================================================" -ForegroundColor Green
Write-Host "TUNNELS ARE READY!" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green

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

Write-Host "`nTo stop all tunnels: Close this PowerShell window or press Ctrl+C" -ForegroundColor Red

# Keep the script running and monitor tunnels
Write-Host "`nTunnels are active. Press Ctrl+C to stop all tunnels." -ForegroundColor Green
Write-Host "Tip: Minimize this window and leave it running." -ForegroundColor Yellow

# Function to cleanup processes on exit
function Cleanup {
    Write-Host "`nStopping tunnels..." -ForegroundColor Yellow
    foreach ($process in $processes) {
        if (-not $process.HasExited) {
            try {
                $process.Kill()
                Write-Host "Stopped tunnel process $($process.Id)" -ForegroundColor Green
            }
            catch {
                Write-Host "Failed to stop process $($process.Id)" -ForegroundColor Red
            }
        }
    }
    Write-Host "All tunnels stopped." -ForegroundColor Green
}

# Register cleanup function for Ctrl+C
Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

try {
    # Keep the script running
    while ($true) {
        Start-Sleep -Seconds 30
        
        # Check if any processes have died
        $aliveProceses = 0
        foreach ($process in $processes) {
            if (-not $process.HasExited) {
                $aliveProceses++
            }
        }
        
        if ($aliveProceses -eq 0) {
            Write-Host "`nAll tunnel processes have stopped. Exiting..." -ForegroundColor Yellow
            break
        }
        
        Write-Host "." -NoNewline -ForegroundColor Green
    }
}
catch {
    Write-Host "`nStopping tunnels..." -ForegroundColor Yellow
}
finally {
    Cleanup
}

Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
