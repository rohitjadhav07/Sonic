'use client'

import { TrendingUp, Zap, DollarSign, Clock } from 'lucide-react'

interface FeeMData {
  currentRate: string
  trend: 'up' | 'down' | 'stable'
  change24h: string
  avgBlockTime: string
  gasOptimization: string
}

interface FeeMCardProps {
  data: FeeMData
}

export default function FeeMCard({ data }: FeeMCardProps) {
  const getTrendColor = () => {
    switch (data.trend) {
      case 'up':
        return 'text-red-600'
      case 'down':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getTrendIcon = () => {
    const className = `w-4 h-4 ${getTrendColor()}`
    switch (data.trend) {
      case 'up':
        return <TrendingUp className={className} />
      case 'down':
        return <TrendingUp className={`${className} rotate-180`} />
      default:
        return <TrendingUp className={className} />
    }
  }

  return (
    <div className="card bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sonic FeeM</h3>
            <p className="text-sm text-gray-500">Fee Market Status</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-lg">
          {getTrendIcon()}
          <span className="text-sm font-medium">{data.change24h}%</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{data.currentRate}</span>
          <span className="text-lg text-gray-500">Gwei</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Block Time</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">{data.avgBlockTime}s</span>
          </div>
          
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Optimization</span>
            </div>
            <span className="text-lg font-semibold text-green-600">{data.gasOptimization}%</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-3">
          <p className="text-sm text-purple-800 font-medium">
            ⚡ Sonic's FeeM provides ultra-low gas costs with sub-second finality
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Network</span>
          <span className="font-medium">Sonic Mainnet</span>
        </div>
      </div>
    </div>
  )
}