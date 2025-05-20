/** @type {import('next').NextConfig} */
const nextConfig = {
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/:path*', // 当你请求 /api/xxx
    //             destination: 'http://192.168.1.191:8080/:path*', // 实际代理到后端 API
    //         },
    //     ];
    // },
};

module.exports = nextConfig;
