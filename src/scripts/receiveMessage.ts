import { DirectSecp256k1HdWallet, Registry, GeneratedType } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { MsgReceiveMessage } from "../../generated/tx";
import { ethers } from "ethers";
import { arrayify, hexlify } from "@ethersproject/bytes";
import { Buffer } from 'buffer';
import { NOBLE_RPC_URL } from '../../noble-config';

// Типы CCTP для обработки сообщений
export const cctpTypes: ReadonlyArray<[string, GeneratedType]> = [
    ["/circle.cctp.v1.MsgReceiveMessage", MsgReceiveMessage],
];

function createDefaultRegistry(): Registry {
    return new Registry(cctpTypes);
}

// Функция для получения сообщения и аттестации из CCTP
export const getMessageFromCCTP = async (txHash: string) => {
    const response = await fetch(`https://api.circle.com/v1/cross-chain/attestations/${txHash}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}`, // Убедись, что переменная окружения правильно настроена
            'Content-Type': 'application/json'
        }
    });
//import.meta.env.VITE_CIRCLE_API_KEY

    if (!response.ok) {
        throw new Error("Failed to fetch message from CCTP");
    }

    const data = await response.json();
    return {
        messageHex: data.message,
        attestation: data.attestation
    };
};

// Функция для получения сообщения и аттестации из CCTP, а затем его обработки на Noble
export const receiveMessageFromCCTP = async (txHash: string) => {
    const mnemonic = import.meta.env.VITE_MNEMONIC || "";
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        mnemonic,
        { prefix: "noble" }
    );

    const [account] = await wallet.getAccounts();
    const client = await SigningStargateClient.connectWithSigner(
        NOBLE_RPC_URL,
        wallet,
        { registry: createDefaultRegistry() }
    );

    // Получаем сообщение и аттестацию из CCTP
    const { messageHex, attestation } = await getMessageFromCCTP(txHash);

    // Преобразуем данные в байты
    const messageBytes = new Uint8Array(Buffer.from(messageHex.replace("0x", ""), "hex"));
    const attestationBytes = new Uint8Array(Buffer.from(attestation.replace("0x", ""), "hex"));

    // Создаем сообщение для Stargate
    const msg = {
        typeUrl: "/circle.cctp.v1.MsgReceiveMessage",
        value: {
            from: account.address,
            message: messageBytes,
            attestation: attestationBytes,
        }
    };

    // Определяем комиссию и газ
    const fee = {
        amount: [{ denom: "uusdc", amount: "0" }],
        gas: "300000",
    };
    const memo = "";

    // Подписываем и отправляем транзакцию
    const result = await client.signAndBroadcast(account.address, [msg], fee, memo);

    console.log(`Message received and processed on Noble: https://mintscan.io/noble-testnet/tx/${result.transactionHash}`);

    return { messageHex, attestation };
};

// Функция для отправки сообщения на Sepolia
export const sendMessageToSepolia = async ({ messageHex, attestation, contractAddress }: { messageHex: string, attestation: string, contractAddress: string }) => {
    const provider = new ethers.BrowserProvider(window.ethereum as unknown as ethers.Eip1193Provider);
    const signer = await provider.getSigner();

    // Преобразуем данные в байты
    const messageBytes = arrayify(messageHex);
    const attestationBytes = arrayify(attestation);

    // Создаем и отправляем транзакцию
    const tx = await signer.sendTransaction({
        to: contractAddress,  // Используем фактический адрес контракта, который был введен пользователем
        data: hexlify([...messageBytes, ...attestationBytes]), // Комбинируем сообщение и аттестацию
    });

    if (tx.hash) {
        alert(`Transaction sent to Sepolia successfully. Transaction Hash: ${tx.hash}`);
    } else {
        alert("Failed to retrieve transaction receipt.");
    }
    return tx;
};