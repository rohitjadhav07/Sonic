#!/usr/bin/env python3
"""
Test script for transaction service
"""

import asyncio
from services.transaction_service import TransactionService

async def test_transaction_service():
    service = TransactionService()
    
    # Test with a known Sonic testnet address (you can replace with any address)
    test_address = "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
    
    print(f"Testing transaction history for address: {test_address}")
    
    try:
        result = await service.get_transaction_history(test_address, 5)
        print(f"Success: {result['success']}")
        print(f"Transactions found: {len(result.get('transactions', []))}")
        
        if result['transactions']:
            print("\nFirst transaction:")
            tx = result['transactions'][0]
            print(f"  Hash: {tx['hash']}")
            print(f"  Direction: {tx['direction']}")
            print(f"  Amount: {tx['value']} S")
            print(f"  Status: {tx['status']}")
            print(f"  Time: {tx['timestamp']}")
        else:
            print("No transactions found for this address")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_transaction_service())