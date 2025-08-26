'use client'

import { useState } from 'react'
import { ExternalLink, Copy, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react'

interface TransactionDetailsProps {
  data: {
    hash: string
    from: string
    to: string
    value_s: number
    fee_s: number
    status: string
    block_number: number
    gas_used: number
    gas_limit: number
    gas_price_gwei: number
    nonce: number
    explorer_url: string
  }
}

export default function TransactionDetails({ data }: TransactionDetailsProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(item)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getStatusDisplay = () => {
    switch (data.status) {
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          text: 'Success',
          color: 'text-green-600 bg-green-50'
        }
      case 'failed':
        return {
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          text: 'Failed',
          color: 'text-red-600 bg-red-50'
        }
      default:
        return {
          icon: <Clock className="w-5 h-5 text-yellow-500" />,
          text: 'Pending',
          color: 'text-yellow-600 bg-yellow-50'
        }
    }
  }

  const status = getStatusDisplay()
  const gasEfficiency = ((data.gas_used / data.gas_limit) * 100).toFixed(1)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Transaction Details</h3>
          <p className="text-sm text-gray-600">Sonic Testnet Transaction</p>
        </div>
        <a
          href={data.explorer_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
        >
          <span>View on Explorer</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Status and Value */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            {status.icon}
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
              {status.text}
            </span>
          </div>
          <p className="text-sm text-gray-600">Transaction Status</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {data.value_s.toFixed(4)} S
          </div>
          <p className="text-sm text-gray-600">Value Transferred</p>
        </div>
      </div>

      {/* Transaction Flow */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Transaction Flow</h4>
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">From</p>
            <button
              onClick={() => copyToClipboard(data.from, 'from')}
              className="flex items-center space-x-1 text-sm font-mono text-gray-700 hover:text-gray-900"
            >
              <span>{data.from.slice(0, 10)}...{data.from.slice(-8)}</span>
              {copiedItem === 'from' ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
          
          <ArrowRight className="w-5 h-5 text-gray-400" />
          
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">To</p>
            <button
              onClick={() => copyToClipboard(data.to, 'to')}
              className="flex items-center space-x-1 text-sm font-mono text-gray-700 hover:text-gray-900"
            >
              <span>{data.to.slice(0, 10)}...{data.to.slice(-8)}</span>
              {copiedItem === 'to' ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Hash */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Transaction Hash</h4>
        <button
          onClick={() => copyToClipboard(data.hash, 'hash')}
          className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg w-full text-left hover:bg-gray-100 transition-colors"
        >
          <span className="font-mono text-sm text-gray-700 break-all">{data.hash}</span>
          {copiedItem === 'hash' ? (
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400 flex-shrink-0" />
          )}
        </button>
      </div>

      {/* Gas and Fee Information */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{data.gas_used.toLocaleString()}</div>
          <div className="text-xs text-blue-600">Gas Used</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">{data.gas_limit.toLocaleString()}</div>
          <div className="text-xs text-purple-600">Gas Limit</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{gasEfficiency}%</div>
          <div className="text-xs text-green-600">Efficiency</div>
        </div>
        
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">{data.fee_s.toFixed(6)} S</div>
          <div className="text-xs text-orange-600">Total Fee</div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Block Number</p>
          <p className="font-semibold text-gray-900">{data.block_number?.toLocaleString() || 'Pending'}</p>
        </div>
        
        <div>
          <p className="text-gray-500">Gas Price</p>
          <p className="font-semibold text-gray-900">{data.gas_price_gwei.toFixed(2)} Gwei</p>
        </div>
        
        <div>
          <p className="text-gray-500">Nonce</p>
          <p className="font-semibold text-gray-900">{data.nonce}</p>
        </div>
      </div>

      {/* Sonic Network Benefits */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-700">Sonic Network Benefits</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
          <div>⚡ Sub-second finality</div>
          <div>💰 Ultra-low fees</div>
          <div>🔒 EVM compatible</div>
          <div>🚀 High throughput</div>
        </div>
      </div>
    </div>
  )
}