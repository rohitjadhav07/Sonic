'use client'

import { useState, useRef, useEffect } from 'react'
import { useAccount, useContractWrite, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { Wand2, Image, Loader2, ExternalLink, Copy, Heart, Eye, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Mock NFT contract ABI - replace with your actual contract ABI
const NFT_CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "string", "name": "tokenURI", "type": "string"}
    ],
    "name": "mint",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Contract address - replace with your deployed contract address
const NFT_CONTRACT_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678'

interface GeneratedNFT {
  id: string
  name: string
  description: string
  image: string
  prompt: string
  tokenId?: number
  owner: string
  timestamp: Date
  likes: number
  views: number
}

export default function NFTPage() {
  const { address, isConnected } = useAccount()
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // State management
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generatedMetadata, setGeneratedMetadata] = useState<any>(null)
  const [nfts, setNfts] = useState<GeneratedNFT[]>([])
  const [activeTab, setActiveTab] = useState<'generate' | 'marketplace'>('generate')

  // Contract interaction
  const { data: hash, writeContract } = useContractWrite()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Fetch NFTs from backend
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        const response = await fetch(`${apiUrl}/nft/marketplace`)
        const data = await response.json()
        
        if (data.success) {
          const formattedNfts = data.nfts.map((nft: any) => ({
            id: nft.token_id.toString(),
            name: nft.metadata.name,
            description: nft.metadata.description,
            image: nft.metadata.image,
            prompt: nft.metadata.prompt,
            tokenId: nft.token_id,
            owner: nft.owner,
            timestamp: new Date(nft.created_at * 1000),
            likes: nft.likes,
            views: nft.views
          }))
          setNfts(formattedNfts)
        }
      } catch (error) {
        console.error('Error fetching NFTs:', error)
        // Fallback to mock data
        const mockNfts: GeneratedNFT[] = [
          {
            id: '1',
            name: 'Cosmic Dreams',
            description: 'A surreal landscape of floating islands in a cosmic void',
            image: '/api/placeholder/400/400',
            prompt: 'surreal cosmic landscape with floating islands',
            tokenId: 1,
            owner: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
            timestamp: new Date(),
            likes: 42,
            views: 128
          }
        ]
        setNfts(mockNfts)
      }
    }
    
    fetchNFTs()
  }, [])

  // Handle video autoplay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error)
    }
  }, [])

  // Generate NFT image using AI
  const generateNFT = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    try {
      // Call backend API to generate image
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const response = await fetch(`${apiUrl}/nft/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          user_address: address || '0x0000000000000000000000000000000000000000'
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setGeneratedImage(data.imageUrl)
        setGeneratedMetadata({
          name: data.name,
          description: data.description,
          prompt: prompt,
          attributes: data.attributes
        })
      } else {
        throw new Error(data.error || 'Failed to generate NFT')
      }
    } catch (error) {
      console.error('Error generating NFT:', error)
      // Fallback to mock image for demo
      setGeneratedImage('/api/placeholder/400/400')
      setGeneratedMetadata({
        name: prompt.slice(0, 30) + '...',
        description: `AI-generated artwork based on: ${prompt}`,
        prompt: prompt,
        attributes: []
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Mint NFT on Sonic chain
  const mintNFT = async () => {
    if (!isConnected || !generatedImage || !generatedMetadata) return
    
    setIsMinting(true)
    try {
      // First, store metadata on IPFS via backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const mintResponse = await fetch(`${apiUrl}/nft/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token_id: nfts.length + 1, // Mock token ID
          owner_address: address!,
          metadata: generatedMetadata
        }),
      })
      
      const mintData = await mintResponse.json()
      
      if (mintData.success) {
        // Mint NFT on contract with IPFS URI
        writeContract({
          address: NFT_CONTRACT_ADDRESS,
          abi: NFT_CONTRACT_ABI,
          functionName: 'mint',
          args: [address!, mintData.token_uri],
          value: parseEther('0.001'), // Minting fee
        })
      } else {
        throw new Error(mintData.error || 'Failed to store metadata')
      }
    } catch (error) {
      console.error('Error minting NFT:', error)
    } finally {
      setIsMinting(false)
    }
  }

  // Handle successful minting
  useEffect(() => {
    if (isConfirmed && generatedImage && generatedMetadata) {
      // Add to marketplace
      const newNFT: GeneratedNFT = {
        id: Date.now().toString(),
        name: generatedMetadata.name,
        description: generatedMetadata.description,
        image: generatedImage,
        prompt: generatedMetadata.prompt,
        tokenId: nfts.length + 1,
        owner: address!,
        timestamp: new Date(),
        likes: 0,
        views: 0
      }
      
      setNfts(prev => [newNFT, ...prev])
      
      // Reset generation state
      setGeneratedImage(null)
      setGeneratedMetadata(null)
      setPrompt('')
      
      // Show success message
      alert('🎉 NFT minted successfully on Sonic Network!')
    }
  }, [isConfirmed, generatedImage, generatedMetadata, address, nfts.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover opacity-20"
          muted
          loop
          playsInline
        >
          <source src="/Nft.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-white hover:text-gray-300 transition-colors bg-white/10 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/20 hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🎨 Sonic NFT Studio
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create, mint, and trade AI-generated NFTs on Sonic Network with lightning-fast transactions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-1">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'generate'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Wand2 className="w-5 h-5 inline mr-2" />
              Generate & Mint
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Image className="w-5 h-5 inline mr-2" />
              Marketplace
            </button>
          </div>
        </div>

        {/* Generate & Mint Tab */}
        {activeTab === 'generate' && (
          <div className="max-w-4xl mx-auto">
            {/* Generation Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                🚀 AI NFT Generator
              </h2>
              
              <div className="space-y-6">
                {/* Prompt Input */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Describe your NFT
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A majestic dragon flying over a cyberpunk city at sunset..."
                    className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {/* Generate Button */}
                <div className="text-center">
                  <button
                    onClick={generateNFT}
                    disabled={!prompt.trim() || isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 inline mr-2" />
                        Generate NFT
                      </>
                    )}
                  </button>
                </div>

                {/* Generated Image */}
                {generatedImage && (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Generated Artwork</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative">
                        <img
                          src={generatedImage}
                          alt="Generated NFT"
                          className="w-full rounded-xl shadow-lg"
                        />
                        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                          AI Generated
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-white font-semibold mb-2">Metadata</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-300">Name:</span>
                              <span className="text-white ml-2">{generatedMetadata?.name}</span>
                            </div>
                            <div>
                              <span className="text-gray-300">Description:</span>
                              <span className="text-white ml-2">{generatedMetadata?.description}</span>
                            </div>
                            <div>
                              <span className="text-gray-300">Prompt:</span>
                              <span className="text-white ml-2">{generatedMetadata?.prompt}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Mint Button */}
                        {isConnected ? (
                          <button
                            onClick={mintNFT}
                            disabled={isMinting || isConfirming}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isMinting || isConfirming ? (
                              <>
                                <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                                {isConfirming ? 'Confirming...' : 'Minting...'}
                              </>
                            ) : (
                              <>
                                🎯 Mint on Sonic
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="text-center p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                            <p className="text-yellow-200">Connect your wallet to mint NFTs</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                🏪 NFT Marketplace
              </h2>
              
              {nfts.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 text-lg">No NFTs minted yet</p>
                  <p className="text-gray-400">Be the first to create an NFT!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {nfts.map((nft) => (
                    <div key={nft.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-200 hover:shadow-xl">
                      <div className="relative">
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                          #{nft.tokenId}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-white font-bold text-lg mb-2 truncate">
                          {nft.name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {nft.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              {nft.likes}
                            </span>
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {nft.views}
                            </span>
                          </div>
                          <span>{nft.timestamp.toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <button className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
                            View Details
                          </button>
                          <button className="text-blue-400 hover:text-blue-300">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
