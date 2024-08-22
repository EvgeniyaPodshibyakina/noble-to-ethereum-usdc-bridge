import React, { useState } from 'react';
import MetaMaskWallet from './components/MetaMaskWallet/MetaMaskWallet';
import KeplrWallet from './components/KeplrWallet/KeplrWallet';
import TransactionModal from './components/TransactionModal/TransactionModal';
import { useNobleBalance } from './hooks/useNobleBalance';
import { useBridgeUSDC } from './hooks/useBridgeUSDC';

const App: React.FC = () => {
  const [mintAmount, setMintAmount] = useState<string>('');
  const [ethRecipientAddress, setEthRecipientAddress] = useState<string>('');
  const [nobleAddress, setNobleAddress] = useState<string>('');
  const [ethAddress, setEthAddress] = useState<string>(''); 

  const { usdcBalance, error: balanceError } = useNobleBalance(nobleAddress);
  const { bridgeUSDC, isOpen, setIsOpen, transactionLink, insufficientFunds, setInsufficientFunds } = useBridgeUSDC();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <h1 className="text-xl font-bold text-center mb-6">Bridge USDC from Noble to Ethereum</h1>
        <div className="mb-4">
          <KeplrWallet setNobleAddress={setNobleAddress} />
        </div>
        <div className="mb-4">
          <MetaMaskWallet setWalletAddress={setEthAddress} />
        </div>
        <div className="flex justify-between items-center mb-4 border p-4 rounded-md">
          <span className="font-mono text-sm break-all">{nobleAddress || 'nobleXXXX'}</span>
          <span className="font-mono text-lg ml-2">
            {balanceError ? balanceError : `${usdcBalance} USDC`}
          </span>
        </div>
        <div className="border p-4 rounded-md mb-6">
          <h2 className="text-lg mb-4 text-center">1. Burn USDC on Noble</h2>
          <input
            type="text"
            placeholder="Mint amount"
            className="w-full p-2 border rounded mb-4"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="ETH recipient address"
            className="w-full p-2 border rounded mb-4"
            value={ethRecipientAddress}
            onChange={(e) => setEthRecipientAddress(e.target.value)}
          />
          <button
            onClick={() => bridgeUSDC(nobleAddress, mintAmount, ethRecipientAddress)}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Bridge
          </button>
        </div>
      </div>

      <TransactionModal isOpen={isOpen} onClose={() => setIsOpen(false)} transactionLink={transactionLink} />

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