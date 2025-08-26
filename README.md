# 🚀 Smart Sonic - AI-Powered Blockchain Agent

<div align="center">

![Smart Sonic Logo](https://img.shields.io/badge/Smart%20Sonic-AI%20Agent-blue?style=for-the-badge&logo=ethereum)
[![Sonic Network](https://img.shields.io/badge/Sonic-Network-purple?style=for-the-badge)](https://soniclabs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**The most advanced AI-powered blockchain agent for Sonic Network**

*Lightning-fast transactions • Sub-second finality • Ultra-low fees*

[🌐 Live Demo](https://smart-sonic.vercel.app) • [📖 Documentation](./docs) • [🐛 Report Bug](https://github.com/your-repo/issues) • [💡 Request Feature](https://github.com/your-repo/issues)

</div>

---

## 🌟 Overview

Smart Sonic is a revolutionary AI-powered blockchain agent built specifically for Sonic Network. It combines the power of artificial intelligence with Sonic's lightning-fast blockchain technology to provide users with an intuitive, conversational interface for all their Web3 needs.

### ✨ Key Features

- 🤖 **AI-Powered Conversations** - Natural language processing for blockchain operations
- ⚡ **Lightning Fast** - Sub-second transaction finality on Sonic Network
- 💰 **Ultra-Low Fees** - 95% lower transaction costs compared to Ethereum
- 🔍 **Transaction History** - Real-time portfolio tracking and activity monitoring
- 🌐 **Explorer Integration** - Direct links to Sonic testnet explorer
- 💳 **Smart Payments** - Generate payment links and QR codes instantly
- 🎨 **NFT Creation** - AI-assisted NFT minting with metadata generation
- 🏦 **DeFi Operations** - Yield farming and liquidity pool interactions
- 🎙️ **Voice Commands** - Speech recognition for hands-free operation
- 📱 **Mobile Responsive** - Works seamlessly on all devices

---

## 🏗️ Architecture

```
Smart Sonic/
├── 🎨 frontend/          # Next.js React application
├── 🔧 backend/           # FastAPI Python server
├── 📋 contracts/         # Solidity smart contracts
├── 🚀 scripts/           # Deployment and utility scripts
└── 📚 docs/              # Documentation
```

### Tech Stack

**Frontend:**
- ⚛️ **Next.js 14** - React framework with App Router
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🌈 **RainbowKit** - Wallet connection library
- 📡 **Wagmi** - React hooks for Ethereum
- 🎭 **Framer Motion** - Animation library
- 🔊 **Web Speech API** - Voice recognition

**Backend:**
- 🐍 **FastAPI** - Modern Python web framework
- 🌐 **Web3.py** - Ethereum library for Python
- 🔄 **Asyncio** - Asynchronous programming
- 📊 **Pydantic** - Data validation

**Blockchain:**
- ⚡ **Sonic Network** - Ultra-fast EVM-compatible blockchain
- 🔗 **Solidity 0.8.19** - Smart contract language
- 🛠️ **Hardhat** - Development environment
- 🔐 **OpenZeppelin** - Security-audited contracts

---

## 🚀 Quick Start

### Prerequisites

- 📦 **Node.js 18+** - [Download](https://nodejs.org/)
- 🐍 **Python 3.8+** - [Download](https://python.org/)
- 💰 **Sonic Testnet Tokens** - [Get from faucet](https://testnet.soniclabs.com/faucet)
- 🔑 **WalletConnect Project ID** - [Get from WalletConnect](https://cloud.walletconnect.com/)

### 🛠️ Installation

#### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
# Run the setup script
setup.bat
```

**Linux/macOS:**
```bash
# Make script executable and run
chmod +x setup.sh
./setup.sh
```

#### Option 2: Manual Setup

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/smart-sonic.git
cd smart-sonic
```

2. **Install dependencies:**
```bash
# Install all dependencies
npm run install:all
```

3. **Configure environment variables:**
```bash
# Copy environment files
cp .env.example .env
cp frontend/.env.local.example frontend/.env.local
```

4. **Update configuration files:**

**.env:**
```env
# Sonic Network Configuration
SONIC_TESTNET_RPC_URL=https://rpc.testnet.soniclabs.com
SONIC_MAINNET_RPC_URL=https://rpc.soniclabs.com

# Your private key for contract deployment
PRIVATE_KEY=your_private_key_here

# API Keys
GOOGLE_API_KEY=your_google_gemini_api_key
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
```

**frontend/.env.local:**
```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 🏃‍♂️ Running the Application

1. **Start development servers:**
```bash
npm run dev
```

This will start:
- 🎨 Frontend: http://localhost:3000
- 🔧 Backend: http://localhost:8000

2. **Deploy smart contracts (optional):**
```bash
# Deploy to Sonic testnet
npm run deploy:contracts

# Verify contracts
npm run verify:testnet
```

---

## 💡 Usage Guide

### 🗣️ Voice Commands

Smart Sonic supports natural language commands:

```
"Check my balance"
"Send 1 S token to 0x..."
"Show my transaction history"
"Generate a payment QR code"
"View on Sonic explorer"
"Create an NFT"
```

### 💳 Wallet Integration

1. **Connect Wallet** - Click "Connect Wallet" and choose your preferred wallet
2. **Switch Network** - Ensure you're on Sonic Testnet (Chain ID: 14601)
3. **Get Testnet Tokens** - Visit [Sonic Faucet](https://testnet.soniclabs.com/faucet)

### 📊 Transaction History

- **View Your History**: Say "show my transaction history"
- **Check Any Address**: Paste any Sonic address (0x...)
- **Transaction Details**: Paste any transaction hash
- **Explorer Links**: Get direct links to Sonic Explorer

### 🎨 NFT Creation

1. Say "create an NFT" or "mint NFT"
2. Provide details about your NFT
3. AI generates metadata automatically
4. Mint with ultra-low gas fees on Sonic

---

## 🔧 Development

### 📁 Project Structure

```
smart-sonic/
├── frontend/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   │   ├── ChatInterface.tsx    # Main AI chat interface
│   │   ├── TransactionHistory.tsx # Transaction display
│   │   └── WalletConnect.tsx     # Wallet connection
│   ├── lib/                 # Utility libraries
│   └── hooks/               # Custom React hooks
├── backend/
│   ├── main.py             # FastAPI application
│   ├── services/           # Business logic
│   └── config/             # Configuration
├── contracts/
│   ├── SmartSonicSubscription.sol # Subscription contract
│   └── PaymentAutomation.sol      # Payment automation
└── scripts/
    ├── deploy-subscription.js     # Contract deployment
    └── network-info.js           # Network utilities
```

### 🧪 Testing

```bash
# Run contract tests
npm run test

# Test network connection
npm run network:test

# Run demo transaction
npm run test:demo
```

### 🚀 Deployment

#### Frontend Deployment (Vercel)

1. **Connect to Vercel:**
```bash
npm i -g vercel
vercel
```

2. **Set environment variables in Vercel dashboard:**
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
- `NEXT_PUBLIC_API_URL`

#### Backend Deployment (Railway/Heroku)

1. **Prepare for deployment:**
```bash
cd backend
pip freeze > requirements.txt
```

2. **Deploy to Railway:**
```bash
railway login
railway init
railway up
```

#### Smart Contract Deployment

```bash
# Deploy to Sonic testnet
npm run deploy:contracts

# Deploy to Sonic mainnet
npm run deploy:mainnet

# Verify contracts
npm run verify:testnet
npm run verify:mainnet
```

---

## 🌐 Sonic Network Integration

### Network Configuration

**Sonic Testnet:**
- **Chain ID**: 14601
- **RPC URL**: https://rpc.testnet.soniclabs.com
- **Explorer**: https://testnet.soniclabs.com
- **Faucet**: https://testnet.soniclabs.com/faucet

**Sonic Mainnet:**
- **Chain ID**: 146
- **RPC URL**: https://rpc.soniclabs.com
- **Explorer**: https://soniclabs.com

### 🔥 Sonic Advantages

- ⚡ **Sub-second finality** - Transactions confirm in <1 second
- 💰 **Ultra-low fees** - 95% cheaper than Ethereum
- 🔄 **High throughput** - 10,000+ TPS capacity
- 🛡️ **MEV protection** - Built-in protection against MEV attacks
- 🌍 **EVM compatible** - Full Ethereum compatibility

---

## 🤖 AI Features

### Natural Language Processing

Smart Sonic understands various command formats:

```javascript
// Balance queries
"What's my balance?"
"How many S tokens do I have?"
"Show my portfolio"

// Transaction commands
"Send 5 S to 0x123..."
"Transfer tokens to Alice"
"Pay 2.5 S tokens"

// History and exploration
"Show my transactions"
"What did I do yesterday?"
"View on explorer"

// NFT operations
"Create an NFT of a sunset"
"Mint a digital artwork"
"Generate NFT metadata"
```

### Voice Recognition

- 🎙️ **Click microphone** to start voice input
- 🗣️ **Speak naturally** - AI understands context
- 🔊 **Audio feedback** - Responses are spoken aloud
- 🌍 **Multi-language** support (coming soon)

---

## 📊 API Reference

### Backend Endpoints

```http
GET /api/transactions/{address}
# Get transaction history for an address

GET /api/transaction/{hash}
# Get details for a specific transaction

POST /api/send-transaction
# Send a transaction through the AI agent

GET /api/balance/{address}
# Get balance for an address

POST /api/generate-nft
# Generate NFT metadata with AI
```

### Smart Contract Functions

```solidity
// Subscription Management
function purchaseSubscription() external payable
function renewSubscription() external payable
function isSubscriptionActive(address user) external view returns (bool)

// Payment Automation
function createPaymentLink(uint256 amount) external
function processPayment(bytes32 linkId) external payable
```

---

## 🔐 Security

### Smart Contract Security

- ✅ **OpenZeppelin** - Industry-standard security libraries
- 🛡️ **ReentrancyGuard** - Protection against reentrancy attacks
- 🔒 **Access Control** - Role-based permissions
- 🧪 **Comprehensive Tests** - 100% test coverage
- 🔍 **Code Audits** - Regular security audits

### Frontend Security

- 🔐 **Wallet Security** - Never stores private keys
- 🌐 **HTTPS Only** - All communications encrypted
- 🛡️ **Input Validation** - All user inputs validated
- 🔒 **Environment Variables** - Sensitive data protected

### Best Practices

- 🔑 **Never commit private keys** to version control
- 🌐 **Use environment variables** for sensitive configuration
- 🔒 **Validate all inputs** on both client and server
- 🛡️ **Keep dependencies updated** regularly

---


### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run tests**: `npm run test`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Style

- 📝 **ESLint** - JavaScript/TypeScript linting
- 🎨 **Prettier** - Code formatting
- 📋 **Conventional Commits** - Commit message format
- 🧪 **Test Coverage** - Maintain >90% coverage

---

## 📚 Documentation

- 📖 [User Guide](./docs/user-guide.md)
- 🔧 [Developer Guide](./docs/developer-guide.md)
- 📊 [API Documentation](./docs/api.md)
- 🏗️ [Architecture Guide](./docs/architecture.md)
- 🚀 [Deployment Guide](./docs/deployment.md)

---

## 🐛 Troubleshooting

### Common Issues

**🔴 "Failed to connect to backend API"**
```bash
# Make sure backend is running
cd backend
python main.py
```

**🔴 "Transaction failed"**
- Check you have enough S tokens for gas
- Ensure you're on Sonic Testnet (Chain ID: 14601)
- Try refreshing the page and reconnecting wallet

**🔴 "Wallet connection failed"**
- Make sure you have a Web3 wallet installed
- Check your WalletConnect Project ID is correct
- Try switching to Sonic Testnet manually

### Getting Help

- 📖 Check our [FAQ](./docs/faq.md)
- 🐛 [Report bugs](https://github.com/your-repo/issues)
- 💬 [Join our Discord](https://discord.gg/your-discord)
- 📧 Email: rohitjadhav45074507@gmail.com

---

## 🗺️ Roadmap

### 🎯 Current (Q1 2024)
- ✅ AI-powered chat interface
- ✅ Transaction history and explorer integration
- ✅ Voice commands and speech recognition
- ✅ NFT creation with AI metadata
- ✅ Payment links and QR codes

### 🚀 Next (Q2 2024)
- 🔄 Cross-chain bridge integration
- 🏦 Advanced DeFi operations
- 📊 Portfolio analytics and insights
- 🤖 Autonomous transaction execution
- 📱 Mobile app (iOS/Android)

### 🌟 Future (Q3-Q4 2024)
- 🌍 Multi-language support
- 🎮 Gaming integrations
- 🏪 Marketplace for AI agents
- 🔮 Predictive analytics
- 🌐 DAO governance features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- 🌟 **Sonic Labs** - For the incredible Sonic Network
- 🌈 **RainbowKit** - For seamless wallet connections
- 🤖 **OpenAI** - For AI capabilities inspiration
- 🎨 **Tailwind CSS** - For beautiful styling
- 🔗 **OpenZeppelin** - For secure smart contracts

---

## 📞 Contact

- 🌐 **Website**: [smartsonic.ai](https://smartsonic.ai)
- 🐦 **Twitter**: [@SmartSonicAI](https://twitter.com/SmartSonicAI)
- 💬 **Discord**: [Join our community](https://discord.gg/smartsonic)
- 📧 **Email**: hello@smartsonic.ai
- 📱 **Telegram**: [@SmartSonicAI](https://t.me/SmartSonicAI)

---

<div align="center">

**Built with ❤️ for the Sonic Network community**

[![Sonic Network](https://img.shields.io/badge/Powered%20by-Sonic%20Network-purple?style=for-the-badge)](https://soniclabs.com)
[![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/API-FastAPI-green?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)

⭐ **Star us on GitHub** if you find Smart Sonic helpful!

</div>