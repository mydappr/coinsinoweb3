import { ethers } from "ethers";
import OperatorFunctions from "../../components/OperatorFunctions";
import { NonceManager } from "@ethersproject/experimental";
import Sinoabi from "../../utils/Coinsino.json";

import jwt from "jsonwebtoken";
import { app, database } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";
const coinSinoContractAddress = "0xdC9d2bBb598169b370F12e45D97258dd34ba19C0";

export default async function handler(req, res) {
  try {
    const authorization_key = req.headers.authorization;

    console.log(authorization_key);
    const docRef = doc(database, "authorization", authorization_key);
    const docSnap = await getDoc(docRef);

    console.log("snapshot gotten");
    // verify token
    const data = docSnap.data();
    const verification = jwt.verify(data.token, process.env.jwt_secret);

    // check if roles from data and verification are correct

    if (data.role !== verification.role) return;
  } catch (error) {
    return res.status(400).json({ Error: "Not Authorized!" });
  }

  try {
    // console.log("starting");
    // const drandres = await fetch("https://randomnumber.willdera.repl.co/fetch");
    // const rngData = await drandres.json();
    // console.log(rngData)
    const { startLottery } = OperatorFunctions();

    // operator provider,and signer
    const operatorProvider = new ethers.providers.JsonRpcProvider(
      "https://testnet.telos.net/evm"
    );

    // operator signer and contract
    const operatorSigner = new ethers.Wallet(
      process.env.opkey,
      operatorProvider
    );
    const managedSigner = new NonceManager(operatorSigner);
    const operatorcoinSinoContract = new ethers.Contract(
      coinSinoContractAddress,
      Sinoabi,
      managedSigner
    );

    console.log("before lotteryid");

    // current lotteryid
    const latestLotteryId = Number(
      await operatorcoinSinoContract.viewCurrentLotteryId()
    );
    // current lottery details
    const getLotterystatus = await operatorcoinSinoContract.viewLottery(
      latestLotteryId
    );

    // current lottery status
    const { status } = getLotterystatus;

    if (status === 3 || status === 0) {
      await startLottery();
      return res.status(200).json({
        message: ` LotteryId started with id ${latestLotteryId} `,
      });
    } else {
      return res.status(400).json({
        message: ` lottery not ready to be started`,
      });
    }
  } catch (error) {}
}
