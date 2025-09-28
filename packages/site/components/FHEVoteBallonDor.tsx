

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Legend, PieChart, Pie, Cell, Tooltip } from "recharts";

type Candidate = {
  id: number;
  name: string;
  img: string;
};

const candidates: Candidate[] = [
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

const COLORS = ["#f59e0b", "#3b82f6"];

export default function VoteBallonDor() {
  const [votes, setVotes] = useState<Record<number, number>>({
    1: 0,
    2: 0,
  });

  const handleVote = (id: number) => {
    setVotes((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1,
    }));
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  // Default data: 50/50 if no votes yet
  const data =
    totalVotes === 0
      ? candidates.map((c) => ({ name: c.name, value: 50 }))
      : candidates.map((c) => ({
        name: c.name,
        value: (votes[c.id] / totalVotes) * 100,
      }));

  return (
    <div className="w-full flex flex-col items-center gap-8 p-6">
      <h1 className="text-2xl font-bold">⚽ Who Will Win the Super Ballon d'Or?</h1>

      {/* Candidate list */}
      <div className="grid grid-cols-2 gap-6">
        {candidates.map((c) => (
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
              onClick={() => handleVote(c.id)}
              className="mt-3 w-full zama-bg text-black font-semibold py-2 px-4 rounded-[4px] transition"
            >
              Vote
            </button>
          </div>
        ))}
      </div>

      {/* Result chart */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          📊 Voting Results
        </h2>
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
      </div>
    </div>
  );
}
