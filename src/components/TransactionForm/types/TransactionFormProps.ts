export interface TransactionFormProps {
  mintAmount: string;
  ethRecipientAddress: string;
  setMintAmount: (value: string) => void;
  setEthRecipientAddress: (value: string) => void;
  onSubmit: () => void;
}
