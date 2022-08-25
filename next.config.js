/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  env: {
    opkey: process.env.opkey,
    injkey: process.env.injkey,
    treakey: process.env.treakey,
  },
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
