import { useEffect, useState, Fragment } from "react";
import { Tabs } from "flowbite-react";
import { BeakerIcon, PlayIcon } from "@heroicons/react/solid";
import RandomImage from "./randomenumber";
import {
  latestLotteryId,
  activeAccount,
  userTickets as accountTicket,
  lotteryStatus as Lstatus,
  errMessage,
  unClaimedReward,
  winningNumbers,
  endLotteryTime,
  viewTicket,
  rouncount,
  wonSize,
  usewalletModal,
  connectorType,
  sinoAddress,
  rpcaddress,
  wonPoolLength,
  wonid,
} from "../atoms/atoms";
import { useRecoilState } from "recoil";
import Sinoabi from "../utils/Coinsino.json";
import { ethers } from "ethers";
import moment from "moment";
import ViewTickets from "./viewTickets";
import SectionA from "./sectionA";
import UseToaster from "./UseToaster";
import UseLoadingSpinner from "./UseLoadingSpinner";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowSmRightIcon, XIcon } from "@heroicons/react/solid";

import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";

function SectionB({ keys }) {
  const [lastDrawTime, setLastDrawTime] = useState({});
  const [userTickets, setUserTickets] = useRecoilState(accountTicket);
  const [currentAccount, setCurrentAccount] = useRecoilState(activeAccount);
  const [lotteryStatus, setlotteryStatus] = useRecoilState(Lstatus);
  const [unClaimedUserRewards, setunClaimedUserRewards] =
    useRecoilState(unClaimedReward);
  const [rewardMessage, setRewardMessage] = useRecoilState(errMessage);
  const [claimpoolLength, setclaimpoolLength] = useRecoilState(wonPoolLength);
  const [winningNo, setWinningNO] = useRecoilState(winningNumbers);
  const splittedWinningValues = Array.from(String(winningNo));
  const [currentLotteryId, setCurrentLotteryId] =
    useRecoilState(latestLotteryId);
  const [roundCount, setRoundCount] = useRecoilState(rouncount);
  const [endTime, setEndTime] = useRecoilState(endLotteryTime);
  const [viewTicketOpen, setviewTicketOpen] = useRecoilState(viewTicket);
  const [wonTicketSize, setWonTicketSize] = useRecoilState(wonSize);
  const [walletModal, setwalletModal] = useRecoilState(usewalletModal);
  const [providerConnector, setProviderConnector] =
    useRecoilState(connectorType);
  const [isloading, setisloading] = useState(false);
  const { Toast } = UseToaster();
  const [claimming, setClaiming] = useState(false);
  const { Loading } = UseLoadingSpinner(isloading || claimming);
  const [coinSinoContractAddress, setcoinSinoContractAddress] =
    useRecoilState(sinoAddress);
  const [wwonid, setwonId] = useRecoilState(wonid);
  const [rpcUrl, setrpcUrl] = useRecoilState(rpcaddress);
  const [viewWinningTickets, setVieWinningTickets] = useState(false);
  const [wonCliamId, setWonCliamId] = useState([]);
  const [isready, setisReady] = useState(false);

  function closeViewTickets() {
    setVieWinningTickets(false);
  }

  useEffect(() => {
    if (currentLotteryId) {
      setRoundCount(currentLotteryId - 1);
    }
  }, [currentLotteryId]);

  // convert hex to int
  async function convertHexToInt(hex) {
    return parseInt(hex, 16);
  }
  console.log(winningNo);

  // retuns won tickets and won pool Ids
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

  // Lottery status
  const Pending = 0;
  const Open = 1;
  const closed = 2;
  const claimable = 3;

  // useEffect(() => {
  //   const now = new Date();
  //   const hr = 12;
  //   const drawUtc = new Date(
  //     Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12)
  //   );

  //   console.log(drawUtc);

  //   const month = drawUtc.toLocaleString("default", { month: "short" });
  //   const date = drawUtc.getDate();
  //   const year = drawUtc.getFullYear();
  //   const hour = drawUtc.getHours();
  //   const lastDraw = { month, date, year, hour };
  //   setLastDrawTime(lastDraw);
  // }, []);
  // last
  // const lastTimeDraw = (date = new Date()) => {
  //   const pastDraw = new Date(date.getTime());
  //   pastDraw.setUTCDate(date.getDate() - 1);
  //   return pastDraw;
  // };
  // // nextfrom Last
  // const nextDay = (date = new Date()) => {
  //   const nextDay = new Date(date.getTime());
  //   nextDay.setUTCDate(date.getDate() + 1);
  //   return nextDay;
  // };

  const Check = async () => {
    let provider;
    try {
      setisloading(true);

      if (
        providerConnector === "metaMask" ||
        providerConnector === "walletConnect"
      ) {
        if (providerConnector === "walletConnect") {
          provider = new WalletConnectProvider({
            rpc: {
              [41]: rpcUrl,
            },
          });
        } else if (providerConnector === "metaMask") {
          provider = window.ethereum;
        }

        await provider.enable();

        const web3 = new Web3(provider);

        const coinSinoContract = new web3.eth.Contract(
          Sinoabi,
          coinSinoContractAddress
        );

        // check if network is metamask
        let chainId = await web3.eth.getChainId();

        if (chainId !== 41) {
          setisloading(false);
          Toast("You are not connected to the Telos Netowrk!");
          return;
        }

        // current lotteryid
        const latestLotteryId = Number(
          await coinSinoContract.methods.viewCurrentLotteryId().call()
        );

        console.log(userTickets.length, "hhsdkh");
        const viewMaxRewardsForTicketId = await coinSinoContract.methods
          .viewMaxRewardsForTicketId(
            currentAccount,
            roundCount,
            0,
            userTickets.length
          )
          .call();

        console.log(viewMaxRewardsForTicketId);
        const _ticketIds = viewMaxRewardsForTicketId[0];
        const _tickets = viewMaxRewardsForTicketId[1];
        const _rewards = viewMaxRewardsForTicketId[2];
        const _rewardpools = viewMaxRewardsForTicketId[3];

        const a = _tickets.map((e) => Number(e));
        setUserTickets(a);

        let won_ticketids = [];
        let won_tickets = [];
        let won_rewards = [];
        let won_rewardpool = [];
        const wonId = [];

        _rewards.map((e, i) => {
          if (Number(e) > 0) {
            wonId.push(i);
            won_rewards.push(Number(e));
            won_rewardpool.push(Number(_rewardpools[i]));
            won_ticketids.push(Number(_ticketIds[i]));
            won_tickets.push(Number(_tickets[i]));
          }
        });

        setWonTicketSize(won_tickets.length);
        setclaimpoolLength(won_rewardpool);
        setwonId(wonId);
        setWonCliamId(won_ticketids);

        // current lottery details
        const getLotterystatus = await coinSinoContract.methods
          .viewLottery(roundCount)
          .call();

        console.log("passed");

        // current lottery status
        const { status } = getLotterystatus;
        console.log("ash");
        if (Number(status) === claimable) {
          // const uuu = await coinSinoContract.methods.viewMaxRewardsForTicketId(
          //   currentAccount,
          //   previousLotteryId,
          //   0,
          //   100
          // );

          // console.log(uuu);

          // const userInfo = await coinSinoContract.methods
          //   .viewUserInfoForLotteryId(currentAccount, previousLotteryId, 0, 100)
          //   .call();

          // console.log("this is user info", userInfo[0]);

          // const userticketIds = [];
          // for (let i = 0; i < userInfo[0].length; i++) {
          //   const ticketId = Number(userInfo[0][i]);
          //   userticketIds.push(ticketId);
          // }

          // list of user's tickets
          // const list = await coinSinoContract.methods
          //   .viewNumbersAndStatusesForTicketIds(userticketIds)
          //   .call();
          // console.log(list[0]);
          // setisloading(false);
          // setUserTickets(list[0]);

          if (_ticketIds.length < 1) {
            setRewardMessage("Sorry, you have no ticket for this round");
            setunClaimedUserRewards(null);
            console.log("but I have ticket na", _ticketIds);
            return;
          }

          if (won_rewards.length < 1) {
            setRewardMessage("sorry you did not win this time!");
            setunClaimedUserRewards(null);
            return;
          }

          //  user won from this lottery
          setRewardMessage("Congratulations");

          const totalrewards = ethers.utils.formatEther(
            `${won_rewards.reduce((a, b) => a + b, 0)}`,
            "ethers"
          );
          setunClaimedUserRewards(totalrewards);
          console.log(totalrewards);
          setisloading(false);

          // claim now

          // const userbalanceb4 = Number(
          //   ethers.utils.formatEther(
          //     await provider.getBalance(currentAccount)
          //   )
          // );
          // console.log("befr claim", userbalanceb4);
          // const claimTickets = await coinSinoContract.methods
          //   .claimTickets(previousLotteryId, ticketids, rewardpool)
          //   .send({ from: currentAccount });

          // await claimTickets.wait();

          // console.log("climed");
          // const userbalanceafter = Number(
          //   ethers.utils.formatEther(
          //     await provider.getBalance(currentAccount)
          //   )
          // );
          // console.log("after claim", userbalanceafter);

          // // user has a ticket
          // userticketIds.forEach(async (e, i) => {
          //   const view = await coinSinoContract.methods
          //     .viewRewardsForTicketId(previousLotteryId, e, 0)
          //     .call();

          //   const rewards = ethers.utils.formatEther(view);

          // const wonTickets = [];
          // userTickets.map(async (e) => {
          //   const split = Array.from(String(e));

          //   wonPools(split, splittedWinningValues);

          //   // won pools
          //   setclaimpoolLength(pools);
          //   setisloading(false);

          // });
        }
      }
    } catch (error) {
      Toast(error.reason);
      setisloading(false);
    }
  };

  // claim now

  const Claim = async () => {
    let provider;
    try {
      setClaiming(true);

      if (
        providerConnector === "metaMask" ||
        providerConnector === "walletConnect"
      ) {
        if (providerConnector === "walletConnect") {
          provider = new WalletConnectProvider({
            rpc: {
              [41]: rpcUrl,
            },
          });
        } else if (providerConnector === "metaMask") {
          provider = window.ethereum;
        }

        await provider.enable();

        const web3 = new Web3(provider);

        const coinSinoContract = new web3.eth.Contract(
          Sinoabi,
          coinSinoContractAddress
        );
        console.log("is is sis ", claimming);
        // check if network is tlos
        // check if network is metamask
        let chainId = await web3.eth.getChainId();

        if (chainId !== 41) {
          setClaiming(false);
          Toast("You are not connected to the Telos Netowrk!");
          return;
        }

        if (lotteryStatus === Pending) return;

        // current lotteryid
        // const latestLotteryId = Number(
        //   await coinSinoContract.viewCurrentLotteryId()
        // );

        // const previousLotteryId =
        //   latestLotteryId === 1 ? latestLotteryId : latestLotteryId - 1;

        // current lottery details

        const getLotterystatus = await coinSinoContract.methods
          .viewLottery(roundCount)
          .call();

        // current lottery status
        const { status } = getLotterystatus;

        if (Number(status) === claimable) {
          // const userInfo = await coinSinoContract.viewUserInfoForLotteryId(
          //   accounts[0],
          //   previousLotteryId,
          //   0,
          //   100
          // );

          // const userticketIds = [];
          // for (let i = 0; i < userInfo[0].length; i++) {
          //   const ticketId = Number(userInfo[0][i]);
          //   userticketIds.push(ticketId);
          // }

          // list of user's tickets
          // const list =
          //   await coinSinoContract.viewNumbersAndStatusesForTicketIds(
          //     userticketIds
          //   );

          // setUserTickets(list[0]);

          // user has a ticket

          // userticketIds.forEach(async (e, i) => {
          //   const view = await coinSinoContract.viewRewardsForTicketId(
          //     previousLotteryId,
          //     e,
          //     0
          //   );

          //   const rewards = ethers.utils.formatEther(view);

          //   if (!Number(rewards)) {
          //     setRewardMessage("sorry you did not win this time");
          //     setunClaimedUserRewards(null);
          //     return;
          //   }

          //   //  user won from this lottery
          //   setRewardMessage("congratulations, you won!");
          //   setunClaimedUserRewards(Number(rewards));

          //   const wonTickets = [];
          //   userTickets.map(async (e) => {
          //     const split = Array.from(String(e));

          //     wonPools(split, splittedWinningValues);

          //     // won pools

          //     //  remove duplicate tickets from won tickets
          //     const wonTicketArrSet = new Set(wonTicketArr.map((e) => e));

          //     const _wonticketNumbers = Array.from(wonTicketArrSet).map(
          //       (e, i, arr) => parseInt(arr[i].join(""))
          //     );

          //     // const poisibleTicketIds = await generatePossibleTicketIds(2);
          //     // const allAvailableTickets =
          //     //   await coinSinoContract.viewNumbersAndStatusesForTicketIds(
          //     //     poisibleTicketIds
          //     //   );

          //     const wonTickIds = [];
          //     _wonticketNumbers.map((won) => {
          //       return userTickets.map((ticket, i) => {
          //         if (won === ticket) {
          //           wonTickIds.push(i);
          //         }
          //       });
          //     });

          //     // Claim now
          //     const userbalanceBefore = Number(
          //       ethers.utils.formatEther(await provider.getBalance(accounts[0]))
          //     );
          //     console.log("b4", userbalanceBefore);

          //     const claimTickets = await coinSinoContract.claimTickets(
          //       previousLotteryId,
          //       wonTickIds,
          //       claimpoolLength
          //     );

          //     await claimTickets.wait();

          //     // console.log("climed");
          //     const userbalanceafter = Number(
          //       ethers.utils.formatEther(await provider.getBalance(accounts[0]))
          //     );
          //     // console.log("b4", userbalanceafter);
          //   });
          // });
          // Claim now

          const userbalanceBefore = await web3.eth.getBalance(currentAccount);
          console.log("b4", userbalanceBefore);

          const getGasPrice = await web3.eth.getGasPrice();
          console.log(getGasPrice);
          const claimTickets = await coinSinoContract.methods
            .claimTickets(roundCount, wonCliamId, claimpoolLength)
            .send({ from: currentAccount });

          await claimTickets.wait();
          setClaiming(false);

          // console.log("climed");
          const userbalanceafter = await web3.eth.getBalance(currentAccount);
          console.log("after", userbalanceafter);
        }
      }
    } catch (error) {
      Toast(error);
      console.log(error);
      setClaiming(false);
    }
  };

  const fetchRoundDetails = async () => {
    try {
      // signers wallet get smartcontract
      const operatorProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const operatorSigner = new ethers.Wallet(keys, operatorProvider);
      const operatorcoinSinoContract = new ethers.Contract(
        coinSinoContractAddress,
        Sinoabi,
        operatorSigner
      );

      // current lottery details
      const getLotterystatus = await operatorcoinSinoContract.viewLottery(
        roundCount
      );

      // console.log(getLotterystatus);

      // current lottery status
      const {
        status,
        finalNumber,
        startTime,
        endTime,
        treasuryFee,
        amountCollectedInTelos,
        rewardsBreakdown,
      } = getLotterystatus;
      setWinningNO(finalNumber);

      const prevDrawDate = moment.unix(Number(endTime));
      prevDrawDate.toISOString();
      prevDrawDate.format();
      const date = prevDrawDate.date();
      const month = prevDrawDate.format("MMM");
      const year = prevDrawDate.year();
      const hour = prevDrawDate.format("h");
      const minute = prevDrawDate.format("mm");
      const antePost = prevDrawDate.format("A");

      setLastDrawTime({
        year,
        hour,
        date,
        month,
        hour,
        minute,
        antePost,
      });
      setWinningNO(finalNumber);

      // fetch user's ticket for the round
      if (currentAccount) {
        const userInfo =
          await operatorcoinSinoContract.viewUserInfoForLotteryId(
            currentAccount,
            roundCount,
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
          await operatorcoinSinoContract.viewNumbersAndStatusesForTicketIds(
            userticketIds
          );

        console.log(list[0]);
        setUserTickets(list[0]);

        const viewMaxRewardsForTicketId =
          await operatorcoinSinoContract.viewMaxRewardsForTicketId(
            currentAccount,
            roundCount,
            0,
            userTickets.length
          );

        const _ticketIds = viewMaxRewardsForTicketId[0];
        const _tickets = viewMaxRewardsForTicketId[1];
        const _rewards = viewMaxRewardsForTicketId[2];
        const _rewardpools = viewMaxRewardsForTicketId[3];

        let won_tickets = [];

        _rewards.map((e, i) => {
          if (Number(e) > 0) {
            won_tickets.push(Number(_tickets[i]));
          }
        });

        // setWonTicketSize(won_tickets.length);
        setisReady(true);

        console.log(isready, userTickets);
      }
    } catch (error) {
      console.log(error.reason);
    }
  };

  useEffect(() => {
    fetchRoundDetails();
  }, [roundCount, userTickets.length, lotteryStatus, currentAccount]);

  const previousDraws = async () => {
    setisReady(false);
    if (roundCount > 1) {
      setRoundCount((prev) => prev - 1);
      setRewardMessage("");
      setWinningNO([]);
      setisloading(false);
      setUserTickets([]);
      setLastDrawTime([]);
    }
  };
  const nextDraws = async () => {
    setisReady(false);
    if (roundCount < currentLotteryId - 1) {
      setRoundCount((prev) => prev + 1);
      setRewardMessage("");
      setWinningNO([]);
      setisloading(false);
      setUserTickets([]);
      setLastDrawTime([]);
    }
  };

  return (
    <section className="   my-0  mx-auto mt-10 mb-20 w-full p-2 text-white md:max-w-2xl lg:max-w-4xl    xl:max-w-6xl   ">
      <h2 className=" text-center text-lg font-bold text-coinSinoGreen">
        Finished Rounds
      </h2>
      {!rewardMessage && (
        <div className=" my-7 mx-auto w-full max-w-[200px] space-y-5 p-2">
          <h2 className=" text-center text-xl font-bold">Check if you won.</h2>{" "}
          {currentAccount ? (
            <div>
              {isloading ? (
                Loading()
              ) : (
                <button
                  disabled={!isready}
                  onClick={Check}
                  className={`joinBtn w-full  ${
                    !isready &&
                    "  cursor-not-allowed border border-coinSinoTextColor2 bg-transparent text-coinSinoTextColor2 "
                  }`}
                >
                  Check Now
                </button>
              )}
            </div>
          ) : (
            <p
              className=" cursor-pointer self-center rounded-xl bg-coinSinoGreen p-3 text-center   font-bold text-coinSinoTextColor sm:mb-5"
              onClick={() => {
                setwalletModal(true);
              }}
            >
              Connect Wallet
            </p>
          )}
        </div>
      )}
      <div className=" my-5  p-2">
        {rewardMessage && (
          <div className="space-y-5 text-center text-white">
            {/* <h2 className="text-2xl text-coinSinoTextColor2 font-bold">Round {currentLotteryId}</h2> */}
            <p className="text-lg font-bold first-letter:capitalize">
              {rewardMessage}
            </p>

            {unClaimedUserRewards > 0 && (
              <img
                src="./images/congratulations.gif"
                className="  mx-auto mt-0 w-80 "
              />
            )}

            {unClaimedUserRewards > 0 && (
              <h1>
                You have a total of{" "}
                <strong className="text-coinSinoGreen">
                  {unClaimedUserRewards}
                </strong>{" "}
                Tlos to be claimed.
              </h1>
            )}
            {userTickets.length > 0 && (
              <button
                onClick={() => setVieWinningTickets(true)}
                className="joinBtn bg-coinSinoPink "
              >
                View Tickets
              </button>
            )}
            {viewWinningTickets && (
              <div>
                {/* edit Tickets */}
                <Transition appear show={viewWinningTickets} as={Fragment}>
                  <Dialog
                    as="div"
                    className="relative z-10 "
                    open={viewWinningTickets}
                    onClose={closeViewTickets}
                  >
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0   bg-white bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                      <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className="w-full min-w-[300px] max-w-[350px] transform space-y-5 overflow-hidden rounded-2xl bg-coinSinoPurple  p-6 text-left align-middle text-white shadow-xl transition-all">
                            <Dialog.Title
                              as="h3"
                              className="flex  justify-between text-lg font-extrabold leading-6 "
                            >
                              Round {roundCount}
                              <XIcon
                                className="h-7 cursor-pointer p-1 text-coinSinoGreen"
                                onClick={() => {
                                  closeViewTickets();
                                }}
                              />
                            </Dialog.Title>

                            <div className=" text-md space-y-10 border-t-[1px] border-coinSinoTextColor2 text-center">
                              <h2 className="my-5 font-bold text-coinSinoTextColor">
                                Winning Number
                              </h2>
                              <RandomImage />
                            </div>
                            <p className="flex justify-between">
                              <span className=" text-xs text-white">
                                Total tickets
                              </span>{" "}
                              <span className="">{userTickets.length}</span>
                            </p>

                            <p className="flex justify-between">
                              <span className=" text-xs text-white">
                                Winning tickets
                              </span>{" "}
                              <span className="">{wonTicketSize}</span>
                            </p>

                            <p className="text-sm">
                              You matched the following number(s) in pink
                            </p>

                            <div className="mt-2">
                              <div className="text-sm ">
                                {userTickets.map((e, i) => {
                                  const split = Array.from(String(e));
                                  return (
                                    <div
                                      key={i}
                                      className="my-2 flex w-full items-center justify-between  rounded-2xl  border-[1px] bg-coinSinoPurpleNav p-2 font-bold"
                                    >
                                      {split.map((ee, ii) => (
                                        <p
                                          className={` flex items-center  p-2 text-lg ${wwonid.map(
                                            (wid, iii) =>
                                              wid === i &&
                                              claimpoolLength[iii] >= ii &&
                                              `  h-8  w-8 rounded-full bg-coinSinoPink font-bold`
                                          )}    `}
                                          key={i}
                                        >
                                          {ee}
                                        </p>
                                      ))}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              </div>
            )}

            {unClaimedUserRewards > 0 && (
              <div className=" mx-auto w-full max-w-[200px] space-y-5 p-2">
                {claimming ? (
                  Loading()
                ) : (
                  <button onClick={Claim} className=" joinBtn w-full">
                    Claim Now
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        <Tabs.Group aria-label="finished rounds" style="underline">
          <Tabs.Item active={true} title="All History">
            {/* all history content */}
            <div>
              <div className="flex justify-between p-3">
                <PlayIcon
                  onClick={previousDraws}
                  className=" h-10  rotate-180  cursor-pointer rounded-full  bg-white text-coinSinoPurple "
                />

                <div className=" ">
                  <div className="mx-auto my-2 w-fit space-y-2 text-center">
                    <h2 className="font-bold text-coinSinoTextColor ">Round</h2>
                    <p className="bg-coinSinoPurple p-2 text-xl font-bold text-coinSinoGreen ">
                      {roundCount > 0 && <p> #{roundCount} </p>}
                    </p>
                  </div>{" "}
                  {lastDrawTime.antePost ? (
                    <div className="my-5 text-coinSinoTextColor2 ">
                      <span>{lastDrawTime.month}</span> {""}
                      <span>{lastDrawTime.date}</span> {""}
                      <span>{lastDrawTime.year}</span> {""}
                      <span>{lastDrawTime.hour}</span>:
                      <span>{lastDrawTime.minute}</span> {""}
                      <span>{lastDrawTime.antePost}</span> {""}
                    </div>
                  ) : (
                    <div className="waiting w-40 md:w-80"></div>
                  )}
                </div>
                <PlayIcon
                  onClick={nextDraws}
                  className=" h-10  cursor-pointer rounded-full bg-white text-coinSinoPurple"
                />
              </div>
              <div className=" text-md space-y-10 border-t-[1px] border-coinSinoTextColor2 text-center">
                <h2 className="my-5 font-bold text-coinSinoTextColor">
                  Winning Number
                </h2>
                <RandomImage />
                {currentAccount && (
                  <p>
                    You had{" "}
                    <strong className="textlg font-bold text-coinSinoGreen">
                      {userTickets.length}
                    </strong>{" "}
                    ticket for this round.{" "}
                    <span
                      className="block cursor-pointer italic text-coinSinoGreen underline"
                      onClick={(e) => setviewTicketOpen(true, e)}
                    >
                      view your ticket
                    </span>
                  </p>
                )}
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Your History">
            {currentAccount ? (
              <>
                {" "}
                <div className="flex justify-between font-bold  text-coinSinoGreen ">
                  <span>#</span>
                  <span>Date</span>
                  <span>Your Tickets</span>
                </div>{" "}
                <div className="my-4  flex max-h-10 items-center justify-between  text-xs font-bold text-coinSinoTextColor2">
                  <span>{roundCount}</span>
                  {lastDrawTime.month ? (
                    <div className="my-5 text-coinSinoTextColor2 ">
                      <span>{lastDrawTime.month}</span> {""}
                      <span>{lastDrawTime.date}</span> {""}
                      <span>{lastDrawTime.year}</span> {""}
                      <span>{lastDrawTime.hour}</span>:
                      <span>{lastDrawTime.minute}</span> {""}
                      <span>{lastDrawTime.antePost}</span> {""}
                    </div>
                  ) : (
                    <div className="waiting w-40 md:w-80"></div>
                  )}
                  <span className="">{userTickets.length}</span>
                </div>
              </>
            ) : (
              <div className=" flex flex-col justify-center space-y-5 p-5 text-center text-coinSinoTextColor2">
                {" "}
                <p>Connect your wallet to check your history</p>{" "}
                <p
                  className="w-[200px] cursor-pointer self-center rounded-xl bg-coinSinoGreen p-3 font-bold   text-coinSinoTextColor outline-none sm:mb-5"
                  onClick={() => {
                    setwalletModal(true);
                  }}
                >
                  Connect Wallet
                </p>
              </div>
            )}
          </Tabs.Item>
        </Tabs.Group>
      </div>

      <ViewTickets />
    </section>
  );
}

export default SectionB;
