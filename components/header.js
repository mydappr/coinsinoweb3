import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { activeAccount, usewalletModal } from "../atoms/atoms";
import WalletModal from "./connectWalletModal";
import useWallets from "./useWallets";

import {
  ArrowCircleDownIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowSmDownIcon,
  ArrowSmRightIcon,
  AtSymbolIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  LightningBoltIcon,
  PresentationChartLineIcon,
  QuestionMarkCircleIcon,
  ViewListIcon,
} from "@heroicons/react/solid";

function Header() {
  const router = useRouter();
  const [mintedNFT, setMintedNFT] = useState(null);
  const [miningStatus, setMiningStatus] = useState(null);
  const [loadingState, setLoadingState] = useState(0);
  const [txError, setTxError] = useState(null);
  const [currentAccount, setCurrentAccount] = useRecoilState(activeAccount);
  const [walletModal, setwalletModal] = useRecoilState(usewalletModal);
  const { disConnectWallet } = useWallets();
  const [disConnectModal, setDisconnectModal] = useState(false);
  const disconnectRef = useRef(null);

  // truncate from the middle
  const truncateFromMiddle = (fullStr = "", strLen, middleStr = "...") => {
    if (fullStr.length <= strLen) return fullStr;
    const midLen = middleStr.length;
    const charsToShow = strLen - midLen;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return (
      fullStr.substr(0, frontChars) +
      middleStr +
      fullStr.substr(fullStr.length - backChars)
    );
  };

  const truncatedAddress = truncateFromMiddle(currentAccount, 10);

  const naveStyle = (page) => {
    return `${router.pathname == `/${page}` ? "activeNave" : "inActiveNave"}`;
  };
  return (
    <div className=" mx-auto  w-full border-b-[0.095rem]     border-coinSinoTextColor2  bg-coinSinoPurpleNav  ">
      {" "}
      <header className="sticky  z-20    mx-auto flex max-w-7xl items-center  justify-between p-5   text-coinSinoTextColor   ">
        <Link href={"/"}>
          <a>
            {" "}
            <Image height={30} width={100} src={"/images/logoForDarkBg.png"} />
          </a>
        </Link>

        <WalletModal />
        {/* <div
          onClick={() =>
            !currentAccount ? setwalletModal(true) : disConnectWallet()
          }
        ></div> */}

        {/* connect button */}
        <div
          className=" order-1  cursor-pointer "
          // onClick={() =>
          //   !currentAccount ? setwalletModal(true) : disConnectWallet()
          // }
        >
          {!currentAccount ? (
            <div
              className="  w-32 cursor-pointer items-center space-x-1 rounded-2xl   border-2 border-white/30 bg-coinSinoGreen/10  p-1  text-center  hover:bg-coinSinoPurpleNav sm:max-w-sm"
              onClick={() => setwalletModal(true)}
            >
              <p>Connect</p>
            </div>
          ) : (
            <div
              className={` group relative flex cursor-pointer items-center space-x-1   rounded-2xl border-2 border-white/30  bg-coinSinoGreen/10  p-1  hover:bg-coinSinoPurpleNav sm:max-w-sm  `}
            >
              <div className=" mx-auto mt-0 h-6 w-6  rounded-full border-2 border-coinSinoGreen bg-[url('/images/walletIcon.svg')] bg-no-repeat text-white  hover:text-coinSinoPurpleNav  "></div>

              <div> {truncatedAddress}</div>
              <div className="">
                <ChevronDownIcon className="h-6" />
              </div>
              <div className=" absolute top-9 -right-4  hidden  h-80 w-64  space-y-3    border-[2px]  border-white/50 bg-coinSinoPurpleNav text-center  text-coinSinoTextColor2     hover:inline-block hover:text-coinSinoPink group-hover:inline-block sm:w-80">
                {[2].map((e,i) => (
                  <div
                  key={i}
                    onClick={disConnectWallet}
                    className="flex items-center justify-between border-b-[1px] border-coinSinoTextColor2  p-2 hover:bg-coinSinoTextColor2/20"
                  >
                    <p className="p-2 text-lg font-semibold">Disconnect</p>

                    <p className="   h-6 w-6   bg-[url('/images/logoutIcon.svg')] bg-no-repeat   ">
                     </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* logout modal */}

        <ul className="fixed  bottom-0 left-0 z-10 flex h-16 w-full items-center  justify-between rounded-xl border border-coinSinoTextColor2 bg-coinSinoPurpleNav p-2  text-center text-xs font-bold text-white/80     sm:static  sm:top-0      sm:float-right  sm:w-fit  sm:space-x-3 sm:border-none sm:text-base ">
          {/* how to play */}
          <div
            className={`flex flex-col ${naveStyle("faq")} cursor-pointer`}
            onClick={() => {
              router.push("/faq");
            }}
          >
            <div>
              <a>How to play</a>
            </div>
            <QuestionMarkCircleIcon className="h-6 self-center text-center sm:hidden" />
          </div>

          <div
            className={`flex flex-col ${naveStyle("winners")} cursor-pointer`}
            onClick={() => {
              router.push("/winners");
            }}
          >
            <div>
              <a>Winner list</a>
            </div>
            <ViewListIcon className="h-6 self-center text-center sm:hidden" />
          </div>

          {/* odd pool */}

          <div
            className={`flex flex-col ${naveStyle("oddPool")} cursor-pointer`}
            onClick={() => {
              router.push("/oddPool");
            }}
          >
            <div>
              <a>Odd Pool</a>
            </div>
            <LightningBoltIcon className="h-6 self-center text-center sm:hidden" />
          </div>
        </ul>
      </header>
      {/* mobile menu/nav */}
    </div>
  );
}

export default Header;
