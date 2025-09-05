'use client'

import { Github, Linkedin, Twitter, Mail, Globe, Zap, Shield, Users, Code, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center   border-white shadow-lg">
                <Image 
                  src="/logo.png" 
                  alt="Smart Sonic Logo" 
                  width={48} 
                  height={48}
                  className="rounded-xl"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Smart Sonic
                </h3>
                <p className="text-sm text-gray-400">AI Blockchain Agent</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              Revolutionizing Web3 with AI-powered blockchain operations on Sonic Network. 
              Experience lightning-fast transactions, ultra-low fees, and intelligent DeFi interactions.
            </p>
            
            <div className="flex space-x-4">
              <a
                href="https://github.com/rohitjadhav07/Sonic"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors group"
                title="GitHub"
              >
                <Github className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="https://linkedin.com/in/rohitjadhav-qwerty"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors group"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors group"
                title="Twitter"
              >
                <Twitter className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="mailto:contact@smartsonic.ai"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors group"
                title="Email"
              >
                <Mail className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Features</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Lightning Transactions</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <Shield className="w-4 h-4 text-green-400" />
                <span>AI Security</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Multi-wallet Support</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <Code className="w-4 h-4 text-yellow-400" />
                <span>Smart Contracts</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>DeFi Integration</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/pay" className="text-gray-300 hover:text-white transition-colors">
                  Payment
                </Link>
              </li>
              <li>
                <a
                  href="https://testnet.soniclabs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Sonic Explorer
                </a>
              </li>
              <li>
                <a
                  href="https://docs.soniclabs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>by Rohit Jadhav</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button removed as requested */}
    </footer>
  )
}
