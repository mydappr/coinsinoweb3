// import jwt from "jsonwebtoken";
// import { app, database } from "./Firebase";
// import { doc, getDoc } from "firebase/firestore";

// export default async function handler(req, res) {
//   try {
//     const authorization_key = req.headers.authorization;
//     const docRef = doc(database, "authorization", authorization_key);
//     const docSnap = await getDoc(docRef);

//     // sign data
//     const signature = jwt.sign(docSnap.data(), process.env.jwt_secret);

//     return res.status(200).json({
//       data: docSnap.data(),
//       signature,
//     });
//   } catch (error) {
//     return res.status(400).json({ Error: "Something went wrong" });
//   }
//   console.log(
//     "-----------------------------------------------------------------------------"
//   );

//   const value = req.headers.accesstoken;
//   console.log(value);

//   const decode = jwt.decode(value);
//   console.log("Decoded: ", decode);

//   res.status(200).json({
//     opkey: process.env.opkey,
//     injkey: process.env.injkey,
//     treakey: process.env.treakey,
//   });
// }
