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
  images: {
    domains: ["avatars.akamai.steamstatic.com", "media.steampowered.com", "steamcdn-a.akamaihd.net"],
  },
}

module.exports = nextConfig
