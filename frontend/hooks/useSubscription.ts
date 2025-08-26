'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'

// ABI for the subscription contract
const SUBSCRIPTION_ABI = [
  {
    "inputs": [],
    "name": "SUBSCRIPTION_PRICE",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "purchaseSubscription",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "isSubscriptionActive",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getSubscription",
    "outputs": [{
      "components": [
        {"internalType": "uint256", "name": "id", "type": "uint256"},
        {"internalType": "address", "name": "user", "type": "address"},
        {"internalType": "uint256", "name": "startTime", "type": "uint256"},
        {"internalType": "uint256", "name": "endTime", "type": "uint256"},
        {"internalType": "bool", "name": "active", "type": "bool"},
        {"internalType": "uint256", "name": "operations", "type": "uint256"},
        {"internalType": "uint256", "name": "totalSpent", "type": "uint256"}
      ],
      "internalType": "struct SmartSonicSubscription.Subscription",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getTimeRemaining",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Contract address (will be updated after deployment)
const SUBSCRIPTION_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT || '0x0000000000000000000000000000000000000000'

export function useSubscription() {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cachedSubscription, setCachedSubscription] = useState<any>(null)

  // Load cached subscription data on mount
  useEffect(() => {
    if (address) {
      const cached = localStorage.getItem(`subscription_${address}`)
      if (cached) {
        try {
          const parsedCache = JSON.parse(cached)
          // Check if cache is still valid (not expired)
          if (parsedCache.endTime && Date.now() < parsedCache.endTime * 1000) {
            setCachedSubscription(parsedCache)
          } else {
            // Remove expired cache
            localStorage.removeItem(`subscription_${address}`)
          }
        } catch (e) {
          localStorage.removeItem(`subscription_${address}`)
        }
      }
    }
  }, [address])

  // Read subscription status
  const { data: isActive, refetch: refetchStatus } = useReadContract({
    address: SUBSCRIPTION_CONTRACT_ADDRESS as `0x${string}`,
    abi: SUBSCRIPTION_ABI,
    functionName: 'isSubscriptionActive',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Read subscription details
  const { data: subscriptionData, refetch: refetchSubscription } = useReadContract({
    address: SUBSCRIPTION_CONTRACT_ADDRESS as `0x${string}`,
    abi: SUBSCRIPTION_ABI,
    functionName: 'getSubscription',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Read time remaining
  const { data: timeRemaining, refetch: refetchTime } = useReadContract({
    address: SUBSCRIPTION_CONTRACT_ADDRESS as `0x${string}`,
    abi: SUBSCRIPTION_ABI,
    functionName: 'getTimeRemaining',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Write contract hook
  const { 
    data: purchaseHash, 
    writeContract,
    isPending: isPurchaseLoading 
  } = useWriteContract()

  // Wait for purchase transaction
  const { 
    isLoading: isWaitingForPurchase, 
    isSuccess: isPurchaseSuccess 
  } = useWaitForTransactionReceipt({
    hash: purchaseHash,
  })

  // Purchase subscription function
  const purchaseSubscription = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      if (!address) {
        throw new Error('Wallet not connected')
      }
      
      writeContract({
        address: SUBSCRIPTION_CONTRACT_ADDRESS as `0x${string}`,
        abi: SUBSCRIPTION_ABI,
        functionName: 'purchaseSubscription',
        value: parseEther('1'), // 1 S token
      })
    } catch (err: any) {
      setError(err.message || 'Failed to purchase subscription')
      setIsLoading(false)
    }
  }

  // Update loading state when transaction is confirmed
  useEffect(() => {
    if (isPurchaseSuccess) {
      setIsLoading(false)
      refetchStatus()
      refetchSubscription()
      refetchTime()
    }
  }, [isPurchaseSuccess])

  // Cache subscription data when it changes
  useEffect(() => {
    if (address && subscriptionData && isActive) {
      const cacheData = {
        ...subscriptionData,
        cachedAt: Date.now(),
        endTime: Number(subscriptionData[3]) // endTime from contract
      }
      localStorage.setItem(`subscription_${address}`, JSON.stringify(cacheData))
      setCachedSubscription(cacheData)
    }
  }, [address, subscriptionData, isActive])

  // Format time remaining
  const formatTimeRemaining = (seconds: bigint | undefined) => {
    if (!seconds) return '0 days'
    
    const secondsNum = Number(seconds)
    const days = Math.floor(secondsNum / (24 * 60 * 60))
    const hours = Math.floor((secondsNum % (24 * 60 * 60)) / (60 * 60))
    
    if (days > 0) {
      return `${days} days, ${hours} hours`
    } else if (hours > 0) {
      return `${hours} hours`
    } else {
      return `${Math.floor(secondsNum / 60)} minutes`
    }
  }

  return {
    // Status
    isActive: Boolean(isActive) || (cachedSubscription && Date.now() < cachedSubscription.endTime * 1000),
    isLoading: isLoading || isPurchaseLoading || isWaitingForPurchase,
    error,
    
    // Subscription data
    subscription: subscriptionData || cachedSubscription,
    timeRemaining: formatTimeRemaining(timeRemaining),
    timeRemainingSeconds: timeRemaining,
    
    // Actions
    purchaseSubscription,
    isPurchaseSuccess,
    
    // Utils
    refetch: () => {
      refetchStatus()
      refetchSubscription()
      refetchTime()
    },
    
    // Contract info
    contractAddress: SUBSCRIPTION_CONTRACT_ADDRESS,
    subscriptionPrice: '1 S',
  }
}