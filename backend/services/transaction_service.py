"""
Transaction History Service for Smart Sonic
Fetches real transaction data from Sonic testnet
"""

import asyncio
import aiohttp
from typing import Dict, List, Any, Optional
from datetime import datetime
import json

class TransactionService:
    def __init__(self):
        self.rpc_url = "https://rpc.testnet.soniclabs.com"
        self.explorer_api = "https://testnet.soniclabs.com/api"
        
    async def get_transaction_history(self, address: str, limit: int = 10) -> Dict[str, Any]:
        """Get transaction history for an address from Sonic testnet"""
        try:
            async with aiohttp.ClientSession() as session:
                # Get latest transactions using RPC
                transactions = await self._fetch_transactions_rpc(session, address, limit)
                
                # Format transactions for display
                formatted_txs = []
                for tx in transactions:
                    formatted_tx = await self._format_transaction(session, tx, address)
                    if formatted_tx:
                        formatted_txs.append(formatted_tx)
                
                return {
                    "success": True,
                    "address": address,
                    "transactions": formatted_txs[:limit],
                    "total_found": len(formatted_txs)
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to fetch transaction history: {str(e)}",
                "transactions": []
            }
    
    async def _fetch_transactions_rpc(self, session: aiohttp.ClientSession, address: str, limit: int) -> List[Dict]:
        """Fetch transactions using RPC calls"""
        try:
            # Get latest block number
            latest_block_payload = {
                "jsonrpc": "2.0",
                "method": "eth_blockNumber",
                "params": [],
                "id": 1
            }
            
            async with session.post(self.rpc_url, json=latest_block_payload) as response:
                latest_result = await response.json()
                latest_block = int(latest_result["result"], 16)
            
            transactions = []
            blocks_to_check = min(100, latest_block)  # Check last 100 blocks
            
            # Check recent blocks for transactions involving this address
            for block_num in range(latest_block - blocks_to_check, latest_block + 1):
                block_payload = {
                    "jsonrpc": "2.0",
                    "method": "eth_getBlockByNumber",
                    "params": [hex(block_num), True],
                    "id": 1
                }
                
                async with session.post(self.rpc_url, json=block_payload) as response:
                    block_result = await response.json()
                    
                    if "result" in block_result and block_result["result"]:
                        block_data = block_result["result"]
                        if block_data and "transactions" in block_data:
                            for tx in block_data["transactions"]:
                                if (tx.get("from", "").lower() == address.lower() or 
                                    tx.get("to", "").lower() == address.lower()):
                                    tx["blockNumber"] = block_num
                                    tx["timestamp"] = int(block_data.get("timestamp", "0x0"), 16)
                                    transactions.append(tx)
                
                if len(transactions) >= limit:
                    break
            
            # Sort by block number (most recent first)
            transactions.sort(key=lambda x: x.get("blockNumber", 0), reverse=True)
            return transactions[:limit]
            
        except Exception as e:
            print(f"Error fetching transactions via RPC: {e}")
            return []
    
    async def _format_transaction(self, session: aiohttp.ClientSession, tx: Dict, user_address: str) -> Optional[Dict]:
        """Format transaction data for display"""
        try:
            # Get transaction receipt for status
            receipt_payload = {
                "jsonrpc": "2.0",
                "method": "eth_getTransactionReceipt",
                "params": [tx.get("hash")],
                "id": 1
            }
            
            receipt = None
            try:
                async with session.post(self.rpc_url, json=receipt_payload) as response:
                    receipt_result = await response.json()
                    receipt = receipt_result.get("result")
            except:
                pass
            
            # Determine transaction type and direction
            from_addr = tx.get("from", "").lower()
            to_addr = tx.get("to", "").lower()
            user_addr = user_address.lower()
            
            if from_addr == user_addr:
                direction = "sent"
                counterparty = to_addr
            else:
                direction = "received"
                counterparty = from_addr
            
            # Convert values
            value_wei = int(tx.get("value", "0x0"), 16)
            value_s = value_wei / 1e18
            
            gas_used = 0
            gas_price = int(tx.get("gasPrice", "0x0"), 16)
            
            if receipt:
                gas_used = int(receipt.get("gasUsed", "0x0"), 16)
            
            fee_s = (gas_used * gas_price) / 1e18
            
            # Transaction status
            status = "success"
            if receipt:
                status = "success" if receipt.get("status") == "0x1" else "failed"
            
            # Format timestamp
            timestamp = tx.get("timestamp", 0)
            if timestamp:
                dt = datetime.fromtimestamp(timestamp)
                time_str = dt.strftime("%Y-%m-%d %H:%M:%S")
            else:
                time_str = "Unknown"
            
            return {
                "hash": tx.get("hash", ""),
                "direction": direction,
                "counterparty": counterparty,
                "value": value_s,
                "fee": fee_s,
                "status": status,
                "timestamp": time_str,
                "block": tx.get("blockNumber", 0),
                "gas_used": gas_used,
                "gas_price": gas_price / 1e9,  # Convert to Gwei
                "type": "transfer" if value_s > 0 else "contract_interaction"
            }
            
        except Exception as e:
            print(f"Error formatting transaction: {e}")
            return None
    
    async def get_transaction_details(self, tx_hash: str) -> Dict[str, Any]:
        """Get detailed information about a specific transaction"""
        try:
            async with aiohttp.ClientSession() as session:
                # Get transaction data
                tx_payload = {
                    "jsonrpc": "2.0",
                    "method": "eth_getTransactionByHash",
                    "params": [tx_hash],
                    "id": 1
                }
                
                async with session.post(self.rpc_url, json=tx_payload) as response:
                    tx_result = await response.json()
                    tx_data = tx_result.get("result")
                
                if not tx_data:
                    return {"success": False, "error": "Transaction not found"}
                
                # Get transaction receipt
                receipt_payload = {
                    "jsonrpc": "2.0",
                    "method": "eth_getTransactionReceipt",
                    "params": [tx_hash],
                    "id": 1
                }
                
                async with session.post(self.rpc_url, json=receipt_payload) as response:
                    receipt_result = await response.json()
                    receipt_data = receipt_result.get("result")
                
                # Format detailed transaction info
                value_wei = int(tx_data.get("value", "0x0"), 16)
                gas_price = int(tx_data.get("gasPrice", "0x0"), 16)
                gas_limit = int(tx_data.get("gas", "0x0"), 16)
                
                gas_used = 0
                status = "pending"
                if receipt_data:
                    gas_used = int(receipt_data.get("gasUsed", "0x0"), 16)
                    status = "success" if receipt_data.get("status") == "0x1" else "failed"
                
                return {
                    "success": True,
                    "hash": tx_hash,
                    "from": tx_data.get("from"),
                    "to": tx_data.get("to"),
                    "value_s": value_wei / 1e18,
                    "gas_limit": gas_limit,
                    "gas_used": gas_used,
                    "gas_price_gwei": gas_price / 1e9,
                    "fee_s": (gas_used * gas_price) / 1e18,
                    "status": status,
                    "block_number": int(tx_data.get("blockNumber", "0x0"), 16) if tx_data.get("blockNumber") else None,
                    "nonce": int(tx_data.get("nonce", "0x0"), 16),
                    "input_data": tx_data.get("input", "0x")
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to get transaction details: {str(e)}"
            }