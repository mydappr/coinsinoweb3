import Head from "next/head";
import Header from "../components/header";
import Footer from "../components/footer";
import { Disclosure } from "@headlessui/react";
import {
  CheckCircleIcon,
  ChevronUpIcon,
  XCircleIcon,
} from "@heroicons/react/solid";

function Faq() {
  const winning_Number_Example = 264939;
  const splittedWinningValues = Array.from(String(winning_Number_Example));
  return (
    <>
      {" "}
      <Head>
        <title>Coinsino Faq</title>
        <meta name="description" content="How to play coinsino" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="mx-auto my-10  md:max-w-2xl    lg:max-w-4xl  xl:max-w-6xl">
        <div className="p-5">
          <div className="flex flex-col justify-between  text-coinSinoTextColor">
            {/* how to play */}

            <div className="mx-auto    items-center sm:flex sm:w-full sm:justify-between sm:space-x-10 ">
              <div className="">
                {" "}
                <h1 className="m-5 text-center text-2xl font-bold text-coinSinoGreen sm:m-0 sm:text-start ">
                  How to Enter Lottery
                </h1>
                <p className="mx-auto mb-2 max-w-xs text-center  sm:text-start sm:font-bold sm:leading-loose  ">
                  The lottery is open for you to join, you can follow this
                  simple step to begin{" "}
                </p>
              </div>
              <div className="mx-auto w-full max-w-md rounded-2xl bg-slate-300 p-2 text-coinSinoPurpleNav">
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                        <span>Step1: Connect your wallet</span>

                        <ChevronUpIcon
                          className={`${
                            open ? "rotate-180 transform" : ""
                          } h-5 w-5 text-purple-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                        Make sure you have the supported crypto token then
                        afterwards connect your wallet by clicking &apos;connect
                        wallet&apos;.
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure as="div" className="mt-2">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                        <span>Step2: Purchase Tickets</span>
                        <ChevronUpIcon
                          className={`${
                            open ? "rotate-180 transform" : ""
                          } h-5 w-5 text-purple-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm ">
                        Click the buy ticket button, you can manually edit your
                        tickets or randomly generate tickets. Max buy at once is
                        50 tickets but you can purchase 50 tickets as many as
                        you wish.
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                <Disclosure as="div" className="mt-2">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                        <span>Step3: The draw is a must </span>

                        <ChevronUpIcon
                          className={`${
                            open ? "rotate-180 transform" : ""
                          } h-5 w-5 text-purple-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                        Wait for the draw to check if you are lucky. The draw
                        happens at least once everyday between 1:00 AM UTC
                        daily.
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                <Disclosure as="div" className="mt-2">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                        <span>Step4: Check to see if you won</span>

                        <ChevronUpIcon
                          className={`${
                            open ? "rotate-180 transform" : ""
                          } h-5 w-5 text-purple-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm ">
                        Always check back to see if you won after the lottery
                        has been drawn. Click "Check if you won".
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>
            </div>

            <div className="my-10 border  border-white/30"></div>
            {/* winning criteria */}
            <div className=" w-full md:flex md:items-center md:justify-between  md:space-x-10">
              <div className="relative max-w-2xl space-y-5 text-sm leading-relaxed">
                <h2 className=" text-lg  font-extrabold capitalize text-coinSinoGreen">
                  winning Criteria
                </h2>
                <h3 className="font-bold">
                  The digits on your ticket must match in the correct order to
                  win.
                </h3>
                <p>Here’s an example lottery draw, with two tickets, A and B</p>
                <p> </p>
                <p className="ml-5">
                  {" "}
                  Ticket A: Even though the last 5 digits match, the first digit
                  is wrong, so this ticket doesn’t win a prize.
                </p>
                <p className="ml-5">
                  {" "}
                  Ticket B: Even though the last 5 digits match, the first digit
                  is wrong, so this ticket doesn’t win a prize.
                </p>
                <p>
                  Prize brackets don’t ‘stack’: if you match the first 3 digits
                  in order, you’ll only win prizes from the ‘Match 3’ bracket,
                  and not from ‘Match 1’ and ‘Match 2’.
                </p>
              </div>
              {/* criteria image */}
              {/* fake winning number */}

              <div className="mx-auto my-5 w-fit rounded-xl border-2 border-coinSinoGreen bg-black/20 p-2">
                {" "}
                <h2 className="  text-center font-bold capitalize text-coinSinoGreen">
                  example of a winnig number
                </h2>
                <div className="mx-auto  mt-0 flex  w-64 max-w-lg   items-center  justify-between space-x-2  ">
                  {splittedWinningValues.map((e, i) => {
                    console.log(e);
                    const balls =
                      i === 0
                        ? "pinkball"
                        : i == 1
                        ? "brownball"
                        : i == 2
                        ? "deepgreenball"
                        : i == 3
                        ? "pinkball"
                        : i == 4
                        ? "greenball"
                        : "yellowball";
                    const negetiveAngle = i % 2 !== 0 ? "-" : "";

                    return (
                      <div
                        key={i}
                        className={`relative  h-[45px] w-[80%]     items-center    rounded-full  bg-center sm:h-[50px]  ${negetiveAngle}rotate-12  bg-[url('/images/${balls}.svg')] bg-no-repeat `}
                      >
                        <div className="shadow-[2px]  absolute right-0 left-0 top-2 bottom-0 text-center  text-[21px]   font-bold   blur-[0.8px] sm:text-[20px] ">
                          {e}
                        </div>
                        <div className="shadow-[2px] absolute right-0 left-3 top-2  text-[20px]    font-bold text-black sm:text-[20px]">
                          {e}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div>
                  {/* winning first 3 numbers*/}
                  <h3 className="my-5 text-center font-semibold capitalize text-coinSinoGreen">
                    Example of ticket A
                  </h3>
                  <div className="mx-auto   mt-5 flex w-[250px]   items-center justify-between space-x-7    rounded-full font-extrabold     ">
                    <div className="relative flex w-[50%] items-center   justify-between rounded-full border-2  border-green-500 p-1">
                      <CheckCircleIcon className="absolute left-0 -top-4 h-4 text-coinSinoGreen" />
                      <p>2</p>
                      <CheckCircleIcon className="absolute left-12 -top-4 h-4 text-coinSinoGreen" />{" "}
                      <p>6</p>
                      <CheckCircleIcon className="absolute left-24 -top-4 h-4 text-coinSinoGreen" />{" "}
                      <p>4</p>
                    </div>{" "}
                    <div className="  relative flex w-[50%] items-center justify-between rounded-full p-1  text-gray-600">
                      {" "}
                      <XCircleIcon className="absolute left-0 -top-4 h-4 text-coinSinoPink" />{" "}
                      <p>7</p>{" "}
                      <CheckCircleIcon className="absolute left-12 -top-4 h-4 text-coinSinoGreen" />{" "}
                      <p>3</p>{" "}
                      <CheckCircleIcon className="absolute left-24 -top-4 h-4 text-coinSinoGreen" />{" "}
                      <p>9</p>{" "}
                    </div>
                  </div>

                  {/* winning last 5 numbers */}
                  <h3 className="my-5 text-center font-semibold capitalize text-coinSinoGreen">
                    Example of ticket b
                  </h3>
                  <div className="mx-auto  mt-10 flex max-w-[250px] items-center   justify-between  space-x-7 rounded-full    font-extrabold text-gray-600     ">
                    <div className="relative flex w-[50%] justify-between   rounded-full p-1">
                      <XCircleIcon className="absolute left-0 -top-4 h-4 text-coinSinoPink" />
                      <p>6</p>
                      <CheckCircleIcon className="absolute left-12 -top-4 h-4 text-coinSinoGreen" />{" "}
                      <p>6</p>
                      <CheckCircleIcon className="absolute left-24 -top-4 h-4 text-coinSinoGreen" />{" "}
                      <p>4</p>
                    </div>{" "}
                    <div className=" relative flex w-[50%] items-center justify-between p-1  ">
                      {" "}
                      <CheckCircleIcon className="absolute left-0 -top-4 h-4 text-coinSinoGreen" />{" "}
                      <p>9</p>{" "}
                      <CheckCircleIcon className="absolute left-12 -top-4 h-4 text-coinSinoGreen" />{" "}
                      <p>3</p>{" "}
                      <CheckCircleIcon className="absolute left-24 -top-4 h-4 text-coinSinoGreen" />{" "}
                      <p>9</p>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-10 border border-white/30"></div>

            {/* price funds */}
            <div>
              <div className="md:flex md:items-center md:justify-between md:space-x-5">
                <div className="max-w-sm space-y-5 ">
                  {" "}
                  <h2 className="my-2  text-lg font-extrabold text-coinSinoGreen">
                    Prize Funds
                  </h2>
                  <p>
                    The prizes for each lottery round come from three sources:
                  </p>{" "}
                  <div>
                    <h3 className="font-extrabold text-coinSinoGreen">
                      Ticket Purchases
                    </h3>
                    <p className="ml-2 text-sm leading-relaxed">
                      100% of the CAKE paid by people buying tickets that round
                      goes back into the prize pools.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-coinSinoGreen">
                      Rollover Prizes
                    </h3>
                    <p className="ml-2 text-sm leading-relaxed">
                      After every round, if nobody wins in one of the prize
                      brackets, the unclaimed CAKE for that bracket rolls over
                      into the next round and are redistributed among the prize
                      pools.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-coinSinoGreen">
                      CAKE Injections
                    </h3>
                    <p className="ml-2 text-sm leading-relaxed">
                      {" "}
                      An average total of 35,000 CAKE from the treasury is added
                      to lottery rounds over the course of a week. This CAKE is
                      of course also included in rollovers! Read more in our
                      guide to CAKE Tokenomics.
                    </p>
                  </div>
                </div>
                {/* price funds image */}
                <div className="mx-auto my-5 w-full max-w-md rounded-xl border-2 border-coinSinoGreen bg-black/20 p-2">
                  <div height="auto" className="flex flex-col">
                    <div className="bg-[url('/images/pieChart.png')] bg-contain bg-no-repeat bg-white rounded-full w-[200px] h-[200px] self-center"></div>
                    <div className="my-2 space-y-2">
                      <div className="flex items-center  justify-between text-center text-sm font-semibold   capitalize text-coinSinoGreen">
                        <h3>Digits matched</h3>
                        <h3>Prize pool allocation</h3>
                      </div>

                      <div className="flex items-center justify-between rounded-full  border border-coinSinoGreen/20 p-1 text-sm">
                        <p>Matches first 1</p>
                        <p>3%</p>
                      </div>
                      <div className="flex items-center  justify-between rounded-full  border border-coinSinoGreen/20 p-1  text-sm">
                        <p>Matches first 2</p>
                        <p>4%</p>
                      </div>
                      <div className="flex items-center justify-between rounded-full  border border-coinSinoGreen/20 p-1  text-sm">
                        <p>Matches first 3</p>
                        <p>10%</p>
                      </div>
                      <div className="flex items-center justify-between rounded-full  border border-coinSinoGreen/20 p-1  text-sm">
                        <p>Matches first 4</p>
                        <p>13%</p>
                      </div>
                      <div className="flex items-center  justify-between rounded-full  border border-coinSinoGreen/20 p-1 text-sm">
                        <p>Matches first 5</p>
                        <p>21%</p>
                      </div>
                      <div className="flex items-center  justify-between rounded-full  border border-coinSinoGreen/20 p-1 text-sm">
                        <p>Matches first 6</p>
                        <p>41%</p>
                      </div>
                      <div className="flex items-center justify-between rounded-full  border border-coinSinoGreen/20 p-1  text-sm">
                        <p>Platform fee</p>
                        <p>8%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Faq;
