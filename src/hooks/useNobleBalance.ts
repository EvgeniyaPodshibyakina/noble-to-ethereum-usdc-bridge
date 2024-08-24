import { useState, useEffect } from "react";
import { StargateClient } from "@cosmjs/stargate";
import {
  NOBLE_RPC_URL,
  NOBLE_COIN_MINIMAL_DENOM,
} from "../configs/noble-config";

export const useNobleBalance = (nobleAddress: string) => {
  // State to store the USDC balance
  const [usdcBalance, setUsdcBalance] = useState<string>("XX");

  // State to store any error messages
  const [error, setError] = useState<string | null>(null);

  // useEffect to fetch the balance whenever the nobleAddress changes
  useEffect(() => {
    // Function to fetch the balance from the Noble blockchain
    const fetchNobleBalance = async (address: string) => {
      try {
        // Connect to the Stargate client using the specified RPC URL
        const client = await StargateClient.connect(NOBLE_RPC_URL);

        // Get the balance of the address in the minimal denomination (uusdc)
        const balance = await client.getBalance(
          address,
          NOBLE_COIN_MINIMAL_DENOM
        );

        // Convert the balance from minimal denomination (uusdc) to USDC
        const amountInUSDC = (Number(balance.amount) / 1e6).toFixed(0);

        // Update the state with the fetched balance
        setUsdcBalance(amountInUSDC);

        // Clear any previous error messages
        setError(null);
      } catch (error) {
        // Handle any errors that occur during the balance fetch
        console.error("Error fetching balance:", error);
        setError("Failed to fetch balance. Please try again later.");
      }
    };

    // If nobleAddress is provided, fetch the balance
    if (nobleAddress) {
      fetchNobleBalance(nobleAddress);
    }
  }, [nobleAddress]); // Dependency array ensures the effect runs whenever nobleAddress changes

  // Return the USDC balance and any error messages
  return { usdcBalance, error };
};
