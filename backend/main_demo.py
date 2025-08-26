from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import random
import time
from datetime import datetime, timedelta
import json
import asyncio
import aiohttp
from web3 import Web3
import os
from dotenv import load_dotenv
from services.transaction_service import TransactionService

load_dotenv()

app = FastAPI(title="Smart Sonic - AI Blockchain Agent", version="3.0.0")

# Initialize services
transaction_service = TransactionService()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    address: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    cards: Optional[List[Dict[str, Any]]] = []
    requiresSubscription: Optional[bool] = False
    operationType: Optional[str] = None

# Sonic Network Configuration
SONIC_RPC_URL = "https://rpc.testnet.soniclabs.com"
SONIC_CHAIN_ID = 14601

# Initialize Web3 connection
w3 = Web3(Web3.HTTPProvider(SONIC_RPC_URL))

# Subscription Contract Configuration
SUBSCRIPTION_CONTRACT_ADDRESS = os.getenv("SUBSCRIPTION_CONTRACT_ADDRESS", "0x0000000000000000000000000000000000000000")
SUBSCRIPTION_ABI = [
    {
        "inputs": [{"name": "user", "type": "address"}],
        "name": "isSubscriptionActive",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "user", "type": "address"},
            {"name": "operationType", "type": "string"},
            {"name": "gasCost", "type": "uint256"}
        ],
        "name": "recordOperation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

# Enhanced features for premium users
SONIC_FEATURES = {
    "speed": "Sub-second finality",
    "tps": "10,000+ TPS", 
    "gas_savings": "95% lower fees",
    "evm_compatible": "Full EVM compatibility"
}

# Operations that require subscription
PREMIUM_OPERATIONS = [
    "send", "transfer", "swap", "stake", "unstake", "approve", 
    "deploy", "mint", "burn", "bridge", "vote", "claim"
]

MOCK_PORTFOLIO = {
    "total_value": "$3,247.89",
    "change_24h": "+12.5%",
    "tokens": {
        "S": {"balance": "1,247.89", "value": "$2,495.78", "change": "+15.2%"},
        "USDT": {"balance": "500.00", "value": "$500.00", "change": "0.0%"},
        "USDC": {"balance": "252.11", "value": "$252.11", "change": "+0.1%"}
    }
}

MOCK_DEFI_POOLS = [
    {"name": "S-USDT LP", "apy": "45.2%", "tvl": "$2.1M", "rewards": "12.5 S"},
    {"name": "S-ETH LP", "apy": "38.7%", "tvl": "$1.8M", "rewards": "8.3 S"}
]

def generate_tx_hash():
    return f"0x{''.join(random.choices('0123456789abcdef', k=64))}"

def get_current_feem():
    return {
        "rate": round(random.uniform(0.1, 0.3), 3),
        "trend": random.choice(["up", "down", "stable"]),
        "change_24h": round(random.uniform(-20, 20), 1),
        "avg_block_time": "0.4s",
        "gas_optimization": "95%"
    }

# Check if user has active subscription
async def check_subscription(address: str) -> bool:
    try:
        if not address or SUBSCRIPTION_CONTRACT_ADDRESS == "0x0000000000000000000000000000000000000000":
            return False
            
        contract = w3.eth.contract(
            address=SUBSCRIPTION_CONTRACT_ADDRESS,
            abi=SUBSCRIPTION_ABI
        )
        
        is_active = contract.functions.isSubscriptionActive(address).call()
        return is_active
    except Exception as e:
        print(f"Error checking subscription: {e}")
        return False

# Record operation on blockchain
async def record_operation(address: str, operation_type: str, gas_cost: int = 21000):
    try:
        if not address or SUBSCRIPTION_CONTRACT_ADDRESS == "0x0000000000000000000000000000000000000000":
            return
            
        # This would require a private key to sign transactions
        # For demo purposes, we'll just log the operation
        print(f"Recording operation: {operation_type} for {address}, gas: {gas_cost}")
        
    except Exception as e:
        print(f"Error recording operation: {e}")

# Autonomous operation executor
async def execute_autonomous_operation(operation_type: str, params: Dict[str, Any], user_address: str):
    """Execute blockchain operations autonomously based on AI commands"""
    
    try:
        print(f"🤖 Executing autonomous {operation_type} for {user_address}")
        
        # Simulate operation execution
        await asyncio.sleep(1)  # Simulate processing time
        
        # Record the operation
        await record_operation(user_address, operation_type)
        
        # Return operation result
        return {
            "success": True,
            "operation": operation_type,
            "params": params,
            "gas_used": random.randint(21000, 100000),
            "tx_hash": f"0x{''.join(random.choices('0123456789abcdef', k=64))}",
            "block_number": random.randint(1000000, 2000000),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Error executing operation: {e}")
        return {
            "success": False,
            "error": str(e),
            "operation": operation_type
        }

# Check if operation requires subscription
def requires_subscription(message: str) -> tuple[bool, str]:
    message_lower = message.lower()
    
    for operation in PREMIUM_OPERATIONS:
        if operation in message_lower:
            return True, operation
            
    return False, ""

@app.get("/")
async def root():
    return {"message": "Smart Sonic Backend is running in Demo Mode! 🚀"}

@app.get("/api/transactions/{address}")
async def get_transaction_history(address: str, limit: int = 10):
    """Get transaction history for an address"""
    try:
        result = await transaction_service.get_transaction_history(address, limit)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/transaction/{tx_hash}")
async def get_transaction_details(tx_hash: str):
    """Get detailed information about a specific transaction"""
    try:
        result = await transaction_service.get_transaction_details(tx_hash)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, background_tasks: BackgroundTasks):
    try:
        message_lower = request.message.lower()
        user_address = request.address or "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
        
        # Check if operation requires subscription
        needs_subscription, operation_type = requires_subscription(request.message)
        
        if needs_subscription:
            # Check if user has active subscription
            has_subscription = await check_subscription(user_address)
            
            if not has_subscription:
                return ChatResponse(
                    response="🔒 This operation requires an active Smart Sonic Premium subscription. Purchase a subscription for just 1 S token to unlock autonomous AI operations!",
                    cards=[{
                        "type": "subscription-required",
                        "data": {
                            "operation": operation_type,
                            "price": "1 S token",
                            "duration": "30 days",
                            "features": [
                                "Autonomous transaction execution",
                                "AI-powered DeFi operations", 
                                "Smart contract interactions",
                                "Cross-chain operations"
                            ]
                        }
                    }],
                    requiresSubscription=True,
                    operationType=operation_type
                )
        
        # Transaction History queries
        if any(word in message_lower for word in ["transaction", "history", "tx", "transactions", "recent", "activity"]):
            try:
                # Get real transaction history from Sonic testnet
                tx_history = await transaction_service.get_transaction_history(user_address, 5)
                
                if tx_history["success"] and tx_history["transactions"]:
                    response = f"📋 Here's your recent transaction history on Sonic testnet! Found {len(tx_history['transactions'])} recent transactions with lightning-fast confirmations."
                    
                    # Format transactions for display
                    tx_list = []
                    for tx in tx_history["transactions"]:
                        direction_emoji = "📤" if tx["direction"] == "sent" else "📥"
                        status_emoji = "✅" if tx["status"] == "success" else "❌"
                        
                        tx_list.append({
                            "hash": tx["hash"],
                            "short_hash": tx["hash"][:10] + "...",
                            "direction": tx["direction"],
                            "amount": f"{tx['value']:.4f} S",
                            "fee": f"{tx['fee']:.6f} S",
                            "status": tx["status"],
                            "timestamp": tx["timestamp"],
                            "counterparty": tx["counterparty"][:10] + "..." if tx["counterparty"] else "Contract",
                            "block": tx["block"],
                            "type": tx["type"]
                        })
                    
                    cards = [{
                        "type": "transaction_history",
                        "data": {
                            "transactions": tx_list,
                            "address": user_address,
                            "total_found": tx_history["total_found"],
                            "network": "Sonic Testnet",
                            "explorer_url": "https://testnet.soniclabs.com"
                        }
                    }]
                else:
                    response = "📋 No recent transactions found for your address on Sonic testnet. Start using Smart Sonic to see your transaction history here!"
                    cards = [{
                        "type": "info",
                        "data": {
                            "title": "No Transactions Found",
                            "message": "No recent transactions found for this address",
                            "suggestion": "Try sending some S tokens or interacting with contracts to see activity here.",
                            "address": user_address
                        }
                    }]
                    
            except Exception as e:
                response = f"⚠️ Unable to fetch transaction history at the moment. Sonic's network is so fast, sometimes we need a moment to catch up!"
                cards = [{
                    "type": "error",
                    "data": {
                        "message": "Failed to fetch transaction history",
                        "error": str(e),
                        "suggestion": "Please try again in a moment"
                    }
                }]
        
        # Portfolio & Balance queries
        elif any(word in message_lower for word in ["balance", "portfolio", "s token", "wallet"]):
            response = f"🚀 Your Sonic portfolio is looking great! Total value: {MOCK_PORTFOLIO['total_value']} ({MOCK_PORTFOLIO['change_24h']} 24h). Sonic's real-time updates keep you informed instantly!"
            cards = [{
                "type": "portfolio",
                "data": {
                    "totalValue": MOCK_PORTFOLIO["total_value"],
                    "change24h": MOCK_PORTFOLIO["change_24h"],
                    "tokens": MOCK_PORTFOLIO["tokens"],
                    "address": user_address,
                    "network": "Sonic Testnet",
                    "lastUpdate": datetime.now().strftime("%H:%M:%S"),
                    "hasSubscription": await check_subscription(user_address) if needs_subscription else False
                }
            }]
        
        # Address or Transaction Hash Lookup
        elif "0x" in request.message and len(request.message.strip()) >= 40:
            # Detect if it's an address (42 chars) or transaction hash (66 chars)
            input_value = request.message.strip()
            
            if len(input_value) == 42:
                # It's an address - show transaction history
                try:
                    tx_history = await transaction_service.get_transaction_history(input_value, 10)
                    
                    if tx_history["success"] and tx_history["transactions"]:
                        response = f"📋 Transaction history for address {input_value[:10]}...{input_value[-8:]} on Sonic testnet! Found {len(tx_history['transactions'])} recent transactions."
                        
                        # Format transactions for display
                        tx_list = []
                        for tx in tx_history["transactions"]:
                            direction_emoji = "📤" if tx["direction"] == "sent" else "📥"
                            status_emoji = "✅" if tx["status"] == "success" else "❌"
                            
                            tx_list.append({
                                "hash": tx["hash"],
                                "short_hash": tx["hash"][:10] + "...",
                                "direction": tx["direction"],
                                "amount": f"{tx['value']:.4f} S",
                                "fee": f"{tx['fee']:.6f} S",
                                "status": tx["status"],
                                "timestamp": tx["timestamp"],
                                "counterparty": tx["counterparty"][:10] + "..." if tx["counterparty"] else "Contract",
                                "block": tx["block"],
                                "type": tx["type"]
                            })
                        
                        cards = [{
                            "type": "transaction_history",
                            "data": {
                                "transactions": tx_list,
                                "address": input_value,
                                "total_found": tx_history["total_found"],
                                "network": "Sonic Testnet",
                                "explorer_url": "https://testnet.soniclabs.com"
                            }
                        }]
                    else:
                        response = f"📋 No recent transactions found for address {input_value[:10]}...{input_value[-8:]} on Sonic testnet. This address hasn't been active recently."
                        cards = [{
                            "type": "info",
                            "data": {
                                "title": "No Transactions Found",
                                "message": f"No recent transactions found for {input_value[:10]}...{input_value[-8:]}",
                                "suggestion": "This address may be new or inactive. Try with a different address that has recent activity.",
                                "address": input_value
                            }
                        }]
                        
                except Exception as e:
                    response = f"⚠️ Unable to fetch transaction history for this address. Error: {str(e)}"
                    cards = []
                    
            elif len(input_value) == 66:
                # It's a transaction hash - show transaction details
                try:
                    tx_details = await transaction_service.get_transaction_details(input_value)
                    
                    if tx_details["success"]:
                        response = f"🔍 Transaction details for {input_value[:10]}... found on Sonic testnet!"
                        
                        cards = [{
                            "type": "transaction_details",
                            "data": {
                                "hash": tx_details["hash"],
                                "from": tx_details["from"],
                                "to": tx_details["to"],
                                "value_s": tx_details["value_s"],
                                "fee_s": tx_details["fee_s"],
                                "status": tx_details["status"],
                                "block_number": tx_details["block_number"],
                                "gas_used": tx_details["gas_used"],
                                "gas_limit": tx_details["gas_limit"],
                                "gas_price_gwei": tx_details["gas_price_gwei"],
                                "nonce": tx_details["nonce"],
                                "explorer_url": f"https://testnet.soniclabs.com/tx/{input_value}"
                            }
                        }]
                    else:
                        response = f"❌ Transaction {input_value[:10]}... not found on Sonic testnet. Please check the hash and try again."
                        cards = []
                        
                except Exception as e:
                    response = f"⚠️ Error looking up transaction: {str(e)}"
                    cards = []
            else:
                response = f"🤔 I see you provided '{input_value}' - this looks like it might be an address or transaction hash, but the format seems incorrect. Addresses should be 42 characters (including 0x) and transaction hashes should be 66 characters."
                cards = []
        
        # DeFi & Yield Farming
        elif any(word in message_lower for word in ["defi", "yield", "farm", "stake", "liquidity"]):
            response = "💰 Sonic's DeFi ecosystem is booming! Here are the top yield opportunities with incredible APYs thanks to Sonic's efficiency."
            cards = [{
                "type": "defi",
                "data": {
                    "pools": MOCK_DEFI_POOLS,
                    "totalTvl": "$15.2M",
                    "avgApy": "42.1%",
                    "userRewards": "20.8 S tokens",
                    "nextReward": "2h 15m"
                }
            }]
        
        # Transaction & Send (Premium Operation)
        elif any(word in message_lower for word in ["send", "transfer", "pay"]):
            if needs_subscription and await check_subscription(user_address):
                # Execute autonomous transaction
                operation_params = {
                    "amount": "25.0",
                    "token": "S",
                    "to": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
                }
                
                # Execute operation in background
                background_tasks.add_task(
                    execute_autonomous_operation, 
                    "send_transaction", 
                    operation_params, 
                    user_address
                )
                
                tx_hash = generate_tx_hash()
                response = f"🤖 AI is executing your transaction autonomously! Hash: {tx_hash[:10]}... Thanks to your Premium subscription, I'm handling everything automatically!"
                
                cards = [{
                    "type": "autonomous-transaction",
                    "data": {
                        "hash": tx_hash,
                        "type": "Autonomous Send",
                        "amount": "25.0 S",
                        "to": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
                        "status": "AI Executing",
                        "confirmationTime": "0.4s",
                        "gasUsed": "21,000",
                        "gasFee": "0.0001 S",
                        "usdValue": "$62.50",
                        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "aiPowered": True,
                        "autonomous": True
                    }
                }]
            else:
                tx_hash = generate_tx_hash()
                response = f"⚡ Transaction initiated! Hash: {tx_hash[:10]}... Thanks to Sonic's sub-second finality, your transaction is already confirmed!"
                cards = [{
                    "type": "transaction",
                    "data": {
                        "hash": tx_hash,
                        "type": "Send",
                        "amount": "25.0 S",
                        "to": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
                        "status": "Confirmed",
                        "confirmationTime": "0.4s",
                        "gasUsed": "21,000",
                        "gasFee": "0.0001 S",
                        "usdValue": "$62.50",
                        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    }
                }]
        
        # FeeM & Gas optimization
        elif any(word in message_lower for word in ["feem", "fee", "gas", "cost"]):
            feem_data = get_current_feem()
            response = f"📊 Current FeeM rate: {feem_data['rate']} Gwei - that's {feem_data['gas_optimization']} lower than traditional chains! Sonic's Fee Market keeps costs minimal."
            cards = [{
                "type": "feem",
                "data": feem_data
            }]
        
        # Payment Links
        elif any(word in message_lower for word in ["payment link", "generate link", "qr code"]):
            payment_id = f"pay_{int(time.time())}"
            response = "🔗 Payment link generated! Share this with anyone to receive S tokens instantly. QR code included for mobile convenience."
            cards = [{
                "type": "payment-link",
                "data": {
                    "amount": "100.0",
                    "token": "S",
                    "link": f"https://astra-ai.sonic.app/pay?id={payment_id}",
                    "qrCode": f"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IndoaXRlIi8+PC9zdmc+",
                    "paymentId": payment_id,
                    "expiresIn": "24 hours",
                    "status": "Active"
                }
            }]
        
        # NFT & Creative
        elif any(word in message_lower for word in ["nft", "create", "art", "generate"]):
            response = "🎨 I can help you create and mint NFTs on Sonic! Ultra-low fees make NFT creation accessible to everyone. What would you like to create?"
            cards = [{
                "type": "nft",
                "data": {
                    "collections": ["Sonic Speedsters", "Digital Dreams", "AI Creations"],
                    "mintCost": "0.01 S",
                    "avgMintTime": "0.5s",
                    "totalMinted": "12,847",
                    "marketplaces": ["SonicSea", "FastTrade", "SpeedMarket"]
                }
            }]
        
        # Cross-chain & Swaps
        elif any(word in message_lower for word in ["swap", "bridge", "cross-chain", "exchange"]):
            response = "🌉 Sonic's cross-chain capabilities are incredible! Lightning-fast swaps with minimal slippage. What would you like to swap?"
            cards = [{
                "type": "swap",
                "data": {
                    "availablePairs": ["S/USDT", "S/ETH", "S/USDC"],
                    "bestRate": "1 S = $2.00",
                    "slippage": "0.1%",
                    "avgSwapTime": "0.6s",
                    "totalVolume24h": "$2.1M"
                }
            }]
        
        # Analytics & Market Data
        elif any(word in message_lower for word in ["price", "market", "chart", "analytics"]):
            response = "📈 S token is performing excellently! Current price: $2.00 (+15.2% 24h). Sonic's growing ecosystem drives strong fundamentals."
            cards = [{
                "type": "market",
                "data": {
                    "price": "$2.00",
                    "change24h": "+15.2%",
                    "volume24h": "$5.2M",
                    "marketCap": "$120M",
                    "holders": "25,847",
                    "transactions24h": "45,231"
                }
            }]
        
        # AI & Automation
        elif any(word in message_lower for word in ["automate", "schedule", "recurring", "ai"]):
            response = "🤖 I can automate your blockchain operations! Set up recurring payments, DCA strategies, or yield optimization. What would you like to automate?"
            cards = [{
                "type": "automation",
                "data": {
                    "activeStrategies": 3,
                    "totalSaved": "$127.50",
                    "nextExecution": "Tomorrow 9:00 AM",
                    "strategies": ["DCA S tokens", "Yield farming", "Gas optimization"]
                }
            }]
        
        # Default responses
        else:
            responses = [
                "🚀 I'm Smart Sonic, your AI-powered blockchain agent! I can help with portfolio management, DeFi strategies, NFT creation, cross-chain swaps, and much more. What interests you?",
                "⚡ Powered by Sonic's lightning-fast network, I can execute blockchain operations in real-time! Try asking about your balance, current FeeM rates, or creating payment links.",
                "🌟 Sonic's sub-second finality means we can interact with DeFi, NFTs, and payments almost instantly! How can I help you explore the Sonic ecosystem?",
                "💎 With Sonic's 95% lower gas costs and 10,000+ TPS, blockchain operations are faster and cheaper than ever. What would you like to do today?"
            ]
            response = random.choice(responses)
            cards = []
        
        return ChatResponse(
            response=response,
            cards=cards
        )
        
    except Exception as e:
        return ChatResponse(
            response="I'm your Sonic AI agent! Try asking me about: portfolio balance, DeFi yields, payment links, NFT creation, cross-chain swaps, or market analytics! 🚀",
            cards=[]
        )

if __name__ == "__main__":
    print("Starting Smart Sonic Backend in Demo Mode...")
    print("Frontend should be running on http://localhost:3000")
    print("Backend will run on http://localhost:8000")
    
    uvicorn.run(
        "main_demo:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )