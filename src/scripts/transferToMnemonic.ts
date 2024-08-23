import { SigningStargateClient } from '@cosmjs/stargate';
import { NOBLE_COIN_MINIMAL_DENOM } from '../../noble-config';

export async function transferUSDCToMnemonicAddress(
  fromAddress: string,
  mnemonicAddress: string,
  amount: number,
  signer: SigningStargateClient
) {
  try {
    const amountInUusdc = (amount * 1e6).toString(); // Конвертация USDC в минимальные единицы
    const fee = {
      amount: [{ denom: NOBLE_COIN_MINIMAL_DENOM, amount: '5000' }],
      gas: '200000',
    };

    const result = await signer.sendTokens(
      fromAddress,
      mnemonicAddress,
      [{ denom: NOBLE_COIN_MINIMAL_DENOM, amount: amountInUusdc }],
      fee
    );

    return result.transactionHash;
  } catch (error) {
    console.error('Error during transfer to mnemonic address:', error);
    throw new Error('Failed to transfer USDC to mnemonic address.');
  }
}