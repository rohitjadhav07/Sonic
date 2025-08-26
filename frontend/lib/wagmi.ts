import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { defineChain } from 'viem'

// Sonic Testnet configuration - Official network details
export const sonicTestnet = defineChain({
  id: 14601,
  name: 'Sonic Testnet',
  network: 'sonic-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sonic',
    symbol: 'S',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.soniclabs.com'],
    },
    public: {
      http: ['https://rpc.testnet.soniclabs.com'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Sonic Testnet Explorer', 
      url: 'https://testnet.sonicscan.org',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1,
    },
  },
  testnet: true,
})

// Sonic Mainnet configuration - Official network details  
export const sonicMainnet = defineChain({
  id: 146,
  name: 'Sonic Mainnet',
  network: 'sonic-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sonic',
    symbol: 'S',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.soniclabs.com'],
    },
    public: {
      http: ['https://rpc.soniclabs.com'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Sonic Explorer', 
      url: 'https://soniclabs.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1,
    },
  },
  testnet: false,
})

export const config = getDefaultConfig({
  appName: 'Astra AI - Sonic Blockchain Agent',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '2f05ae7f1116030fde2d36508f472bfb',
  chains: [sonicTestnet, sonicMainnet],
  ssr: true,
})