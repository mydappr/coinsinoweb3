import WalletConnectProvider from "@walletconnect/web3-provider";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Web3 from "web3";
import {
  activeAccount,
  connectorType,
  rpcaddress,
  usewalletModal,
} from "../atoms/atoms";
import UseToaster from "./UseToaster";

function useWallets() {
  const [providerConnector, setProviderConnector] =
    useRecoilState(connectorType);
  const [userBalance, setuserBalance] = useState(0);
  const [walletModal, setwalletModal] = useRecoilState(usewalletModal);
  const [currentAccount, setCurrentAccount] = useRecoilState(activeAccount);
  const { Toast } = UseToaster();

  const [rpcUrl, setrpcUrl] = useRecoilState(rpcaddress);

  // Checks if wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
      }

      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x29" }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x29",
                  chainName: "Telos Testnet",
                  rpcUrls: rpcUrl /* ... */,
                },
              ],
            });
          } catch (addError) {
            // handle "add" error
          }
        }
        // handle other "switch" errors
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
        if (chainId !== "0x29") {
          Toast("You are not connected to the Telos network!");
          return;
        }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0]);
        setwalletModal(false);
        setProviderConnector("metaMask");
      }
    } catch (error) {}
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // wallet Connect
  const connectWalletConnect = async () => {
    const p = new WalletConnectProvider({
      rpc: {
        41: rpcUrl,
      },
    });
    //  Enable session (triggers QR Code modal)
    await p.enable();
    const web3 = new Web3(p);
    const chainId = await web3.eth.getChainId();
    if (chainId !== 41) {
      Toast("You are not connected to the Telos network!");
      return;
    }
    const accounts = await web3.eth.getAccounts();

    setCurrentAccount(accounts[0]);
    setProviderConnector("walletConnect");
    setwalletModal(false);
  };

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectMetaMask = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        let chainId = await ethereum.request({ method: "eth_chainId" });
        if (chainId !== "0x29") {
          Toast("You are not connected to the Telos network!");
          return;
        }
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setCurrentAccount(accounts[0]);

        setProviderConnector("metaMask");
        setwalletModal(false);
      } else {
        window.location.href = "https://metamask.io/download/";
      }
    } catch (error) {}
  };

  // on Account chnaged

  useEffect(() => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        ethereum.on("accountsChanged", (accounts) => {
          if (accounts[0] !== currentAccount) {
            setCurrentAccount(accounts[0]);
          }
        });
      }
    } catch (error) {}
  }, []);

  const disConnectWallet = async () => {
    try {
      setProviderConnector("");
      setCurrentAccount("");
      const { ethereum } = window;
      if (!ethereum) {
        const p = new WalletConnectProvider({
          rpc: {
            41: rpcUrl,
          },
        });

        await p.disconnect();
      }
    } catch (error) {}
  };

  return { connectWalletConnect, connectMetaMask, disConnectWallet };
}
export default useWallets;
