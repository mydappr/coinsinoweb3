import { ethers } from "ethers";
import OperatorFunctions from "../../components/OperatorFunctions";
import { NonceManager } from "@ethersproject/experimental";
import Sinoabi from "../../utils/Coinsino.json";
const coinSinoContractAddress = "0xdC9d2bBb598169b370F12e45D97258dd34ba19C0";

export default async function handler(req, res) {
  const drandres = await fetch("https://randomnumber.willdera.repl.co/fetch");
  const rngData = await drandres.json();
  const { startLottery, closeLottery, drawLottery } =
    OperatorFunctions(rngData);

  // operator provider,and signer
  const operatorProvider = new ethers.providers.JsonRpcProvider(
    "https://testnet.telos.net/evm"
  );

  // operator signer and contract
  const operatorSigner = new ethers.Wallet(process.env.opkey, operatorProvider);
  const managedSigner = new NonceManager(operatorSigner);
  const operatorcoinSinoContract = new ethers.Contract(
    coinSinoContractAddress,
    Sinoabi,
    managedSigner
  );

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
  if (status !== 2) {
    console.log('status is not 2')
    return
  };

  await drawLottery();

  res.status(200).json({
    message: `Lottery ${latestLotteryId} closed  drawn!  }`,
  });
}
