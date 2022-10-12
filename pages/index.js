import Head from "next/head";

import Header from "../components/header";
import SectionA from "../components/sectionA";
import SectionB from "../components/sectionB";
import Footer from "../components/footer";
import { useEffect, useRef, useState } from "react";
import ToTop from "../components/toTop";
import Sinoabi from "../utils/Coinsino.json";
import Rngabi from "../utils/RNGabi.json";
import { ethers, BigNumber } from "ethers";
import moment from "moment";
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
} from "../atoms/atoms";
import { useRecoilState } from "recoil";
import { Toast } from "flowbite-react";
import UseToaster from "../components/UseToaster";

// Lottery status
const Pending = 0;
const Open = 1;
const closed = 2;
const claimable = 3;

// // serverside
export const getServerSideProps = async () => {
  // conract address
  const coinSinoContractAddress = "0x7040d32de6f003c9A9BFBEadE10Ce85B911F0F1c";
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
  const [unClaimedUserRewards, setunClaimedUserRewards] = useState(0);
  const [rewardMessage, setRewardMessage] = useState("");
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
  const [rpcUrl, setrpcUrl] = useRecoilState(rpcaddress);
  const splittedWinningValues = Array.from(String(winningNo));

  const pricePerTicket = "3";

  async function generateRandom(min = 0, max = 100) {
    // find diff
    const difference = max - min;

    // generate random number
    let rand = Math.random();

    // multiply with difference
    rand = Math.floor(rand * difference);

    // add with min value
    rand = rand + min;

    return rand;
  }

  // // fetch latest drand data
  // const DrandFetch = async () => {
  //   const { Toast } = UseToaster();
  //   try {
  //     const res = await fetch("https://randomnumber.willdera.repl.co/fetch");
  //     const rngData = await res.json();
  //     setrngData(rngData);
  //   } catch (error) {
  //     // Toast(error);
  //   }
  // };

  // useEffect(() => {
  //   let fetchInterval = setInterval(async () => await DrandFetch(), 5000);
  //   return () => clearInterval(fetchInterval);
  // }, [rngData]);

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
      const rpcUrl = "https://testnet.telos.net/evm";
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
          let chainId = await ethereum.request({ method: "eth_chainId" });

          if (Number(chainId) !== 41) return;

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

            // console.log("hello man", userInfo);

            // // ticketids, ticketNumber, ticketStatus, number of ticket

            // const userticketIds = [];
            // for (let i = 0; i < userInfo[0].length; i++) {
            //   const ticketId = Number(userInfo[0][i]);
            //   userticketIds.push(ticketId);
            // }

            // // list of user's tickets
            // const list =
            //   await coinSinoContract.viewNumbersAndStatusesForTicketIds(
            //     userticketIds
            //   );
            setUserCurrentTickets(list[0]);
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
    fetchTickets();
  }, [currentLotteryId, currentAccount]);

  useEffect(() => {
    let intervalId = setInterval(getLatestLotteryInfo, 1000);
    return () => clearInterval(intervalId);
  }, [currentLotteryId, endTime, lotteryStatus, totalLotteryDeposit]);

  // const info = async () => {
  //   try {
  //     const { ethereum } = window;
  //     if (ethereum) {
  //       // signers wallet get smartcontract
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       // operator signer and contract
  //       const operatorSigner = new ethers.Wallet(opkey, provider);
  //       const operatorcoinSinoContract = new ethers.Contract(
  //         coinSinoContractAddress,
  //         Sinoabi,
  //         operatorSigner
  //       );

  //       // const i = 1
  //       // const percentage = 0.05

  //       // const checkpercentage = ()=>{
  //       //   if(nof)

  //       // }

  //       const getLotterystatus = await operatorcoinSinoContract.viewLottery(
  //         currentLotteryId
  //       );
  //       const { discountDivisor, finalNumber, treasuryFee, rewardsBreakdown } =
  //         getLotterystatus;

  //       // rewardsBreakdown.map(async(e) => {
  //       //   const poolPercentage=
  //       //   console.log( Number(e), ': ');
  //       // });

  //       setWinningNO(finalNumber);

  //       console.log("lottery info", getLotterystatus);
  //       console.log("treasuryFee", Number(rewardsBreakdown[0]));

  //       const { startTime, endTime } = getLotterystatus;

  //       var dateString = moment(moment.unix(startTime).format("MM/DD/YYYY"));

  //       const days = dateString.days();
  //       const hours = dateString.hours();
  //       const minutes = dateString.minutes();
  //       const seconds = dateString.seconds();

  //       setCoundown({
  //         days,
  //         hours,
  //         minutes,
  //         seconds,
  //       });
  //       return;

  //       // random numbers
  //       const RNGContract = new ethers.Contract(
  //         rngContractaddress,
  //         Rngabi,
  //         operatorSigner
  //       );

  //       // user contract
  //       const signer = provider.getSigner();
  //       const coinSinoContract = new ethers.Contract(
  //         coinSinoContractAddress,
  //         Sinoabi,
  //         signer
  //       );

  //       const accounts = await ethereum.request({
  //         method: "eth_requestAccounts",
  //       });

  //       const userInfo = await coinSinoContract.viewUserInfoForLotteryId(
  //         accounts[0],
  //         currentLotteryId,
  //         0,
  //         100
  //       );

  //       // const claimedorNot = userInfo[2]
  //       const userticketIds = [];
  //       for (let i = 0; i < userInfo[0].length; i++) {
  //         const ticketId = Number(userInfo[0][i]);
  //         userticketIds.push(ticketId);
  //       }

  //       // list of user's tickets
  //       const list = await coinSinoContract.viewNumbersAndStatusesForTicketIds(
  //         userticketIds
  //       );
  //       // const clonedObj = JSON.parse(JSON.stringify(list[0]));
  //       // clonedObj[1] = 258900;
  //       setUserTickets(list[0]);

  //       if (userticketIds.length < 1) {
  //         setRewardMessage("Sorry, you have no ticket for this round");
  //         setunClaimedUserRewards(null);
  //         return;
  //       }
  //       userticketIds.forEach(async (e, i) => {
  //         const view = await coinSinoContract.viewRewardsForTicketId(
  //           currentLotteryId,
  //           e,
  //           0
  //         );

  //         const rewards = ethers.utils.formatEther(view);

  //         if (!Number(rewards)) {
  //           setRewardMessage("sorry you did not win this time");
  //           setunClaimedUserRewards(null);
  //           return;
  //         }

  //         console.log("you worn with this ticket");
  //         setRewardMessage("congratulations, you won from a pool!");
  //         setunClaimedUserRewards(Number(rewards));
  //       });

  //       // finished drawing... Did you win?
  //       // check
  //       // return if not
  //       // else claim

  //       // const claimTickets = await operatorcoinSinoContract.claimTickets(
  //       //   currentLotteryId,
  //       //   userticketIds,
  //       //   pools
  //       // );

  //       // let possibleTicketArrays = [];
  //       // for (let i = 0; i < 500; i++) {
  //       //   possibleTicketArrays.push(i);
  //       // }

  //       // // availble tickets for the current pool
  //       // const NumbersAndStatus =
  //       //   await operatorcoinSinoContract.viewNumbersAndStatusesForTicketIds(
  //       //     possibleTicketArrays
  //       //   );
  //       // const totalTickets = NumbersAndStatus[0].filter((e) => e > 0);
  //       // console.log("totalTickets", totalTickets.length);
  //       // console.log("NumbersAndStatus", NumbersAndStatus);

  //       // console.log(totalTickets);

  //       // //   check the rewards for ticket 0, in pool 0 and from current lottery ID.
  //       // const viewRewardsForTicketId = await convertHexToInt(
  //       //   await operatorcoinSinoContract.viewRewardsForTicketId(
  //       //     currentLotteryId,
  //       //     0,
  //       //     3
  //       //   )
  //       // );
  //     }
  //   } catch (error) {
  //     console.log("Error minting character", error);
  //   }
  // };

  return (
    <div ref={scrollTargetElementRef}>
      <Head>
        <title>CoinSino</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        id="top"
        className="bg-[url('/images/bg.png')] bg-center bg-no-repeat "
      >
        <div className=" flex w-fit flex-col space-y-5 ">
          {/* <button className=" bg-white  p-5" onClick={start}>
            operator: start lottery
          </button>
          <button className=" bg-white  p-5" onClick={close}>
            operator: close lottery
          </button>

          <button className=" bg-white  p-5" onClick={drawFinal}>
            operator: Draw final
          </button> */}
          {/* <button className=" bg-white  p-5" onClick={info}>
            operator: check Info
          </button> */}

          {/* {winningNo && (
            <div className="my-10 text-white ">
              <span className=" p-2 font-bold  text-white">{`
                     Latest Winning No`}</span>
              {splittedWinningValues.map((e) => {
                return (
                  <span className=" mx-3 rounded-2xl bg-green-600 p-2 font-bold  text-white">
                    {e}
                  </span>
                );
              })}
            </div>
          )} */}
          {rewardMessage && (
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
        </div>
        <ToTop scrollTargetElementRef={scrollTargetElementRef} />
        <Header />
        <SectionA keys={opkey} />
      </div>

      <SectionB keys={opkey} />

      <Footer scrollTargetElementRef={scrollTargetElementRef} />
    </div>
  );
}
