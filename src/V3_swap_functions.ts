import {
  WalletClient,
  PublicClient,
  encodeFunctionData,
  getContract,
  parseAbi
} from 'viem';

const routerAbi = parseAbi([
  'function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256)'
]);

const erc20Abi = parseAbi([
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
]);

export async function exactInputSingleSwap(
  walletClient: WalletClient,
  publicClient: PublicClient,
  {
    tokenIn,
    tokenOut,
    recipient,
    amountIn,
    amountOutMinimum,
  }: {
    tokenIn: `0x${string}`;
    tokenOut: `0x${string}`;
    recipient: `0x${string}`;
    amountIn: bigint;
    amountOutMinimum: bigint;
  },
  account: `0x${string}`
) {
  const routerAddress = process.env.ROUTER_V3_ADDRESS as `0x${string}`;

  const tokenContract = getContract({
    address: tokenIn,
    abi: erc20Abi,
    client: publicClient,
  });

  const allowance: bigint = await tokenContract.read.allowance([account, routerAddress]);

  if (allowance < amountIn) {
    const approveData = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [routerAddress, BigInt(2) ** BigInt(256) - BigInt(1)],
    });

    const approveGas = await publicClient.estimateGas({
      account,
      to: tokenIn,
      data: approveData,
    });

    const approveTx = await walletClient.account!.signTransaction!({
      to: tokenIn,
      data: approveData,
      gas: approveGas,
      gasPrice: await publicClient.getGasPrice(),
      chainId: await publicClient.getChainId(),
    });

    const approveHash = await publicClient.sendRawTransaction({ serializedTransaction: approveTx });
    await publicClient.waitForTransactionReceipt({ hash: approveHash });
  }

  const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20);

  const swapData = encodeFunctionData({
    abi: routerAbi,
    functionName: 'exactInputSingle',
    args: [{
      tokenIn,
      tokenOut,
      fee: 3000,
      recipient,
      deadline,
      amountIn,
      amountOutMinimum,
      sqrtPriceLimitX96: 0n,
    }],
  });

  const gas = await publicClient.estimateGas({
    account,
    to: routerAddress,
    data: swapData,
  });

  const nonce = await publicClient.getTransactionCount({ address: account });

  const rawTx = await walletClient.account!.signTransaction!({
    to: routerAddress,
    data: swapData,
    gas,
    gasPrice: await publicClient.getGasPrice(),
    chainId: await publicClient.getChainId(),
    nonce,
  });

  const txHash = await publicClient.sendRawTransaction({ serializedTransaction: rawTx });
  await publicClient.waitForTransactionReceipt({ hash: txHash });

  return txHash;
}
