import React, { useState, useEffect } from "react"; 
import { ethers, formatEther, formatUnits } from "ethers";

// MetaMaskWallet component definition
const MetaMaskWallet: React.FC = () => {
  // States to manage wallet address, balances, error messages, and connection status
  const [walletAddress, setInternalWalletAddress] = useState<string>("");
  const [ethBalance, setEthBalance] = useState<string>("XX");
  const [usdcBalance, setUsdcBalance] = useState<string>("XX");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);

  // USDC contract address on Ethereum
  const USDC_CONTRACT_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

  // Function to request MetaMask account connection
  const requestAccount = async () => {
    setErrorMessage(""); // Clear any previous error messages
    if (window.ethereum) {
      try {
        // Request MetaMask accounts
        const accounts: string[] = (await window.ethereum.request({
          method: "eth_requestAccounts",
        })) as unknown as string[];
        
        if (accounts.length > 0) {
          setInternalWalletAddress(accounts[0]); // Set the wallet address
          setConnected(true); // Update connection status to true
        } else {
          setErrorMessage("No accounts found");
        }
      } catch (error) {
        // Handle errors during the account request process
        if (error instanceof Error) {
          setErrorMessage(error.message || "User denied wallet connection");
          console.error("Error requesting account:", error.message);
        }
      }
    } else {
      // MetaMask is not detected in the browser
      setErrorMessage(
        "MetaMask not detected. Please install MetaMask and try again."
      );
      console.error("MetaMask not detected.");
    }
  };

  // Function to get ETH and USDC balances
  const getBalances = async () => {
    if (walletAddress && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Get ETH balance
        const balance = await provider.getBalance(walletAddress);
        setEthBalance(formatEther(balance));

        // Get USDC balance from the contract
        const usdcContract = new ethers.Contract(
          USDC_CONTRACT_ADDRESS,
          ["function balanceOf(address owner) view returns (uint256)"],
          provider
        );

        const usdcBalance = await usdcContract.balanceOf(walletAddress);
        setUsdcBalance(formatUnits(usdcBalance, 6));
      } catch (error) {
        // Handle errors during the balance retrieval process
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

  // useEffect to fetch balances when the wallet is connected
  useEffect(() => {
    if (connected && walletAddress) {
      getBalances();
    }
  }, [walletAddress, connected]);

  // Function to initiate wallet connection
  const connectWallet = async () => {
    await requestAccount();
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    setInternalWalletAddress(""); // Reset wallet address
    setConnected(false); // Set connection status to false
    setEthBalance("XX"); // Reset ETH balance display
    setUsdcBalance("XX"); // Reset USDC balance display
  };

  return (
    <div className="mb-4">
      {connected ? (
        // Button to disconnect MetaMask when the wallet is connected
        <button
          onClick={disconnectWallet}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Disconnect MetaMask
        </button>
      ) : (
        // Button to connect MetaMask when the wallet is not connected
        <button
          onClick={connectWallet}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Connect MetaMask
        </button>
      )}
      {/* Display error message if exists */}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      {/* Display wallet address and balances if connected */}
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