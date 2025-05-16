# Hyperswap V3 SDK Template

This repository provides a ready-to-use SDK for interacting with Hyperswap V3 using VIEM, including swap functionalities.

## Features
- Swap ERC-20 tokens (e.g., USDC ↔ ETH).


## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/HyperSwapX/how-tos-v3.git
   cd hyperswap-sdk

2. Install dependencies:
   ```bash
   npm install

3. Set up the .env file:
   - Copy the .env.example file to .env:
   ```bash
   cp .env.example .env

- Edit the .env file with your details.

## Scripts

1. Swap tokenIn for tokenOut

To swap WETH for USDC, run:
   ```bash
     node index.js
```

Edit the index.js file to adjust the parameters like amountIn, amountOutMin.
Edit the .env file to adjust the tokenIn and tokenOut (must be ERC20).

Project Structure
	•	index.js: The main entry point to run swap functions.
	•	v3_swap_functions.js: Contains functions for swapping tokens on Hyperswap V3.
	•	abi/: Contains the ABI file for the V3 router contract.

Environment Variables

The project relies on a .env file for sensitive information. Here’s an example:
```
PRIVATE_KEY=0xYourPrivateKey
RPC_URL=https://api.hyperliquid-testnet.xyz/evm
ROUTER_V3_ADDRESS=0xD81F56576B1FF2f3Ef18e9Cc71Adaa42516fD990
WETH_ADDRESS=0xADcb2f358Eae6492F61A5F87eb8893d09391d160
USDC_ADDRESS=0x24ac48bf01fd6CB1C3836D08b3EdC70a9C4380cA
```
*Note that you can replace WETH and USDC by any ERC20 token available on Hyperswap V3

## Troubleshooting

•	If you encounter gas estimation errors (UNPREDICTABLE_GAS_LIMIT), ensure:
```
	  1.	Your wallet has sufficient funds.
	  2.	The contract addresses are correct.
```

•	Check the logs for specific error messages. The most common issues are related to incorrect amounts, insufficient balances, or invalid contract interaction.
