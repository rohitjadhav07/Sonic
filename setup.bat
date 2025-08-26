@echo off
echo 🚀 Setting up Astra AI - Blockchain Agent for Sonic Network
echo ============================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Setup frontend
echo 🎨 Setting up frontend...
cd frontend
npm install
copy .env.local.example .env.local
echo ⚠️  Please update frontend/.env.local with your WalletConnect Project ID
cd ..

REM Setup backend
echo 🔧 Setting up backend...
cd backend
python -m pip install -r requirements.txt
cd ..

REM Setup smart contracts
echo 📋 Setting up smart contracts...
copy package-contracts.json package.json
npm install
copy .env.example .env
echo ⚠️  Please update .env with your private key and API keys

REM Create necessary directories
if not exist logs mkdir logs
if not exist uploads mkdir uploads
if not exist data mkdir data

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Update .env file with your API keys and private key
echo 2. Update frontend/.env.local with your WalletConnect Project ID
echo 3. Run 'npm run dev' to start the development servers
echo 4. Deploy contracts with 'npm run deploy:testnet'
echo.
echo 📚 Documentation: Check README.md for detailed instructions
echo 🌐 Sonic Network: https://soniclabs.com
echo ⚡ FeeM Documentation: https://docs.soniclabs.com/feem
echo 💬 Support: Create an issue on GitHub

pause