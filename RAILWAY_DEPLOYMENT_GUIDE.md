# 🚂 Railway Deployment Guide - GeneInsight Platform

## 🎯 **Complete Deployment Steps**

### **Step 1: Login to Railway** ✅ **DO THIS NOW**
```bash
railway login
```
- This opens your browser
- Sign up/login to Railway.app
- Authenticate your CLI

### **Step 2: Initialize Project**
```bash
railway init --name geneinsight-platform
```

### **Step 3: Set Environment Variables**
```bash
railway variables set NODE_ENV=production
railway variables set NEXT_TELEMETRY_DISABLED=1
railway variables set TRANSFORMERS_CACHE=/tmp/transformers_cache
railway variables set FLASK_ENV=production
```

### **Step 4: Add PostgreSQL Database**
```bash
railway add postgresql
```

### **Step 5: Deploy Application**
```bash
railway up --dockerfile Dockerfile.railway
```

### **Step 6: Get Your Live URL**
```bash
railway domain
```

---

## 🧬 **What You'll Get After Deployment**

### **🌐 Live Application:**
- **Main App**: `https://your-app.railway.app`
- **AI Chat**: `https://your-app.railway.app/ai-chat`
- **Molecular Docking**: `https://your-app.railway.app/docking`
- **Health Check**: `https://your-app.railway.app/health`

### **✅ All Features Working:**
- **LangChain AI**: Real conversational molecular analysis
- **COVID-19 Analysis**: Expert viral protein insights
- **Sequence Detection**: Automatic protein recognition
- **Molecular Docking**: Protein-ligand simulations
- **3D Visualization**: Interactive molecular viewer
- **Database**: PostgreSQL for data persistence
- **24/7 Uptime**: Always accessible to users

---

## ⏱️ **Deployment Timeline**

### **First Deployment:**
- **Build Time**: 8-12 minutes (downloading AI model)
- **Model Download**: ~351MB (DialoGPT-small)
- **Total Time**: ~15 minutes

### **Subsequent Deployments:**
- **Build Time**: 3-5 minutes (model cached)
- **Deploy Time**: 1-2 minutes
- **Total Time**: ~5 minutes

---

## 🧪 **Testing Your Deployment**

### **After deployment, test with:**
```bash
python test-complete-deployment.py https://your-app.railway.app
```

### **Manual Testing:**
1. **Visit**: `https://your-app.railway.app`
2. **Go to AI Chat**: Click "AI Chat" card or visit `/ai-chat`
3. **Type**: "covid 19"
4. **Expected Response**: "I can help you analyze COVID-19 related sequences!..."
5. **Paste COVID-19 sequence**:
   ```
   SGFRKMAFPSGKVEGCMVQVTCGTTTLNGLWLDDVVYCPRHVICTSEDMLNPNYEDLLIRKSNHNFLVQAGNVQLRVIGHSMQNCVLKLKVDTANPKTPKYKFVRIQPGQTFSVLACYNGSPSGVYQCAMRPNFTIKGSFLNGSCGSVGFNIDYDCVSFCYMHHMELPTGVHAGTDLEGNFYGPFVDRQTAQAAGTDTTITVNVLAWLYAAVINGDRWFLNRFTTTLNDFNLVAMKYNYEPLTQDHVDILGPLSAQTGIAVLDMCASLKELLQNGMNGRTILGSALLEDEFTPFDVVRQCSGVTFQ
   ```
6. **Expected Response**: "Excellent! I've analyzed this COVID-19 protein sequence. Found 4 functional domains..."

---

## 💰 **Railway Pricing**

### **Free Tier:**
- **$5 credit monthly**
- **~500 hours usage**
- **Perfect for development/demo**

### **Usage Estimation:**
- **Light usage**: 50-100 hours/month
- **Moderate usage**: 200-300 hours/month
- **Heavy usage**: 400+ hours/month

### **Upgrade Options:**
- **Hobby Plan**: $5/month unlimited
- **Pro Plan**: $20/month with more resources

---

## 🔧 **Troubleshooting**

### **If Build Fails:**
```bash
# Check logs
railway logs

# Redeploy
railway up --dockerfile Dockerfile.railway
```

### **If Model Download Fails:**
- **Wait**: First deployment takes time
- **Check logs**: `railway logs`
- **Retry**: Model will cache after first success

### **If Memory Issues:**
- **Upgrade**: To Hobby plan ($5/month)
- **Monitor**: `railway metrics`

---

## 📊 **Monitoring Your Deployment**

### **Useful Commands:**
```bash
# View logs
railway logs

# Check status
railway status

# Open in browser
railway open

# View metrics
railway metrics

# Connect to database
railway connect postgresql
```

---

## 🎉 **Success Indicators**

### **✅ Deployment Successful When:**
1. **Build completes** without errors
2. **Health endpoint** returns `{"status": "UP"}`
3. **LangChain status** shows `{"llm_available": true}`
4. **AI chat responds** to "covid 19" query
5. **Sequence analysis** works with protein sequences

### **🌐 Share Your Platform:**
Once deployed, anyone can visit your URL and use:
- **Full AI-powered molecular analysis**
- **COVID-19 specialized insights**
- **Interactive 3D visualization**
- **Molecular docking simulations**
- **Natural language conversations about molecular biology**

---

## 🚀 **Ready to Deploy?**

**Run these commands in order:**

1. `railway login` ← **DO THIS FIRST**
2. `railway init --name geneinsight-platform`
3. `railway variables set NODE_ENV=production`
4. `railway variables set TRANSFORMERS_CACHE=/tmp/transformers_cache`
5. `railway add postgresql`
6. `railway up --dockerfile Dockerfile.railway`
7. `railway domain` ← **GET YOUR URL**

**Your complete AI-powered molecular analysis platform will be live in ~15 minutes!** 🧬✨
