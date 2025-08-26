#!/bin/bash

echo "🚀 Setting up Astra AI - Blockchain Agent for Sei Network"
echo "========================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend
npm install
cp .env.local.example .env.local
echo "⚠️  Please update frontend/.env.local with your WalletConnect Project ID"
cd ..

# Setup backend
echo "🔧 Setting up backend..."
cd backend
python3 -m pip install -r requirements.txt
cd ..

# Setup smart contracts
echo "📋 Setting up smart contracts..."
cp package-contracts.json package.json
npm install
cp .env.example .env
echo "⚠️  Please update .env with your private key and API keys"

# Create necessary directories
mkdir -p logs
mkdir -p uploads
mkdir -p data

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your API keys and private key"
echo "2. Update frontend/.env.local with your WalletConnect Project ID"
echo "3. Run 'npm run dev' to start the development servers"
echo "4. Deploy contracts with 'npm run deploy:testnet'"
echo ""
echo "📚 Documentation: Check README.md for detailed instructions"
echo "🌐 Sei Network: https://sei.io"
echo "💬 Support: Create an issue on GitHub"