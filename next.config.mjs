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

  // Environment variables - use Replit backend URL
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://6d441999-17f0-47ac-94c8-e10957d4469c-00-1aa6zmzvlz1jf.pike.replit.dev',
  },

  // Server external packages
  serverExternalPackages: ['3dmol'],
}

export default nextConfig
