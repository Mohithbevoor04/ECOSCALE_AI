import { useState, useEffect, useMemo } from "react";
import { Resource, Analytics, SystemConfig, User as UserType, Block } from "../types";
import { api } from "../services/api";
import { ResourceTable } from "../components/ResourceTable";
import { ResourceCard } from "../components/ResourceCard";
import { AnalyticsCards } from "../components/AnalyticsCards";
import { Charts } from "../components/Charts";
import { Play, RotateCcw, AlertCircle, Sparkles, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const FilterTab = ({ active, label, onClick, alert }: any) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-sm text-[9px] font-black tracking-widest transition-all ${
      active 
        ? (alert ? "bg-red-500 text-white" : "bg-emerald-500 text-white") 
        : "text-slate-500 hover:text-slate-300"
    }`}
  >
    {label}
  </button>
);

export const Dashboard = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "zombie" | "normal">("all");
  
  const userJson = localStorage.getItem("ecoscale_user");
  const user: UserType | null = userJson ? JSON.parse(userJson) : null;
  const isAdmin = user?.role === "Admin";

  const [blocks, setBlocks] = useState<Block[]>([]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resData, analyticsData, configData, blockchainData] = await Promise.all([
        api.getResources(),
        api.getAnalytics(),
        api.getConfig(),
        api.getBlockchain()
      ]);
      setResources(resData);
      setAnalytics(analyticsData);
      setConfig(configData);
      setBlocks(blockchainData);
    } catch (err: any) {
      setError("Unable to sync cloud infrastructure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || (filter === "zombie" && r.status === "Zombie") || (filter === "normal" && r.status === "Normal");
      return matchesSearch && matchesFilter;
    });
  }, [resources, search, filter]);

  const handleRunAnalysis = async () => {
    try {
      setAnalyzing(true);
      const { resources: updated } = await api.runAnalysis();
      setResources(updated);
      const analyticsData = await api.getAnalytics();
      setAnalytics(analyticsData);
      
      if (selectedResource) {
        const found = updated.find(r => r.id === selectedResource.id);
        if (found) setSelectedResource(found);
      }
    } catch (err) {
      setError("AI analysis failed or access denied");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAction = async (id: string, action: any) => {
    try {
      setAnalyzing(true);
      await api.performAction(id, action);
      await fetchData();
      setSelectedResource(null);
    } catch (err) {
      setError("Action simulation failed or access denied");
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleAutoMode = async () => {
    if (!config || !isAdmin) return;
    try {
      const newConfig = await api.setConfig({ autoMode: !config.autoMode });
      setConfig(newConfig);
    } catch (err) {
      setError("Config update failed");
    }
  };

  const cycleCarbon = async () => {
    if (!config || !isAdmin) return;
    const stages: ("Low" | "Medium" | "High")[] = ["Low", "Medium", "High"];
    const next = stages[(stages.indexOf(config.carbonIntensity) + 1) % stages.length];
    try {
      const newConfig = await api.setConfig({ carbonIntensity: next });
      setConfig(newConfig);
    } catch (err) {
      setError("Config update failed");
    }
  };

  return (
    <div className="geometric-grid h-full w-full overflow-hidden">
      {/* Sidebar Overview */}
      <aside className="pane border-r border-slate-700 flex flex-col space-y-6 overflow-y-auto w-[240px] lg:w-[280px]">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">Infrastructure Health</h2>
        <AnalyticsCards analytics={analytics} />
        
        <div className="pt-6 border-t border-slate-800">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest italic mb-4">Controls</h2>
          <div className="space-y-3">
             <button
                onClick={cycleCarbon}
                disabled={!isAdmin}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-[10px] font-bold transition-all duration-300 border ${
                  config?.carbonIntensity === "High" ? "bg-red-950/20 text-red-400 border-red-900/30" :
                  config?.carbonIntensity === "Low" ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30" :
                  "bg-amber-950/20 text-amber-400 border-amber-900/30"
                }`}
             >
               <span className="uppercase tracking-widest">Carbon Target</span>
               <span className="italic">{config?.carbonIntensity}</span>
             </button>

             <button
               onClick={toggleAutoMode}
               disabled={!isAdmin}
               className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-[10px] font-bold transition-all duration-300 border ${
                 config?.autoMode ? "bg-emerald-600 text-white border-emerald-500" : "bg-slate-800 text-slate-400 border-slate-700"
               }`}
             >
               <span className="uppercase tracking-widest">Self-Healing</span>
               <span className="italic">{config?.autoMode ? 'Enabled' : 'Disabled'}</span>
             </button>
          </div>
        </div>
      </aside>

      {/* Main Table Area */}
      <main className="pane flex flex-col overflow-hidden relative border-r border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight uppercase leading-none">Fleet Management</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Found {resources.length} nodes ({filteredResources.length} visible)</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchData}
              className="p-1.5 text-slate-400 hover:text-white transition-colors bg-slate-800 border border-slate-700 rounded-sm"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            {isAdmin && (
              <button
                onClick={handleRunAnalysis}
                disabled={loading || analyzing}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black px-3 py-2 rounded-sm tracking-widest uppercase transition-all"
              >
                {analyzing ? 'Scanning...' : 'Scan Fleet'}
              </button>
            )}
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center space-x-3 mb-4">
           <div className="flex-1 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
             <input 
               type="text" 
               placeholder="Search cluster identity..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-slate-950 border border-slate-800 rounded-sm py-1.5 pl-9 pr-3 text-[10px] text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors"
             />
           </div>
           <div className="flex border border-slate-800 rounded-sm p-0.5 bg-slate-950">
              <FilterTab active={filter === 'all'} label="ALL" onClick={() => setFilter('all')} />
              <FilterTab active={filter === 'zombie'} label="ZOMBIE" onClick={() => setFilter('zombie')} alert />
              <FilterTab active={filter === 'normal'} label="HEALTHY" onClick={() => setFilter('normal')} />
           </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Syncing Fleets...</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-slate-800">
                <ResourceTable
                  resources={filteredResources}
                  onSelect={setSelectedResource}
                  selectedId={selectedResource?.id}
                />
              </div>
              <div className="h-48 shrink-0 border-t border-slate-800 pt-4">
                 <Charts analytics={analytics} />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Right Detail Pane */}
      <aside className="pane bg-slate-900/50 overflow-y-auto w-[280px] lg:w-[320px]">
        <div className="flex items-center space-x-2 mb-6 text-slate-500">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
          <h2 className="text-xs font-bold uppercase tracking-widest italic">Optimization Node</h2>
        </div>
        
        <AnimatePresence mode="wait">
          {selectedResource ? (
            <ResourceCard
              resource={selectedResource}
              onClose={() => setSelectedResource(null)}
              onAction={handleAction}
              loading={analyzing}
              isAdmin={isAdmin}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center px-4 space-y-4"
            >
              <div className="w-10 h-10 border border-slate-800 rounded-sm flex items-center justify-center bg-slate-950">
                 <Sparkles className="w-5 h-5 text-slate-700" />
              </div>
              <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">Select a resource to inspect AI recommendations and carbon-aware metrics.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* Footer Ledger */}
      <footer className="col-span-full pane border-t border-slate-700 flex flex-col justify-center overflow-hidden py-1 px-4 h-[80px]">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">Immutable Audit Ledger</span>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[8px] text-emerald-500 font-mono font-bold uppercase tracking-widest">LIVE SYNC • HEIGHT: {blocks.length}</span>
          </div>
        </div>
        <div className="flex space-x-3 overflow-x-auto pb-1 scrollbar-hide">
          {blocks.slice().reverse().map((block) => (
            <div key={block.hash} className="blockchain-card min-w-[200px] py-2 px-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-bold text-emerald-500 uppercase">Block #{block.index}</span>
                <span className="text-[7px] text-slate-600 font-mono">{new Date(block.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="text-[9px] font-mono text-slate-300 truncate mb-0.5">TX: {block.data}</div>
              <div className="text-[7px] font-mono text-slate-600 truncate uppercase">SHA: {block.hash.substring(0, 12)}...</div>
            </div>
          ))}
        </div>
      </footer>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-12 z-[100] bg-red-950 border border-red-900/30 text-red-400 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2 shadow-xl"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 opacity-50 hover:opacity-100">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
