/** @type {import('next').NextConfig} */
const nextConfig = {
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
}

module.exports = nextConfig