#!/usr/bin/env node

/**
 * 🚀 GeneInsight Platform - Deployment Checker
 * 
 * This script helps check the deployment status and common issues
 */

const https = require('https');
const fs = require('fs');

console.log('🧬 GeneInsight Platform - Deployment Checker');
console.log('===========================================\n');

// Common Vercel deployment URLs to check
const possibleUrls = [
  'https://geneinsight-platform.vercel.app',
  'https://geneinsight-platform-8packcoder.vercel.app',
  'https://geneinsight-platform-git-main-8packcoder.vercel.app',
  'https://geneinsight-platform-8packcoders-projects.vercel.app'
];

function checkUrl(url) {
  return new Promise((resolve) => {
    console.log(`🔍 Checking: ${url}`);
    
    const request = https.get(url, (response) => {
      console.log(`✅ Status: ${response.statusCode} - ${url}`);
      resolve({ url, status: response.statusCode, success: true });
    });
    
    request.on('error', (error) => {
      console.log(`❌ Error: ${error.message} - ${url}`);
      resolve({ url, error: error.message, success: false });
    });
    
    request.setTimeout(10000, () => {
      console.log(`⏰ Timeout: ${url}`);
      request.destroy();
      resolve({ url, error: 'Timeout', success: false });
    });
  });
}

async function checkAllUrls() {
  console.log('🔍 Checking possible deployment URLs...\n');
  
  const results = [];
  for (const url of possibleUrls) {
    const result = await checkUrl(url);
    results.push(result);
    console.log(''); // Add spacing
  }
  
  console.log('📊 Results Summary:');
  console.log('==================');
  
  const working = results.filter(r => r.success && r.status === 200);
  const errors = results.filter(r => !r.success);
  
  if (working.length > 0) {
    console.log('\n✅ Working Deployments:');
    working.forEach(r => console.log(`   ${r.url}`));
  }
  
  if (errors.length > 0) {
    console.log('\n❌ Failed URLs:');
    errors.forEach(r => console.log(`   ${r.url} - ${r.error}`));
  }
  
  if (working.length === 0) {
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Check your Vercel dashboard for deployment status');
    console.log('2. Verify the repository is connected to Vercel');
    console.log('3. Check if there are any build errors in Vercel logs');
    console.log('4. Ensure environment variables are set correctly');
    console.log('5. Try triggering a manual deployment');
  }
  
  return working;
}

// Check build configuration
function checkBuildConfig() {
  console.log('\n🔧 Checking Build Configuration:');
  console.log('================================');
  
  // Check package.json
  if (fs.existsSync('package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log(`✅ Package.json exists`);
    console.log(`   Name: ${pkg.name}`);
    console.log(`   Version: ${pkg.version}`);
    console.log(`   Build script: ${pkg.scripts?.build || 'Not found'}`);
  } else {
    console.log('❌ package.json not found');
  }
  
  // Check vercel.json
  if (fs.existsSync('vercel.json')) {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    console.log(`✅ vercel.json exists`);
    console.log(`   Framework: ${vercelConfig.framework || 'Not specified'}`);
    console.log(`   Build command: ${vercelConfig.buildCommand || 'Default'}`);
  } else {
    console.log('⚠️  vercel.json not found (using defaults)');
  }
  
  // Check Next.js config
  if (fs.existsSync('next.config.js') || fs.existsSync('next.config.mjs')) {
    console.log(`✅ Next.js config exists`);
  } else {
    console.log('⚠️  Next.js config not found (using defaults)');
  }
}

// Main execution
async function main() {
  try {
    checkBuildConfig();
    const workingUrls = await checkAllUrls();
    
    if (workingUrls.length > 0) {
      console.log('\n🎉 Deployment Found!');
      console.log(`🌐 Your app is live at: ${workingUrls[0].url}`);
      console.log('\n🧪 Next Steps:');
      console.log('1. Test all features on the live deployment');
      console.log('2. Check browser console for any errors');
      console.log('3. Test API endpoints');
      console.log('4. Verify 3D visualization works');
      console.log('5. Test authentication system');
    } else {
      console.log('\n🔍 No working deployment found.');
      console.log('\n📋 Manual Deployment Steps:');
      console.log('1. Go to https://vercel.com/dashboard');
      console.log('2. Find your geneinsight-platform project');
      console.log('3. Click "View Function Logs" to check for errors');
      console.log('4. Try "Redeploy" if needed');
      console.log('5. Check environment variables are set');
    }
    
  } catch (error) {
    console.error('❌ Error running deployment checker:', error.message);
  }
}

main();
