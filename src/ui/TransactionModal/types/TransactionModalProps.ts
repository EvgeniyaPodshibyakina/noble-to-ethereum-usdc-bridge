export interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionLink: string;
  error?: string | null; 
}