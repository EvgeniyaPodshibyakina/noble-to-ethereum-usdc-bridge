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

function createDefaultRegistry(): Registry {
  return new Registry(cctpTypes);
}

export const burnUSDCOnNoble = async (
  nobleAddress: string,
  amount: number,
  ethRecipientAddress: string
) => {
  try {
    const mnemonic = import.meta.env.VITE_MNEMONIC || "";

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "noble",
    });

    const [account] = await wallet.getAccounts();

    if (!account) {
      throw new Error("Failed to retrieve account from wallet");
    }

    console.log("Noble Address:", nobleAddress);
    console.log("Mnemonic Address:", account.address);

    const client = await SigningStargateClient.connectWithSigner(
      NOBLE_RPC_URL,
      wallet,
      { registry: createDefaultRegistry() }
    );

    const cleanedMintRecipient = ethRecipientAddress.replace(/^0x/, "");
    const zeroesNeeded = 64 - cleanedMintRecipient.length;
    const mintRecipient = "0".repeat(zeroesNeeded) + cleanedMintRecipient;
    const buffer = Buffer.from(mintRecipient, "hex");
    const mintRecipientBytes = new Uint8Array(buffer);

    const msg = {
      typeUrl: "/circle.cctp.v1.MsgDepositForBurn",
      value: {
        from: account.address,
        amount: amount.toString(),
        destinationDomain: 0, 
        mintRecipient: mintRecipientBytes,
        burnToken: "uusdc",
      },
    };

    const fee = {
      amount: [
        {
          denom: "uusdc",
          amount: "200", 
        },
      ],
      gas: "300000", 
    };
    const memo = "";

    const result = await client.signAndBroadcast(
      account.address,
      [msg],
      fee,
      memo
    );

    if (result.code !== 0) {
    
      return {
        txHash: result.transactionHash || null,
        error: `Transaction failed with code ${result.code}: ${result.rawLog}`,
      };
    }

    return { txHash: result.transactionHash, error: null };

  } catch (error) {
    console.error("Error during burnUSDCOnNoble:", error);
    throw new Error("Failed to execute burnUSDCOnNoble");
  }
};
