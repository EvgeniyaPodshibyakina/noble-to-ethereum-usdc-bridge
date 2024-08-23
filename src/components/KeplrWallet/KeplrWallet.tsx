// import React, { useState } from 'react';
// import { NOBLE_REST_URL,
//         NOBLE_RPC_URL,
//         NOBLE_CHAIN_ID,
//         NOBLE_COIN_MINIMAL_DENOM,
//         NOBLE_COIN_DENOM,
//         NOBLE_COIN_DECIMALS } from '../../../noble-config'; // Импортируем конфигурации

// interface KeplrWalletProps {
//   setNobleAddress: (address: string) => void;
// }

// const KeplrWallet: React.FC<KeplrWalletProps> = ({ setNobleAddress }) => {
//   const [connected, setConnected] = useState<boolean>(false);
//   const [errorMessage, setErrorMessage] = useState<string>('');

//   const connectKeplr = async () => {
//     if (!window.keplr) {
//       setErrorMessage("Keplr not installed");
//       return;
//     }

//     try {
//       await window.keplr.experimentalSuggestChain({
//         chainId: NOBLE_CHAIN_ID,
//         chainName: "Grand",
//         rpc: NOBLE_RPC_URL,
//         rest: NOBLE_REST_URL,
//         bip44: {
//           coinType: 118,
//         },
//         bech32Config: {
//           bech32PrefixAccAddr: "noble",
//           bech32PrefixAccPub: "noblepub",
//           bech32PrefixValAddr: "noblevaloper",
//           bech32PrefixValPub: "noblevaloperpub",
//           bech32PrefixConsAddr: "noblevalcons",
//           bech32PrefixConsPub: "noblevalconspub",
//         },
//         currencies: [
//           {
//             coinDenom: NOBLE_COIN_DENOM,
//             coinMinimalDenom: NOBLE_COIN_MINIMAL_DENOM,
//             coinDecimals: NOBLE_COIN_DECIMALS,
//             coinImageUrl: "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/grand/uusdc.png"
//           },
//         ],
//         feeCurrencies: [
//           {
//             coinDenom: NOBLE_COIN_DENOM,
//             coinMinimalDenom: NOBLE_COIN_MINIMAL_DENOM,
//             coinDecimals: NOBLE_COIN_DECIMALS,
//             gasPriceStep: {
//               low: 0.1,
//               average: 0.1,
//               high: 0.2
//             }
//           },
//         ],
//         stakeCurrency: {
//           coinDenom: "STAKE",
//           coinMinimalDenom: "ustake",
//           coinDecimals: 6,
//           coinImageUrl: "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/grand/ustake.png"
//         },
//       });

//       await window.keplr.enable(NOBLE_CHAIN_ID);

//       const offlineSigner = window.getOfflineSigner(NOBLE_CHAIN_ID);
//       const accounts = await offlineSigner.getAccounts();

//       if (accounts.length > 0) {
//         setNobleAddress(accounts[0].address);
//         setConnected(true);
//         setErrorMessage('');
//       } else {
//         setErrorMessage("No accounts found");
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         setErrorMessage(`Failed to connect: ${error.message}`);
//       }
//     }
//   };

//   const disconnectKeplr = () => {
//     setNobleAddress('');
//     setConnected(false);
//   };

//   return (
//     <div className="mb-4">
//       {connected ? (
//         <button onClick={disconnectKeplr} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
//           Disconnect Keplr
//         </button>
//       ) : (
//         <button onClick={connectKeplr} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
//           Connect Keplr
//         </button>
//       )}
//       {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
//     </div>
//   );
// };

// export default KeplrWallet;









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
        <button onClick={connectKeplr} className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-green-600">
          Connect Keplr
        </button>
      )}
    </div>
  );
};

export default KeplrWallet;