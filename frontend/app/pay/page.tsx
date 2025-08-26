'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther, isAddress } from 'viem'
import { Copy, CheckCircle, ExternalLink, ArrowLeft, Zap } from 'lucide-react'
import Link from 'next/link'

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const { address, isConnected } = useAccount()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Get balance
  const { data: balance } = useBalance({ address })

  // Transaction hooks
  const { data: hash, sendTransaction, isPending } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    const toParam = searchParams.get('to')
    const amountParam = searchParams.get('amount')
    
    if (toParam && isAddress(toParam)) {
      setRecipient(toParam)
    }
    
    if (amountParam) {
      setAmount(amountParam)
    }
  }, [searchParams])

  const handleSend = async () => {
    if (!recipient || !amount || !isConnected) return

    try {
      setIsLoading(true)
      await sendTransaction({
        to: recipient as `0x${string}`,
        value: parseEther(amount),
      })
    } catch (error) {
      console.error('Transaction failed:', error)
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Smart Sonic</span>
              </Link>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Payment Request Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Request</h1>
            <p className="text-blue-100">Send S tokens on Sonic Network</p>
          </div>

          <div className="p-6">
            {/* Recipient Address */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Send To
              </label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                <span className="font-mono text-sm text-gray-700 break-all flex-1">
                  {recipient || 'No recipient specified'}
                </span>
                {recipient && (
                  <button
                    onClick={() => copyToClipboard(recipient)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            {/* Amount */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount
              </label>
              {amount ? (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {amount} S
                  </div>
                  <div className="text-sm text-blue-600">
                    ≈ ${(parseFloat(amount) * 2.0).toFixed(2)} USD
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Enter amount in S tokens"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setAmount(e.target.value)
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the amount of S tokens to send
                  </p>
                </div>
              )}
            </div>

            {/* Balance Display */}
            {isConnected && balance && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Your Balance:</span>
                  <span className="font-semibold text-gray-900">
                    {formatEther(balance.value)} S
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isConnected ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Connect your wallet to send payment</p>
                  <ConnectButton />
                </div>
              ) : !recipient ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ No recipient address specified in the payment link
                  </p>
                </div>
              ) : !amount ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    💡 Enter an amount above to send the payment
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={isLoading || isPending || isConfirming || !amount || parseFloat(amount) <= 0}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isPending || isConfirming ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{isPending ? 'Confirming...' : 'Processing...'}</span>
                    </div>
                  ) : (
                    `Send ${amount} S Tokens`
                  )}
                </button>
              )}
            </div>

            {/* Transaction Success */}
            {isSuccess && hash && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-green-800">Payment Sent Successfully!</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-green-600 mb-1">Transaction Hash:</p>
                    <p className="font-mono text-xs text-green-700 break-all">{hash}</p>
                  </div>
                  <a
                    href={`https://testnet.soniclabs.com/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-sm text-green-600 hover:text-green-700"
                  >
                    <span>View on Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Share Link */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Share Payment Link</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={currentUrl}
                  readOnly
                  className="flex-1 p-2 text-xs font-mono bg-gray-50 border border-gray-300 rounded"
                />
                <button
                  onClick={() => copyToClipboard(currentUrl)}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sonic Network Benefits */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Why Sonic Network?</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>⚡ Sub-second finality</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>💰 Ultra-low fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>🔒 EVM compatible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>🚀 High throughput</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}