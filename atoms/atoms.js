import { atom } from "recoil";

export const userTickets = atom({
  key: "userTickets", // all the atoms in recoil have their unique key
  default: [], // this is the default value of an atom
});

export const winningNumbers = atom({
  key: "winningNumbers", // all the atoms in recoil have their unique key
  default: null, // this is the default value of an atom
});

export const activeAccount = atom({
  key: "currentAccount", // all the atoms in recoil have their unique key
  default: "", // this is the default value of an atom
});

export const lotteryStatus = atom({
  key: "lotteryStatus", // all the atoms in recoil have their unique key
  default: null, // this is the default value of an atom
});

export const latestLotteryId = atom({
  key: "latestLotteryId", // all the atoms in recoil have their unique key
  default: null, // this is the default value of an atom
});

export const totalLotteryFunds = atom({
  key: "totalLotteryFunds", // all the atoms in recoil have their unique key
  default: null, // this is the default value of an atom
});

export const startLotteryTime = atom({
  key: "startLotteryTime", // all the atoms in recoil have their unique key
  default: null, // this is the default value of an atom
});
export const endLotteryTime = atom({
  key: "endLotteryTime", // all the atoms in recoil have their unique key
  default: 0, // this is the default value of an atom
});

export const buyModal = atom({
  key: "buyModal", // all the atoms in recoil have their unique key
  default: false, // this is the default value of an atom
});

export const editModal = atom({
  key: "editModal", // all the atoms in recoil have their unique key
  default: false, // this is the default value of an atom
});

export const viewTicket = atom({
  key: "viewTicket", // all the atoms in recoil have their unique key
  default: false, // this is the default value of an atom
});

export const tlosPrice = atom({
  key: "tlosPrice", // all the atoms in recoil have their unique key
  default: null, // this is the default value of an atom
});

export const errMessage = atom({
  key: "errMessage",
  default: "",
});

export const unClaimedReward = atom({
  key: "unClaimedReward",
  default: 0,
});

export const burnfee = atom({
  key: "burnfee",
  default: 0,
});

export const firstpool = atom({
  key: "firstpool",
  default: 0,
});

export const secondpool = atom({
  key: "secondpool",
  default: 0,
});
export const thirdpool = atom({
  key: "thirdpool",
  default: 0,
});

export const fourthpool = atom({
  key: "fourthpool",
  default: 0,
});

export const fiftpool = atom({
  key: "fiftpool",
  default: 0,
});

export const sixthpool = atom({
  key: "sixthpool",
  default: 0,
});

export const rouncount = atom({
  key: "rouncount",
  default: 0,
});

export const wonSize = atom({
  key: "wonSize",
  default: 0,
});

export const usewalletModal = atom({
  key: "usewalletModal",
  default: false,
});

export const connectorType = atom({
  key: "connectorType",
  default: "",
});

export const drandData = atom({
  key: "drandData",
  default: {},
});
export const timeCountDown = atom({
  key: "timeCountDown",
  default: {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
});

export const sinoAddress = atom({
  key: "sinoAddress",
  default: "0xc65F1221147BE339704a1DB0A0B65F2DE3cA7aFC",
});

export const rngAddress = atom({
  key: "rngAddress",
  default: "0xB7a02D612Dfd4AFbC52571645a152F15eB9e5868",
});

export const rpcaddress = atom({
  key: "rpcAddress",
  default: "https://testnet.telos.net/evm",
});
export const networkID = atom({
  key: "chainId",
  default: 41,
});

export const wonPoolLength = atom({
  key: "wonPoolLength",
  default: [],
});
export const wonid = atom({
  key: "wonid",
  default: [],
});
