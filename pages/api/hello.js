 

export default function handler(req, res) {
  res.status(200).json({
    opkey: process.env.opkey,
    injkey: process.env.injkey,
    treakey: process.env.treakey,
  });
}
 

 
