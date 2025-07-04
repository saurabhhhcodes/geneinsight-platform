#!/usr/bin/env python3
"""
Test OTP Authentication System
"""

import requests
import json

def test_otp_auth():
    print('🔐 Testing OTP Authentication System...')

    # Test OTP sending
    test_email = 'test@geneinsight.com'
    try:
        response = requests.post('http://localhost:8080/api/auth/send-otp', 
                                json={'email': test_email, 'type': 'REGISTRATION'}, 
                                timeout=10)

        if response.status_code == 200:
            data = response.json()
            print('✅ OTP Sending SUCCESS!')
            print(f'   Message: {data.get("message", "N/A")}')
            print(f'   Email: {data.get("email", "N/A")}')
            print(f'   Type: {data.get("type", "N/A")}')
            
            # Test OTP verification with mock code
            print('\n🔐 Testing OTP Verification...')
            response2 = requests.post('http://localhost:8080/api/auth/verify-otp',
                                     json={'email': test_email, 'otpCode': '123456', 'type': 'REGISTRATION'},
                                     timeout=10)
            
            if response2.status_code == 400:  # Expected failure with mock code
                data2 = response2.json()
                print('✅ OTP Verification endpoint working (expected failure with mock code)')
                print(f'   Error: {data2.get("error", "N/A")}')
                print(f'   Remaining Attempts: {data2.get("remainingAttempts", "N/A")}')
            else:
                print(f'❌ Unexpected response: {response2.status_code}')
                print(f'   Response: {response2.text}')
        else:
            print(f'❌ OTP Sending FAILED: {response.status_code}')
            print(f'   Response: {response.text}')
    except Exception as e:
        print(f'❌ Test failed with exception: {str(e)}')

if __name__ == "__main__":
    test_otp_auth()
