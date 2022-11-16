import Head from "next/head";
import Header from "../components/header";
import Footer from "../components/footer";
import { Disclosure } from "@headlessui/react";
import {
  CheckCircleIcon,
  ChevronUpIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import { useEffect, useRef, useState } from "react";

function Faq() {
  const winning_Number_Example = 264939;
  const splittedWinningValues = Array.from(String(winning_Number_Example));
  const [lottie, setLottie] = useState();
  const ref = useRef(null);
  useEffect(() => {
    import("@lottiefiles/lottie-player");
  });

  useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        // path to your animation file, place it inside public folder
        path: "/images/faq.json",
      });

      return () => animation.destroy();
    }
  }, [lottie]);

  return (
    <>
      {" "}
      <Head>
        <title>Coinsino Faq</title>
        <meta name="description" content="How to play coinsino" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="mx-auto my-10    md:max-w-2xl    lg:max-w-4xl  xl:max-w-6xl">
        <div className="p-5 lg:p-0">
          <div className="flex flex-col justify-between  text-coinSinoTextColor">
            {/* how to play */}

            <div className="mx-auto   items-center space-y-5  md:flex md:w-full md:flex-wrap md:justify-between md:space-x-10 ">
              <div className="mx-auto max-w-xs">
                <lottie-player
                  id="firstLottie"
                  ref={ref}
                  autoplay
                  mode="normal"
                  src="./images/faq.json"
                />
              </div>
              {/* <div className="">
                {" "}
                <h1 className="m-5 text-center text-2xl font-bold text-coinSinoGreen sm:m-0 sm:text-start ">
                  How to Enter Lottery
                </h1>
                <p className="mx-auto mb-2 max-w-xs text-center  sm:text-start sm:font-bold sm:leading-loose  ">
                  The lottery is open for you to join, you can follow this
                  simple step to begin{" "}
                </p>
              </div> */}
              {/* <div className="mx-auto w-full max-w-md rounded-2xl bg-slate-300 p-2 text-coinSinoPurpleNav">
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 md:text-base">
                        <span>Step1: Connect your wallet</span>

                        <ChevronUpIcon
                          className={`${
                            open ? "rotate-180 transform" : ""
                          } h-5 w-5 text-purple-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm md:text-base">
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
                      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 md:text-base">
                        <span>Step2: Purchase Tickets</span>
                        <ChevronUpIcon
                          className={`${
                            open ? "rotate-180 transform" : ""
                          } h-5 w-5 text-purple-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm md:text-base ">
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
                      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 md:text-base">
                        <span>Step3: The draw is a must </span>

                        <ChevronUpIcon
                          className={`${
                            open ? "rotate-180 transform" : ""
                          } h-5 w-5 text-purple-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm md:text-base">
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
                      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 md:text-base">
                        <span>Step4: Check to see if you won</span>

                        <ChevronUpIcon
                          className={`${
                            open ? "rotate-180 transform" : ""
                          } h-5 w-5 text-purple-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm md:text-base ">
                        Always check back to see if you won after the lottery
                        has been drawn. Click "Check if you won".
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div> */}
              <div className="">
                <div className="mb-5  text-center md:text-2xl font-bold text-coinSinoGreen sm:m-0  ">
                  Ticket Related questions
                </div>
                <div className="mx-auto  mt-5 w-full max-w-md rounded-2xl bg-slate-300 p-2 text-coinSinoPurpleNav">
                  <Disclosure>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full  justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 md:text-base">
                          <span>How do I purchase a ticket? </span>

                          <ChevronUpIcon
                            className={`${
                              open ? "rotate-180 transform" : ""
                            } h-5 w-5 text-purple-500`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm md:text-base">
                          To get a ticket is very easy, connect your wallet and
                          click on get ticket, you can either edit your tickets
                          manually or let the platform automatically choose
                          random tickets.
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>

                  <Disclosure as="div" className="mt-2">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 md:text-base">
                          <span>
                            My ticket matches several numbers but I can't claim
                            a prize.
                          </span>
                          <ChevronUpIcon
                            className={`${
                              open ? "rotate-180 transform" : ""
                            } h-5 w-5 text-purple-500`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm md:text-base ">
                          Tickets are only eligible for prizes if matching
                          numbers from left to right match the winning digits.
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  <Disclosure as="div" className="mt-2">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 md:text-base">
                          <span>Do I claim manually if I win a ticket? </span>

                          <ChevronUpIcon
                            className={`${
                              open ? "rotate-180 transform" : ""
                            } h-5 w-5 text-purple-500`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm md:text-base ">
                          Yes, after clicking the "Check if you won." button and
                          you are a winner, you will need to claim your winnings
                          manually, but don't worry it is very easy and even if
                          you missed claiming your tickets, can always go back
                          to claim them.
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  <Disclosure as="div" className="mt-2">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 md:text-base">
                          <span>
                            Can I swap my ticket back to tokens?
                          </span>

                          <ChevronUpIcon
                            className={`${
                              open ? "rotate-180 transform" : ""
                            } h-5 w-5 text-purple-500`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm md:text-base ">
                          No, you can't, once you have purchased a ticket, you
                          can't swap back the ticket for the token.
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  <Disclosure as="div" className="mt-2">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 md:text-base">
                          <span>
                           Can I edit two tickets with the same numbers?
                          </span>

                          <ChevronUpIcon
                            className={`${
                              open ? "rotate-180 transform" : ""
                            } h-5 w-5 text-purple-500`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm md:text-base ">
                          Yes, you are eligible since each ticket is treated as
                          a separate entry to the Lottery. But bear in mind that
                          every winning ticket in a pool shares equal wins.
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              </div>
              {/*  */}

              <div className=" ">
                <div className=" mt-11 text-center md:text-2xl font-bold capitalize text-coinSinoGreen sm:m-0 ">
                  Other lottery Related questions
                </div>
                <div className="mx-auto mt-5 w-full max-w-md rounded-2xl bg-slate-300 p-2 text-coinSinoPurpleNav">
                  <Disclosure as="div" className="mt-2">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 md:text-base">
                          <span>​​How does the bulk discount work? </span>

                          <ChevronUpIcon
                            className={`${
                              open ? "rotate-180 transform" : ""
                            } h-5 w-5 text-purple-500`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm md:text-base">
                          The bulk discount varies from ticket to ticket, The
                          more tickets you purchase the more you are discounted.
                          Max cap 50 tickets = 2.45%.
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>

                  <Disclosure as="div" className="mt-2">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 md:text-base">
                          <span>What if there are no winners? </span>

                          <ChevronUpIcon
                            className={`${
                              open ? "rotate-180 transform" : ""
                            } h-5 w-5 text-purple-500`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm md:text-base ">
                          If the tokens in the prize pools aren't won or
                          claimed, it does not go to waste! 50% of Unclaimed
                          tokens in the pool are rolled over to the next Lottery
                          round while the 50% left is moved to the odd pool for
                          more betting experience.
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>

                  <Disclosure as="div" className="mt-2">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 md:text-base">
                          <span>How often is the lottery? </span>

                          <ChevronUpIcon
                            className={`${
                              open ? "rotate-180 transform" : ""
                            } h-5 w-5 text-purple-500`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm md:text-base ">
                          The lottery is a daily affair, it starts around 12 AM
                          - to 1 AM and draws around 12am - 1am the next day
                          with an estimation’s of 24hrs.
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  <Disclosure as="div" className="mt-2">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-5 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 md:text-base">
                          <span>
                            Am I charged a transaction fee for purchasing
                            ticket/tickets?{" "}
                          </span>

                          <ChevronUpIcon
                            className={`${
                              open ? "rotate-180 transform" : ""
                            } h-5 w-5 text-purple-500`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm md:text-base ">
                          You don't pay a transaction fee for purchasing a
                          ticket instantly but after the draw of the lottery,
                          the system deducts an 8% fee from the total amount in
                          the pool for platform maintenance. However, every user
                          accounts for the blockchain fees needed by block
                          validators.
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              </div>
            </div>

            <div className="my-10 border  border-white/30"></div>
            {/* winning criteria */}
            <div className=" w-full md:flex md:items-center md:justify-between  md:space-x-10">
              <div className="relative max-w-2xl space-y-5 text-sm leading-relaxed md:text-base">
                <h2 className=" text-lg  font-extrabold capitalize text-coinSinoGreen">
                  The Lottery Rules
                </h2>
                {/* <h3 className="font-bold">
                  The digits on your ticket must match in the correct order to
                  win.
                </h3> */}
                {/* <p>Here’s an example lottery draw, with two tickets, A and B</p> */}

                <p className="">
                  {" "}
                  The ticket numbers are between 0-9 On the Coinsino platform.
                  However, 0 (Zero) can not start or end a valid ticket.
                </p>
                <p className="">
                  {" "}
                  The maximum ticket one could purchase at once is capped at 50
                  max, but you can purchase as many max tickets as possible.
                </p>
                <p>
                  To be eligible as a winner, your ticket digits starting from
                  the left must match the exact starting numbers of the winning
                  digits.
                </p>
                <p>
                  Ticket discount is active on the platform and discount is
                  better with buying bulk tickets. Discounts start from 2
                  tickets (0.05% discount) to the max of 50 tickets (2.45%
                  discount). But don't forget you can always get as many Max
                  tickets as possible.
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
            <div className="">
              <div className="   mx-auto w-full lg:space-x-4 lg:flex lg:items-center    lg:justify-between">
                <div className=" max-w-lg  space-y-5    ">
                  {" "}
                  <h2 className="my-2  text-lg font-extrabold text-coinSinoGreen">
                    The Pool Prizes
                  </h2>
                  <p>
                    The prizes for each lottery round come from these two
                    sources:
                  </p>{" "}
                  <div>
                    <h3 className="font-extrabold text-coinSinoGreen">
                      Ticket Purchases
                    </h3>
                    <p className=" text-sm leading-relaxed md:text-base">
                      100% of the native tokens paid by people who purchased
                      tickets for that round go back into the prize pools.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-coinSinoGreen">
                      Grant proposal
                    </h3>
                    <p className=" text-sm leading-relaxed md:text-base">
                      The funds could be from the team or a grant proposal.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-coinSinoGreen">
                      The Unclaimed Funds
                    </h3>
                    <p className="text-sm leading-relaxed md:text-base">
                      {" "}
                      If there are no winners in one of the prized pools, 50% of
                      unclaimed tokens for that batch roll over into the next
                      round and are redistributed among the next round prize
                      pools. Meanwhile, the other 50% is transferred to the odd
                      pool for betting continuity and platform improvement.
                    </p>
                  </div>
                </div>
                {/* price funds image */}
                <div className="mx-auto my-5 w-full max-w-lg rounded-xl border-2 border-coinSinoGreen bg-black/20 p-2">
                  <div height="auto" className="flex flex-col">
                    <div className="h-[200px] w-[200px] self-center rounded-2xl bg-white bg-[url('/images/pieChart.png')] bg-contain bg-no-repeat"></div>
                    <div className="my-2 space-y-2">
                      <div className="flex items-center  justify-between text-center text-sm font-semibold capitalize   text-coinSinoGreen md:text-base">
                        <h3>Digits matched</h3>
                        <h3>Prize pool allocation</h3>
                      </div>

                      <div className="flex items-center justify-between rounded-full  border border-coinSinoGreen/20 p-1 text-sm md:text-base">
                        <p>Matches first 1</p>
                        <p>3%</p>
                      </div>
                      <div className="flex items-center  justify-between rounded-full  border border-coinSinoGreen/20 p-1  text-sm md:text-base">
                        <p>Matches first 2</p>
                        <p>4%</p>
                      </div>
                      <div className="flex items-center justify-between rounded-full  border border-coinSinoGreen/20 p-1  text-sm md:text-base">
                        <p>Matches first 3</p>
                        <p>10%</p>
                      </div>
                      <div className="flex items-center justify-between rounded-full  border border-coinSinoGreen/20 p-1  text-sm md:text-base">
                        <p>Matches first 4</p>
                        <p>13%</p>
                      </div>
                      <div className="flex items-center  justify-between rounded-full  border border-coinSinoGreen/20 p-1 text-sm md:text-base">
                        <p>Matches first 5</p>
                        <p>21%</p>
                      </div>
                      <div className="flex items-center  justify-between rounded-full  border border-coinSinoGreen/20 p-1 text-sm md:text-base">
                        <p>Matches first 6</p>
                        <p>41%</p>
                      </div>
                      <div className="flex items-center justify-between rounded-full  border border-coinSinoGreen/20 p-1  text-sm md:text-base">
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
