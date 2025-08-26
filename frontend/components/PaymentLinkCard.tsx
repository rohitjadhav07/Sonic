'use client'

import { useState } from 'react'
import { Link, Copy, QrCode, Share2, CheckCircle } from 'lucide-react'
import QRCode from 'qrcode'

interface PaymentLinkData {
  amount: string
  token: string
  link: string
  qrCode?: string
  recipient?: string
  message?: string
}

interface PaymentLinkCardProps {
  data: PaymentLinkData
}

export default function PaymentLinkCard({ data }: PaymentLinkCardProps) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data.link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShowQR = async () => {
    if (!qrCodeUrl) {
      try {
        const url = await QRCode.toDataURL(data.link, {
          width: 200,
          margin: 2,
          color: {
            dark: '#1f2937',
            light: '#ffffff'
          }
        })
        setQrCodeUrl(url)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }
    setShowQR(!showQR)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Astra AI Payment Link',
          text: `Payment request for ${data.amount} ${data.token}`,
          url: data.link,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Link className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Payment Link</h3>
            <p className="text-sm text-gray-500">Ready to share</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Generated</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{data.amount}</span>
          <span className="text-lg text-gray-500">{data.token}</span>
        </div>

        {data.message && (
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-sm text-gray-600">{data.message}</p>
          </div>
        )}

        {data.recipient && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Recipient</span>
            <span className="font-medium">
              {data.recipient.slice(0, 6)}...{data.recipient.slice(-4)}
            </span>
          </div>
        )}

        {/* QR Code Display */}
        {showQR && qrCodeUrl && (
          <div className="flex justify-center py-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <img src={qrCodeUrl} alt="Payment QR Code" className="w-48 h-48" />
            </div>
          </div>
        )}

        {/* Link Display */}
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 truncate flex-1 mr-2">
              {data.link}
            </span>
            <button
              onClick={handleCopy}
              className="text-blue-500 hover:text-blue-600 flex-shrink-0"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleShowQR}
            className="flex-1 btn-secondary flex items-center justify-center space-x-2"
          >
            <QrCode className="w-4 h-4" />
            <span>{showQR ? 'Hide QR' : 'Show QR'}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex-1 btn-primary flex items-center justify-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Network</span>
          <span className="font-medium">Sonic Network</span>
        </div>
      </div>
    </div>
  )
}