#!/bin/bash

# Sonic NFT Studio - Vercel Deployment Script

echo "🚀 Starting Vercel deployment for Sonic NFT Studio..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami || vercel login

# Set environment variables
echo "⚙️ Setting up environment variables..."
vercel env add STABILITY_API_KEY
vercel env add PINATA_API_KEY
vercel env add PINATA_SECRET_KEY
vercel env add PRIVATE_KEY
vercel env add JWT_SECRET
vercel env add SONIC_TESTNET_RPC_URL
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_NFT_CONTRACT_ADDRESS production

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app is now live on Vercel!"