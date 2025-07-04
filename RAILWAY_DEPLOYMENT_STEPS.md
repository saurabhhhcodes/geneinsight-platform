# 🚂 Railway Deployment - Step by Step

## 🎯 Your Railway Project is Ready!

**Project URL**: https://railway.com/project/bc166df6-c0fa-402f-8f35-04e0952b5b53

## 🚀 Deploy Your Services

### **Step 1: Add Database**
1. Go to your Railway project dashboard
2. Click **"New Service"**
3. Select **"Database"** → **"PostgreSQL"**
4. Railway will provision a free PostgreSQL database

### **Step 2: Deploy Backend Service**
1. Click **"New Service"**
2. Select **"GitHub Repo"**
3. Choose **"8packcoder/geneinsight-platform"**
4. Set **Root Directory**: `/` (leave empty)
5. Set **Dockerfile Path**: `Dockerfile`
6. Railway will build and deploy your Spring Boot backend

### **Step 3: Deploy Frontend Service**
1. Click **"New Service"** again
2. Select **"GitHub Repo"**
3. Choose **"8packcoder/geneinsight-platform"** again
4. Set **Root Directory**: `/` (leave empty)
5. Set **Dockerfile Path**: `frontend.Dockerfile`
6. Railway will build and deploy your Next.js frontend

### **Step 4: Deploy ML Service**
1. Click **"New Service"** again
2. Select **"GitHub Repo"**
3. Choose **"8packcoder/geneinsight-platform"** again
4. Set **Root Directory**: `ml_service`
5. Set **Dockerfile Path**: `ml_service/Dockerfile`
6. Railway will build and deploy your Python ML service

## ⚙️ Configure Environment Variables

### **For Backend Service:**
```
SPRING_PROFILES_ACTIVE=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
ML_SERVICE_URL=${{geneinsight-ml.RAILWAY_PUBLIC_DOMAIN}}
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password
JWT_SECRET=geneInsightSecretKeyForJWTTokenGeneration2024VeryLongAndSecure
```

### **For Frontend Service:**
```
NEXT_PUBLIC_API_URL=${{geneinsight-backend.RAILWAY_PUBLIC_DOMAIN}}
NODE_ENV=production
```

### **For ML Service:**
```
FLASK_ENV=production
FLASK_DEBUG=false
```

## 🌐 Your Live URLs

After deployment, your services will be available at:
- **Frontend**: `https://geneinsight-frontend-production.railway.app`
- **Backend**: `https://geneinsight-backend-production.railway.app`
- **ML Service**: `https://geneinsight-ml-production.railway.app`

## 🧪 Test Your Deployment

1. **Main App**: Visit your frontend URL
2. **Backend Health**: `https://your-backend-url.railway.app/actuator/health`
3. **ML Health**: `https://your-ml-url.railway.app/health`
4. **API Docs**: `https://your-backend-url.railway.app/swagger-ui.html`

## 💰 Railway Pricing

- **$5 free credit monthly** (no credit card required)
- **Usage-based pricing** after free credit
- **Estimated cost**: $3-8/month for moderate usage

## 🎉 Success!

Your GeneInsight Platform will be live with:
- ✅ AI-powered DNA analysis
- ✅ 3D protein structure generation
- ✅ Professional authentication
- ✅ Interactive visualizations
- ✅ Production-grade infrastructure
