import { useState } from 'react';
import { burnUSDCOnNoble } from '../scripts/depositForBurn';

export const useBridgeUSDC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [transactionLink, setTransactionLink] = useState<string>('');
  const [error, setError] = useState<string | null>(null);  // Ошибка хранится как строка
  const [insufficientFunds, setInsufficientFunds] = useState<boolean>(false);

  const bridgeUSDC = async (nobleAddress: string, mintAmount: string, ethRecipientAddress: string) => {
    if (!mintAmount || !ethRecipientAddress || !nobleAddress) {
      alert('Please enter all required fields.');
      return;
    }

    try {
      const txHash = await burnUSDCOnNoble(nobleAddress, parseInt(mintAmount), ethRecipientAddress);
      setTransactionLink(`https://mintscan.io/noble-testnet/tx/${txHash}`);
      setIsOpen(true);
    } catch (error: any) {
      console.error('Error during USDC bridging:', error);
      setError('Failed to burn USDC on Noble. Please check your funds.');
      setInsufficientFunds(true);  // Всегда устанавливаем флаг для показа модального окна
    }
  };

  return { bridgeUSDC, isOpen, setIsOpen, transactionLink, error, insufficientFunds, setInsufficientFunds };
};