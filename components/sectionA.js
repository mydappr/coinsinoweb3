import CountUp from "react-countup";
import { useEffect, useRef, useState, Fragment } from "react";
import { ethers } from "ethers";
import Sinoabi from "../utils/Coinsino.json";
import moment from "moment";
import { useRecoilState } from "recoil";
import { XIcon } from "@heroicons/react/solid";
import Image from "next/image";

import {
  latestLotteryId,
  activeAccount,
  totalLotteryFunds,
  userTickets as accountTicket,
  lotteryStatus as Lstatus,
  buyModal,
  burnfee,
  firstpool,
  tlosPrice,
  secondpool,
  thirdpool,
  fourthpool,
  fiftpool,
  sixthpool,
  endLotteryTime,
  winningNumbers,
  usewalletModal,
  timeCountDown,
  drandData,
  sinoAddress,
  rpcaddress,
  networkID,
} from "../atoms/atoms";
import BuyDialog from "./buyDialog";
import { providers } from "ethers";
import OperatorFunctions from "./OperatorFunctions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";
import { async } from "@firebase/util";
import { NonceManager } from "@ethersproject/experimental";
import { Dialog, Transition } from "@headlessui/react";
const Pending = 0;
const Open = 1;
const closed = 2;
const claimable = 3;

function SectionA({ keys }) {
  const [buyModalStat, setbuyModalState] = useRecoilState(buyModal);
  const [countDown, setCoundown] = useRecoilState(timeCountDown);
  const [nextDayDraw, setNextDayDraw] = useState({});
  const [totalLotteryDeposit, setTotalLotteryDeposit] =
    useRecoilState(totalLotteryFunds);
  const [userTickets, setUserTickets] = useRecoilState(accountTicket);
  const [currentLotteryId, setCurrentLotteryId] =
    useRecoilState(latestLotteryId);
  const [currentAccount, setCurrentAccount] = useRecoilState(activeAccount);
  const toStart = useRef(null);
  const [endTime, setEndTime] = useRecoilState(endLotteryTime);
  const [platFormFee, setPlatFormFee] = useRecoilState(burnfee);
  const [telosPrice, setTelosPrice] = useRecoilState(tlosPrice);
  const [firstPoolFunds, setFirstPoolFunds] = useRecoilState(firstpool);
  const [secondPoolFunds, setsecondPoolFunds] = useRecoilState(secondpool);
  const [thirdPoolFunds, setthirdPoolFunds] = useRecoilState(thirdpool);
  const [fourthPoolFunds, setfourthPoolFunds] = useRecoilState(fourthpool);
  const [fifthPoolFunds, setFifthPoolFunds] = useRecoilState(fiftpool);
  const [sixthPoolFunds, setSixthPoolFunds] = useRecoilState(sixthpool);
  const [proverConnector, setProviderConnector] = useState("");
  const [walletModal, setwalletModal] = useRecoilState(usewalletModal);
  const [lotteryStatus, setlotteryStatus] = useRecoilState(Lstatus);
  const [timeElasped, setTimeElapsed] = useState(false);
  const [rngData, setrngData] = useRecoilState(drandData);
  const [currentUserTicket, setCurrentUserTicket] = useState([]);
  const [coinSinoContractAddress, setcoinSinoContractAddress] =
    useRecoilState(sinoAddress);
  const [rpcUrl, setrpcUrl] = useRecoilState(rpcaddress);
  const [chainId, setChainId] = useRecoilState(networkID);
  const [showCurrentTickets, setShowCurrentTickets] = useState(false);
  const [telosPool, setTelosPool] = useState(true);
  const [ethPool, setEthPool] = useState(false);
  const [bnbPool, setBnbPool] = useState(false);

  // closeviewticket
  function closeViewTickets() {
    setShowCurrentTickets(false);
  }

  // get operator signer
  const operatorSignerAndContract = async () => {
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

  // section A updater
  const updater = async () => {
    try {
      const contract = await operatorSignerAndContract();

      let _networkId = await contract.signer.getChainId();

      if (!currentAccount || Number(_networkId) !== chainId) return;

      const viewUserTicketLength = await contract.viewUserTicketLength(
        currentAccount,
        currentLotteryId
      );

      const userInfo = await contract.viewUserInfoForLotteryId(
        currentAccount,
        currentLotteryId,
        0,
        viewUserTicketLength
      );

      setCurrentUserTicket(userInfo[1]);
    } catch (error) {
      setCurrentUserTicket([]);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    (async () => {
      if (isSubscribed) {
        await updater();
      }
    })();

    return () => (isSubscribed = false);
  }, [totalLotteryDeposit, currentAccount, currentLotteryId]);

  // next draw function
  const nextDraw = () => {
    // today
    if (!endTime) return;
    const todaydraw = moment.unix(endTime).utcOffset(0);
    todaydraw.toISOString();
    todaydraw.format();
    let tomorrow = moment(todaydraw.add(1, "days").local());

    const date = tomorrow.date();
    const month = tomorrow.format("MMM");
    const year = tomorrow.year();
    const hour = tomorrow.format("h");
    const minute = tomorrow.format("mm");

    const antePost = tomorrow.format("A");

    setNextDayDraw({
      year,
      date,
      month,
      hour,
      minute,
      antePost,
    });
  };

  useEffect(() => {
    let isSubscribed = true;

    if (isSubscribed) {
      nextDraw();
    }

    return () => (isSubscribed = false);
  }, [endTime]);

  // lottrtery countdown timer
  async function countdown() {
    // const initalT = await initialStartTime();
    if (!endTime) return;
    let Time = moment.unix(endTime).format();
    const dateString = moment(Time);
    const now = moment();
    const y = dateString.year();
    const mo = dateString.month();
    const d = dateString.date();
    const h = dateString.hours();
    const m = dateString.minute();
    const s = dateString.seconds();
    let maxTime = moment();

    maxTime.set({
      year: y,
      month: mo,
      date: d,
      hour: h,
      minute: m,
      second: s,
      millisecond: 0,
    });

    if (now > maxTime) {
      if (!endTime) return;
      setCoundown({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      setTimeElapsed(true);

      return;
    }

    setTimeElapsed(false);

    // countdown calculation
    const countDownDate = moment.unix(maxTime.unix());
    const timeleft = countDownDate - moment();
    const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

    setCoundown({
      days,
      hours,
      minutes,
      seconds,
    });
  }

  useEffect(() => {
    let intervalId = setInterval(countdown, 1000);
    return () => clearInterval(intervalId);
  }, [endTime, countDown, rngData, lotteryStatus]);

  return (
    <>
      <section
        ref={toStart}
        className="  my-0   mx-auto mt-10 mb-20 w-full p-2 text-white md:max-w-2xl lg:max-w-4xl    xl:max-w-6xl   "
      >
        {/* toast Message */}
        <ToastContainer />
        <div className=" mx-auto mt-0 h-[300px] w-full bg-[url('/coinsinoweb3/images/heroBg.png')] bg-cover bg-right  md:h-[500px]">
          <div className="mx-auto flex h-full  max-w-[300px] flex-col justify-between text-center  ">
            <h2 className="mt-2 text-base font-bold text-coinSinoTextColor md:mt-3">
              The pool lottery
            </h2>

            <div className="    ">
              <p>Total price:</p>
              {totalLotteryDeposit ? (
                <h2 className="mx-auto mt-1 w-fit rounded-lg border-2  border-coinSinoGreen bg-coinSinoGreen  px-5 py-2 text-2xl  font-bold  antialiased  md:px-10 lg:w-full lg:text-3xl">
                  <CountUp
                    duration={2}
                    separator=" "
                    decimals={2}
                    decimal="."
                    end={totalLotteryDeposit}
                  />{" "}
                  Tlos
                </h2>
              ) : (
                <div className="waiting w-40 md:w-80"></div>
              )}
            </div>

            {currentAccount ? (
              <button
                disabled={timeElasped || lotteryStatus !== Open}
                className={`w-[200px] cursor-pointer self-center rounded-xl bg-coinSinoGreen p-3   font-bold text-coinSinoTextColor sm:mb-5 ${
                  (timeElasped || lotteryStatus !== Open) &&
                  "cursor-not-allowed bg-gray-600"
                }`}
                onClick={() => {
                  setbuyModalState(true);
                }}
              >
                Get your tickets
              </button>
            ) : (
              <p
                className="w-[200px] cursor-pointer self-center rounded-xl bg-coinSinoGreen p-3   font-bold text-coinSinoTextColor sm:mb-5"
                onClick={() => {
                  setwalletModal(true);
                }}
              >
                Connect Wallet
              </p>
            )}
          </div>
        </div>

        {/* gets your ticket now Time is running */}

        <div className=" mt-20 p-2 text-center ">
          {!timeElasped ? (
            <>
              {" "}
              <h1 className="mb-7 text-3xl font-bold text-coinSinoGreen ">
                Get your tickets now!
              </h1>
              <div className="">
                <p className="text-coinSinoTextColor">
                  Times remaining for draw
                </p>
                {countDown.hours || countDown.minutes || countDown.seconds ? (
                  <div className="my-5  flex justify-center space-x-2">
                    <div className="">
                      <div className="inline-flex items-center space-x-2">
                        <h2 className="timeStamp text-3xl">{countDown.days}</h2>
                        <span className="text-3xl font-bold text-coinSinoTextColor2 ">
                          :
                        </span>
                      </div>
                      <span className="daysStamp">Days</span>
                    </div>
                    <div>
                      <div className="inline-flex items-center space-x-2">
                        <h2 className="timeStamp text-3xl">
                          {countDown.hours}
                        </h2>
                        <span className="text-3xl font-bold text-coinSinoTextColor2 ">
                          :
                        </span>
                      </div>

                      <span className="daysStamp">Hour</span>
                    </div>
                    <div>
                      <div className="inline-flex items-center space-x-2">
                        <h2 className="timeStamp text-3xl">
                          {countDown.minutes}
                        </h2>
                        <span className="text-3xl font-bold text-coinSinoTextColor2 ">
                          :
                        </span>
                      </div>
                      <span className="daysStamp">Minutes</span>
                    </div>
                    <div>
                      <div className="inline-flex items-center space-x-2">
                        <h2 className="timeStamp text-3xl">
                          {countDown.seconds}
                        </h2>
                        <span className="text-3xl font-bold text-coinSinoTextColor2 "></span>
                      </div>
                      <span className="daysStamp">Seconds</span>
                    </div>
                  </div>
                ) : (
                  <div className="waiting w-40 md:w-80"></div>
                )}
              </div>
            </>
          ) : (
            <>
              {lotteryStatus === claimable ? (
                <div>
                  {" "}
                  <h2>Lottery Drawn!</h2>
                  <h2>A new Lottery Starting Soon!</h2>
                </div>
              ) : lotteryStatus === closed ||
                (lotteryStatus === Open && timeElasped) ? (
                <div className="relative h-40 bg-[url('/coinsinoweb3/images/Draw.gif')] bg-contain bg-center bg-no-repeat">
                  <div className=" absolute bottom-0 mx-auto flex  w-full items-center justify-center space-x-1 text-center font-bold">
                    <p>
                      {" "}
                      <strong>Drawing </strong>
                    </p>
                    <div>
                      {" "}
                      <BeatLoader color="#ffffff" size={10} className="mt-2" />
                    </div>
                  </div>
                </div>
              ) : (
                <h2>Fiest Lottery Starting soon!</h2>
              )}
            </>
          )}
        </div>

        {/* pool details */}
        <div className=" my-5 border-2 border-coinSinoTextColor2 p-2">
          <div className="  flex   flex-col items-center justify-between border-b-[1px] border-coinSinoTextColor2 sm:flex-row md:justify-between md:p-7 ">
            <div className=" space-y-3 text-base ">
              <div className=" flex items-center space-x-2 ">
                <p>
                  {" "}
                  <span>Next draw:</span>{" "}
                </p>
                <div>
                  {endTime ? (
                    <span>
                      <strong className=" text-lg text-coinSinoGreen">
                        {currentLotteryId && (
                          <>
                            <span> #</span>
                            {currentLotteryId + 1}
                          </>
                        )}
                      </strong>{" "}
                      <span>{nextDayDraw.month}</span>{" "}
                      <span>{nextDayDraw.date}</span>{" "}
                      <span>{nextDayDraw.year}</span>{" "}
                      <span>{nextDayDraw.hour}</span>:
                      <span>{nextDayDraw.minute}</span>{" "}
                      <span>{nextDayDraw.antePost}</span>
                    </span>
                  ) : (
                    <div className="waiting w-40"></div>
                  )}
                </div>
              </div>
              <p>
                <span>Total pool price:</span>{" "}
                <strong className=" text-lg text-coinSinoGreen">
                  <CountUp
                    duration={3}
                    separator=" "
                    decimals={2}
                    decimal="."
                    end={totalLotteryDeposit}
                  />{" "}
                  Tlos
                </strong>
              </p>
              {currentAccount && (
                <p>
                  <span>Your pool ticket:</span>{" "}
                  <span>
                    You have{" "}
                    <strong
                      onClick={() => setShowCurrentTickets(true)}
                      className=" cursor-pointer text-lg text-coinSinoGreen  hover:bg-coinSinoPurple hover:text-coinSinoGreen"
                    >
                      {currentUserTicket.length}
                    </strong>{" "}
                    ticket for the current round
                  </span>
                </p>
              )}
            </div>

            {/* view ticket */}
            <div>
              <Transition appear show={showCurrentTickets} as={Fragment}>
                <Dialog
                  as="div"
                  className="relative z-10 "
                  open={showCurrentTickets}
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
                            Round {currentLotteryId}
                            <XIcon
                              className="h-7 cursor-pointer p-1 text-coinSinoGreen"
                              onClick={() => {
                                closeViewTickets();
                              }}
                            />
                          </Dialog.Title>

                          {/* <div className=" text-md space-y-10 border-t-[1px] border-coinSinoTextColor2 text-center">
                    <h2 className="my-5 font-bold text-coinSinoTextColor">
                      Winning Number
                    </h2>
                    <RandomImage />
                  </div> */}
                          {currentUserTicket.length > 0 ? (
                            <p className="flex justify-between">
                              <span className=" text-xs text-white">
                                Total tickets
                              </span>{" "}
                              <span className="">
                                {currentUserTicket.length}
                              </span>
                            </p>
                          ) : (
                            <div className=" mx-auto mt-auto space-y-2 text-center">
                              <p> Sorry, you do not have any ticket. </p>
                              <button
                                disabled={timeElasped || lotteryStatus !== Open}
                                className={`w-[100px] cursor-pointer self-center rounded-xl bg-coinSinoGreen p-2   font-bold text-coinSinoTextColor sm:mb-5 ${
                                  (timeElasped || lotteryStatus !== Open) &&
                                  "cursor-not-allowed bg-gray-600"
                                }`}
                                onClick={() => {
                                  setbuyModalState(true);
                                }}
                              >
                                Buy now!
                              </button>
                            </div>
                          )}

                          {/* <p className="flex justify-between">
                    <span className=" text-xs text-white">Winning tickets</span>{" "}
                    <span className="">{wonTicketSize}</span>
                  </p> */}

                          {/* <p className="text-sm">
                    You matched the following number(s) in pink
                  </p> */}

                          <div className="mt-2">
                            <div className="text-sm ">
                              {currentUserTicket.map((e, i) => {
                                const split = Array.from(String(e));
                                return (
                                  <div
                                    key={i}
                                    className="my-2 flex w-full items-center justify-between  rounded-2xl  border-[1px] bg-coinSinoPurpleNav p-2 font-bold"
                                  >
                                    {split.map((ee, ii) => (
                                      <p
                                        className={` flex items-center  p-2 text-lg    `}
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
            {/* end of view ticket */}
            <div className="  mt-5 h-[200px] w-[200px] bg-cover bg-[url('/coinsinoweb3/images/gift.png')]    sm:max-h-[20%] sm:max-w-[20%]"></div>

            {/* 
            <img
              className="  mt-5 max-h-[300px] w-[300px]  object-contain   sm:max-h-[20%] sm:max-w-[20%]"
              src={"/images/gift.png"}
            /> */}
          </div>

          <BuyDialog />

          {/* list of pools */}
          <div className=" my-5 flex flex-wrap justify-between  gap-2 p-2   sm:p-10">
            <div>
              {currentAccount ? (
                <button
                  disabled={timeElasped || lotteryStatus !== Open}
                  className={`joinBtn ${
                    (timeElasped || lotteryStatus !== Open) &&
                    "cursor-not-allowed bg-gray-600"
                  }`}
                  onClick={() => {
                    setbuyModalState(true);
                  }}
                >
                  Join TLOS pool
                </button>
              ) : (
                <p
                  className="joinBtn"
                  onClick={() => {
                    setwalletModal(true);
                  }}
                >
                  Connect Wallet
                </p>
              )}

              <p className=" mt-3 text-center">
                Total Tlos:{" "}
                <strong className=" text-coinSinoGreen">
                  <CountUp
                    duration={3}
                    separator=" "
                    decimals={3}
                    decimal="."
                    end={totalLotteryDeposit}
                  />{" "}
                </strong>
              </p>
            </div>

            <div>
              <p className="joinBtn cursor-not-allowed bg-gray-600">
                Join BNB pool
              </p>
              <p className=" mt-3 text-center">
                Total BNB: <strong className=" text-coinSinoGreen">0</strong>
              </p>
            </div>
            <div>
              <p className="joinBtn cursor-not-allowed bg-gray-600">
                Join ETH pool
              </p>
              <p className=" mt-3 text-center">
                Total ETH: <strong className=" text-coinSinoGreen">0</strong>
              </p>
            </div>
            <div>
              <p className="joinBtn cursor-not-allowed bg-gray-600">
                Join Eos pool
              </p>
              <p className=" mt-3 text-center">
                Total Eos: <strong className=" text-coinSinoGreen">0</strong>
              </p>
            </div>
          </div>
          <p className=" mt-3 p-2 text-center text-base text-coinSinoTextColor">
            Match the winning numbers in the same order and share prizes:
            Current prizes for grabs
          </p>

          {/* pools */}
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
                    telosPool &&
                    " border-blue-600  text-blue-600 hover:text-blue-600"
                  }`}
                  onClick={() => {
                    setEthPool(false);
                    setTelosPool(true);
                    setBnbPool(false);
                  }}
                >
                  Tlos pool
                </button>
              </li>
              <li className="mr-2" role="presentation">
                <button
                  className={`inline-block cursor-not-allowed rounded-t-lg border-b-2  border-transparent p-4 text-coinSinoTextColor2  outline-none ${
                    bnbPool &&
                    " border-blue-600  text-blue-600 hover:text-blue-600"
                  }`}
                  id="dashboard-tab"
                  data-tabs-target="#dashboard"
                  type="button"
                  role="tab"
                  aria-controls="dashboard"
                  aria-selected="false"
                  onClick={() => {
                    setEthPool(false);
                    setTelosPool(false);
                    setBnbPool(true);
                  }}
                >
                  Bnb Pool(Inactive)
                </button>
              </li>

              <li className="mr-2" role="presentation">
                <button
                  disabled={true}
                  className={`inline-block cursor-not-allowed rounded-t-lg border-b-2  border-transparent p-4 text-coinSinoTextColor2  outline-none ${
                    bnbPool &&
                    " border-blue-600  text-blue-600 hover:text-blue-600"
                  }`}
                  id="dashboard-tab"
                  data-tabs-target="#dashboard"
                  type="button"
                  role="tab"
                  aria-controls="dashboard"
                  aria-selected="false"
                  onClick={() => {
                    setEthPool(true);
                    setTelosPool(false);
                    setBnbPool(false);
                  }}
                >
                  Eth Pool(Inactive)
                </button>
              </li>
            </ul>
          </div>

          <div className=" mx-auto my-0 max-w-[700px] p-5    text-center">
            {telosPool && (
              <div className="flex flex-wrap  justify-between gap-2  sm:justify-start ">
                <div className=" poolBar">
                  <h2 className="text-base  font-bold  text-coinSinoTextColor">
                    Match first 1
                  </h2>
                  <strong className="text-base font-bold  text-coinSinoGreen">
                    <CountUp
                      duration={3}
                      separator=" "
                      decimals={3}
                      decimal="."
                      end={firstPoolFunds}
                    />
                    TLOS
                  </strong>
                  <p className=" text-center   font-bold text-coinSinoTextColor2">
                    ~${" "}
                    <CountUp
                      duration={3}
                      separator=" "
                      decimals={3}
                      decimal="."
                      end={telosPrice * firstPoolFunds}
                    />
                  </p>
                </div>
                <div className="poolBar">
                  <h2 className="text-base font-bold  text-coinSinoTextColor">
                    Match first 2
                  </h2>

                  <strong className="text-base font-bold text-coinSinoGreen">
                    <CountUp
                      duration={3}
                      separator=" "
                      decimals={3}
                      decimal="."
                      end={secondPoolFunds}
                    />
                    TLOS
                  </strong>
                  <p className="    text-coinSinoTextColor2">
                    ~$
                    <CountUp
                      duration={3}
                      separator=" "
                      decimals={3}
                      decimal="."
                      end={telosPrice * secondPoolFunds}
                    />
                  </p>
                </div>
                <div className="poolBar">
                  <h2 className="text-base font-bold  text-coinSinoTextColor">
                    Match first 3
                  </h2>
                  <strong className="text-base font-bold text-coinSinoGreen">
                    <CountUp
                      duration={3}
                      separator=" "
                      decimals={3}
                      decimal="."
                      end={thirdPoolFunds}
                    />{" "}
                    TLOS
                  </strong>
                  <p className="    text-coinSinoTextColor2">
                    ~${" "}
                    <CountUp
                      duration={3}
                      separator=" "
                      decimals={3}
                      decimal="."
                      end={telosPrice * thirdPoolFunds}
                    />
                  </p>
                </div>
                <div className="poolBar">
                  <h2 className="text-base font-bold  text-coinSinoTextColor">
                    Match first 4
                  </h2>
                  <strong className="text-base font-bold text-coinSinoGreen">
                    <CountUp
                      duration={3}
                      separator=" "
                      decimals={3}
                      decimal="."
                      end={fourthPoolFunds}
                    />{" "}
                    TLOS
                  </strong>
                  <p className="    text-coinSinoTextColor2">
                    ~${" "}
                    <CountUp
                      duration={3}
                      separator=" "
                      decimals={3}
                      decimal="."
                      end={telosPrice * fourthPoolFunds}
                    />
                  </p>
                </div>
                <div className="poolBar">
                  <h2 className="text-base font-bold  text-coinSinoTextColor">
                    Match first 5
                  </h2>
                  <strong className="text-base font-bold text-coinSinoGreen">
                    <CountUp
                      duration={3}
                      separator=" "
                      decimals={3}
                      decimal="."
                      end={fifthPoolFunds}
                    />{" "}
                    TLOS
                  </strong>
                  <p className="    text-coinSinoTextColor2">
                    ~${" "}
                    <CountUp
                      duration={3}
                      separator=" "
                      decimals={3}
                      decimal="."
                      end={telosPrice * fifthPoolFunds}
                    />
                  </p>
                </div>
                <div className="poolBar">
                  <h2 className="text-base font-bold  text-coinSinoTextColor">
                    Match first 6
                  </h2>
                  <strong className="text-base font-bold text-coinSinoGreen">
                    <CountUp
                      duration={3}
                      separator=" "
                      decimals={3}
                      decimal="."
                      end={sixthPoolFunds}
                    />{" "}
                    TLOS
                  </strong>
                  <p className="    text-coinSinoTextColor2">
                    ~${" "}
                    <CountUp
                      duration={3}
                      separator=" "
                      decimals={3}
                      decimal="."
                      end={telosPrice * sixthPoolFunds}
                    />
                  </p>
                </div>

                <div className="poolBar">
                  <h2 className="text-base font-bold  text-coinSinoTextColor">
                    Platform fee
                  </h2>
                  <strong className="text-base font-bold text-coinSinoGreen">
                    <CountUp
                      duration={3}
                      separator=" "
                      decimals={3}
                      decimal="."
                      end={platFormFee}
                    />{" "}
                    TLOS
                  </strong>
                  <p className="    text-coinSinoTextColor2">
                    ~$
                    <CountUp
                      duration={3}
                      separator=" "
                      decimals={3}
                      decimal="."
                      end={telosPrice * platFormFee}
                    />
                  </p>
                </div>
              </div>
            )}

            {/* <button
                        onClick={() => {
                          setBnbPool(true);
                          setTelosPool(false);
                          setEthPool(false);
                        }}
                        className="text-coinSinoTextColor2"
                      >
                        BNB(Inactive)
                      </button>
                      <button
                        onClick={() => {
                          setBnbPool(false);
                          setTelosPool(false);
                          setEthPool(true);
                        }}
                        className="text-coinSinoTextColor2"
                      >
                        ETH(Inactive)
                      </button> */}
            {/* <Tabs.Item disabled={true} title="SOL(Inactive)">
                    Contacts content
                  </Tabs.Item> */}
          </div>
        </div>
      </section>
    </>
  );
}
// dynamic(() => Promise.resolve(SectionA), { ssr: false });
export default SectionA;
