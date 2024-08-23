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

  // Проверка, если nobleAddress не null, тогда используем useNobleBalance
  const { usdcBalance, error: balanceError } = useNobleBalance(nobleAddress || "");

  const { bridgeUSDC, isOpen, setIsOpen, transactionLink, insufficientFunds, setInsufficientFunds, error } = useBridgeUSDC();

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
          <MetaMaskWallet setWalletAddress={setEthRecipientAddress} />
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

      {insufficientFunds && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Failed to burn USDC on Noble</h2>
            <p>Please check your funds on the Mnemonic Address and try again.</p>
            <button
              onClick={() => setInsufficientFunds(false)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;