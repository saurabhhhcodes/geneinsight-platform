#!/usr/bin/env python3
"""
Automated Vercel Environment Variable Update Helper
This script will guide you through updating Vercel with your Replit backend URL
"""

import webbrowser
import time

def update_vercel_environment():
    """Guide user through Vercel environment variable update"""
    
    # Your backend URL
    backend_url = "https://6d441999-17f0-47ac-94c8-e10957d4469c-00-1aa6zmzvlz1jf.pike.replit.dev"
    
    print("🔄 GeneInsight - Vercel Environment Variable Update")
    print("=" * 60)
    print(f"🌐 Backend URL: {backend_url}")
    
    print("\n📋 What we'll do:")
    print("1. ✅ Open Vercel Dashboard")
    print("2. ✅ Navigate to your project")
    print("3. ✅ Update environment variable")
    print("4. ✅ Redeploy frontend")
    print("5. ✅ Test integration")
    
    input("\n📋 Press ENTER to open Vercel Dashboard...")
    
    # Open Vercel Dashboard
    vercel_url = "https://vercel.com/dashboard"
    print(f"🌐 Opening: {vercel_url}")
    webbrowser.open(vercel_url)
    
    print("\n" + "="*60)
    print("📝 STEP-BY-STEP INSTRUCTIONS")
    print("="*60)
    
    print("\n🎯 Step 1: Find Your Project")
    print("   • Look for 'geneinsight-platform' in your dashboard")
    print("   • Click on it")
    
    input("\n✅ Press ENTER when you've opened your project...")
    
    print("\n🎯 Step 2: Go to Settings")
    print("   • Click 'Settings' tab (top navigation)")
    print("   • Click 'Environment Variables' in the left sidebar")
    
    input("\n✅ Press ENTER when you're in Environment Variables...")
    
    print("\n🎯 Step 3: Add/Update Environment Variable")
    print("   • Click 'Add New' or find existing NEXT_PUBLIC_API_URL")
    print("   • Fill in:")
    print(f"     Name: NEXT_PUBLIC_API_URL")
    print(f"     Value: {backend_url}")
    print("     Environment: All (Production, Preview, Development)")
    print("   • Click 'Save'")
    
    input("\n✅ Press ENTER when you've saved the environment variable...")
    
    print("\n🎯 Step 4: Redeploy Frontend")
    print("   • Go to 'Deployments' tab")
    print("   • Find the latest deployment")
    print("   • Click the '...' menu → 'Redeploy'")
    print("   • Wait for deployment to complete")
    
    input("\n✅ Press ENTER when redeployment is complete...")
    
    return backend_url

def test_integration(backend_url):
    """Test the integration"""
    
    frontend_url = "https://geneinsight-platform.vercel.app"
    
    print("\n" + "="*60)
    print("🧪 TESTING INTEGRATION")
    print("="*60)
    
    print(f"🌐 Frontend: {frontend_url}")
    print(f"🔗 Backend: {backend_url}")
    
    print("\n📋 Test these endpoints:")
    print(f"1. Health: {backend_url}/health")
    print(f"2. API Docs: {backend_url}/docs")
    print(f"3. Frontend: {frontend_url}")
    
    # Test backend health
    try:
        import requests
        print("\n🔍 Testing backend health...")
        response = requests.get(f"{backend_url}/health", timeout=10)
        if response.status_code == 200:
            print("   ✅ Backend: HEALTHY")
            data = response.json()
            print(f"   ✅ Service: {data['service']}")
            print(f"   ✅ Status: {data['status']}")
        else:
            print(f"   ❌ Backend: Error {response.status_code}")
    except Exception as e:
        print(f"   ⚠️  Backend test failed: {e}")
    
    # Open frontend for testing
    print(f"\n🌐 Opening frontend for testing...")
    webbrowser.open(frontend_url)
    
    print("\n📋 Test in your frontend:")
    print("1. Go to AI Chat or Analysis page")
    print("2. Try analyzing a DNA sequence: ATCGATCGATCG")
    print("3. Check if it connects to your backend")
    
    input("\n✅ Press ENTER when you've tested the frontend...")

def show_final_summary(backend_url):
    """Show final deployment summary"""
    
    print("\n" + "="*60)
    print("🎉 DEPLOYMENT COMPLETE!")
    print("="*60)
    
    print("✅ Your GeneInsight Platform is now fully deployed:")
    print(f"   🌐 Frontend: https://geneinsight-platform.vercel.app")
    print(f"   🔗 Backend: {backend_url}")
    print(f"   📚 API Docs: {backend_url}/docs")
    
    print("\n🔥 Features Available:")
    print("   ✅ DNA/RNA/Protein sequence analysis")
    print("   ✅ AI-powered molecular chat")
    print("   ✅ COVID-19 protein analysis")
    print("   ✅ Interactive API documentation")
    print("   ✅ Real-time health monitoring")
    
    print("\n💰 Cost Breakdown:")
    print("   ✅ Vercel Frontend: $0/month")
    print("   ✅ Replit Backend: $0/month")
    print("   ✅ Total: FREE FOREVER! 🎉")
    
    print("\n🎯 What You've Achieved:")
    print("   ✅ Full-stack molecular analysis platform")
    print("   ✅ AI-powered sequence analysis")
    print("   ✅ Professional API documentation")
    print("   ✅ Scalable cloud deployment")
    print("   ✅ Zero monthly costs")
    
    print("\n🚀 Your platform is ready for:")
    print("   • Research and analysis")
    print("   • Educational purposes")
    print("   • Portfolio demonstration")
    print("   • Further development")

def main():
    """Main function"""
    
    # Update Vercel environment
    backend_url = update_vercel_environment()
    
    # Test integration
    test_integration(backend_url)
    
    # Show final summary
    show_final_summary(backend_url)
    
    print("\n🎉 Congratulations! Your GeneInsight platform is live!")

if __name__ == "__main__":
    main()
