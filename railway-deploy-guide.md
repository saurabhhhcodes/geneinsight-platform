# 🚂 GeneInsight Platform - Railway Deployment Guide

## 🎯 **Best Deployment Method: GitHub Integration**

Railway's GitHub integration is the easiest and most reliable way to deploy your GeneInsight platform. Here's how:

---

## 📋 **Step 1: Prepare Your Repository**

### Push to GitHub (if not already done)
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Required Files (Already Created)
✅ `Dockerfile` - Backend service  
✅ `frontend.Dockerfile` - Frontend service  
✅ `ml_service/Dockerfile` - ML service  
✅ `railway.json` - Railway configuration  
✅ `docker-compose.yml` - Service definitions  

---

## 🚂 **Step 2: Deploy to Railway**

### 2.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub account
3. Verify your email

### 2.2 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `geneinsight-platform` repository
4. Railway will automatically detect your services

### 2.3 Configure Services
Railway will create 4 services automatically:
- **Backend** (Spring Boot)
- **Frontend** (Next.js)
- **ML Service** (Python Flask)
- **Database** (MySQL)

---

## ⚙️ **Step 3: Configure Environment Variables**

### For Backend Service:
```
SPRING_PROFILES_ACTIVE=production
MYSQL_ROOT_PASSWORD=your_secure_password_123
MYSQL_DATABASE=geneinsight
MYSQL_USER=geneinsight_user
MYSQL_PASSWORD=your_db_password_123
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password
JWT_SECRET=your_very_long_random_secret_key_here_make_it_64_chars_long
```

### For Frontend Service:
```
NEXT_PUBLIC_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}
NODE_ENV=production
```

### For ML Service:
```
FLASK_ENV=production
FLASK_DEBUG=false
```

### For Database Service:
```
MYSQL_ROOT_PASSWORD=your_secure_password_123
MYSQL_DATABASE=geneinsight
MYSQL_USER=geneinsight_user
MYSQL_PASSWORD=your_db_password_123
```

---

## 🔧 **Step 4: Service Configuration**

### Backend Service Settings:
- **Build Command**: `mvn clean package -DskipTests`
- **Start Command**: `java -jar target/geneinsight-backend-1.0.0.jar`
- **Port**: `8080`

### Frontend Service Settings:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: `3000`

### ML Service Settings:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python app.py`
- **Port**: `5000`

---

## 🌐 **Step 5: Custom Domain (Optional)**

1. In Railway dashboard, go to your frontend service
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Update DNS records as instructed
5. Railway automatically provides SSL certificates

---

## 🧪 **Step 6: Test Your Deployment**

### Check Service Health:
- **Frontend**: `https://your-app.railway.app`
- **Backend API**: `https://your-api.railway.app/actuator/health`
- **ML Service**: `https://your-ml.railway.app/health`

### Test Core Features:
1. **User Registration** with OTP email
2. **DNA File Upload** and analysis
3. **3D Structure Generation**
4. **Report Generation**
5. **Authentication** system

---

## 💰 **Railway Pricing**

### Free Tier:
- $5 credit per month
- Perfect for testing and development
- All features included

### Pro Plan ($20/month):
- $20 credit per month
- Production-ready
- Custom domains
- Priority support

### Usage Estimates for GeneInsight:
- **Small usage**: ~$10-15/month
- **Medium usage**: ~$25-40/month
- **High usage**: ~$50-80/month

---

## 🔒 **Security Checklist**

### Before Going Live:
- [ ] Change all default passwords
- [ ] Set strong JWT secret (64+ characters)
- [ ] Configure Gmail App Password for OTP emails
- [ ] Enable HTTPS (automatic with Railway)
- [ ] Set up monitoring alerts
- [ ] Configure database backups

### Gmail App Password Setup:
1. Enable 2-Factor Authentication on Gmail
2. Go to Google Account Settings
3. Security → App Passwords
4. Generate password for "Mail"
5. Use this password in `MAIL_PASSWORD`

---

## 📊 **Monitoring & Logs**

### Railway Dashboard Features:
- **Real-time logs** for all services
- **Metrics** (CPU, memory, network)
- **Deployment history**
- **Environment variables** management
- **Database** management tools

### Health Check URLs:
```
Frontend:     https://your-app.railway.app
Backend:      https://your-api.railway.app/actuator/health
ML Service:   https://your-ml.railway.app/health
Database:     Internal (managed by Railway)
```

---

## 🚀 **Deployment Commands**

### If using Railway CLI:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to existing project
railway link

# Deploy
railway up

# View logs
railway logs
```

### GitHub Integration (Recommended):
- Push to GitHub → Automatic deployment
- No CLI needed
- Automatic builds on every commit
- Rollback capabilities

---

## 🆘 **Troubleshooting**

### Common Issues:

#### "Build Failed"
- Check build logs in Railway dashboard
- Verify Dockerfile syntax
- Ensure all dependencies are listed

#### "Service Won't Start"
- Check environment variables
- Verify port configuration
- Review startup logs

#### "Database Connection Failed"
- Verify database service is running
- Check connection string format
- Ensure database credentials match

#### "Email OTP Not Working"
- Verify Gmail App Password
- Check SMTP settings
- Test email configuration

---

## 🎉 **Success Indicators**

### Your deployment is successful when:
✅ All 4 services show "Active" status  
✅ Frontend loads without errors  
✅ Backend health check returns 200  
✅ ML service responds to requests  
✅ Database connections work  
✅ OTP emails are sent successfully  
✅ File uploads work properly  
✅ 3D structure generation functions  

---

## 📞 **Support Resources**

### Railway Support:
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway GitHub](https://github.com/railwayapp)

### GeneInsight Platform:
- Check logs in Railway dashboard
- Use health check endpoints
- Monitor service metrics
- Review environment variables

---

## 🎊 **Congratulations!**

Once deployed, your GeneInsight Platform will be:
- **Live on the web** with automatic HTTPS
- **Scalable** and production-ready
- **Monitored** with real-time metrics
- **Backed up** with automatic database backups
- **Secure** with proper authentication

**Your bioinformatics platform is now ready for the world!** 🧬🚀

### Next Steps:
1. Share your app URL with users
2. Monitor usage and performance
3. Set up custom domain (optional)
4. Configure monitoring alerts
5. Plan for scaling as usage grows
