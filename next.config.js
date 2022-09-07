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
    domains: ["avatars.akamai.steamstatic.com", "media.steampowered.com", "steamcdn-a.akamaihd.net"],
  },
}

module.exports = nextConfig
