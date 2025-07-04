# GeneInsight Platform Manual Setup Guide

## Prerequisites Installation Status

Please install these tools first:

- [ ] **Node.js** - Install `nodejs-installer.msi` (already downloaded)
- [ ] **Python** - Download from https://www.python.org/downloads/
- [ ] **Java 17+** - Download from https://adoptium.net/

## Step-by-Step Setup Instructions

### 1. Verify Tool Installation

Open a new PowerShell window as Administrator and run:

```powershell
# Navigate to project directory
cd e:\geneinsight-platform

# Check installations
node --version
npm --version
python --version
pip --version
java -version
```

### 2. Install Dependencies

```powershell
# Install Node.js dependencies for frontend
npm install

# Install Python dependencies for ML service
cd ml_service
pip install -r requirements.txt
cd ..
```

### 3. Start Services (Run each in separate PowerShell windows)

#### Terminal 1: Start ML Service
```powershell
cd e:\geneinsight-platform\ml_service
python app.py
```
**Expected output:** `Running on http://127.0.0.1:5000`

#### Terminal 2: Start Backend
```powershell
cd e:\geneinsight-platform
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```
**Expected output:** `Started GeneinsightApplication in X.XXX seconds`

#### Terminal 3: Start Frontend
```powershell
cd e:\geneinsight-platform
npm run dev
```
**Expected output:** `Ready - started server on 0.0.0.0:3000`

## Access the Application

Once all services are running:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **ML Service:** http://localhost:5000
- **Database Console:** http://localhost:8080/h2-console

## Troubleshooting

### If Maven command fails:
```powershell
# Add Maven to PATH temporarily
$env:PATH = "$PWD\apache-maven-3.9.6\bin;$env:PATH"
mvn spring-boot:run
```

### If Python packages fail to install:
```powershell
# Upgrade pip first
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### If Node.js dependencies fail:
```powershell
# Clear cache and reinstall
npm cache clean --force
npm install
```

## Quick Start Script

Alternatively, after installing the tools, you can run:
```powershell
.\setup-and-run.ps1
```

This will automatically start all services for you.
