/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker: bundles only the files the server needs into .next/standalone.
  output: 'standalone',
  images: {
    // Product images come from the API host and external URLs.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
  },
};

module.exports = nextConfig;
