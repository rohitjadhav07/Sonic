const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Astra AI Subscription Contract to Sonic Testnet...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "S tokens\n");

  if (balance.lt(ethers.utils.parseEther("0.1"))) {
    console.log("⚠️  Warning: Low balance. You need at least 0.1 S tokens for deployment.");
    console.log("Get testnet tokens from: https://testnet.soniclabs.com/faucet\n");
  }

  // Deploy the contract
  console.log("📄 Deploying AstraSubscription contract...");
  const AstraSubscription = await ethers.getContractFactory("AstraSubscription");
  
  // Estimate gas
  const deploymentData = AstraSubscription.getDeployTransaction();
  const estimatedGas = await deployer.estimateGas(deploymentData);
  console.log("Estimated gas:", estimatedGas.toString());

  const contract = await AstraSubscription.deploy({
    gasLimit: estimatedGas.mul(120).div(100), // Add 20% buffer
  });

  console.log("⏳ Waiting for deployment...");
  await contract.deployed();

  console.log("✅ Contract deployed successfully!");
  console.log("📍 Contract address:", contract.address);
  console.log("🔗 Explorer:", `https://testnet.sonicscan.org/address/${contract.address}`);
  
  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const subscriptionPrice = await contract.SUBSCRIPTION_PRICE();
  const subscriptionDuration = await contract.SUBSCRIPTION_DURATION();
  
  console.log("Subscription price:", ethers.utils.formatEther(subscriptionPrice), "S tokens");
  console.log("Subscription duration:", subscriptionDuration.toString(), "seconds (30 days)");

  // Save deployment info
  const deploymentInfo = {
    network: "sonic-testnet",
    contractAddress: contract.address,
    deployer: deployer.address,
    blockNumber: contract.deployTransaction.blockNumber,
    transactionHash: contract.deployTransaction.hash,
    subscriptionPrice: ethers.utils.formatEther(subscriptionPrice),
    subscriptionDuration: subscriptionDuration.toString(),
    deployedAt: new Date().toISOString(),
  };

  // Write to file
  const fs = require('fs');
  const path = require('path');
  
  const deploymentPath = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(deploymentPath, 'astra-subscription.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n💾 Deployment info saved to deployments/astra-subscription.json");
  
  console.log("\n🎉 Deployment Complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 NEXT STEPS:");
  console.log("1. Update frontend with contract address");
  console.log("2. Test subscription purchase");
  console.log("3. Integrate with AI backend");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });