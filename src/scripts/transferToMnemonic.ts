import { SigningStargateClient } from "@cosmjs/stargate";
import { NOBLE_COIN_MINIMAL_DENOM } from "../configs/noble-config";

// Function to transfer USDC to a mnemonic address
export async function transferUSDCToMnemonicAddress(
  fromAddress: string, // The address from which USDC will be sent
  mnemonicAddress: string, // The target mnemonic address to receive the USDC
  amount: number, // The amount of USDC to transfer
  signer: SigningStargateClient // The signer object used to sign and broadcast the transaction
) {
  try {
    // Convert the USDC amount to its minimal denomination (uusdc)
    const amountInUusdc = (amount * 1e6).toString();

    // Define the transaction fee and gas limit
    const fee = {
      amount: [{ denom: NOBLE_COIN_MINIMAL_DENOM, amount: "5000" }], // 5000 uusdc as the fee
      gas: "200000", // Gas limit set to 200000
    };

    // Send the tokens from the fromAddress to the mnemonicAddress
    const result = await signer.sendTokens(
      fromAddress,
      mnemonicAddress,
      [{ denom: NOBLE_COIN_MINIMAL_DENOM, amount: amountInUusdc }],
      fee
    );

    // Return the transaction hash if the transfer was successful
    return result.transactionHash;
  } catch (error) {
    // Log the error and throw a new error to indicate the failure of the transfer
    console.error("Error during transfer to mnemonic address:", error);
    throw new Error("Failed to transfer USDC to mnemonic address.");
  }
}
