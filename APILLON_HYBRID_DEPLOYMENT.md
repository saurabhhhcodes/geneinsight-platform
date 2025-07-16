# 🌐 Apillon Hybrid Deployment Guide

## 🎯 **Correct Apillon Deployment Strategy**

**Issue**: Apillon CLI is for static website hosting, not Python backend services.

**Solution**: Hybrid deployment approach:
- **Frontend**: Deploy to Apillon (static hosting)
- **Backend**: Deploy to Render/Railway (Python + LangChain)

---

## 🚀 **Step-by-Step Hybrid Deployment**

### **Step 1: Get Apillon API Credentials**

1. Go to https://app.apillon.io
2. Navigate to **Dashboard → API Keys**
3. Create new API key
4. Copy API Key and API Secret

### **Step 2: Set Environment Variables**

**Windows:**
```cmd
set APILLON_API_KEY=your_api_key_here
set APILLON_API_SECRET=your_api_secret_here
```

**Linux/Mac:**
```bash
export APILLON_API_KEY=your_api_key_here
export APILLON_API_SECRET=your_api_secret_here
```

### **Step 3: Deploy Frontend to Apillon**

```bash
# Build frontend
npm run build

# Deploy to Apillon
apillon hosting deploy-website .next --key %APILLON_API_KEY% --secret %APILLON_API_SECRET%
```

### **Step 4: Deploy Backend to Render (Free)**

1. Go to https://render.com
2. Connect your GitHub repository
3. Create **Web Service**
4. Use these settings:
   - **Build Command**: `cd ml_service && pip install -r requirements.txt && pip install transformers torch langchain-community`
   - **Start Command**: `cd ml_service && python app.py`
   - **Environment**: Python 3.9

### **Step 5: Update Frontend API URLs**

Update your frontend to point to the Render backend:

```bash
# Set environment variable for production
echo "NEXT_PUBLIC_API_URL=https://your-app.onrender.com" > .env.production

# Rebuild and redeploy frontend
npm run build
apillon hosting deploy-website .next --key %APILLON_API_KEY% --secret %APILLON_API_SECRET%
```

---

## 🌐 **Final Architecture**

```
┌─────────────────┐    ┌─────────────────┐
│   Apillon       │    │   Render.com    │
│   (Frontend)    │───▶│   (Backend)     │
│                 │    │                 │
│ • Next.js App   │    │ • Python Flask │
│ • Static Files  │    │ • LangChain AI  │
│ • 3D Viewer     │    │ • PostgreSQL    │
└─────────────────┘    └─────────────────┘
```

---

## ✅ **What You Get**

### **🌐 Apillon Frontend:**
- **URL**: `https://your-site.apillon.io`
- **Features**: Complete UI, 3D visualization, client-side analysis
- **Benefits**: Fast CDN, decentralized hosting, Web3 infrastructure

### **🧠 Render Backend:**
- **URL**: `https://your-app.onrender.com`
- **Features**: Full LangChain AI, COVID-19 analysis, molecular docking
- **Benefits**: Free tier, Python support, PostgreSQL database

### **🔗 Integration:**
- Frontend calls backend APIs
- Real LangChain AI functionality
- Complete molecular analysis platform
- Best of both worlds: Web3 frontend + AI backend

---

## 💰 **Cost Breakdown**

### **Apillon (Frontend):**
- **Free Tier**: Available for testing
- **Paid**: ~$5-20/month for production

### **Render (Backend):**
- **Free Tier**: 750 hours/month
- **Paid**: $7/month for database

### **Total**: ~$0-27/month for complete platform

---

## 🧪 **Testing Your Deployment**

### **Test Frontend:**
```bash
# Visit your Apillon URL
curl https://your-site.apillon.io

# Check if pages load
curl https://your-site.apillon.io/ai-chat
```

### **Test Backend:**
```bash
# Test health endpoint
curl https://your-app.onrender.com/health

# Test LangChain
curl https://your-app.onrender.com/langchain/status

# Test AI chat
curl -X POST https://your-app.onrender.com/langchain/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "covid 19"}'
```

### **Test Integration:**
1. Visit your Apillon frontend
2. Go to AI Chat page
3. Type "covid 19"
4. Verify it calls Render backend
5. Check for AI responses

---

## 🔧 **Troubleshooting**

### **Frontend Issues:**
- **Build fails**: Check `npm run build` locally
- **Deploy fails**: Verify API credentials
- **Pages don't load**: Check Apillon dashboard

### **Backend Issues:**
- **Service won't start**: Check Render logs
- **AI not working**: Verify LangChain installation
- **Database errors**: Check PostgreSQL connection

### **Integration Issues:**
- **API calls fail**: Check CORS settings
- **Wrong URLs**: Verify NEXT_PUBLIC_API_URL
- **Authentication**: Check API endpoints

---

## 🎯 **Success Checklist**

- [ ] Apillon API credentials obtained
- [ ] Frontend built successfully (`npm run build`)
- [ ] Frontend deployed to Apillon
- [ ] Backend deployed to Render
- [ ] Environment variables updated
- [ ] Frontend redeployed with correct API URLs
- [ ] Health endpoints responding
- [ ] AI chat working end-to-end
- [ ] 3D visualization functional

---

## 📞 **Support Resources**

### **Apillon:**
- **Dashboard**: https://app.apillon.io
- **Documentation**: https://wiki.apillon.io
- **Support**: Through dashboard

### **Render:**
- **Dashboard**: https://dashboard.render.com
- **Documentation**: https://render.com/docs
- **Community**: https://community.render.com

---

**This hybrid approach gives you the best of both worlds: Web3 decentralized frontend hosting with full AI backend capabilities!** 🌐🧬
