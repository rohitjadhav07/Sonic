const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing NFT System...");
  
  try {
    // Test 1: Check network connection
    console.log("\n1. Testing network connection...");
    const provider = ethers.provider;
    const network = await provider.getNetwork();
    console.log(`✅ Connected to: ${network.name} (Chain ID: ${network.chainId})`);
    
    // Test 2: Check account balance
    console.log("\n2. Checking account balance...");
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.getBalance();
    console.log(`✅ Account: ${deployer.address}`);
    console.log(`✅ Balance: ${ethers.utils.formatEther(balance)} S tokens`);
    
    if (balance.lt(ethers.utils.parseEther("0.1"))) {
      console.log("⚠️  Low balance! Get test tokens from: https://faucet.testnet.soniclabs.com");
    }
    
    // Test 3: Compile contracts
    console.log("\n3. Testing contract compilation...");
    await hre.run("compile");
    console.log("✅ Contracts compiled successfully");
    
    // Test 4: Check if contract is deployed
    console.log("\n4. Checking for existing deployment...");
    const fs = require('fs');
    const path = require('path');
    
    const deploymentFile = path.join(__dirname, '..', 'deployments', `${network.name}-nft.json`);
    
    if (fs.existsSync(deploymentFile)) {
      const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
      console.log(`✅ Found existing deployment: ${deployment.address}`);
      
      // Test contract interaction
      const SonicNFT = await ethers.getContractFactory("SonicNFT");
      const contract = SonicNFT.attach(deployment.address);
      
      try {
        const name = await contract.name();
        const symbol = await contract.symbol();
        const totalSupply = await contract.totalSupply();
        const mintingFee = await contract.MINT_FEE();
        
        console.log(`✅ Contract Name: ${name}`);
        console.log(`✅ Symbol: ${symbol}`);
        console.log(`✅ Total Supply: ${totalSupply.toString()}`);
        console.log(`✅ Minting Fee: ${ethers.utils.formatEther(mintingFee)} S tokens`);
        
      } catch (error) {
        console.log("⚠️  Contract interaction failed:", error.message);
      }
      
    } else {
      console.log("ℹ️  No existing deployment found. Run deployment script to deploy contract.");
    }
    
    // Test 5: Check backend API
    console.log("\n5. Testing backend API...");
    try {
      const response = await fetch('http://localhost:8000/api/nft/ai-status');
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Backend API is running");
        console.log("✅ Available AI providers:", Object.keys(data.providers).filter(k => data.providers[k]));
      } else {
        console.log("⚠️  Backend API not responding. Start with: cd backend && python main.py");
      }
    } catch (error) {
      console.log("⚠️  Backend API not running. Start with: cd backend && python main.py");
    }
    
    console.log("\n🎉 System Test Complete!");
    console.log("\n📋 Summary:");
    console.log("- Network: Connected");
    console.log("- Account: Ready");
    console.log("- Contracts: Compiled");
    console.log("- Backend: Check status above");
    console.log("\n🚀 Ready to mint NFTs!");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
