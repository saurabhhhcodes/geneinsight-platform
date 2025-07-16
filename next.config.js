/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://6d441999-17f0-47ac-94c8-e10957d4469c-00-1aa6zmzvlz1jf.pike.replit.dev',
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://6d441999-17f0-47ac-94c8-e10957d4469c-00-1aa6zmzvlz1jf.pike.replit.dev',
    NEXT_PUBLIC_LANGCHAIN_ENABLED: process.env.NEXT_PUBLIC_LANGCHAIN_ENABLED || 'true'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://6d441999-17f0-47ac-94c8-e10957d4469c-00-1aa6zmzvlz1jf.pike.replit.dev/:path*'
      }
    ]
  }
}

module.exports = nextConfig
