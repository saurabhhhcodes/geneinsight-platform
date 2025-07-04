# 🧬 GeneInsight Platform

**AI-Powered Bioinformatics Platform for Gene-Disease Association Analysis**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Railway](https://img.shields.io/badge/Deploy-Railway-purple.svg)](https://railway.app)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.java.net/projects/jdk/17/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.9-blue.svg)](https://www.python.org/)

## 🌟 Overview

GeneInsight Platform is a comprehensive bioinformatics application that combines cutting-edge machine learning with modern web technologies to provide powerful gene analysis and disease prediction capabilities. The platform offers DNA sequence analysis, 3D protein structure generation, and interactive visualizations for researchers and healthcare professionals.

## ✨ Key Features

### 🔬 **Scientific Capabilities**
- **DNA Sequence Analysis** - Upload and analyze genetic sequences with ML-powered predictions
- **3D Protein Structure Generation** - AI-based protein structure prediction with confidence scoring
- **Gene-Disease Association** - Machine learning models for disease risk assessment
- **Interactive Visualizations** - Real-time charts and 3D molecular viewers
- **Comprehensive Reports** - Detailed analysis reports with export functionality

### 🔐 **Security & Authentication**
- **OTP Email Authentication** - Two-factor authentication with email verification
- **JWT Token Security** - Secure session management
- **Role-based Access Control** - Admin and user role management
- **Rate Limiting** - Protection against abuse and spam

### 🎨 **User Experience**
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Real-time Updates** - WebSocket integration for live data updates
- **Interactive Dashboard** - Comprehensive user dashboard with analytics
- **File Upload Support** - Support for various bioinformatics file formats

## 🏗️ Architecture

### **Multi-Service Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   ML Service   │
│   (Next.js)     │◄──►│  (Spring Boot)  │◄──►│   (Python)     │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 5000   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │    Database     │
                    │    (MySQL)      │
                    │   Port: 3306    │
                    └─────────────────┘
```

### **Technology Stack**

#### **Frontend**
- **Next.js 15** - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **3DMol.js** - 3D molecular visualization
- **Recharts** - Data visualization library

#### **Backend**
- **Spring Boot 3.2** - Java enterprise framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database abstraction layer
- **MySQL 8.0** - Relational database
- **JWT** - JSON Web Token authentication
- **Swagger/OpenAPI** - API documentation

#### **ML Service**
- **Python 3.9** - Programming language
- **Flask** - Lightweight web framework
- **Scikit-learn** - Machine learning library
- **NumPy & Pandas** - Data processing libraries
- **Joblib** - Model serialization

#### **DevOps & Deployment**
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Railway** - Cloud deployment platform
- **GitHub Actions** - CI/CD pipeline (optional)

## 🚀 Quick Start

### **Prerequisites**
- Docker Desktop
- Node.js 18+
- Java 17+
- Python 3.9+
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/8packcoder/geneinsight-platform.git
cd geneinsight-platform
```

### **2. Environment Setup**
```bash
# Copy environment template
cp .env.production .env

# Edit environment variables
# Set your database passwords, email credentials, etc.
```

### **3. Docker Deployment (Recommended)**
```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps
```

### **4. Manual Setup (Development)**
```bash
# Install dependencies
npm install

# Start ML Service
cd ml_service
pip install -r requirements.txt
python app.py

# Start Backend (new terminal)
mvn spring-boot:run

# Start Frontend (new terminal)
npm run dev
```

### **5. Access Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **ML Service**: http://localhost:5000
- **API Documentation**: http://localhost:8080/swagger-ui.html

## 🌐 Cloud Deployment

### **Railway (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway new
railway up
```

### **Other Platforms**
- **Render.com** - Use `render.yaml` configuration
- **DigitalOcean** - Use `docker-compose.prod.yml`
- **AWS/Azure/GCP** - Container deployment guides available

## 📊 Features Overview

### **DNA Analysis Workflow**
1. **Upload** - Support for FASTA, GenBank, and custom formats
2. **Processing** - Sequence validation and feature extraction
3. **ML Analysis** - Disease association prediction
4. **Visualization** - Interactive charts and graphs
5. **Reporting** - Comprehensive PDF reports

### **3D Structure Generation**
1. **Sequence Input** - DNA or protein sequences
2. **AI Prediction** - Structure prediction algorithms
3. **3D Visualization** - Interactive molecular viewer
4. **Analysis** - Secondary structure analysis
5. **Export** - PDB format export

### **User Management**
1. **Registration** - Email-based account creation
2. **OTP Verification** - Two-factor authentication
3. **Profile Management** - User settings and preferences
4. **History Tracking** - Analysis history and results
5. **Admin Panel** - User and system management

## 🧪 Testing

### **Run Tests**
```bash
# Frontend tests
npm test

# Backend tests
mvn test

# ML Service tests
cd ml_service
python -m pytest

# Integration tests
./test-deployment.ps1
```

### **Test Coverage**
- Unit tests for all major components
- Integration tests for API endpoints
- End-to-end tests for user workflows
- Performance tests for ML predictions

## 📚 Documentation

- **[Installation Guide](INSTALLATION-GUIDE.md)** - Detailed setup instructions
- **[Deployment Guide](WEB_DEPLOYMENT_GUIDE.md)** - Cloud deployment options
- **[API Documentation](http://localhost:8080/swagger-ui.html)** - Interactive API docs
- **[User Guide](USER_GUIDE.md)** - Feature documentation
- **[Developer Guide](DEVELOPER_GUIDE.md)** - Development setup

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/8packcoder/geneinsight-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/8packcoder/geneinsight-platform/discussions)
- **Email**: support@geneinsight.com

## 🙏 Acknowledgments

- **3DMol.js** - 3D molecular visualization
- **Spring Boot** - Java application framework
- **Next.js** - React framework
- **Railway** - Cloud deployment platform

---

**🧬 Built with ❤️ for the bioinformatics community**
