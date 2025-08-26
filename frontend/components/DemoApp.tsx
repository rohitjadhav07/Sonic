'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Zap } from 'lucide-react'
import ChatInterface from './ChatInterface'
import DemoFallback from './DemoFallback'

export default function DemoApp() {
  const [isReady, setIsReady] = useState(false)
  const [showChat, setShowChat] = useState(true)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize the app safely
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">🚀</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Loading Astra AI...</h2>
          <p className="text-gray-600 mt-2">Sonic Hackathon 2024</p>
        </div>
      </div>
    )
  }

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
                  Astra AI
                </h1>
                <p className="text-sm text-gray-500">🚀 Sonic Hackathon 2024</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Demo Mode</span>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                Ready for Judging 🏆
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showChat ? (
          <div>
            {/* Hero Banner for Demo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
                🏆 Sonic Hackathon 2024 - AI-Powered Blockchain Agent
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Meet <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Astra AI</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                The first conversational AI agent for Sonic Network. Experience lightning-fast blockchain interactions 
                through natural conversation powered by Sonic's sub-second finality and 95% lower gas fees.
              </p>
              
              {/* Quick Stats */}
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
              Welcome to Astra AI
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Your AI-powered blockchain agent for Sonic - the fastest blockchain. Start chatting to manage your portfolio, 
              execute lightning-fast transactions, and explore Web3 through natural conversation.
            </p>
            <button
              onClick={() => setShowChat(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Chatting with Astra 🚀
            </button>
          </div>
        )}
      </div>
    </main>
  )
}