#!/usr/bin/env python3
"""
GeneInsight Platform - Remote Access Setup
Simple solution for sharing with team lead
"""

import subprocess
import socket
import requests
import time
import webbrowser
from threading import Thread

def get_local_ip():
    """Get the local IP address"""
    try:
        # Connect to a remote server to get local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except:
        return "localhost"

def check_services():
    """Check if all services are running"""
    services = {
        "Frontend": "http://localhost:3000",
        "Backend": "http://localhost:8080/api/health",
        "ML Service": "http://localhost:5000"
    }
    
    print("🔧 Checking GeneInsight Platform Services...")
    print("=" * 50)
    
    all_running = True
    for service, url in services.items():
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ {service}: Running")
            else:
                print(f"❌ {service}: Error ({response.status_code})")
                all_running = False
        except Exception as e:
            print(f"❌ {service}: Not accessible - {str(e)}")
            all_running = False
    
    return all_running

def display_access_info():
    """Display access information for team lead"""
    local_ip = get_local_ip()
    
    print("\n" + "=" * 60)
    print("🌐 GENEINSIGHT PLATFORM - REMOTE ACCESS INFORMATION")
    print("=" * 60)
    
    print("\n🏠 LOCAL ACCESS (Your Computer):")
    print(f"   Dashboard: http://localhost:3000/dashboard")
    print(f"   Enhanced Analysis: http://localhost:3000/analyze-enhanced")
    print(f"   Basic Analysis: http://localhost:3000/analyze")
    print(f"   Backend API: http://localhost:8080")
    
    print(f"\n🌍 NETWORK ACCESS (Same Network):")
    print(f"   Dashboard: http://{local_ip}:3000/dashboard")
    print(f"   Enhanced Analysis: http://{local_ip}:3000/analyze-enhanced")
    print(f"   Basic Analysis: http://{local_ip}:3000/analyze")
    print(f"   Backend API: http://{local_ip}:8080")
    
    print("\n🔐 DEMO CREDENTIALS:")
    print("   No login required - Direct access to all features")
    
    print("\n🧪 TESTING INSTRUCTIONS FOR TEAM LEAD:")
    print("   1. Open Dashboard and test notification panel (bell icon)")
    print("   2. Test user settings (gear icon)")
    print("   3. Try Enhanced Analysis with BRCA1 sample sequence")
    print("   4. Test all 4 export features in Export tab")
    
    print("\n📋 EXPECTED RESULTS:")
    print("   ✅ 3D Structure Generation: 85% confidence")
    print("   ✅ Export Features: JSON, Report, FASTA, 3D Visualizer")
    print("   ✅ Notification Panel: Interactive management")
    print("   ✅ User Settings: Complete profile management")

def setup_ngrok_instructions():
    """Provide ngrok setup instructions"""
    print("\n" + "=" * 60)
    print("🚀 NGROK SETUP FOR INTERNET ACCESS")
    print("=" * 60)
    
    print("\n📥 DOWNLOAD & SETUP:")
    print("   1. Go to: https://ngrok.com/download")
    print("   2. Sign up for free account")
    print("   3. Download ngrok for Windows")
    print("   4. Extract to project folder")
    
    print("\n🔑 AUTHENTICATION:")
    print("   1. Go to: https://dashboard.ngrok.com/get-started/your-authtoken")
    print("   2. Copy your authtoken")
    print("   3. Run: ./ngrok config add-authtoken YOUR_AUTH_TOKEN")
    
    print("\n🌐 CREATE TUNNEL:")
    print("   1. Run: ./ngrok http 3000")
    print("   2. Copy the https URL (e.g., https://abc123.ngrok.io)")
    print("   3. Share this URL with your team lead")
    
    print("\n🎯 ALTERNATIVE OPTIONS:")
    print("   • TeamViewer/AnyDesk for screen sharing")
    print("   • VS Code Live Share for code collaboration")
    print("   • Router port forwarding (if you have access)")

def main():
    """Main function"""
    print("🧬 GeneInsight Platform - Remote Access Setup")
    print("=" * 50)
    
    # Check if services are running
    if not check_services():
        print("\n❌ Some services are not running!")
        print("Please run: docker-compose up -d")
        return
    
    print("\n✅ All services are running successfully!")
    
    # Display access information
    display_access_info()
    
    # Provide ngrok instructions
    setup_ngrok_instructions()
    
    print("\n" + "=" * 60)
    print("🎉 PLATFORM READY FOR TEAM LEAD REVIEW!")
    print("=" * 60)
    
    # Open browser to dashboard
    try:
        webbrowser.open("http://localhost:3000/dashboard")
        print("\n🌐 Opening dashboard in your default browser...")
    except:
        print("\n🌐 Please manually open: http://localhost:3000/dashboard")
    
    print("\n📞 SHARE WITH TEAM LEAD:")
    print("   • Use network URLs if on same network")
    print("   • Use ngrok for internet access")
    print("   • Use screen sharing for immediate demo")
    
    print("\n🔐 PASSWORD: No password required - direct access!")

if __name__ == "__main__":
    main()
