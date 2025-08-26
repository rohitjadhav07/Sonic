'use client'

import { useState } from 'react'
import { ExternalLink, Copy, Clock, ArrowUpRight, ArrowDownLeft, CheckCircle, XCircle } from 'lucide-react'

interface Transaction {
  hash: string
  short_hash: string
  direction: 'sent' | 'received'
  amount: string
  fee: string
  status: 'success' | 'failed' | 'pending'
  timestamp: string
  counterparty: string
  block: number
  type: string
}

interface TransactionHistoryProps {
  data: {
    transactions: Transaction[]
    address: string
    total_found: number
    network: string
    explorer_url: string
  }
}

export default function TransactionHistory({ data }: TransactionHistoryProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const copyToClipboard = async (text: string, hash: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedHash(hash)
      setTimeout(() => setCopiedHash(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getDirectionIcon = (direction: string) => {
    return direction === 'sent' 
      ? <ArrowUpRight className="w-4 h-4 text-red-500" />
      : <ArrowDownLeft className="w-4 h-4 text-green-500" />
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
          <p className="text-sm text-gray-600">
            {data.total_found} transactions found on {data.network}
          </p>
        </div>
        <a
          href={`${data.explorer_url}/address/${data.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
        >
          <span>View on Explorer</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {data.transactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">No transactions found</p>
          <p className="text-sm text-gray-500 mt-1">
            Start using Smart Sonic to see your activity here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.transactions.map((tx, index) => (
            <div
              key={tx.hash}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getDirectionIcon(tx.direction)}
                  {getStatusIcon(tx.status)}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {tx.direction === 'sent' ? 'Sent' : 'Received'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {tx.type === 'transfer' ? 'Transfer' : 'Contract'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      onClick={() => copyToClipboard(tx.hash, tx.hash)}
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      <span className="font-mono">{tx.short_hash}</span>
                      {copiedHash === tx.hash ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">Block {tx.block}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {tx.direction === 'sent' ? '-' : '+'}{tx.amount}
                </div>
                <div className="text-xs text-gray-500">
                  Fee: {tx.fee}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {tx.timestamp}
                </div>
              </div>

              <a
                href={`${data.explorer_url}/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      )}

      {data.transactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Showing {data.transactions.length} of {data.total_found} transactions
          </p>
        </div>
      )}
    </div>
  )
}