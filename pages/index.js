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
} from "../atoms/atoms";
import { useRecoilState } from "recoil";

// coinsino contract address
const coinSinoContractAddress = "0xbB1c15B915171410d9D3269A91A27442a4eDa871";
// rng contract address
const rngContractaddress = "0x219948CB7513D25E0CDDF16654fBc54a0405a29c";
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

// Lottery status
const Pending = 0;
const Open = 1;
const closed = 2;
const claimable = 3;

// serverside
export const getServerSideProps = async () => {
  const a = await fetch("https://sino-one.vercel.app/api/hello");
  const keys = await a.json();

  // fetch initial status for lottery

  return {
    props: { keys },
 
  };
};

export default function Home({ keys }) {
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

  const scrollTargetElementRef = useRef(null);

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

  async function generateTicketNumbers(numberOfTickets) {
    const numbers = [];
    for (let i = 0; i < numberOfTickets; i++) {
      const ticket = await generateRandom(100000, 999999);
      numbers.push(ticket);
    }
    return numbers;
  }

  const wonTicketArr = [];
  const pools = [];

  let i = 0;
  function wonPools(arr1, arr2) {
    while (i < arr1.length) {
      if (arr1[i] === arr2[i]) {
        // return single array if there duplicate
        pools.push(i);
        wonTicketArr.push(arr1);
        i++;
      } else {
        return;
      }
    }
  }

  async function generatePossibleTicketIds(length) {
    const iDs = Array.from({ length }, (_, i) => i + 1);
    return iDs;
  }

  const close = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // signers wallet get smartcontract
        const provider = new ethers.providers.Web3Provider(ethereum);
        // operator signer and contract
        const operatorSigner = new ethers.Wallet(keys.opkey, provider);
        const operatorcoinSinoContract = new ethers.Contract(
          coinSinoContractAddress,
          Sinoabi,
          operatorSigner
        );

        const RNGContract = new ethers.Contract(
          rngContractaddress,
          Rngabi,
          operatorSigner
        );

        const getLastRound = await convertHexToInt(
          await RNGContract.getLastRound()
        );
        await operatorcoinSinoContract.closeLottery(
          currentLotteryId,
          getLastRound
        );

        console.log("closed");
      }
    } catch (error) {
      console.log("Error minting character", error);
    }
  };

  const start = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // signers wallet get smartcontract
        const provider = new ethers.providers.Web3Provider(ethereum);
        // operator signer and contract
        const operatorSigner = new ethers.Wallet(keys.opkey, provider);
        const operatorcoinSinoContract = new ethers.Contract(
          coinSinoContractAddress,
          Sinoabi,
          operatorSigner
        );

        const oneMinute = await convertInput("10 minutes");

        // start a lottery
        const startLottery = await operatorcoinSinoContract.startLottery(
          oneMinute,
          ethers.utils.parseUnits(pricePerTicket, "ether"),
          300,
          [500, 960, 1430, 1910, 2390, 2810],
          1000
        );

        await startLottery;

        console.log("lottery started");
        // get current lottery id

        console.log(currentLotteryId, "currentid");
        const getLotterystatus = await operatorcoinSinoContract.viewLottery(
          currentLotteryId
        );

        console.log("lottery status", getLotterystatus.status);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error minting character", error);
      // setTxError(error.message);
    }
  };

  // lottery info
  const drawFinal = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // signers wallet get smartcontract
        const provider = new ethers.providers.Web3Provider(ethereum);
        const operatorSigner = new ethers.Wallet(keys.opkey, provider);
        const operatorcoinSinoContract = new ethers.Contract(
          coinSinoContractAddress,
          Sinoabi,
          operatorSigner
        );

        const RNGContract = new ethers.Contract(
          rngContractaddress,
          Rngabi,
          operatorSigner
        );
        // set random value

        const lastround = await convertHexToInt(
          await RNGContract.getLastRound()
        );
        await RNGContract.setRandomValue(
          initialRound === 0 ? data.round : lastround + 1,
          data.randomness,
          data.signature,
          data.previous_signature
        );
        const getLastRound = await convertHexToInt(
          await RNGContract.getLastRound()
        );

        console.log(getLastRound);

        console.log(currentLotteryId, "latest lottery id");
        const drawFinalNumberAndMakeLotteryClaimable =
          await operatorcoinSinoContract.drawFinalNumberAndMakeLotteryClaimable(
            currentLotteryId,
            false,
            getLastRound
            // { gasLimit: 26250 }
          );
        console.log(
          drawFinalNumberAndMakeLotteryClaimable,
          "lottery has now been drawn and rewards  now claimable"
        );
        await drawFinalNumberAndMakeLotteryClaimable.wait();
        console.log(
          drawFinalNumberAndMakeLotteryClaimable,
          "lottery has now been drawn and rewards  now claimable"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLatestLotteryInfo = async () => {
    const { ethereum } = window;

    try {
      const rpcUrl = "https://testnet.telos.net/evm";
      console.log(rpcUrl);
      // signers wallet get smartcontract
      const operatorProvider = new ethers.providers.JsonRpcProvider(rpcUrl);

      // operator signer and contract
      const operatorSigner = new ethers.Wallet(keys.opkey, operatorProvider);
      const operatorcoinSinoContract = new ethers.Contract(
        coinSinoContractAddress,
        Sinoabi,
        operatorSigner
      );

      // current lotteryid
      const latestLotteryId = await convertHexToInt(
        await operatorcoinSinoContract.viewCurrentLotteryId()
      );

      // chnage back to lottyied
      setCurrentLotteryId(5);

      // current lottery details
      const getLotterystatus = await operatorcoinSinoContract.viewLottery(
        latestLotteryId
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

      setEndTime(endTime);

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

      status === Open
        ? setlotteryStatus(Open)
        : status === closed
        ? setlotteryStatus(closed)
        : status === claimable
        ? setlotteryStatus(claimable)
        : setlotteryStatus(Pending);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch tickets on launch
  const fetchTickets = async () => {
    const { ethereum } = window;

    if (ethereum) {
      try {
        const { ethereum } = window;
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

          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          const latestLotteryId = await convertHexToInt(
            await coinSinoContract.viewCurrentLotteryId()
          );

          const userInfo = await coinSinoContract.viewUserInfoForLotteryId(
            accounts[0],
            latestLotteryId,
            0,
            100
          );

          const userticketIds = [];
          for (let i = 0; i < userInfo[0].length; i++) {
            const ticketId = Number(userInfo[0][i]);
            userticketIds.push(ticketId);
          }

          // list of user's tickets
          const list =
            await coinSinoContract.viewNumbersAndStatusesForTicketIds(
              userticketIds
            );
          setUserTickets(list[0]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [currentLotteryId]);

  useEffect(() => {
    getLatestLotteryInfo();
  }, [currentLotteryId, lotteryStatus]);

  // const info = async () => {
  //   try {
  //     const { ethereum } = window;
  //     if (ethereum) {
  //       // signers wallet get smartcontract
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       // operator signer and contract
  //       const operatorSigner = new ethers.Wallet(keys.opkey, provider);
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
          <button className=" bg-white  p-5" onClick={start}>
            operator: start lottery
          </button>
          <button className=" bg-white  p-5" onClick={close}>
            operator: close lottery
          </button>

          <button className=" bg-white  p-5" onClick={drawFinal}>
            operator: Draw final
          </button>
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
                  <div className="max-w-md">
                    <div className="flex items-center ">
                      <span className=" p-2   font-bold">{`Ticket ${
                        i + 1
                      }`}</span>
                      <p className=" my-2 flex ">
                        {splittedTicketValues.map((tn, tIndex) => {
                          return (
                            <span
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
        <SectionA keys={keys} />
      </div>

      <SectionB keys={keys} />

      <Footer scrollTargetElementRef={scrollTargetElementRef} />
    </div>
  );
}
