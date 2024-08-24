import React, { useState } from 'react';
import { SigningStargateClient } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { 
  NOBLE_RPC_URL,
  NOBLE_CHAIN_ID,
} from '../../../noble-config';

interface KeplrWalletProps {
  setNobleAddress: React.Dispatch<React.SetStateAction<string | null>>;
  setMnemonicAddress: React.Dispatch<React.SetStateAction<string | null>>;
  setSigner: React.Dispatch<React.SetStateAction<SigningStargateClient | null>>;
}

const KeplrWallet: React.FC<KeplrWalletProps> = ({ setNobleAddress, setMnemonicAddress, setSigner }) => {
  const [isConnected, setIsConnected] = useState(false);  // Состояние для отслеживания подключения

  const connectKeplr = async () => {
    if (!window.keplr) {
      alert("Please install Keplr extension");
      return;
    }

    try {
      await window.keplr.enable(NOBLE_CHAIN_ID);
      const offlineSigner = window.getOfflineSigner(NOBLE_CHAIN_ID);
      const accounts = await offlineSigner.getAccounts();
      setNobleAddress(accounts[0].address);

      const mnemonicWallet = await DirectSecp256k1HdWallet.fromMnemonic(
        import.meta.env.VITE_MNEMONIC,
        { prefix: 'noble' }
      );
      const [mnemonicAccount] = await mnemonicWallet.getAccounts();
      setMnemonicAddress(mnemonicAccount.address);

      const client = await SigningStargateClient.connectWithSigner(NOBLE_RPC_URL, offlineSigner);
      setSigner(client);

      setIsConnected(true);  // Устанавливаем состояние подключения в true
    } catch (error) {
      console.error("Error connecting to Keplr:", error);
    }
  };

  const disconnectKeplr = () => {
    setNobleAddress(null);
    setMnemonicAddress(null);
    setSigner(null);
    setIsConnected(false);  // Сбрасываем состояние подключения
  };

  return (
    <div>
      {isConnected ? (
        <button onClick={disconnectKeplr} className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
          Disconnect Keplr
        </button>
      ) : (
        <button onClick={connectKeplr} className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Connect Keplr
        </button>
      )}
    </div>
  );
};

export default KeplrWallet;