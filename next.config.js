/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/:path*",
      }
    ]
  },
  images: {
    domains: ["avatars.akamai.steamstatic.com"],
  },
}

module.exports = nextConfig
