import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    
    async rewrites() {
        return [
            {
                source: '/api/media/:path*',
                destination: 'https://webdev-music-003b5b991590.herokuapp.com/media/:path*',
            },
        ];
    },
    // Иногда нужно отключить строгую проверку происхождения для прокси
    reactStrictMode: true,
};

export default nextConfig;

