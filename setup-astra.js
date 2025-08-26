#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Astra AI for Sonic Hackathon...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

// Step 1: Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Root dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install root dependencies');
  process.exit(1);
}

// Step 2: Install frontend dependencies
console.log('🎨 Installing frontend dependencies...');
try {
  execSync('cd frontend && npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Step 3: Install backend dependencies
console.log('🔧 Installing backend dependencies...');
try {
  execSync('cd backend && pip install -r requirements.txt', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  console.log('💡 Make sure Python and pip are installed');
  process.exit(1);
}

// Step 4: Create environment files
console.log('⚙️  Creating environment files...');

// Root .env
if (!fs.existsSync('.env')) {
  const rootEnv = `# Astra AI Environment Configuration
# Add your private key here (NEVER commit this file!)
PRIVATE_KEY=your_private_key_here

# Sonic Network Configuration
SONIC_TESTNET_RPC_URL=https://rpc.testnet.soniclabs.com
SONIC_MAINNET_RPC_URL=https://rpc.soniclabs.com

# Contract addresses (will be filled after deployment)
SUBSCRIPTION_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Optional: API keys for verification
SONIC_TESTNET_API_KEY=abc123
SONIC_MAINNET_API_KEY=abc123
`;
  fs.writeFileSync('.env', rootEnv);
  console.log('✅ Created .env file');
}

// Frontend .env.local
const frontendEnvPath = path.join('frontend', '.env.local');
if (!fs.existsSync(frontendEnvPath)) {
  const frontendEnv = `# Astra AI Frontend Configuration
# Get your project ID from https://cloud.walletconnect.com
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2f05ae7f1116030fde2d36508f472bfb

# Contract address (will be updated after deployment)
NEXT_PUBLIC_SUBSCRIPTION_CONTRACT=0x0000000000000000000000000000000000000000

# Network configuration
NEXT_PUBLIC_SONIC_TESTNET_RPC=https://rpc.testnet.soniclabs.com
NEXT_PUBLIC_SONIC_CHAIN_ID=14601
`;
  fs.writeFileSync(frontendEnvPath, frontendEnv);
  console.log('✅ Created frontend/.env.local file');
}

// Backend .env
const backendEnvPath = path.join('backend', '.env');
if (!fs.existsSync(backendEnvPath)) {
  const backendEnv = `# Astra AI Backend Configuration
# Sonic Network
SONIC_RPC_URL=https://rpc.testnet.soniclabs.com
SONIC_CHAIN_ID=14601

# Contract address (will be updated after deployment)
SUBSCRIPTION_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Optional: Private key for autonomous operations
PRIVATE_KEY=your_private_key_here
`;
  fs.writeFileSync(backendEnvPath, backendEnv);
  console.log('✅ Created backend/.env file');
}

console.log('\n🎉 Setup complete! Next steps:\n');

console.log('1. 💰 Get Sonic testnet tokens:');
console.log('   Visit: https://testnet.soniclabs.com/faucet\n');

console.log('2. 🔑 Add your private key to .env file:');
console.log('   PRIVATE_KEY=your_actual_private_key_here\n');

console.log('3. 🚀 Deploy the subscription contract:');
console.log('   npm run deploy:contracts\n');

console.log('4. 🎯 Start the demo:');
console.log('   npm run dev\n');

console.log('5. 🌐 Open your browser:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend:  http://localhost:8000\n');

console.log('🏆 Ready for Sonic Hackathon 2024! 🚀');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📚 For detailed instructions, see DEPLOYMENT_GUIDE.md');
console.log('🐛 For troubleshooting, see ERROR_FREE_DEMO.md');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');