import { Candidate } from '@/types'
import { FHEVoteBallonDorAddresses } from '@/abi/FHEVoteBallonDorAddresses'

export const CANDIDATES: Candidate[] = [
    {
        id: 1,
        name: "Lionel Messi",
        img: "/messi-wins-ballon-dor.png",
    },
    {
        id: 2,
        name: "Cristiano Ronaldo",
        img: "/cristiano-ronaldo.png",
    },
];

export const CHAIN_ID: Number = 11155111

export const CHAIN_ID_HEX: String = '0xaa36a7'

export const CONTRACT_ADDRESS: string = FHEVoteBallonDorAddresses[String(CHAIN_ID) as keyof typeof FHEVoteBallonDorAddresses].address;
