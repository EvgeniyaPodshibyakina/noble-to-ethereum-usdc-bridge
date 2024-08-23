import React from "react";
import { WalletDisplayProps } from "./types/WalletDisplayProps";

const WalletDisplay: React.FC<WalletDisplayProps> = ({
  nobleAddress,
  usdcBalance,
  error,
}) => {
  return (
    <div className="border p-4 rounded-md mb-6">
      <p className="font-mono text-sm break-all">
        Address: {nobleAddress || "Address not connected"}
      </p>
      <p className="font-mono text-sm">
        Balance: {error ? error : `${usdcBalance} USDC`}
      </p>
    </div>
  );
};

export default WalletDisplay;