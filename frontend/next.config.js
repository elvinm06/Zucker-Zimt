/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Məhsul şəkilləri xarici hostlardan gəldiyi üçün icazə veririk.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

module.exports = nextConfig;
