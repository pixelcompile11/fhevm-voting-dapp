"use client";

import React, { useEffect } from "react";
import VoteBallonDor from "@/components/FHEVoteBallonDor";
import { CHAIN_ID, CHAIN_ID_HEX, CONTRACT_ADDRESS } from "@/constants";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";

export default function Home() {
  const { isConnected, connect, accounts, provider, chainId } = useMetaMaskEthersSigner();

  useEffect(() => {
    if (provider && chainId !== CHAIN_ID) {
      const switchNetwork = async () => {
        await provider.request?.({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: CHAIN_ID_HEX }],
        });
      };

      switchNetwork();
    }
  }, [provider]);

  if (isConnected && chainId === CHAIN_ID) {
    return (
      <div className="w-full flex flex-col gap-8 items-center sm:items-start w-full px-3 md:px-0">
        <VoteBallonDor />
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-120px)] flex items-center justify-center">
      <div className="w-[540px] text-center">
        <button
          onClick={connect}
          className="h-14 w-full zama-bg rounded-lg flex items-center justify-center text-black font-semibold"
        >
          <span className="px-6">Connect with MetaMask</span>
        </button>
      </div>
    </main>
  );
}
