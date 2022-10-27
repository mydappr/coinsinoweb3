import Head from "next/head";
import Header from "../components/header";
import SectionA from "../components/sectionA";
import SectionB from "../components/sectionB";
import Footer from "../components/footer";
import { useEffect, useRef, useState } from "react";
import ToTop from "../components/toTop";
import Sinoabi from "../utils/Coinsino.json";
import { ethers } from "ethers";
import {
  latestLotteryId,
  lotteryStatus as Lstatus,
  totalLotteryFunds,
  userTickets as accountTicket,
  winningNumbers,
  tlosPrice,
  burnfee,
  firstpool,
  secondpool,
  thirdpool,
  fourthpool,
  fiftpool,
  sixthpool,
  endLotteryTime,
  drandData,
  activeAccount,
  sinoAddress,
  rngAddress,
  rpcaddress,
  networkID,
} from "../atoms/atoms";
import { useRecoilState } from "recoil";

// Lottery status
const Pending = 0;
const Open = 1;
const closed = 2;
const claimable = 3;

// // serverside
export const getServerSideProps = async () => {
  // conract address
  const coinSinoContractAddress = "0xd2635b5b12AeA2b5D8f04a9cdA82424206f50881";
  // node url
  const rpcUrl = "https://rpc1.us.telos.net/evm";
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
  const [unClaimedUserRewards, setunClaimedUserRewards] = useState(0);
  
  const [userTickets, setUserTickets] = useRecoilState(accountTicket);
  const [winningNo, setWinningNO] = useRecoilState(winningNumbers);
  const [lotteryStatus, setlotteryStatus] = useRecoilState(Lstatus);
  const [currentLotteryId, setCurrentLotteryId] =
    useRecoilState(latestLotteryId);
  const [totalLotteryDeposit, setTotalLotteryDeposit] =
    useRecoilState(totalLotteryFunds);
  const [ticketSplit, setTicketSplit] = useState([]);
  const [claimpoolLength, setclaimpoolLength] = useState([]);
  const [telosPrice, setTelosPrice] = useRecoilState(tlosPrice);
  const [endTime, setEndTime] = useRecoilState(endLotteryTime);
  const [platFormFee, setPlatFormFee] = useRecoilState(burnfee);
  const [firstPoolFunds, setFirstPoolFunds] = useRecoilState(firstpool);
  const [secondPoolFunds, setSecondPoolFunds] = useRecoilState(secondpool);
  const [thirdPoolFunds, setThirdPoolFunds] = useRecoilState(thirdpool);
  const [fouthPoolFunds, setFouthPoolFunds] = useRecoilState(fourthpool);
  const [fifthPoolFunds, setFifthPoolFunds] = useRecoilState(fiftpool);
  const [sixthPoolFunds, setSixthPoolFunds] = useRecoilState(sixthpool);
  const [rngData, setrngData] = useRecoilState(drandData);
  const [userCurrentTickets, setUserCurrentTickets] = useState(0);
  const scrollTargetElementRef = useRef(null);
  const [currentAccount, setCurrentAccount] = useRecoilState(activeAccount);
  const [coinSinoContractAddress, setcoinSinoContractAddress] =
    useRecoilState(sinoAddress);
  const [rngContractaddress, setrngContractaddress] =
    useRecoilState(rngAddress);
  const [chainId, setChainId] = useRecoilState(networkID);
  const [rpcUrl, setrpcUrl] = useRecoilState(rpcaddress);
  const splittedWinningValues = Array.from(String(winningNo));

 
  const getLatestLotteryInfo = async () => {
    if (!endTime || !lotteryStatus || !currentLotteryId) {
      setEndTime(_endTime);
      setlotteryStatus(_status);
      setCurrentLotteryId(_lotteryid);
      setTotalLotteryDeposit(
        ethers.utils.formatEther(_amountCollectedInTelos, "ether")
      );
    }
    try {
      const rpcUrl = "https://rpc1.us.telos.net/evm";
      // signers wallet get smartcontract
      const operatorProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
      // operator signer and contract
      const operatorSigner = new ethers.Wallet(opkey, operatorProvider);
      const operatorcoinSinoContract = new ethers.Contract(
        coinSinoContractAddress,
        Sinoabi,
        operatorSigner
      );
      // current lotteryid

      const latestLotteryId = Number(
        await operatorcoinSinoContract.viewCurrentLotteryId()
      );

      // set lottyied
      setCurrentLotteryId(latestLotteryId);

      if (!currentLotteryId) return;
      // current lottery details
      const getLotterystatus = await operatorcoinSinoContract.viewLottery(
        currentLotteryId
      );

      // current lottery status
      const {
        status,
        startTime,
        endTime,
        treasuryFee,
        amountCollectedInTelos,
        rewardsBreakdown,
      } = getLotterystatus;

      setEndTime(Number(endTime));

      setTotalLotteryDeposit(
        ethers.utils.formatEther(amountCollectedInTelos, "ether")
      );
      // calculat total funds for platform fee pools
      const platFormFee = (Number(treasuryFee) / 10000) * totalLotteryDeposit;
      setPlatFormFee(platFormFee);

      const totalPoolFunds = totalLotteryDeposit - platFormFee;

      // calculate pool funds for  pools
      const firstPool =
        ((Number(rewardsBreakdown[0]) / 10000) * 100 * totalPoolFunds) / 100;
      setFirstPoolFunds(firstPool);

      const secondPool =
        ((Number(rewardsBreakdown[1]) / 10000) * 100 * totalPoolFunds) / 100;
      setSecondPoolFunds(secondPool);

      const thirdPool =
        ((Number(rewardsBreakdown[2]) / 10000) * 100 * totalPoolFunds) / 100;
      setThirdPoolFunds(thirdPool);

      const fourthPool =
        ((Number(rewardsBreakdown[3]) / 10000) * 100 * totalPoolFunds) / 100;
      setFouthPoolFunds(fourthPool);

      const fifthPool =
        ((Number(rewardsBreakdown[4]) / 10000) * 100 * totalPoolFunds) / 100;
      setFifthPoolFunds(fifthPool);

      const sixthpool =
        ((Number(rewardsBreakdown[5]) / 10000) * 100 * totalPoolFunds) / 100;
      setSixthPoolFunds(sixthpool);

      if (endTime) {
        setlotteryStatus(status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // fetch tickets on launch
  const fetchTickets = async () => {
    const { ethereum } = window;

    if (ethereum) {
      try {
        // deal with userCurrentTickets

        if (ethereum) {
          // user contract
          const userProvider = new ethers.providers.Web3Provider(ethereum);
          let _networkId = await ethereum.request({ method: "eth_chainId" });

          if (Number(_networkId) !== chainId) return;

          const signer = userProvider.getSigner();
          const coinSinoContract = new ethers.Contract(
            coinSinoContractAddress,
            Sinoabi,
            signer
          );

          const latestLotteryId = Number(
            await coinSinoContract.viewCurrentLotteryId()
          );

          if (!currentAccount || !latestLotteryId) return;
          console.log(currentAccount, latestLotteryId);

          try {
            const userInfo = await coinSinoContract.viewUserInfoForLotteryId(
              currentAccount,
              latestLotteryId
            );

            setUserCurrentTickets(userInfo[1]);
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }; 


  
  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      if (isSubscribed) {
        await fetchTickets();
      }
    })();

    return () => (isSubscribed = false);
  }, [currentLotteryId, currentAccount]);

  useEffect(() => {
    let intervalId = setInterval(getLatestLotteryInfo, 1000);
    return () => clearInterval(intervalId);
  }, [currentLotteryId, endTime, lotteryStatus, totalLotteryDeposit]);

  return (
    <div ref={scrollTargetElementRef}>
      <Head>
        <title>CoinSino</title>
        <meta name="description" content="Coinsino on Blockchain" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div
        id="top"
        className="bg-[url('/images/bg.png')] bg-center bg-no-repeat "
      >
        {/* <div className=" flex w-fit flex-col space-y-5 ">
          {!rewardMessage && (
            <div className="text-white">
              <h1 className=" text-2xl">Drawn! </h1>
              <p className="">{rewardMessage}</p>
              {unClaimedUserRewards > 0 && (
                <h1>Unclaimed: {unClaimedUserRewards} Tlos</h1>
              )}

              {userTickets.map((e, i) => {
                const splittedTicketValues = Array.from(String(e));

                return (
                  <div key={i} className="max-w-md">
                    <div className="flex items-center ">
                      <span className=" p-2   font-bold">{`Ticket ${
                        i + 1
                      }`}</span>
                      <p className=" my-2 flex ">
                        {splittedTicketValues.map((tn, tIndex) => {
                          return (
                            <span
                              key={tIndex}
                              className={`${
                                tIndex === claimpoolLength[tIndex] &&
                                ` bg-green-600`
                              } mx-3 rounded-2xl  p-2  font-bold`}
                            >
                              {tn}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div> */}
        <ToTop scrollTargetElementRef={scrollTargetElementRef} />
        <Header />
        <SectionA keys={opkey} />
      </div>
      <SectionB keys={opkey} />

      <Footer scrollTargetElementRef={scrollTargetElementRef} />
    </div>
  );
}
