@echo off
echo 🚀 Setting up Sonic NFT System...
echo.

echo 📦 Installing Python dependencies...
cd backend
pip install fastapi uvicorn python-multipart requests pillow qrcode openai python-dotenv
echo ✅ Python dependencies installed
echo.

echo 📦 Installing Node.js dependencies...
cd ..\frontend
npm install
echo ✅ Node.js dependencies installed
echo.

echo 📦 Installing Hardhat dependencies...
cd ..
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
echo ✅ Hardhat dependencies installed
echo.

echo 🔧 Creating environment files...
echo # AI Image Generation > .env
echo OPENAI_API_KEY=your_openai_key_here >> .env
echo STABILITY_API_KEY=your_stability_key_here >> .env
echo REPLICATE_API_TOKEN=your_replicate_token_here >> .env
echo HUGGINGFACE_API_KEY=your_huggingface_key_here >> .env
echo. >> .env
echo # Wallet (NEVER commit this!) >> .env
echo PRIVATE_KEY=your_wallet_private_key_here >> .env
echo. >> .env
echo # Sonic Network >> .env
echo SONIC_TESTNET_RPC_URL=https://rpc.testnet.soniclabs.com >> .env
echo SONIC_MAINNET_RPC_URL=https://rpc.soniclabs.com >> .env
echo ✅ Environment files created
echo.

echo 🎯 Setup Complete! Next Steps:
echo.
echo 1. 🔑 Get AI API Keys:
echo    - OpenAI: https://platform.openai.com/api-keys
echo    - Replicate: https://replicate.com/
echo    - Hugging Face: https://huggingface.co/settings/tokens
echo.
echo 2. 💰 Get Test S Tokens:
echo    - Visit: https://faucet.testnet.soniclabs.com
echo    - Add Sonic Testnet to MetaMask
echo.
echo 3. 🚀 Deploy Contract:
echo    - npx hardhat run scripts/deploy-nft-simple.js --network sonic-testnet
echo.
echo 4. 🎨 Start the System:
echo    - Backend: cd backend ^&^& python main.py
echo    - Frontend: cd frontend ^&^& npm run dev
echo.
echo 5. 🌐 Access NFT Studio:
echo    - Go to: http://localhost:3000/nft
echo.
echo 📚 Read the guides:
echo    - AI_IMAGE_GUIDE.md
echo    - CONTRACT_DEPLOYMENT_GUIDE.md
echo    - METAMASK_NFT_GUIDE.md
echo.
pause
