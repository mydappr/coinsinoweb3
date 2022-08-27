import WalletConnectProvider from "@walletconnect/web3-provider";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Web3 from "web3";
import { activeAccount, usewalletModal } from "../atoms/atoms";

function useWallets() {
  const [proverConnector, setProviderConnector] = useState("");
  const [userBalance, setuserBalance] = useState(0);
  const [walletModal, setwalletModal] = useRecoilState(usewalletModal);
  const [currentAccount, setCurrentAccount] = useRecoilState(activeAccount);

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
                  rpcUrls: ["https://testnet.telos.net/evm"] /* ... */,
                },
              ],
            });
          } catch (addError) {
            // handle "add" error
          }
        }
        // handle other "switch" errors
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
        41: "https://testnet.telos.net/evm",
      },
    });
    //  Enable session (triggers QR Code modal)
    await p.enable();
    const web3 = new Web3(p);
    const chainId = await web3.eth.getChainId();
    if (chainId !== 41) {
      alert("You are not connected to the Telos network!");
      return;
    }
    const accounts = await web3.eth.getAccounts();
    alert(accounts[0]);
    setCurrentAccount(accounts[0]);

    setwalletModal(false);
    setProviderConnector("walletConnect");
  };

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectMetaMask = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        let chainId = await ethereum.request({ method: "eth_chainId" });
        if (chainId !== "0x29") {
          alert("You are not connected to the Telos network!");
          return;
        }
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setCurrentAccount(accounts[0]);
        setwalletModal(false);

        setProviderConnector("metaMask");
      } else {
        window.location.href = "https://metamask.io/download/";
      }
    } catch (error) {}
  };

  const disConnectWallet = async () => {
    try {
      setProviderConnector("");
      setCurrentAccount("");
      const { ethereum } = window;
      if (!ethereum) {
        const p = new WalletConnectProvider({
          rpc: {
            41: "https://testnet.telos.net/evm",
          },
        });

        await p.disconnect();
      }
    } catch (error) {}
  };

  return { connectWalletConnect, connectMetaMask, disConnectWallet };
}
export default useWallets;
