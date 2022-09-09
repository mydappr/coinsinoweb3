import { ethers } from "ethers";
import {} from "dotenv/config";
import { useRecoilState } from "recoil";
import { lotteryStatus as Lstatus } from "../../atoms/atoms";
import OperatorFunctions from "../../components/OperatorFunctions";
import { NonceManager } from "@ethersproject/experimental";
import Sinoabi from "../../utils/Coinsino.json";
const coinSinoContractAddress = "0xdC9d2bBb598169b370F12e45D97258dd34ba19C0";

export default async function handler(req, res) {
  const drandres = await fetch("https://randomnumber.willdera.repl.co/fetch");
  const rngData = await drandres.json();
  const { startLottery, closeLottery, drawLottery } = OperatorFunctions(
    process.env.opkey,
    rngData
  );

  const operatorProvider = new ethers.providers.JsonRpcProvider(
    "https://testnet.telos.net/evm"
  );

  // operator signer and contract
  const operatorSigner = new ethers.Wallet(process.env.opkey, operatorProvider);
  const managedSigner = new NonceManager(operatorSigner);

  const operatorcoinSinoContract = new ethers.Contract(
    coinSinoContractAddress,
    Sinoabi,
    operatorSigner
  );

  // current lotteryid
  const latestLotteryId = Number(
    await operatorcoinSinoContract.viewCurrentLotteryId()
  );

  // await startLottery();
  // await closeLottery();
  // await drawLottery();

  console.log(await startLottery());

  res.status(200).json({
    message: `current LotteryId ${latestLotteryId} }`,
  });
}
