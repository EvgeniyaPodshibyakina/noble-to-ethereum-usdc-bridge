import {
  DirectSecp256k1HdWallet,
  Registry,
  GeneratedType,
} from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { MsgDepositForBurn } from "../../generated/tx";
import { Buffer } from "buffer";
import { NOBLE_RPC_URL } from "../configs/noble-config";

// Ensure Buffer is available globally (required for certain cryptographic operations)
window.Buffer = window.Buffer || Buffer;

// Define the types for Circle's CCTP messages
export const cctpTypes: ReadonlyArray<[string, GeneratedType]> = [
  ["/circle.cctp.v1.MsgDepositForBurn", MsgDepositForBurn],
];

// Create a registry with CCTP message types
function createDefaultRegistry(): Registry {
  return new Registry(cctpTypes);
}

// Function to burn USDC on the Noble blockchain
export const burnUSDCOnNoble = async (
  nobleAddress: string,
  amount: number,
  ethRecipientAddress: string
) => {
  try {
    // Retrieve the mnemonic phrase from environment variables
    const mnemonic = import.meta.env.VITE_MNEMONIC || "";

    // Generate a wallet from the mnemonic phrase
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "noble",
    });

    // Get the first account from the wallet
    const [account] = await wallet.getAccounts();

    if (!account) {
      throw new Error("Failed to retrieve account from wallet");
    }

    console.log("Noble Address:", nobleAddress);
    console.log("Mnemonic Address:", account.address);

    // Connect to the Noble blockchain using the wallet's signer
    const client = await SigningStargateClient.connectWithSigner(
      NOBLE_RPC_URL,
      wallet,
      { registry: createDefaultRegistry() }
    );

    // Format the Ethereum recipient address (remove '0x' prefix and pad with zeros)
    const cleanedMintRecipient = ethRecipientAddress.replace(/^0x/, "");
    const zeroesNeeded = 64 - cleanedMintRecipient.length;
    const mintRecipient = "0".repeat(zeroesNeeded) + cleanedMintRecipient;
    const buffer = Buffer.from(mintRecipient, "hex");
    const mintRecipientBytes = new Uint8Array(buffer);

    // Create the MsgDepositForBurn message
    const msg = {
      typeUrl: "/circle.cctp.v1.MsgDepositForBurn",
      value: {
        from: account.address,
        amount: amount.toString(),
        destinationDomain: 0, // Ensure this value corresponds to the target chain (Sepolia)
        mintRecipient: mintRecipientBytes,
        burnToken: "uusdc",
      },
    };

    // Define the transaction fee
    const fee = {
      amount: [
        {
          denom: "uusdc",
          amount: "200", // Transaction fee amount
        },
      ],
      gas: "300000", // Gas limit increased to 300000
    };
    const memo = "";

    // Sign and broadcast the transaction
    const result = await client.signAndBroadcast(
      account.address,
      [msg],
      fee,
      memo
    );

    if (result.code !== 0) {
      // Return the transaction hash and error if the transaction failed
      return {
        txHash: result.transactionHash || null,
        error: `Transaction failed with code ${result.code}: ${result.rawLog}`,
      };
    }

    // Return the transaction hash if successful
    return { txHash: result.transactionHash, error: null };
  } catch (error) {
    // Log and rethrow any errors that occur during the process
    console.error("Error during burnUSDCOnNoble:", error);
    throw new Error("Failed to execute burnUSDCOnNoble");
  }
};
