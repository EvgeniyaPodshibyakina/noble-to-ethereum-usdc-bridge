import {
  DirectSecp256k1HdWallet,
  Registry,
  GeneratedType,
} from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { MsgReceiveMessage } from "../../generated/tx";
import { ethers } from "ethers";
import { arrayify, hexlify } from "@ethersproject/bytes";
import { Buffer } from "buffer";
import { NOBLE_RPC_URL } from "../configs/noble-config";

// Define the types for Circle's CCTP messages to handle message receipts
export const cctpTypes: ReadonlyArray<[string, GeneratedType]> = [
  ["/circle.cctp.v1.MsgReceiveMessage", MsgReceiveMessage],
];

// Create a registry with CCTP message types for handling transactions
function createDefaultRegistry(): Registry {
  return new Registry(cctpTypes);
}

const apiKey = import.meta.env.VITE_CIRCLE_API_KEY;

// Function to fetch the message and attestation from CCTP using a transaction hash
export const getMessageFromCCTP = async (txHash: string) => {
  const response = await fetch(
    `https://api.circle.com/v1/cross-chain/attestations/${txHash}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`, // Use the Circle API key from environment variables
        "Content-Type": "application/json",
      },
    }
  );

  // Check if the response is not successful and throw an error if so
  if (!response.ok) {
    throw new Error("Failed to fetch message from CCTP");
  }

  // Parse and return the message and attestation from the response
  const data = await response.json();
  return {
    messageHex: data.message,
    attestation: data.attestation,
  };
};

// Function to receive and process a CCTP message on the Noble blockchain
export const receiveMessageFromCCTP = async (txHash: string) => {
  // Retrieve the mnemonic phrase from environment variables
  const mnemonic = import.meta.env.VITE_MNEMONIC || "";

  // Generate a wallet from the mnemonic phrase
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "noble",
  });

  // Get the first account from the wallet
  const [account] = await wallet.getAccounts();

  // Connect to the Noble blockchain using the wallet's signer
  const client = await SigningStargateClient.connectWithSigner(
    NOBLE_RPC_URL,
    wallet,
    { registry: createDefaultRegistry() }
  );

  // Fetch the message and attestation from CCTP using the transaction hash
  const { messageHex, attestation } = await getMessageFromCCTP(txHash);

  // Convert the message and attestation from hexadecimal to bytes
  const messageBytes = new Uint8Array(
    Buffer.from(messageHex.replace("0x", ""), "hex")
  );
  const attestationBytes = new Uint8Array(
    Buffer.from(attestation.replace("0x", ""), "hex")
  );

  // Create the MsgReceiveMessage for Stargate to process on the Noble blockchain
  const msg = {
    typeUrl: "/circle.cctp.v1.MsgReceiveMessage",
    value: {
      from: account.address,
      message: messageBytes,
      attestation: attestationBytes,
    },
  };

  // Define the transaction fee and gas limit
  const fee = {
    amount: [{ denom: "uusdc", amount: "0" }], // Set fee to 0 uusdc
    gas: "300000", // Set the gas limit
  };
  const memo = "";

  // Sign and broadcast the transaction to the Noble blockchain
  const result = await client.signAndBroadcast(
    account.address,
    [msg],
    fee,
    memo
  );

  console.log(
    `Message received and processed on Noble: https://mintscan.io/noble-testnet/tx/${result.transactionHash}`
  );

  // Return the message and attestation
  return { messageHex, attestation };
};

// Function to send the message and attestation to the Sepolia network
export const sendMessageToSepolia = async ({
  messageHex,
  attestation,
  contractAddress,
}: {
  messageHex: string;
  attestation: string;
  contractAddress: string;
}) => {
  // Create a provider for Ethereum network using MetaMask's injected provider
  const provider = new ethers.BrowserProvider(
    window.ethereum as unknown as ethers.Eip1193Provider
  );

  // Get the signer from the provider
  const signer = await provider.getSigner();

  // Convert the message and attestation from hexadecimal to bytes
  const messageBytes = arrayify(messageHex);
  const attestationBytes = arrayify(attestation);

  // Create and send a transaction to the specified contract address on Sepolia
  const tx = await signer.sendTransaction({
    to: contractAddress, // Use the contract address provided by the user
    data: hexlify([...messageBytes, ...attestationBytes]), // Combine the message and attestation into the transaction data
  });

  // Notify the user of the transaction hash or failure
  if (tx.hash) {
    alert(
      `Transaction sent to Sepolia successfully. Transaction Hash: ${tx.hash}`
    );
  } else {
    alert("Failed to retrieve transaction receipt.");
  }

  return tx;
};