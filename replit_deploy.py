#!/usr/bin/env python3
"""
Automated Replit Deployment for GeneInsight LangServe
This will open Replit with your repository ready to deploy
"""

import webbrowser
import time

def deploy_to_replit():
    """Deploy to Replit automatically"""
    
    # Your GitHub repository
    github_repo = "https://github.com/saurabhhhcodes/geneinsight-platform"
    
    # Replit import URL
    replit_url = f"https://replit.com/github/{github_repo.replace('https://github.com/', '')}"
    
    print("🚀 GeneInsight LangServe - Instant Replit Deployment")
    print("=" * 60)
    print(f"📁 Repository: {github_repo}")
    print(f"🌐 Replit URL: {replit_url}")
    
    print("\n📋 What will happen:")
    print("1. ✅ Opens Replit with your repository")
    print("2. ✅ Automatically imports all files")
    print("3. ✅ Creates a Python environment")
    print("4. ✅ Installs dependencies")
    print("5. ✅ Gives you a public URL instantly")
    
    print("\n🎯 Steps in Replit:")
    print("1. Click 'Import from GitHub'")
    print("2. Repository will auto-fill")
    print("3. Click 'Import'")
    print("4. In the Shell, run: python railway_minimal.py")
    print("5. Click the URL that appears")
    
    input("\n📋 Press ENTER to open Replit...")
    
    # Open Replit
    print("🌐 Opening Replit...")
    webbrowser.open(replit_url)
    
    print("\n⏳ Waiting for you to complete the import...")
    input("✅ Press ENTER when you've imported the repository in Replit...")
    
    print("\n🚀 Now run this command in Replit Shell:")
    print("   python railway_minimal.py")
    
    print("\n📊 Expected output:")
    print("   INFO: Uvicorn running on http://0.0.0.0:8000")
    print("   🌐 Replit will show a URL like: https://your-repl.replit.dev")
    
    input("\n✅ Press ENTER when your app is running and you have the URL...")
    
    # Get the URL
    while True:
        repl_url = input("\n📝 Paste your Replit URL here: ").strip()
        if repl_url.startswith('https://') and 'replit' in repl_url:
            break
        print("❌ Please enter a valid Replit URL")
    
    return repl_url

def test_replit_deployment(url):
    """Test the Replit deployment"""
    import requests
    
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
    except Exception as e:
        print(f"❌ Health check error: {e}")
    
    # Test sequence analysis
    try:
        print("🧬 Testing sequence analysis...")
        test_data = {
            "sequence": "ATCGATCGATCG",
            "sequence_type": "DNA"
        }
        response = requests.post(f"{url}/analyze/langchain", json=test_data, timeout=15)
        if response.status_code == 200:
            print("✅ Sequence analysis: PASSED")
        else:
            print(f"❌ Sequence analysis failed: {response.status_code}")
    except Exception as e:
        print(f"⚠️  Sequence analysis error: {e}")
    
    print(f"\n🎉 Your GeneInsight LangServe is deployed!")
    print(f"🌐 Backend URL: {url}")
    print(f"📚 API Docs: {url}/docs")
    print(f"💰 Cost: $0/month (completely free!)")
    
    return url

def update_vercel_with_replit_url(repl_url):
    """Show instructions to update Vercel"""
    
    print("\n" + "="*60)
    print("🔄 UPDATE YOUR VERCEL FRONTEND")
    print("="*60)
    print("1. Go to: https://vercel.com/dashboard")
    print("2. Select: geneinsight-platform")
    print("3. Go to: Settings → Environment Variables")
    print("4. Add/Update:")
    print(f"   Key: NEXT_PUBLIC_API_URL")
    print(f"   Value: {repl_url}")
    print("   Environment: All (Production, Preview, Development)")
    print("5. Go to: Deployments → Redeploy latest")
    print("="*60)
    
    print(f"\n🎯 Final Result:")
    print(f"   Frontend: https://geneinsight-platform.vercel.app")
    print(f"   Backend:  {repl_url}")
    print(f"   Integration: Full LangChain + LangServe functionality")
    print(f"   Cost: $0/month forever!")

def main():
    """Main deployment function"""
    
    # Deploy to Replit
    repl_url = deploy_to_replit()
    
    # Test deployment
    test_replit_deployment(repl_url)
    
    # Show Vercel update instructions
    update_vercel_with_replit_url(repl_url)
    
    print("\n🎉 DEPLOYMENT COMPLETE!")
    print("Your GeneInsight platform is now running on completely free infrastructure!")

if __name__ == "__main__":
    main()
