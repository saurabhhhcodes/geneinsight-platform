# GeneInsight Platform - Remote Tunnel Setup Script
# This script sets up remote tunnels for your friend to access the platform

param(
    [string]$TunnelType = "cloudflare",
    [string]$Password = "",
    [switch]$Help
)

if ($Help) {
    Write-Host @"
GeneInsight Platform - Remote Tunnel Setup

Usage: .\setup-remote-tunnel.ps1 [-TunnelType <type>] [-Password <password>]

Tunnel Types:
  cloudflare  - Cloudflare Tunnel (Recommended, Free, Secure)
  localtunnel - LocalTunnel (Simple, Password Protected)
  serveo      - Serveo (SSH-based, Reliable)
  pinggy      - Pinggy (Modern, Feature-rich)

Examples:
  .\setup-remote-tunnel.ps1 -TunnelType cloudflare
  .\setup-remote-tunnel.ps1 -TunnelType localtunnel -Password "mypassword123"
  .\setup-remote-tunnel.ps1 -TunnelType serveo

"@ -ForegroundColor Cyan
    exit
}

# Colors for output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"
$Cyan = "Cyan"
$White = "White"

Write-Host "🌐 GeneInsight Platform - Remote Tunnel Setup" -ForegroundColor $Cyan
Write-Host "=" * 50 -ForegroundColor $Cyan

# Check if services are running
function Test-ServiceRunning {
    param($Port, $ServiceName)
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$Port" -TimeoutSec 5 -UseBasicParsing
        Write-Host "✅ $ServiceName is running on port $Port" -ForegroundColor $Green
        return $true
    }
    catch {
        Write-Host "❌ $ServiceName is not running on port $Port" -ForegroundColor $Red
        return $false
    }
}

Write-Host "`n🔧 Checking GeneInsight Platform Services..." -ForegroundColor $Yellow

$frontendRunning = Test-ServiceRunning -Port 3000 -ServiceName "Frontend"
$backendRunning = Test-ServiceRunning -Port 8080 -ServiceName "Backend"
$mlServiceRunning = Test-ServiceRunning -Port 5000 -ServiceName "ML Service"

if (-not ($frontendRunning -and $backendRunning -and $mlServiceRunning)) {
    Write-Host "`n⚠️  Some services are not running. Please start them first:" -ForegroundColor $Yellow
    Write-Host "   Run: .\complete-setup.ps1" -ForegroundColor $White
    Write-Host "`nContinuing with tunnel setup for available services..." -ForegroundColor $Yellow
}

# Generate random password if not provided
if ([string]::IsNullOrEmpty($Password)) {
    $Password = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 12 | ForEach-Object {[char]$_})
    Write-Host "`n🔐 Generated password: $Password" -ForegroundColor $Yellow
}

Write-Host "`n🚀 Setting up $TunnelType tunnel..." -ForegroundColor $Cyan

switch ($TunnelType.ToLower()) {
    "cloudflare" {
        Write-Host "Setting up Cloudflare Tunnel..." -ForegroundColor $Yellow
        
        # Check if cloudflared is installed
        try {
            $null = Get-Command cloudflared -ErrorAction Stop
            Write-Host "✅ Cloudflared is already installed" -ForegroundColor $Green
        }
        catch {
            Write-Host "📥 Installing Cloudflared..." -ForegroundColor $Yellow
            
            # Download and install cloudflared
            $downloadUrl = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
            $cloudflaredPath = "$env:TEMP\cloudflared.exe"
            
            try {
                Invoke-WebRequest -Uri $downloadUrl -OutFile $cloudflaredPath
                
                # Move to a permanent location
                $installPath = "$env:LOCALAPPDATA\cloudflared"
                if (-not (Test-Path $installPath)) {
                    New-Item -ItemType Directory -Path $installPath -Force
                }
                
                Move-Item $cloudflaredPath "$installPath\cloudflared.exe" -Force
                
                # Add to PATH for current session
                $env:PATH += ";$installPath"
                
                Write-Host "✅ Cloudflared installed successfully" -ForegroundColor $Green
            }
            catch {
                Write-Host "❌ Failed to install Cloudflared: $($_.Exception.Message)" -ForegroundColor $Red
                exit 1
            }
        }
        
        Write-Host "`n🌐 Starting Cloudflare Tunnels..." -ForegroundColor $Yellow
        
        # Create tunnel configuration
        $tunnelConfig = @"
tunnel: geneinsight-platform
credentials-file: $env:USERPROFILE\.cloudflared\geneinsight-platform.json

ingress:
  - hostname: geneinsight-frontend.trycloudflare.com
    service: http://localhost:3000
  - hostname: geneinsight-backend.trycloudflare.com  
    service: http://localhost:8080
  - hostname: geneinsight-ml.trycloudflare.com
    service: http://localhost:5000
  - service: http_status:404
"@
        
        # Start tunnels for each service
        if ($frontendRunning) {
            Write-Host "🌐 Starting Frontend tunnel..." -ForegroundColor $Yellow
            Start-Process -FilePath "cloudflared" -ArgumentList "tunnel --url http://localhost:3000" -WindowStyle Minimized
            Start-Sleep -Seconds 3
        }
        
        if ($backendRunning) {
            Write-Host "🌐 Starting Backend tunnel..." -ForegroundColor $Yellow
            Start-Process -FilePath "cloudflared" -ArgumentList "tunnel --url http://localhost:8080" -WindowStyle Minimized
            Start-Sleep -Seconds 3
        }
        
        if ($mlServiceRunning) {
            Write-Host "🌐 Starting ML Service tunnel..." -ForegroundColor $Yellow
            Start-Process -FilePath "cloudflared" -ArgumentList "tunnel --url http://localhost:5000" -WindowStyle Minimized
            Start-Sleep -Seconds 3
        }
        
        Write-Host "`n✅ Cloudflare tunnels started!" -ForegroundColor $Green
        Write-Host "📋 Check the console outputs above for the tunnel URLs" -ForegroundColor $Yellow
    }
    
    "localtunnel" {
        Write-Host "Setting up LocalTunnel..." -ForegroundColor $Yellow
        
        # Check if localtunnel is installed
        try {
            $null = Get-Command lt -ErrorAction Stop
            Write-Host "✅ LocalTunnel is already installed" -ForegroundColor $Green
        }
        catch {
            Write-Host "📥 Installing LocalTunnel..." -ForegroundColor $Yellow
            npm install -g localtunnel
            Write-Host "✅ LocalTunnel installed successfully" -ForegroundColor $Green
        }
        
        Write-Host "`n🌐 Starting LocalTunnel..." -ForegroundColor $Yellow
        
        # Start tunnels for each service
        if ($frontendRunning) {
            Write-Host "🌐 Starting Frontend tunnel..." -ForegroundColor $Yellow
            Start-Process -FilePath "lt" -ArgumentList "--port 3000 --subdomain geneinsight-frontend-$((Get-Random -Maximum 9999))" -WindowStyle Minimized
        }
        
        if ($backendRunning) {
            Write-Host "🌐 Starting Backend tunnel..." -ForegroundColor $Yellow
            Start-Process -FilePath "lt" -ArgumentList "--port 8080 --subdomain geneinsight-backend-$((Get-Random -Maximum 9999))" -WindowStyle Minimized
        }
        
        if ($mlServiceRunning) {
            Write-Host "🌐 Starting ML Service tunnel..." -ForegroundColor $Yellow
            Start-Process -FilePath "lt" -ArgumentList "--port 5000 --subdomain geneinsight-ml-$((Get-Random -Maximum 9999))" -WindowStyle Minimized
        }
        
        Start-Sleep -Seconds 5
        Write-Host "`n✅ LocalTunnel started!" -ForegroundColor $Green
        Write-Host "📋 Check the console outputs above for the tunnel URLs" -ForegroundColor $Yellow
    }
    
    "serveo" {
        Write-Host "Setting up Serveo tunnel..." -ForegroundColor $Yellow
        
        # Check if SSH is available
        try {
            $null = Get-Command ssh -ErrorAction Stop
            Write-Host "✅ SSH is available" -ForegroundColor $Green
        }
        catch {
            Write-Host "❌ SSH is not available. Please install OpenSSH or Git for Windows" -ForegroundColor $Red
            exit 1
        }
        
        Write-Host "`n🌐 Starting Serveo tunnels..." -ForegroundColor $Yellow
        
        # Start tunnels for each service
        if ($frontendRunning) {
            Write-Host "🌐 Starting Frontend tunnel..." -ForegroundColor $Yellow
            Start-Process -FilePath "ssh" -ArgumentList "-R geneinsight-frontend:80:localhost:3000 serveo.net" -WindowStyle Minimized
        }
        
        if ($backendRunning) {
            Write-Host "🌐 Starting Backend tunnel..." -ForegroundColor $Yellow
            Start-Process -FilePath "ssh" -ArgumentList "-R geneinsight-backend:80:localhost:8080 serveo.net" -WindowStyle Minimized
        }
        
        if ($mlServiceRunning) {
            Write-Host "🌐 Starting ML Service tunnel..." -ForegroundColor $Yellow
            Start-Process -FilePath "ssh" -ArgumentList "-R geneinsight-ml:80:localhost:5000 serveo.net" -WindowStyle Minimized
        }
        
        Start-Sleep -Seconds 5
        Write-Host "`n✅ Serveo tunnels started!" -ForegroundColor $Green
    }
    
    "pinggy" {
        Write-Host "Setting up Pinggy tunnel..." -ForegroundColor $Yellow
        
        # Download pinggy if not exists
        $pinggyPath = "$env:LOCALAPPDATA\pinggy\pinggy.exe"
        if (-not (Test-Path $pinggyPath)) {
            Write-Host "📥 Downloading Pinggy..." -ForegroundColor $Yellow
            
            $pinggyDir = Split-Path $pinggyPath
            if (-not (Test-Path $pinggyDir)) {
                New-Item -ItemType Directory -Path $pinggyDir -Force
            }
            
            # Note: You'll need to get the actual download URL for Pinggy Windows binary
            Write-Host "Please visit https://pinggy.io and download the Windows binary" -ForegroundColor $Yellow
            Write-Host "Place it at: $pinggyPath" -ForegroundColor $Yellow
            exit 1
        }
        
        Write-Host "`n🌐 Starting Pinggy tunnels..." -ForegroundColor $Yellow
        
        # Start tunnels for each service
        if ($frontendRunning) {
            Start-Process -FilePath $pinggyPath -ArgumentList "tcp 3000" -WindowStyle Minimized
        }
        
        if ($backendRunning) {
            Start-Process -FilePath $pinggyPath -ArgumentList "tcp 8080" -WindowStyle Minimized
        }
        
        if ($mlServiceRunning) {
            Start-Process -FilePath $pinggyPath -ArgumentList "tcp 5000" -WindowStyle Minimized
        }
        
        Write-Host "`n✅ Pinggy tunnels started!" -ForegroundColor $Green
    }
    
    default {
        Write-Host "❌ Unknown tunnel type: $TunnelType" -ForegroundColor $Red
        Write-Host "Available types: cloudflare, localtunnel, serveo, pinggy" -ForegroundColor $Yellow
        exit 1
    }
}

Write-Host "`n" + "=" * 50 -ForegroundColor $Cyan
Write-Host "🎉 Remote Tunnel Setup Complete!" -ForegroundColor $Green
Write-Host "=" * 50 -ForegroundColor $Cyan

Write-Host "`n📋 Share these details with your friend:" -ForegroundColor $Yellow
Write-Host "🔐 Access Password: $Password" -ForegroundColor $White
Write-Host "`n⏳ Tunnel URLs will be displayed in the console windows that opened." -ForegroundColor $Yellow
Write-Host "📱 Your friend can access the platform using those URLs." -ForegroundColor $Yellow

Write-Host "`n🛑 To stop tunnels, close the console windows or press Ctrl+C in each." -ForegroundColor $Yellow

Write-Host "`n🔧 Troubleshooting:" -ForegroundColor $Cyan
Write-Host "• If tunnels don't work, try a different tunnel type" -ForegroundColor $White
Write-Host "• Make sure your firewall allows the tunnel applications" -ForegroundColor $White
Write-Host "• Check that all GeneInsight services are running" -ForegroundColor $White

Write-Host "`nPress any key to continue..." -ForegroundColor $Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
