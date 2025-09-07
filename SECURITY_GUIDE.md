# 🔒 Security Guide - Sonic NFT Studio

## ⚠️ **CRITICAL: Secrets Exposed!**

**Your API keys and secrets have been exposed in the repository!**

### 🚨 **Immediate Actions Required:**

1. **Rotate ALL API Keys Immediately:**
   - Stability AI API Key
   - Pinata IPFS Keys
   - Wallet Private Key
   - JWT Secret

2. **Revoke Old Keys:**
   - Go to each service dashboard
   - Revoke the exposed keys
   - Generate new keys

3. **Update Environment Variables:**
   - Create new `.env` file from `env.template`
   - Add your new API keys
   - Never commit `.env` to git

---

## 🔧 **How to Fix:**

### **Step 1: Rotate API Keys**

#### **Stability AI:**
1. Go to: https://platform.stability.ai/
2. Navigate to API Keys
3. Revoke old key
4. Generate new API key

#### **Pinata IPFS:**
1. Go to: https://pinata.cloud/
2. Navigate to API Keys
3. Revoke old keys
4. Generate new API Key and Secret

#### **Wallet Private Key:**
1. Create new wallet in MetaMask
2. Export new private key
3. Transfer funds to new wallet

#### **JWT Secret:**
1. Generate new random string
2. Use: `openssl rand -hex 32`

### **Step 2: Update Environment**

```bash
# Copy template
cp env.template .env

# Edit .env with new keys
# NEVER commit .env to git!
```

### **Step 3: Update Vercel Environment Variables**

In Vercel Dashboard → Settings → Environment Variables:
```
STABILITY_API_KEY=new_stability_key
PINATA_API_KEY=new_pinata_key
PINATA_SECRET_KEY=new_pinata_secret
PRIVATE_KEY=new_private_key
JWT_SECRET=new_jwt_secret
```

---

## 🛡️ **Security Best Practices:**

### **Environment Variables:**
- ✅ Use `.env.template` for reference
- ✅ Never commit `.env` files
- ✅ Use different keys for dev/prod
- ✅ Rotate keys regularly

### **Git Security:**
- ✅ `.gitignore` includes `.env*` files
- ✅ Use `git rm --cached .env` to remove from history
- ✅ Consider using `git filter-branch` for complete removal

### **API Key Management:**
- ✅ Monitor API usage
- ✅ Set usage limits
- ✅ Use least privilege principle
- ✅ Regular key rotation

---

## 🔍 **Check for Exposed Secrets:**

```bash
# Search for potential secrets in code
grep -r "sk-" .
grep -r "pk_" .
grep -r "0x[a-fA-F0-9]{64}" .
```

---

## 📋 **Security Checklist:**

- [ ] Rotated Stability AI API key
- [ ] Rotated Pinata IPFS keys
- [ ] Created new wallet with new private key
- [ ] Generated new JWT secret
- [ ] Updated local `.env` file
- [ ] Updated Vercel environment variables
- [ ] Removed `.env` from git history
- [ ] Added `.gitignore` rules
- [ ] Tested with new keys

---

## 🚨 **If Secrets Are Still Exposed:**

1. **Immediate Response:**
   - Rotate all keys immediately
   - Check for unauthorized usage
   - Monitor API logs

2. **Long-term Fix:**
   - Use secret management services
   - Implement key rotation automation
   - Add security scanning to CI/CD

---

## ✅ **After Fixing:**

Your project is now secure and ready for deployment:

```bash
# Deploy securely
vercel --prod
```

**Remember: Security is an ongoing process, not a one-time fix!** 🔒
