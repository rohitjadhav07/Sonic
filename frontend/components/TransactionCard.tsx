'use client'

import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react'

interface TransactionData {
  hash: string
  type: 'send' | 'receive'
  amount: string
  token: string
  to?: string
  from?: string
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: string
  gasUsed?: string
  usdValue?: string
}

interface TransactionCardProps {
  data: TransactionData
}

export default function TransactionCard({ data }: TransactionCardProps) {
  const getStatusIcon = () => {
    switch (data.status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusColor = () => {
    switch (data.status) {
      case 'pending':
        return 'bg-yellow-50 border-yellow-200'
      case 'confirmed':
        return 'bg-green-50 border-green-200'
      case 'failed':
        return 'bg-red-50 border-red-200'
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className={`card ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            data.type === 'send' 
              ? 'bg-gradient-to-r from-red-500 to-pink-600' 
              : 'bg-gradient-to-r from-green-500 to-emerald-600'
          }`}>
            {data.type === 'send' ? (
              <ArrowUpRight className="w-6 h-6 text-white" />
            ) : (
              <ArrowDownLeft className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {data.type} {data.token}
            </h3>
            <p className="text-sm text-gray-500">{data.timestamp}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium capitalize">{data.status}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline space-x-2">
          <span className={`text-2xl font-bold ${
            data.type === 'send' ? 'text-red-600' : 'text-green-600'
          }`}>
            {data.type === 'send' ? '-' : '+'}{data.amount}
          </span>
          <span className="text-lg text-gray-500">{data.token}</span>
        </div>
        
        {data.usdValue && (
          <div className="text-gray-600">
            <span className="text-lg font-medium">${data.usdValue} USD</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
        {data.to && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">To</span>
            <span className="font-medium">{formatAddress(data.to)}</span>
          </div>
        )}
        {data.from && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">From</span>
            <span className="font-medium">{formatAddress(data.from)}</span>
          </div>
        )}
        {data.gasUsed && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Gas Used</span>
            <span className="font-medium">{data.gasUsed}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Hash</span>
          <div className="flex items-center space-x-1">
            <span className="font-medium">{formatAddress(data.hash)}</span>
            <button className="text-blue-500 hover:text-blue-600">
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}