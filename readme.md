# Solana Transaction Cleaner

Cleans system program instructions from a Solana transaction.

## Dependencies

1. [Node.js v20.10.0](https://nodejs.org/en)
2. [Helius](https://www.helius.dev/)

## Environment Variables

The following environment variables are required:

1. `HELIUS_API_KEY` - Your Helius API key
2. `TRANSACTION_PAYLOAD` - The transaction payload, formatted in base 64.
3. `WALLET_SECRET_KEY` - Your private key, formatted as an array of numbers.

```env
HELIUS_API_KEY=xxxx-xxxx-xxxx-xxxx-xxxx
TRANSACTION_PAYLOAD=BRidjANe5geDZLIO7F7ssNgO...
WALLET_SECRET_KEY=[143, 213, 82, ...]
```

## Run

To run the script, use the following command:

```
node index.js
```
