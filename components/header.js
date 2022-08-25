import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { activeAccount } from "../atoms/atoms";

function Header() {
  const router = useRouter();
  const [mintedNFT, setMintedNFT] = useState(null);
  const [miningStatus, setMiningStatus] = useState(null);
  const [loadingState, setLoadingState] = useState(0);
  const [txError, setTxError] = useState(null);
  const [currentAccount, setCurrentAccount] = useRecoilState(activeAccount);
  const [correctNetwork, setCorrectNetwork] = useState(false);

  // Checks if wallet is connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (ethereum) {
      // const provider = new ethers.providers.Web3Provider(ethereum);
      // const signer = provider.getSigner();
      // console.log(signer);
    } else {
      return
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      setCurrentAccount(accounts[0]);
    } else {
    }
  };

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });

      if (chainId !== "0x29") {
        alert("You are not connected to the Telos network!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {}
  };

  // Checks if wallet is connected to the correct network
  const checkCorrectNetwork = async () => {
    const { ethereum } = window;
    if(!ethereum) return
    let chainId = await ethereum.request({ method: "eth_chainId" });

    if (Number(chainId) !== 41) {
      setCorrectNetwork(false);
      setCurrentAccount("");
    } else {
      setCorrectNetwork(true);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkCorrectNetwork();
  }, []);

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

        {/* connect button */}
        <a
          onClick={connectWallet}
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

        <ul className="fixed  bottom-0 text-xs left-0 z-10 flex h-16  w-full items-center justify-between rounded-xl border border-coinSinoTextColor2  bg-coinSinoPurpleNav p-5     text-white  sm:static   sm:top-0 sm:z-[51]  sm:float-right  sm:w-fit sm:space-x-3 sm:border-none ">
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
