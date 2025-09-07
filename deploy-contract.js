import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Deploying SonicNFT contract to Sonic Testnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "S tokens");

  if (balance.lt(ethers.utils.parseEther("0.01"))) {
    console.log("⚠️  Low balance! Get test tokens from: https://faucet.testnet.soniclabs.com");
    return;
  }

  // Get the contract factory
  const SonicNFT = await ethers.getContractFactory("SonicNFT");

  // Contract parameters
  const name = "Sonic AI NFTs";
  const symbol = "SONIC";
  const baseTokenURI = "https://ipfs.io/ipfs/";

  console.log("Deploying contract with parameters:");
  console.log("- Name:", name);
  console.log("- Symbol:", symbol);
  console.log("- Base URI:", baseTokenURI);

  // Deploy the contract
  const sonicNFT = await SonicNFT.deploy(name, symbol, baseTokenURI);

  console.log("⏳ Waiting for deployment to complete...");
  await sonicNFT.deployed();

  console.log("✅ SonicNFT deployed successfully!");
  console.log("📍 Contract Address:", sonicNFT.address);
  console.log("🔗 Network:", network.name);
  console.log("📊 Contract Name:", name);
  console.log("🏷️  Symbol:", symbol);
  console.log("🌐 Base URI:", baseTokenURI);

  // Get contract info
  console.log("\n📋 Contract Information:");
  console.log("Minting Fee:", ethers.utils.formatEther(await sonicNFT.MINT_FEE()), "S tokens");
  console.log("Max Supply:", (await sonicNFT.MAX_SUPPLY()).toString());
  console.log("Current Token ID:", (await sonicNFT.getCurrentTokenId()).toString());

  // Save deployment info
  const deploymentInfo = {
    contractName: "SonicNFT",
    address: sonicNFT.address,
    network: network.name,
    chainId: network.config.chainId,
    name: name,
    symbol: symbol,
    baseTokenURI: baseTokenURI,
    deployer: deployer.address,
    transactionHash: sonicNFT.deployTransaction.hash,
    blockNumber: sonicNFT.deployTransaction.blockNumber,
    timestamp: new Date().toISOString(),
    mintingFee: ethers.utils.formatEther(await sonicNFT.MINT_FEE()),
    maxSupply: (await sonicNFT.MAX_SUPPLY()).toString()
  };

  // Write to deployment file
  
  const deploymentsDir = path.join(process.cwd(), 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${network.name}-nft.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("💾 Deployment info saved to:", deploymentFile);

  // Display next steps
  console.log("\n🎯 Next Steps:");
  console.log("1. Update frontend contract address:");
  console.log(`   NFT_CONTRACT_ADDRESS = "${sonicNFT.address}"`);
  console.log("2. Add contract to MetaMask:");
  console.log(`   - Go to MetaMask > Assets > Import tokens`);
  console.log(`   - Contract Address: ${sonicNFT.address}`);
  console.log("3. Test minting an NFT!");
  console.log("4. View on explorer:");
  console.log(`   https://testnet.sonicscan.org/address/${sonicNFT.address}`);

  return sonicNFT;
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
