# 🔧 Apillon Manual Deployment Guide

## 🚨 **If Automated Deployment Failed**

Follow these manual steps to deploy GeneInsight Platform to Apillon:

---

## **Step 1: Login and Check Status**

```bash
# Login to Apillon
apillon auth login

# Check authentication
apillon auth status

# Check current projects
apillon projects list
```

---

## **Step 2: Create Project (if not exists)**

```bash
# Create new project
apillon project create --name "geneinsight-platform"

# Or select existing project
apillon project select geneinsight-platform
```

---

## **Step 3: Deploy Backend Service Only (Simplified)**

```bash
# Use simplified configuration
cp apillon-simple.json apillon.json

# Deploy only the ML service first
apillon service create --name ml-service --type python

# Set environment variables
apillon env set FLASK_ENV=production
apillon env set PORT=5000
apillon env set PYTHONUNBUFFERED=1
apillon env set TRANSFORMERS_CACHE=/tmp/cache

# Deploy the service
apillon deploy --service ml-service --path ml_service
```

---

## **Step 4: Monitor Deployment**

```bash
# Check deployment status
apillon status

# Watch logs in real-time
apillon logs --service ml-service --follow

# Check resource usage
apillon metrics --service ml-service
```

---

## **Step 5: Test the Deployment**

```bash
# Get service URL
apillon info --service ml-service

# Test health endpoint
curl https://your-service-url.apillon.io/health

# Test basic functionality
curl -X POST https://your-service-url.apillon.io/langchain/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'
```

---

## **Step 6: Scale if Needed**

```bash
# If deployment fails due to resources
apillon scale --service ml-service --memory 2GB --cpu 1

# Restart service
apillon restart --service ml-service
```

---

## **Step 7: Add LangChain Dependencies (if working)**

```bash
# Update build command to include LangChain
apillon service update ml-service --build-command "pip install --no-cache-dir -r requirements.txt && pip install transformers torch langchain-community"

# Redeploy
apillon redeploy --service ml-service
```

---

## **Step 8: Deploy Frontend (after backend works)**

```bash
# Build frontend
npm run build

# Create frontend service
apillon service create --name frontend --type static

# Deploy frontend
apillon deploy --service frontend --path .next
```

---

## **🔍 Common Error Solutions**

### **Error: "Build failed"**
```bash
# Check build logs
apillon build logs --service ml-service

# Try with no cache
apillon deploy --service ml-service --no-cache

# Use simpler requirements
# Edit ml_service/requirements.txt to remove heavy dependencies temporarily
```

### **Error: "Service won't start"**
```bash
# Check startup logs
apillon logs --service ml-service --tail 100

# Increase memory
apillon scale --service ml-service --memory 2GB

# Set startup timeout
apillon env set STARTUP_TIMEOUT=300
```

### **Error: "Out of memory"**
```bash
# Scale up resources
apillon scale --service ml-service --memory 4GB --cpu 2

# Optimize model loading
apillon env set TRANSFORMERS_CACHE=/tmp/cache
apillon env set TORCH_HOME=/tmp/torch
```

### **Error: "Network timeout"**
```bash
# Increase timeouts
apillon env set HTTP_TIMEOUT=300
apillon env set BUILD_TIMEOUT=1800

# Use CDN for dependencies
apillon env set PIP_INDEX_URL=https://pypi.org/simple/
```

---

## **🧪 Minimal Test Deployment**

If everything fails, try this minimal version:

### **1. Create minimal Flask app:**
```python
# Create ml_service/minimal_app.py
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/health')
def health():
    return jsonify({"status": "UP", "service": "minimal"})

@app.route('/test')
def test():
    return jsonify({"message": "Hello from Apillon!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

### **2. Create minimal requirements:**
```txt
# Create ml_service/minimal_requirements.txt
Flask==2.3.3
```

### **3. Deploy minimal version:**
```bash
# Update service to use minimal app
apillon service update ml-service --start-command "python minimal_app.py" --build-command "pip install -r minimal_requirements.txt"

# Deploy
apillon redeploy --service ml-service
```

### **4. Test minimal deployment:**
```bash
curl https://your-service-url.apillon.io/health
curl https://your-service-url.apillon.io/test
```

### **5. Gradually add features:**
Once minimal version works, gradually add:
1. Original Flask app
2. Basic dependencies
3. LangChain dependencies
4. Full functionality

---

## **📞 Getting Help**

### **Apillon Support:**
- Dashboard: Check detailed error messages
- Documentation: https://docs.apillon.io
- Support: Contact through Apillon dashboard

### **Debug Information to Collect:**
```bash
# Collect this information for support
apillon --version
apillon auth status
apillon status
apillon logs --service ml-service --tail 50
apillon metrics --service ml-service
```

---

## **🎯 Success Indicators**

### **✅ Deployment Successful When:**
1. `apillon status` shows service as "Running"
2. Health endpoint returns 200: `/health`
3. Service logs show no errors
4. Resource usage is stable
5. External requests work

### **🔄 Next Steps After Success:**
1. Add custom domain
2. Set up monitoring
3. Configure auto-scaling
4. Add database if needed
5. Deploy frontend service

---

**Follow these steps carefully and let me know which specific error you encounter!**
