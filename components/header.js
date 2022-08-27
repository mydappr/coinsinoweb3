import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { activeAccount, usewalletModal } from "../atoms/atoms";
import WalletModal from "./connectWalletModal";
import useWallets from "./useWallets";

function Header() {
  const router = useRouter();
  const [mintedNFT, setMintedNFT] = useState(null);
  const [miningStatus, setMiningStatus] = useState(null);
  const [loadingState, setLoadingState] = useState(0);
  const [txError, setTxError] = useState(null);
  const [currentAccount, setCurrentAccount] = useRecoilState(activeAccount);
  const [walletModal, setwalletModal] = useRecoilState(usewalletModal);
  const { disConnectWallet } = useWallets();

  const naveStyle = (page) => {
    return `${router.pathname == `/${page}` ? "activeNave" : "inActiveNave"}`;
  };
  return (
    <div className=" mx-auto  w-full  max-w-5xl  ">
      {" "}
      <header className="sticky top-0    z-50 flex  items-center justify-between    border-b-[0.095rem]  border-coinSinoTextColor2 bg-coinSinoPurpleNav p-5 text-coinSinoTextColor   ">
        <Link href={"/"}>
          <a>
            {" "}
            <Image height={30} width={100} src={"/images/logoForDarkBg.png"} />
          </a>
        </Link>

        <WalletModal />

        {/* connect button */}
        <a
          onClick={() =>
            !currentAccount ? setwalletModal(true) : disConnectWallet()
          }
          className="group relative inline-block cursor-pointer text-lg"
        >
          <span className="relative z-10 block overflow-hidden rounded-lg border-2 border-gray-900 px-5 py-3 font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out group-hover:text-white">
            <span className="absolute inset-0 h-full w-full rounded-lg bg-coinSinoTextColor px-5 py-3"></span>
            <span className="ease absolute left-0 -ml-2 h-48 w-48 origin-top-right -translate-x-full translate-y-12 -rotate-90 bg-coinSinoPurple transition-all duration-300 group-hover:-rotate-180"></span>
            <span className="relative">
              {!currentAccount ? "Connect" : "Disconnect"}
            </span>
          </span>
          <span
            className="absolute bottom-0 right-0 -mb-1 -mr-1 h-12 w-full rounded-lg bg-gray-900 transition-all duration-200 ease-linear group-hover:mb-0 group-hover:mr-0"
            data-rounded="rounded-lg"
          ></span>
        </a>

        <ul className="fixed  bottom-0 left-0 z-10 flex h-16 w-full  items-center justify-between rounded-xl border border-coinSinoTextColor2 bg-coinSinoPurpleNav  p-5 text-xs     text-white  sm:static   sm:top-0 sm:z-[51]  sm:float-right  sm:w-fit sm:space-x-3 sm:border-none ">
          <Link href={"/faq"}>
            <a className={naveStyle("faq")}>How to play</a>
          </Link>
          <Link href={"/winners"}>
            <a className={naveStyle("winners")}>Winner list</a>
          </Link>
          <Link href={"/oddPool"}>
            <a className={naveStyle("oddPool")}>The Odd pool</a>
          </Link>
        </ul>
      </header>
      {/* mobile menu/nav */}
    </div>
  );
}

export default Header;
