import React from "react";
import { WalletDisplayProps } from "./types/WalletDisplayProps";

const WalletDisplay: React.FC<WalletDisplayProps> = ({
  nobleAddress,
  usdcBalance,
  error,
}) => {
  return (
    <div className="flex justify-between items-center mb-4 border p-4 rounded-md">
      <span className="font-mono text-sm break-all">
        {nobleAddress || "nobleXXXX"}
      </span>
      <span className="font-mono text-lg ml-2">
        {error ? error : `${usdcBalance} USDC`}
      </span>
    </div>
  );
};

export default WalletDisplay;
