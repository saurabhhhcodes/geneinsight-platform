# NTCC Term Paper [BTTP100] on
# 'GeneInsight Platform - SaaS Bioinformatics Application'

**Submitted to**  
Amity Institute of Biotechnology  
Amity University Uttar Pradesh, Lucknow Campus

**In partial fulfillment of the requirements for the award of the degree of**  
**Bachelor of Technology (Biotechnology)**

**by**  
**Student Name - [Your Name]**  
**[Your Enrollment Number]**

**Under the guidance of**  
**Dr. Ausaf Ahmad**  
**Assistant Professor-III**  
**AIB**

**Industry Guide:**  
**Mohit Nigam**  
**Atmohive Biotech**  
**HBTU Kanpur, UP, India**

---

## DECLARATION

I [YOUR NAME] student of BTECH BIOTECHNOLOGY hereby declare that the project titled "**GENEINSIGHT PLATFORM - SAAS BIOINFORMATICS APPLICATION**" which is submitted by me to Department of AIB (AMITY INSTITUTE OF BIOTECHNOLOGY), Amity University Uttar Pradesh Lucknow.

This project was completed during my internship as a **Full Stack Developer and AI/ML Developer** at **Atmohive Biotech, HBTU Kanpur, UP, India** under the industry guidance of **Mr. Mohit Nigam**.

The Author attests that permission has been obtained for any copyrighted material appearing in this project report other than brief excerpts requiring only proper acknowledgement in scholarly writing and all such use is acknowledged.

**Name:** [YOUR NAME]  
**Enrollment No.:** [YOUR ENROLLMENT NUMBER]  
**BTECH BIOTECHNOLOGY (2023 – 27)**

---

## AMITY UNIVERSITY
## UTTAR PRADESH
## LUCKNOW CAMPUS

### Certificate

This is to certify that **[YOUR NAME] ENROLLMENT [YOUR ENROLLMENT NUMBER]** student of BTech - Biotechnology, has successfully completed the project titled **GENEINSIGHT PLATFORM - SAAS BIOINFORMATICS APPLICATION** under my guidance.

This project has been carried out as part of the curriculum of academic year 2023-27 and was developed during an industry internship at **Atmohive Biotech, HBTU Kanpur** under the industry supervision of **Mr. Mohit Nigam**.

The work presented in this project is original and has not been submitted for any other degree or diploma.

**Dr. Ausaf Ahmad**  
**Faculty Guide**

---

## ACKNOWLEDGEMENT

The satisfaction that accompanies the successful completion of any task would be incomplete without the mention of people whose ceaseless cooperation made it possible, whose constant guidance and encouragement crown all efforts with success.

I would like to thank the Head of AIB Department and Amity University for giving me the opportunity to undertake this project. I extend my heartfelt gratitude to my faculty guide **Dr. Ausaf Ahmad** who has been the biggest driving force behind my successful completion of the project.

Special thanks to my industry guide **Mr. Mohit Nigam** from **Atmohive Biotech** for providing me with the opportunity to work as a **Full Stack Developer and AI/ML Developer intern** at **HBTU Kanpur, UP, India**. His industry expertise and practical guidance were invaluable in developing this commercial-grade SaaS platform.

I would also like to thank my batchmates who guided me, helped me, and gave ideas and motivation at each step of this journey.

---

## TABLE OF CONTENTS

| Content | Page Number |
|---------|-------------|
| Abstract | 7 |
| Introduction | 8 |
| Literature Review | 9 |
| Technology Stack | 10-11 |
| System Architecture | 12 |
| Implementation | 13-14 |
| Features and Functionality | 15-16 |
| Testing and Deployment | 17 |
| Results and Achievements | 18 |
| Challenges and Solutions | 19 |
| Future Scope | 20 |
| Conclusion | 21 |
| References | 22 |

---

## ABSTRACT

The **GeneInsight Platform** is a comprehensive Software-as-a-Service (SaaS) bioinformatics application developed to revolutionize genetic analysis and molecular visualization. This project represents a complete commercial-grade platform that combines cutting-edge artificial intelligence with advanced 3D molecular rendering capabilities.

Built using modern web technologies including **Next.js 15**, **Spring Boot 3.2**, and **Python Flask**, the platform provides multi-tenant architecture with subscription-based billing, making it suitable for commercial deployment. The application supports comprehensive analysis of DNA, RNA, and protein sequences with real-time 3D structure visualization powered by **3DMol.js**.

Key achievements include successful deployment on **Vercel** with 14 static pages, implementation of JWT-based authentication, integration of machine learning models for sequence analysis, and development of a complete SaaS infrastructure with usage tracking and billing management. The platform demonstrates practical application of bioinformatics algorithms, modern software architecture patterns, and commercial software development practices.

This project was developed during an internship at **Atmohive Biotech, HBTU Kanpur** as a **Full Stack Developer and AI/ML Developer**, showcasing the integration of academic knowledge with industry-standard development practices.

---

## INTRODUCTION

Bioinformatics has emerged as a critical field at the intersection of biology, computer science, and data analysis. The exponential growth of genomic data requires sophisticated tools for sequence analysis, structure prediction, and molecular visualization. Traditional bioinformatics tools often lack modern user interfaces, scalable architecture, and commercial viability.

The **GeneInsight Platform** addresses these challenges by providing a comprehensive SaaS solution that democratizes access to advanced bioinformatics capabilities. Unlike traditional desktop applications, this web-based platform offers:

- **Universal Accessibility**: Browser-based interface accessible from any device
- **Scalable Architecture**: Multi-tenant SaaS design supporting multiple users
- **Advanced Visualization**: Hardware-accelerated 3D molecular rendering
- **AI-Powered Analysis**: Machine learning models for enhanced sequence analysis
- **Commercial Viability**: Subscription-based billing with usage tracking

The platform serves researchers, students, and biotechnology professionals by providing an intuitive interface for complex bioinformatics operations, making advanced genetic analysis accessible to users regardless of their technical background.

---

## LITERATURE REVIEW

The field of bioinformatics software has evolved significantly over the past decades. Traditional tools like **BLAST**, **ClustalW**, and **PyMOL** have been foundational but often require specialized knowledge and local installations.

Recent developments in web-based bioinformatics include platforms like **Galaxy Project** and **Bioconductor**, which provide workflow management and analysis pipelines. However, these platforms often lack modern user interfaces and commercial deployment capabilities.

The emergence of **Software-as-a-Service (SaaS)** models in biotechnology has created opportunities for more accessible and scalable bioinformatics solutions. Companies like **DNAnexus** and **Seven Bridges** have demonstrated the commercial viability of cloud-based genomics platforms.

**3D molecular visualization** has been revolutionized by web-based libraries like **3DMol.js**, **NGL Viewer**, and **ChemDoodle Web Components**, enabling hardware-accelerated rendering in web browsers without plugin requirements.

**Machine learning applications** in bioinformatics have shown promising results in protein structure prediction (**AlphaFold**), sequence classification, and functional annotation. The integration of ML models into web platforms represents a significant advancement in making AI-powered analysis accessible.

This literature review informed the design decisions for GeneInsight Platform, emphasizing the need for a modern, accessible, and commercially viable bioinformatics solution.

---

## TECHNOLOGY STACK

### Frontend Technologies
- **Next.js 15**: React-based framework with TypeScript for type-safe development
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **3DMol.js**: Hardware-accelerated 3D molecular visualization library
- **Radix UI**: Accessible component library for modern user interfaces
- **React Hook Form**: Form management with validation
- **Recharts**: Data visualization and charting library

### Backend Technologies
- **Spring Boot 3.2**: Enterprise-grade Java framework with Java 17
- **MySQL 8.0**: Relational database for data persistence
- **Redis**: In-memory caching and session management
- **JWT Authentication**: Secure token-based authentication
- **Spring Security**: Comprehensive security framework
- **Swagger/OpenAPI**: API documentation and testing

### Machine Learning Service
- **Python 3.11**: Core programming language for ML operations
- **Flask**: Lightweight web framework for ML API
- **Scikit-learn**: Machine learning algorithms and tools
- **NumPy & Pandas**: Data processing and numerical computing
- **BioPython**: Bioinformatics-specific Python libraries
- **TensorFlow & PyTorch**: Deep learning frameworks

### SaaS Infrastructure
- **Multi-tenant Database Design**: Isolated data for different organizations
- **Stripe Integration**: Payment processing and subscription management
- **Usage Tracking System**: Real-time monitoring of resource consumption
- **Role-based Access Control**: Granular permission management
- **Docker Containerization**: Consistent deployment across environments

### Deployment and DevOps
- **Vercel**: Serverless deployment platform for frontend
- **Docker Compose**: Multi-container application orchestration
- **Nginx**: Reverse proxy and load balancing
- **GitHub Actions**: Continuous integration and deployment
- **Environment Configuration**: Secure configuration management
