# 🌐 Sonic Network Configuration Guide

## Overview

Astra AI is fully integrated with Sonic's revolutionary blockchain infrastructure, leveraging its sub-second finality and FeeM (Fee Market) optimization for the ultimate Web3 experience.

## 🚀 Sonic Network Details

### Sonic Testnet
- **Chain ID**: `14601`
- **Network Name**: `Sonic Testnet Network`
- **RPC URL**: `https://rpc.testnet.soniclabs.com`
- **WebSocket**: `wss://rpc.testnet.soniclabs.com`
- **Explorer**: `https://testnet.sonicscan.org`
- **Faucet**: `https://testnet.sonicscan.org/faucet`
- **Native Token**: `S` (Sonic)

### Sonic Mainnet
- **Chain ID**: `146`
- **Network Name**: `Sonic Mainnet`
- **RPC URL**: `https://rpc.soniclabs.com`
- **WebSocket**: `wss://rpc.soniclabs.com`
- **Explorer**: `https://soniclabs.com`
- **Native Token**: `S` (Sonic)

## ⚡ Sonic Performance Features

### Lightning-Fast Transactions
- **Block Time**: 0.4 seconds average
- **Finality**: Sub-second confirmation
- **Throughput**: 10,000+ TPS
- **Consensus**: Proof of Stake with optimizations

### FeeM (Fee Market) Optimization
- **Gas Reduction**: 95% lower costs vs traditional chains
- **Dynamic Pricing**: Real-time fee optimization
- **EIP-1559 Compatible**: Enhanced with Sonic improvements
- **Predictable Costs**: Stable transaction fees

## 🔧 Configuration Files

### Frontend Configuration (`frontend/lib/wagmi.ts`)
```typescript
export const sonicTestnet = defineChain({
  id: 14601,
  name: 'Sonic Testnet Network',
  network: 'sonic-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sonic',
    symbol: 'S',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.soniclabs.com'],
      webSocket: ['wss://rpc.testnet.soniclabs.com'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Sonic Testnet Explorer', 
      url: 'https://testnet.sonicscan.org',
    },
  },
  testnet: true,
})
```

### Hardhat Configuration (`hardhat.config.js`)
```javascript
networks: {
  \"sonic-testnet\": {
    url: \"https://rpc.testnet.soniclabs.com\",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 14601,
    gasPrice: \"auto\",
    gas: \"auto\",
  },
}
```

### Backend Configuration (`backend/config/sonic_config.py`)
```python
SONIC_TESTNET = {
    \"chain_id\": 14601,
    \"rpc_url\": \"https://rpc.testnet.soniclabs.com\",
    \"ws_url\": \"wss://rpc.testnet.soniclabs.com\",
    \"features\": {
        \"sub_second_finality\": True,
        \"average_block_time\": 0.4,
        \"tps\": 10000,
        \"gas_optimization\": 95
    }
}
```

## 🛠️ Environment Variables

Add these to your `.env` file:

```bash
# Sonic Network Configuration
SONIC_TESTNET_RPC_URL=https://rpc.testnet.soniclabs.com
SONIC_MAINNET_RPC_URL=https://rpc.soniclabs.com
SONIC_TESTNET_WS_URL=wss://rpc.testnet.soniclabs.com
SONIC_MAINNET_WS_URL=wss://rpc.soniclabs.com

# Private Key for Contract Deployment
PRIVATE_KEY=your_private_key_here
```

## 📋 Quick Commands

### Network Information
```bash
npm run network:info
```

### Deploy to Sonic Testnet
```bash
npm run deploy:contracts
```

### Deploy to Sonic Mainnet
```bash
npm run deploy:mainnet
```

### Compile Contracts
```bash
npm run compile
```

### Run Tests
```bash
npm run test
```

## 🎯 Astra AI Integration Features

### Real-Time Balance Monitoring
- Instant S token balance updates
- USD value conversion with live rates
- 24h change tracking
- Multi-wallet support

### FeeM Integration
- Real-time gas price monitoring
- Optimization recommendations
- Cost comparison with traditional chains
- Transaction fee predictions

### Lightning Transactions
- Sub-second confirmation times
- Voice-powered transaction commands
- Natural language amount parsing
- Automatic gas optimization

### Payment Links
- Instant payment request generation
- QR code integration
- Shareable links with metadata
- Real-time payment tracking

## 🔍 Network Testing

### Test Network Connectivity
```bash
# Check all network endpoints
npm run network:info

# Test specific network
npx hardhat run scripts/test-network.js --network sonic-testnet
```

### Get Testnet Tokens
1. Visit the [Sonic Testnet Faucet](https://testnet.sonicscan.org/faucet)
2. Enter your wallet address
3. Request testnet S tokens
4. Tokens will arrive in ~0.4 seconds!

### Verify Contract Deployment
```bash
# Verify on testnet
npm run verify:testnet <contract_address>

# Verify on mainnet  
npm run verify:mainnet <contract_address>
```

## 🚀 Performance Benchmarks

### Transaction Speed Comparison
| Network | Block Time | Finality | TPS |
|---------|------------|----------|-----|
| Ethereum | 12s | 12+ minutes | 15 |
| Polygon | 2s | 2+ minutes | 7,000 |
| **Sonic** | **0.4s** | **<1 second** | **10,000+** |

### Gas Cost Comparison
| Operation | Ethereum | Polygon | **Sonic** |
|-----------|----------|---------|-----------|
| Simple Transfer | $5-50 | $0.01-0.1 | **$0.0005** |
| Token Swap | $20-200 | $0.05-0.5 | **$0.002** |
| NFT Mint | $50-500 | $0.1-1 | **$0.005** |

## 🎪 Demo Scenarios

### Voice-Powered Balance Check
1. User: \"Show my S token balance\"
2. Astra connects to Sonic RPC
3. Real-time balance displayed in <0.5s
4. USD conversion with live rates

### Lightning-Fast Payment
1. User: \"Send 10 S to my friend\"
2. Transaction broadcast to Sonic
3. Confirmation in 0.4 seconds
4. Balance updated instantly

### FeeM Optimization
1. User: \"What's the current gas price?\"
2. Astra queries Sonic's FeeM
3. Shows 95% savings vs traditional chains
4. Recommends optimal transaction timing

## 🏆 Sonic Advantages for Astra AI

### Developer Experience
- **EVM Compatibility**: Seamless migration from other chains
- **Enhanced APIs**: Sonic-specific optimizations
- **Real-time Data**: WebSocket support for live updates
- **Predictable Costs**: Stable gas pricing

### User Experience  
- **Instant Feedback**: Sub-second transaction confirmation
- **Minimal Costs**: Micro-transactions become viable
- **Voice Commands**: Fast enough for real-time interaction
- **Mobile-First**: Perfect for mobile wallet integration

### Business Benefits
- **Scalability**: 10,000+ TPS supports mass adoption
- **Cost Efficiency**: 95% lower operational costs
- **User Retention**: Fast, cheap transactions improve UX
- **Innovation**: Enables new interaction paradigms

## 🔗 Useful Links

- **Sonic Documentation**: [docs.soniclabs.com](https://docs.soniclabs.com)
- **Testnet Explorer**: [testnet.sonicscan.org](https://testnet.sonicscan.org)
- **Mainnet Explorer**: [soniclabs.com](https://soniclabs.com)
- **Testnet Faucet**: [testnet.sonicscan.org/faucet](https://testnet.sonicscan.org/faucet)
- **Developer Portal**: [developers.soniclabs.com](https://developers.soniclabs.com)

---

**Built for Sonic S Tier Hackathon 2025**  
*Leveraging Sonic's revolutionary speed and FeeM optimization for the next generation of Web3 applications.*