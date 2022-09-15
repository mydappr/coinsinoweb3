import { Tabs } from "flowbite-react";
import CountUp from "react-countup";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Sinoabi from "../utils/Coinsino.json";
import moment from "moment";
import { useRecoilState } from "recoil";

import WalletConnectProvider from "@walletconnect/web3-provider";
import { BeakerIcon, PlayIcon } from "@heroicons/react/solid";

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
} from "../atoms/atoms";
import BuyDialog from "./buyDialog";
import { providers } from "ethers";
import OperatorFunctions from "./OperatorFunctions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";
import { async } from "@firebase/util";

// coinsino contract address
const coinSinoContractAddress = "0xdC9d2bBb598169b370F12e45D97258dd34ba19C0";
const Pending = 0;
const Open = 1;
const closed = 2;
const claimable = 3;

function SectionA({ keys }) {
  const { startLottery, closeLottery, drawLottery } = OperatorFunctions(keys);
  const [buyModalStat, setbuyModalStat] = useRecoilState(buyModal);
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
  const nextDraw = () => {
    // today
    if (!endTime) return;
    const todaydraw = moment.unix(endTime).utcOffset(0);
    todaydraw.toISOString();
    todaydraw.format();
    let tomorrow = moment(todaydraw.add(1, "days").local());
    console.log(tomorrow);

    const date = tomorrow.date();
    const month = tomorrow.format("MMM");
    const year = tomorrow.year();
    const hour = tomorrow.format("h");
    const minute = tomorrow.format("mm");

    const antePost = tomorrow.format("A");

    setNextDayDraw({
      hour,
      date,
      month,
      hour,
      minute,
      antePost,
    });
  };

  useEffect(() => {
    nextDraw();
  }, [endTime]);

  // const LotteryInfo = async () => {
  //   try {
  //     // signers wallet get smartcontract
  //     const rpcUrl = "https://testnet.telos.net/evm";

  //     // signers wallet get smartcontract
  //     const operatorProvider = new ethers.providers.JsonRpcProvider(rpcUrl);

  //     // operator signer and contract
  //     const operatorSigner = new ethers.Wallet(keys.opkey, operatorProvider);
  //     const operatorcoinSinoContract = new ethers.Contract(
  //       coinSinoContractAddress,
  //       Sinoabi,
  //       operatorSigner
  //     );
  //     // current lotteryid
  //     const currentLotteryId = await convertHexToInt(
  //       await operatorcoinSinoContract.viewCurrentLotteryId()
  //     );

  //     const getLotterystatus = await operatorcoinSinoContract.viewLottery(
  //       currentLotteryId
  //     );

  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // useEffect(() => {
  //   LotteryInfo();
  // }, []);
  async function convertInput(date) {
    const splitDate = date.split(" ");
    const value = parseInt(splitDate[0]);
    const interval = splitDate[1];
    const epoch = moment(new Date()).add(value, interval).toDate();
    const _epoch = moment(epoch).unix();
    return _epoch;
  }

  const initialStartTime = async () => {
    const initialTime = await convertInput("5 minutes");

    if (lotteryStatus === 0 && !endTime) {
      return initialTime;
    } else {
      return null;
    }
  };

  useEffect(() => {
    let intervalId = setInterval(initialStartTime, 1000);

    return () => clearInterval(intervalId);
  }, [lotteryStatus, endTime]);

  async function countdown() {
    const initalT = await initialStartTime();

    let Time = moment.unix(endTime ? endTime : initalT).format();

    const dateString = moment(Time);
    const now = moment();
    const y = dateString.year();
    const mo = dateString.month();
    const d = dateString.date();
    const h = dateString.hours();
    const m = dateString.minute();
    const s = dateString.seconds();

    let maxTime = moment();
    maxTime.set({ date: d, hour: h, minute: m, second: s, millisecond: 0 });

    if (now > maxTime) {
      if (!endTime) return;
      setCoundown({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      setTimeElapsed(true);
      // if (
      //   countDown.days === 0 &&
      //   countDown.hours === 0 &&
      //   countDown.minutes === 0 &&
      //   countDown.seconds === 0
      // ) {
      //   // maxTime = moment();
      //   // maxTime.set({ date: d, hour: h, minute: m, second: s, millisecond: 0 });
      //   console.log(lotteryStatus);
      //   if (lotteryStatus === Open) {
      //     console.log("close");

      //     await closeLottery();
      //   } else if (lotteryStatus === closed) {
      //     console.log("drawit");

      //     await drawLottery();
      //   } else if (lotteryStatus === Pending || lotteryStatus === claimable) {
      //     console.log("start");

      //     await startLottery();
      //   }
      // }
      return;
    }
    setTimeElapsed(false);
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
  }, [endTime, countDown, rngData]);

  return (
    <>
      <section
        ref={toStart}
        className="  my-0   mx-auto mt-10 mb-20 w-full p-2 text-white md:max-w-2xl lg:max-w-4xl    xl:max-w-6xl   "
      >
        {/* toast Message */}
        <ToastContainer />
        <div className=" mx-auto mt-0 h-[300px] w-full bg-[url('/images/heroBg.png')] bg-cover bg-right  md:h-[500px]">
          <div className="mx-auto flex h-full  max-w-[300px] flex-col justify-between text-center  ">
            <h2 className="mt-2 text-base font-bold text-coinSinoTextColor md:mt-3">
              The pool lottery
            </h2>

            <div className="    ">
              <p>Total price:</p>
              {totalLotteryDeposit ? (
                <h2 className="mx-auto mt-1 w-60 rounded-lg  border-2 border-coinSinoGreen  bg-coinSinoGreen px-5 py-3 text-2xl font-bold  antialiased md:px-10 lg:text-3xl">
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
                disabled={timeElasped}
                className={`w-[200px] cursor-pointer self-center rounded-xl bg-coinSinoGreen p-3   font-bold text-coinSinoTextColor sm:mb-5 ${
                  timeElasped && "cursor-not-allowed bg-gray-600"
                }`}
                onClick={() => {
                  setbuyModalStat(true);
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
          ) : timeElasped ? (
            <>
              {lotteryStatus === claimable ? (
                <div>
                  {" "}
                  <h2>Lottery Drawn!</h2>
                  <h2>A new Lottery Starting Soon!</h2>
                </div>
              ) : (
                <div className="relative h-40 bg-[url('/images/Draw.gif')] bg-contain bg-center bg-no-repeat">
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
              )}
            </>
          ) : (
            ""
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
                    <strong className=" text-lg text-coinSinoGreen">
                      {userTickets.length}
                    </strong>{" "}
                    ticket for this round
                  </span>
                </p>
              )}
            </div>

            <img
              className="  mt-5 max-h-[300px] w-[300px]  object-contain   sm:max-h-[20%] sm:max-w-[20%]"
              src={"/images/gift.png"}
            />
          </div>

          <BuyDialog />

          {/* list of pools */}
          <div className=" my-5 flex flex-wrap justify-between  gap-2 p-2 sm:p-10">
            <div>
              {currentAccount ? (
                <button
                  disabled={timeElasped || lotteryStatus !== Open}
                  className={`joinBtn ${
                    (timeElasped || lotteryStatus !== Open) &&
                    "cursor-not-allowed bg-gray-600"
                  }`}
                  onClick={() => {
                    setbuyModalStat(true);
                  }}
                >
                  Join Tlos pool
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
                Join SOL pool
              </p>
              <p className=" mt-3 text-center">
                Total SOL: <strong className=" text-coinSinoGreen">0</strong>
              </p>
            </div>
          </div>
          <p className=" mt-3 p-2 text-center text-lg text-coinSinoTextColor">
            Match the winning numbers in the same order and share prizes:
            Current prizes for grabs
          </p>

          {/* winninn numbers */}

          <div className=" mx-auto my-0    max-w-[700px]">
            <Tabs.Group aria-label="Tabs with underline" style="underline">
              <Tabs.Item active={true} title="Tlos">
                <div className="flex   flex-wrap justify-start gap-2 sm:justify-start">
                  <div className=" poolBar">
                    <h2 className="text-base  font-bold  text-coinSinoTextColor">
                      March first 1
                    </h2>
                    <strong className="text-lg font-bold  text-coinSinoGreen">
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
                      March first 2
                    </h2>
                    <strong className="text-lg font-bold text-coinSinoGreen">
                      <CountUp
                        duration={3}
                        separator=" "
                        decimals={3}
                        decimal="."
                        end={secondPoolFunds}
                      />
                      TLOS
                    </strong>
                    <p className=" text-center   text-coinSinoTextColor2">
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
                    <h2 className="text-lg font-bold  text-coinSinoTextColor">
                      March first 3
                    </h2>
                    <strong className="text-lg font-bold text-coinSinoGreen">
                      <CountUp
                        duration={3}
                        separator=" "
                        decimals={3}
                        decimal="."
                        end={thirdPoolFunds}
                      />{" "}
                      TLOS
                    </strong>
                    <p className=" text-center   text-coinSinoTextColor2">
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
                    <h2 className="text-lg font-bold  text-coinSinoTextColor">
                      March first 4
                    </h2>
                    <strong className="text-lg font-bold text-coinSinoGreen">
                      <CountUp
                        duration={3}
                        separator=" "
                        decimals={3}
                        decimal="."
                        end={fourthPoolFunds}
                      />{" "}
                      TLOS
                    </strong>
                    <p className=" text-center   text-coinSinoTextColor2">
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
                    <h2 className="text-lg font-bold  text-coinSinoTextColor">
                      March first 5
                    </h2>
                    <strong className="text-lg font-bold text-coinSinoGreen">
                      <CountUp
                        duration={3}
                        separator=" "
                        decimals={3}
                        decimal="."
                        end={fifthPoolFunds}
                      />{" "}
                      TLOS
                    </strong>
                    <p className=" text-center   text-coinSinoTextColor2">
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
                    <h2 className="text-lg font-bold  text-coinSinoTextColor">
                      March first 6
                    </h2>
                    <strong className="text-lg font-bold text-coinSinoGreen">
                      <CountUp
                        duration={3}
                        separator=" "
                        decimals={3}
                        decimal="."
                        end={sixthPoolFunds}
                      />{" "}
                      TLOS
                    </strong>
                    <p className=" text-center   text-coinSinoTextColor2">
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
                    <h2 className="text-lg font-bold  text-coinSinoTextColor">
                      Platform fee
                    </h2>
                    <strong className="text-lg font-bold text-coinSinoGreen">
                      <CountUp
                        duration={3}
                        separator=" "
                        decimals={3}
                        decimal="."
                        end={platFormFee}
                      />{" "}
                      TLOS
                    </strong>
                    <p className=" text-center   text-coinSinoTextColor2">
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
              </Tabs.Item>

              <Tabs.Item disabled={true} title="BNB(Inactive)" />
              <Tabs.Item disabled={true} title="ETH(Inactive)">
                Settings content
              </Tabs.Item>
              {/* <Tabs.Item disabled={true} title="SOL(Inactive)">
          Contacts content
        </Tabs.Item> */}
            </Tabs.Group>
          </div>
        </div>
      </section>
    </>
  );
}
// dynamic(() => Promise.resolve(SectionA), { ssr: false });
export default SectionA;
