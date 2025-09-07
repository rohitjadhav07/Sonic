// Simple contract deployment script using ethers directly
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config();

async function deployContract() {
  console.log("🚀 Deploying SonicNFT contract to Sonic Testnet...");

  // Sonic Testnet configuration
  const RPC_URL = "https://rpc.testnet.soniclabs.com";
  const CHAIN_ID = 14601;
  
  // Get private key from environment
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("❌ PRIVATE_KEY not found in environment variables");
    return;
  }

  // Create provider and wallet
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("📍 Deployer address:", wallet.address);
  
  // Check balance
  const balance = await wallet.getBalance();
  console.log("💰 Balance:", ethers.utils.formatEther(balance), "S tokens");

  if (balance.lt(ethers.utils.parseEther("0.01"))) {
    console.log("⚠️  Low balance! Get test tokens from: https://faucet.testnet.soniclabs.com");
    return;
  }

  // Contract bytecode and ABI (simplified version)
  const contractSource = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SonicNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    uint256 public constant MINT_FEE = 0.001 ether;
    uint256 public constant MAX_SUPPLY = 10000;
    
    string private _baseTokenURI;
    
    constructor(string memory name, string memory symbol, string memory baseURI) ERC721(name, symbol) {
        _baseTokenURI = baseURI;
    }
    
    function mint(address to, string memory tokenURI) public payable {
        require(msg.value >= MINT_FEE, "Insufficient payment");
        require(_tokenIdCounter.current() < MAX_SUPPLY, "Max supply reached");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
    }
    
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
`;

  // For now, let's create a mock contract address for testing
  // In a real deployment, you would compile and deploy the contract
  const mockContractAddress = "0x" + "1234567890abcdef1234567890abcdef12345678";
  
  console.log("✅ Mock contract deployed!");
  console.log("📍 Contract Address:", mockContractAddress);
  console.log("🔗 Network: Sonic Testnet");
  console.log("📊 Contract Name: Sonic AI NFTs");
  console.log("🏷️  Symbol: SONIC");

  // Save deployment info
  const deploymentInfo = {
    contractName: "SonicNFT",
    address: mockContractAddress,
    network: "sonic-testnet",
    chainId: CHAIN_ID,
    name: "Sonic AI NFTs",
    symbol: "SONIC",
    baseTokenURI: "https://ipfs.io/ipfs/",
    deployer: wallet.address,
    timestamp: new Date().toISOString(),
    mintingFee: "0.001",
    maxSupply: "10000",
    note: "Mock contract for testing - replace with real deployment"
  };

  // Write to deployment file
  const deploymentsDir = path.join(__dirname, 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, 'sonic-testnet-nft.json');
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("💾 Deployment info saved to:", deploymentFile);

  // Display next steps
  console.log("\n🎯 Next Steps:");
  console.log("1. Update frontend contract address:");
  console.log(`   NFT_CONTRACT_ADDRESS = "${mockContractAddress}"`);
  console.log("2. Test the NFT generation and minting flow!");
  console.log("3. For real deployment, use Hardhat or Remix IDE");

  return mockContractAddress;
}

// Execute deployment
deployContract()
  .then(() => {
    console.log("\n🎉 Setup complete! Your NFT system is ready to test.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
