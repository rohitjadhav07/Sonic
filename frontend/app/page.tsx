'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import ChatInterface from '../components/ChatInterface'
import SubscriptionManager from '../components/SubscriptionManager'
import { Sparkles, Zap } from 'lucide-react'

export default function Home() {
  const { isConnected } = useAccount()
  const [showChat, setShowChat] = useState(true)

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Smart Sonic
                </h1>
                <p className="text-sm text-gray-500">AI Blockchain Agent</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Sonic Testnet</span>
              </div>
              {isConnected && <ConnectButton />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isConnected ? (
          <div>
            {/* Subscription Manager */}
            <div className="mb-8">
              <SubscriptionManager />
            </div>

            {/* Connected State */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Smart Sonic</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                Your AI-powered blockchain agent for Sonic Network. Manage your portfolio, send transactions, 
                create NFTs, generate payment links, and explore DeFi - all through natural conversation.
              </p>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="text-xl mb-1">⚡</div>
                  <div className="text-sm font-semibold text-gray-900">0.4s</div>
                  <div className="text-xs text-gray-600">Finality</div>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="text-xl mb-1">💰</div>
                  <div className="text-sm font-semibold text-gray-900">95%</div>
                  <div className="text-xs text-gray-600">Lower Fees</div>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="text-xl mb-1">🗣️</div>
                  <div className="text-sm font-semibold text-gray-900">Voice</div>
                  <div className="text-xs text-gray-600">Commands</div>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="text-xl mb-1">🤖</div>
                  <div className="text-sm font-semibold text-gray-900">AI</div>
                  <div className="text-xs text-gray-600">Powered</div>
                </div>
              </div>
            </div>
            <ChatInterface />
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect your wallet to start using Smart Sonic on Sonic Network. 
              Experience lightning-fast transactions, ultra-low fees, and AI-powered blockchain interactions.
            </p>
            <div className="mb-8">
              <ConnectButton />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-3xl mb-4">💼</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Management</h3>
                <p className="text-gray-600 text-sm">
                  View real-time balances, track your S tokens, and monitor portfolio performance with AI insights.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Transactions</h3>
                <p className="text-gray-600 text-sm">
                  Send S tokens instantly with sub-second finality and ultra-low fees on Sonic Network.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">NFT Creation</h3>
                <p className="text-gray-600 text-sm">
                  Create and mint NFTs through simple AI commands. Generate art, metadata, and deploy contracts.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}