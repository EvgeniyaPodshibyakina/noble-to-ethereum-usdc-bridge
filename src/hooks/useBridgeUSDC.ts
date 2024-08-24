import { useState } from 'react';
import { burnUSDCOnNoble } from '../scripts/depositForBurn';

export const useBridgeUSDC = () => {
  // State to control the visibility of the modal
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // State to store the transaction link
  const [transactionLink, setTransactionLink] = useState<string>('');
  
  // State to store the error message, if any
  const [error, setError] = useState<string | null>(null);

  // Function to handle the bridging process of USDC
  const bridgeUSDC = async (
    nobleAddress: string, 
    mintAmount: string, 
    ethRecipientAddress: string
  ) => {
    console.log('Mint amount input:', mintAmount); 
    const mintAmountNumber = parseInt(mintAmount, 10);

    // Validate the mint amount
    if (isNaN(mintAmountNumber) || mintAmountNumber <= 0) {
      console.error(`Invalid mint amount: ${mintAmount}`);
      setError('Invalid amount specified for minting.');
      setIsOpen(true); // Open the modal in case of an error
      return;
    }

    const mintAmountInUUSDC = mintAmountNumber;

    try {
      // Call the function to burn USDC on Noble and handle the result
      const { txHash, error } = await burnUSDCOnNoble(
        nobleAddress, 
        mintAmountInUUSDC,
        ethRecipientAddress
      );

      // Handle the error if any occurred during the transaction
      if (error) {
        setTransactionLink(txHash ? `https://mintscan.io/noble-testnet/tx/${txHash}` : '');
        throw new Error(error);
      }

      // Set the transaction link if the transaction was successful
      setTransactionLink(`https://mintscan.io/noble-testnet/tx/${txHash}`);
      setError(null); // Clear any previous error message
      console.log('Transaction completed successfully:', txHash);
    } catch (error: any) {
      // Catch and log any errors that occurred during the process
      console.error('Error during USDC bridging:', error);
      setError(error.message || 'An error occurred during the transaction.');
      console.log('Error set to state:', error.message || 'An error occurred during the transaction.');
    } finally {
      setIsOpen(true); // Ensure the modal is opened regardless of success or failure
    }
  };

  // Return the necessary values and functions to be used by the component
  return { bridgeUSDC, isOpen, setIsOpen, transactionLink, error };
};