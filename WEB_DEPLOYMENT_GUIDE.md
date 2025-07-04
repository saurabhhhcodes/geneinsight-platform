# 🌐 GeneInsight Platform - Web Deployment Guide

## 🚀 Quick Start - Choose Your Deployment Method

### Option 1: Railway (Recommended for Beginners) ⭐
**Best for**: Quick deployment, automatic HTTPS, easy scaling
**Cost**: Free tier available, then $5/month per service
**Time**: 10-15 minutes

### Option 2: Render.com (Great for Full-Stack Apps)
**Best for**: Full-stack applications, managed databases
**Cost**: Free tier available, then $7/month per service
**Time**: 15-20 minutes

### Option 3: DigitalOcean (Most Control)
**Best for**: Custom configurations, full server control
**Cost**: $5-20/month for VPS
**Time**: 30-45 minutes

---

## 🚂 Option 1: Railway Deployment (Easiest)

### Step 1: Prepare Your Code
```powershell
# Run the deployment preparation script
.\deploy-to-cloud.ps1 -Platform railway -BuildOnly
```

### Step 2: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 3: Deploy to Railway
```bash
# Login to Railway
railway login

# Create new project
railway new

# Deploy the application
railway up
```

### Step 4: Configure Environment Variables
In Railway dashboard, add these variables:
```
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_PASSWORD=your_db_password
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
JWT_SECRET=your_very_long_random_secret_key
```

### Step 5: Access Your App
Railway will provide URLs like:
- Frontend: `https://your-app.railway.app`
- Backend: `https://your-api.railway.app`

---

## 🎨 Option 2: Render.com Deployment

### Step 1: Connect GitHub Repository
1. Push your code to GitHub
2. Connect your GitHub account to Render
3. Create new Web Service from your repository

### Step 2: Use Blueprint Deployment
The `render.yaml` file is already configured for you!

1. In Render dashboard, choose "Blueprint"
2. Connect your repository
3. Render will automatically deploy all services

### Step 3: Configure Environment Variables
Set these in Render dashboard:
```
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_PASSWORD=your_db_password
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
JWT_SECRET=your_very_long_random_secret_key
```

### Step 4: Access Your App
Render provides URLs like:
- Frontend: `https://your-app.onrender.com`
- Backend: `https://your-api.onrender.com`

---

## 🌊 Option 3: DigitalOcean VPS Deployment

### Step 1: Create Droplet
1. Create DigitalOcean account
2. Create new Droplet with Docker pre-installed
3. Choose Ubuntu 22.04 with Docker
4. Select $5-10/month plan

### Step 2: Upload Your Code
```bash
# On your local machine
scp -r . root@your-server-ip:/app

# Or use git
ssh root@your-server-ip
cd /app
git clone https://github.com/yourusername/geneinsight-platform.git
```

### Step 3: Configure Environment
```bash
# On the server
cd /app
cp .env.production .env
# Edit .env with your actual values
nano .env
```

### Step 4: Deploy with Docker
```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### Step 5: Configure Nginx (Optional)
```bash
# Install nginx
apt update && apt install nginx

# Configure reverse proxy
nano /etc/nginx/sites-available/geneinsight
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🔧 Environment Variables Reference

### Required Variables
```bash
# Database
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_DATABASE=geneinsight
MYSQL_USER=geneinsight_user
MYSQL_PASSWORD=your_secure_db_password

# Email (for OTP authentication)
MAIL_USERNAME=noreply@yourdomain.com
MAIL_PASSWORD=your_gmail_app_password

# Security
JWT_SECRET=your_very_long_random_secret_key_here

# API URLs (update with your actual domain)
NEXT_PUBLIC_API_URL=https://your-domain.com
```

### Optional Variables
```bash
# Ports (if different from defaults)
FRONTEND_PORT=3000
BACKEND_PORT=8080
ML_PORT=5000

# File uploads
MAX_FILE_SIZE=50MB
UPLOAD_DIR=/app/uploads

# OTP settings
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=3
OTP_MAX_REQUESTS_PER_HOUR=5
```

---

## 🔒 Security Checklist

### Before Going Live
- [ ] Change all default passwords
- [ ] Set strong JWT secret (32+ characters)
- [ ] Configure real email SMTP (not test mode)
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Enable monitoring and logging

### Email Configuration
For Gmail SMTP:
1. Enable 2-factor authentication
2. Generate App Password
3. Use App Password (not your regular password)

---

## 🚀 Quick Deployment Commands

### Railway
```bash
npm install -g @railway/cli
railway login
railway new
railway up
```

### Render
```bash
# Just push to GitHub and connect in Render dashboard
git add .
git commit -m "Deploy to Render"
git push origin main
```

### DigitalOcean
```bash
# On your server
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🎯 Testing Your Deployment

### Health Checks
- Frontend: `https://your-domain.com`
- Backend API: `https://your-domain.com/actuator/health`
- ML Service: `https://your-domain.com/ml/health`

### Feature Testing
1. **User Registration**: Test OTP email system
2. **DNA Analysis**: Upload sample DNA file
3. **3D Structure**: Generate protein structures
4. **Reports**: Export analysis results
5. **Authentication**: Login/logout functionality

---

## 🆘 Troubleshooting

### Common Issues

#### "Services not starting"
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

#### "Database connection failed"
- Check MYSQL_* environment variables
- Ensure database service is running
- Verify network connectivity

#### "Email not sending"
- Verify MAIL_USERNAME and MAIL_PASSWORD
- Check Gmail App Password setup
- Test SMTP connection

#### "Frontend can't reach backend"
- Update NEXT_PUBLIC_API_URL
- Check CORS configuration
- Verify network routing

---

## 📞 Support

### Getting Help
1. Check application logs
2. Verify environment variables
3. Test individual services
4. Check platform-specific documentation

### Useful Commands
```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart specific service
docker-compose -f docker-compose.prod.yml restart frontend

# Check service status
docker-compose -f docker-compose.prod.yml ps

# Update and redeploy
git pull
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🎉 Success!

Once deployed, your GeneInsight Platform will be available at:
- **Main Application**: `https://your-domain.com`
- **API Documentation**: `https://your-domain.com/swagger-ui.html`
- **Health Monitoring**: `https://your-domain.com/actuator/health`

**Congratulations! Your bioinformatics platform is now live on the web!** 🧬🚀
