#!/usr/bin/env python3
"""
Create a public tunnel for GeneInsight Platform
Simple script to share with friends
"""

from pyngrok import ngrok
import time
import requests

def create_tunnel():
    print("🚀 Creating public tunnel for GeneInsight Platform...")
    print("=" * 50)
    
    try:
        # Check if the local server is running
        print("🔧 Checking if GeneInsight is running...")
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code != 200:
            print("❌ GeneInsight platform is not running on localhost:3000")
            print("Please make sure Docker containers are running:")
            print("   docker-compose up -d")
            return
        print("✅ GeneInsight platform is running!")
        
    except Exception as e:
        print("❌ Cannot connect to GeneInsight platform")
        print(f"Error: {str(e)}")
        print("Please make sure Docker containers are running:")
        print("   docker-compose up -d")
        return
    
    try:
        # Create ngrok tunnel
        print("\n🌐 Creating public tunnel...")
        public_url = ngrok.connect(3000)
        
        print("\n" + "=" * 60)
        print("🎉 SUCCESS! Your GeneInsight Platform is now public!")
        print("=" * 60)
        print(f"\n🌍 Public URL: {public_url}")
        print(f"🏠 Local URL:  http://localhost:3000")
        
        print("\n📱 SHARE THIS WITH YOUR FRIEND:")
        print("=" * 40)
        print(f"🔗 {public_url}")
        print("=" * 40)
        
        print("\n🧪 WHAT YOUR FRIEND CAN DO:")
        print("1. 🧬 Click 'Enhanced Analysis' on the home page")
        print("2. 🔬 Try the BRCA1 sample sequence")
        print("3. ⚡ Watch AI generate 3D protein structure")
        print("4. 💾 Test all the export features")
        print("5. 🔔 Check out notifications and settings")
        
        print("\n🔐 NO PASSWORD NEEDED - Everything just works!")
        
        print("\n⏰ TUNNEL STATUS:")
        print("✅ Tunnel is active and running")
        print("🔄 Will stay active until you stop this script")
        print("⚠️  Press Ctrl+C to stop the tunnel")
        
        # Keep the tunnel alive
        print("\n🚀 Tunnel is ready! Your friend can now access the platform.")
        print("💡 Tip: Keep this window open while your friend is testing")
        
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n\n🛑 Stopping tunnel...")
            ngrok.disconnect(public_url)
            print("✅ Tunnel stopped successfully!")
            
    except Exception as e:
        print(f"\n❌ Failed to create tunnel: {str(e)}")
        print("\nℹ️  This might be because:")
        print("   • ngrok requires a free account (sign up at https://ngrok.com)")
        print("   • You need to set up an auth token")
        print("   • Network connectivity issues")
        
        print("\n🔧 ALTERNATIVE OPTIONS:")
        print("1. 📱 Screen share (Zoom/Teams) - Show your screen")
        print("2. 🌐 Same WiFi - Share http://[your-ip]:3000")
        print("3. 🔗 Manual ngrok setup - Follow ngrok.com instructions")

if __name__ == "__main__":
    create_tunnel()
