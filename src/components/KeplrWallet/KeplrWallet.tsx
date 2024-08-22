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

import React, { useState } from "react";
import {
  NOBLE_REST_URL,
  NOBLE_RPC_URL,
  NOBLE_CHAIN_ID,
  NOBLE_COIN_MINIMAL_DENOM,
  NOBLE_COIN_DENOM,
  NOBLE_COIN_DECIMALS,
} from "../../../noble-config"; // Импортируем конфигурации

interface KeplrWalletProps {
  setNobleAddress: (address: string) => void;
}

const KeplrWallet: React.FC<KeplrWalletProps> = ({ setNobleAddress }) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const connectKeplr = async () => {
    if (!window.keplr) {
      setErrorMessage("Keplr not installed");
      return;
    }

    try {
      // Подключение к цепочке Noble с использованием Keplr
      await window.keplr.experimentalSuggestChain({
        chainId: NOBLE_CHAIN_ID,
        chainName: "Noble",
        rpc: NOBLE_RPC_URL,
        rest: NOBLE_REST_URL,
        bip44: {
          coinType: 118,
        },
        bech32Config: {
          bech32PrefixAccAddr: "noble",
          bech32PrefixAccPub: "noblepub",
          bech32PrefixValAddr: "noblevaloper",
          bech32PrefixValPub: "noblevaloperpub",
          bech32PrefixConsAddr: "noblevalcons",
          bech32PrefixConsPub: "noblevalconspub",
        },
        currencies: [
          {
            coinDenom: NOBLE_COIN_DENOM,
            coinMinimalDenom: NOBLE_COIN_MINIMAL_DENOM,
            coinDecimals: NOBLE_COIN_DECIMALS,
            coinImageUrl:
              "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/grand/uusdc.png",
          },
        ],
        feeCurrencies: [
          {
            coinDenom: NOBLE_COIN_DENOM,
            coinMinimalDenom: NOBLE_COIN_MINIMAL_DENOM,
            coinDecimals: NOBLE_COIN_DECIMALS,
            gasPriceStep: {
              low: 0.1,
              average: 0.1,
              high: 0.2,
            },
          },
        ],
        stakeCurrency: {
          coinDenom: "STAKE",
          coinMinimalDenom: "ustake",
          coinDecimals: 6,
          coinImageUrl:
            "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/grand/ustake.png",
        },
      });

      await window.keplr.enable(NOBLE_CHAIN_ID);

      const offlineSigner = window.getOfflineSigner(NOBLE_CHAIN_ID);
      const accounts = await offlineSigner.getAccounts();

      if (accounts.length > 0) {
        setNobleAddress(accounts[0].address);
        setConnected(true);
        setErrorMessage("");
      } else {
        setErrorMessage("No accounts found");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Failed to connect: ${error.message}`);
      }
    }
  };

  const disconnectKeplr = () => {
    setNobleAddress("");
    setConnected(false);
  };

  return (
    <div className="mb-4">
      {connected ? (
        <button
          onClick={disconnectKeplr}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Disconnect Keplr
        </button>
      ) : (
        <button
          onClick={connectKeplr}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Connect Keplr
        </button>
      )}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default KeplrWallet;
