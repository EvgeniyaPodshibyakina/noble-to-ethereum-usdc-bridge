import { useState } from 'react';
import { burnUSDCOnNoble } from '../scripts/depositForBurn';

export const useBridgeUSDC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [transactionLink, setTransactionLink] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [insufficientFunds, setInsufficientFunds] = useState<boolean>(false);
  const bridgeUSDC = async (
    nobleAddress: string, 
    mintAmount: string, 
    ethRecipientAddress: string
  ) => {
    console.log('Mint amount input:', mintAmount); 
    const mintAmountNumber = parseInt(mintAmount, 10);
  
    if (isNaN(mintAmountNumber) || mintAmountNumber <= 0) {
      console.error(`Invalid mint amount: ${mintAmount}`);
      setError('Invalid amount specified for minting.');
      return;
    }
  
    // Предполагаем, что mintAmount уже в минимальных единицах (uusdc)
    const mintAmountInUUSDC = mintAmountNumber;
  
    try {
      const txHash = await burnUSDCOnNoble(
        nobleAddress, 
        mintAmountInUUSDC,  // Передаем значение в uusdc
        ethRecipientAddress
      );
      setTransactionLink(`https://mintscan.io/noble-testnet/tx/${txHash}`);
      setIsOpen(true);
    } catch (error: any) {
      console.error('Error during USDC bridging:', error);
      setError(error.message || 'Failed to execute burnUSDCOnNoble.');
    }
  };

  return { bridgeUSDC, isOpen, setIsOpen, transactionLink, error, insufficientFunds, setInsufficientFunds };
};