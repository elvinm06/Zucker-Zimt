/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker: bundles only the files the server needs into .next/standalone.
  output: 'standalone',
  images: {
    // AVIF first — noticeably smaller than WebP; browsers without it get WebP.
    formats: ['image/avif', 'image/webp'],
    // Məhsul şəkilləri xarici hostlardan gəldiyi üçün icazə veririk.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

module.exports = nextConfig;
