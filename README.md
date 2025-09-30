# FHEVoteBallonDor

This repository is a comprehensive React + Next.js frontend for interacting with the `FHEVoteBallonDor.sol` smart contract deployed on Sepolia networks using FHEVM.

The contract allows users to securely vote for either Messi or Ronaldo in a fully homomorphic encrypted manner. Votes are encrypted on-chain, ensuring privacy and integrity, while still allowing authorized decryption for both individual users and the contract itself. This guarantees that vote counts remain confidential until decrypted by permitted parties.

## Features

* **Fully Homomorphic Encryption**: All votes are encrypted using FHE, keeping individual choices private.
* **User and Contract Decryption**: Both users and the contract can decrypt votes securely when needed.
* **Vote Updates**: Users can change their vote at any time, with the contract adjusting total counts automatically.
* **Real-Time Encrypted Vote Totals**: Frontend fetches encrypted totals and decrypts them for display.
* **React + Next.js**: Modern, responsive frontend architecture.
* **Tailwind CSS**: Utility-first CSS framework for rapid styling and responsive design.
* **Charts and Visualization**: Displays voting results in a clean, interactive PieChart.

## Smart Contract Overview

The `FHEVoteBallonDor.sol` contract is designed for secure, private voting using FHE:

* `vote(externalEuint32 choiceEncrypted, bytes calldata proof)`: Users cast or update votes. The input is encrypted and accompanied by a zero-knowledge proof.
* `_messiVotes` and `_ronaldoVotes`: Encrypted counters of total votes.
* `_userVotes`: Stores individual encrypted votes by user address.
* Decryption permissions are managed via `FHE.allow` and `FHE.allowThis` functions to allow both the user and contract to decrypt relevant values.
* `getMessiVotes()`, `getRonaldoVotes()`: Retrieve encrypted total votes.
* `getMyVote()`, `getUserVote(address)`: Retrieve the encrypted vote of the caller or a specific user.

This design ensures that voting is transparent and verifiable while preserving voter privacy.

## Requirements

* MetaMask browser extension installed
* Node.js >= 18
* NPM or Yarn
* Basic familiarity with Ethereum smart contracts

## Setup Local Hardhat Network

1. Add a local Hardhat network to MetaMask:

   * Name: Hardhat
   * RPC URL: [http://127.0.0.1:8545](http://127.0.0.1:8545)
   * Chain ID: 31337
   * Currency symbol: ETH

2. Start a local Hardhat node:

```sh
npm run hardhat-node
```

3. Launch the frontend in mock mode:

```sh
npm run dev:mock
```

4. Open [http://localhost:3000](http://localhost:3000) and connect MetaMask to the local network.

## Deploy on Sepolia

1. Deploy the contract on Sepolia Testnet:

```sh
npm run deploy:sepolia
```

2. Open [http://localhost:3000](http://localhost:3000)
3. Connect MetaMask to the Sepolia network.

## Handling Common MetaMask Issues

### Nonce Mismatch

* Clear MetaMask cache: Settings > Advanced > Clear Activity Tab.

### View Function Result Mismatch

* Restart browser to refresh cached contract data.

## Project Structure

### Key Folders

* `packages/site/fhevm`: Hooks and utilities to interact with FHEVM-enabled contracts.
* `packages/site/hooks/metamask`: MetaMask hooks for wallet connection.
* `packages/site/hooks/useVoteBallonDor.tsx`: Example hook demonstrating encrypted vote casting and decryption.

### Frontend

* Components under `packages/site/app` handle voting UI, fetching encrypted votes, user decryption, and visualizing results.
* PieChart visualization provides real-time insight into the encrypted vote totals.

## Running the App

1. Install dependencies:

```sh
npm install
```

2. Start frontend (mock mode):

```sh
npm run dev:mock
```

3. Start frontend on Sepolia network:

```sh
npm run dev
```

## Documentation

* [FHEVM Documentation](https://docs.zama.ai/protocol/solidity-guides/)
* [FHEVM Hardhat Guide](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat)
* [@zama-fhe/relayer-sdk Documentation](https://docs.zama.ai/protocol/relayer-sdk-guides/)
* [React Documentation](https://reactjs.org/)
* [FHEVM Discord Community](https://discord.com/invite/zama)

## License

This project is licensed under the BSD-3-Clause-Clear License.
