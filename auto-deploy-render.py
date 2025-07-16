#!/usr/bin/env python3
"""
Automated Render.com Deployment Script for GeneInsight LangServe
This script will help automate the deployment process
"""

import requests
import json
import os
import webbrowser
import time

def open_render_deployment():
    """Open Render.com with pre-filled deployment settings"""
    
    # GitHub repository details
    github_repo = "saurabhhhcodes/geneinsight-platform"
    
    # Render.com new service URL with pre-filled parameters
    render_url = f"https://dashboard.render.com/create?type=web_service&repo={github_repo}"
    
    print("🚀 Opening Render.com deployment page...")
    print(f"📁 Repository: {github_repo}")
    print(f"🌐 Opening: {render_url}")
    
    # Open the URL in default browser
    webbrowser.open(render_url)
    
    return render_url

def display_deployment_settings():
    """Display the exact settings to use in Render.com"""
    
    settings = {
        "name": "geneinsight-langserve",
        "region": "Oregon (US West)",
        "branch": "main",
        "runtime": "Python 3",
        "build_command": "pip install -r requirements_minimal.txt",
        "start_command": "python railway_minimal.py",
        "environment_variables": {
            "PYTHONUNBUFFERED": "1",
            "PORT": "8000"
        }
    }
    
    print("\n" + "="*60)
    print("🎯 RENDER.COM DEPLOYMENT SETTINGS")
    print("="*60)
    print(f"📝 Name: {settings['name']}")
    print(f"🌍 Region: {settings['region']}")
    print(f"🌿 Branch: {settings['branch']}")
    print(f"🐍 Runtime: {settings['runtime']}")
    print(f"🔨 Build Command: {settings['build_command']}")
    print(f"▶️  Start Command: {settings['start_command']}")
    print("\n📋 Environment Variables:")
    for key, value in settings['environment_variables'].items():
        print(f"   {key} = {value}")
    print("="*60)
    
    return settings

def wait_for_deployment():
    """Wait for user confirmation of deployment"""
    
    print("\n⏳ Waiting for deployment to complete...")
    print("📊 You should see logs in Render.com showing:")
    print("   - Installing dependencies...")
    print("   - Starting server...")
    print("   - INFO: Uvicorn running on http://0.0.0.0:8000")
    
    input("\n✅ Press ENTER when deployment is complete and you have your Render URL...")
    
    return True

def get_render_url():
    """Get the deployed Render URL from user"""
    
    print("\n🌐 Your Render.com deployment should give you a URL like:")
    print("   https://geneinsight-langserve.onrender.com")
    
    while True:
        url = input("\n📝 Please paste your Render deployment URL here: ").strip()
        
        if url.startswith('https://') and '.onrender.com' in url:
            return url
        else:
            print("❌ Please enter a valid Render.com URL (should start with https:// and contain .onrender.com)")

def test_deployment(url):
    """Test the deployed backend"""
    
    print(f"\n🧪 Testing deployment at: {url}")
    
    # Test health endpoint
    try:
        print("🔍 Testing health endpoint...")
        response = requests.get(f"{url}/health", timeout=10)
        if response.status_code == 200:
            print("✅ Health check: PASSED")
            health_data = response.json()
            print(f"   Status: {health_data.get('status')}")
            print(f"   Service: {health_data.get('service')}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False
    
    # Test sequence analysis
    try:
        print("🧬 Testing sequence analysis...")
        test_data = {
            "input": {
                "sequence": "ATCGATCGATCG",
                "sequence_type": "DNA"
            }
        }
        response = requests.post(f"{url}/analyze/sequence/invoke", json=test_data, timeout=15)
        if response.status_code == 200:
            print("✅ Sequence analysis: PASSED")
            result = response.json()
            if 'output' in result and 'success' in result['output']:
                print(f"   Analysis successful: {result['output']['success']}")
        else:
            print(f"❌ Sequence analysis failed: {response.status_code}")
    except Exception as e:
        print(f"⚠️  Sequence analysis error: {e}")
    
    # Test API documentation
    print(f"📚 API Documentation: {url}/docs")
    print(f"🎮 Sequence Playground: {url}/analyze/sequence/playground/")
    print(f"💬 Chat Playground: {url}/langchain/chat/playground/")
    
    return True

def update_vercel_instructions(render_url):
    """Provide instructions to update Vercel"""
    
    print("\n" + "="*60)
    print("🔄 UPDATE VERCEL FRONTEND")
    print("="*60)
    print("1. Go to: https://vercel.com/dashboard")
    print("2. Select: geneinsight-platform")
    print("3. Go to: Settings → Environment Variables")
    print("4. Add/Update:")
    print(f"   Key: NEXT_PUBLIC_API_URL")
    print(f"   Value: {render_url}")
    print("   Environment: All (Production, Preview, Development)")
    print("5. Go to: Deployments → Redeploy latest")
    print("="*60)

def main():
    """Main deployment automation function"""
    
    print("🚀 GeneInsight LangServe - Automated Render.com Deployment")
    print("=" * 60)
    
    # Step 1: Display settings
    settings = display_deployment_settings()
    
    # Step 2: Open Render.com
    input("\n📋 Press ENTER to open Render.com deployment page...")
    render_url = open_render_deployment()
    
    print("\n📝 MANUAL STEPS IN RENDER.COM:")
    print("1. Sign up/Login with GitHub")
    print("2. Click 'Connect' next to your repository")
    print("3. Fill in the settings shown above")
    print("4. Click 'Create Web Service'")
    
    # Step 3: Wait for deployment
    wait_for_deployment()
    
    # Step 4: Get deployment URL
    deployed_url = get_render_url()
    
    # Step 5: Test deployment
    if test_deployment(deployed_url):
        print("\n🎉 DEPLOYMENT SUCCESSFUL!")
        
        # Step 6: Vercel update instructions
        update_vercel_instructions(deployed_url)
        
        print(f"\n✅ Your GeneInsight platform is now running:")
        print(f"   Backend:  {deployed_url}")
        print(f"   Frontend: https://geneinsight-platform.vercel.app")
        print(f"   Docs:     {deployed_url}/docs")
        
        print("\n💰 Cost: $0/month (completely free!)")
        print("🎯 Features: Full LangServe + LangChain integration")
        
    else:
        print("\n❌ Deployment test failed. Please check Render.com logs.")

if __name__ == "__main__":
    main()
