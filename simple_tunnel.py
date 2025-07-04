#!/usr/bin/env python3
"""
Simple tunnel alternatives for sharing GeneInsight Platform
Multiple options without requiring authentication
"""

import subprocess
import socket
import requests
import time
import webbrowser
from threading import Thread
import json

def get_local_ip():
    """Get the local IP address"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except:
        return "localhost"

def check_platform():
    """Check if GeneInsight platform is running"""
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        return response.status_code == 200
    except:
        return False

def try_localtunnel():
    """Try using localtunnel (no auth required)"""
    print("🌐 Trying localtunnel...")
    try:
        # Install localtunnel globally
        subprocess.run(["npm", "install", "-g", "localtunnel"], 
                      capture_output=True, text=True, timeout=60)
        
        # Start localtunnel
        result = subprocess.run(["lt", "--port", "3000"], 
                              capture_output=True, text=True, timeout=10)
        
        if "your url is:" in result.stdout.lower():
            url = result.stdout.split("your url is: ")[1].strip()
            return url
        return None
    except Exception as e:
        print(f"❌ localtunnel failed: {str(e)}")
        return None

def try_serveo():
    """Try using serveo.net (SSH-based tunnel)"""
    print("🌐 Trying serveo.net...")
    try:
        # This requires SSH which might not be available on Windows
        result = subprocess.run([
            "ssh", "-o", "StrictHostKeyChecking=no", 
            "-R", "80:localhost:3000", "serveo.net"
        ], capture_output=True, text=True, timeout=15)
        
        if "forwarding to" in result.stdout.lower():
            # Extract URL from output
            lines = result.stdout.split('\n')
            for line in lines:
                if "https://" in line and "serveo.net" in line:
                    return line.strip()
        return None
    except Exception as e:
        print(f"❌ serveo failed: {str(e)}")
        return None

def create_qr_code(url):
    """Create a QR code for easy mobile access"""
    try:
        import qrcode
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(url)
        qr.make(fit=True)
        qr.print_ascii()
        return True
    except ImportError:
        return False

def main():
    print("🚀 GeneInsight Platform - Simple Tunnel Setup")
    print("=" * 50)
    
    # Check if platform is running
    if not check_platform():
        print("❌ GeneInsight platform is not running!")
        print("Please start it with: docker-compose up -d")
        return
    
    print("✅ GeneInsight platform is running!")
    
    # Get local IP for same-network access
    local_ip = get_local_ip()
    
    print("\n🌐 SHARING OPTIONS:")
    print("=" * 30)
    
    # Option 1: Same network
    print(f"\n1. 📱 SAME WIFI/NETWORK ACCESS:")
    print(f"   URL: http://{local_ip}:3000")
    print(f"   ✅ Works if your friend is on the same WiFi")
    print(f"   ✅ No setup required")
    
    # Option 2: Try alternative tunnels
    print(f"\n2. 🌍 INTERNET ACCESS (trying alternatives...):")
    
    # Try localtunnel
    tunnel_url = try_localtunnel()
    if tunnel_url:
        print(f"   ✅ localtunnel: {tunnel_url}")
        print(f"   📱 Share this URL with your friend!")
        
        # Try to create QR code
        if create_qr_code(tunnel_url):
            print(f"   📱 QR code generated above for mobile access")
        
        return tunnel_url
    
    # Try serveo
    tunnel_url = try_serveo()
    if tunnel_url:
        print(f"   ✅ serveo: {tunnel_url}")
        print(f"   📱 Share this URL with your friend!")
        return tunnel_url
    
    # If no tunnels work, provide alternatives
    print("   ❌ Internet tunnels not available")
    
    print(f"\n3. 📺 SCREEN SHARING (EASIEST):")
    print(f"   • Zoom/Teams/Discord screen share")
    print(f"   • TeamViewer/AnyDesk remote access")
    print(f"   • Show http://localhost:3000 on your screen")
    
    print(f"\n4. 🔧 MANUAL NGROK SETUP:")
    print(f"   • Sign up at https://ngrok.com (free)")
    print(f"   • Get auth token from dashboard")
    print(f"   • Run: ./ngrok config add-authtoken YOUR_TOKEN")
    print(f"   • Run: ./ngrok http 3000")
    
    print("\n" + "=" * 50)
    print("🎯 RECOMMENDATION:")
    print("=" * 50)
    
    if local_ip != "localhost":
        print(f"📱 If same WiFi: http://{local_ip}:3000")
    print(f"📺 For immediate demo: Use screen sharing!")
    print(f"🔧 For internet access: Set up ngrok (5 min)")
    
    print("\n🧬 WHAT TO TELL YOUR FRIEND:")
    print("\"Check out this DNA analysis platform I built!\"")
    print("\"It uses AI to generate 3D protein structures from DNA!\"")
    print("\"Try the Enhanced Analysis with the BRCA1 sample!\"")
    
    # Open local browser
    try:
        webbrowser.open("http://localhost:3000")
        print(f"\n🌐 Opening platform in your browser...")
    except:
        pass

if __name__ == "__main__":
    main()
