#!/usr/bin/env python3
"""
Friend Access - Simple ways to share GeneInsight Platform
No authentication required alternatives
"""

import socket
import webbrowser
import requests
import subprocess
import time

def get_network_info():
    """Get network information"""
    try:
        # Get local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        
        # Get public IP
        try:
            public_ip = requests.get('https://api.ipify.org', timeout=5).text.strip()
        except:
            public_ip = "Unable to detect"
        
        return local_ip, public_ip
    except:
        return "localhost", "Unable to detect"

def check_platform():
    """Check if platform is running"""
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        return response.status_code == 200
    except:
        return False

def try_cloudflare_tunnel():
    """Try cloudflare tunnel (no auth for temporary tunnels)"""
    print("🌐 Trying Cloudflare Tunnel...")
    try:
        # Try to run cloudflared if available
        result = subprocess.run([
            "cloudflared", "tunnel", "--url", "http://localhost:3000"
        ], capture_output=True, text=True, timeout=10)
        
        # Look for tunnel URL in output
        if "https://" in result.stdout:
            lines = result.stdout.split('\n')
            for line in lines:
                if "https://" in line and "trycloudflare.com" in line:
                    return line.strip().split()[-1]
        return None
    except:
        return None

def main():
    print("🚀 GeneInsight Platform - Friend Access Setup")
    print("=" * 50)
    
    # Check platform
    if not check_platform():
        print("❌ GeneInsight platform not running!")
        print("Start with: docker-compose up -d")
        return
    
    print("✅ GeneInsight platform is running!")
    
    # Get network info
    local_ip, public_ip = get_network_info()
    
    print(f"\n🌐 NETWORK INFORMATION:")
    print(f"   Local IP: {local_ip}")
    print(f"   Public IP: {public_ip}")
    
    print(f"\n🎯 SHARING OPTIONS (RANKED BY EASE):")
    print("=" * 40)
    
    # Option 1: Screen Share (Easiest)
    print(f"\n1. 📺 SCREEN SHARE (EASIEST - 30 seconds)")
    print(f"   ✅ Start Zoom/Teams/Discord call")
    print(f"   ✅ Share your screen")
    print(f"   ✅ Show: http://localhost:3000")
    print(f"   ✅ Perfect for live demo!")
    
    # Option 2: Same Network
    print(f"\n2. 📱 SAME WIFI ACCESS (if nearby)")
    print(f"   ✅ URL: http://{local_ip}:3000")
    print(f"   ✅ Works if same WiFi network")
    print(f"   ✅ No setup required")
    
    # Option 3: TeamViewer
    print(f"\n3. 🖥️ REMOTE DESKTOP (TeamViewer/AnyDesk)")
    print(f"   ✅ Download TeamViewer (free)")
    print(f"   ✅ Share your ID with friend")
    print(f"   ✅ They can control your computer")
    print(f"   ✅ Show the demo together")
    
    # Option 4: Manual ngrok
    print(f"\n4. 🌍 INTERNET TUNNEL (ngrok - 5 min setup)")
    print(f"   • Sign up: https://ngrok.com (free)")
    print(f"   • Get token: https://dashboard.ngrok.com/get-started/your-authtoken")
    print(f"   • Run: ./ngrok config add-authtoken YOUR_TOKEN")
    print(f"   • Run: ./ngrok http 3000")
    print(f"   • Share the https URL")
    
    # Try cloudflare tunnel
    print(f"\n5. ☁️ TRYING CLOUDFLARE TUNNEL...")
    cf_url = try_cloudflare_tunnel()
    if cf_url:
        print(f"   ✅ SUCCESS: {cf_url}")
        print(f"   📱 Share this URL with your friend!")
    else:
        print(f"   ❌ Cloudflare tunnel not available")
    
    print(f"\n" + "=" * 50)
    print(f"🎯 RECOMMENDATION FOR RIGHT NOW:")
    print(f"=" * 50)
    
    print(f"📺 EASIEST: Screen share on Zoom/Teams")
    print(f"   • Instant demo")
    print(f"   • You can explain features")
    print(f"   • No setup required")
    
    if local_ip != "localhost":
        print(f"\n📱 IF SAME WIFI: http://{local_ip}:3000")
        print(f"   • Friend can try it themselves")
        print(f"   • Works if on same network")
    
    print(f"\n🧬 DEMO SCRIPT FOR YOUR FRIEND:")
    print(f"=" * 30)
    print(f'💬 "Hey! Want to see this DNA platform I built?"')
    print(f'💬 "It uses AI to turn DNA into 3D protein structures!"')
    print(f'💬 "Click Enhanced Analysis and try the BRCA1 sample!"')
    print(f'💬 "Watch it generate a 3D structure with 85% confidence!"')
    print(f'💬 "Pretty cool, right? All the export features work too!"')
    
    # Open browser
    print(f"\n🌐 Opening platform in your browser...")
    try:
        webbrowser.open("http://localhost:3000")
    except:
        pass
    
    print(f"\n🎉 Platform ready for demo!")
    print(f"Choose your preferred sharing method above! 😊")

if __name__ == "__main__":
    main()
