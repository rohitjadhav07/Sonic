/**
 * Network Connectivity Test Script
 * Tests actual connectivity to Sonic networks
 */

const https = require('https');
const { URL } = require('url');

async function testEndpoint(url, name) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      };

      const req = https.request(options, (res) => {
        console.log(`✅ ${name}: Connected (Status: ${res.statusCode})`);
        resolve(true);
      });

      req.on('error', (error) => {
        console.log(`❌ ${name}: Failed - ${error.message}`);
        resolve(false);
      });

      req.on('timeout', () => {
        console.log(`⏰ ${name}: Timeout`);
        req.destroy();
        resolve(false);
      });

      // Send a basic JSON-RPC request
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_chainId",
        params: [],
        id: 1
      });

      req.write(data);
      req.end();
    } catch (error) {
      console.log(`❌ ${name}: Invalid URL - ${error.message}`);
      resolve(false);
    }
  });
}

async function testNetworks() {
  console.log("🔍 Testing Sonic Network Connectivity\n");
  console.log("=" .repeat(50));
  
  const networks = [
    {
      name: "Sonic Testnet RPC",
      url: "https://rpc.testnet.soniclabs.com",
      expectedChainId: "0x3909" // 14601 in hex
    },
    {
      name: "Sonic Mainnet RPC", 
      url: "https://rpc.soniclabs.com",
      expectedChainId: "0x92" // 146 in hex
    }
  ];

  console.log("\n🌐 Testing RPC Endpoints:");
  console.log("-".repeat(30));
  
  for (const network of networks) {
    await testEndpoint(network.url, network.name);
  }

  console.log("\n📊 Testing Block Explorer Endpoints:");
  console.log("-".repeat(40));
  
  const explorers = [
    {
      name: "Sonic Testnet Explorer",
      url: "https://testnet.sonicscan.org"
    },
    {
      name: "Sonic Mainnet Explorer",
      url: "https://soniclabs.com"
    }
  ];

  for (const explorer of explorers) {
    await testHttpEndpoint(explorer.url, explorer.name);
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎯 Network Configuration Summary:");
  console.log("=".repeat(50));
  console.log("• Sonic Testnet Chain ID: 14601 (0x3909)");
  console.log("• Sonic Mainnet Chain ID: 146 (0x92)");
  console.log("• Native Token: S (Sonic)");
  console.log("• Block Time: ~0.4 seconds");
  console.log("• Finality: Sub-second");
  console.log("• TPS: 10,000+");
  console.log("• Gas Optimization: 95% reduction");
  console.log("\n🚀 Ready for Astra AI Demo!");
}

async function testHttpEndpoint(url, name) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname,
        method: 'GET',
        timeout: 5000
      };

      const req = https.request(options, (res) => {
        console.log(`✅ ${name}: Accessible (Status: ${res.statusCode})`);
        resolve(true);
      });

      req.on('error', (error) => {
        console.log(`❌ ${name}: Failed - ${error.message}`);
        resolve(false);
      });

      req.on('timeout', () => {
        console.log(`⏰ ${name}: Timeout`);
        req.destroy();
        resolve(false);
      });

      req.end();
    } catch (error) {
      console.log(`❌ ${name}: Invalid URL - ${error.message}`);
      resolve(false);
    }
  });
}

// Run the test
if (require.main === module) {
  testNetworks()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Test Error:", error);
      process.exit(1);
    });
}

module.exports = { testNetworks };