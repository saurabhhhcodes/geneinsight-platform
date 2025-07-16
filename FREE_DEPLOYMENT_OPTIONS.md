# 🚀 Free Deployment Options for GeneInsight LangServe

Since Railway has plan limitations, here are several **completely free** alternatives:

## 🎯 **Option 1: Render.com (Recommended)**

### **Why Render?**
- ✅ **Completely Free**: No credit card required
- ✅ **Easy Deployment**: Connect GitHub and deploy
- ✅ **Auto-scaling**: Handles traffic automatically
- ✅ **Custom Domains**: Free SSL certificates
- ✅ **No Time Limits**: Unlike some free tiers

### **Deployment Steps:**

1. **Go to [render.com](https://render.com)**
2. **Sign up with GitHub** (free account)
3. **Create New Web Service**
4. **Connect your GitHub repository**: `geneinsight-platform`
5. **Configure deployment**:
   - **Build Command**: `pip install -r requirements_minimal.txt`
   - **Start Command**: `python railway_minimal.py`
   - **Environment Variables**:
     - `PYTHONUNBUFFERED=1`
     - `PORT=8000`

6. **Deploy** - Render will give you a URL like: `https://geneinsight-langserve.onrender.com`

---

## 🎯 **Option 2: Fly.io**

### **Deployment Steps:**

1. **Install Fly CLI**: `npm install -g @fly.io/flyctl`
2. **Login**: `fly auth login`
3. **Initialize**: `fly launch --name geneinsight-langserve`
4. **Deploy**: `fly deploy`

---

## 🎯 **Option 3: Heroku (if available)**

### **Deployment Steps:**

1. **Install Heroku CLI**
2. **Login**: `heroku login`
3. **Create app**: `heroku create geneinsight-langserve`
4. **Deploy**: `git push heroku main`

---

## 🎯 **Option 4: Vercel (Serverless)**

Since you already have Vercel, you can deploy the backend there too:

1. **Create `api/` folder in your Vercel project**
2. **Add Python serverless functions**
3. **Deploy with your existing Vercel setup**

---

## 📁 **Files Ready for Deployment**

I've created these optimized files for free deployment:

- ✅ `railway_minimal.py` - Lightweight LangServe app
- ✅ `requirements_minimal.txt` - Minimal dependencies
- ✅ `render.yaml` - Render.com configuration
- ✅ `Procfile` - Process configuration

---

## 🌐 **After Deployment**

Once deployed on any platform, you'll get a URL like:
- **Render**: `https://geneinsight-langserve.onrender.com`
- **Fly.io**: `https://geneinsight-langserve.fly.dev`
- **Heroku**: `https://geneinsight-langserve.herokuapp.com`

### **Update Vercel Environment Variables:**

1. Go to **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**
2. Add/Update: `NEXT_PUBLIC_API_URL=https://your-deployment-url.com`
3. **Redeploy** your Vercel frontend

---

## 🧪 **Test Your Deployment**

```bash
# Health check
curl https://your-deployment-url.com/health

# API documentation
# Visit: https://your-deployment-url.com/docs

# Test sequence analysis
curl -X POST https://your-deployment-url.com/analyze/sequence/invoke \
  -H "Content-Type: application/json" \
  -d '{"input": {"sequence": "ATCGATCG", "sequence_type": "DNA"}}'
```

---

## 💡 **Recommendation**

**Use Render.com** - it's the most reliable free option:
1. No credit card required
2. Easy GitHub integration
3. Automatic deployments
4. Free SSL certificates
5. No time limits

Would you like me to help you deploy to Render.com instead?
