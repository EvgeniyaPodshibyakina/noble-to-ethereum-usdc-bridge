// import React from "react";
// import { TransactionFormProps } from "./types/TransactionFormProps";

// const TransactionForm: React.FC<TransactionFormProps> = ({
//   mintAmount,
//   ethRecipientAddress,
//   setMintAmount,
//   setEthRecipientAddress,
//   onSubmit,
// }) => {
//   return (
//     <div className="border p-4 rounded-md mb-6">
//       <h2 className="text-lg mb-4 text-center">1. Burn USDC on Noble</h2>
//       <input
//         type="text"
//         placeholder="Mint amount"
//         className="w-full p-2 border rounded mb-4"
//         value={mintAmount}
//         onChange={(e) => setMintAmount(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="ETH recipient address"
//         className="w-full p-2 border rounded mb-4"
//         value={ethRecipientAddress}
//         onChange={(e) => setEthRecipientAddress(e.target.value)}
//       />
//       <button
//         onClick={onSubmit}
//         className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//       >
//         Bridge
//       </button>
//     </div>
//   );
// };

// export default TransactionForm;



import React from "react";
import { TransactionFormProps } from "./types/TransactionFormProps";

const TransactionForm: React.FC<TransactionFormProps> = ({
  mintAmount,
  ethRecipientAddress,
  setMintAmount,
  setEthRecipientAddress,
  onSubmit,
}) => {
  return (
    <div className="border p-4 rounded-md mb-6">
      <h2 className="text-lg mb-4 text-center">1. Burn USDC on Noble</h2>
      <input
        type="number"
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
        onClick={onSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Bridge
      </button>
    </div>
  );
};

export default TransactionForm;