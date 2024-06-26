/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'ru', 'az','tr'],
    defaultLocale: 'az',
    localeDetection: false
  },
  images: {
    domains: ['nehre.codio.az','nehre.vercel.app', 'via.placeholder.com'],
  },
};

module.exports = nextConfig