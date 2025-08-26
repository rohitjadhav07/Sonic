'use client'

import { Wallet, MessageCircle, Zap, Shield, Sparkles, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: MessageCircle,
    title: 'Natural Language Interface',
    description: 'Chat with your wallet using simple commands like "Send 10 S to my friend"'
  },
  {
    icon: Wallet,
    title: 'Smart Portfolio Management',
    description: 'Real-time S token balance tracking with Sonic\'s FeeM optimization'
  },
  {
    icon: Zap,
    title: 'Lightning-Fast Transactions',
    description: 'Execute blockchain operations through conversation on Sonic - the fastest blockchain'
  },
  {
    icon: Shield,
    title: 'FeeM Integration',
    description: 'Optimized gas usage through Sonic\'s advanced fee market and ultra-low costs'
  }
]

export default function WelcomeScreen() {
  return (
    <div className="text-center py-12">
      {/* Hero Section */}
      <div className="mb-16">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Meet Astra AI 🚀
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          The first AI-powered blockchain agent for Sonic - the fastest, most builder-aligned blockchain. 
          Manage your crypto portfolio, execute lightning-fast transactions, and explore Web3 
          through natural conversation with FeeM optimization.
        </p>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 max-w-2xl mx-auto mb-8">
          <p className="text-lg font-medium text-gray-800 mb-2">
            🎯 Connect your wallet to get started
          </p>
          <p className="text-gray-600">
            Experience blockchain interaction like never before - just talk to Astra!
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => (
          <div key={index} className="card text-left">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Demo Examples */}
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Try These Commands
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            '"Show my S token balance"',
            '"Send 10 S to my friend"',
            '"Generate payment link for 50 S"',
            '"Create an NFT of a sunset"',
            '"What\'s the current FeeM rate?"',
            '"Schedule monthly payment"'
          ].map((command, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-gray-700 font-medium">{command}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}