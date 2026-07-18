/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker: bundles only the files the server needs into .next/standalone.
  output: 'standalone',
  images: {
    // Məhsul şəkilləri xarici hostlardan gəldiyi üçün icazə veririk.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

module.exports = nextConfig;
