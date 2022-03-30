/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
    esmExternals: true,
  },
};

module.exports = nextConfig;
