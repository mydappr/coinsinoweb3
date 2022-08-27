import { Dialog, Transition } from "@headlessui/react";
import { ArrowSmRightIcon, XIcon } from "@heroicons/react/solid";
import { Fragment, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { usewalletModal } from "../atoms/atoms";
import useWallets from "./useWallets";

function WalletModal() {
  const [walletModal, setwalletModal] = useRecoilState(usewalletModal);

  const { connectMetaMask, connectWalletConnect } = useWallets();

  const [proverConnector, setProviderConnector] = useState("");
  const [userBalance, setuserBalance] = useState(0);

  // edit ticket functions
  function closeWalletModals() {
    setwalletModal(false);
  }

  function openWalletModal() {
    setwalletModal(true);
  }

  return (
    <Transition appear show={walletModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 "
        open={walletModal}
        onClose={closeWalletModals}
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
              <Dialog.Panel className="h-[400px] w-full  min-w-[300px] max-w-[350px] transform overflow-hidden rounded-2xl bg-coinSinoPurpleNav   p-6 text-left align-middle text-white shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="flex    justify-between text-lg font-extrabold leading-6 "
                >
                  Connect Wallet{" "}
                  <XIcon
                    className="h-7 cursor-pointer p-1 text-coinSinoGreen"
                    onClick={() => {
                      closeWalletModals();
                    }}
                  />
                </Dialog.Title>
                {/* !currentAccount ? connectWallet : disConnectWallet */}
                <div className="mt-10 flex flex-wrap items-center justify-between">
                  <div
                    className="items-centers flex cursor-pointer   flex-col"
                    onClick={connectMetaMask}
                  >
                    {" "}
                    <p className=" max-h-[100px]   self-center    bg-[url('/images/metamask.svg')]     bg-contain  bg-no-repeat p-6"></p>
                    <p className="text-base font-bold">metamask</p>
                  </div>
                  <div
                    className="flex cursor-pointer  flex-col   items-center"
                    onClick={connectWalletConnect}
                  >
                    {" "}
                    <p className=" max-h-[100px]      bg-[url('/images/WClogo.svg')]     bg-contain  bg-no-repeat p-6"></p>
                    <p className="text-base font-bold">WalletConnect</p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default WalletModal;
