import { SigningStargateClient } from '@cosmjs/stargate';

export interface KeplrWalletProps {
    setNobleAddress: React.Dispatch<React.SetStateAction<string | null>>;
    setMnemonicAddress: React.Dispatch<React.SetStateAction<string | null>>;
    setSigner: React.Dispatch<React.SetStateAction<SigningStargateClient | null>>;
  }