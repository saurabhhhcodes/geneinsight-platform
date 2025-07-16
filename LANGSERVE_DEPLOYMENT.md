# 🚀 GeneInsight LangServe Deployment Guide

## 📋 **Overview**

This guide shows how to deploy your GeneInsight platform using:
- **Backend**: LangServe on Railway (Free)
- **Frontend**: Next.js on Vercel (Free)
- **Database**: Not required for LangChain functionality

## 🏗️ **Architecture**

```
Vercel Frontend → Railway LangServe → LangChain → Open Source LLM
```

## 🚀 **Quick Deployment**

### **Step 1: Deploy Backend to Railway**

```bash
# Make deployment script executable
chmod +x deploy-langserve.sh

# Run deployment
./deploy-langserve.sh
```

### **Step 2: Update Vercel Environment Variables**

1. Go to your Vercel dashboard
2. Select your `geneinsight-platform` project
3. Go to Settings → Environment Variables
4. Add/Update these variables:

```env
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
NEXT_PUBLIC_LANGSERVE_URL=https://your-railway-app.railway.app
NEXT_PUBLIC_LANGCHAIN_ENABLED=true
```

### **Step 3: Redeploy Frontend**

```bash
# Trigger Vercel redeploy
git add .
git commit -m "Update API URL for LangServe backend"
git push origin main
```

## 🔧 **Manual Deployment Steps**

### **Backend Deployment (Railway)**

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Create New Project**
   ```bash
   railway new geneinsight-langserve
   railway link
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set PYTHONUNBUFFERED=1
   railway variables set PORT=8000
   railway variables set TRANSFORMERS_CACHE=/tmp/transformers_cache
   railway variables set LANGCHAIN_MODEL=microsoft/DialoGPT-small
   ```

5. **Deploy Application**
   ```bash
   railway up --detach
   ```

### **Alternative: Docker Deployment**

```bash
# Build Docker image
docker build -f Dockerfile.langserve -t geneinsight-langserve .

# Run locally for testing
docker run -p 8000:8000 geneinsight-langserve

# Deploy to any Docker-compatible platform
```

## 🌐 **Available Endpoints**

After deployment, your LangServe API will provide:

### **Core Endpoints**
- `GET /health` - Health check with LangChain status
- `GET /docs` - Interactive API documentation
- `GET /redoc` - Alternative API documentation

### **LangServe Chain Endpoints**
- `POST /analyze/sequence/invoke` - Sequence analysis chain
- `POST /langchain/chat/invoke` - Conversational AI chain
- `POST /analyze/docking/invoke` - Molecular docking chain

### **REST API Endpoints (Compatibility)**
- `POST /analyze/langchain` - Enhanced sequence analysis
- `GET /langchain/status` - LangChain status and capabilities

## 🧪 **Testing the Deployment**

### **1. Health Check**
```bash
curl https://your-railway-app.railway.app/health
```

### **2. Sequence Analysis**
```bash
curl -X POST https://your-railway-app.railway.app/analyze/sequence/invoke \
  -H "Content-Type: application/json" \
  -d '{"input": {"sequence": "ATCGATCGATCG", "sequence_type": "DNA"}}'
```

### **3. LangChain Chat**
```bash
curl -X POST https://your-railway-app.railway.app/langchain/chat/invoke \
  -H "Content-Type: application/json" \
  -d '{"input": {"message": "Analyze this protein sequence for COVID-19"}}'
```

## 🔄 **Frontend Integration**

Update your frontend API calls to use LangServe endpoints:

```javascript
// Before (Flask)
const response = await fetch(`${API_URL}/analyze/langchain`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sequence, sequence_type })
});

// After (LangServe)
const response = await fetch(`${API_URL}/analyze/sequence/invoke`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    input: { sequence, sequence_type }
  })
});
```

## 💰 **Cost Breakdown**

- **Railway**: Free tier (500 hours/month)
- **Vercel**: Free tier (unlimited for personal projects)
- **LangChain**: Open source models (no API costs)
- **Total**: $0/month

## 🔍 **Monitoring & Debugging**

### **Railway Logs**
```bash
railway logs --follow
```

### **Health Monitoring**
- Railway provides built-in monitoring
- Health check endpoint: `/health`
- API documentation: `/docs`

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Model Loading Timeout**
   - Increase Railway timeout settings
   - Use lighter models for faster startup

2. **Memory Issues**
   - Optimize model loading
   - Use Railway Pro for more memory

3. **CORS Errors**
   - Verify Vercel domain in CORS settings
   - Check environment variables

### **Debug Commands**
```bash
# Check Railway status
railway status

# View environment variables
railway variables

# Restart service
railway restart
```

## 🎯 **Next Steps**

1. ✅ Deploy backend to Railway
2. ✅ Update Vercel environment variables
3. ✅ Test all endpoints
4. 🔄 Monitor performance
5. 🚀 Scale as needed

## 📚 **Resources**

- [Railway Documentation](https://docs.railway.app/)
- [LangServe Documentation](https://python.langchain.com/docs/langserve)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

🎉 **Your GeneInsight platform is now running on completely free infrastructure with full LangChain capabilities!**
