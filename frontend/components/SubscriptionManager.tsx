'use client'

import { useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { useSubscription } from '../hooks/useSubscription'
import { Crown, Clock, Zap, CheckCircle, AlertCircle } from 'lucide-react'

export default function SubscriptionManager() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const {
    isActive,
    isLoading,
    error,
    subscription,
    timeRemaining,
    purchaseSubscription,
    isPurchaseSuccess,
    subscriptionPrice,
  } = useSubscription()

  const [showDetails, setShowDetails] = useState(false)

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center space-x-3 mb-4">
          <Crown className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">Smart Sonic Premium</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Connect your wallet to access AI-powered blockchain operations for just 1 S token!
        </p>
        <div className="flex items-center space-x-2 text-sm text-purple-600">
          <Zap className="w-4 h-4" />
          <span>Autonomous AI operations</span>
        </div>
      </div>
    )
  }

  if (isActive) {
    return (
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Premium Active</h3>
          </div>
          <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold">
            ACTIVE
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Time Remaining</p>
            <p className="font-semibold text-gray-900">{timeRemaining}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Operations Used</p>
            <p className="font-semibold text-gray-900">
              {subscription ? Number(subscription[5]) : 0}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-green-600 mb-4">
          <Zap className="w-4 h-4" />
          <span>AI can now perform autonomous operations!</span>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>

        {showDetails && subscription && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Subscription ID</p>
                <p className="font-mono">{Number(subscription[0])}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Spent</p>
                <p className="font-semibold">{Number(subscription[6]) / 1e18} S</p>
              </div>
              <div>
                <p className="text-gray-600">Start Date</p>
                <p>{new Date(Number(subscription[2]) * 1000).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">End Date</p>
                <p>{new Date(Number(subscription[3]) * 1000).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center space-x-3 mb-4">
        <Crown className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">Upgrade to Premium</h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        Unlock AI-powered autonomous blockchain operations for just {subscriptionPrice} token!
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>Autonomous transaction execution</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>AI-powered DeFi operations</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>Smart contract interactions</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>30-day access period</span>
        </div>
      </div>

      {balance && Number(balance.formatted) < 1 && (
        <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <p className="text-sm text-yellow-700">
            You need at least 1 S token to purchase a subscription.
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Your Balance</p>
          <p className="font-semibold text-gray-900">
            {balance ? `${Number(balance.formatted).toFixed(4)} S` : '0 S'}
          </p>
        </div>
        
        <button
          onClick={purchaseSubscription}
          disabled={isLoading || !balance || Number(balance.formatted) < 1}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `Purchase for ${subscriptionPrice}`
          )}
        </button>
      </div>

      {isPurchaseSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-700">
              Subscription purchased successfully! AI operations are now enabled.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}