/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    
    // Fix for react-speech-recognition
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'regenerator-runtime': require.resolve('regenerator-runtime'),
      };
    }
    
    return config;
  },
  transpilePackages: ['react-speech-recognition'],
  swcMinify: true,
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@rainbow-me/rainbowkit', 'wagmi', 'viem']
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://sonic-nft-studio.vercel.app/api' 
      : 'http://localhost:8000/api'
  }
}

module.exports = nextConfig