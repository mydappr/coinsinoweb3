import Sinoabi from "../utils/Coinsino.json";
import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import {
  latestLotteryId,
  lotteryStatus as Lstatus,
  totalLotteryFunds,
  userTickets as accountTicket,
  winningNumbers,
  tlosPrice,
  burnfee,
  firstpool,
  secondpool,
  thirdpool,
  fourthpool,
  fiftpool,
  sixthpool,
  endLotteryTime,
  drandData,
  activeAccount,
  sinoAddress,
  rngAddress,
  rpcaddress,
  networkID,
} from "../atoms/atoms";
import { useRecoilState } from "recoil";
// Lottery status
const Pending = 0;
const Open = 1;
const closed = 2;
const claimable = 3;

function InitialLotteryData(
  {_endTime,
  _lotteryid,
  _status,
  _amountCollectedInTelos,
  opkey}
) {
  const [unClaimedUserRewards, setunClaimedUserRewards] = useState(0);

  const [userTickets, setUserTickets] = useRecoilState(accountTicket);
  const [winningNo, setWinningNO] = useRecoilState(winningNumbers);
  const [lotteryStatus, setlotteryStatus] = useRecoilState(Lstatus);
  const [currentLotteryId, setCurrentLotteryId] =
    useRecoilState(latestLotteryId);
  const [totalLotteryDeposit, setTotalLotteryDeposit] =
    useRecoilState(totalLotteryFunds);
  const [ticketSplit, setTicketSplit] = useState([]);
  const [claimpoolLength, setclaimpoolLength] = useState([]);
  const [telosPrice, setTelosPrice] = useRecoilState(tlosPrice);
  const [endTime, setEndTime] = useRecoilState(endLotteryTime);
  const [platFormFee, setPlatFormFee] = useRecoilState(burnfee);
  const [firstPoolFunds, setFirstPoolFunds] = useRecoilState(firstpool);
  const [secondPoolFunds, setSecondPoolFunds] = useRecoilState(secondpool);
  const [thirdPoolFunds, setThirdPoolFunds] = useRecoilState(thirdpool);
  const [fouthPoolFunds, setFouthPoolFunds] = useRecoilState(fourthpool);
  const [fifthPoolFunds, setFifthPoolFunds] = useRecoilState(fiftpool);
  const [sixthPoolFunds, setSixthPoolFunds] = useRecoilState(sixthpool);
  const [rngData, setrngData] = useRecoilState(drandData);
  const [userCurrentTickets, setUserCurrentTickets] = useState(0);
  const [currentAccount, setCurrentAccount] = useRecoilState(activeAccount);
  const [coinSinoContractAddress, setcoinSinoContractAddress] =
    useRecoilState(sinoAddress);
  const [rngContractaddress, setrngContractaddress] =
    useRecoilState(rngAddress);
  const [chainId, setChainId] = useRecoilState(networkID);
  const [rpcUrl, setrpcUrl] = useRecoilState(rpcaddress);
  const splittedWinningValues = Array.from(String(winningNo));

  // operator signer
  const getOperatorSigner = async () => {
    // operator provider,and signer
    const operatorProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
    // operator signer and contract
    const operatorSigner = new ethers.Wallet(opkey, operatorProvider);
    return new ethers.Contract(
      coinSinoContractAddress,
      Sinoabi,
      operatorSigner
    );
  };

  const getLatestLotteryInfo = async () => {
    const operatorcoinSinoContract = await getOperatorSigner();

    if (!endTime || !lotteryStatus || !currentLotteryId) {
      setEndTime(_endTime);
      setlotteryStatus(_status);
      setCurrentLotteryId(_lotteryid);
      setTotalLotteryDeposit(
        ethers.utils.formatEther(_amountCollectedInTelos, "ether")
      );
    }
    try {
      // current lotteryid
      const latestLotteryId = Number(
        await operatorcoinSinoContract.viewCurrentLotteryId()
      );

      // set lottyied
      setCurrentLotteryId(latestLotteryId);

      if (!currentLotteryId) return;
      // current lottery details
      const getLotterystatus = await operatorcoinSinoContract.viewLottery(
        currentLotteryId
      );

      // current lottery status
      const {
        status,
        startTime,
        endTime,
        treasuryFee,
        amountCollectedInTelos,
        rewardsBreakdown,
      } = getLotterystatus;

      setEndTime(Number(endTime));

      setTotalLotteryDeposit(
        ethers.utils.formatEther(amountCollectedInTelos, "ether")
      );
      // calculat total funds for platform fee pools
      const platFormFee = (Number(treasuryFee) / 10000) * totalLotteryDeposit;
      setPlatFormFee(platFormFee);

      const totalPoolFunds = totalLotteryDeposit - platFormFee;

      // calculate pool funds for  pools
      const firstPool =
        ((Number(rewardsBreakdown[0]) / 10000) * 100 * totalPoolFunds) / 100;
      setFirstPoolFunds(firstPool);

      const secondPool =
        ((Number(rewardsBreakdown[1]) / 10000) * 100 * totalPoolFunds) / 100;
      setSecondPoolFunds(secondPool);

      const thirdPool =
        ((Number(rewardsBreakdown[2]) / 10000) * 100 * totalPoolFunds) / 100;
      setThirdPoolFunds(thirdPool);

      const fourthPool =
        ((Number(rewardsBreakdown[3]) / 10000) * 100 * totalPoolFunds) / 100;
      setFouthPoolFunds(fourthPool);

      const fifthPool =
        ((Number(rewardsBreakdown[4]) / 10000) * 100 * totalPoolFunds) / 100;
      setFifthPoolFunds(fifthPool);

      const sixthpool =
        ((Number(rewardsBreakdown[5]) / 10000) * 100 * totalPoolFunds) / 100;
      setSixthPoolFunds(sixthpool);

      if (endTime) {
        setlotteryStatus(status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
     getLatestLotteryInfo()
  }, [currentLotteryId, endTime, lotteryStatus, totalLotteryDeposit]);

  // fetch user tickets on launch
  const fetchUserTickets = async () => {
    const operatorcoinSinoContract = await getOperatorSigner();

    try {
      if (chainId !== 41) return;

      const latestLotteryId = Number(
        await operatorcoinSinoContract.viewCurrentLotteryId()
      );

      if (!currentAccount || !latestLotteryId) return;

      try {
        const viewUserTicketLength =
          await operatorcoinSinoContract.viewUserTicketLength(
            currentAccount,
            latestLotteryId
          );

        const userInfo =
          await operatorcoinSinoContract.viewUserInfoForLotteryId(
            currentAccount,
            latestLotteryId,
            0,
            viewUserTicketLength
          );

        setUserCurrentTickets(userInfo[1]);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      if (isSubscribed) {
        await fetchUserTickets();
      }
    })();

    return () => (isSubscribed = false);
  }, [currentLotteryId, currentAccount]);

  return <></>;
}

export default InitialLotteryData;
