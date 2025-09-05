'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import Image from 'next/image'
import ChatInterface from '../components/ChatInterface'
import Footer from '../components/Footer'
import { Sparkles, Zap, Shield, Rocket, Star } from 'lucide-react'

export default function Home() {
  const { isConnected } = useAccount()
  const [showChat, setShowChat] = useState(true)

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background SVGs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Stars */}
        <div className="absolute top-20 left-10 animate-float-slow">
          <Star className="w-6 h-6 text-yellow-400 opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-float-medium">
          <Star className="w-5 h-5 text-blue-400 opacity-50" />
        </div>
        <div className="absolute top-60 left-1/4 animate-float-fast">
          <Star className="w-4 h-4 text-purple-400 opacity-70" />
        </div>
        
        {/* Floating Shields */}
        <div className="absolute top-32 right-1/3 animate-float-slow">
          <Shield className="w-8 h-8 text-green-400 opacity-40" />
        </div>
        <div className="absolute top-80 left-1/3 animate-float-medium">
          <Shield className="w-6 h-6 text-blue-400 opacity-50" />
        </div>
        
        {/* Floating Rockets */}
        <div className="absolute top-24 right-1/4 animate-float-fast">
          <Rocket className="w-7 h-7 text-red-400 opacity-60" />
        </div>
        <div className="absolute top-72 right-10 animate-float-slow">
          <Rocket className="w-5 h-5 text-purple-400 opacity-50" />
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                <Image 
                  src="/logo.png" 
                  alt="Smart Sonic Logo" 
                  width={48} 
                  height={48}
                  className="rounded-xl"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Smart Sonic
                </h1>
                <p className="text-base text-gray-500">AI Blockchain Agent</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Sonic Testnet</span>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  href="/pricing"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Pricing
                </Link>
              </div>
              {isConnected && <ConnectButton />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isConnected ? (
          <div>
            {/* Video Section */}
            <div className="text-center mb-12 pt-8">
              <div className="max-w-2xl mx-auto mb-8">
                <video 
                  autoPlay 
                  muted 
                  loop 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                >
                  <source src="/home.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

                         {/* Connected State */}
             <div className="text-center mb-8">
               <h2 className="text-4xl font-bold mb-4">
                 <span className="text-gray-900">Welcome to </span>
                 <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_20px_rgba(147,51,234,0.5)] drop-shadow-[0_0_40px_rgba(59,130,246,0.3)] drop-shadow-[0_0_60px_rgba(236,72,153,0.2)]">
                   Smart Sonic
                 </span>
               </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                Your AI-powered blockchain agent for Sonic Network. Manage your portfolio, send transactions, 
                create NFTs, generate payment links, and explore DeFi - all through natural conversation.
              </p>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-xl mb-1">⚡</div>
                  <div className="text-sm font-semibold text-gray-900">0.4s</div>
                  <div className="text-xs text-gray-600">Finality</div>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-xl mb-1">💰</div>
                  <div className="text-sm font-semibold text-gray-900">95%</div>
                  <div className="text-xs text-gray-600">Lower Fees</div>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-xl mb-1">🤖</div>
                  <div className="text-sm font-semibold text-gray-900">AI</div>
                  <div className="text-xs text-gray-600">Powered</div>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-xl mb-1">🔒</div>
                  <div className="text-sm font-semibold text-gray-900">Secure</div>
                  <div className="text-xs text-gray-600">Network</div>
                </div>
              </div>
            </div>
            <ChatInterface />
          </div>
        ) : (
          <div className="text-center py-20">
            {/* Hero Section with Connect Wallet at 30% from top */}
            <div className="mb-16">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                <Image 
                  src="/logo.png" 
                  alt="Smart Sonic Logo" 
                  width={48} 
                  height={48}
                  className="rounded-lg"
                />
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
                Connect Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Wallet</span>
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto animate-fade-in-delay">
                Connect your wallet to start using Smart Sonic on Sonic Network. 
                Experience lightning-fast transactions, ultra-low fees, and AI-powered blockchain interactions.
              </p>
              
              {/* Connect Wallet Button with Glowing Effects */}
              <div className="mb-16 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                <div className="relative">
                  <ConnectButton />
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Portfolio Management</h3>
                <p className="text-gray-600">
                  View real-time balances, track your S tokens, and monitor portfolio performance with AI insights.
                </p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Transactions</h3>
                <p className="text-gray-600">
                  Send S tokens instantly with sub-second finality and ultra-low fees on Sonic Network.
                </p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">NFT Creation</h3>
                <p className="text-gray-600">
                  Create and mint NFTs through simple AI commands. Generate art, metadata, and deploy contracts.
                </p>
              </div>
            </div>

            {/* Additional Features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">AI-Powered DeFi</h4>
                <p className="text-gray-600 text-sm">
                  Get intelligent recommendations for yield farming, liquidity provision, and DeFi strategies.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Smart Contracts</h4>
                <p className="text-gray-600 text-sm">
                  Interact with smart contracts through natural language. Deploy, call, and manage contracts easily.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with proper spacing */}
      <div className="mt-20">
        <Footer />
      </div>
    </main>
  )
}