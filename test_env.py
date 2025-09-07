#!/usr/bin/env python3
"""
Test script to verify environment variables are loaded correctly
"""

import os
from dotenv import load_dotenv

def test_environment():
    print("🔍 Testing Environment Variables...")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    # Check each required variable
    required_vars = {
        'STABILITY_API_KEY': 'Stability AI API Key',
        'PINATA_API_KEY': 'Pinata API Key', 
        'PINATA_SECRET_KEY': 'Pinata Secret Key',
        'PRIVATE_KEY': 'Wallet Private Key',
        'JWT_SECRET': 'JWT Secret'
    }
    
    all_set = True
    
    for var, description in required_vars.items():
        value = os.getenv(var)
        if value and value != f'your_{var.lower()}_here':
            print(f"✅ {description}: SET")
        else:
            print(f"❌ {description}: NOT SET")
            all_set = False
    
    print("=" * 50)
    
    if all_set:
        print("🎉 All environment variables are properly configured!")
        return True
    else:
        print("⚠️  Some environment variables are missing or not set properly.")
        print("Please check your .env file in the root directory.")
        return False

if __name__ == "__main__":
    test_environment()
