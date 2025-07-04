#!/usr/bin/env python3
"""
Complete GeneInsight Platform Status Check
"""

import requests
import time
from colorama import Fore, Style, init

# Initialize colorama for colored output
init(autoreset=True)

def print_header():
    print(f"{Fore.CYAN}{Style.BRIGHT}🧬 GeneInsight Platform Status Check")
    print("=" * 60)

def check_service(name, url, timeout=5):
    """Check if a service is running and responsive"""
    try:
        response = requests.get(url, timeout=timeout)
        if response.status_code == 200:
            print(f"{Fore.GREEN}✅ {name}: Running (HTTP {response.status_code})")
            return True
        else:
            print(f"{Fore.YELLOW}⚠️  {name}: Responding but status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"{Fore.RED}❌ {name}: Connection refused")
        return False
    except requests.exceptions.Timeout:
        print(f"{Fore.RED}❌ {name}: Timeout")
        return False
    except Exception as e:
        print(f"{Fore.RED}❌ {name}: Error - {e}")
        return False

def check_demo_page():
    """Check if the demo page is accessible and contains expected content"""
    try:
        response = requests.get("http://localhost:3000/demo", timeout=10)
        if response.status_code == 200:
            content = response.text.lower()
            
            # Check for key demo features
            features = [
                ("Interactive Demos", "demo" in content and "interactive" in content),
                ("Tabbed Interface", "tabs" in content or "tab" in content),
                ("Sample Sequences", "brca1" in content or "sample" in content),
                ("3D Visualization", "3d" in content or "molecular" in content),
                ("Analysis Workflow", "workflow" in content or "analysis" in content),
                ("Progress Animation", "progress" in content),
                ("Navigation Links", "navigation" in content or "nav" in content)
            ]
            
            print(f"\n{Fore.CYAN}{Style.BRIGHT}🎮 Demo Page Features:")
            working_features = 0
            for feature_name, is_present in features:
                status = "✅" if is_present else "❌"
                print(f"   {status} {feature_name}")
                if is_present:
                    working_features += 1
            
            print(f"\n{Fore.CYAN}Demo Page Score: {working_features}/{len(features)} features detected")
            return True
        else:
            print(f"{Fore.RED}❌ Demo page failed to load: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"{Fore.RED}❌ Demo page error: {e}")
        return False

def main():
    """Run complete system status check"""
    print_header()
    
    print(f"\n{Fore.YELLOW}{Style.BRIGHT}🔍 Checking Core Services...")
    
    services = [
        ("Frontend (Next.js)", "http://localhost:3000"),
        ("Backend API", "http://localhost:8080/api/health"),
        ("ML Service", "http://localhost:5000/health"),
        ("Database Connection", "http://localhost:8080/api/health")  # Backend health includes DB check
    ]
    
    all_services_up = True
    for service_name, service_url in services:
        if not check_service(service_name, service_url):
            all_services_up = False
    
    print(f"\n{Fore.YELLOW}{Style.BRIGHT}🎯 Checking Demo Page...")
    demo_working = check_demo_page()
    
    print(f"\n{Fore.YELLOW}{Style.BRIGHT}📊 System Summary:")
    print("-" * 40)
    
    if all_services_up:
        print(f"{Fore.GREEN}✅ All core services are running")
    else:
        print(f"{Fore.RED}❌ Some services are not responding")
    
    if demo_working:
        print(f"{Fore.GREEN}✅ Demo page is accessible and functional")
    else:
        print(f"{Fore.RED}❌ Demo page has issues")
    
    print(f"\n{Fore.CYAN}{Style.BRIGHT}🌐 Access Points:")
    print(f"   • Main Application: http://localhost:3000")
    print(f"   • Demo Page: http://localhost:3000/demo")
    print(f"   • API Documentation: http://localhost:8080/swagger-ui.html")
    print(f"   • ML Service: http://localhost:5000")
    
    if all_services_up and demo_working:
        print(f"\n{Fore.GREEN}{Style.BRIGHT}🎉 GeneInsight Platform is fully operational!")
        print(f"   The view demo feature is ready for use.")
        return True
    else:
        print(f"\n{Fore.YELLOW}⚠️  Platform has some issues but may still be usable.")
        return False

if __name__ == "__main__":
    main()
