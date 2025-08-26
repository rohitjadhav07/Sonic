from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import json
import asyncio
import aiohttp
from datetime import datetime
import hashlib
import qrcode
import io
import base64
from PIL import Image

app = FastAPI(title="Astra AI - Sonic Blockchain Agent", version="1.0.0")

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

class TransactionRequest(BaseModel):
    to: str
    amount: str
    from_address: str

class NFTRequest(BaseModel):
    name: str
    description: str
    image_prompt: str
    address: str

# Sonic Testnet configuration
SONIC_TESTNET_RPC = "https://rpc.testnet.soniclabs.com"
SONIC_EXPLORER = "https://testnet.sonicscan.org"

@app.get("/")
async def root():
    return {"message": "Astra AI Backend - Sonic Blockchain Agent is running! 🚀"}

@app.get("/api/balance/{address}")
async def get_balance(address: str):
    """Get real balance from Sonic Testnet"""
    try:
        async with aiohttp.ClientSession() as session:
            payload = {
                "jsonrpc": "2.0",
                "method": "eth_getBalance",
                "params": [address, "latest"],
                "id": 1
            }
            
            async with session.post(SONIC_TESTNET_RPC, json=payload) as response:
                data = await response.json()
                
                if "result" in data:
                    # Convert hex to decimal and then to ether
                    balance_wei = int(data["result"], 16)
                    balance_ether = balance_wei / 10**18
                    
                    return {
                        "address": address,
                        "balance": str(balance_ether),
                        "balance_wei": str(balance_wei),
                        "network": "Sonic Testnet",
                        "timestamp": datetime.now().isoformat()
                    }
                else:
                    raise HTTPException(status_code=400, detail="Failed to fetch balance")
                    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching balance: {str(e)}")

@app.post("/api/generate-qr")
async def generate_qr_code(address: str, amount: Optional[str] = None):
    """Generate QR code for payment"""
    try:
        # Create payment URI
        if amount:
            payment_uri = f"sonic:{address}?amount={amount}"
        else:
            payment_uri = f"sonic:{address}"
        
        # Generate QR code
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(payment_uri)
        qr.make(fit=True)
        
        # Create QR code image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return {
            "qr_code": f"data:image/png;base64,{img_str}",
            "payment_uri": payment_uri,
            "address": address,
            "amount": amount
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating QR code: {str(e)}")

@app.get("/api/transaction/{tx_hash}")
async def get_transaction(tx_hash: str):
    """Get transaction details from Sonic Testnet"""
    try:
        async with aiohttp.ClientSession() as session:
            payload = {
                "jsonrpc": "2.0",
                "method": "eth_getTransactionByHash",
                "params": [tx_hash],
                "id": 1
            }
            
            async with session.post(SONIC_TESTNET_RPC, json=payload) as response:
                data = await response.json()
                
                if "result" in data and data["result"]:
                    tx = data["result"]
                    return {
                        "hash": tx["hash"],
                        "from": tx["from"],
                        "to": tx["to"],
                        "value": str(int(tx["value"], 16) / 10**18),
                        "gas": str(int(tx["gas"], 16)),
                        "gasPrice": str(int(tx["gasPrice"], 16)),
                        "blockNumber": tx.get("blockNumber"),
                        "status": "confirmed" if tx.get("blockNumber") else "pending"
                    }
                else:
                    raise HTTPException(status_code=404, detail="Transaction not found")
                    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching transaction: {str(e)}")

@app.post("/api/nft/metadata")
async def generate_nft_metadata(request: NFTRequest):
    """Generate NFT metadata"""
    try:
        # Generate unique token ID
        token_id = hashlib.md5(f"{request.name}{request.address}{datetime.now()}".encode()).hexdigest()[:8]
        
        # Create metadata
        metadata = {
            "name": request.name,
            "description": request.description,
            "image": f"https://api.dicebear.com/7.x/shapes/svg?seed={token_id}",  # Placeholder image
            "attributes": [
                {"trait_type": "Creator", "value": "Astra AI"},
                {"trait_type": "Network", "value": "Sonic Testnet"},
                {"trait_type": "Created", "value": datetime.now().strftime("%Y-%m-%d")},
                {"trait_type": "AI Generated", "value": "True"}
            ],
            "external_url": f"https://astra-ai.sonic.app/nft/{token_id}",
            "animation_url": None,
            "background_color": "000000"
        }
        
        return {
            "token_id": token_id,
            "metadata": metadata,
            "mint_cost": "0.001",
            "estimated_gas": "50000",
            "network": "Sonic Testnet"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating NFT metadata: {str(e)}")

@app.get("/api/defi/pools")
async def get_defi_pools():
    """Get DeFi pool information"""
    # Mock DeFi data - in production, this would fetch from actual protocols
    pools = [
        {
            "name": "S-USDT LP",
            "apy": "45.2%",
            "tvl": "$12.1M",
            "protocol": "SonicSwap",
            "risk": "Low",
            "rewards": ["S", "SONIC"]
        },
        {
            "name": "S-ETH LP",
            "apy": "38.7%", 
            "tvl": "$8.9M",
            "protocol": "SonicSwap",
            "risk": "Medium",
            "rewards": ["S", "ETH"]
        },
        {
            "name": "S Staking",
            "apy": "25.5%",
            "tvl": "$25.3M", 
            "protocol": "Sonic Staking",
            "risk": "Very Low",
            "rewards": ["S"]
        }
    ]
    
    return {
        "pools": pools,
        "total_tvl": "$46.3M",
        "network": "Sonic Testnet",
        "updated": datetime.now().isoformat()
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main AI chat endpoint with real blockchain integration"""
    try:
        message_lower = request.message.lower()
        
        # Balance queries
        if any(word in message_lower for word in ["balance", "portfolio", "wallet"]):
            if not request.address:
                return ChatResponse(
                    response="Please connect your wallet first to check your balance.",
                    cards=[]
                )
            
            try:
                balance_data = await get_balance(request.address)
                balance = float(balance_data["balance"])
                
                response = f"Your Sonic Testnet balance is {balance:.6f} S tokens. Thanks to Sonic's real-time RPC, this information is always current!"
                
                cards = [{
                    "type": "balance",
                    "data": {
                        "balance": f"{balance:.6f}",
                        "symbol": "S",
                        "address": request.address,
                        "network": "Sonic Testnet",
                        "usdValue": f"{balance * 2.0:.2f}",  # Mock USD price
                        "lastUpdate": datetime.now().strftime("%H:%M:%S"),
                        "explorer_url": f"{SONIC_EXPLORER}/address/{request.address}"
                    }
                }]
                
            except Exception as e:
                response = f"Error fetching balance: {str(e)}"
                cards = []
                
        # Payment QR/Link generation
        elif any(word in message_lower for word in ["qr", "payment", "receive", "generate"]):
            if not request.address:
                return ChatResponse(
                    response="Please connect your wallet first to generate payment requests.",
                    cards=[]
                )
            
            # Extract amount if specified
            import re
            amount_match = re.search(r'(\d+(?:\.\d+)?)', request.message)
            amount = amount_match.group(1) if amount_match else None
            
            try:
                qr_data = await generate_qr_code(request.address, amount)
                
                response = f"Payment {'request for ' + amount + ' S tokens' if amount else 'QR code'} generated! Share this with anyone to receive S tokens on Sonic Network."
                
                cards = [{
                    "type": "payment",
                    "data": {
                        "address": request.address,
                        "amount": amount or "Any amount",
                        "qr_code": qr_data["qr_code"],
                        "payment_uri": qr_data["payment_uri"],
                        "network": "Sonic Testnet"
                    }
                }]
                
            except Exception as e:
                response = f"Error generating QR code: {str(e)}"
                cards = []
        
        # NFT creation
        elif any(word in message_lower for word in ["nft", "create", "mint", "token"]):
            if not request.address:
                return ChatResponse(
                    response="Please connect your wallet first to create NFTs.",
                    cards=[]
                )
            
            try:
                nft_request = NFTRequest(
                    name="AI Generated NFT",
                    description="Created through Astra AI on Sonic Network",
                    image_prompt=request.message,
                    address=request.address
                )
                
                nft_data = await generate_nft_metadata(nft_request)
                
                response = "NFT metadata generated! With Sonic's ultra-low gas fees, minting costs only 0.001 S tokens and completes in under a second."
                
                cards = [{
                    "type": "nft",
                    "data": {
                        "token_id": nft_data["token_id"],
                        "name": nft_data["metadata"]["name"],
                        "description": nft_data["metadata"]["description"],
                        "image": nft_data["metadata"]["image"],
                        "mint_cost": f"{nft_data['mint_cost']} S",
                        "estimated_gas": nft_data["estimated_gas"],
                        "network": "Sonic Testnet",
                        "attributes": nft_data["metadata"]["attributes"]
                    }
                }]
                
            except Exception as e:
                response = f"Error generating NFT: {str(e)}"
                cards = []
        
        # DeFi queries
        elif any(word in message_lower for word in ["defi", "yield", "farm", "stake", "pool"]):
            try:
                defi_data = await get_defi_pools()
                
                response = "Here are the top DeFi opportunities on Sonic Network! Lightning-fast transactions and minimal fees make yield farming incredibly efficient."
                
                cards = [{
                    "type": "defi",
                    "data": {
                        "pools": defi_data["pools"],
                        "total_tvl": defi_data["total_tvl"],
                        "network": "Sonic Testnet",
                        "benefits": [
                            "Sub-second transaction finality",
                            "95% lower gas fees",
                            "MEV protection built-in",
                            "EVM compatibility"
                        ]
                    }
                }]
                
            except Exception as e:
                response = f"Error fetching DeFi data: {str(e)}"
                cards = []
        
        # Transaction queries
        elif any(word in message_lower for word in ["send", "transfer", "transaction", "tx"]):
            response = """To send S tokens, I need:
1. Recipient address (0x...)
2. Amount to send

Example: "Send 1.5 S tokens to 0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"

Your wallet will handle the actual transaction signing for security. Thanks to Sonic's sub-second finality, transactions confirm almost instantly!"""
            
            cards = [{
                "type": "transaction_help",
                "data": {
                    "network": "Sonic Testnet",
                    "finality": "< 1 second",
                    "gas_cost": "~0.0001 S",
                    "security": "Wallet-signed transactions"
                }
            }]
        
        # Default response
        else:
            response = f"""I understand you want to "{request.message}". Here's what I can help you with on Sonic Network:

🔍 **Real Blockchain Operations:**
• Check your actual S token balance from Sonic Testnet
• Generate payment QR codes and links for receiving funds
• Create NFT metadata with AI-generated content
• Explore live DeFi pools and yield opportunities

⚡ **Sonic Network Features:**
• Sub-second transaction finality
• 95% lower gas fees than Ethereum
• Full EVM compatibility
• MEV protection built-in

Try commands like:
• "Check my balance"
• "Generate a payment QR code for 5 S tokens"
• "Create an NFT called 'Sonic Speed'"
• "Show me DeFi opportunities"

{f"Your connected address: {request.address}" if request.address else "Connect your wallet to access all features!"}"""
            
            cards = []
        
        return ChatResponse(
            response=response,
            cards=cards
        )
        
    except Exception as e:
        return ChatResponse(
            response=f"I encountered an error: {str(e)}. Please try again or rephrase your request.",
            cards=[]
        )

if __name__ == "__main__":
    print("🚀 Starting Astra AI Backend - Sonic Blockchain Agent...")
    print("🔗 Connecting to Sonic Testnet RPC...")
    print("📱 Frontend should be running on http://localhost:3000")
    print("🔧 Backend API running on http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )