const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying SonicNFT contract...");

  // Get the contract factory
  const SonicNFT = await ethers.getContractFactory("SonicNFT");

  // Contract parameters
  const name = "Sonic AI NFTs";
  const symbol = "SONIC";
  const baseTokenURI = "https://ipfs.io/ipfs/"; // IPFS gateway

  // Deploy the contract
  const sonicNFT = await SonicNFT.deploy(name, symbol, baseTokenURI);

  // Wait for deployment to complete
  await sonicNFT.deployed();

  console.log("✅ SonicNFT deployed successfully!");
  console.log("📍 Contract Address:", sonicNFT.address);
  console.log("🔗 Network:", network.name);
  console.log("📊 Contract Name:", name);
  console.log("🏷️  Symbol:", symbol);
  console.log("🌐 Base URI:", baseTokenURI);

  // Verify contract on block explorer (if supported)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("⏳ Waiting for block confirmations...");
    await sonicNFT.deployTransaction.wait(6);
    
    console.log("🔍 Verifying contract on block explorer...");
    try {
      await hre.run("verify:verify", {
        address: sonicNFT.address,
        constructorArguments: [name, symbol, baseTokenURI],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.log("⚠️  Contract verification failed:", error.message);
    }
  }

  // Save deployment info
  const deploymentInfo = {
    contractName: "SonicNFT",
    address: sonicNFT.address,
    network: network.name,
    chainId: network.config.chainId,
    name: name,
    symbol: symbol,
    baseTokenURI: baseTokenURI,
    deployer: await sonicNFT.signer.getAddress(),
    transactionHash: sonicNFT.deployTransaction.hash,
    blockNumber: sonicNFT.deployTransaction.blockNumber,
    timestamp: new Date().toISOString()
  };

  // Write to deployment file
  const fs = require('fs');
  const path = require('path');
  
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${network.name}-nft.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("💾 Deployment info saved to:", deploymentFile);

  // Display contract interaction examples
  console.log("\n📋 Contract Interaction Examples:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  console.log("\n🔧 Contract ABI (for frontend):");
  console.log("Contract Address:", sonicNFT.address);
  
  console.log("\n💰 Minting Fee:", ethers.utils.formatEther(await sonicNFT.MINT_FEE()), "S tokens");
  console.log("📊 Max Supply:", (await sonicNFT.MAX_SUPPLY()).toString());
  console.log("🔢 Current Token ID:", (await sonicNFT.getCurrentTokenId()).toString());
  
  console.log("\n🎯 To mint an NFT, call:");
  console.log(`sonicNFT.mint(recipientAddress, "ipfs://QmYourMetadataHash", { value: "${ethers.utils.formatEther(await sonicNFT.MINT_FEE())}" })`);
  
  console.log("\n📱 Frontend Integration:");
  console.log("Add this contract address to your frontend config:");
  console.log(`NFT_CONTRACT_ADDRESS = "${sonicNFT.address}"`);

  return sonicNFT;
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
