/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'chatterbox.com', 'supabase.co'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
