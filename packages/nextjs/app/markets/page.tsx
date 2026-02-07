"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatEther } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function Markets() {
  const [marketIds, setMarketIds] = useState<number[]>([]);

  const { data: marketCount } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "marketCount",
  });

  useEffect(() => {
    if (marketCount) {
      const ids = Array.from({ length: Number(marketCount) }, (_, i) => i);
      setMarketIds(ids);
    }
  }, [marketCount]);

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-4xl">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">My Markets</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketIds.map(id => (
            <MarketCard key={id} marketId={id} />
          ))}
        </div>

        {marketIds.length === 0 && <div className="text-center text-gray-500 mt-8">No markets yet. Create one!</div>}
      </div>
    </div>
  );
}

function MarketCard({ marketId }: { marketId: number }) {
  const { data: market } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "getMarket",
    args: [BigInt(marketId)],
  });

  if (!market) return null;

  const endDate = new Date(Number(market.endDate) * 1000);
  const isEnded = endDate < new Date();
  const totalShares = Number(market.totalYesShares) + Number(market.totalNoShares);
  const yesPercentage = totalShares > 0 ? (Number(market.totalYesShares) / totalShares) * 100 : 50;

  return (
    <Link href={`/market/${marketId}`}>
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
        <div className="card-body">
          <h2 className="card-title text-lg">{market.question}</h2>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="text-center p-3 bg-base-200 rounded-lg border border-success">
              <div className="text-xs opacity-70">YES</div>
              <div className="text-2xl font-bold text-success">{yesPercentage.toFixed(1)}%</div>
            </div>
            <div className="text-center p-3 bg-base-200 rounded-lg border border-error">
              <div className="text-xs opacity-70">NO</div>
              <div className="text-2xl font-bold text-error">{(100 - yesPercentage).toFixed(1)}%</div>
            </div>
          </div>

          <div className="divider my-1"></div>

          <div className="flex justify-between items-center text-sm">
            <div className="text-xs">Prize: {formatEther(market.prizePot)} ETH</div>

            <div className={`badge ${isEnded ? "badge-warning" : "badge-success"}`}>
              {market.resolved ? "Resolved" : isEnded ? "Ended" : "Active"}
            </div>
          </div>

          <div className="text-xs opacity-60 mt-1">Ends: {endDate.toLocaleDateString()}</div>
        </div>
      </div>
    </Link>
  );
}
