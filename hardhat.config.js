require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    "sonic-testnet": {
      url: process.env.SONIC_TESTNET_RPC_URL || "https://rpc.testnet.soniclabs.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 14601,
      gasPrice: "auto",
      gas: "auto",
      timeout: 60000,
      confirmations: 1,
    },
    "sonic-mainnet": {
      url: process.env.SONIC_MAINNET_RPC_URL || "https://rpc.soniclabs.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 146,
      gasPrice: "auto",
      gas: "auto",
      timeout: 60000,
      confirmations: 2,
    },
  },
  etherscan: {
    apiKey: {
      "sonic-testnet": process.env.SONIC_TESTNET_API_KEY || "abc",
      "sonic-mainnet": process.env.SONIC_MAINNET_API_KEY || "abc",
    },
    customChains: [
      {
        network: "sonic-testnet",
        chainId: 14601,
        urls: {
          apiURL: "https://testnet.sonicscan.org/api",
          browserURL: "https://testnet.sonicscan.org"
        }
      },
      {
        network: "sonic-mainnet",
        chainId: 146,
        urls: {
          apiURL: "https://soniclabs.com/api",
          browserURL: "https://soniclabs.com"
        }
      }
    ]
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};