"use client";

import { use, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function MarketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const marketId = BigInt(id);
  const { address } = useAccount();
  const [shareAmount, setShareAmount] = useState("1");
  const [selectedSide, setSelectedSide] = useState<"YES" | "NO">("YES");

  const { data: market } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "getMarket",
    args: [marketId],
  });

  const { data: userPosition } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "getUserPosition",
    args: [marketId, address],
  });

  const { data: potentialPayoutYes } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "calculatePotentialPayout",
    args: [marketId, address, true],
  });

  const { data: potentialPayoutNo } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "calculatePotentialPayout",
    args: [marketId, address, false],
  });

  const { writeContractAsync: buyShares } = useScaffoldWriteContract("PredictionMarket");
  const { writeContractAsync: resolveMarket } = useScaffoldWriteContract("PredictionMarket");
  const { writeContractAsync: claimPayout } = useScaffoldWriteContract("PredictionMarket");

  if (!market) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  const endDate = new Date(Number(market.endDate) * 1000);
  const isEnded = endDate < new Date();
  const isOracle = address && market.oracle.toLowerCase() === address.toLowerCase();
  const totalShares = Number(market.totalYesShares) + Number(market.totalNoShares);
  const yesPercentage = totalShares > 0 ? (Number(market.totalYesShares) / totalShares) * 100 : 50;

  const handleBuyShares = async () => {
    try {
      const shares = parseInt(shareAmount);
      const cost = parseEther((shares * 0.01).toString());

      await buyShares({
        functionName: "buyShares",
        args: [marketId, selectedSide === "YES", BigInt(shares)],
        value: cost,
      });

      alert("Shares purchased successfully!");
    } catch (error) {
      console.error("Error buying shares:", error);
      alert("Failed to purchase shares");
    }
  };

  const handleResolve = async (outcome: boolean) => {
    try {
      await resolveMarket({
        functionName: "resolveMarket",
        args: [marketId, outcome],
      });
      alert("Market resolved successfully!");
    } catch (error) {
      console.error("Error resolving market:", error);
      alert("Failed to resolve market");
    }
  };

  const handleClaim = async () => {
    try {
      await claimPayout({
        functionName: "claimPayout",
        args: [marketId],
      });
      alert("Payout claimed successfully!");
    } catch (error) {
      console.error("Error claiming payout:", error);
      alert("Failed to claim payout");
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-4xl">
        <h1 className="text-center mb-8">
          <span className="block text-3xl font-bold">{market.question}</span>
        </h1>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-title">Prize Pot</div>
            <div className="stat-value text-2xl">{formatEther(market.prizePot)} ETH</div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-title">Total Pool</div>
            <div className="stat-value text-2xl">{(totalShares * 0.01).toFixed(2)} ETH</div>
            <div className="stat-desc">{totalShares} shares</div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-box">
            <div className="stat-title">Status</div>
            <div
              className={`stat-value text-2xl ${market.resolved ? "text-warning" : isEnded ? "text-error" : "text-success"}`}
            >
              {market.resolved ? "Resolved" : isEnded ? "Ended" : "Active"}
            </div>
            <div className="stat-desc">{endDate.toLocaleDateString()}</div>
          </div>
        </div>

        {/* Debug Info - Timestamp debugging */}
        {isOracle && (
          <div className="alert alert-info mb-8">
            <div className="flex flex-col gap-2 w-full">
              <h3 className="font-bold">🐛 Debug Info (Oracle Only)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-mono">
                <div>
                  <strong>Market End (Unix):</strong> {Number(market.endDate)}
                </div>
                <div>
                  <strong>Market End (Local):</strong> {endDate.toLocaleString()}
                </div>
                <div>
                  <strong>Current Time (Unix):</strong> {Math.floor(Date.now() / 1000)}
                </div>
                <div>
                  <strong>Current Time (Local):</strong> {new Date().toLocaleString()}
                </div>
                <div className="md:col-span-2">
                  <strong>Time Until Can Resolve:</strong>{" "}
                  {Number(market.endDate) - Math.floor(Date.now() / 1000) > 0
                    ? `${Number(market.endDate) - Math.floor(Date.now() / 1000)} seconds remaining ⏰`
                    : `Ready! (${Math.abs(Number(market.endDate) - Math.floor(Date.now() / 1000))} seconds past) ✅`}
                </div>
              </div>
              <div className="text-xs mt-2 opacity-70">
                💡 Contract checks: blockchain time ≥ market end time. If &quot;Time Until&quot; shows positive, wait
                longer. Blockchain time might lag slightly.
              </div>
            </div>
          </div>
        )}

        {/* Probabilities */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card bg-base-100 shadow-xl border-2 border-success">
            <div className="card-body items-center text-center">
              <h3 className="text-sm opacity-70">YES Probability</h3>
              <div className="text-5xl font-bold text-success">{yesPercentage.toFixed(1)}%</div>
              <div className="text-xs opacity-60">{Number(market.totalYesShares)} shares</div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl border-2 border-error">
            <div className="card-body items-center text-center">
              <h3 className="text-sm opacity-70">NO Probability</h3>
              <div className="text-5xl font-bold text-error">{(100 - yesPercentage).toFixed(1)}%</div>
              <div className="text-xs opacity-60">{Number(market.totalNoShares)} shares</div>
            </div>
          </div>
        </div>

        {/* YES/NO Distribution */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title">Market Distribution</h2>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-success">YES</span>
                  <span>
                    {Number(market.totalYesShares)} shares ({yesPercentage.toFixed(1)}%)
                  </span>
                </div>
                <progress className="progress progress-success w-full" value={yesPercentage} max="100"></progress>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-error">NO</span>
                  <span>
                    {Number(market.totalNoShares)} shares ({(100 - yesPercentage).toFixed(1)}%)
                  </span>
                </div>
                <progress className="progress progress-error w-full" value={100 - yesPercentage} max="100"></progress>
              </div>
            </div>
          </div>
        </div>

        {/* Your Position */}
        {userPosition && (userPosition[0] > 0 || userPosition[1] > 0) && (
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <h2 className="card-title">Your Position</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">YES Shares</div>
                  <div className="text-2xl font-bold text-success">{Number(userPosition[0])}</div>
                  {potentialPayoutYes && Number(potentialPayoutYes) > 0 && (
                    <div className="text-sm text-gray-500">Potential: {formatEther(potentialPayoutYes)} ETH</div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-gray-500">NO Shares</div>
                  <div className="text-2xl font-bold text-error">{Number(userPosition[1])}</div>
                  {potentialPayoutNo && Number(potentialPayoutNo) > 0 && (
                    <div className="text-sm text-gray-500">Potential: {formatEther(potentialPayoutNo)} ETH</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buy Shares */}
        {!market.resolved && !isEnded && (
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <h2 className="card-title">Buy Shares</h2>

              <div className="flex gap-4">
                <button
                  className={`btn flex-1 ${selectedSide === "YES" ? "btn-success" : "btn-outline"}`}
                  onClick={() => setSelectedSide("YES")}
                >
                  YES
                </button>
                <button
                  className={`btn flex-1 ${selectedSide === "NO" ? "btn-error" : "btn-outline"}`}
                  onClick={() => setSelectedSide("NO")}
                >
                  NO
                </button>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Number of shares (0.01 ETH each)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  className="input input-bordered"
                  value={shareAmount}
                  onChange={e => setShareAmount(e.target.value)}
                />
                <label className="label">
                  <span className="label-text-alt">Cost: {(parseInt(shareAmount || "0") * 0.01).toFixed(3)} ETH</span>
                </label>
              </div>

              <button className="btn btn-primary" onClick={handleBuyShares}>
                Buy {shareAmount} {selectedSide} Shares
              </button>
            </div>
          </div>
        )}

        {/* Oracle Controls */}
        {isOracle && isEnded && !market.resolved && (
          <div className="card bg-base-100 shadow-xl mb-8 border-2 border-warning">
            <div className="card-body">
              <h2 className="card-title text-warning">Oracle Controls</h2>
              <p>Resolve this market by declaring the outcome:</p>
              <div className="flex gap-4">
                <button className="btn btn-success flex-1" onClick={() => handleResolve(true)}>
                  Resolve as YES
                </button>
                <button className="btn btn-error flex-1" onClick={() => handleResolve(false)}>
                  Resolve as NO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Claim Winnings */}
        {market.resolved &&
          userPosition &&
          ((market.outcome && userPosition[0] > 0) || (!market.outcome && userPosition[1] > 0)) && (
            <div className="card bg-base-100 shadow-xl border-2 border-success">
              <div className="card-body">
                <h2 className="card-title text-success">🎉 You Won!</h2>
                <p>
                  The market was resolved as <strong>{market.outcome ? "YES" : "NO"}</strong>. You can claim your
                  winnings!
                </p>
                <button className="btn btn-success" onClick={handleClaim}>
                  Claim Payout
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
