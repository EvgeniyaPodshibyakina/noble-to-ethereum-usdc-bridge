import React, { useState } from "react";
import { SigningStargateClient } from "@cosmjs/stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { NOBLE_RPC_URL, NOBLE_CHAIN_ID } from "../../configs/noble-config";
import { KeplrWalletProps } from "./types/KeplrWalletProps";

const KeplrWallet: React.FC<KeplrWalletProps> = ({
  setNobleAddress,
  setMnemonicAddress,
  setSigner,
}) => {
  // State to track connection status
  const [isConnected, setIsConnected] = useState(false);

  // Function to connect to the Keplr wallet
  const connectKeplr = async () => {
    // Check if the Keplr extension is installed
    if (!window.keplr) {
      alert("Please install Keplr extension");
      return;
    }

    try {
      // Enable Keplr for the specified chain ID
      await window.keplr.enable(NOBLE_CHAIN_ID);

      // Get the offline signer and accounts from Keplr
      const offlineSigner = window.getOfflineSigner(NOBLE_CHAIN_ID);
      const accounts = await offlineSigner.getAccounts();
      setNobleAddress(accounts[0].address); // Set the Noble address from Keplr

      // Create a wallet from the mnemonic and set the mnemonic address
      const mnemonicWallet = await DirectSecp256k1HdWallet.fromMnemonic(
        import.meta.env.VITE_MNEMONIC,
        { prefix: "noble" }
      );
      const [mnemonicAccount] = await mnemonicWallet.getAccounts();
      setMnemonicAddress(mnemonicAccount.address);

      // Connect to the Stargate client and set the signer
      const client = await SigningStargateClient.connectWithSigner(
        NOBLE_RPC_URL,
        offlineSigner
      );
      setSigner(client);

      // Update the connection status to true
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting to Keplr:", error);
    }
  };

  // Function to disconnect from the Keplr wallet
  const disconnectKeplr = () => {
    // Reset all states related to the wallet connection
    setNobleAddress(null);
    setMnemonicAddress(null);
    setSigner(null);
    setIsConnected(false); // Set connection status to false
  };

  return (
    <div>
      {isConnected ? (
        // Button to disconnect from Keplr when the wallet is connected
        <button
          onClick={disconnectKeplr}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Disconnect Keplr
        </button>
      ) : (
        // Button to connect to Keplr when the wallet is not connected
        <button
          onClick={connectKeplr}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Connect Keplr
        </button>
      )}
    </div>
  );
};

export default KeplrWallet;
