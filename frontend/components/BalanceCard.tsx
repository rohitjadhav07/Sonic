'use client'

import { Wallet, TrendingUp, DollarSign } from 'lucide-react'

interface BalanceData {
  token: string
  balance: string
  usdValue: string
  change24h?: string
  address: string
}

interface BalanceCardProps {
  data: BalanceData
}

export default function BalanceCard({ data }: BalanceCardProps) {
  const isPositiveChange = data.change24h && parseFloat(data.change24h) >= 0

  return (
    <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{data.token} Balance</h3>
            <p className="text-sm text-gray-500">
              {data.address.slice(0, 6)}...{data.address.slice(-4)}
            </p>
          </div>
        </div>
        {data.change24h && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
            isPositiveChange ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <TrendingUp className={`w-4 h-4 ${!isPositiveChange && 'rotate-180'}`} />
            <span className="text-sm font-medium">{data.change24h}%</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{data.balance}</span>
          <span className="text-lg text-gray-500">{data.token}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span className="text-lg font-medium">${data.usdValue}</span>
          <span className="text-sm">USD</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Network</span>
          <span className="font-medium">Sonic Testnet</span>
        </div>
      </div>
    </div>
  )
}