# 🚀 GeneInsight LangServe - Render.com Deployment Guide

## ✅ **Files Ready for Deployment**

I've prepared and pushed these files to your GitHub repository:

- ✅ `railway_minimal.py` - Optimized LangServe application
- ✅ `requirements_minimal.txt` - Minimal dependencies
- ✅ `render.yaml` - Render configuration
- ✅ All files committed and pushed to GitHub

## 🎯 **Step-by-Step Deployment Process**

### **Step 1: Access Render.com**
1. Go to **[render.com](https://render.com)**
2. Click **"Get Started for Free"**
3. **Sign up with GitHub** (use your `saurabhhhcodes` account)

### **Step 2: Create New Web Service**
1. Click **"New +"** → **"Web Service"**
2. **Connect GitHub Repository**:
   - Repository: `saurabhhhcodes/geneinsight-platform`
   - Branch: `main`

### **Step 3: Configure Deployment Settings**

**Basic Settings:**
- **Name**: `geneinsight-langserve`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Runtime**: `Python 3`

**Build & Deploy:**
- **Build Command**: `pip install -r requirements_minimal.txt`
- **Start Command**: `python railway_minimal.py`

**Environment Variables:**
- **Key**: `PYTHONUNBUFFERED` **Value**: `1`
- **Key**: `PORT` **Value**: `8000`

### **Step 4: Deploy**
1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Start your LangServe application
   - Provide you with a URL

### **Step 5: Get Your Deployment URL**
After deployment, you'll get a URL like:
```
https://geneinsight-langserve.onrender.com
```

## 🧪 **Test Your Deployment**

Once deployed, test these endpoints:

```bash
# Health check
curl https://geneinsight-langserve.onrender.com/health

# API documentation (visit in browser)
https://geneinsight-langserve.onrender.com/docs

# Sequence analysis
curl -X POST https://geneinsight-langserve.onrender.com/analyze/sequence/invoke \
  -H "Content-Type: application/json" \
  -d '{"input": {"sequence": "ATCGATCG", "sequence_type": "DNA"}}'
```

## 🔄 **Update Vercel Frontend**

### **Step 6: Update Environment Variables**
1. Go to **[vercel.com](https://vercel.com)** → Your Dashboard
2. Select **"geneinsight-platform"** project
3. Go to **Settings** → **Environment Variables**
4. **Add/Update**:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://geneinsight-langserve.onrender.com`
   - **Environment**: All (Production, Preview, Development)

### **Step 7: Redeploy Frontend**
1. Go to **Deployments** tab in Vercel
2. Click **"Redeploy"** on the latest deployment
3. Or push any change to trigger auto-deployment

## 🎉 **Final Result**

After completion, you'll have:

- ✅ **Backend**: `https://geneinsight-langserve.onrender.com`
- ✅ **Frontend**: `https://geneinsight-platform.vercel.app`
- ✅ **Full Integration**: Frontend calls backend APIs
- ✅ **LangServe Features**: Interactive docs, playgrounds
- ✅ **Cost**: $0/month (completely free!)

## 🔍 **Available Endpoints**

Your deployed LangServe will provide:

### **LangServe Chain Endpoints:**
- `POST /analyze/sequence/invoke` - Sequence analysis
- `POST /langchain/chat/invoke` - AI chat
- `GET /analyze/sequence/playground/` - Interactive playground
- `GET /langchain/chat/playground/` - Chat playground

### **REST API Endpoints:**
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation
- `POST /analyze/langchain` - Sequence analysis (compatibility)
- `GET /langchain/status` - LangChain status

## 🚨 **Troubleshooting**

### **If Deployment Fails:**
1. Check **Render logs** for errors
2. Verify **requirements_minimal.txt** is correct
3. Ensure **railway_minimal.py** is in root directory

### **If Frontend Can't Connect:**
1. Verify **CORS** is configured (already done)
2. Check **environment variables** in Vercel
3. Test **backend endpoints** directly

## 📊 **Monitoring**

- **Render Dashboard**: Monitor deployment status, logs, metrics
- **Health Endpoint**: `/health` for status checks
- **API Docs**: `/docs` for testing endpoints

---

## 🎯 **Ready to Deploy!**

All files are prepared and pushed to your GitHub repository. 
Follow the steps above to deploy your GeneInsight LangServe backend to Render.com!

**Estimated deployment time**: 5-10 minutes
**Cost**: Free forever
**Features**: Full LangServe + LangChain integration
