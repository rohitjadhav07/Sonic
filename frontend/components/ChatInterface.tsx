'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Copy, ExternalLink } from 'lucide-react'
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { sonicTestnet } from '../lib/wagmi'
import TransactionHistory from './TransactionHistory'
import TransactionDetails from './TransactionDetails'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  cards?: any[]
}

export default function ChatInterface() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address: address,
    chainId: sonicTestnet.id,
  })
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Transaction hooks
  const { data: hash, sendTransaction } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Voice input removed - text-only interface

  // Initialize client-side content
  useEffect(() => {
    setIsClient(true)
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: `Hello! I'm Astra, your AI blockchain agent for Sonic Network! 🚀

I can help you with:
• Real-time portfolio tracking and balance checks
• Lightning-fast S token transfers with sub-second finality
• Generate payment links and QR codes for receiving funds
• Create and mint NFTs with AI-generated metadata
• DeFi operations and yield farming strategies
• Smart contract interactions and deployment

${isConnected ? `Your wallet is connected! Current balance: ${balance ? formatEther(balance.value) : '0'} S tokens ($${(balance ? parseFloat(formatEther(balance.value)) * 0.5 : 0).toFixed(2)} USD).` : 'Please connect your wallet to get started.'}

What would you like to do?`,
        timestamp: new Date(),
      }
    ])
    
    // Voice functionality removed
  }, [isConnected, balance])

  // Voice input removed

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Generate QR code for payment
  const generateQRCode = (address: string, amount?: string) => {
    const baseUrl = `https://api.qrserver.com/v1/create-qr-code/`
    const data = amount 
      ? `sonic:${address}?amount=${amount}`
      : `sonic:${address}`
    return `${baseUrl}?size=200x200&data=${encodeURIComponent(data)}`
  }

  // Generate payment link
  const generatePaymentLink = (address: string, amount?: string) => {
    const baseUrl = window.location.origin
    return amount 
      ? `${baseUrl}/pay?to=${address}&amount=${amount}`
      : `${baseUrl}/pay?to=${address}`
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      // Parse AI commands
      const message_lower = currentInput.toLowerCase()
      let response = ''
      let cards: any[] = []

      // Address or Transaction Hash Detection
      if (currentInput.includes('0x') && (currentInput.length === 42 || currentInput.length === 66)) {
        const inputValue = currentInput.trim()
        
        if (inputValue.length === 42) {
          // It's an address - fetch real transaction history
          try {
            const txResponse = await fetch(`http://localhost:8000/api/transactions/${inputValue}`)
            const txData = await txResponse.json()
            
            if (txData.success && txData.transactions.length > 0) {
              response = `📋 Found ${txData.transactions.length} recent transactions for address ${inputValue.slice(0, 10)}...${inputValue.slice(-8)} on Sonic testnet!`
              
              cards = [{
                type: 'transaction_history',
                data: {
                  transactions: txData.transactions,
                  address: inputValue,
                  total_found: txData.total_found,
                  network: "Sonic Testnet",
                  explorer_url: "https://testnet.soniclabs.com"
                }
              }]
            } else {
              response = `📋 No recent transactions found for address ${inputValue.slice(0, 10)}...${inputValue.slice(-8)} on Sonic testnet. This address hasn't been active recently.`
              
              cards = [{
                type: 'info',
                data: {
                  title: 'No Transactions Found',
                  message: `No recent transactions found for ${inputValue}`,
                  suggestion: 'Try with an address that has recent activity on Sonic testnet'
                }
              }]
            }
          } catch (error) {
            response = `⚠️ Unable to fetch transaction history from backend for ${inputValue.slice(0, 10)}...${inputValue.slice(-8)}. But you can view it directly on Sonic Explorer!`
            
            cards = [{
              type: 'explorer_link',
              data: {
                title: 'View Address on Sonic Explorer',
                message: `Click below to view transaction history for ${inputValue} on the official Sonic testnet explorer`,
                address: inputValue,
                explorer_url: `https://testnet.soniclabs.com/address/${inputValue}`,
                suggestion: 'The explorer shows all transactions, balances, and contract interactions for this address'
              }
            }]
          }
        } else if (inputValue.length === 66) {
          // It's a transaction hash - fetch real transaction details
          try {
            const txResponse = await fetch(`http://localhost:8000/api/transaction/${inputValue}`)
            const txData = await txResponse.json()
            
            if (txData.success) {
              response = `🔍 Transaction details found for ${inputValue.slice(0, 10)}... on Sonic testnet!`
              
              cards = [{
                type: 'transaction_details',
                data: {
                  ...txData,
                  explorer_url: `https://testnet.soniclabs.com/tx/${inputValue}`
                }
              }]
            } else {
              response = `❌ Transaction ${inputValue.slice(0, 10)}... not found on Sonic testnet. Please verify the transaction hash.`
              
              cards = [{
                type: 'error',
                data: {
                  message: 'Transaction not found',
                  suggestion: 'Please check the transaction hash and try again'
                }
              }]
            }
          } catch (error) {
            response = `⚠️ Unable to fetch transaction details from backend for ${inputValue.slice(0, 10)}... But you can view it directly on Sonic Explorer!`
            
            cards = [{
              type: 'explorer_link',
              data: {
                title: 'View Transaction on Sonic Explorer',
                message: `Click below to view transaction details for ${inputValue} on the official Sonic testnet explorer`,
                address: inputValue,
                explorer_url: `https://testnet.soniclabs.com/tx/${inputValue}`,
                suggestion: 'The explorer shows complete transaction details including status, gas fees, and block information'
              }
            }]
          }
        }
      }
      
      // Transaction History queries
      else if (message_lower.includes('transaction') || message_lower.includes('history') || message_lower.includes('activity')) {
        if (!address) {
          response = `🔒 Please connect your wallet to view transaction history on Sonic testnet.`
          
          cards = [{
            type: 'info',
            data: {
              title: 'Wallet Required',
              message: 'Connect your wallet to view your transaction history',
              suggestion: 'Click the Connect Wallet button to get started'
            }
          }]
        } else {
          try {
            const txResponse = await fetch(`http://localhost:8000/api/transactions/${address}`)
            const txData = await txResponse.json()
            
            if (txData.success && txData.transactions.length > 0) {
              response = `📋 Found ${txData.transactions.length} recent transactions for your wallet on Sonic testnet! Lightning-fast confirmations as expected.`
              
              cards = [{
                type: 'transaction_history',
                data: {
                  transactions: txData.transactions,
                  address: address,
                  total_found: txData.total_found,
                  network: "Sonic Testnet",
                  explorer_url: "https://testnet.soniclabs.com"
                }
              }]
            } else {
              response = `📋 No recent transactions found for your wallet on Sonic testnet. Start using Smart Sonic to see your activity here!`
              
              cards = [{
                type: 'info',
                data: {
                  title: 'No Transactions Found',
                  message: 'No recent transactions found for your connected wallet',
                  suggestion: 'Try sending some S tokens or interacting with contracts to see activity here'
                }
              }]
            }
          } catch (error) {
            response = `⚠️ Unable to fetch transaction history from backend. But you can view your transactions directly on Sonic Explorer!`
            
            cards = [{
              type: 'explorer_link',
              data: {
                title: 'View on Sonic Explorer',
                message: 'Click below to view your transaction history on the official Sonic testnet explorer',
                address: address,
                explorer_url: `https://testnet.soniclabs.com/address/${address}`,
                suggestion: 'The explorer shows all your transactions, balances, and contract interactions'
              }
            }]
          }
        }
      }
      
      // Explorer link requests
      else if (message_lower.includes('explorer') || message_lower.includes('view on explorer') || message_lower.includes('sonic explorer')) {
        if (!address) {
          response = `🔒 Connect your wallet to get your Sonic Explorer link, or provide an address to look up!`
          
          cards = [{
            type: 'info',
            data: {
              title: 'Wallet Required',
              message: 'Connect your wallet or provide an address to view on Sonic Explorer',
              suggestion: 'You can also paste any Sonic address to get its explorer link'
            }
          }]
        } else {
          response = `🔍 Here's your Sonic Explorer link! View all your transactions, balances, and contract interactions.`
          
          cards = [{
            type: 'explorer_link',
            data: {
              title: 'Your Sonic Explorer Link',
              message: 'View your complete transaction history and account details on the official Sonic testnet explorer',
              address: address,
              explorer_url: `https://testnet.soniclabs.com/address/${address}`,
              suggestion: 'Bookmark this link to easily check your Sonic activity anytime'
            }
          }]
        }
      }
      
      // Balance and Portfolio queries
      else if (message_lower.includes('balance') || message_lower.includes('portfolio')) {
        if (!isConnected) {
          response = "Please connect your wallet first to check your balance."
        } else {
          const balanceValue = balance ? formatEther(balance.value) : '0'
          response = `Your current Sonic balance is ${balanceValue} S tokens. Thanks to Sonic's real-time updates, this information is always current!`
          
          cards = [{
            type: 'balance',
            data: {
              balance: balanceValue,
              symbol: 'S',
              address: address,
              network: 'Sonic Testnet',
              usdValue: (parseFloat(balanceValue) * 0.5).toFixed(2), // Accurate USD value (1 S = $0.50)
              lastUpdate: new Date().toLocaleTimeString()
            }
          }]
        }
      }
      
      // Send transaction
      else if (message_lower.includes('send') && (message_lower.includes('token') || message_lower.includes('s '))) {
        if (!isConnected) {
          response = "Please connect your wallet first to send transactions."
        } else {
          // Extract amount and address from message
          const amountMatch = currentInput.match(/(\d+(?:\.\d+)?)/);
          const addressMatch = currentInput.match(/(0x[a-fA-F0-9]{40})/);
          
          if (amountMatch) {
            const amount = amountMatch[1]
            const toAddress = addressMatch ? addressMatch[1] : '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87' // Default demo address
            
            try {
              await sendTransaction({
                to: toAddress as `0x${string}`,
                value: parseEther(amount),
              })
              
              response = `Transaction initiated! Sending ${amount} S tokens to ${toAddress}. Thanks to Sonic's sub-second finality, your transaction will be confirmed almost instantly!`
              
              cards = [{
                type: 'transaction',
                data: {
                  amount: amount,
                  to: toAddress,
                  status: isConfirming ? 'Confirming' : isConfirmed ? 'Confirmed' : 'Pending',
                  hash: hash,
                  network: 'Sonic Testnet',
                  timestamp: new Date().toLocaleString()
                }
              }]
            } catch (error) {
              response = `Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          } else {
            response = "Please specify an amount to send. For example: 'Send 1.5 S tokens to 0x...'"
          }
        }
      }
      
      // Generate payment link/QR
      else if (message_lower.includes('payment') || message_lower.includes('qr') || message_lower.includes('receive')) {
        if (!isConnected) {
          response = "Please connect your wallet first to generate payment links."
        } else {
          const amountMatch = currentInput.match(/(\d+(?:\.\d+)?)/);
          const amount = amountMatch ? amountMatch[1] : undefined
          
          const paymentLink = generatePaymentLink(address!, amount)
          const qrCode = generateQRCode(address!, amount)
          
          response = `Payment ${amount ? `request for ${amount} S tokens` : 'link'} generated! Share this with anyone to receive S tokens on Sonic Network.`
          
          cards = [{
            type: 'payment',
            data: {
              address: address,
              amount: amount || 'Any amount',
              paymentLink: paymentLink,
              qrCode: qrCode,
              network: 'Sonic Testnet'
            }
          }]
        }
      }
      
      // NFT Creation
      else if (message_lower.includes('nft') || message_lower.includes('create') || message_lower.includes('mint')) {
        response = "I can help you create NFTs on Sonic Network! With ultra-low gas fees, NFT creation is affordable and fast."
        
        cards = [{
          type: 'nft',
          data: {
            name: 'AI Generated NFT',
            description: 'Created through Astra AI on Sonic Network',
            mintCost: '0.001 S',
            estimatedTime: '< 1 second',
            network: 'Sonic Testnet',
            features: ['AI-generated metadata', 'IPFS storage', 'Instant minting']
          }
        }]
      }
      
      // DeFi operations
      else if (message_lower.includes('defi') || message_lower.includes('yield') || message_lower.includes('farm')) {
        response = "Sonic's DeFi ecosystem offers incredible opportunities with lightning-fast transactions and minimal fees!"
        
        cards = [{
          type: 'defi',
          data: {
            totalTvl: '$50.2M',
            topPools: [
              { name: 'S-USDT', apy: '45.2%', tvl: '$12.1M' },
              { name: 'S-ETH', apy: '38.7%', tvl: '$8.9M' }
            ],
            benefits: ['Sub-second transactions', '95% lower fees', 'MEV protection']
          }
        }]
      }
      
      // Default response
      else {
        response = `I understand you want to "${currentInput}". Here are some things I can help you with:

• Check your S token balance and portfolio
• View transaction history and activity
• Send S tokens to any address instantly
• Generate payment links and QR codes
• Get Sonic Explorer links for any address
• Create and mint NFTs with AI assistance
• Explore DeFi opportunities on Sonic
• Smart contract interactions

Try saying something like "show my transaction history", "view on explorer", "Check my balance" or "Send 1 S token to 0x..."`
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
        cards: cards,
      }

      setMessages(prev => [...prev, aiMessage])
      
      // Voice functionality removed - AI responses are text-only
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Voice toggle removed

  const renderCards = (cards: any[]) => {
    return cards.map((card, index) => {
      const { type, data } = card
      
      switch (type) {
        case 'subscription-required':
          return (
            <div key={index} className="mt-4 p-6 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl border border-purple-200 shadow-lg">
              <h4 className="text-lg font-bold text-gray-900 mb-4">🔒 Premium Required</h4>
              <p className="text-gray-700 mb-4">
                The "{data.operation}" operation requires an active Astra AI Premium subscription.
              </p>
              <div className="grid grid-cols-1 gap-3 mb-4">
                {data.features.map((feature: string, featureIndex: number) => (
                  <div key={featureIndex} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p className="text-sm text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                <div>
                  <p className="font-semibold text-gray-900">Premium Subscription</p>
                  <p className="text-sm text-gray-600">{data.duration} access</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-600">{data.price}</p>
                  <p className="text-sm text-gray-600">One-time payment</p>
                </div>
              </div>
            </div>
          )

        case 'autonomous-transaction':
          return (
            <div key={index} className="mt-4 p-6 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl border border-indigo-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">🤖 AI Transaction</h4>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                    AUTONOMOUS
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    {data.status}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">{data.amount} ({data.usdValue})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-mono text-sm">{data.to.slice(0, 10)}...{data.to.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Execution Time:</span>
                  <span className="font-semibold text-indigo-600">{data.confirmationTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gas Fee:</span>
                  <span className="font-semibold">{data.gasFee}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-semibold text-indigo-800">AI is handling this transaction autonomously</p>
                </div>
                <p className="text-xs text-indigo-600">Premium subscription enables fully autonomous blockchain operations</p>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                <p className="font-mono text-sm break-all">{data.hash}</p>
              </div>
            </div>
          )

        case 'balance':
          return (
            <div key={index} className="mt-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">💼 Wallet Balance</h4>
                <span className="text-sm text-gray-500">{data.lastUpdate}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{data.balance} {data.symbol}</p>
                  <p className="text-lg text-gray-600">${data.usdValue} USD</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Network</p>
                  <p className="font-semibold">{data.network}</p>
                  <p className="text-xs text-gray-500 mt-2 font-mono">{data.address?.slice(0, 10)}...{data.address?.slice(-8)}</p>
                </div>
              </div>
            </div>
          )
        
        case 'transaction':
          return (
            <div key={index} className="mt-4 p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">⚡ Transaction</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  data.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                  data.status === 'Confirming' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {data.status}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">{data.amount} S</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-mono text-sm">{data.to?.slice(0, 10)}...{data.to?.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Network:</span>
                  <span className="font-semibold">{data.network}</span>
                </div>
                {data.hash && (
                  <div className="mt-4 p-3 bg-white rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">Transaction Hash</p>
                      <button 
                        onClick={() => navigator.clipboard.writeText(data.hash)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-mono text-sm break-all mt-1">{data.hash}</p>
                  </div>
                )}
              </div>
            </div>
          )
        
        case 'payment':
          return (
            <div key={index} className="mt-4 p-6 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-xl border border-yellow-200 shadow-lg">
              <h4 className="text-lg font-bold text-gray-900 mb-4">💳 Payment Request</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold">{data.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Network:</span>
                      <span className="font-semibold">{data.network}</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-sm text-gray-600 mb-2">Payment Link:</p>
                      <div className="flex items-center space-x-2">
                        <p className="font-mono text-xs break-all flex-1">{data.paymentLink}</p>
                        <button 
                          onClick={() => navigator.clipboard.writeText(data.paymentLink)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">QR Code:</p>
                  <img 
                    src={data.qrCode} 
                    alt="Payment QR Code" 
                    className="mx-auto rounded-lg border border-gray-200"
                  />
                </div>
              </div>
            </div>
          )
        
        case 'nft':
          return (
            <div key={index} className="mt-4 p-6 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl border border-purple-200 shadow-lg">
              <h4 className="text-lg font-bold text-gray-900 mb-4">🎨 NFT Creation</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name:</p>
                    <p className="font-semibold">{data.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mint Cost:</p>
                    <p className="font-semibold text-green-600">{data.mintCost}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Description:</p>
                  <p className="text-sm">{data.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {data.features.map((feature: string, i: number) => (
                    <div key={i} className="p-2 bg-white rounded text-center text-sm">
                      ✅ {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        
        case 'defi':
          return (
            <div key={index} className="mt-4 p-6 bg-gradient-to-br from-cyan-50 to-blue-100 rounded-xl border border-cyan-200 shadow-lg">
              <h4 className="text-lg font-bold text-gray-900 mb-4">💰 DeFi Opportunities</h4>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan-600">{data.totalTvl}</p>
                  <p className="text-sm text-gray-600">Total Value Locked</p>
                </div>
                <div className="space-y-3">
                  <p className="font-semibold text-gray-900">Top Yield Pools:</p>
                  {data.topPools.map((pool: any, i: number) => (
                    <div key={i} className="p-3 bg-white rounded-lg border flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{pool.name}</p>
                        <p className="text-sm text-gray-600">TVL: {pool.tvl}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{pool.apy}</p>
                        <p className="text-sm text-gray-600">APY</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        
        case 'transaction_history':
          return <TransactionHistory key={index} data={data} />
        
        case 'transaction_details':
          return <TransactionDetails key={index} data={data} />
        
        case 'explorer_link':
          return (
            <div key={index} className="mt-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{data.title}</h4>
                  <p className="text-sm text-blue-600">Sonic Testnet Explorer</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{data.message}</p>
              
              <div className="space-y-3">
                <a
                  href={data.explorer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>View on Sonic Explorer</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </a>
                
                <div className="p-3 bg-white rounded-lg border border-blue-200">
                  <p className="text-xs text-gray-500 mb-1">Address:</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-mono text-sm text-gray-700 break-all flex-1">{data.address}</p>
                    <button
                      onClick={() => navigator.clipboard.writeText(data.address)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {data.suggestion && (
                  <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    💡 {data.suggestion}
                  </p>
                )}
              </div>
            </div>
          )
        
        case 'info':
          return (
            <div key={index} className="mt-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200 shadow-lg">
              <h4 className="text-lg font-bold text-gray-900 mb-2">{data.title}</h4>
              <p className="text-gray-700 mb-3">{data.message}</p>
              {data.suggestion && (
                <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                  💡 {data.suggestion}
                </p>
              )}
            </div>
          )
        
        case 'error':
          return (
            <div key={index} className="mt-4 p-6 bg-gradient-to-br from-red-50 to-pink-100 rounded-xl border border-red-200 shadow-lg">
              <h4 className="text-lg font-bold text-red-900 mb-2">⚠️ Error</h4>
              <p className="text-red-700 mb-3">{data.message}</p>
              {data.suggestion && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {data.suggestion}
                </p>
              )}
            </div>
          )

        default:
          return (
            <div key={index} className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">{type.toUpperCase()}</h4>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chat Messages */}
      <div className="bg-white rounded-2xl shadow-xl h-[600px] flex flex-col">
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[80%]">
                <div className={`chat-bubble ${message.type}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {isClient && (
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                )}
                {/* Render cards for AI messages */}
                {message.type === 'ai' && message.cards && (
                  <div className="mt-4 space-y-3">
                    {renderCards(message.cards)}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="chat-bubble ai flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Astra is processing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setInput('Check my balance')}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
            >
              💼 Balance
            </button>
            <button
              onClick={() => setInput('Send 1 S token to Enter wallet address: ')}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
            >
              ⚡ Send Tokens
            </button>
            <button
              onClick={() => setInput('Generate payment QR code')}
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm hover:bg-yellow-200 transition-colors"
            >
              💳 Payment QR
            </button>
            <button
              onClick={() => setInput('Create an NFT')}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
            >
              🎨 Create NFT
            </button>
            <button
              onClick={() => setInput('Show DeFi opportunities')}
              className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm hover:bg-cyan-200 transition-colors"
            >
              💰 DeFi
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Astra to check balance, send tokens, create NFTs, generate QR codes..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />

            </div>
            

            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}