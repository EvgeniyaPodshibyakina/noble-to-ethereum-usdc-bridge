import React, { useState } from 'react';
import MetaMaskWallet from './components/MetaMaskWallet/MetaMaskWallet';
import KeplrWallet from './components/KeplrWallet/KeplrWallet';
import TransactionModal from './ui/TransactionModal/TransactionModal';
import { useNobleBalance } from './hooks/useNobleBalance';
import { useBridgeUSDC } from './hooks/useBridgeUSDC';
import { SigningStargateClient } from '@cosmjs/stargate';
import WalletDisplay from './ui/WalletDisplay/WalletDisplay';
import TransactionForm from './ui/TransactionForm/TransactionForm';

const App: React.FC = () => {
  // State for the amount of USDC to mint
  const [mintAmount, setMintAmount] = useState<string>('');
  
  // State for the Ethereum recipient address
  const [ethRecipientAddress, setEthRecipientAddress] = useState<string>('');
  
  // State for the Noble wallet address
  const [nobleAddress, setNobleAddress] = useState<string | null>(null);
  
  // State for the mnemonic wallet address
  const [mnemonicAddress, setMnemonicAddress] = useState<string | null>(null);
  
  // State for the Stargate signer
  const [signer, setSigner] = useState<SigningStargateClient | null>(null);

  // Get the USDC balance and any error using the nobleAddress
  const { usdcBalance, error: balanceError } = useNobleBalance(nobleAddress || "");

  // Use the custom hook to handle USDC bridging and modal state
  const { bridgeUSDC, isOpen, setIsOpen, transactionLink, error } = useBridgeUSDC();

  // Handler function to initiate the bridging process
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
        
        {/* KeplrWallet component to connect and manage the Noble wallet */}
        <div className="mb-4">
          <KeplrWallet 
            setNobleAddress={setNobleAddress} 
            setMnemonicAddress={setMnemonicAddress}
            setSigner={setSigner} 
          />
        </div>
        
        {/* MetaMaskWallet component to connect and manage the Ethereum wallet */}
        <div className="mb-4">
          <MetaMaskWallet />
        </div>
        
        {/* Display the Noble wallet address and USDC balance */}
        <WalletDisplay
          nobleAddress={nobleAddress}
          usdcBalance={usdcBalance}
          error={balanceError}
        />
        
        {/* Form to input the amount to mint and the Ethereum recipient address */}
        <TransactionForm
          mintAmount={mintAmount}
          ethRecipientAddress={ethRecipientAddress}
          setMintAmount={setMintAmount}
          setEthRecipientAddress={setEthRecipientAddress}
          onSubmit={handleBridgeUSDC}
        />
      </div>

      {/* Modal to display the transaction status */}
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