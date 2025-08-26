const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Astra AI Smart Contracts to Sonic Network...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy AstraAccessControl
  console.log("\n📋 Deploying AstraAccessControl...");
  const AstraAccessControl = await ethers.getContractFactory("AstraAccessControl");
  const accessControl = await AstraAccessControl.deploy();
  await accessControl.deployed();
  console.log("✅ AstraAccessControl deployed to:", accessControl.address);

  // Deploy PaymentAutomation
  console.log("\n💰 Deploying PaymentAutomation...");
  const PaymentAutomation = await ethers.getContractFactory("PaymentAutomation");
  const paymentAutomation = await PaymentAutomation.deploy();
  await paymentAutomation.deployed();
  console.log("✅ PaymentAutomation deployed to:", paymentAutomation.address);

  // Save deployment addresses
  const deploymentInfo = {
    network: "sonic-testnet",
    contracts: {
      AstraAccessControl: accessControl.address,
      PaymentAutomation: paymentAutomation.address
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  console.log("\n📄 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Verify contracts (optional)
  if (process.env.VERIFY_CONTRACTS === "true") {
    console.log("\n🔍 Verifying contracts...");
    
    try {
      await hre.run("verify:verify", {
        address: accessControl.address,
        constructorArguments: [],
      });
      console.log("✅ AstraAccessControl verified");
    } catch (error) {
      console.log("❌ AstraAccessControl verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: paymentAutomation.address,
        constructorArguments: [],
      });
      console.log("✅ PaymentAutomation verified");
    } catch (error) {
      console.log("❌ PaymentAutomation verification failed:", error.message);
    }
  }

  console.log("\n🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });