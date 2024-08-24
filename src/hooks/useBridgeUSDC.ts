import { useState } from 'react';
import { burnUSDCOnNoble } from '../scripts/depositForBurn';

export const useBridgeUSDC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [transactionLink, setTransactionLink] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

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
      setIsOpen(true); // Открываем модальное окно при ошибке
      return;
    }

    const mintAmountInUUSDC = mintAmountNumber;

    try {
      const { txHash, error } = await burnUSDCOnNoble(
        nobleAddress, 
        mintAmountInUUSDC,
        ethRecipientAddress
      );

      if (error) {
        setTransactionLink(txHash ? `https://mintscan.io/noble-testnet/tx/${txHash}` : '');
        throw new Error(error);
      }

      setTransactionLink(`https://mintscan.io/noble-testnet/tx/${txHash}`);
      setError(null); // Успешная транзакция сбрасывает ошибку
      console.log('Transaction completed successfully:', txHash);
    } catch (error: any) {
      console.error('Error during USDC bridging:', error);
      setError(error.message || 'An error occurred during the transaction.');
      console.log('Error set to state:', error.message || 'An error occurred during the transaction.');
    } finally {
      setIsOpen(true); // Открываем модальное окно в любом случае
    }
  };

  return { bridgeUSDC, isOpen, setIsOpen, transactionLink, error };
};