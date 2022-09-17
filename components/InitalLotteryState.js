// import { ethers } from "ethers";
// import { useEffect } from "react";
// import { useRecoilState } from "recoil";
// import {
//   endLotteryTime,
//   latestLotteryId,
//   lotteryStatus as Lstatus,
// } from "../atoms/atoms";
// import Sinoabi from "../utils/Coinsino.json";
// function InitalStates(_endTime, _lotteryid, _status) {
//   const [endTime, setEndTime] = useRecoilState(endLotteryTime);
//   const [lotteryStatus, setlotteryStatus] = useRecoilState(Lstatus);
//   const [currentLotteryId, setCurrentLotteryId] =
//     useRecoilState(latestLotteryId);

//   const coinSinoContractAddress = "0xdC9d2bBb598169b370F12e45D97258dd34ba19C0";
//   const getLatestLotteryInfo = async () => {
//     if (!endTime || !lotteryStatus || !currentLotteryId) {
//       console.log("initial setting");
//       setEndTime(_endTime);
//       setlotteryStatus(_status);
//       setCurrentLotteryId(_lotteryid);
//     }
//     try {
//       const rpcUrl = "https://testnet.telos.net/evm";
//       // signers wallet get smartcontract
//       const operatorProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
//       // operator signer and contract
//       const operatorSigner = new ethers.Wallet(
//         process.env.opkey,
//         operatorProvider
//       );

//       const operatorcoinSinoContract = new ethers.Contract(
//         coinSinoContractAddress,
//         Sinoabi,
//         operatorSigner
//       );
//       // current lotteryid
//       const latestLotteryId = Number(
//         await operatorcoinSinoContract.viewCurrentLotteryId()
//       );
//       // set lottyied
//       //   setCurrentLotteryId(latestLotteryId);

//       //   if (!currentLotteryId) return;
//       // current lottery details
//       const getLotterystatus = await operatorcoinSinoContract.viewLottery(
//         latestLotteryId
//       );

//       // current lottery status
//       const {
//         status,
//         startTime,
//         endTime,
//         treasuryFee,
//         amountCollectedInTelos,
//         rewardsBreakdown,
//       } = getLotterystatus;

//       setEndTime(Number(_endTime));
//       setlotteryStatus(Number(_status));
//       setCurrentLotteryId(Number(_lotteryid));

//       return;

//       setTotalLotteryDeposit(
//         ethers.utils.formatEther(amountCollectedInTelos, "ether")
//       );
//       // calculat total funds for platform fee pools
//       const platFormFee = (Number(treasuryFee) / 10000) * totalLotteryDeposit;
//       setPlatFormFee(platFormFee);

//       const totalPoolFunds = totalLotteryDeposit - platFormFee;

//       // calculate pool funds for  pools
//       const firstPool =
//         ((Number(rewardsBreakdown[0]) / 10000) * 100 * totalPoolFunds) / 100;
//       setFirstPoolFunds(firstPool);

//       const secondPool =
//         ((Number(rewardsBreakdown[1]) / 10000) * 100 * totalPoolFunds) / 100;
//       setSecondPoolFunds(secondPool);

//       const thirdPool =
//         ((Number(rewardsBreakdown[2]) / 10000) * 100 * totalPoolFunds) / 100;
//       setThirdPoolFunds(thirdPool);

//       const fourthPool =
//         ((Number(rewardsBreakdown[3]) / 10000) * 100 * totalPoolFunds) / 100;
//       setFouthPoolFunds(fourthPool);

//       const fifthPool =
//         ((Number(rewardsBreakdown[4]) / 10000) * 100 * totalPoolFunds) / 100;
//       setFifthPoolFunds(fifthPool);

//       const sixthpool =
//         ((Number(rewardsBreakdown[5]) / 10000) * 100 * totalPoolFunds) / 100;
//       setSixthPoolFunds(sixthpool);

//       if (endTime) {
//         setlotteryStatus(status);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     let intervalId = setInterval(getLatestLotteryInfo, 2000);
//     return () => clearInterval(intervalId);
//   }, [endTime, lotteryStatus, currentLotteryId]);

//   return { getLatestLotteryInfo };
// }

// export default InitalStates;
