import React from "react";
import Modal from "react-modal";
import { TransactionModalProps } from "./types/TransactionModalProps";

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transactionLink,
  error, // Добавляем поддержку отображения ошибки
}) => {
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Transaction Status"
      ariaHideApp={false}
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">
          {error ? "Transaction Failed" : "Transaction Completed"}
        </h2>
        <p className="mb-4">
          {error ? error : "Your transaction has been processed successfully."}
        </p>
        {transactionLink && (
          <div className="mb-4">
            <a
              href={transactionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Transaction
            </a>
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionModal;