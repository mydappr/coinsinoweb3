import Head from "next/head";
import Header from "../components/header";
import SectionA from "../components/sectionA";
import SectionB from "../components/sectionB";
import Footer from "../components/footer";
import { useCallback, useEffect, useRef, useState } from "react";
import ToTop from "../components/toTop";
import Sinoabi from "../utils/Coinsino.json";
import { ethers } from "ethers";
import InitialLotteryData from "../components/initalLotteryData";

// load InitialLotteryData

// getserverside
// // serverside
export const getInitialProps = async () => {
  // conract address
  const coinSinoContractAddress = "0xc65F1221147BE339704a1DB0A0B65F2DE3cA7aFC";
  // node url
  const rpcUrl = "https://testnet.telos.net/evm";
  // operator provider,and signer
  const operatorProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
  // operator signer and contract
  const operatorSigner = new ethers.Wallet(process.env.opkey, operatorProvider);

  const operatorcoinSinoContract = new ethers.Contract(
    coinSinoContractAddress,
    Sinoabi,
    operatorSigner
  );

  const latestLotteryId = Number(
    await operatorcoinSinoContract.viewCurrentLotteryId()
  );
  // set lottyied

  // current lottery details
  const getLotterystatus = await operatorcoinSinoContract.viewLottery(
    latestLotteryId
  );

  // current lottery status
  const { status, endTime, amountCollectedInTelos } = getLotterystatus;
  const _endTime = Number(endTime);
  const _lotteryid = Number(latestLotteryId);
  const _status = Number(status);
  const _amountCollectedInTelos = amountCollectedInTelos.toString();

  // fetch initial status for lottery

  return {
    props: { _endTime, _lotteryid, _status, _amountCollectedInTelos },
  };
};



export default function Home({
  _endTime,
  _lotteryid,
  _status,
  _amountCollectedInTelos,
}) {
  const opkey = process.env.opkey;

  return (
    <div>
      <Head>
        <title>CoinSino</title>
        <meta name="description" content="Coinsino on Blockchain" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div
        id="top"
        className=" border-transparent  bg-[url('/images/bg.png')]  bg-center"
      >
        <Header />
        <InitialLotteryData
          _endTime={_endTime}
          _lotteryid={_lotteryid}
          _status={_status}
          _amountCollectedInTelos={_amountCollectedInTelos}
          opkey={opkey}
        />
        <SectionA keys={opkey} />
      </div>
      <SectionB keys={opkey} />

      <Footer />
    </div>
  );
}
