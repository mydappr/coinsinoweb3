import { Dialog, Transition } from "@headlessui/react";
import { ArrowSmRightIcon, XIcon } from "@heroicons/react/solid";
import { Fragment, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import {
  activeAccount,
  buyModal,
  connectorType,
  editModal,
  errMessage,
  latestLotteryId,
  sinoAddress,
  tlosPrice,
} from "../atoms/atoms";
import Sinoabi from "../utils/Coinsino.json";
import { ethers, BigNumber } from "ethers";
import UseToaster from "./UseToaster";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import UseLoadingSpinner from "./UseLoadingSpinner";

export default function BuyDialog() {
  const [isOpen, setIsOpen] = useRecoilState(buyModal);
  const [isEditOpen, setIsEditOpen] = useRecoilState(editModal);
  const [noOfTickets, setNoOfTickets] = useState(0);
  let [listOfTicketsToBuy, setlistOfTicketsToBuy] = useState([]);
  const [ticketEdit, setticketEdit] = useState(null);
  const [currentLotteryId, setCurrentLotteryId] =
    useRecoilState(latestLotteryId);
  const [errorMessage, setErrorMessage] = useState("");
  const [telosPrice, setTelosPrice] = useRecoilState(tlosPrice);
  const [userBalance, setuserBalance] = useState(0);
  const [currentAccount, setCurrentAccount] = useRecoilState(activeAccount);
  const [providerConnector, setProviderConnector] =
    useRecoilState(connectorType);
  const inputRef = useRef(null);
  const { Toast } = UseToaster();
  const [isloading, setisloading] = useState(false);
  const [coinSinoContractAddress, setcoinSinoContractAddress] =
    useRecoilState(sinoAddress);
  const [rpcUrl, setrpcUrl] = useRecoilState(rpcaddress);
  const { Loading } = UseLoadingSpinner(isloading);

  const getTelosPrice = async () => {
    try {
      const get = await fetch(`https://api.coingecko.com/api/v3/coins/telos`);
      const res = await get.json();
      const price = res.market_data.current_price.usd;
      setTelosPrice(price);
      console.log("price", price);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTelosPrice();
  }, [isOpen, telosPrice]);

  // fetch userBalance
  const currentBalance = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const balance = parseFloat(
        ethers.utils.formatEther(
          await provider.getBalance(currentAccount),
          "ethers"
        )
      ).toFixed(3);
      console.log(currentAccount);
      setuserBalance(balance);
      console.log("current  balance", balance);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    currentBalance();
  }, [currentAccount, userBalance]);

  const discountDivisor = 2000;

  const pricePerTicket = "3";

  const totalTicketsPrice = noOfTickets * pricePerTicket;

  const priceTopay =
    (pricePerTicket * noOfTickets * (discountDivisor + 1 - noOfTickets)) /
    discountDivisor;
  const discountInTlos = (totalTicketsPrice - priceTopay).toFixed(5);
  const disdcountInPercentage = (
    100 -
    (priceTopay * 100) / totalTicketsPrice
  ).toFixed(2);
  const disablebtn =
    userBalance < totalTicketsPrice || noOfTickets < 1 || errorMessage !== "";

  // random generator
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

  // modal functions
  function closeBuyModals() {
    setisloading(false);
    setIsOpen(false);
  }

  function openBuyModals() {
    setIsOpen(true);
  }

  // edit ticket functions
  function closeEditModals() {
    setIsEditOpen(false);
  }

  function openEditModals() {
    setIsEditOpen(true);
  }

  // handle ticketEdit

  const handticketEdit = (e, eel, i, arr, li) => {
    e.preventDefault();
    let invalidChars = /[^0-9]/gi;
    if (invalidChars.test(e.target.value)) {
      e.target.value = e.target.value.replace(invalidChars, "");
    }

    const { value, maxLength, name, placeholder } = e.target;

    // make sure the input length isn't greater than 1 else replace withthe last vlaue
    if (value.length > maxLength) {
      const lastDIgit = value[value.length - 1];
      e.target.value = e.target.value.replace(e.target.value, lastDIgit);
      return;
    }

    if (value == "") {
      setErrorMessage("");
      return;
    }
    if (i == 0 && value == "0") {
      // value = placeholder;
      setErrorMessage(
        "Sorry, tickets with leading zero isn`t accepted as Winning Number also can`t have a leading zero!"
      );

      if (inputRef.current) {
        e.target.value = e.target.value.replace(e.target.value, placeholder);
      }

      return;
    } else {
      setErrorMessage("");
    }

    // placeholder = value;

    arr[i] = value;

    const numberelements = arr.map((e) => {
      return parseInt(e);
    });

    listOfTicketsToBuy[li] = Number(numberelements.join(""));
    console.log(listOfTicketsToBuy);
  };
  // console.log(listOfTicketsToBuy);
  // buy tickets
  // console.log(listOfTicketsToBuy);

  const buyTicket = async () => {
    if (disablebtn) {
      return;
    }
    try {
      setisloading(true);
      let provider;
      if (
        (providerConnector === "metaMask") |
        (providerConnector === "walletConnect")
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

        if (chainId !== 41) return;

        // const accounts = await ethereum.request({
        //   method: "eth_requestAccounts",
        // });
        // let chainId = await ethereum.request({ method: "eth_chainId" });

        // if (Number(chainId) !== 41) return;

        const _costOfTickets = ethers.utils.parseUnits(
          String(Number(pricePerTicket) * noOfTickets),
          "ether"
        );
        const costOfTickets = BigNumber.from(String(_costOfTickets));

        // buy a ticket and wait for completion

        // const tickets = await generateTicketNumbers(noOfTickets);
        // console.log("user tickets", tickets);

        const buyTicket = await coinSinoContract.methods
          .buyTickets(currentLotteryId, listOfTicketsToBuy)
          .send({
            from: currentAccount,
            value: costOfTickets,
          });

        await buyTicket;
        Toast("Ticket bought");
        closeBuyModals();
      }
    } catch (error) {
      setisloading(false);
      console.log(error);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 "
          open={isOpen}
          onClose={closeBuyModals}
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
            <div className="fixed inset-0  bg-white bg-opacity-25" />
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
                <Dialog.Panel className="w-full min-w-[300px] max-w-[350px] transform overflow-hidden rounded-2xl bg-coinSinoPurple  p-6 text-left align-middle text-coinSinoTextColor2 shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex justify-between text-lg font-extrabold leading-6 text-white "
                  >
                    Buy Ticket{" "}
                    <XIcon
                      className="h-7 cursor-pointer p-1 text-coinSinoGreen"
                      onClick={closeBuyModals}
                    />
                  </Dialog.Title>

                  <div className="mt-5 space-y-2 text-sm font-bold text-coinSinoTextColor2">
                    <div className="flex w-full items-center justify-between text-sm  font-bold  ">
                      <p>Buy</p>
                      <p className="text-white">Tickets</p>
                    </div>
                    <div className=" relative">
                      <textarea
                        disabled={isloading}
                        value={noOfTickets}
                        onChange={async (e) => {
                          let invalidChars = /[^0-9]/gi;
                          if (invalidChars.test(e.target.value)) {
                            e.target.value = e.target.value.replace(
                              invalidChars,
                              ""
                            );
                          }
                          if (e.target.value > 100) {
                            e.target.value = e.target.value.replace(
                              e.target.value,
                              100
                            );
                          }
                          setNoOfTickets(e.target.value);
                          const Tickets = await generateTicketNumbers(
                            e.target.value
                          );
                          setlistOfTicketsToBuy(Tickets);
                        }}
                        className={`min-h-10 w-full resize-none rounded-2xl border-none bg-coinSinoPurpleNav text-end  ${
                          noOfTickets > 0 && "text-white"
                        } outline-none`}
                      />
                      <p className=" absolute bottom-2 right-2 text-xs   text-coinSinoTextColor2 ">
                        {noOfTickets > 0 && `~ ${priceTopay} Tlos`}
                      </p>
                    </div>
                    {userBalance < totalTicketsPrice && (
                      <div className="text-end ">
                        <p className=" text-coinSinoPink  ">
                          Insufficient Tlos balance
                        </p>
                        <p>Telos Balance: {userBalance}</p>
                      </div>
                    )}
                    <p className="flex justify-between">
                      <span>Cost (Telos)</span>
                      <span> {pricePerTicket} Telos</span>
                    </p>
                    <p className="flex justify-between">
                      <span className=" text-xs text-white">
                        {disdcountInPercentage}% Bulk discount
                      </span>{" "}
                      <span className="">~{discountInTlos} Tlos</span>
                    </p>
                    <p className="flex justify-between">
                      <span>You pay</span>{" "}
                      <span className="text-white">~{priceTopay} Tlos</span>
                    </p>
                    {isloading ? (
                      Loading()
                    ) : (
                      <>
                        <button
                          disabled={
                            (userBalance < totalTicketsPrice) |
                            (noOfTickets < 1)
                          }
                          className={` w-full rounded-full bg-coinSinoGreen p-3  text-sm font-bold text-white ${
                            (userBalance < totalTicketsPrice) |
                              (noOfTickets < 1) &&
                            " cursor-not-allowed border border-coinSinoTextColor2 bg-transparent text-coinSinoTextColor2"
                          }`}
                          onClick={buyTicket}
                        >
                          {" "}
                          Buy Instantly
                        </button>
                        <button
                          disabled={
                            (userBalance < totalTicketsPrice) |
                            (noOfTickets < 1)
                          }
                          className={` flex w-full justify-around rounded-full bg-coinSinoTextColor2 p-3  text-sm font-bold text-white ${
                            (userBalance < totalTicketsPrice) |
                              (noOfTickets < 1) &&
                            " cursor-not-allowed border border-coinSinoTextColor2 bg-inherit text-coinSinoTextColor2"
                          }`}
                          onClick={() => {
                            openEditModals();
                            closeBuyModals();
                          }}
                        >
                          {" "}
                          View/Edit Numbers{" "}
                          <ArrowSmRightIcon className="w-7 " />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="mt-2">
                    <p className="text-sm ">
                      `Buy Instantly` chooses random numbers, with no duplicates
                      among your tickets.
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* edit Tickets */}
      <Transition appear show={isEditOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 "
          open={isEditOpen}
          onClose={closeEditModals}
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
                <Dialog.Panel className="w-full min-w-[300px] max-w-[350px] transform overflow-hidden rounded-2xl bg-coinSinoPurple  p-6 text-left align-middle text-white shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex  justify-between text-lg font-extrabold leading-6 "
                  >
                    Edit Ticket{" "}
                    <XIcon
                      className="h-7 cursor-pointer p-1 text-coinSinoGreen"
                      onClick={() => {
                        closeEditModals();
                        openBuyModals();
                        setErrorMessage("");
                      }}
                    />
                  </Dialog.Title>
                  {errorMessage && (
                    <p className="my-5 text-sm font-bold text-coinSinoPink">
                      {errorMessage}
                    </p>
                  )}
                  <div className="mt-5 max-h-60 space-y-2 overflow-y-scroll text-xs text-coinSinoTextColor2   scrollbar-hide">
                    {/* <div className="flex w-full items-center justify-between text-sm  font-bold  ">
                      <p>Buy</p>
                      <p>Tickets</p>
                    </div> */}

                    {listOfTicketsToBuy.map((el, li) => {
                      const splitTicket = Array.from(String(el));

                      return (
                        <p
                          key={li}
                          className="    max-w-full items-center justify-between   space-y-1 space-x-1  "
                        >
                          {splitTicket.map((eel, i, arr) => {
                            return (
                              <textarea
                                key={i}
                                type="number"
                                ref={inputRef}
                                pattern="[0-9]*"
                                name={eel}
                                maxLength={1}
                                id={i}
                                placeholder={eel}
                                inputMode="numeric"
                                onChange={(e) =>
                                  handticketEdit(e, eel, i, arr, li)
                                }
                                className={` no-spin h-10 w-10 cursor-pointer  resize-none rounded-full border-none   bg-coinSinoPurpleNav text-center text-white `}
                              />
                            );
                          })}
                        </p>
                      );
                    })}

                    {/* <p className=" absolute bottom-2 right-2 text-xs   text-coinSinoTextColor2 ">
                        {noOfTickets > 0 && `~ ${totalTicketsPrice} Tlos`}
                      </p> */}
                    {/* 
                    {userBalance < totalTicketsPrice && (
                      <div className="text-end ">
                        <p className=" text-coinSinoPink  ">
                          Insufficient CAKE balance
                        </p>
                        <p>Telos Balance: {userBalance}</p>
                      </div>
                    )}
                    <p className="flex justify-between">
                      <span>Cost (Telos)</span>
                      <span> 3 Telos</span>
                    </p>
                    <ps className="flex justify-between">
                      <span>0% Bulk discount</span> <span>~0 CAKE</span>
                    </ps>
                    <p className="flex justify-between">
                      <span>You pay</span> <span>~1.18 CAKE</span>
                    </p> */}
                  </div>
                  <div className=" mt-5 space-y-2    text-coinSinoTextColor2">
                    {" "}
                    {isloading ? (
                      Loading()
                    ) : (
                      <>
                        <button
                          className={` w-full rounded-full bg-coinSinoGreen p-3  text-sm font-bold text-white  `}
                          onClick={buyTicket}
                        >
                          {" "}
                          Confirm and buy
                        </button>
                        <button
                          onClick={() => {
                            closeEditModals();
                            closeBuyModals();
                            setErrorMessage("");
                          }}
                          className={` flex w-full justify-center rounded-full bg-coinSinoTextColor2 p-3  text-sm font-bold text-white `}
                        >
                          {" "}
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm ">
                      `Buy Instantly` chooses random numbers, with no duplicates
                      among your tickets.
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
