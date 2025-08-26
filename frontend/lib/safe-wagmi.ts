import { createConfig, http } from 'wagmi'
import { defineChain } from 'viem'
import { injected, metaMask } from 'wagmi/connectors'

// Sonic Testnet - Simplified for demo stability
export const sonicTestnet = defineChain({
  id: 14601,
  name: 'Sonic Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sonic',
    symbol: 'S',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.soniclabs.com'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Sonic Testnet Explorer', 
      url: 'https://testnet.sonicscan.org',
    },
  },
  testnet: true,
})

// Create the most stable wagmi config possible
export const safeConfig = createConfig({
  chains: [sonicTestnet],
  connectors: [
    injected({ shimDisconnect: true }),
    metaMask({ shimDisconnect: true }),
  ],
  transports: {
    [sonicTestnet.id]: http('https://rpc.testnet.soniclabs.com', {
      batch: true,
      fetchOptions: {
        timeout: 10000,
      },
    }),
  },
  ssr: true,
  batch: {
    multicall: {
      batchSize: 512,
      wait: 32,
    },
  },
  pollingInterval: 8000,
})

// Safe hook wrapper
export function useSafeAccount() {
  try {
    const { useAccount } = require('wagmi')
    return useAccount()
  } catch (error) {
    console.log('Wagmi not available, using demo mode')
    return { 
      isConnected: false, 
      address: undefined,
      isConnecting: false,
      isDisconnected: true
    }
  }
}