import React, { useState } from 'react';
import MetaMaskWallet from './components/MetaMaskWallet/MetaMaskWallet';
import KeplrWallet from './components/KeplrWallet/KeplrWallet';
import TransactionModal from './components/TransactionModal/TransactionModal';
import { useNobleBalance } from './hooks/useNobleBalance';
import { useBridgeUSDC } from './hooks/useBridgeUSDC';
import { SigningStargateClient } from '@cosmjs/stargate';
import WalletDisplay from './components/WalletDisplay/WalletDisplay';
import TransactionForm from './components/TransactionForm/TransactionForm';

const App: React.FC = () => {
  const [mintAmount, setMintAmount] = useState<string>('');
  const [ethRecipientAddress, setEthRecipientAddress] = useState<string>('');
  const [nobleAddress, setNobleAddress] = useState<string | null>(null);
  const [mnemonicAddress, setMnemonicAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<SigningStargateClient | null>(null);

  // Получаем баланс USDC и возможную ошибку
  const { usdcBalance, error: balanceError } = useNobleBalance(nobleAddress || "");

  // Используем хук для работы с мостом USDC и состоянием модального окна
  const { bridgeUSDC, isOpen, setIsOpen, transactionLink, error } = useBridgeUSDC();

  const handleBridgeUSDC = async () => {
    console.log('Final mint amount before bridge:', mintAmount);
    if (nobleAddress) {
      await bridgeUSDC(nobleAddress, mintAmount, ethRecipientAddress);
    } else {
      console.error("Noble address is missing.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <h1 className="text-xl font-bold text-center mb-6">Bridge USDC from Noble to Ethereum</h1>
        
        <div className="mb-4">
          <KeplrWallet 
            setNobleAddress={setNobleAddress} 
            setMnemonicAddress={setMnemonicAddress}
            setSigner={setSigner} 
          />
        </div>
        
        <div className="mb-4">
          <MetaMaskWallet />
        </div>
        
        <WalletDisplay
          nobleAddress={nobleAddress}
          usdcBalance={usdcBalance}
          error={balanceError}
        />
        
        <TransactionForm
          mintAmount={mintAmount}
          ethRecipientAddress={ethRecipientAddress}
          setMintAmount={setMintAmount}
          setEthRecipientAddress={setEthRecipientAddress}
          onSubmit={handleBridgeUSDC}
        />
      </div>

      <TransactionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        transactionLink={transactionLink}
        error={error}
      />
    </div>
  );
};

export default App;