import asyncio
import uuid
from typing import Dict, Any, Optional
from web3 import Web3
import requests

class WalletService:
    def __init__(self):
        self.rpc_url = "https://rpc.testnet.soniclabs.com"
        self.web3 = Web3(Web3.HTTPProvider(self.rpc_url))
        self.base_payment_url = "https://astra-ai.vercel.app/pay"

    async def get_balance(self, address: str) -> Dict[str, Any]:
        """Get wallet balance for S tokens and other assets"""
        try:
            # Get S token balance
            balance_wei = self.web3.eth.get_balance(address)
            balance_s = self.web3.from_wei(balance_wei, 'ether')
            
            # Get USD value (mock price for demo)
            s_price = await self._get_s_token_price()
            usd_value = float(balance_s) * s_price
            
            return {
                "token": "S",
                "balance": f"{balance_s:.6f}",
                "usdValue": f"{usd_value:.2f}",
                "change24h": "+5.2",  # Mock 24h change
                "address": address
            }
            
        except Exception as e:
            # Return mock data for demo
            return self._get_mock_balance(address)

    async def create_payment_link(self, amount: float, token: str = "S", message: str = "") -> Dict[str, Any]:
        """Create a payment link with QR code"""
        try:
            # Generate unique payment ID
            payment_id = str(uuid.uuid4())
            
            # Create payment link
            payment_link = f"{self.base_payment_url}?amount={amount}&token={token}&id={payment_id}"
            
            if message:
                payment_link += f"&message={message}"
            
            return {
                "amount": str(amount),
                "token": token,
                "link": payment_link,
                "paymentId": payment_id,
                "message": message,
                "status": "active"
            }
            
        except Exception as e:
            return {"error": str(e)}

    async def get_transaction_history(self, address: str, limit: int = 10) -> list:
        """Get transaction history for an address"""
        try:
            # This would typically query the blockchain or indexer
            # For demo, return mock transactions
            return self._get_mock_transactions(address, limit)
            
        except Exception as e:
            return []

    async def estimate_transaction_fee(self, from_addr: str, to_addr: str, amount: float) -> Dict[str, Any]:
        """Estimate transaction fees"""
        try:
            # Convert amount to Wei
            amount_wei = self.web3.to_wei(amount, 'ether')
            
            # Estimate gas
            gas_estimate = self.web3.eth.estimate_gas({
                'from': from_addr,
                'to': to_addr,
                'value': amount_wei
            })
            
            # Get gas price
            gas_price = self.web3.eth.gas_price
            
            # Calculate fee
            fee_wei = gas_estimate * gas_price
            fee_s = self.web3.from_wei(fee_wei, 'ether')
            
            return {
                "gasEstimate": gas_estimate,
                "gasPrice": self.web3.from_wei(gas_price, 'gwei'),
                "feeS": f"{fee_s:.6f}",
                "feeUSD": f"{float(fee_s) * await self._get_s_token_price():.4f}"
            }
            
        except Exception as e:
            # Return mock fee estimate
            return {
                "gasEstimate": 21000,
                "gasPrice": "1",  # Sonic's ultra-low gas prices
                "feeS": "0.000021",
                "feeUSD": "0.0000525"
            }

    async def validate_address(self, address: str) -> bool:
        """Validate if address is a valid Ethereum/Sei address"""
        try:
            return self.web3.is_address(address)
        except Exception:
            return False

    async def _get_s_token_price(self) -> float:
        """Get current S token price in USD"""
        try:
            # This would call a real price API
            # For demo purposes, return mock price
            return 2.50
        except Exception:
            return 2.50

    def _get_mock_balance(self, address: str) -> Dict[str, Any]:
        """Return mock balance data for demo"""
        return {
            "token": "S",
            "balance": "123.456789",
            "usdValue": "308.64",
            "change24h": "+5.2",
            "address": address
        }

    def _get_mock_transactions(self, address: str, limit: int) -> list:
        """Return mock transaction history"""
        return [
            {
                "hash": "0x1234567890abcdef1234567890abcdef12345678",
                "type": "send",
                "amount": "10.0",
                "token": "S",
                "to": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
                "status": "confirmed",
                "timestamp": "2024-01-15 14:30:25",
                "usdValue": "25.00"
            },
            {
                "hash": "0xabcdef1234567890abcdef1234567890abcdef12",
                "type": "receive",
                "amount": "50.0",
                "token": "S",
                "from": "0x8ba1f109551bD432803012645Hac136c22C177ec",
                "status": "confirmed",
                "timestamp": "2024-01-14 09:15:10",
                "usdValue": "125.00"
            }
        ][:limit]