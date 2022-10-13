import Sinoabi from "../utils/Coinsino.json";
import Rngabi from "../utils/RNGabi.json";
import { ethers } from "ethers";
import moment from "moment";
import { useRecoilState } from "recoil";
import {
  latestLotteryId,
  lotteryStatus as Lstatus,
  drandData,
  timeCountDown,
  endLotteryTime,
} from "../atoms/atoms";
import { NonceManager } from "@ethersproject/experimental";

import { useEffect, useState } from "react";
import transformer from "../utils/Helper/helper";
const Pending = 0;
const Open = 1;
const closed = 2;
const claimable = 3;

function OperatorFunctions() {
  console.log(
    "----------------------------------------------------starting----------------------------------------------------"
  );
  // const [currentLotteryId, setCurrentLotteryId] =
  //   useRecoilState(latestLotteryId);
  // const [lotteryStatus, setlotteryStatus] = useRecoilState(Lstatus);
  // const [rngData, setrngData] = useRecoilState(drandData);
  // const [countDown, setCoundown] = useRecoilState(timeCountDown);
  // const [endTime, setEndTime] = useRecoilState(endLotteryTime);

  // rng not working

  // console.log(countDown);
  // console.log(currentLotteryId, "id");
  // console.log(lotteryStatus, "status");
  // console.log(endTime, "endTime");

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
  const coinSinoContractAddress = "0x7040d32de6f003c9A9BFBEadE10Ce85B911F0F1c";
  // rng contract address
  const rngContractaddress = "0xB7a02D612Dfd4AFbC52571645a152F15eB9e5868";
  const rpcUrl = "https://testnet.telos.net/evm";

  // operator provider, signer and coinsino contract instance
  const operatorProvider = new ethers.providers.JsonRpcProvider(rpcUrl);

  // operator signer and contract
  const operatorSigner = new ethers.Wallet(process.env.opkey, operatorProvider);
  const managedSigner = new NonceManager(operatorSigner);
  const operatorcoinSinoContract = new ethers.Contract(
    coinSinoContractAddress,
    Sinoabi,
    managedSigner
  );

  const startLottery = async () => {
    console.log("starting from operatorfuncs");

    try {
      // signers wallet get smartcontract
      // const operatorProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
      // // operator signer and contract

      // const operatorSigner = new ethers.Wallet(
      //   process.env.opkey,
      //   operatorProvider
      // );
      // const managedSigner = new NonceManager(operatorSigner);

      // const operatorcoinSinoContract = new ethers.Contract(
      //   coinSinoContractAddress,
      //   Sinoabi,
      //   managedSigner
      // );
      const lottryDuration = await convertInput("478 mintues");

      // start a lottery
      const startLottery = await operatorcoinSinoContract.startLottery(
        lottryDuration,
        ethers.utils.parseUnits(pricePerTicket, "ether"),
        2000,
        [500, 960, 1430, 1910, 2390, 2810],
        1000
      );
      console.log("asigned start");

      await startLottery;

      console.log("lottery started");
      // get current lottery id
    } catch (error) {
      console.log("Error minting character", error);
      // setTxError(error.message);
    }
  };

  const closeLottery = async (rngData, latestLotteryId) => {
    try {
      console.log("closing lottery from operafunc");
      // const operatorProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
      // // operator signer and contract
      // const operatorSigner = new ethers.Wallet(
      //   process.env.opkey,
      //   operatorProvider
      // );
      // const managedSigner = new NonceManager(operatorSigner);
      // const operatorcoinSinoContract = new ethers.Contract(
      //   coinSinoContractAddress,
      //   Sinoabi,
      //   operatorSigner
      // );

      // const RNGContract = new ethers.Contract(
      //   rngContractaddress,
      //   Rngabi,
      //   managedSigner
      // );

      // const lastround = await RNGContract.getLastRound();
      if (!rngData.round) return;
      // current lotteryid
      // const latestLotteryId = Number(
      //   await operatorcoinSinoContract.viewCurrentLotteryId()
      // );
      // set lottyied

      await operatorcoinSinoContract.closeLottery(
        latestLotteryId,
        rngData.round
      );

      console.log("lottery closed");
    } catch (error) {
      console.log("", error);
    }
  };

  // draw lottery
  const drawLottery = async (rngData, latestLotteryId) => {
    try {
      console.log("closing from operator funcs");
      // // signers wallet get smartcontract
      // const operatorProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
      // // operator signer and contract

      // const operatorSigner = new ethers.Wallet(
      //   process.env.opkey,
      //   operatorProvider
      // );
      // const managedSigner = new NonceManager(operatorSigner);
      // const operatorcoinSinoContract = new ethers.Contract(
      //   coinSinoContractAddress,
      //   Sinoabi,
      //   managedSigner
      // );

      const RNGContract = new ethers.Contract(
        rngContractaddress,
        Rngabi,
        managedSigner
      );
      console.log("got rng conract");
      // set random value

      // const lastround = await RNGContract.getLastRound();
      if (!rngData.round) return;

      await RNGContract.setRandomValue(
        rngData.round,
        transformer(rngData),
        rngData.signature,
        rngData.previous_signature
      );

      console.log("rngcontract called");
      // current lotteryid
      const latestLotteryId = Number(
        await operatorcoinSinoContract.viewCurrentLotteryId()
      );

      console.log("got id");

      const drawFinalNumberAndMakeLotteryClaimable =
        await operatorcoinSinoContract.drawFinalNumberAndMakeLotteryClaimable(
          latestLotteryId,
          false,
          rngData.round
        );

      console.log("asigned drafinal");

      await drawFinalNumberAndMakeLotteryClaimable.wait();
      console.log("lottery drawn");
    } catch (error) {
      console.log(error);
    }
  };

  return { startLottery, closeLottery, drawLottery };
}

export default OperatorFunctions;
