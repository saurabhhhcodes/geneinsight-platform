# 🛠️ Development Guide

This guide will help you set up the GeneInsight Platform for development, whether you're a beginner or experienced developer.

## 🎯 Prerequisites

### Required Software
1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **Git** - [Download here](https://git-scm.com/)
3. **Code Editor** - We recommend [VS Code](https://code.visualstudio.com/)

### Optional (for advanced features)
- **Java 17+** - For backend development
- **MySQL** - For database features

## 🚀 Quick Setup (5 minutes)

### 1. Clone the Repository
```bash
# Using HTTPS
git clone https://github.com/8packcoder/geneinsight-platform.git

# Or using SSH (if you have SSH keys set up)
git clone git@github.com:8packcoder/geneinsight-platform.git

cd geneinsight-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
Visit [http://localhost:3000](http://localhost:3000)

🎉 **That's it!** You should see the GeneInsight Platform running locally.

## 📁 Understanding the Project Structure

```
geneinsight-platform/
├── 📁 app/                    # Main application code (Next.js 13+ App Router)
│   ├── 📁 api/               # Backend API routes (serverless)
│   │   ├── 📁 analysis/      # DNA analysis endpoints
│   │   ├── 📁 auth/          # User authentication
│   │   └── 📁 health/        # System health checks
│   ├── 📁 analyze-enhanced/  # DNA analysis page
│   ├── 📁 demo/             # Demo and examples
│   ├── 📁 visualize/        # 3D molecular visualization
│   ├── 📄 layout.tsx        # Root layout (navigation, etc.)
│   └── 📄 page.tsx          # Home page
├── 📁 components/            # Reusable UI components
├── 📁 public/               # Static files (images, icons)
├── 📄 package.json          # Project dependencies
├── 📄 next.config.js        # Next.js configuration
└── 📄 tailwind.config.js    # Styling configuration
```

## 🔧 Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for TypeScript errors
npm run type-check

# Run code linting
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

## 🎨 Making Your First Change

Let's make a simple change to see how development works:

### 1. Edit the Home Page
Open `app/page.tsx` and find this line:
```tsx
<h1 className="text-4xl font-bold text-center mb-8">
  Welcome to GeneInsight Platform
</h1>
```

Change it to:
```tsx
<h1 className="text-4xl font-bold text-center mb-8">
  Welcome to GeneInsight Platform - Modified by [Your Name]
</h1>
```

### 2. Save and See Changes
Save the file and check your browser - the changes should appear automatically!

### 3. Commit Your Changes
```bash
git add .
git commit -m "Update: personalize welcome message"
```

## 🧪 Testing Your Changes

### Manual Testing Checklist
- [ ] Home page loads correctly
- [ ] Navigation works on all pages
- [ ] DNA analysis form accepts input
- [ ] 3D visualization displays molecules
- [ ] Mobile responsive design works
- [ ] No console errors in browser

### Automated Testing
```bash
# Run all tests (when available)
npm test

# Run tests in watch mode
npm run test:watch
```

## 🐛 Common Issues & Solutions

### Issue: "npm install" fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use
**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001

# Or kill the process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Issue: TypeScript errors
**Solution:**
```bash
# Check what's wrong
npm run type-check

# Common fixes:
# 1. Add missing type definitions
# 2. Fix import statements
# 3. Add proper TypeScript types
```

## 🎯 Development Workflow

### For New Features
1. **Create a branch**: `git checkout -b feature/your-feature`
2. **Make changes**: Edit code, test locally
3. **Commit changes**: `git commit -m "Add: your feature"`
4. **Push branch**: `git push origin feature/your-feature`
5. **Create Pull Request**: On GitHub

### For Bug Fixes
1. **Create a branch**: `git checkout -b fix/bug-description`
2. **Fix the bug**: Make necessary changes
3. **Test thoroughly**: Ensure bug is fixed
4. **Commit and push**: Follow same process as features

## 🔍 Key Technologies

### Frontend
- **Next.js 15** - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **3DMol.js** - 3D molecular visualization

### Backend (API Routes)
- **Next.js API Routes** - Serverless functions
- **JWT** - Authentication tokens
- **Node.js** - JavaScript runtime

### Deployment
- **Vercel** - Hosting platform
- **GitHub** - Version control and CI/CD

## 📚 Learning Resources

### For Beginners
- [Next.js Tutorial](https://nextjs.org/learn)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### For Bioinformatics
- [3DMol.js Documentation](https://3dmol.csb.pitt.edu/)
- [PDB File Format](https://www.wwpdb.org/documentation/file-format)
- [Bioinformatics Algorithms](https://www.bioinformaticsalgorithms.org/)

## 🤝 Getting Help

### Before Asking for Help
1. Check this documentation
2. Search existing GitHub issues
3. Try the common solutions above

### Where to Get Help
- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and general help
- **Code Comments** - Many functions have helpful comments

### When Asking for Help
Include:
- What you're trying to do
- What you expected to happen
- What actually happened
- Your operating system and Node.js version
- Any error messages (full text)

## 🏆 Best Practices

### Code Quality
- Write clear, descriptive variable names
- Add comments for complex logic
- Keep functions small and focused
- Use TypeScript types properly

### Git Practices
- Write clear commit messages
- Make small, focused commits
- Test before committing
- Keep branches up to date

### Performance
- Optimize images before adding them
- Use lazy loading for heavy components
- Minimize bundle size
- Test on slower devices/connections

Happy coding! 🚀
