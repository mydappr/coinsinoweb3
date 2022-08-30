// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default function handler(req, res) {
//   res.status(200).json({
//     opkey: process.env.opkey,
//     injkey: process.env.injkey,
//     treakey: process.env.treakey,
//   });
// }

import Client, { HTTP } from "drand-client";

export default async function handler(req, res) {
  const chainHash =
    "8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce"; // (hex encoded)

  const urls = [
    "https://api.drand.sh",
    "https://drand.cloudflare.com",
    // ...
  ];
  const options = { chainHash };
  const client = await Client.wrap(HTTP.forURLs(urls, chainHash), options);
  const rest = await client.get(); // gets the latest randomness round

  res.status(200).json(rest);
}