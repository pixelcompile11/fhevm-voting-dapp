"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BounceLoader } from "react-spinners";
import { Contract } from "ethers";
import { Vote } from "@/types";
import { CANDIDATES, CONTRACT_ADDRESS } from "@/constants";
import { FHEVoteBallonDorABI } from "@/abi/FHEVoteBallonDorABI";
import { Legend, PieChart, Pie, Cell, Tooltip } from "recharts";

import { useFhevm } from "@fhevm/react";
import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
import { FhevmDecryptionSignature, type FhevmInstance } from "@fhevm/react";

const COLORS = ["#f59e0b", "#3b82f6"];

export default function VoteBallonDor() {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const {
    provider,
    chainId,
    ethersSigner,
    initialMockChains,
  } = useMetaMaskEthersSigner();

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  const [contract, setContract] = useState<Contract | null>(null);
  const [vote, setVote] = useState<Vote | null>(null);
  const [votes, setVotes] = useState<Record<Vote, number>>({ 1: 0, 2: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ethersSigner) {
      try {
        const contractInstance = new Contract(
          CONTRACT_ADDRESS,
          FHEVoteBallonDorABI.abi,
          ethersSigner
        );
        setContract(contractInstance);
      } catch (err) {
        console.error("Error creating contract:", err);
      }
    }
  }, [ethersSigner]);

  const handleVote = async (id: Vote) => {
    if (contract && ethersSigner && fhevmInstance) {
      try {
        setLoading(true);

        const encryptedInput = await fhevmInstance
          .createEncryptedInput(CONTRACT_ADDRESS, ethersSigner.address)
          .add32(id)
          .encrypt();

        const tx = await contract.vote(
          encryptedInput.handles[0],
          encryptedInput.inputProof
        );
        await tx.wait();

        setVote(id);

        await fetchVotes();
      } catch (err) {
        console.error("Vote failed:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchVotes = async () => {
    if (contract && fhevmInstance && ethersSigner) {
      try {
        const sig = await FhevmDecryptionSignature.loadOrSign(
          fhevmInstance,
          [CONTRACT_ADDRESS as `0x${string}`],
          ethersSigner,
          fhevmDecryptionSignatureStorage
        );
        if (!sig) return;

        const encMessi = await contract.getMessiVotes();
        const encRonaldo = await contract.getRonaldoVotes();

        const handles = [
          { handle: encMessi, contractAddress: CONTRACT_ADDRESS },
          { handle: encRonaldo, contractAddress: CONTRACT_ADDRESS },
        ].filter((h) => h.handle !== "0x" + "0".repeat(64));

        let decryptedValues: bigint[] = [];

        if (handles.length > 0) {
          const decrypted = await fhevmInstance.userDecrypt(
            handles,
            sig.privateKey,
            sig.publicKey,
            sig.signature,
            sig.contractAddresses,
            sig.userAddress,
            sig.startTimestamp,
            sig.durationDays
          );

          decryptedValues = Object.values(decrypted) as bigint[];
        }

        setVotes({
          1: Number(decryptedValues[0] || 0),
          2: Number(decryptedValues[1] || 0),
        });
      } catch (err) {
        console.error("Failed to fetch votes:", err);
      }
    }
  };

  const fetchMyVote = async () => {
    if (contract && fhevmInstance && ethersSigner) {
      try {
        const sig = await FhevmDecryptionSignature.loadOrSign(
          fhevmInstance,
          [CONTRACT_ADDRESS as `0x${string}`],
          ethersSigner,
          fhevmDecryptionSignatureStorage
        );
        if (!sig) return;

        const encMyVote = await contract.getMyVote();

        if (encMyVote !== "0x" + "0".repeat(64)) {
          const decrypted = await fhevmInstance.userDecrypt(
            [{ handle: encMyVote, contractAddress: CONTRACT_ADDRESS }],
            sig.privateKey,
            sig.publicKey,
            sig.signature,
            sig.contractAddresses,
            sig.userAddress,
            sig.startTimestamp,
            sig.durationDays
          );

          const decryptedVote = Object.values(decrypted)[0] as bigint;
          setVote(Number(decryptedVote) as Vote);

          return Number(decryptedVote)
        }
      } catch (err) {
        console.error("Failed to fetch my vote:", err);
      }
    }
  };

  useEffect(() => {
    const mount = async () => {
      try {
        setLoading(true);
        const voted = await fetchMyVote();
        if (voted) {
          await fetchVotes();
        }
      } finally {
        setLoading(false);
      }
    }
    if (contract && fhevmInstance && ethersSigner) {
      mount()
    }
  }, [contract, fhevmInstance, ethersSigner]);

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const data =
    totalVotes === 0
      ? CANDIDATES.map((c) => ({ name: c.name, value: 50 }))
      : CANDIDATES.map((c) => ({
        name: c.name,
        value: (votes[c.id as Vote] / totalVotes) * 100,
      }));

  return (
    <div className="w-full flex flex-col items-center gap-8 p-6">
      {(loading || fhevmStatus !== 'ready') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <BounceLoader
            color="#fef9c3"
            loading={(loading || fhevmStatus !== 'ready')}
            size={45}
            aria-label="Loading Spinner"
          />
        </div>
      )}

      <h1 className="text-2xl font-bold">⚽ Who Will Win the Super Ballon d'Or?</h1>

      {/* Candidate list */}
      <div className="grid grid-cols-2 gap-6">
        {CANDIDATES.map((c) => (
          <div
            key={c.id}
            className="w-64 flex flex-col items-center p-4 shadow-lg rounded-2xl border"
          >
            <Image
              src={c.img}
              alt={c.name}
              width={128}
              height={128}
              className="w-32 h-32 object-cover rounded-full border"
            />
            <h2 className="font-semibold text-lg mt-4">{c.name}</h2>
            <button
              disabled={loading || vote !== null}
              onClick={() => handleVote(c.id as Vote)}
              className="mt-3 w-full zama-bg text-black font-semibold py-2 px-4 rounded-[4px] transition disabled:opacity-50"
            >
              {vote === c.id ? "✅ Voted" : "Vote"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        {vote ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">📊 Voting Results</h2>
            <PieChart width={320} height={260}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                isAnimationActive
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => `${val.toFixed(1)}%`} />
              <Legend />
            </PieChart>
            <p className="text-center mt-2 text-gray-600">
              Total votes: <span className="font-semibold">{totalVotes}</span>
            </p>
          </>
        ) : (
          <p className="text-center mt-4 text-gray-500">
            You need to vote first to see the results! 🗳️
          </p>
        )}
      </div>

    </div>
  );
}
