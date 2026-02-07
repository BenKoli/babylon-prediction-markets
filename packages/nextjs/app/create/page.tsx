"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function CreateMarket() {
  const [question, setQuestion] = useState("");
  const [endDate, setEndDate] = useState("");
  const [prizePot, setPrizePot] = useState("");
  const [sendTo, setSendTo] = useState("All");

  const { writeContractAsync: createMarket } = useScaffoldWriteContract("PredictionMarket");

  const handleCreate = async () => {
    try {
      // Convert date to Unix timestamp
      const timestamp = Math.floor(new Date(endDate).getTime() / 1000);

      await createMarket({
        functionName: "createMarket",
        args: [question, BigInt(timestamp)],
        value: parseEther(prizePot || "0"),
      });

      alert("Market created successfully!");
      setQuestion("");
      setEndDate("");
      setPrizePot("");
    } catch (error) {
      console.error("Error creating market:", error);
      alert("Failed to create market");
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-2xl">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">Create New Market</span>
        </h1>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Question</span>
              </label>
              <input
                type="text"
                placeholder="Will X happen by Y date?"
                className="input input-bordered w-full"
                value={question}
                onChange={e => setQuestion(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">End Date</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Prize Pot (ETH) - Optional</span>
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.1"
                className="input input-bordered w-full"
                value={prizePot}
                onChange={e => setPrizePot(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Send to</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={sendTo}
                onChange={e => setSendTo(e.target.value)}
              >
                <option value="Executives">Executives</option>
                <option value="Tech">Tech</option>
                <option value="HR">HR</option>
                <option value="Customers">Customers</option>
                <option value="All">All</option>
              </select>
              <label className="label">
                <span className="label-text-alt opacity-60">Demo only - no effect on market</span>
              </label>
            </div>

            <div className="card-actions justify-end mt-4">
              <button className="btn btn-primary" onClick={handleCreate} disabled={!question || !endDate}>
                Create Market
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
