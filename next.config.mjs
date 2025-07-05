/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output for Vercel deployment to fix edge runtime warning
  // output: 'standalone',

  transpilePackages: ['lucide-react'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },

  // Optimize for production
  compress: true,

  // Environment variables - use relative URLs for self-contained Next.js app
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },

  // Server external packages
  serverExternalPackages: ['3dmol'],
}

export default nextConfig
