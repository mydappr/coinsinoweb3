import { Tabs } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

function SectionA({ data }) {
  const [countDown, setCoundown] = useState({});
  const [nextDayDraw, setNextDayDraw] = useState({});
  const toStart = useRef(null);

  // next Draw day
  const nextDay = (date = new Date()) => {
    const nextDay = new Date(date.getTime());
    nextDay.setUTCDate(date.getDate() + 1);
    return nextDay;
  };

  const nextDraw = () => {
    const now = new Date();
    const date = now.getDate();
    const month = now.toLocaleString("default", { month: "short" });
    const year = now.getFullYear();
    const hour = now.getUTCHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const drawHr = 12;
    if (hour < drawHr) {
      const drawDate = new Date();
      drawDate.setUTCHours(drawHr);

      setNextDayDraw({
        year,
        date,
        month,
        hour: drawDate.getHours(),
        minute,
        second,
      });
    } else {
      const next = nextDay();
      next.setUTCHours(12);
      setNextDayDraw({
        year: next.getFullYear(),
        month: next.toLocaleString("default", { month: "short" }),
        hour: next.getHours(),
        date: next.getDate(),
      });
    }
  };

  useEffect(() => {
    nextDraw();
  }, []);

  // daily countdown timer
  function countdown() {
    const now = new Date();
    const hour = 12;
    const minute = 0;
    const second = 0;

    let maxTime = new Date(
      Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute,
        second
      )
    );

    if (now > maxTime) {
      maxTime = new Date(
        Date.UTC(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          hour,
          minute,
          second
        )
      );
    }

    const countDownDate = maxTime.getTime();

    const timeleft = countDownDate - new Date().getTime();
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
  }, []);

  return (
    <>
      <section
        ref={toStart}
        className="      my-0   mx-auto mt-10 mb-20 w-full p-2 text-white md:max-w-2xl lg:max-w-4xl    xl:max-w-6xl   "
      >
        <div className="relative">
          {" "}
          <img
            src={"/images/heroBg.png"}
            className="h-[300px] w-[100%] object-cover md:h-full lg:object-contain"
          />
          <div className="absolute  top-0 bottom-0 left-[30%] flex flex-col justify-around text-center  sm:left-[40%] sm:justify-between ">
            <h2 className="mt-2 text-base font-bold text-coinSinoTextColor md:mt-3">
              The pool lottery
            </h2>
            <div className="    ">
              <p>Total price:</p>
              <h2 className="mt-1 border-2 border-coinSinoGreen px-5 py-3  text-2xl font-bold md:px-10">
                $800,000
              </h2>
            </div>

            <p className=" w-full cursor-pointer rounded-xl bg-coinSinoGreen   p-3 text-coinSinoTextColor sm:mb-5">
              Get your tickets
            </p>
          </div>
        </div>

        {/* gets your ticket now Time is running */}

        <div className=" mt-20 p-2 text-center ">
          <h1 className="mb-7 text-3xl font-bold text-coinSinoGreen ">
            Get your tickets now!
          </h1>
          <div className="">
            <p className="text-coinSinoTextColor">Times remaining for draw</p>
            <div className="my-5  flex justify-center space-x-2">
              <div className="">
                <div className="inline-flex items-center space-x-2">
                  <h2 className="timeStamp text-3xl">{countDown.days}</h2>
                  <span className="text-3xl font-bold text-coinSinoTextColor2 ">
                    :
                  </span>
                </div>
                <span className="daysStamp">Day</span>
              </div>
              <div>
                <div className="inline-flex items-center space-x-2">
                  <h2 className="timeStamp text-3xl">{countDown.hours}</h2>
                  <span className="text-3xl font-bold text-coinSinoTextColor2 ">
                    :
                  </span>
                </div>

                <span className="daysStamp">Hour</span>
              </div>
              <div>
                <div className="inline-flex items-center space-x-2">
                  <h2 className="timeStamp text-3xl">{countDown.minutes}</h2>
                  <span className="text-3xl font-bold text-coinSinoTextColor2 ">
                    :
                  </span>
                </div>
                <span className="daysStamp">Minutes</span>
              </div>
              <div>
                <div className="inline-flex items-center space-x-2">
                  <h2 className="timeStamp text-3xl">{countDown.seconds}</h2>
                  <span className="text-3xl font-bold text-coinSinoTextColor2 "></span>
                </div>
                <span className="daysStamp">Seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* pool details */}
        <div className=" my-5 border-2 border-coinSinoTextColor2 p-2">
          <div className="  flex   flex-col items-center justify-between border-b-[1px] border-coinSinoTextColor2 sm:flex-row md:justify-between md:p-7 ">
            <div className=" space-y-3 text-base ">
              <p className="">
                <span>Next draw:</span>{" "}
                <span>
                  <strong className=" text-lg text-coinSinoGreen">#4</strong>{" "}
                  <span>{nextDayDraw.month}</span>{" "}
                  <span>{nextDayDraw.date}</span>{" "}
                  <span>{nextDayDraw.year}</span>{" "}
                  <span>{nextDayDraw.hour}</span>:<span>{"00"}</span>
                </span>
              </p>
              <p>
                <span>Total pool price:</span>{" "}
                <strong className=" text-lg text-coinSinoGreen">
                  $800,000
                </strong>
              </p>
              <p>
                <span>Your pool ticket:</span>{" "}
                <span>
                  You have{" "}
                  <strong className=" text-lg text-coinSinoGreen">0</strong>{" "}
                  ticket for this round
                </span>
              </p>
            </div>

            <img
              className="  max-h-[400px]  w-[400px]  object-contain   sm:max-h-[20%] sm:max-w-[20%]"
              src={"/images/gift.png"}
            />
          </div>

          {/* list of pools */}
          <div className=" my-5 flex flex-wrap justify-between  gap-2 p-2 sm:p-10">
            <div>
              <p className="joinBtn">Join Tlos pool</p>
              <p className=" mt-3 text-center">
                Total Tlos:{" "}
                <strong className=" text-coinSinoGreen">200k</strong>
              </p>
            </div>

            <div>
              <p className="joinBtn">Join BNB pool</p>
              <p className=" mt-3 text-center">
                Total BNB: <strong className=" text-coinSinoGreen">200k</strong>
              </p>
            </div>
            <div>
              <p className="joinBtn">Join ETH pool</p>
              <p className=" mt-3 text-center">
                Total ETH: <strong className=" text-coinSinoGreen">200k</strong>
              </p>
            </div>
            <div>
              <p className="joinBtn">Join SOL pool</p>
              <p className=" mt-3 text-center">
                Total SOL: <strong className=" text-coinSinoGreen">200k</strong>
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
                <div className="flex max-w-[700px] flex-wrap justify-between gap-2 sm:justify-start">
                  <div className=" poolBar">
                    <h2 className="text-lg font-bold  text-coinSinoTextColor">
                      March first 1
                    </h2>
                    <strong className="text-2xl font-bold  text-coinSinoGreen">
                      10 TLOS
                    </strong>
                    <p className=" text-center   font-bold text-coinSinoTextColor2">
                      $100
                    </p>
                  </div>
                  <div className="poolBar">
                    <h2 className="text-lg font-bold  text-coinSinoTextColor">
                      March first 2
                    </h2>
                    <strong className="text-2xl font-bold text-coinSinoGreen">
                      20 TLOS
                    </strong>
                    <p className=" text-center   text-coinSinoTextColor2">
                      $100
                    </p>
                  </div>
                  <div className="poolBar">
                    <h2 className="text-lg font-bold  text-coinSinoTextColor">
                      March first 3
                    </h2>
                    <strong className="text-2xl font-bold text-coinSinoGreen">
                      30 TLOS
                    </strong>
                    <p className=" text-center   text-coinSinoTextColor2">
                      $100
                    </p>
                  </div>
                  <div className="poolBar">
                    <h2 className="text-lg font-bold  text-coinSinoTextColor">
                      March first 4
                    </h2>
                    <strong className="text-2xl font-bold text-coinSinoGreen">
                      40 TLOS
                    </strong>
                    <p className=" text-center   text-coinSinoTextColor2">
                      $100
                    </p>
                  </div>
                  <div className="poolBar">
                    <h2 className="text-lg font-bold  text-coinSinoTextColor">
                      March first 5
                    </h2>
                    <strong className="text-2xl font-bold text-coinSinoGreen">
                      50 TLOS
                    </strong>
                    <p className=" text-center   text-coinSinoTextColor2">
                      $100
                    </p>
                  </div>
                  <div className="poolBar">
                    <h2 className="text-lg font-bold  text-coinSinoTextColor">
                      March first 6
                    </h2>
                    <strong className="text-2xl font-bold text-coinSinoGreen">
                      60 TLOS
                    </strong>
                    <p className=" text-center   text-coinSinoTextColor2">
                      $100
                    </p>
                  </div>

                  <div className="poolBar">
                    <h2 className="text-lg font-bold  text-coinSinoTextColor">
                      Platform fee
                    </h2>
                    <strong className="text-2xl font-bold text-coinSinoGreen">
                      10 TLOS
                    </strong>
                    <p className=" text-center   text-coinSinoTextColor2">
                      $100
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
