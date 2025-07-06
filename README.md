# 🧬 GeneInsight Platform - SaaS Edition

**Complete SaaS Bioinformatics Platform with Multi-Tenant Architecture, Subscription Billing & Advanced AI-Powered Genetic Analysis**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![SaaS Ready](https://img.shields.io/badge/SaaS-Ready-purple.svg)](https://stripe.com/)
[![Multi-Tenant](https://img.shields.io/badge/Multi--Tenant-Architecture-blue.svg)](https://vercel.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black.svg)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green.svg)](https://spring.io/projects/spring-boot)
[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)
[![GitHub](https://img.shields.io/badge/GitHub-saurabhhhcodes-black?logo=github)](https://github.com/saurabhhhcodes)

**🚀 Live SaaS Platform**: [https://geneinsight-platform.vercel.app](https://geneinsight-platform.vercel.app)  
**💰 Pricing Plans**: [View SaaS Pricing](https://geneinsight-platform.vercel.app/pricing)  
**📊 SaaS Dashboard**: Multi-tenant with usage analytics & billing management

## 🌟 What is GeneInsight Platform?

**GeneInsight Platform** is a **complete Software-as-a-Service (SaaS) bioinformatics platform** that combines cutting-edge AI with advanced molecular visualization. Built for commercial deployment with multi-tenant architecture, subscription billing, and enterprise-grade features.

### 🎯 **SaaS Business Model**

| Plan | Price | Users | Analyses/Month | Storage | Target Market |
|------|-------|-------|----------------|---------|---------------|
| **Free** | $0 | 5 | 100 | 1GB | Students & Individual Researchers |
| **Pro** | $49/mo | 25 | 1,000 | 10GB | Research Teams & Small Labs |
| **Enterprise** | $199/mo | Unlimited | Unlimited | 100GB | Large Organizations & Institutions |

*Annual billing available with 20% discount*

## 💼 **Key SaaS Features**

### 🏢 **Multi-Tenant Architecture**
- **Organization Management**: Complete tenant isolation with custom branding
- **Team Collaboration**: Owner, Admin, Member, Viewer roles with granular permissions
- **User Invitations**: Email-based team member invitations with role assignment
- **Data Isolation**: Secure tenant separation with organization-scoped data access

### 💳 **Subscription & Billing System**
- **3-Tier Pricing**: Free, Pro ($49/mo), Enterprise ($199/mo) with clear value propositions
- **Usage Tracking**: Real-time monitoring of analyses, storage, API calls, and team members
- **Automatic Limits**: Usage enforcement with smart upgrade prompts and notifications
- **Stripe Integration**: Ready for payment processing with subscription management

### 📊 **SaaS Dashboard & Analytics**
- **Usage Overview**: Real-time usage statistics with progress bars and percentages
- **Billing Information**: Current plan, billing cycle, subscription status display
- **Upgrade Prompts**: Smart notifications when approaching usage limits
- **Team Analytics**: Member activity and organization usage insights

### 🔬 **Core Scientific Features**
- **Multi-format Support**: Analyze DNA, RNA, and protein sequences with usage tracking
- **Comprehensive Analysis**: Nucleotide composition, GC content, ORF detection, motif identification
- **3D Molecular Visualization**: Interactive 3D viewer powered by 3DMol.js
- **Real-time Results**: Instant analysis with detailed visualizations and usage metering
- **Export Options**: Download results in multiple formats with plan-based limits

## 🚀 **Quick Start Guide**

### **🌐 Option 1: Vercel (Serverless) - 5 Minutes Setup**
```bash
# 1. Clone the repository
git clone https://github.com/saurabhhhcodes/geneinsight-platform.git
cd geneinsight-platform

# 2. Install dependencies
npm install

# 3. Deploy to Vercel
npm i -g vercel
vercel --prod
```

### **🐳 Option 2: Docker (Full Stack) - One Command Setup**
```bash
# 1. Clone the repository
git clone https://github.com/saurabhhhcodes/geneinsight-platform.git
cd geneinsight-platform

# 2. Start all services
docker-compose up -d

# Access: Frontend (3000), Backend (8080), ML Service (5000)
```

## 🔌 **SaaS API Endpoints**

### **🏢 Organization Management**
```typescript
GET /api/organizations          // Get organization details
POST /api/organizations         // Create new organization
PUT /api/organizations          // Update organization settings
```

### **💳 Subscription & Billing**
```typescript
GET /api/subscriptions          // Get subscription status and usage
POST /api/subscriptions         // Upgrade subscription plan
GET /api/usage/track           // Get usage statistics
POST /api/usage/track          // Track usage (automatic)
```

## 🛠 **Technology Stack**

### **Frontend**
- **Next.js 15** with TypeScript for type-safe, performant web application
- **Tailwind CSS** for responsive, modern UI design
- **3DMol.js** for hardware-accelerated 3D molecular rendering

### **Backend**
- **Spring Boot 3.2** with Java 17 for enterprise-grade API services
- **MySQL 8.0** with Redis caching for optimal data management
- **JWT Authentication** with multi-tenant support

### **ML Service**
- **Python 3.11** with Flask for advanced bioinformatics algorithms
- **Scikit-learn** for machine learning capabilities
- **NumPy & Pandas** for data processing

### **SaaS Infrastructure**
- **Multi-tenant database** design with proper isolation
- **Stripe integration** for subscription billing
- **Usage tracking** and limits enforcement
- **Role-based access control** with organization management

## 📖 **Using the Application**

### **🎯 Getting Started as a User**

1. **🏠 Homepage & Navigation**
   - Visit the application URL
   - Navigate: Home, Analyze, Visualize, Pricing, Dashboard

2. **🧬 Analyzing Sequences**
   - Go to `/analyze` page
   - Input DNA, RNA, or protein sequences
   - Supported formats: FASTA, PDB, plain text
   - View comprehensive results with usage tracking

3. **🧪 3D Molecular Visualization**
   - Go to `/visualize` page
   - Load structures via PDB ID or file upload
   - Interactive controls: rotate, zoom, pan, reset
   - Multiple rendering styles and color schemes

4. **📊 Managing Your Organization**
   - Access SaaS dashboard for usage analytics
   - Manage team members and permissions
   - Monitor billing and subscription status
   - Upgrade plans as needed

## 💰 **Business Benefits**

### **🚀 For SaaS Entrepreneurs**
- Complete SaaS foundation with proven business model
- Scalable technology built on modern, cloud-native stack
- Market validation in the $4.2B bioinformatics market

### **🏢 For Organizations**
- Cost-effective with pay-as-you-scale pricing
- Team collaboration with enterprise security
- Professional support based on subscription tier

### **🔬 For Researchers**
- Instant access with no software installation
- Collaborative analysis sharing with team members
- Always updated with latest features and algorithms

## 🤝 **Contributing**

We welcome contributions! Check out our [Contributing Guide](CONTRIBUTING.md) and look for [Good First Issues](https://github.com/saurabhhhcodes/geneinsight-platform/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

### **🛠️ Development Setup**
```bash
# Clone and setup
git clone https://github.com/saurabhhhcodes/geneinsight-platform.git
cd geneinsight-platform
npm install
npm run dev
```

## 📜 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **3DMol.js Team** - For excellent 3D molecular visualization capabilities
- **Next.js & Vercel Team** - For the amazing React framework and deployment platform
- **Open Source Community** - For inspiration, feedback, and contributions
- **Bioinformatics Community** - For domain expertise and scientific guidance

---

**🧬 Built with ❤️ for the bioinformatics community**

**Ready to transform your bioinformatics workflow?** [**🚀 Get Started**](https://geneinsight-platform.vercel.app) | [**💰 View Pricing**](https://geneinsight-platform.vercel.app/pricing) | [**📖 Documentation**](CONTRIBUTING.md)
