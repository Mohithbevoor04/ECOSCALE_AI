import { useState, useEffect } from "react";
import { api } from "../services/api";
import { CarbonRegion, CarbonForecastPoint, Resource } from "../types";
import { Globe, Leaf, Zap, ArrowRightLeft, TrendingDown, Sun, ShieldAlert } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const CarbonGridPage = () => {
  const [regions, setRegions] = useState<CarbonRegion[]>([]);
  const [forecast, setForecast] = useState<CarbonForecastPoint[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResourceId, setSelectedResourceId] = useState<string>("");
  const [selectedTargetRegion, setSelectedTargetRegion] = useState<string>("eu-west-3");
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [regData, fcData, resData] = await Promise.all([
        api.getCarbonRegions(),
        api.getCarbonForecast(),
        api.getResources(),
      ]);
      setRegions(regData);
      setForecast(fcData);
      setResources(resData);
      const highCarbonRes = resData.find((r) => r.region === "ap-south-1" || r.region === "us-east-1");
      if (highCarbonRes) setSelectedResourceId(highCarbonRes.id);
      else if (resData.length > 0) setSelectedResourceId(resData[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShiftWorkload = async () => {
    if (!selectedResourceId || !selectedTargetRegion) return;
    setActionLoading(true);
    try {
      const res = await api.shiftWorkload(selectedResourceId, selectedTargetRegion);
      setMessage(`🌿 ${res.message} Awarded +75 ECO Tokens!`);
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to shift workload");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="pane p-6 rounded-md border border-slate-700 bg-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Feature #2 • Dynamic Spatial/Temporal GreenOps</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Real-Time Carbon Grid & Workload Shifting</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Monitors real-time electricity grid carbon emissions across global AWS data centers and shifts compute workloads to low-carbon hydro/solar regions.
          </p>
        </div>

        {/* Workload Shifting Control Panel */}
        <div className="bg-slate-900/90 p-3 rounded-md border border-slate-700 flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Target Workload</label>
            <select
              value={selectedResourceId}
              onChange={(e) => setSelectedResourceId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 px-3 py-1.5 rounded-sm focus:outline-none focus:border-teal-500"
            >
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.region || "us-east-1"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Shift To Green Region</label>
            <select
              value={selectedTargetRegion}
              onChange={(e) => setSelectedTargetRegion(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 px-3 py-1.5 rounded-sm focus:outline-none focus:border-teal-500"
            >
              {regions.map((reg) => (
                <option key={reg.code} value={reg.code}>
                  {reg.name} ({reg.carbonGco2} gCO2/kWh)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleShiftWorkload}
            disabled={actionLoading || !selectedResourceId}
            className="mt-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-sm uppercase tracking-wider flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>{actionLoading ? "Shifting..." : "Shift Workload"}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-teal-500/10 border border-teal-500/40 text-teal-300 text-xs p-3 rounded-sm flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white font-bold">×</button>
        </div>
      )}

      {/* Global Carbon Regions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {regions.map((reg) => {
          const isOptimal = reg.status === "Optimal";
          return (
            <div
              key={reg.code}
              className={`pane p-4 rounded-md border transition-all ${
                isOptimal ? "border-teal-500/40 bg-teal-950/20" : "border-red-500/30 bg-red-950/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase">{reg.code}</span>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-sm ${
                    isOptimal ? "bg-teal-950 text-teal-300 border border-teal-800" : "bg-red-950 text-red-300 border border-red-800"
                  }`}
                >
                  {reg.status}
                </span>
              </div>
              <h2 className="text-sm font-bold text-white mb-1">{reg.name}</h2>
              <div className="flex items-baseline space-x-1">
                <span className={`text-2xl font-black ${isOptimal ? "text-teal-400" : "text-red-400"}`}>
                  {reg.carbonGco2}
                </span>
                <span className="text-[10px] text-slate-400">gCO2/kWh</span>
              </div>
              <div className="mt-3 text-[11px] text-slate-300 space-y-1 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Renewables:</span>
                  <span className="font-bold text-slate-200">{reg.renewablePercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Source:</span>
                  <span className="text-slate-300 truncate max-w-[110px]">{reg.primarySource}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 24-Hour Predictive Carbon Forecast Recharts Graph */}
      <div className="pane p-6 rounded-md border border-slate-700 bg-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>24-Hour Dynamic Grid Carbon Intensity Forecast</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Predictive solar & wind grid curve. Green shaded valleys indicate optimal zero-emission compute windows.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className="flex items-center space-x-1 text-teal-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block"></span>
              <span>Optimal Window (gCO2 &lt; 150)</span>
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit=" g" />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "4px", fontSize: "12px" }}
                itemStyle={{ color: "#2dd4bf" }}
              />
              <Area type="monotone" dataKey="gCo2" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#carbonGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
