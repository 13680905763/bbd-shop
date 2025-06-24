import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        turbo: {}, // 👈 禁用 turbopack！
    },
};

export default withNextIntl(nextConfig);
