/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  env: {
    opkey: process.env.opkey,
    injkey: process.env.injkey,
    treakey: process.env.treakey,
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId,
    jwt_secret: process.env.jwt_secret,
  },
  productionBrowserSourceMaps: false,
  images: {
    loader: "akamai",
    path: "",
  },
  basePath: "/coinsinoweb3",
  assetPrefix: "/coinsinoweb3",

  // exportPathMap: async function (
  //   defaultPathMap,
  //   { dev, dir, outDir, distDir, buildId }
  // ) {
  //   return {
  //     "/": { page: "/" },

  //     "/faq": { page: "/faq" },
  //     "/api/entry": { page: "/api/entry" },
  //     "/api/winners": { page: "/api/winners" },
  //     "/api/oddPool": { page: "/api/oddPool" },
  //   };
  // },
};

module.exports = nextConfig;
