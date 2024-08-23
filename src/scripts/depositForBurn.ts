import { DirectSecp256k1HdWallet, Registry, GeneratedType } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { MsgDepositForBurn } from "../../generated/tx";
import { Buffer } from 'buffer';
import { NOBLE_RPC_URL } from '../../noble-config';

// Устанавливаем Buffer глобально
window.Buffer = window.Buffer || Buffer;

export const cctpTypes: ReadonlyArray<[string, GeneratedType]> = [
    ["/circle.cctp.v1.MsgDepositForBurn", MsgDepositForBurn],
];

function createDefaultRegistry(): Registry {
    return new Registry(cctpTypes);
}

export const burnUSDCOnNoble = async (nobleAddress: string, amount: number, ethRecipientAddress: string) => {
    const mnemonic = import.meta.env.VITE_MNEMONIC || "";

    try {
        // Генерация кошелька из мнемонической фразы
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            mnemonic,
            {
                prefix: "noble"
            }
        );

        const [account] = await wallet.getAccounts();

        if (!account) {
            throw new Error("Failed to retrieve account from wallet");
        }

        console.log("Noble Address:", nobleAddress);
        console.log("Mnemonic Address:", account.address);

        // Подключение к RPC и создание клиента Stargate
        const client = await SigningStargateClient.connectWithSigner(
            NOBLE_RPC_URL,
            wallet,
            { registry: createDefaultRegistry() }
        );

        // Форматирование адреса получателя на Ethereum
        const cleanedMintRecipient = ethRecipientAddress.replace(/^0x/, '');
        const zeroesNeeded = 64 - cleanedMintRecipient.length;
        const mintRecipient = '0'.repeat(zeroesNeeded) + cleanedMintRecipient;
        const buffer = Buffer.from(mintRecipient, "hex");
        const mintRecipientBytes = new Uint8Array(buffer);

        // Формирование сообщения для сжигания
        const msg = {
            typeUrl: "/circle.cctp.v1.MsgDepositForBurn",
            value: {
                from: account.address,
                amount: amount.toString(),
                destinationDomain: 0,  // Убедись, что значение соответствует целевой цепи (Sepolia)
                mintRecipient: mintRecipientBytes,
                burnToken: "uusdc",
            }
        };

        // Автоматическое определение лимита газа
        // const gasEstimate = await client.simulate(account.address, [msg], "");

        // Определение комиссии с учетом рассчитанного газа
        const fee = {
            amount: [
                {
                    denom: "uusdc",
                    amount: "200",  // Сумма комиссии за транзакцию
                },
            ],
            gas: "300000",  // Увеличиваем лимит газа до 300000
        };
        const memo = "";

        // Подписание и отправка транзакции
        const result = await client.signAndBroadcast(account.address, [msg], fee, memo);
      
        return result.transactionHash;

    } catch (error) {
        console.error("Error during burnUSDCOnNoble:", error);
        throw new Error("Failed to execute burnUSDCOnNoble");
    }
};