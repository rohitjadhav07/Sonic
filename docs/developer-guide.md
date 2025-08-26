# 🔧 Smart Sonic Developer Guide

This guide provides comprehensive information for developers who want to contribute to, extend, or integrate with Smart Sonic.

## 🏗️ Development Environment Setup

### Prerequisites
- **Node.js 18+** with npm
- **Python 3.8+** with pip
- **Git** for version control
- **VS Code** (recommended) with extensions:
  - Solidity
  - Python
  - TypeScript
  - Tailwind CSS IntelliSense

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/your-username/smart-sonic.git
cd smart-sonic

# Install all dependencies
npm run install:all

# Set up environment variables
cp .env.example .env
cp frontend/.env.local.example frontend/.env.local

# Start development servers
npm run dev
```

---

## 📁 Project Architecture

### Directory Structure
```
smart-sonic/
├── frontend/                 # Next.js React application
│   ├── app/                 # Next.js 14 App Router
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── ChatInterface.tsx    # Main AI chat
│   │   ├── TransactionHistory.tsx # Transaction display
│   │   ├── TransactionDetails.tsx # Transaction details
│   │   └── WalletConnect.tsx     # Wallet integration
│   ├── lib/                 # Utility libraries
│   │   ├── wagmi.ts         # Wagmi configuration
│   │   └── utils.ts         # Helper functions
│   └── hooks/               # Custom React hooks
├── backend/                 # FastAPI Python server
│   ├── main.py             # FastAPI application
│   ├── main_demo.py        # Demo server with mock data
│   ├── services/           # Business logic services
│   │   ├── blockchain.py   # Blockchain interactions
│   │   ├── ai.py          # AI processing
│   │   └── transactions.py # Transaction handling
│   └── config/             # Configuration files
├── contracts/              # Solidity smart contracts
│   ├── SmartSonicSubscription.sol # Subscription management
│   └── PaymentAutomation.sol      # Payment automation
├── scripts/                # Deployment and utility scripts
│   ├── deploy-subscription.js     # Contract deployment
│   ├── network-info.js           # Network utilities
│   └── test-network.js           # Network testing
└── docs/                   # Documentation
```

---

## ⚛️ Frontend Development

### Tech Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **RainbowKit** - Wallet connection library
- **Wagmi** - React hooks for Ethereum
- **Framer Motion** - Animation library

### Key Components

#### ChatInterface.tsx
The main AI chat interface component:

```typescript
interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  cards?: any[]
}

export default function ChatInterface() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address: address,
    chainId: sonicTestnet.id,
  })
  
  // Component logic...
}
```

#### Key Features:
- **Natural Language Processing** - Parses user commands
- **Voice Recognition** - Web Speech API integration
- **Transaction History** - Real-time blockchain data
- **Explorer Integration** - Direct links to Sonic Explorer
- **Card System** - Modular UI components for different data types

#### TransactionHistory.tsx
Displays transaction data in a user-friendly format:

```typescript
interface TransactionHistoryProps {
  data: {
    transactions: Transaction[]
    address: string
    total_found: number
    network: string
    explorer_url: string
  }
}

export default function TransactionHistory({ data }: TransactionHistoryProps) {
  // Component implementation...
}
```

### State Management
- **React Hooks** - useState, useEffect for local state
- **Wagmi Hooks** - useAccount, useBalance, useSendTransaction
- **Context API** - For global state (if needed)

### Styling Guidelines
- **Tailwind CSS** - Use utility classes
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - Support for dark/light themes
- **Animations** - Framer Motion for smooth transitions

### Adding New Features

#### 1. Create New Component
```typescript
// components/NewFeature.tsx
interface NewFeatureProps {
  data: any
}

export default function NewFeature({ data }: NewFeatureProps) {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
      {/* Component content */}
    </div>
  )
}
```

#### 2. Add to ChatInterface
```typescript
// In ChatInterface.tsx renderCards function
case 'new_feature':
  return <NewFeature key={index} data={data} />
```

#### 3. Add Command Processing
```typescript
// In ChatInterface.tsx handleSend function
else if (message_lower.includes('new feature')) {
  response = "New feature response"
  cards = [{
    type: 'new_feature',
    data: { /* feature data */ }
  }]
}
```

---

## 🐍 Backend Development

### Tech Stack
- **FastAPI** - Modern Python web framework
- **Web3.py** - Ethereum library for Python
- **Pydantic** - Data validation and settings
- **Asyncio** - Asynchronous programming
- **Uvicorn** - ASGI server

### Project Structure

#### main.py
Main FastAPI application:

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from web3 import Web3
import asyncio

app = FastAPI(title="Smart Sonic API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/transactions/{address}")
async def get_transactions(address: str):
    # Implementation...
    pass
```

#### services/blockchain.py
Blockchain interaction service:

```python
from web3 import Web3
from typing import List, Dict, Any
import asyncio

class BlockchainService:
    def __init__(self, rpc_url: str):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    async def get_transaction_history(self, address: str) -> List[Dict[str, Any]]:
        # Implementation...
        pass
    
    async def get_transaction_details(self, tx_hash: str) -> Dict[str, Any]:
        # Implementation...
        pass
```

### API Endpoints

#### Transaction History
```python
@app.get("/api/transactions/{address}")
async def get_transactions(address: str):
    """Get transaction history for an address"""
    try:
        blockchain_service = BlockchainService(SONIC_RPC_URL)
        transactions = await blockchain_service.get_transaction_history(address)
        
        return {
            "success": True,
            "transactions": transactions,
            "total_found": len(transactions),
            "address": address
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

#### Transaction Details
```python
@app.get("/api/transaction/{tx_hash}")
async def get_transaction_details(tx_hash: str):
    """Get details for a specific transaction"""
    try:
        blockchain_service = BlockchainService(SONIC_RPC_URL)
        details = await blockchain_service.get_transaction_details(tx_hash)
        
        return {
            "success": True,
            **details
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Adding New Endpoints

#### 1. Define Pydantic Models
```python
from pydantic import BaseModel

class SendTransactionRequest(BaseModel):
    to_address: str
    amount: float
    private_key: str
```

#### 2. Create Service Method
```python
# In services/blockchain.py
async def send_transaction(self, to_address: str, amount: float, private_key: str):
    # Implementation...
    pass
```

#### 3. Add API Endpoint
```python
@app.post("/api/send-transaction")
async def send_transaction(request: SendTransactionRequest):
    # Implementation...
    pass
```

---

## 🔗 Smart Contract Development

### Tech Stack
- **Solidity 0.8.19** - Smart contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Security-audited contracts
- **Ethers.js** - JavaScript library for Ethereum

### Contract Structure

#### SmartSonicSubscription.sol
Main subscription contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SmartSonicSubscription is Ownable, ReentrancyGuard {
    uint256 public constant SUBSCRIPTION_PRICE = 1 ether;
    uint256 public constant SUBSCRIPTION_DURATION = 30 days;
    
    struct Subscription {
        uint256 id;
        address user;
        uint256 startTime;
        uint256 endTime;
        bool active;
    }
    
    mapping(address => Subscription) public subscriptions;
    
    event SubscriptionPurchased(address indexed user, uint256 startTime, uint256 endTime);
    
    function purchaseSubscription() external payable nonReentrant {
        require(msg.value >= SUBSCRIPTION_PRICE, "Insufficient payment");
        
        // Implementation...
    }
}
```

### Development Workflow

#### 1. Write Contracts
```bash
# Create new contract
touch contracts/NewContract.sol
```

#### 2. Compile Contracts
```bash
npx hardhat compile
```

#### 3. Write Tests
```javascript
// test/NewContract.test.js
const { expect } = require("chai");

describe("NewContract", function () {
  it("Should deploy correctly", async function () {
    // Test implementation...
  });
});
```

#### 4. Run Tests
```bash
npx hardhat test
```

#### 5. Deploy to Network
```bash
# Deploy to Sonic testnet
npm run deploy:contracts

# Verify contract
npm run verify:testnet
```

### Deployment Scripts

#### scripts/deploy-subscription.js
```javascript
const { ethers } = require("hardhat");

async function main() {
  const SmartSonicSubscription = await ethers.getContractFactory("SmartSonicSubscription");
  const subscription = await SmartSonicSubscription.deploy();
  
  await subscription.deployed();
  
  console.log("SmartSonicSubscription deployed to:", subscription.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

---

## 🧪 Testing

### Frontend Testing
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test
```

#### Component Testing
```typescript
// __tests__/ChatInterface.test.tsx
import { render, screen } from '@testing-library/react'
import ChatInterface from '../components/ChatInterface'

test('renders chat interface', () => {
  render(<ChatInterface />)
  expect(screen.getByText('Smart Sonic')).toBeInTheDocument()
})
```

### Backend Testing
```bash
# Install testing dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

#### API Testing
```python
# tests/test_api.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_transactions():
    response = client.get("/api/transactions/0x123...")
    assert response.status_code == 200
```

### Smart Contract Testing
```bash
# Run contract tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test
```

#### Contract Testing
```javascript
// test/SmartSonicSubscription.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SmartSonicSubscription", function () {
  let subscription;
  let owner;
  let user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const SmartSonicSubscription = await ethers.getContractFactory("SmartSonicSubscription");
    subscription = await SmartSonicSubscription.deploy();
  });

  it("Should allow subscription purchase", async function () {
    await expect(
      subscription.connect(user).purchaseSubscription({ value: ethers.utils.parseEther("1") })
    ).to.emit(subscription, "SubscriptionPurchased");
  });
});
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Deploy
```bash
cd frontend
vercel
```

#### 3. Environment Variables
Set in Vercel dashboard:
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
- `NEXT_PUBLIC_API_URL`

### Backend Deployment (Railway)

#### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

#### 2. Deploy
```bash
cd backend
railway login
railway init
railway up
```

#### 3. Environment Variables
Set in Railway dashboard:
- `SONIC_TESTNET_RPC_URL`
- `GOOGLE_API_KEY`
- `DATABASE_URL`

### Smart Contract Deployment

#### 1. Configure Networks
```javascript
// hardhat.config.js
networks: {
  "sonic-testnet": {
    url: process.env.SONIC_TESTNET_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 14601,
  }
}
```

#### 2. Deploy Contracts
```bash
npm run deploy:contracts
```

#### 3. Verify Contracts
```bash
npm run verify:testnet
```

---

## 🔧 Development Tools

### Recommended VS Code Extensions
- **Solidity** - Smart contract development
- **Python** - Python language support
- **TypeScript** - TypeScript support
- **Tailwind CSS IntelliSense** - CSS utilities
- **GitLens** - Git integration
- **Thunder Client** - API testing

### Debugging

#### Frontend Debugging
```typescript
// Use React Developer Tools
console.log('Debug info:', { address, balance, isConnected });

// Network debugging
if (process.env.NODE_ENV === 'development') {
  console.log('API Response:', response);
}
```

#### Backend Debugging
```python
# Use Python debugger
import pdb; pdb.set_trace()

# Logging
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.debug("Debug message")
```

#### Smart Contract Debugging
```bash
# Use Hardhat console
npx hardhat console --network sonic-testnet

# Gas optimization
npx hardhat test --gas-reporter
```

---

## 📊 Performance Optimization

### Frontend Optimization
- **Code Splitting** - Dynamic imports for large components
- **Image Optimization** - Next.js Image component
- **Bundle Analysis** - Analyze bundle size
- **Caching** - Implement proper caching strategies

### Backend Optimization
- **Async Operations** - Use asyncio for concurrent operations
- **Database Indexing** - Optimize database queries
- **Caching** - Redis for frequently accessed data
- **Connection Pooling** - Optimize database connections

### Smart Contract Optimization
- **Gas Optimization** - Minimize gas usage
- **Storage Optimization** - Efficient storage patterns
- **Batch Operations** - Combine multiple operations
- **Proxy Patterns** - Upgradeable contracts

---

## 🔐 Security Best Practices

### Frontend Security
- **Input Validation** - Validate all user inputs
- **XSS Prevention** - Sanitize user content
- **HTTPS Only** - Force secure connections
- **Environment Variables** - Never expose secrets

### Backend Security
- **Input Validation** - Use Pydantic models
- **Rate Limiting** - Prevent abuse
- **CORS Configuration** - Restrict origins
- **Error Handling** - Don't expose internal errors

### Smart Contract Security
- **Reentrancy Guards** - Prevent reentrancy attacks
- **Access Control** - Proper permission management
- **Integer Overflow** - Use SafeMath or Solidity 0.8+
- **External Calls** - Be cautious with external contracts

---

## 🤝 Contributing Guidelines

### Code Style
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Black** - Python code formatting
- **Solhint** - Solidity linting

### Git Workflow
1. **Fork** the repository
2. **Create feature branch** - `git checkout -b feature/amazing-feature`
3. **Commit changes** - Use conventional commits
4. **Push to branch** - `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Commit Messages
Use conventional commits:
```
feat: add transaction history feature
fix: resolve wallet connection issue
docs: update API documentation
test: add unit tests for blockchain service
```

### Pull Request Process
1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Request review** from maintainers

---

## 📚 Additional Resources

### Documentation
- [Sonic Network Docs](https://docs.soniclabs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Hardhat Documentation](https://hardhat.org/docs)

### Community
- 💬 [Discord](https://discord.gg/smartsonic)
- 🐦 [Twitter](https://twitter.com/SmartSonicAI)
- 📧 Email: developers@smartsonic.ai

---

*Happy coding! 🚀*

---

*Last updated: January 2024*
*Version: 1.0.0*