import { createWalletClient, createPublicClient, http, parseUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { exactInputSingleSwap } from './src/v3_swap_functions';
import dotenv from 'dotenv';

dotenv.config();

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

const HYPER_CHAIN = {
  id: 999,
  name: 'Hyperliquid EVM',
  nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
  rpcUrls: { default: { http: [process.env.RPC_URL!] } },
};

const walletClient = createWalletClient({
  account,
  chain: HYPER_CHAIN,
  transport: http(process.env.RPC_URL!),
});

const publicClient = createPublicClient({
  chain: HYPER_CHAIN,
  transport: http(process.env.RPC_URL!),
});

const swapParams = {
  tokenIn: process.env.WHYPE_ADDRESS as `0x${string}`,
  tokenOut: process.env.USDC_ADDRESS as `0x${string}`,
  recipient: account.address,
  amountIn: parseUnits('0.001', 18), // 0.001 WHYPE
  amountOutMinimum: BigInt(0),
};

(async () => {
  try {
    console.log('Swapping tokens...');
    const txHash =  await exactInputSingleSwap(walletClient, publicClient, swapParams, account.address);
    console.log('Swap submitted! Tx hash:', txHash);
  } catch (err) {
    console.error('Error during swap:', err);
  }
})();
