# 🚀 Smart Sonic Deployment Guide

This comprehensive guide covers all aspects of deploying Smart Sonic to various environments, from development to production.

## 🎯 Deployment Overview

Smart Sonic supports multiple deployment strategies:
- **🔧 Development** - Local development environment
- **🧪 Staging** - Testing and QA environment  
- **🚀 Production** - Live production environment
- **☁️ Cloud** - AWS, GCP, Azure deployments
- **🐳 Container** - Docker and Kubernetes

---

## 🛠️ Prerequisites

### System Requirements

#### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **Network**: 100 Mbps

#### Recommended Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **Network**: 1 Gbps

### Software Dependencies
- **Node.js**: 18.0.0 or higher
- **Python**: 3.8 or higher
- **PostgreSQL**: 13 or higher
- **Redis**: 6.0 or higher
- **Docker**: 20.10 or higher (optional)

---

## 🏠 Local Development Deployment

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-username/smart-sonic.git
cd smart-sonic

# Run automated setup
./setup.sh  # Linux/macOS
# or
setup.bat   # Windows

# Start development servers
npm run dev
```

### Manual Setup

#### 1. Environment Configuration

```bash
# Copy environment files
cp .env.example .env
cp frontend/.env.local.example frontend/.env.local
```

#### 2. Configure Environment Variables

**.env:**
```env
# Sonic Network
SONIC_TESTNET_RPC_URL=https://rpc.testnet.soniclabs.com
SONIC_MAINNET_RPC_URL=https://rpc.soniclabs.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/smartsonic

# Redis
REDIS_URL=redis://localhost:6379

# API Keys
GOOGLE_API_KEY=your_google_gemini_api_key
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Private Key (for contract deployment)
PRIVATE_KEY=your_private_key_here
```

**frontend/.env.local:**
```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🐳 Container Deployment

### Docker Images

#### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.smartsonic.ai
      - NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=${WALLET_CONNECT_PROJECT_ID}
    restart: unless-stopped
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
      - SONIC_TESTNET_RPC_URL=${SONIC_TESTNET_RPC_URL}
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
    restart: unless-stopped
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=smartsonic
      - POSTGRES_USER=smartsonic
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/prod.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    restart: unless-stopped
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:
```

---

## ☁️ Cloud Deployment

### Vercel Deployment (Frontend)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://api.smartsonic.ai/api/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID": "@wallet-connect-project-id",
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

Deploy to Vercel:
```bash
npm i -g vercel
cd frontend
vercel
vercel --prod
```

### Railway Deployment (Backend)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
cd backend
railway login
railway init
railway up
```

---

## 🔒 Security Configuration

### SSL/TLS Configuration

```nginx
# nginx/prod.conf
server {
    listen 80;
    server_name smartsonic.ai;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name smartsonic.ai;

    ssl_certificate /etc/nginx/ssl/smartsonic.ai.crt;
    ssl_certificate_key /etc/nginx/ssl/smartsonic.ai.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 📊 Monitoring Setup

### Prometheus Configuration

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'smartsonic-backend'
    static_configs:
      - targets: ['backend:8000']
    metrics_path: '/metrics'

  - job_name: 'smartsonic-frontend'
    static_configs:
      - targets: ['frontend:3000']
```

### Grafana Dashboard

```json
{
  "dashboard": {
    "title": "Smart Sonic Metrics",
    "panels": [
      {
        "title": "API Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"
          }
        ]
      }
    ]
  }
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy Smart Sonic

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Deploy to production
      run: |
        # Deployment commands
        echo "Deploying to production..."
```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database migration completed
- [ ] SSL certificates installed
- [ ] DNS configuration updated
- [ ] Security groups configured
- [ ] Backup strategy implemented

### Post-Deployment
- [ ] Health checks passing
- [ ] SSL verification complete
- [ ] Database connectivity verified
- [ ] API endpoints responding
- [ ] Monitoring alerts active
- [ ] Performance metrics normal

---

## 🆘 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check database connectivity
psql -h localhost -U smartsonic -d smartsonic -c "SELECT 1;"

# Check logs
docker logs smartsonic_db_1
```

#### Container Issues
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f backend

# Restart service
docker-compose restart backend
```

#### SSL Issues
```bash
# Check certificate
openssl x509 -in cert.pem -text -noout | grep "Not After"

# Test SSL
openssl s_client -connect smartsonic.ai:443
```

---

## 📞 Support

- 📖 **Documentation**: [docs.smartsonic.ai](https://docs.smartsonic.ai)
- 🐛 **Issues**: [GitHub Issues](https://github.com/smartsonic/issues)
- 💬 **Discord**: [Community](https://discord.gg/smartsonic)
- 📧 **Email**: devops@smartsonic.ai

---

*Last updated: January 2024*
*Version: 1.0.0*