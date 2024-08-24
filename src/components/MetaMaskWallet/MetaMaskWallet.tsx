import React, { useState, useEffect } from "react"; 
import { ethers, formatEther, formatUnits } from "ethers";


const MetaMaskWallet: React.FC = () => {
  const [walletAddress, setInternalWalletAddress] = useState<string>("");
  const [ethBalance, setEthBalance] = useState<string>("XX");
  const [usdcBalance, setUsdcBalance] = useState<string>("XX");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);

  const USDC_CONTRACT_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

  const requestAccount = async () => {
    setErrorMessage("");
    if (window.ethereum) {
      try {
        const accounts: string[] = (await window.ethereum.request({
          method: "eth_requestAccounts",
        })) as unknown as string[];
        if (accounts.length > 0) {
          setInternalWalletAddress(accounts[0]);
          setConnected(true);
        } else {
          setErrorMessage("No accounts found");
        }
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message || "User denied wallet connection");
          console.error("Error requesting account:", error.message);
        }
      }
    } else {
      setErrorMessage(
        "MetaMask not detected. Please install MetaMask and try again."
      );
      console.error("MetaMask not detected.");
    }
  };

  const getBalances = async () => {
    if (walletAddress && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);

        const balance = await provider.getBalance(walletAddress);
        setEthBalance(formatEther(balance));

        const usdcContract = new ethers.Contract(
          USDC_CONTRACT_ADDRESS,
          ["function balanceOf(address owner) view returns (uint256)"],
          provider
        );

        const usdcBalance = await usdcContract.balanceOf(walletAddress);
        setUsdcBalance(formatUnits(usdcBalance, 6));
      } catch (error) {
        if (error instanceof Error) {
          setEthBalance("Error");
          setUsdcBalance("Error");
          console.error("Error fetching balances:", error.message);
          setErrorMessage(
            error.message ||
              "Failed to retrieve balances. Please try again later."
          );
        }
      }
    } else {
      console.error("No wallet address or Ethereum provider found.");
    }
  };

  useEffect(() => {
    if (connected && walletAddress) {
      getBalances();
    }
  }, [walletAddress, connected]);

  const connectWallet = async () => {
    await requestAccount();
  };

  const disconnectWallet = () => {
    setInternalWalletAddress("");
    setConnected(false);
    setEthBalance("XX");
    setUsdcBalance("XX");
  };

  return (
    <div className="mb-4">
      {connected ? (
        <button
          onClick={disconnectWallet}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Disconnect MetaMask
        </button>
      ) : (
        <button
          onClick={connectWallet}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Connect MetaMask
        </button>
      )}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      {walletAddress && (
        <div className="mt-4 border p-4 rounded-md">
          <p className="font-mono text-sm break-all">
            Address: {walletAddress}
          </p>
          <p className="font-mono text-sm">Balance: {ethBalance} SepoliaETH</p>
          <p className="font-mono text-sm">Balance: {usdcBalance} USDC</p>
        </div>
      )}
    </div>
  );
};

export default MetaMaskWallet;