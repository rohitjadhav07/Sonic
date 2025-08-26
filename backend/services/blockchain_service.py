import requests
import asyncio
from typing import Dict, Any, Optional
from web3 import Web3
import os

class BlockchainService:
    def __init__(self):
        # Sonic Testnet configuration
        self.rpc_url = "https://rpc.testnet.soniclabs.com"
        self.explorer_api = "https://testnet.soniclabs.com/api"
        self.web3 = Web3(Web3.HTTPProvider(self.rpc_url))
        
        # Check connection
        if not self.web3.is_connected():
            print("Warning: Could not connect to Sonic Network")

    async def get_transaction(self, tx_hash: str) -> Dict[str, Any]:
        """Get transaction details from Sonic blockchain"""
        try:
            # Get transaction from Web3
            tx = self.web3.eth.get_transaction(tx_hash)
            tx_receipt = self.web3.eth.get_transaction_receipt(tx_hash)
            
            # Get current block for confirmations
            current_block = self.web3.eth.block_number
            confirmations = current_block - tx_receipt.blockNumber if tx_receipt.blockNumber else 0
            
            # Determine transaction type and status
            tx_type = "send" if tx.value > 0 else "contract"
            status = "confirmed" if tx_receipt.status == 1 else "failed"
            
            # Convert Wei to S tokens
            amount_s = self.web3.from_wei(tx.value, 'ether')
            
            return {
                "hash": tx_hash,
                "type": tx_type,
                "amount": str(amount_s),
                "token": "S",
                "from": tx['from'],
                "to": tx.to,
                "status": status,
                "timestamp": await self._get_block_timestamp(tx_receipt.blockNumber),
                "gasUsed": str(tx_receipt.gasUsed),
                "confirmations": confirmations,
                "blockNumber": tx_receipt.blockNumber
            }
            
        except Exception as e:
            # Return mock data for demo purposes
            return self._get_mock_transaction(tx_hash)

    async def get_block_info(self, block_number: int) -> Dict[str, Any]:
        """Get block information"""
        try:
            block = self.web3.eth.get_block(block_number)
            return {
                "number": block.number,
                "hash": block.hash.hex(),
                "timestamp": block.timestamp,
                "transactions": len(block.transactions),
                "gasUsed": block.gasUsed,
                "gasLimit": block.gasLimit
            }
        except Exception as e:
            return {"error": str(e)}

    async def estimate_gas(self, transaction: Dict[str, Any]) -> int:
        """Estimate gas for a transaction"""
        try:
            gas_estimate = self.web3.eth.estimate_gas(transaction)
            return gas_estimate
        except Exception as e:
            # Return default gas estimate
            return 21000

    async def get_gas_price(self) -> int:
        """Get current gas price"""
        try:
            gas_price = self.web3.eth.gas_price
            return gas_price
        except Exception as e:
            # Return default gas price (in Wei)
            return self.web3.to_wei('20', 'gwei')

    async def _get_block_timestamp(self, block_number: int) -> str:
        """Get block timestamp and format it"""
        try:
            block = self.web3.eth.get_block(block_number)
            timestamp = block.timestamp
            from datetime import datetime
            dt = datetime.fromtimestamp(timestamp)
            return dt.strftime("%Y-%m-%d %H:%M:%S")
        except Exception:
            from datetime import datetime
            return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def _get_mock_transaction(self, tx_hash: str) -> Dict[str, Any]:
        """Return mock transaction data for demo"""
        return {
            "hash": tx_hash,
            "type": "send",
            "amount": "10.0",
            "token": "S",
            "from": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
            "to": "0x8ba1f109551bD432803012645Hac136c22C177ec",
            "status": "confirmed",
            "timestamp": "2024-01-15 14:30:25",
            "gasUsed": "21000",
            "usdValue": "25.00",
            "confirmations": 15
        }

    async def get_s_token_price(self) -> float:
        """Get current S token price in USD"""
        try:
            # This would typically call a price API
            # For demo purposes, return a mock price
            return 2.50  # $2.50 per S token
        except Exception:
            return 2.50

    async def get_network_stats(self) -> Dict[str, Any]:
        """Get Sonic network statistics"""
        try:
            latest_block = self.web3.eth.block_number
            gas_price = await self.get_gas_price()
            
            return {
                "latestBlock": latest_block,
                "gasPrice": self.web3.from_wei(gas_price, 'gwei'),
                "networkId": self.web3.eth.chain_id,
                "isConnected": self.web3.is_connected()
            }
        except Exception as e:
            return {
                "error": str(e),
                "isConnected": False
            }