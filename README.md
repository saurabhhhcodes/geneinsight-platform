# 🧬 GeneInsight Platform

**Comprehensive Bioinformatics Platform with Multiple Deployment Options**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black.svg)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green.svg)](https://spring.io/projects/spring-boot)
[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![3DMol.js](https://img.shields.io/badge/3DMol.js-2.5.1-green.svg)](https://3dmol.csb.pitt.edu/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

## 🌟 Overview

GeneInsight Platform is a comprehensive, open-source bioinformatics application that supports **multiple deployment architectures**. Whether you want a simple serverless deployment or a full-scale enterprise setup, we've got you covered!

**🚀 Live Demo**: [https://geneinsight-platform.vercel.app](https://geneinsight-platform.vercel.app)

### **🏗️ Architecture Options**

#### **Option 1: Serverless (Vercel) - Quick & Simple**
- **Frontend**: Next.js 15 with built-in API routes
- **Backend**: Serverless functions on Vercel
- **Database**: In-memory (perfect for demos)
- **Best for**: Quick deployment, demos, learning

#### **Option 2: Full Stack (Docker) - Production Ready**
- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Spring Boot 3.2 with Java 17
- **ML Service**: Python 3.11 with Flask
- **Database**: MySQL 8.0 with Redis caching
- **Best for**: Production, advanced features, scalability

#### **Option 3: Manual Setup - Development**
- **Flexible**: Mix and match components
- **Customizable**: Adapt to your infrastructure
- **Best for**: Development, custom deployments

> **New Contributors Welcome!** 👋 This project supports all skill levels. Check out our [Contributing Guide](CONTRIBUTING.md) and [Good First Issues](https://github.com/8packcoder/geneinsight-platform/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) to get started!

## 🚀 Quick Start Guide

### **🎯 Choose Your Deployment Method**

#### **🌐 Option 1: Vercel (Serverless) - 5 Minutes Setup**
Perfect for demos, learning, and quick deployment.

```bash
# 1. Clone the repository
git clone https://github.com/8packcoder/geneinsight-platform.git
cd geneinsight-platform

# 2. Install dependencies
npm install

# 3. Deploy to Vercel
npm i -g vercel
vercel --prod
```

**What you get:**
- ✅ Next.js frontend with serverless API routes
- ✅ In-memory data storage (perfect for demos)
- ✅ Automatic HTTPS and global CDN
- ✅ Zero configuration deployment

#### **🐳 Option 2: Docker (Full Stack) - One Command Setup**
Complete production-ready environment with all services.

```bash
# 1. Clone the repository
git clone https://github.com/8packcoder/geneinsight-platform.git
cd geneinsight-platform

# 2. Start all services
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# ML Service: http://localhost:5000
# Database: MySQL on port 3306
```

**What you get:**
- ✅ Next.js frontend with TypeScript
- ✅ Spring Boot backend with Java 17
- ✅ Python ML service with Flask
- ✅ MySQL database with Redis caching
- ✅ Nginx reverse proxy
- ✅ Full production environment

#### **⚙️ Option 3: Manual Setup - Custom Development**
For developers who want full control and customization.

```bash
# 1. Clone and setup frontend
git clone https://github.com/8packcoder/geneinsight-platform.git
cd geneinsight-platform
npm install
npm run dev  # Runs on http://localhost:3000

# 2. Setup Java backend (new terminal)
mvn clean compile
mvn spring-boot:run  # Runs on http://localhost:8080

# 3. Setup ML service (new terminal)
cd ml_service
pip install -r requirements.txt
python app.py  # Runs on http://localhost:5000

# 4. Setup database (optional)
# Install MySQL and create database 'geneinsight'
```

**What you get:**
- ✅ Full development environment
- ✅ Hot reload for all services
- ✅ Customizable configuration
- ✅ Perfect for contributing and development

## ✨ Key Features

### 🔬 **Scientific Capabilities**
- **DNA/RNA/Protein Analysis** - Comprehensive sequence analysis with GC content, ORF detection, and motif identification
- **3D Structure Visualization** - Interactive molecular visualization powered by 3DMol.js
- **PDB File Import** - Upload and visualize molecular structures from PDB files
- **Structure Prediction** - AI-powered protein structure generation from sequences
- **Export Functionality** - Download results in multiple formats (PDF, CSV, JSON, PDB)

### 🔐 **Authentication & Security**
- **JWT Authentication** - Secure user sessions with token-based authentication
- **User Registration** - Simple signup process with role-based access
- **Session Management** - Persistent login with secure token handling
- **API Security** - Protected endpoints with proper authentication

### 🎨 **User Experience**
- **Responsive Design** - Optimized for desktop and mobile devices
- **Interactive Dashboard** - Comprehensive analysis interface
- **Real-time Visualization** - Dynamic 3D molecular rendering
- **File Upload Support** - Drag-and-drop PDB file uploads

## 🏗️ Architecture Overview

### **🌐 Serverless Architecture (Vercel)**
```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Deployment                        │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Next.js 15.2.4)                                 │
│  ├── Pages: Home, Analyze, Visualize, Demo                 │
│  ├── API Routes: /api/analysis, /api/auth, /api/health     │
│  ├── Components: 3D Viewer, Analysis Forms, Charts        │
│  └── Libraries: 3DMol.js, Chart.js, Tailwind CSS          │
└─────────────────────────────────────────────────────────────┘
```

### **🐳 Full Stack Architecture (Docker)**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   ML Service   │
│   (Next.js)     │◄──►│  (Spring Boot)  │◄──►│   (Python)     │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 5000   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                ┌─────────────────┴─────────────────┐
                │           Database Layer          │
                │  ┌─────────────┐ ┌─────────────┐  │
                │  │   MySQL     │ │    Redis    │  │
                │  │ Port: 3306  │ │ Port: 6379  │  │
                │  └─────────────┘ └─────────────┘  │
                └───────────────────────────────────┘
```

### **⚙️ Manual Setup Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │   Development   │    │   Development   │
│   Frontend      │    │   Backend       │    │   ML Service    │
│   (npm run dev) │    │ (mvn spring-    │    │ (python app.py) │
│                 │    │  boot:run)      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │     Local Database        │
                    │   (MySQL/PostgreSQL)      │
                    └───────────────────────────┘
```
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

## 🤝 Contributing & Collaboration

### **🌟 New Contributors Welcome!**
This project is designed to be beginner-friendly. Whether you're new to programming or an experienced developer, there's a place for you here!

#### **For Beginners**
- 📝 **Documentation**: Improve README, add comments, write guides
- 🐛 **Bug Reports**: Find and report issues
- 🎨 **UI/UX**: Improve styling, fix responsive design
- 🧪 **Testing**: Test features and report problems

#### **For Experienced Developers**
- ⚡ **New Features**: Add analysis algorithms, visualization improvements
- 🔧 **Performance**: Optimize code, improve loading times
- 🔒 **Security**: Enhance authentication, add security features
- 🤖 **AI/ML**: Improve prediction models, add new analysis types

### **📚 Getting Started as a Contributor**
1. **Read the [Contributing Guide](CONTRIBUTING.md)** - Complete guide for contributors
2. **Check [Development Setup](DEVELOPMENT.md)** - Step-by-step setup instructions
3. **Look for [Good First Issues](https://github.com/8packcoder/geneinsight-platform/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)** - Perfect for beginners
4. **Join the Discussion** - Ask questions, share ideas

### **🎯 Quick Contributor Setup**
```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/geneinsight-platform.git
cd geneinsight-platform

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Make changes and submit a pull request!
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- Git
- Code editor (VS Code recommended)

### **Optional (Advanced Features)**
- Java 17+ (for backend development)
- Maven 3.6+ (for Java backend)
- MySQL (for database features)

## 📦 Detailed Deployment Guides

### **🌐 Vercel Deployment (Serverless)**

#### **Prerequisites**
- Node.js 18+
- Git
- Vercel account (free)

#### **Step-by-Step Deployment**

**1. Fork & Clone**
```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR-USERNAME/geneinsight-platform.git
cd geneinsight-platform
```

**2. Install Dependencies**
```bash
npm install
```

**3. Test Locally**
```bash
npm run dev
# Visit http://localhost:3000 to test
```

**4. Deploy to Vercel**

**Option A: Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Option B: GitHub Integration**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your forked repository
5. Deploy with default settings

**5. Environment Variables**
In Vercel Dashboard, add:
```env
JWT_SECRET=geneInsightSecretKeyForJWTTokenGeneration2024
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
NODE_ENV=production
```

**6. Custom Domain (Optional)**
- Add your domain in Vercel Dashboard
- Update DNS records as instructed

### **🐳 Docker Deployment (Full Stack)**

#### **Prerequisites**
- Docker Desktop
- Docker Compose
- 8GB+ RAM recommended

#### **Step-by-Step Deployment**

**1. Clone Repository**
```bash
git clone https://github.com/8packcoder/geneinsight-platform.git
cd geneinsight-platform
```

**2. Environment Configuration**
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
# Set your database passwords, email credentials, etc.
```

**3. Start All Services**
```bash
# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

**4. Access Services**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **ML Service**: http://localhost:5000
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Database**: localhost:3306 (MySQL)

**5. Stop Services**
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (careful!)
docker-compose down -v
```

### **⚙️ Manual Setup (Development)**

#### **Prerequisites**
- Node.js 18+
- Java 17+ (for backend)
- Maven 3.6+ (for backend)
- Python 3.11+ (for ML service)
- MySQL 8.0+ (optional)
- Git

#### **Frontend Setup**
```bash
# 1. Clone and install
git clone https://github.com/8packcoder/geneinsight-platform.git
cd geneinsight-platform
npm install

# 2. Start development server
npm run dev
# Access: http://localhost:3000
```

#### **Java Backend Setup**
```bash
# 1. Verify Java and Maven
java -version  # Should be 17+
mvn -version   # Should be 3.6+

# 2. Compile and run
mvn clean compile
mvn spring-boot:run
# Access: http://localhost:8080
```

#### **ML Service Setup**
```bash
# 1. Navigate to ML service
cd ml_service

# 2. Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start ML service
python app.py
# Access: http://localhost:5000
```

#### **Database Setup (Optional)**
```bash
# 1. Install MySQL
# Download from: https://dev.mysql.com/downloads/mysql/

# 2. Create database
mysql -u root -p
CREATE DATABASE geneinsight;
CREATE USER 'geneinsight_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON geneinsight.* TO 'geneinsight_user'@'localhost';
FLUSH PRIVILEGES;
```

## ☕ Java Backend Deep Dive

### **🏗️ Backend Architecture**
The Spring Boot backend provides enterprise-grade features:

- **🔬 Advanced Analysis**: Sophisticated ML algorithms
- **💾 Data Persistence**: MySQL/PostgreSQL with JPA
- **🔐 Security**: JWT authentication, role-based access
- **📊 Batch Processing**: Handle multiple sequences
- **📈 Monitoring**: Health checks, metrics, logging
- **🔄 Real-time**: WebSocket support for live updates

### **📋 Backend API Endpoints**

#### **Analysis Endpoints**
```bash
# Analyze DNA sequence
POST /api/analysis/analyze
Content-Type: application/json
{
  "sequence": "ATGCGATCGTAGCTAGC",
  "analysisType": "COMPREHENSIVE"
}

# Upload file for analysis
POST /api/analysis/upload
Content-Type: multipart/form-data
file: [FASTA/PDB file]

# Generate 3D structure
POST /api/analysis/structure
Content-Type: application/json
{
  "sequence": "MKTVRQERLKSIVRILERSKEPVSGAQLAEELSVSRQVIVQDIAYLRSLGYNIVATPRGYVLAGG"
}

# Batch analysis
POST /api/analysis/batch
Content-Type: application/json
{
  "sequences": ["ATGCGATCG", "GCTAGCATG"],
  "analysisType": "BASIC"
}

# Get analysis history
GET /api/analysis/history?page=0&size=10
```

#### **Authentication Endpoints**
```bash
# Login
POST /api/auth/login
Content-Type: application/json
{
  "email": "researcher@geneinsight.com",
  "password": "password123"
}

# Register
POST /api/auth/register
Content-Type: application/json
{
  "email": "newuser@example.com",
  "password": "newpassword",
  "name": "New User"
}

# Refresh token
POST /api/auth/refresh
Authorization: Bearer <token>
```

### **🔧 Backend Configuration**

#### **Application Properties**
Create `src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/geneinsight
spring.datasource.username=geneinsight_user
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.show-sql=true

# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Security Configuration
jwt.secret=geneInsightSecretKeyForJWTTokenGeneration2024
jwt.expiration=86400000

# ML Service Integration
ml.service.url=http://localhost:5000
ml.service.timeout=30000

# CORS Configuration
cors.allowed-origins=http://localhost:3000,https://geneinsight-platform.vercel.app
```

## 🤝 Community & Support

### **📞 Getting Help**
- 🐛 **Bug Reports**: [Create an Issue](https://github.com/8packcoder/geneinsight-platform/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Request a Feature](https://github.com/8packcoder/geneinsight-platform/issues/new?template=feature_request.md)
- ❓ **Questions**: [GitHub Discussions](https://github.com/8packcoder/geneinsight-platform/discussions)
- 📖 **Documentation**: Check our [guides](CONTRIBUTING.md) and [development docs](DEVELOPMENT.md)

### **🌟 Contributors**
This project exists thanks to all the people who contribute!

[![Contributors](https://contrib.rocks/image?repo=8packcoder/geneinsight-platform)](https://github.com/8packcoder/geneinsight-platform/graphs/contributors)

### **📊 Project Stats**
![GitHub stars](https://img.shields.io/github/stars/8packcoder/geneinsight-platform?style=social)
![GitHub forks](https://img.shields.io/github/forks/8packcoder/geneinsight-platform?style=social)
![GitHub issues](https://img.shields.io/github/issues/8packcoder/geneinsight-platform)
![GitHub pull requests](https://img.shields.io/github/issues-pr/8packcoder/geneinsight-platform)

## 📜 License & Legal

### **🔓 Open Source License**
This project is licensed under the **MIT License** - one of the most permissive open source licenses.

**What this means for you:**
- ✅ **Commercial Use** - Use in commercial projects
- ✅ **Modification** - Modify the code as needed
- ✅ **Distribution** - Share and distribute freely
- ✅ **Private Use** - Use privately without restrictions
- ✅ **Patent Grant** - Protection from patent claims

**Your obligations:**
- 📄 **Include License** - Include the license text in copies
- 📝 **Include Copyright** - Include the copyright notice
- ⚠️ **No Warranty** - Software is provided "as is"

### **📋 Full License Text**
```
MIT License

Copyright (c) 2024 GeneInsight Platform Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

**📖 Full License**: See [LICENSE](LICENSE) file for complete terms.

### **🔗 Third-Party Licenses**
This project uses several open source libraries:

| Library | License | Purpose |
|---------|---------|---------|
| [Next.js](https://nextjs.org/) | MIT | React framework |
| [3DMol.js](https://3dmol.csb.pitt.edu/) | BSD-3-Clause | 3D molecular visualization |
| [React](https://react.dev/) | MIT | UI library |
| [Tailwind CSS](https://tailwindcss.com/) | MIT | CSS framework |
| [TypeScript](https://www.typescriptlang.org/) | Apache-2.0 | Type safety |
| [Radix UI](https://www.radix-ui.com/) | MIT | UI components |
| [Chart.js](https://www.chartjs.org/) | MIT | Data visualization |
| [Lucide](https://lucide.dev/) | ISC | Icons |

### **⚖️ Legal Disclaimer**
- **Educational Purpose**: This software is primarily for educational and research use
- **No Medical Claims**: Results should not be used for clinical diagnosis without validation
- **No Warranty**: Software is provided "as is" without warranties
- **Liability**: Users assume responsibility for their use of the software
- **Compliance**: Users must comply with applicable laws and regulations

### **🏥 Research & Academic Use**
**For Researchers:**
- ✅ Free to use in academic research
- ✅ Cite the project in publications
- ✅ Modify for research purposes
- ✅ Share with research community

**Citation Format:**
```
GeneInsight Platform. (2024). AI-Powered Bioinformatics Platform for Gene-Disease Association Analysis.
GitHub. https://github.com/8packcoder/geneinsight-platform
```

### **🏢 Commercial Use**
**For Companies:**
- ✅ Use in commercial products
- ✅ Integrate into existing systems
- ✅ Modify for business needs
- ✅ No licensing fees required

**Requirements:**
- Include copyright notice in your product
- Include license text in documentation
- Acknowledge third-party libraries
- No warranty claims against original authors

### **🤝 Contributing & Copyright**
**When you contribute:**
- Your contributions are licensed under MIT
- You retain copyright to your contributions
- You grant others rights under MIT license
- You confirm you have rights to contribute

**Copyright Holders:**
- Original code: 8packcoder and contributors
- Third-party libraries: Their respective owners
- Community contributions: Individual contributors

## 🙏 Acknowledgments

### **🌟 Special Thanks**
- **3DMol.js Team** - For providing excellent 3D molecular visualization capabilities
- **Next.js & Vercel Team** - For the amazing React framework and deployment platform
- **Open Source Community** - For inspiration, feedback, and contributions
- **Bioinformatics Community** - For domain expertise and scientific guidance
- **Early Contributors** - For helping shape the project direction

### **🔬 Scientific Inspiration**
- **AlphaFold** - For advancing protein structure prediction
- **PDB (Protein Data Bank)** - For providing structural biology data
- **NCBI** - For bioinformatics databases and tools
- **Bioconductor** - For bioinformatics software development practices

### **💻 Technical Inspiration**
- **GitHub** - For collaborative development platform
- **Stack Overflow** - For community-driven problem solving
- **MDN Web Docs** - For web development documentation
- **TypeScript Team** - For type-safe JavaScript development

## 🚀 Get Started Today!

### **👋 New to the Project?**
1. **⭐ Star the repository** - Show your support
2. **🍴 Fork the project** - Create your own copy
3. **📖 Read the guides** - Check [CONTRIBUTING.md](CONTRIBUTING.md) and [DEVELOPMENT.md](DEVELOPMENT.md)
4. **🔍 Find an issue** - Look for [Good First Issues](https://github.com/8packcoder/geneinsight-platform/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

### **🛠️ Quick Setup**
```bash
# Clone the repository
git clone https://github.com/8packcoder/geneinsight-platform.git
cd geneinsight-platform

# Run the setup script
npm run setup

# Start developing
npm run dev
```

### **💬 Join the Community**
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/8packcoder/geneinsight-platform/issues)
- 💡 **Request Features**: [Feature Requests](https://github.com/8packcoder/geneinsight-platform/issues/new?template=feature_request.md)
- 🗣️ **Discussions**: [GitHub Discussions](https://github.com/8packcoder/geneinsight-platform/discussions)
- 📧 **Contact**: Create an issue for direct communication

### **🎯 Ways to Contribute**
- **Code**: Fix bugs, add features, improve performance
- **Documentation**: Write guides, improve README, add comments
- **Testing**: Test features, report bugs, write automated tests
- **Design**: Improve UI/UX, create mockups, enhance accessibility
- **Science**: Validate algorithms, suggest improvements, add domain expertise

---

<div align="center">

**🧬 Made with ❤️ by the open source community**

**Ready to contribute to the future of bioinformatics?**

[**🚀 Get Started**](CONTRIBUTING.md) | [**📖 Documentation**](DEVELOPMENT.md) | [**🗺️ Roadmap**](ROADMAP.md) | [**⭐ Star on GitHub**](https://github.com/8packcoder/geneinsight-platform)

</div>

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **3DMol.js** - For excellent 3D molecular visualization
- **Next.js Team** - For the amazing React framework
- **Vercel** - For seamless deployment platform
- **Open Source Community** - For inspiration and contributions
- **Bioinformatics Community** - For domain expertise and feedback

---

**Ready to contribute?** 🚀
1. ⭐ Star this repository
2. 🍴 Fork the project
3. 📖 Read [CONTRIBUTING.md](CONTRIBUTING.md)
4. 🔍 Find a [Good First Issue](https://github.com/8packcoder/geneinsight-platform/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
5. 💻 Start coding!

**Made with ❤️ by the open source community**

#### **4. Run Backend**
```bash
# Compile and run
mvn clean compile
mvn spring-boot:run

# Or run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### **Backend API Endpoints**

#### **Analysis Endpoints**
```bash
# Analyze DNA sequence
POST http://localhost:8080/api/analysis/dna
Content-Type: application/json
{
  "sequence": "ATGCGATCGTAGCTAGC",
  "analysisType": "COMPREHENSIVE"
}

# Get analysis history
GET http://localhost:8080/api/analysis/history?userId=1

# Batch analysis
POST http://localhost:8080/api/analysis/batch
Content-Type: application/json
{
  "sequences": ["ATGCGATCG", "GCTAGCATG"],
  "format": "FASTA"
}
```

#### **Structure Endpoints**
```bash
# Generate 3D structure
POST http://localhost:8080/api/structure/generate
Content-Type: application/json
{
  "proteinSequence": "MKTVRQERLKSIVRILERSKEPVSGAQLAEELSVSRQVIVQDIAYLRSLGYNIVATPRGYVLAGG",
  "predictionMethod": "ALPHAFOLD"
}

# Upload PDB file
POST http://localhost:8080/api/structure/upload
Content-Type: multipart/form-data
file: [PDB file]
```

#### **Authentication Endpoints**
```bash
# Login
POST http://localhost:8080/api/auth/login
Content-Type: application/json
{
  "email": "researcher@geneinsight.com",
  "password": "password123"
}

# Register
POST http://localhost:8080/api/auth/register
Content-Type: application/json
{
  "email": "newuser@example.com",
  "password": "newpassword",
  "name": "New User"
}
```
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
