import Sinoabi from "../utils/Coinsino.json";
import Rngabi from "../utils/RNGabi.json";
import { ethers } from "ethers";
import moment from "moment";
import { useRecoilState } from "recoil";
import { latestLotteryId } from "../atoms/atoms";
import { NonceManager } from "@ethersproject/experimental";

function OperatorFunctions(keys) {
  const [currentLotteryId, setCurrentLotteryId] =
    useRecoilState(latestLotteryId);

  // drand
  const data = {
    round: 1,
    randomness:
      "7621935dbd01816416f0458f1b129b4d6b4c34ab0e53cbf70dfafbd4fed0efb6",
    signature:
      "8777102f74b8a55d3c84e7e1331f3d507f5d3bc091fdb0378ea40285479aaed4b19be5c73da3e790f3fb6bc54c74ef2902ef7b11fc21ebd6c497f8eb8c0d75a5ced4596cd5cb806b78650949974a69e5669222af6c0d20efd7958acce517ef4f",
    previous_signature:
      "aea7024808de545930c1267fba13d9180bde3f543e4e4b646a05fb50d1b0a20ca4f5c27bfaf80b69d6ec4584b8d1cc26168b9091f784eadace5fe3d04115784348bac4585222c2768abfebf09fa05bce9e84908daebbd2cb7d5c0680fb1b13b5",
  };

  // helper hex converter
  async function convertHexToInt(hex) {
    return parseInt(hex, 16);
  }
  // time helper funciton
  async function convertInput(date) {
    const splitDate = date.split(" ");
    const value = parseInt(splitDate[0]);
    const interval = splitDate[1];
    const epoch = moment(new Date()).add(value, interval).toDate();
    const _epoch = moment(epoch).unix();
    return _epoch;
  }

  const pricePerTicket = "3";

  // coinsino contract address
  const coinSinoContractAddress = "0xb8b3E281DfcaF7afDee4EDC29b44e52C3D628d1e";
  // rng contract address
  const rngContractaddress = "0x2C5c6A061ceD5435A547ad8219f7a7A48C5AF672";

  const startLottery = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // signers wallet get smartcontract

        const provider = new ethers.providers.Web3Provider(ethereum);
        // operator signer and contract
        const operatorSigner = new ethers.Wallet(keys.opkey, provider);
        const managedSigner = new NonceManager(operatorSigner);

        const operatorcoinSinoContract = new ethers.Contract(
          coinSinoContractAddress,
          Sinoabi,
          managedSigner
        );
        const lottryDuration = await convertInput("5 minutes");
        // start a lottery
        const startLottery = await operatorcoinSinoContract.startLottery(
          lottryDuration,
          ethers.utils.parseUnits(pricePerTicket, "ether"),
          300,
          [500, 960, 1430, 1910, 2390, 2810],
          1000
        );

        await startLottery;

        console.log("lottery started");
        // get current lottery id
      }
    } catch (error) {
      console.log("Error minting character", error);
      // setTxError(error.message);
    }
  };

  const closeLottery = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // signers wallet get smartcontract
        const provider = new ethers.providers.Web3Provider(ethereum);
        // operator signer and contract
        const operatorSigner = new ethers.Wallet(keys.opkey, provider);
        const managedSigner = new NonceManager(operatorSigner);
        const operatorcoinSinoContract = new ethers.Contract(
          coinSinoContractAddress,
          Sinoabi,
          managedSigner
        );

        const RNGContract = new ethers.Contract(
          rngContractaddress,
          Rngabi,
          operatorSigner
        );

        const lastround = await RNGContract.getLastRound();
        await operatorcoinSinoContract.closeLottery(
          currentLotteryId,
          lastround === 0 ? lastround + 1 : lastround
        );

        console.log("closed");
      }
    } catch (error) {
      console.log("Error minting character", error);
    }
  };

  // draw lottery
  const drawLottery = async () => {
    console.log("drawing lottery");
    try {
      const { ethereum } = window;
      if (ethereum) {
        // signers wallet get smartcontract
        const provider = new ethers.providers.Web3Provider(ethereum);
        const operatorSigner = new ethers.Wallet(keys.opkey, provider);
        const managedSigner = new NonceManager(operatorSigner);
        const operatorcoinSinoContract = new ethers.Contract(
          coinSinoContractAddress,
          Sinoabi,
          managedSigner
        );

        const RNGContract = new ethers.Contract(
          rngContractaddress,
          Rngabi,
          operatorSigner
        );
        // set random value

        const lastround = await RNGContract.getLastRound();

        console.log(lastround, "last round");

        await RNGContract.setRandomValue(
          lastround === 0 ? lastround + 1 : lastround,
          data.randomness,
          data.signature,
          data.previous_signature
        );

        const drawFinalNumberAndMakeLotteryClaimable =
          await operatorcoinSinoContract.drawFinalNumberAndMakeLotteryClaimable(
            currentLotteryId,
            false,
            lastround === 0 ? lastround + 1 : lastround
          );

        await drawFinalNumberAndMakeLotteryClaimable.wait();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { startLottery, closeLottery, drawLottery };
}

export default OperatorFunctions;
