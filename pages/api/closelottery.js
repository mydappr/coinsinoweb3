import { ethers } from "ethers";
<<<<<<< HEAD:pages/api/ScheduledFunctions.js
import {} from "dotenv/config";
import { useRecoilState } from "recoil";
import { lotteryStatus as Lstatus } from "../../atoms/atoms";
=======
>>>>>>> ecb7050ea67cef57ac107ed1e733f7733cb6cd18:pages/api/closelottery.js
import OperatorFunctions from "../../components/OperatorFunctions";
import { NonceManager } from "@ethersproject/experimental";
import Sinoabi from "../../utils/Coinsino.json";
const coinSinoContractAddress = "0xdC9d2bBb598169b370F12e45D97258dd34ba19C0";

export default async function handler(req, res) {
  const drandres = await fetch("https://randomnumber.willdera.repl.co/fetch");
  const rngData = await drandres.json();
  const { closeLottery } = OperatorFunctions(rngData);

<<<<<<< HEAD:pages/api/ScheduledFunctions.js
=======
  // operator provider,and signer
>>>>>>> ecb7050ea67cef57ac107ed1e733f7733cb6cd18:pages/api/closelottery.js
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
  if (status !== 1) {
    console.log("status is not 1");
    return;
  }

<<<<<<< HEAD:pages/api/ScheduledFunctions.js
  // await startLottery();
  // await closeLottery();
  // await drawLottery();

  console.log(await startLottery());
=======
  await closeLottery();
>>>>>>> ecb7050ea67cef57ac107ed1e733f7733cb6cd18:pages/api/closelottery.js

  res.status(200).json({
    message: `Lottery ${latestLotteryId} closed  successfully!  }`,
  });
}
