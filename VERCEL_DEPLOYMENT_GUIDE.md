# 🚀 Vercel Deployment Guide - Sonic NFT Studio

## ✅ **Ready for Deployment!**

Your project is now fully configured for Vercel deployment with both frontend and backend.

---

## 🎯 **Quick Deployment Steps:**

### **Option 1: Automatic Deployment (Recommended)**
```bash
# Run the deployment script
./deploy.sh          # Linux/Mac
deploy.bat           # Windows
```

### **Option 2: Manual Deployment**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod
```

---

## ⚙️ **Environment Variables Setup:**

Add these to Vercel Dashboard → Settings → Environment Variables:

```
STABILITY_API_KEY=your_stability_api_key_here
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_KEY=your_pinata_secret_key_here
PRIVATE_KEY=your_wallet_private_key_here
JWT_SECRET=your_jwt_secret_here
SONIC_TESTNET_RPC_URL=https://rpc.testnet.soniclabs.com
NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

---

## 📁 **Project Structure for Vercel:**

```
sonic-nft-studio/
├── api/                    # Backend API (Python/FastAPI)
│   ├── index.py           # Vercel serverless entry point
│   └── requirements.txt   # Python dependencies
├── frontend/              # Next.js frontend
│   ├── app/              # App router
│   ├── components/       # React components
│   └── package.json      # Frontend dependencies
├── vercel.json           # Vercel configuration
└── deploy.sh             # Deployment script
```

---

## 🔧 **Configuration Files Created:**

### **1. vercel.json**
- ✅ Backend API routing (`/api/*` → Python)
- ✅ Frontend routing (`/*` → Next.js)
- ✅ Environment variables setup
- ✅ Function timeout configuration

### **2. api/index.py**
- ✅ FastAPI serverless entry point
- ✅ Python path configuration
- ✅ Vercel handler setup

### **3. Frontend Updates**
- ✅ Production API URL configuration
- ✅ Environment variable integration
- ✅ CORS configuration for production

---

## 🌐 **Deployment URLs:**

After deployment, your app will be available at:
- **Frontend**: `https://your-app.vercel.app`
- **NFT Studio**: `https://your-app.vercel.app/nft`
- **API**: `https://your-app.vercel.app/api`

---

## 🎨 **Features Working in Production:**

### **Backend API (Python/FastAPI)**
- ✅ AI Image Generation (Stability AI)
- ✅ IPFS Storage (Pinata)
- ✅ NFT Metadata Management
- ✅ Marketplace API
- ✅ CORS configured for production

### **Frontend (Next.js)**
- ✅ NFT Studio with video background
- ✅ AI image generation interface
- ✅ Blockchain minting integration
- ✅ Marketplace display
- ✅ MetaMask wallet connection

---

## 🚀 **Deploy Now:**

1. **Run deployment script:**
   ```bash
   ./deploy.sh    # Linux/Mac
   deploy.bat     # Windows
   ```

2. **Or deploy manually:**
   ```bash
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard**

4. **Your NFT Studio is live!** 🎉

---

## 🎯 **What You Get:**

- ✅ **Full-stack NFT creation platform**
- ✅ **AI-powered image generation**
- ✅ **Blockchain minting on Sonic Network**
- ✅ **IPFS decentralized storage**
- ✅ **Professional marketplace UI**
- ✅ **MetaMask wallet integration**

**Your Sonic NFT Studio is ready for production!** 🚀🎨
