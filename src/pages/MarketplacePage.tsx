import { useState, useEffect } from "react";
import { api } from "../services/api";
import { EcoTokenBalance, MarketplaceItem } from "../types";
import { Coins, DollarSign, Leaf, TreePine, ShoppingBag, CheckCircle, Award, Sparkles } from "lucide-react";

export const MarketplacePage = () => {
  const [balance, setBalance] = useState<EcoTokenBalance>({ balance: 1450, totalSavedKg: 128.4, totalSavedUsd: 480.0 });
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [balData, itemData] = await Promise.all([api.getTokenBalance(), api.getMarketplace()]);
      setBalance(balData);
      setItems(itemData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (itemId: string) => {
    setActionLoading(itemId);
    try {
      const res = await api.redeemMarketplace(itemId);
      setMessage(`🎉 ${res.message}`);
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to redeem item");
    } finally {
      setActionLoading(null);
    }
  };

  const treesPlanted = Math.round(balance.totalSavedKg / 20.0);

  return (
    <div className="h-full overflow-y-auto p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="pane p-6 rounded-md border border-slate-700 bg-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Coins className="w-4 h-4" />
            <span>Feature #5 • Gamified FinOps & Eco-Tokenomics</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">FinOps ROI & Eco-Credit Marketplace</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Earn ECO Tokens automatically whenever you remediate zombie nodes or shift compute to green regions. Redeem tokens for AWS cloud credits and certified reforestation rewards.
          </p>
        </div>

        {/* ECO Token Badge */}
        <div className="bg-amber-500/10 border border-amber-500/30 px-5 py-3 rounded-md flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-amber-300 uppercase tracking-widest leading-none">Wallet Balance</p>
            <p className="text-2xl font-black text-amber-400 leading-tight">{balance.balance} ECO</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs p-3 rounded-sm flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white font-bold">×</button>
        </div>
      )}

      {/* Impact Counters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="pane p-6 rounded-md border border-slate-700 bg-slate-800/90 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Direct USD Saved</span>
            <p className="text-2xl font-black text-emerald-400">${balance.totalSavedUsd.toFixed(2)}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Verified FinOps cloud right-sizing</p>
          </div>
        </div>

        <div className="pane p-6 rounded-md border border-slate-700 bg-slate-800/90 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-md bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">CO2 Prevented</span>
            <p className="text-2xl font-black text-teal-400">{balance.totalSavedKg.toFixed(1)} kg</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Avoided cloud grid emissions</p>
          </div>
        </div>

        <div className="pane p-6 rounded-md border border-slate-700 bg-slate-800/90 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-md bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400">
            <TreePine className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tree Equivalent</span>
            <p className="text-2xl font-black text-green-400">~{treesPlanted} Trees</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Annual offset sequestration</p>
          </div>
        </div>
      </div>

      {/* Marketplace Rewards */}
      <div>
        <h2 className="text-base font-bold text-white tracking-tight mb-4 flex items-center space-x-2">
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>Claimable Eco-Rewards Marketplace</span>
        </h2>

        {loading ? (
          <div className="pane p-12 text-center text-slate-400 text-xs">Loading Eco-Marketplace...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const isClaimed = item.claimed === 1;
              const canAfford = balance.balance >= item.tokenCost;
              return (
                <div
                  key={item.id}
                  className={`pane p-5 rounded-md border flex flex-col justify-between transition-all ${
                    isClaimed
                      ? "border-slate-800 opacity-60 bg-slate-900/40"
                      : "border-slate-700 bg-slate-800/90 hover:border-amber-500/40"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-sm bg-amber-950 text-amber-300 border border-amber-800">
                        {item.rewardType}
                      </span>
                      <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{item.tokenCost} ECO</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1 tracking-tight">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.description}</p>
                  </div>

                  <button
                    onClick={() => handleRedeem(item.id)}
                    disabled={isClaimed || !canAfford || actionLoading === item.id}
                    className={`w-full font-bold text-xs py-2 rounded-sm uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors ${
                      isClaimed
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : canAfford
                        ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                    }`}
                  >
                    {isClaimed ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Claimed</span>
                      </>
                    ) : actionLoading === item.id ? (
                      <span>Redeeming...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Redeem with ECO</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
