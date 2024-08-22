import { Keplr } from "@keplr-wallet/types";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    keplr: Keplr;
    getOfflineSigner: (chainId: string) => OfflineSigner;
    ethereum?: MetaMaskInpageProvider;
  }
}
