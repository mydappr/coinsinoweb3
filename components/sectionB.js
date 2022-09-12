import { useEffect, useState } from "react";
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
} from "../atoms/atoms";
import { useRecoilState } from "recoil";
import Sinoabi from "../utils/Coinsino.json";
import { ethers } from "ethers";
import moment from "moment";
import ViewTickets from "./viewTickets";
import SectionA from "./sectionA";
import UseToaster from "./UseToaster";
import UseLoadingSpinner from "./UseLoadingSpinner";

// coinsino contract address
const coinSinoContractAddress = "0xdC9d2bBb598169b370F12e45D97258dd34ba19C0";

function SectionB({ keys }) {
  
  const [lastDrawTime, setLastDrawTime] = useState({});
  const [userTickets, setUserTickets] = useRecoilState(accountTicket);
  const [currentAccount, setCurrentAccount] = useRecoilState(activeAccount);
  const [lotteryStatus, setlotteryStatus] = useRecoilState(Lstatus);
  const [unClaimedUserRewards, setunClaimedUserRewards] =
    useRecoilState(unClaimedReward);
  const [rewardMessage, setRewardMessage] = useRecoilState(errMessage);
  const [claimpoolLength, setclaimpoolLength] = useState([]);
  const [winningNo, setWinningNO] = useRecoilState(winningNumbers);
  const splittedWinningValues = Array.from(String(winningNo));
  const [currentLotteryId, setCurrentLotteryId] =
    useRecoilState(latestLotteryId);
  const [roundCount, setRoundCount] = useRecoilState(rouncount);
  const [endTime, setEndTime] = useRecoilState(endLotteryTime);
  const [viewTicketOpen, setviewTicketOpen] = useRecoilState(viewTicket);
  const [wonTicketSize, setWonTicketSize] = useRecoilState(wonSize);
  const [walletModal, setwalletModal] = useRecoilState(usewalletModal);
  const [isloading, setisloading] = useState(false);
  const { Toast } = UseToaster();
  const { Loading } = UseLoadingSpinner(isloading);

  useEffect(() => {
    if (currentLotteryId) {
      setRoundCount(currentLotteryId - 1);
    }
  }, [currentLotteryId]);
  SectionA;
  // convert hex to int
  async function convertHexToInt(hex) {
    return parseInt(hex, 16);
  }
  console.log(winningNo)

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
    try {
      setisloading(true);
      const { ethereum } = window;
      if (ethereum) {
        // signers wallet get smartcontract
        const provider = new ethers.providers.Web3Provider(ethereum);

        // user contract
        const signer = provider.getSigner();

        const coinSinoContract = new ethers.Contract(
          coinSinoContractAddress,
          Sinoabi,
          signer
        );

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        let chainId = await ethereum.request({ method: "eth_chainId" });

        // check if network is metamask
        if (Number(chainId) !== 41) return;

        if (lotteryStatus === Pending) return;

        // current lotteryid
        const latestLotteryId = Number(
          await coinSinoContract.viewCurrentLotteryId()
        );

        const previousLotteryId =
          latestLotteryId === 1 ? latestLotteryId : latestLotteryId - 1;

        // current lottery details
        const getLotterystatus = await coinSinoContract.viewLottery(
          previousLotteryId
        );

        // current lottery status
        const { status } = getLotterystatus;

        if (status === claimable) {
          const userInfo = await coinSinoContract.viewUserInfoForLotteryId(
            accounts[0],
            previousLotteryId,
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

          if (userticketIds.length < 1) {
            setRewardMessage("Sorry, you have no ticket for this round");
            setunClaimedUserRewards(null);
            return;
          }

          // user has a ticket

          userticketIds.forEach(async (e, i) => {
            const view = await coinSinoContract.viewRewardsForTicketId(
              previousLotteryId,
              e,
              0
            );

            const rewards = ethers.utils.formatEther(view);

            if (!Number(rewards)) {
              setRewardMessage("sorry you did not win this time!");
              setunClaimedUserRewards(null);
              return;
            }

            //  user won from this lottery
            setRewardMessage("Congratulations");
            setunClaimedUserRewards(Number(rewards));

            const wonTickets = [];
            userTickets.map(async (e) => {
              const split = Array.from(String(e));

              wonPools(split, splittedWinningValues);

              // won pools
              setclaimpoolLength(pools);
              setisloading(false);

              return;

              // const claimTickets = await coinSinoContract.claimTickets(
              //   previousLotteryId,
              //   wonTickIds,
              //   claimpoolLength
              // );
              // await claimTickets.wait();

              // console.log("climed");
              // const userbalanceafter = Number(
              //   ethers.utils.formatEther(await provider.getBalance(accounts[0]))
              // );
              // console.log("b4", userbalanceafter);
            });
          });
        }
      }
    } catch (error) {
      Toast(error.reason);
      setisloading(false);
    }
  };

  // claim now

  const Claim = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // signers wallet get smartcontract
        const provider = new ethers.providers.Web3Provider(ethereum);

        // user contract
        const signer = provider.getSigner();

        const coinSinoContract = new ethers.Contract(
          coinSinoContractAddress,
          Sinoabi,
          signer
        );

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        let chainId = await ethereum.request({ method: "eth_chainId" });

        // check if network is metamask
        if (Number(chainId) !== 41) return;

        if (lotteryStatus === Pending) return;

        // current lotteryid
        const latestLotteryId = Number(
          await coinSinoContract.viewCurrentLotteryId()
        );

        const previousLotteryId =
          latestLotteryId === 1 ? latestLotteryId : latestLotteryId - 1;

        // current lottery details
        const getLotterystatus = await coinSinoContract.viewLottery(
          previousLotteryId
        );

        // current lottery status
        const { status } = getLotterystatus;

        if (status === claimable) {
          const userInfo = await coinSinoContract.viewUserInfoForLotteryId(
            accounts[0],
            previousLotteryId,
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

          // user has a ticket

          userticketIds.forEach(async (e, i) => {
            const view = await coinSinoContract.viewRewardsForTicketId(
              previousLotteryId,
              e,
              0
            );

            const rewards = ethers.utils.formatEther(view);

            if (!Number(rewards)) {
              setRewardMessage("sorry you did not win this time");
              setunClaimedUserRewards(null);
              return;
            }

            //  user won from this lottery
            setRewardMessage("congratulations, you won!");
            setunClaimedUserRewards(Number(rewards));

            const wonTickets = [];
            userTickets.map(async (e) => {
              const split = Array.from(String(e));

              wonPools(split, splittedWinningValues);

              // won pools
              setclaimpoolLength(pools);

              //  remove duplicate tickets from won tickets
              const wonTicketArrSet = new Set(wonTicketArr.map((e) => e));

              const _wonticketNumbers = Array.from(wonTicketArrSet).map(
                (e, i, arr) => parseInt(arr[i].join(""))
              );

              // const poisibleTicketIds = await generatePossibleTicketIds(2);
              // const allAvailableTickets =
              //   await coinSinoContract.viewNumbersAndStatusesForTicketIds(
              //     poisibleTicketIds
              //   );

              const wonTickIds = [];
              _wonticketNumbers.map((won) => {
                return userTickets.map((ticket, i) => {
                  if (won === ticket) {
                    wonTickIds.push(i);
                  }
                });
              });

              // Claim now
              const userbalanceBefore = Number(
                ethers.utils.formatEther(await provider.getBalance(accounts[0]))
              );
              console.log("b4", userbalanceBefore);

              const claimTickets = await coinSinoContract.claimTickets(
                previousLotteryId,
                wonTickIds,
                claimpoolLength
              );

              await claimTickets.wait();

              // console.log("climed");
              const userbalanceafter = Number(
                ethers.utils.formatEther(await provider.getBalance(accounts[0]))
              );
              // console.log("b4", userbalanceafter);
            });
          });
        }
      }
    } catch (error) {
      Toast(error.reason);
    }
  };

  const fetchRoundDetails = async () => {
    try {
      const rpcUrl = "https://testnet.telos.net/evm";

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

        setUserTickets(list[0]);

        userTickets?.map(async (e) => {
          const split = Array.from(String(e));

          wonPools(split, splittedWinningValues);

          setWonTicketSize(wonTicketArr.length);
          //  remove duplicate tickets from won tickets
          const wonTicketArrSet = new Set(wonTicketArr.map((e) => e));

          const _wonticketNumbers = Array.from(wonTicketArrSet).map(
            (e, i, arr) => parseInt(arr[i].join(""))
          );
        });
      }
    } catch (error) {
      Toast(error.reason);
    }
  };

  useEffect(() => {
    fetchRoundDetails();
  }, [roundCount, userTickets.length, lotteryStatus]);

  const previousDraws = async () => {
    if (roundCount > 1) {
      setRoundCount((prev) => prev - 1);
    }
  };
  const nextDraws = async () => {
    if (roundCount < currentLotteryId - 1) {
      setRoundCount((prev) => prev + 1);
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
                  disabled={!winningNo}
                  onClick={Check}
                  className={`joinBtn w-full  ${
                    !winningNo &&
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
              <p className="text-sm">
                You matched the following number(s) in pink
              </p>
            )}
            {userTickets.map((e, i) => {
              const splittedTicketValues = Array.from(String(e));

              return (
                <div key={i} className=" mx-auto mt-0 w-full ">
                  <div className="mx-auto  flex w-full  max-w-xs items-center  space-x-5   ">
                    <p className="text-sm  font-bold">{`Ticket ${i + 1}`}</p>
                    <p className="  flex-grow-1 flex w-fit items-center space-x-2  text-center ">
                      {splittedTicketValues.map((tn, tIndex) => {
                        return (
                          <p
                            key={tIndex}
                            className={` flex items-center  p-2 text-lg ${
                              tIndex === claimpoolLength[tIndex] &&
                              `  h-8  w-8 rounded-full bg-coinSinoPink font-bold`
                            }    `}
                          >
                            {tn}
                          </p>
                        );
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            {unClaimedUserRewards > 0 && (
              <h1>
                You have a total of{" "}
                <strong className="text-coinSinoGreen">
                  {unClaimedUserRewards}
                </strong>{" "}
                Tlos to be claimed.
              </h1>
            )}

            {unClaimedUserRewards > 0 && (
              <div className=" mx-auto w-full max-w-[200px] space-y-5 p-2">
                <button onClick={Claim} className=" joinBtn w-full">
                  Claim Now
                </button>
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
                      #{roundCount}
                    </p>
                  </div>{" "}
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
                    <div className="waiting"></div>
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
                      onClick={() => setviewTicketOpen(true)}
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
                    <div className="waiting"></div>
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
