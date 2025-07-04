# GeneInsight Platform - Complete Installation Guide

## 🚀 Quick Start

### Step 1: Install Required Tools

**All installers are already downloaded for you!**

1. **Install Node.js**
   - Right-click `nodejs-installer.msi` → "Run as administrator"
   - Follow the wizard (accept all defaults)

2. **Install Python**
   - Right-click `python-installer.exe` → "Run as administrator"
   - **IMPORTANT:** Check "Add Python to PATH" during installation

3. **Install Java**
   - Download from: https://adoptium.net/temurin/releases/?version=17
   - Choose "Windows x64 MSI" for OpenJDK 17
   - Run as administrator

### Step 2: Verify Installation

Open PowerShell as Administrator and run:
```powershell
cd e:\geneinsight-platform
.\check-installations.ps1
```

### Step 3: Run the Application

Once all tools are installed:
```powershell
.\complete-setup.ps1
```

## 🌐 Application URLs

After startup, access:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **ML Service:** http://localhost:5000
- **Database Console:** http://localhost:8080/h2-console
- **API Documentation:** http://localhost:8080/swagger-ui.html

## 🔧 Advanced Options

### Install Dependencies Only
```powershell
.\complete-setup.ps1 -InstallOnly
```

### Start Services Only (after dependencies are installed)
```powershell
.\complete-setup.ps1 -StartOnly
```

### Manual Step-by-Step
See `manual-setup-steps.md` for detailed manual instructions.

## 🏗️ Architecture

The GeneInsight platform consists of:

1. **Frontend (Next.js)** - React-based user interface
2. **Backend (Spring Boot)** - REST API and business logic
3. **ML Service (Python/Flask)** - Machine learning predictions
4. **Database (H2)** - In-memory database for development

## 🐛 Troubleshooting

### If tools are not recognized after installation:
1. Close all PowerShell windows
2. Open a new PowerShell as Administrator
3. Navigate back to the project directory
4. Run `.\check-installations.ps1` again

### If npm install fails:
```powershell
npm cache clean --force
npm install
```

### If Python packages fail:
```powershell
python -m pip install --upgrade pip
cd ml_service
pip install -r requirements.txt
```

### If Maven fails:
The script automatically configures Maven, but if needed:
```powershell
$env:PATH = "$PWD\apache-maven-3.9.6\bin;$env:PATH"
```

## 📁 Project Structure

```
geneinsight-platform/
├── app/                    # Next.js frontend pages
├── components/             # React components
├── ml_service/            # Python ML service
├── src/main/              # Spring Boot backend
├── target/                # Compiled Java artifacts
├── apache-maven-3.9.6/    # Maven installation
├── complete-setup.ps1     # Main setup script
├── check-installations.ps1 # Installation checker
└── manual-setup-steps.md  # Manual instructions
```

## 🎯 What Each Service Does

- **Frontend**: Gene analysis interface, data visualization, user management
- **Backend**: REST API, authentication, data persistence, file uploads
- **ML Service**: Gene-disease association predictions using machine learning
- **Database**: Stores user data, analysis results, and application state

## 🔄 Development Workflow

1. Make changes to code
2. Services auto-reload (hot reload enabled)
3. Test changes in browser
4. Use API documentation at http://localhost:8080/swagger-ui.html

## 🛑 Stopping Services

Press `Ctrl+C` in the PowerShell window where you ran the setup script. This will stop all services gracefully.

---

**Need help?** Check the troubleshooting section or run `.\check-installations.ps1` to verify your setup.
