# 📊 Smart Sonic API Documentation

This document provides comprehensive information about the Smart Sonic API endpoints, request/response formats, and integration examples.

## 🌐 Base URL

**Development:** `http://localhost:8000`  
**Production:** `https://api.smartsonic.ai`

## 🔐 Authentication

Currently, the API is open for public use. Future versions will include API key authentication.

```http
# Future authentication header
Authorization: Bearer YOUR_API_KEY
```

---

## 📋 API Endpoints

### 🔍 Transaction Endpoints

#### Get Transaction History
Retrieve transaction history for a specific address.

```http
GET /api/transactions/{address}
```

**Parameters:**
- `address` (string, required): Ethereum address (0x...)

**Query Parameters:**
- `limit` (integer, optional): Number of transactions to return (default: 50, max: 100)
- `offset` (integer, optional): Number of transactions to skip (default: 0)
- `sort` (string, optional): Sort order - "desc" or "asc" (default: "desc")

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/transactions/0x742d35Cc6634C0532925a3b8D4C9db96590c6C87?limit=10&sort=desc"
```

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "hash": "0x1234567890abcdef...",
      "block_number": 1234567,
      "timestamp": "2024-01-15T10:30:00Z",
      "from": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
      "to": "0x987fcdeb51234567...",
      "value": "1000000000000000000",
      "value_formatted": "1.0",
      "gas_used": "21000",
      "gas_price": "20000000000",
      "gas_fee": "0.00042",
      "status": "success",
      "type": "send",
      "method": "transfer"
    }
  ],
  "total_found": 25,
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "network": "Sonic Testnet",
  "pagination": {
    "limit": 10,
    "offset": 0,
    "has_more": true
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid address format",
  "code": "INVALID_ADDRESS"
}
```

#### Get Transaction Details
Retrieve detailed information for a specific transaction.

```http
GET /api/transaction/{tx_hash}
```

**Parameters:**
- `tx_hash` (string, required): Transaction hash (0x...)

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/transaction/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
```

**Response:**
```json
{
  "success": true,
  "hash": "0x1234567890abcdef...",
  "block_number": 1234567,
  "block_hash": "0xabcdef1234567890...",
  "transaction_index": 5,
  "timestamp": "2024-01-15T10:30:00Z",
  "from": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "to": "0x987fcdeb51234567...",
  "value": "1000000000000000000",
  "value_formatted": "1.0",
  "gas_limit": "21000",
  "gas_used": "21000",
  "gas_price": "20000000000",
  "gas_fee": "0.00042",
  "nonce": 42,
  "status": "success",
  "confirmations": 1250,
  "input_data": "0x",
  "logs": [],
  "network": "Sonic Testnet"
}
```

### 💰 Balance Endpoints

#### Get Address Balance
Retrieve the current balance for a specific address.

```http
GET /api/balance/{address}
```

**Parameters:**
- `address` (string, required): Ethereum address (0x...)

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/balance/0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
```

**Response:**
```json
{
  "success": true,
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "balance": "5000000000000000000",
  "balance_formatted": "5.0",
  "symbol": "S",
  "network": "Sonic Testnet",
  "usd_value": "10.00",
  "last_updated": "2024-01-15T10:30:00Z"
}
```

### 📤 Transaction Sending

#### Send Transaction
Send a transaction through the Smart Sonic AI agent.

```http
POST /api/send-transaction
```

**Request Body:**
```json
{
  "to_address": "0x987fcdeb51234567...",
  "amount": "1.5",
  "private_key": "0x1234567890abcdef...",
  "gas_limit": 21000,
  "gas_price": "20000000000"
}
```

**Response:**
```json
{
  "success": true,
  "transaction_hash": "0x1234567890abcdef...",
  "status": "pending",
  "estimated_confirmation_time": "1-2 seconds",
  "gas_fee": "0.00042",
  "network": "Sonic Testnet"
}
```

### 🎨 NFT Endpoints

#### Generate NFT Metadata
Generate AI-powered metadata for NFT creation.

```http
POST /api/generate-nft
```

**Request Body:**
```json
{
  "name": "Digital Sunset",
  "description": "A beautiful AI-generated sunset artwork",
  "attributes": [
    {
      "trait_type": "Style",
      "value": "Digital Art"
    },
    {
      "trait_type": "Color Palette",
      "value": "Warm"
    }
  ],
  "image_prompt": "A vibrant sunset over mountains with purple and orange sky"
}
```

**Response:**
```json
{
  "success": true,
  "metadata": {
    "name": "Digital Sunset",
    "description": "A beautiful AI-generated sunset artwork featuring vibrant colors and serene mountain landscape",
    "image": "ipfs://QmYourImageHash",
    "attributes": [
      {
        "trait_type": "Style",
        "value": "Digital Art"
      },
      {
        "trait_type": "Color Palette",
        "value": "Warm"
      },
      {
        "trait_type": "AI Generated",
        "value": "Yes"
      }
    ],
    "external_url": "https://smartsonic.ai/nft/your-nft-id",
    "animation_url": null,
    "background_color": "FF6B35"
  },
  "ipfs_hash": "QmYourMetadataHash",
  "estimated_mint_cost": "0.001 S"
}
```

#### Mint NFT
Mint an NFT with the generated metadata.

```http
POST /api/mint-nft
```

**Request Body:**
```json
{
  "metadata_hash": "QmYourMetadataHash",
  "recipient_address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "private_key": "0x1234567890abcdef..."
}
```

**Response:**
```json
{
  "success": true,
  "transaction_hash": "0x1234567890abcdef...",
  "token_id": 1,
  "contract_address": "0xNFTContractAddress...",
  "metadata_uri": "ipfs://QmYourMetadataHash",
  "estimated_confirmation_time": "1-2 seconds"
}
```

### 🏦 DeFi Endpoints

#### Get DeFi Opportunities
Retrieve available DeFi opportunities on Sonic Network.

```http
GET /api/defi/opportunities
```

**Query Parameters:**
- `category` (string, optional): Filter by category - "lending", "yield", "dex"
- `min_apy` (number, optional): Minimum APY percentage
- `sort_by` (string, optional): Sort by "apy", "tvl", "risk"

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/defi/opportunities?category=yield&min_apy=10&sort_by=apy"
```

**Response:**
```json
{
  "success": true,
  "opportunities": [
    {
      "protocol": "SonicSwap",
      "pool_name": "S-USDT LP",
      "category": "yield",
      "apy": 45.2,
      "tvl": "12100000",
      "tvl_formatted": "$12.1M",
      "risk_level": "medium",
      "tokens": ["S", "USDT"],
      "contract_address": "0xPoolContractAddress...",
      "url": "https://sonicswap.io/pool/s-usdt"
    }
  ],
  "total_tvl": "50200000",
  "total_tvl_formatted": "$50.2M",
  "network": "Sonic Testnet"
}
```

### 💳 Payment Endpoints

#### Create Payment Link
Generate a payment link for receiving tokens.

```http
POST /api/create-payment-link
```

**Request Body:**
```json
{
  "recipient_address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "amount": "5.0",
  "description": "Payment for services",
  "expires_in": 3600
}
```

**Response:**
```json
{
  "success": true,
  "payment_id": "pay_1234567890",
  "payment_url": "https://smartsonic.ai/pay/pay_1234567890",
  "qr_code_url": "https://api.qrserver.com/v1/create-qr-code/?data=...",
  "recipient_address": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "amount": "5.0",
  "expires_at": "2024-01-15T11:30:00Z"
}
```

#### Get Payment Status
Check the status of a payment link.

```http
GET /api/payment/{payment_id}
```

**Response:**
```json
{
  "success": true,
  "payment_id": "pay_1234567890",
  "status": "completed",
  "transaction_hash": "0x1234567890abcdef...",
  "amount_paid": "5.0",
  "paid_at": "2024-01-15T10:45:00Z",
  "payer_address": "0x987fcdeb51234567..."
}
```

---

## 🔄 WebSocket API

For real-time updates, Smart Sonic provides WebSocket connections.

### Connection
```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onopen = function(event) {
    console.log('Connected to Smart Sonic WebSocket');
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('Received:', data);
};
```

### Subscribe to Address Updates
```javascript
ws.send(JSON.stringify({
    type: 'subscribe',
    channel: 'address',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87'
}));
```

### Real-time Events
```json
{
  "type": "transaction",
  "data": {
    "hash": "0x1234567890abcdef...",
    "from": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    "to": "0x987fcdeb51234567...",
    "value": "1.0",
    "status": "confirmed"
  }
}
```

---

## 📱 SDK Integration

### JavaScript/TypeScript SDK

#### Installation
```bash
npm install @smartsonic/sdk
```

#### Usage
```typescript
import { SmartSonicSDK } from '@smartsonic/sdk';

const sdk = new SmartSonicSDK({
  apiUrl: 'http://localhost:8000',
  apiKey: 'your-api-key' // Optional
});

// Get transaction history
const transactions = await sdk.getTransactionHistory('0x742d35Cc...');

// Send transaction
const result = await sdk.sendTransaction({
  to: '0x987fcdeb...',
  amount: '1.5',
  privateKey: 'your-private-key'
});
```

### Python SDK

#### Installation
```bash
pip install smartsonic-sdk
```

#### Usage
```python
from smartsonic import SmartSonicSDK

sdk = SmartSonicSDK(
    api_url='http://localhost:8000',
    api_key='your-api-key'  # Optional
)

# Get transaction history
transactions = await sdk.get_transaction_history('0x742d35Cc...')

# Send transaction
result = await sdk.send_transaction(
    to='0x987fcdeb...',
    amount='1.5',
    private_key='your-private-key'
)
```

---

## 🚨 Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_ADDRESS` | Invalid Ethereum address format | 400 |
| `INVALID_TX_HASH` | Invalid transaction hash format | 400 |
| `ADDRESS_NOT_FOUND` | Address has no transaction history | 404 |
| `TX_NOT_FOUND` | Transaction not found | 404 |
| `INSUFFICIENT_BALANCE` | Insufficient balance for transaction | 400 |
| `NETWORK_ERROR` | Blockchain network error | 503 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Internal server error | 500 |

### Error Handling Examples

#### JavaScript
```javascript
try {
  const response = await fetch('/api/transactions/0x123...');
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(`API Error: ${data.error} (${data.code})`);
  }
  
  return data.transactions;
} catch (error) {
  console.error('Failed to fetch transactions:', error);
  // Handle error appropriately
}
```

#### Python
```python
import aiohttp

async def get_transactions(address):
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f'/api/transactions/{address}') as response:
                data = await response.json()
                
                if not data['success']:
                    raise Exception(f"API Error: {data['error']} ({data['code']})")
                
                return data['transactions']
    except Exception as error:
        print(f'Failed to fetch transactions: {error}')
        # Handle error appropriately
```

---

## 🔒 Rate Limiting

### Current Limits
- **Public API**: 100 requests per minute per IP
- **Authenticated API**: 1000 requests per minute per API key
- **WebSocket**: 10 connections per IP

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

### Handling Rate Limits
```javascript
const response = await fetch('/api/transactions/0x123...');

if (response.status === 429) {
  const resetTime = response.headers.get('X-RateLimit-Reset');
  const waitTime = resetTime - Math.floor(Date.now() / 1000);
  
  console.log(`Rate limited. Retry after ${waitTime} seconds`);
  // Implement exponential backoff
}
```

---

## 📊 Monitoring & Analytics

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 3600,
  "database": "connected",
  "blockchain": "connected",
  "last_block": 1234567
}
```

### API Metrics
```http
GET /metrics
```

**Response:**
```json
{
  "requests_total": 10000,
  "requests_per_minute": 150,
  "average_response_time": 250,
  "error_rate": 0.02,
  "active_connections": 25
}
```

---

## 🧪 Testing

### Test Environment
**Base URL:** `https://api-test.smartsonic.ai`

### Test Data
Use these test addresses and transactions for development:

```json
{
  "test_addresses": [
    "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    "0x987fcdeb51234567890abcdef1234567890abcdef"
  ],
  "test_transactions": [
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
  ]
}
```

### Postman Collection
Import our Postman collection for easy API testing:
[Download Collection](https://api.smartsonic.ai/postman-collection.json)

---

## 📚 Additional Resources

### Documentation Links
- [Sonic Network API](https://docs.soniclabs.com/api)
- [Web3.py Documentation](https://web3py.readthedocs.io/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

### Community & Support
- 💬 [Discord](https://discord.gg/smartsonic)
- 📧 Email: api-support@smartsonic.ai
- 🐛 [GitHub Issues](https://github.com/smartsonic/api/issues)

---

## 📝 Changelog

### v1.0.0 (Current)
- Initial API release
- Transaction history endpoints
- Balance checking
- NFT generation and minting
- DeFi opportunities
- Payment links
- WebSocket support

### Upcoming Features
- GraphQL API
- Webhook notifications
- Advanced analytics
- Multi-chain support

---

*Last updated: January 2024*
*API Version: 1.0.0*