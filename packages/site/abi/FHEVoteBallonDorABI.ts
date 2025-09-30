/*
  This file is auto-generated.
  By commands: 'npx hardhat deploy' or 'npx hardhat node'
*/
export const FHEVoteBallonDorABI = {
  abi: [
    {
      inputs: [],
      name: "getMessiVotes",
      outputs: [
        {
          internalType: "euint32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getMyVote",
      outputs: [
        {
          internalType: "euint32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getRonaldoVotes",
      outputs: [
        {
          internalType: "euint32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "getUserVote",
      outputs: [
        {
          internalType: "euint32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "protocolId",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "externalEuint32",
          name: "choiceEncrypted",
          type: "bytes32",
        },
        {
          internalType: "bytes",
          name: "proof",
          type: "bytes",
        },
      ],
      name: "vote",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
} as const;
