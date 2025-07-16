# 🌐 Apillon Deployment Guide - GeneInsight Platform

## 🚀 **Deploy Complete AI Platform to Web3**

Apillon is perfect for deploying the full GeneInsight Platform with complete LangChain functionality on decentralized infrastructure.

---

## ✅ **What You Get on Apillon**

### **🧬 Complete AI-Powered Platform:**
- **LangChain AI**: Real conversational molecular analysis
- **COVID-19 Analysis**: Expert viral protein insights
- **Sequence Detection**: Automatic protein recognition
- **Molecular Docking**: Protein-ligand simulations
- **3D Visualization**: Interactive molecular viewer
- **Database**: PostgreSQL for data persistence
- **Web3 Hosting**: Decentralized, censorship-resistant

### **🌐 Live URLs After Deployment:**
- **Frontend**: `https://geneinsight.apillon.io`
- **Backend API**: `https://api.geneinsight.apillon.io`
- **AI Chat**: `https://geneinsight.apillon.io/ai-chat`
- **Dashboard**: `https://geneinsight.apillon.io/dashboard`
- **Molecular Docking**: `https://geneinsight.apillon.io/docking`

---

## 🚀 **Deployment Steps**

### **Step 1: Install Apillon CLI**
```bash
npm install -g @apillon/cli
```

### **Step 2: Login to Apillon**
```bash
apillon auth login
```

### **Step 3: Initialize Project**
```bash
apillon init --config apillon.json
```

### **Step 4: Deploy Backend (Python + LangChain)**
```bash
apillon deploy backend --service ml-service --path ml_service
```

### **Step 5: Deploy Frontend**
```bash
npm run build
apillon deploy frontend --service frontend --path .next
```

### **Step 6: Setup Database**
```bash
apillon database create --type postgresql --name geneinsight-db
```

### **Step 7: Configure Domains**
```bash
apillon domain configure --frontend geneinsight.apillon.io --backend api.geneinsight.apillon.io
```

---

## ⚙️ **Configuration Files**

### **✅ Already Created:**
- `apillon.json` - Main configuration
- `Dockerfile.apillon` - Optimized container
- `.apillon.env` - Environment variables
- `deploy-apillon.sh` - Automated deployment script

### **🔧 Key Configuration:**
```json
{
  "services": {
    "backend": {
      "type": "python",
      "runtime": "python3.9",
      "startCommand": "python app.py",
      "buildCommand": "pip install -r requirements.txt && pip install transformers torch langchain-community",
      "resources": {
        "memory": "2GB",
        "cpu": "1",
        "storage": "5GB"
      }
    }
  }
}
```

---

## 🧪 **Testing Your Deployment**

### **Health Checks:**
```bash
# Check all services
apillon health check --all

# Check specific service
apillon health check --service ml-service

# View logs
apillon logs --service ml-service --tail 100
```

### **API Testing:**
```bash
# Test backend API
curl https://api.geneinsight.apillon.io/health

# Test LangChain status
curl https://api.geneinsight.apillon.io/langchain/status

# Test AI chat
curl -X POST https://api.geneinsight.apillon.io/langchain/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "covid 19"}'
```

### **Expected Responses:**
- **Health**: `{"status": "UP", "langchain": {"llm_available": true}}`
- **LangChain**: Model info and chain status
- **AI Chat**: "I can help you analyze COVID-19 related sequences!..."

---

## 📊 **Performance & Scaling**

### **Resource Allocation:**
- **Memory**: 2GB (for LangChain model)
- **CPU**: 1 core (scalable to 3)
- **Storage**: 5GB (for model cache)
- **Database**: PostgreSQL with 1GB storage

### **Auto-Scaling:**
- **Min Instances**: 1
- **Max Instances**: 3
- **Target CPU**: 70%
- **Scale trigger**: High traffic or CPU usage

### **Expected Performance:**
- **First Request**: 30-60 seconds (model loading)
- **Subsequent Requests**: 2-5 seconds
- **Concurrent Users**: 10-50 (depending on scaling)
- **Uptime**: 99.9% (Web3 infrastructure)

---

## 💰 **Apillon Pricing**

### **Estimated Costs:**
- **Backend Service**: ~$20-40/month
- **Database**: ~$10-20/month
- **Storage**: ~$5-10/month
- **Bandwidth**: ~$5-15/month
- **Total**: ~$40-85/month

### **Free Tier:**
- **Development**: Free testing environment
- **Limited Resources**: Reduced memory/CPU
- **Perfect for**: Testing and demos

---

## 🔧 **Monitoring & Management**

### **Useful Commands:**
```bash
# View deployment status
apillon status --all

# Monitor resource usage
apillon metrics --service backend

# Scale services
apillon scale --service backend --instances 2

# Update environment variables
apillon env set LANGCHAIN_MODEL=microsoft/DialoGPT-medium

# Restart services
apillon restart --service ml-service
```

### **Dashboard Access:**
- **Apillon Console**: Monitor deployments, logs, metrics
- **Resource Usage**: CPU, memory, storage tracking
- **Cost Tracking**: Real-time billing information

---

## 🌐 **Web3 Benefits**

### **✅ Decentralized Hosting:**
- **Censorship Resistant**: Cannot be taken down
- **Global Distribution**: Fast access worldwide
- **Blockchain Security**: Immutable deployment records
- **No Single Point of Failure**: Distributed infrastructure

### **✅ Developer Benefits:**
- **Easy Deployment**: Simple CLI commands
- **Auto-Scaling**: Handles traffic spikes
- **Monitoring**: Built-in observability
- **Cost Effective**: Pay for what you use

---

## 🚀 **Quick Deployment (Automated)**

### **One-Command Deploy:**
```bash
chmod +x deploy-apillon.sh
./deploy-apillon.sh
```

This script will:
1. ✅ Install Apillon CLI
2. ✅ Login to Apillon
3. ✅ Initialize project
4. ✅ Deploy backend with LangChain
5. ✅ Deploy frontend
6. ✅ Setup database
7. ✅ Configure domains
8. ✅ Run health checks
9. ✅ Provide live URLs

---

## 🎯 **Success Indicators**

### **✅ Deployment Successful When:**
1. **Backend Status**: Service running and healthy
2. **Frontend**: Website loads at your domain
3. **API Health**: `/health` returns 200 status
4. **LangChain**: `/langchain/status` shows model loaded
5. **AI Chat**: Responds to COVID-19 queries
6. **Database**: Connection established

### **🧬 User Experience:**
- **Visit**: `https://geneinsight.apillon.io`
- **AI Chat**: Natural language molecular analysis
- **COVID-19**: Expert viral protein insights
- **3D Visualization**: Interactive molecular viewer
- **Molecular Docking**: Protein-ligand simulations

---

## 📞 **Support & Resources**

### **Apillon Resources:**
- **Documentation**: https://docs.apillon.io
- **CLI Reference**: https://docs.apillon.io/cli
- **Community**: https://discord.gg/apillon

### **GeneInsight Support:**
- **GitHub Issues**: https://github.com/saurabhhhcodes/geneinsight-platform/issues
- **Documentation**: README.md and deployment guides

---

## 🎉 **Ready to Deploy?**

**Your GeneInsight Platform is fully configured for Apillon deployment!**

**Run the deployment script and your complete AI-powered molecular analysis platform will be live on Web3 infrastructure with full LangChain functionality!**

```bash
./deploy-apillon.sh
```

**🧬 The future of decentralized molecular analysis awaits!** ✨
