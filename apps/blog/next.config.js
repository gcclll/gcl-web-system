const withTM = require('next-transpile-modules')(['@aftt/react-ui', '@aftt/shared-utils']);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  swcMinify: true,
  // experimental: {
  //   urlImports: [
  //     'https://framer.com/m/',
  //     'https://framerusercontent.com/',
  //     'https://ga.jspm.io/',
  //     'https://jspm.dev/',
  //   ],
  // },
});

module.exports = nextConfig;
