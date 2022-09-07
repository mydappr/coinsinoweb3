import { useRecoilState } from "recoil";
import { lotteryStatus as Lstatus } from "../../atoms/atoms";
import OperatorFunctions from "../../components/OperatorFunctions";

export default async function handler(req, res) {
  const drandres = await fetch("https://randomnumber.willdera.repl.co/fetch");
  const rngData = await drandres.json();
  const { startLottery, closeLottery, drawLottery } = OperatorFunctions(
    process.env.opkey,
    rngData
  );

  const operatorProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
      // operator signer and contract
      const operatorSigner = new ethers.Wallet(keys.opkey, operatorProvider);
      const managedSigner = new NonceManager(operatorSigner);
      const operatorcoinSinoContract = new ethers.Contract(
        coinSinoContractAddress,
        Sinoabi,
        operatorSigner
      );

      const RNGContract = new ethers.Contract(
        rngContractaddress,
        Rngabi,
        managedSigner
      );

      console.log(rngData);

      // const lastround = await RNGContract.getLastRound();
      if (!rngData.round) return;
           // current lotteryid
           const latestLotteryId = Number(
            await operatorcoinSinoContract.viewCurrentLotteryId()
          );

          
  await startLottery();
  await closeLottery();
  await drawLottery();

  res.status(200).json({
    message: `lottery round completed }`,
  });
}
