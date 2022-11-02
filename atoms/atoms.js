import { atom } from "recoil";

export const userTickets = atom({
  key: " _userTickets", // all the atoms in recoil have their unique key
  default: [], // this is the default value of an atom
});

export const winningNumbers = atom({
  key: " _winningNumbers", // all the atoms in recoil have their unique key
  default: null, // this is the default value of an atom
});

export const activeAccount = atom({
  key: " _currentAccount", // all the atoms in recoil have their unique key
  default: "", // this is the default value of an atom
});

export const lotteryStatus = atom({
  key: " _lotteryStatus", // all the atoms in recoil have their unique key
  default: null, // this is the default value of an atom
});

export const latestLotteryId = atom({
  key: " _latestLotteryId", // all the atoms in recoil have their unique key
  default: null, // this is the default value of an atom
});

export const totalLotteryFunds = atom({
  key: " _totalLotteryFunds", // all the atoms in recoil have their unique key
  default: null, // this is the default value of an atom
});

export const startLotteryTime = atom({
  key: " _startLotteryTime", // all the atoms in recoil have their unique key
  default: null, // this is the default value of an atom
});
export const endLotteryTime = atom({
  key: " _endLotteryTime", // all the atoms in recoil have their unique key
  default: 0, // this is the default value of an atom
});

export const buyModal = atom({
  key: " _buyModal", // all the atoms in recoil have their unique key
  default: false, // this is the default value of an atom
});

export const editModal = atom({
  key: " _editModal", // all the atoms in recoil have their unique key
  default: false, // this is the default value of an atom
});

export const viewTicket = atom({
  key: " _viewTicket", // all the atoms in recoil have their unique key
  default: false, // this is the default value of an atom
});

export const tlosPrice = atom({
  key: " _tlosPrice", // all the atoms in recoil have their unique key
  default: null, // this is the default value of an atom
});

export const errMessage = atom({
  key: " _errMessage",
  default: "",
});

export const unClaimedReward = atom({
  key: " _unClaimedReward",
  default: 0,
});

export const burnfee = atom({
  key: " _burnfee",
  default: 0,
});

export const firstpool = atom({
  key: " _firstpool",
  default: 0,
});

export const secondpool = atom({
  key: " _secondpool",
  default: 0,
});
export const thirdpool = atom({
  key: " _thirdpool",
  default: 0,
});

export const fourthpool = atom({
  key: " _fourthpool",
  default: 0,
});

export const fiftpool = atom({
  key: " _fiftpool",
  default: 0,
});

export const sixthpool = atom({
  key: " _sixthpool",
  default: 0,
});

export const rouncount = atom({
  key: " _rouncount",
  default: 0,
});

export const wonSize = atom({
  key: " _wonSize",
  default: 0,
});

export const usewalletModal = atom({
  key: " _usewalletModal",
  default: false,
});

export const connectorType = atom({
  key: " _connectorType",
  default: "",
});

export const drandData = atom({
  key: " _drandData ",
  default: {},
});
export const timeCountDown = atom({
  key: " _timeCountDown",
  default: {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
});

export const sinoAddress = atom({
  key: " _sinoAddress",
  default: "0xc65F1221147BE339704a1DB0A0B65F2DE3cA7aFC",
});

export const rngAddress = atom({
  key: " _rngAddress",
  default: "0xB7a02D612Dfd4AFbC52571645a152F15eB9e5868",
});

export const rpcaddress = atom({
  key: " _rpcAddress",
  default: "https://testnet.telos.net/evm",
});
export const networkID = atom({
  key: " _chainId",
  default: 41,
});

export const wonPoolLength = atom({
  key: " _wonPoolLength",
  default: [],
});
export const wonid = atom({
  key: " _wonid",
  default: [],
});
