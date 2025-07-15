#!/usr/bin/env python3
"""
Automated Render.com Deployment Helper

This script provides the exact configuration for Render deployment.
"""

import json
import webbrowser
import time

def show_render_config():
    """Show the exact Render configuration"""
    
    print("🎨 RENDER.COM DEPLOYMENT CONFIGURATION")
    print("=" * 60)
    
    config = {
        "name": "geneinsight-platform",
        "type": "web_service",
        "env": "python",
        "region": "oregon",
        "plan": "free",
        "buildCommand": "cd ml_service && pip install --upgrade pip && pip install -r requirements.txt && pip install transformers torch langchain-community --no-cache-dir",
        "startCommand": "cd ml_service && python app.py",
        "envVars": {
            "FLASK_ENV": "production",
            "TRANSFORMERS_CACHE": "/opt/render/project/src/transformers_cache",
            "PORT": "10000",
            "PYTHONUNBUFFERED": "1"
        },
        "disk": {
            "name": "model-cache",
            "mountPath": "/opt/render/project/src/transformers_cache",
            "sizeGB": 1
        }
    }
    
    print("📋 Service Configuration:")
    print(f"   Name: {config['name']}")
    print(f"   Type: {config['type']}")
    print(f"   Environment: {config['env']}")
    print(f"   Region: {config['region']}")
    print(f"   Plan: {config['plan']}")
    
    print(f"\n🔧 Build Configuration:")
    print(f"   Build Command: {config['buildCommand']}")
    print(f"   Start Command: {config['startCommand']}")
    
    print(f"\n⚙️ Environment Variables:")
    for key, value in config['envVars'].items():
        print(f"   {key} = {value}")
    
    print(f"\n💾 Disk Configuration:")
    print(f"   Name: {config['disk']['name']}")
    print(f"   Mount Path: {config['disk']['mountPath']}")
    print(f"   Size: {config['disk']['sizeGB']} GB")
    
    return config

def open_render_deployment():
    """Open Render deployment page"""
    
    print(f"\n🚀 OPENING RENDER DEPLOYMENT...")
    
    # Repository URL
    repo_url = "https://github.com/saurabhhhcodes/geneinsight-platform"
    
    # Render deploy URL
    render_url = f"https://render.com/deploy?repo={repo_url}"
    
    print(f"📦 Repository: {repo_url}")
    print(f"🎨 Render Deploy: {render_url}")
    
    try:
        print(f"\n🌐 Opening Render deployment page in browser...")
        webbrowser.open(render_url)
        print(f"✅ Browser opened successfully!")
    except Exception as e:
        print(f"❌ Could not open browser: {e}")
        print(f"📋 Please manually visit: {render_url}")
    
    return render_url

def show_deployment_steps():
    """Show step-by-step deployment instructions"""
    
    print(f"\n📋 RENDER DEPLOYMENT STEPS")
    print("=" * 60)
    
    steps = [
        "1. 🌐 Visit: https://render.com",
        "2. 🔐 Sign up/login with GitHub account",
        "3. ➕ Click 'New +' → 'Web Service'",
        "4. 🔗 Connect repository: saurabhhhcodes/geneinsight-platform",
        "5. ⚙️ Use the configuration shown above",
        "6. 🚀 Click 'Create Web Service'",
        "7. ⏳ Wait 10-15 minutes for deployment",
        "8. 🎉 Get your live URL!"
    ]
    
    for step in steps:
        print(f"   {step}")
    
    print(f"\n⏱️ Expected Timeline:")
    print(f"   • 0-5 min: Installing dependencies")
    print(f"   • 5-10 min: Downloading AI model (351MB)")
    print(f"   • 10-15 min: Starting application")
    print(f"   • 15+ min: ✅ LIVE AND READY!")

def show_expected_urls():
    """Show what URLs will be available"""
    
    print(f"\n🌐 YOUR LIVE APPLICATION URLS")
    print("=" * 60)
    
    base_url = "https://geneinsight-platform-[random].onrender.com"
    
    urls = [
        ("Main Application", base_url),
        ("AI Chat Interface", f"{base_url}/ai-chat"),
        ("Molecular Docking", f"{base_url}/docking"),
        ("Health Check", f"{base_url}/health"),
        ("LangChain Status", f"{base_url}/langchain/status")
    ]
    
    for name, url in urls:
        print(f"   • {name}: {url}")
    
    print(f"\n🧬 Features Available:")
    features = [
        "✅ LangChain AI: Full conversational molecular analysis",
        "✅ COVID-19 Analysis: Expert viral protein insights",
        "✅ Sequence Detection: Automatic protein recognition",
        "✅ 3D Visualization: Interactive molecular viewer",
        "✅ Molecular Docking: Protein-ligand simulations",
        "✅ Database: PostgreSQL for data persistence"
    ]
    
    for feature in features:
        print(f"   {feature}")

def main():
    """Main deployment helper"""
    
    print("🎨 RENDER.COM DEPLOYMENT HELPER")
    print("=" * 80)
    print("🧬 GeneInsight Platform - Complete AI-Powered Molecular Analysis")
    print("=" * 80)
    
    # Show configuration
    config = show_render_config()
    
    # Show deployment steps
    show_deployment_steps()
    
    # Show expected URLs
    show_expected_urls()
    
    # Ask user if they want to open Render
    print(f"\n🚀 READY TO DEPLOY?")
    print("=" * 30)
    
    choice = input("Open Render deployment page? (y/n): ").lower().strip()
    
    if choice in ['y', 'yes', '1', 'true']:
        render_url = open_render_deployment()
        
        print(f"\n✅ DEPLOYMENT INITIATED!")
        print(f"🎯 Follow the steps above in the opened browser tab")
        print(f"⏳ Your platform will be live in ~15 minutes")
        
        # Wait and offer to test
        print(f"\n⏱️ Waiting for deployment...")
        print(f"💡 Come back here after deployment completes to test!")
        
        input("\nPress Enter when deployment is complete...")
        
        # Ask for the deployed URL to test
        deployed_url = input("Enter your deployed URL (e.g., https://geneinsight-platform-abc123.onrender.com): ").strip()
        
        if deployed_url:
            print(f"\n🧪 Testing deployment at: {deployed_url}")
            print(f"Run this command to test:")
            print(f"python test-complete-deployment.py {deployed_url}")
    else:
        print(f"\n📋 Manual deployment:")
        print(f"1. Visit: https://render.com")
        print(f"2. Use the configuration shown above")
        print(f"3. Deploy your GeneInsight Platform!")
    
    print(f"\n🎉 Your AI-powered molecular analysis platform will be amazing!")
    print(f"🧬 Users will have access to full LangChain conversational AI!")

if __name__ == "__main__":
    main()
