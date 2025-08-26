'use client'

import { useState } from 'react'
import ChatInterface from './ChatInterface'

export default function DemoFallback() {
  const [showDemo, setShowDemo] = useState(false)

  if (showDemo) {
    return <ChatInterface />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center p-8 max-w-2xl">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🚀</span>
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Astra AI
        </h1>
        
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
          🏆 Sonic Hackathon 2024 - AI Blockchain Agent
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready for Demo!
        </h2>
        
        <p className="text-lg text-gray-600 mb-8">
          Experience the first AI-powered blockchain agent for Sonic Network. 
          Chat naturally to manage portfolios, execute transactions, and explore DeFi.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-sm font-semibold text-gray-900">0.4s</div>
            <div className="text-xs text-gray-600">Finality</div>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-sm font-semibold text-gray-900">95%</div>
            <div className="text-xs text-gray-600">Lower Fees</div>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🗣️</div>
            <div className="text-sm font-semibold text-gray-900">Voice</div>
            <div className="text-xs text-gray-600">Commands</div>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-sm font-semibold text-gray-900">AI</div>
            <div className="text-xs text-gray-600">Powered</div>
          </div>
        </div>
        
        <button
          onClick={() => setShowDemo(true)}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Start Demo 🚀
        </button>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Built by university students from India 🇮🇳</p>
          <p>Making Web3 accessible through AI conversation</p>
        </div>
      </div>
    </div>
  )
}