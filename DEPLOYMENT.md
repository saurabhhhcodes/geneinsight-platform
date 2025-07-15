# 🚀 GeneInsight Platform - Deployment Guide

## 🌐 **Vercel Deployment (Frontend Only)**

### **Quick Vercel Deployment:**
```bash
# 1. Clone repository
git clone https://github.com/saurabhhhcodes/geneinsight-platform.git
cd geneinsight-platform

# 2. Install dependencies
npm install

# 3. Deploy to Vercel
npm i -g vercel
vercel --prod
```

### **Vercel Features Available:**
- ✅ **Frontend Interface**: Complete Next.js application
- ✅ **Static Analysis**: Client-side sequence analysis
- ✅ **3D Visualization**: Interactive molecular viewer
- ✅ **UI Components**: All interface elements
- ❌ **LangChain AI**: Requires backend service
- ❌ **Molecular Docking**: Requires ML service
- ❌ **Real-time Chat**: Requires Python backend

---

## 🧠 **Full LangChain Deployment (Complete Features)**

### **Local Development Setup:**
```bash
# 1. Clone repository
git clone https://github.com/saurabhhhcodes/geneinsight-platform.git
cd geneinsight-platform

# 2. Install LangChain dependencies
pip install transformers torch langchain-community

# 3. Start ML service
cd ml_service
python app.py  # Runs on port 5000

# 4. Start frontend (new terminal)
npm install && npm run dev  # Runs on port 3001

# 5. Access full features
# - Frontend: http://localhost:3001
# - AI Chat: http://localhost:3001/ai-chat
# - ML API: http://localhost:5000
```

### **LangChain Features Available:**
- ✅ **Conversational AI**: Natural language molecular analysis
- ✅ **COVID-19 Analysis**: Specialized viral protein insights
- ✅ **Sequence Detection**: Automatic protein sequence recognition
- ✅ **Context Awareness**: AI remembers conversation history
- ✅ **Binding Affinity**: Expert explanations of molecular interactions
- ✅ **3D + AI Integration**: Interactive visualization with AI insights
- ✅ **Real-time Status**: Live LangChain LLM monitoring

---

## 🐳 **Docker Deployment (Production Ready)**

### **Full Stack Docker:**
```bash
# 1. Clone repository
git clone https://github.com/saurabhhhcodes/geneinsight-platform.git
cd geneinsight-platform

# 2. Start all services
docker-compose up -d

# 3. Access services
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8080
# - ML Service: http://localhost:5000
```

### **Docker Services:**
- 🌐 **Frontend**: Next.js application
- ☕ **Backend**: Java Spring Boot with PostgreSQL
- 🧠 **ML Service**: Python Flask with LangChain
- 🗄️ **Database**: PostgreSQL with persistent storage

---

## 🔧 **Environment Configuration**

### **Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### **ML Service (ml_service/.env):**
```env
FLASK_ENV=development
LANGCHAIN_MODEL=microsoft/DialoGPT-small
TRANSFORMERS_CACHE=/tmp/transformers_cache
```

### **Backend (application.properties):**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/geneinsight
spring.datasource.username=postgres
spring.datasource.password=password
```

---

## 🧪 **Testing Deployment**

### **Test LangChain Integration:**
```bash
# 1. Test health endpoint
curl http://localhost:5000/health

# 2. Test LangChain status
curl http://localhost:5000/langchain/status

# 3. Test COVID-19 chat
curl -X POST http://localhost:5000/langchain/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "covid 19"}'

# 4. Test sequence analysis
curl -X POST http://localhost:5000/langchain/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "SGFRKMAFPSGKVEGCMVQVTCGTTTLNGLWLDDVVYCPRHVICTSEDMLNPNYEDLLIRKSNHNFLVQAGNVQLRVIGHSMQNCVLKLKVDTANPKTPKYKFVRIQPGQTFSVLACYNGSPSGVYQCAMRPNFTIKGSFLNGSCGSVGFNIDYDCVSFCYMHHMELPTGVHAGTDLEGNFYGPFVDRQTAQAAGTDTTITVNVLAWLYAAVINGDRWFLNRFTTTLNDFNLVAMKYNYEPLTQDHVDILGPLSAQTGIAVLDMCASLKELLQNGMNGRTILGSALLEDEFTPFDVVRQCSGVTFQ"}'
```

### **Expected Responses:**
- **Health**: `{"status": "UP", "langchain": {"llm_available": true}}`
- **COVID-19**: `"I can help you analyze COVID-19 related sequences!..."`
- **Sequence**: `"Excellent! I've analyzed this COVID-19 protein sequence..."`

---

## 🚀 **Production Deployment Options**

### **1. Vercel (Frontend) + Railway (Backend)**
- **Frontend**: Deploy to Vercel for global CDN
- **ML Service**: Deploy to Railway for LangChain support
- **Database**: Use Railway PostgreSQL

### **2. AWS/GCP (Full Stack)**
- **Frontend**: S3 + CloudFront or Vercel
- **Backend**: ECS/EKS or App Engine
- **ML Service**: EC2/Compute Engine with GPU support
- **Database**: RDS/Cloud SQL

### **3. DigitalOcean (Simple)**
- **Droplet**: Single server with Docker Compose
- **Managed Database**: PostgreSQL
- **Load Balancer**: For scaling

---

## 📊 **Performance Considerations**

### **LangChain Model Loading:**
- **First Request**: ~30 seconds (model download)
- **Subsequent Requests**: ~2-5 seconds (CPU inference)
- **Memory Usage**: ~2GB RAM for DialoGPT-small
- **Storage**: ~500MB for model cache

### **Optimization Tips:**
- **GPU Support**: Add CUDA for faster inference
- **Model Caching**: Persistent storage for model files
- **Load Balancing**: Multiple ML service instances
- **CDN**: Static assets via Vercel/CloudFront

---

## 🔍 **Troubleshooting**

### **Common Issues:**
1. **LangChain not loading**: Install `transformers torch langchain-community`
2. **Model download fails**: Check internet connection and disk space
3. **CORS errors**: Update API URLs in environment variables
4. **Memory issues**: Increase container memory limits

### **Debug Commands:**
```bash
# Check ML service logs
docker logs geneinsight-ml-service

# Test LangChain directly
python -c "from ml_service.langchain_service.molecular_chain import MolecularAnalysisChain; chain = MolecularAnalysisChain(); print(chain.get_chain_info())"

# Monitor resource usage
docker stats
```

---

## 🎯 **Deployment Checklist**

- [ ] Repository cloned and dependencies installed
- [ ] Environment variables configured
- [ ] LangChain dependencies installed (if using AI features)
- [ ] Services started and health checks passing
- [ ] Frontend accessible and responsive
- [ ] AI chat responding to queries
- [ ] 3D visualization working
- [ ] Database connections established
- [ ] SSL certificates configured (production)
- [ ] Monitoring and logging setup

**🎉 Your GeneInsight Platform with LangChain AI is ready for deployment!**
