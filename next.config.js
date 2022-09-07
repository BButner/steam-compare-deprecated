/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.steamcompare.games/:path*",
      }
    ]
  },
}

module.exports = nextConfig
