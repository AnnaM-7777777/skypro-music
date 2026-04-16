/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/music/main',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;