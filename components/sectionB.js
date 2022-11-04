import { useEffect, useState, Fragment, useRef } from "react";
import CountUp from "react-countup";
import { PlayIcon } from "@heroicons/react/solid";
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
  networkID,
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
import { XIcon } from "@heroicons/react/solid";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { NonceManager } from "@ethersproject/experimental";

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
  const [chainId, setChainId] = useRecoilState(networkID);
  const [viewWinningTickets, setVieWinningTickets] = useState(false);
  const [wonCliamId, setWonCliamId] = useState([]);
  const [isready, setisReady] = useState(false);
  const [allHistory, setAllHistory] = useState(true);
  const [yourHistory, setYourHistory] = useState(false);
  const setRoundValueRef = useRef();

  //  get operatorSigner
  const getOperatorSigner = () => {
    // signers wallet get smartcontract
    const operatorProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const operatorSigner = new ethers.Wallet(keys, operatorProvider);
    const managedSigner = new NonceManager(operatorSigner);
    const operatorcoinSinoContract = new ethers.Contract(
      coinSinoContractAddress,
      Sinoabi,
      managedSigner
    );
    return operatorcoinSinoContract;
  };

  const getUserProvider = async () => {
    let provider;
    if (providerConnector === "walletConnect") {
      provider = new WalletConnectProvider({
        rpc: {
          [41]: rpcUrl,
        },
      });
    } else if (providerConnector === "metaMask") {
      provider = window.ethereum;
    }
    return provider;
  };

  // to close view ticketModal
  function closeViewTickets() {
    setVieWinningTickets(false);
  }

  // it sets lastRound on launch and on currentlotteryId chaange
  useEffect(() => {
    let isSubscribed = true;

    if (currentLotteryId && isSubscribed) {
      setRoundCount(currentLotteryId - 1);
    }

    return () => (isSubscribed = false);
  }, [currentLotteryId]);

  // Lottery statuses
  const Pending = 0;
  const Open = 1;
  const closed = 2;
  const claimable = 3;

  // reward Calculator
  let _ticketIds;
  let _tickets;
  let _rewards;
  let _rewardpools;
  let won_ticketids = [];
  let won_tickets = [];
  let won_rewards = [];
  let won_rewardpool = [];
  const wonId = [];

  const rewardCalculator = async (
    _ticketIds,
    Tickets,
    _rewards,
    _rewardpools
  ) => {
    if (
      providerConnector === "metaMask" ||
      providerConnector === "walletConnect"
    ) {
      const provider = await getUserProvider();

      await provider.enable();

      const web3 = new Web3(provider);

      const coinSinoContract = new web3.eth.Contract(
        Sinoabi,
        coinSinoContractAddress
      );

      _rewards.map((e, i) => {
        if (Number(e) > 0) {
          wonId.push(i);
          won_rewards.push(Number(e));
          won_rewardpool.push(Number(_rewardpools[i]));
          won_ticketids.push(Number(_ticketIds[i]));
          won_tickets.push(Number(_tickets[i]));
        }
      });

      // update reward states
      setWonTicketSize(won_tickets.length);
      setclaimpoolLength(won_rewardpool);
      setwonId(wonId);
      setWonCliamId(won_ticketids);

      // current lottery details
      const getLotterystatus = await coinSinoContract.methods
        .viewLottery(roundCount)
        .call();

      // current lottery status
      const { status } = getLotterystatus;

      if (Number(status) === claimable) {
        if (_ticketIds.length < 1) {
          setRewardMessage("Sorry, you have no ticket for this round");
          setunClaimedUserRewards(null);

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

        setisloading(false);
      }
    }
  };

  // check ticket
  let Check = async () => {
    try {
      setisloading(true);

      if (
        providerConnector === "metaMask" ||
        providerConnector === "walletConnect"
      ) {
        const provider = await getUserProvider();
        await provider.enable();

        const web3 = new Web3(provider);

        const coinSinoContract = new web3.eth.Contract(
          Sinoabi,
          coinSinoContractAddress
        );

        // check if network is metamask
        let _networkId = await web3.eth.getChainId();

        if (_networkId !== chainId) {
          setisloading(false);
          Toast("You are not connected to the Telos Netowrk!");
          return;
        }

        if (!userTickets.length) {
          setRewardMessage("Sorry, you have no ticket for this round");
          setunClaimedUserRewards(null);
          setisloading(false);
          return;
        }

        let _slicedTicketIds = [];
        let _slicedTickets = [];
        let _slicedTewards = [];
        let _slicedTewardpools = [];
        let count = 0;
        let cursor = 0;

        if (userTickets.length >= 10) {
          while (count < userTickets.length) {
            if (count === cursor) {
              const size =
                userTickets.length - cursor < 10
                  ? userTickets.length - cursor
                  : 10;

              const viewMaxRewardsForTicketId = await coinSinoContract.methods
                .viewMaxRewardsForTicketId(
                  currentAccount,
                  roundCount,
                  cursor,
                  size
                )
                .call();
              _slicedTicketIds.push(viewMaxRewardsForTicketId[0]);
              _slicedTickets.push(viewMaxRewardsForTicketId[1]);
              _slicedTewards.push(viewMaxRewardsForTicketId[2]);
              _slicedTewardpools.push(viewMaxRewardsForTicketId[3]);

              cursor = size < 10 ? cursor + size : cursor + 10;
              // if (userTickets.length === cursor) break;
            }

            count++;
          }

          _ticketIds = _slicedTicketIds.flat();
          _tickets = _slicedTickets.flat();
          _rewards = _slicedTewards.flat();
          _rewardpools = _slicedTewardpools.flat();

          rewardCalculator(_ticketIds, _tickets, _rewards, _rewardpools);
        } else {
          const viewMaxRewardsForTicketId = await coinSinoContract.methods
            .viewMaxRewardsForTicketId(
              currentAccount,
              roundCount,
              0,
              userTickets.length
            )
            .call();

          _ticketIds = viewMaxRewardsForTicketId[0];
          _tickets = viewMaxRewardsForTicketId[1];
          _rewards = viewMaxRewardsForTicketId[2];
          _rewardpools = viewMaxRewardsForTicketId[3];

          rewardCalculator(_ticketIds, _tickets, _rewards, _rewardpools);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // claim ticket
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

        // check if network is tlos
        let _networkId = await web3.eth.getChainId();

        if (_networkId !== chainId) {
          setClaiming(false);
          Toast("You are not connected to the Telos Netowrk!");
          return;
        }

        if (lotteryStatus === Pending) return;

        const getLotterystatus = await coinSinoContract.methods
          .viewLottery(roundCount)
          .call();

        // current lottery status
        const { status } = getLotterystatus;

        if (Number(status) === claimable) {
          // Claim now

          const userbalanceBefore = await web3.eth.getBalance(currentAccount);

          const getGasPrice = await web3.eth.getGasPrice();

          console.log(roundCount, wonCliamId, claimpoolLength);

          const claimTickets = await coinSinoContract.methods
            .claimTickets(roundCount, wonCliamId, claimpoolLength)
            .send({ from: currentAccount });

          setClaiming(false);
          setRewardMessage("Reward Claimed!");

          // console.log("climed");
          const userbalanceafter = await web3.eth.getBalance(currentAccount);
        }
      }
    } catch (error) {
      Toast(error);
      console.log(error);
      setClaiming(false);
      setRewardMessage("");
    }
  };

  const fetchRoundDetails = async () => {
    try {
      const operatorcoinSinoContract = getOperatorSigner();
      if (!roundCount || roundCount >= currentLotteryId) return;

      // previous lottery detÇails
      const getLotterystatus = await operatorcoinSinoContract.viewLottery(
        roundCount
      );

      // current lottery status
      const { finalNumber, endTime } = getLotterystatus;

      // convert endTime to real date with mommentjs
      const prevDrawDate = moment.unix(Number(endTime));
      prevDrawDate.toISOString();
      prevDrawDate.format();
      const date = prevDrawDate.date();
      const month = prevDrawDate.format("MMM");
      const year = prevDrawDate.year();
      const hour = prevDrawDate.format("h");
      const minute = prevDrawDate.format("mm");
      const antePost = prevDrawDate.format("A");

      // fetch user's ticket for the round
      setWinningNO(finalNumber);
      setLastDrawTime({
        year,
        hour,
        date,
        month,
        hour,
        minute,
        antePost,
      });
      if (currentAccount) {
        try {
          const viewUserTicketLength =
            await operatorcoinSinoContract.viewUserTicketLength(
              currentAccount,
              roundCount
            );

          const userInfo =
            await operatorcoinSinoContract.viewUserInfoForLotteryId(
              currentAccount,
              roundCount,
              0,
              viewUserTicketLength
            );

          setUserTickets(userInfo[1]);
          setRewardMessage("");
          setRoundValueRef.current.value = roundCount;
          setisReady(true);
        } catch (error) {
          if ((error.reason = "User has no tickets for this lottery")) {
            setUserTickets([]);
            setWinningNO(finalNumber);
            setRoundValueRef.current.value = roundCount;
            setLastDrawTime({
              year,
              hour,
              date,
              month,
              hour,
              minute,
              antePost,
            });
            // setUserTickets([0]);

            setisReady(true);
          }
        }
      }

      // setisReady(true);
    } catch (error) {
      console.log(error.reason);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    (async () => {
      if (isSubscribed) {
        await fetchRoundDetails();
      }
    })();

    return () => (isSubscribed = false);
  }, [currentLotteryId, currentAccount, roundCount]);

  const previousDraws = async (e) => {
    if (roundCount > 1) {
      setisReady(false);
      setRoundCount((prev) => prev - 1);
      setRoundValueRef.current.value = roundCount - 1;
      setRewardMessage("");
      setWinningNO(null);
      setisloading(false);
      setUserTickets([]);
      setLastDrawTime([]);
    }
  };

  const nextDraws = async () => {
    if (roundCount < currentLotteryId - 1) {
      setisReady(false);
      setRoundCount((prev) => prev + 1);
      setRoundValueRef.current.value = roundCount + 1;
      setRewardMessage("");
      setWinningNO(null);
      setisloading(false);
      setUserTickets([]);
      setLastDrawTime([]);
    }
  };

  // firework
  const options = {
    mouse: { click: false, move: false, max: 3 },
  };

  return (
    <section className="   my-0  mx-auto mt-10 mb-40 w-full p-2 text-white md:max-w-2xl lg:max-w-4xl    xl:max-w-6xl   ">
      {/* sjdsjd */}

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

            {unClaimedUserRewards > 0 && rewardMessage != "Reward Claimed!" && (
              <div className="mx-auto mt-0   h-72 w-72 bg-black bg-[url('/images/congratulations.gif')]  bg-cover md:h-96  md:w-96" />
            )}

            {unClaimedUserRewards > 0 && rewardMessage != "Reward Claimed!" && (
              <h1>
                You have a total of{" "}
                <strong className="text-coinSinoGreen">
                  <CountUp
                    duration={3}
                    separator=" "
                    decimals={3}
                    decimal="."
                    end={unClaimedUserRewards}
                  />{" "}
                </strong>{" "}
                Tlos to be claimed.
              </h1>
            )}
            {userTickets.length > 0 && rewardMessage != "Reward Claimed!" && (
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
                {claimming
                  ? Loading()
                  : rewardMessage != "Reward Claimed!" && (
                      <button onClick={Claim} className=" joinBtn w-full">
                        Claim Now
                      </button>
                    )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* jsodjsjd */}

      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul
          className="-mb-px flex flex-wrap text-center text-sm font-medium"
          id="myTab"
          data-tabs-toggle="#myTabContent"
          role="tablist"
        >
          <li className="mr-2" role="presentation">
            <button
              className={`inline-block rounded-t-lg border-b-2  p-4 text-coinSinoTextColor2 outline-none ${
                allHistory &&
                " border-blue-600  text-blue-600 hover:text-blue-600"
              }`}
              onClick={() => {
                setAllHistory(true);
                setYourHistory(false);
              }}
            >
              All History
            </button>
          </li>
          <li className="mr-2" role="presentation">
            <button
              className={`inline-block rounded-t-lg border-b-2  border-transparent p-4 text-coinSinoTextColor2  outline-none ${
                yourHistory &&
                " border-blue-600  text-blue-600 hover:text-blue-600"
              }`}
              id="dashboard-tab"
              data-tabs-target="#dashboard"
              type="button"
              role="tab"
              aria-controls="dashboard"
              aria-selected="false"
              onClick={() => {
                setAllHistory(false);
                setYourHistory(true);
              }}
            >
              Your History
            </button>
          </li>
        </ul>
      </div>
      <div id="myTabContent">
        {allHistory && currentLotteryId > 1 ? (
          <div
            className="rounded-lg  p-4 dark:bg-gray-800"
            id="profile"
            role="tabpanel"
            aria-labelledby="profile-tab"
          >
            {/* all history content */}

            <div>
              <div className="flex items-center justify-between p-3">
                <button onClick={previousDraws}>
                  <PlayIcon
                    className={`h-10 rotate-180   rounded-full bg-white  text-coinSinoPurple hover:bg-coinSinoGreen `}
                  />
                </button>

                <div className=" ">
                  <div className="mx-auto my-2 w-fit space-y-2 text-center">
                    <h2 className="font-bold text-coinSinoTextColor ">Round</h2>
                    <p className="flex items-center justify-center rounded-lg bg-coinSinoPurple p-2 text-xl font-bold text-coinSinoGreen ">
                      <p className="">#</p>
                      {roundCount > 0 && (
                        <textarea
                          ref={setRoundValueRef}
                          type="Number"
                          className=" h-10 w-20 resize-none  overflow-hidden rounded-full  border-none bg-transparent text-center outline-none  active:outline-none"
                          defaultValue={roundCount}
                          onChange={(e) => {
                            e.preventDefault();
                            setisReady(false);
                            let invalidChars = /[^0-9]/gi;
                            if (invalidChars.test(e.target.value)) {
                              e.target.value = e.target.value.replace(
                                invalidChars,
                                ""
                              );
                            }
                            if (e.target.value.trim()) {
                              if (e.target.value >= currentLotteryId) {
                                e.target.value = e.target.value.replace(
                                  e.target.value,
                                  currentLotteryId - 1
                                );
                                setRoundCount(currentLotteryId - 1);
                              } else if (e.target.value == "0") {
                                e.target.value = e.target.value.replace(
                                  e.target.value,
                                  1
                                );
                                setRoundCount(1);
                              }
                              setRoundCount(Number(e.target.value));
                            } else if (e.target.value == "") {
                              setRewardMessage("");
                              setWinningNO(null);
                              setisloading(false);
                              setUserTickets([]);
                              setLastDrawTime([]);
                              setisloading(false);
                            }
                          }}
                        />
                      )}
                    </p>
                  </div>{" "}
                  {lastDrawTime.antePost ? (
                    <div className="my-5 max-h-2 text-coinSinoTextColor2 ">
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
                  onClick={async () => await nextDraws()}
                  className=" h-10  cursor-pointer  rounded-full bg-white text-coinSinoPurple hover:bg-coinSinoGreen"
                />
              </div>
              <div className=" text-md mb-20 max-h-2 space-y-10 border-t-[1px] border-coinSinoTextColor2 text-center">
                <h2 className="my-5 font-bold text-coinSinoTextColor">
                  Winning Number
                </h2>
                <RandomImage />
                {currentAccount && (
                  <p>
                    You had{" "}
                    <strong className="textlg font-bold text-coinSinoGreen">
                      {isready && userTickets.length}
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
          </div>
        ) : (
          allHistory && (
            <div className="text-center text-lg text-coinSinoTextColor2">
              <div>There are no concluded Lottery.</div>
              <p>Please wait for the current lottery to end.</p>{" "}
            </div>
          )
        )}
        {yourHistory && currentLotteryId > 1 ? (
          <div
            className=" rounded-lg  p-4 dark:bg-gray-800"
            id="dashboard"
            role="tabpanel"
            aria-labelledby="dashboard-tab"
          >
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
                  {currentLotteryId > 1 ? (
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
          </div>
        ) : (
          yourHistory && (
            <div className="text-center text-lg text-coinSinoTextColor2">
              <p>
                Please wait for the current lottery to end to view your history.
              </p>{" "}
            </div>
          )
        )}
      </div>

      {/* jsldjlsjd */}

      <ViewTickets />
    </section>
  );
}

export default SectionB;
