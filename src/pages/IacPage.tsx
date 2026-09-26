import { useState, useEffect } from "react";
import { api } from "../services/api";
import { IacPr, Resource } from "../types";
import { GitPullRequest, GitMerge, CheckCircle, Clock, Sparkles, DollarSign, Leaf, Terminal, AlertCircle } from "lucide-react";

export const IacPage = () => {
  const [prs, setPrs] = useState<IacPr[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResourceId, setSelectedResourceId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prData, resData] = await Promise.all([api.getIacPrs(), api.getResources()]);
      setPrs(prData);
      setResources(resData);
      const zombie = resData.find((r) => r.status === "Zombie");
      if (zombie) setSelectedResourceId(zombie.id);
      else if (resData.length > 0) setSelectedResourceId(resData[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePr = async () => {
    if (!selectedResourceId) return;
    setActionLoading("generate");
    try {
      const res = await api.generateIacPr(selectedResourceId);
      setMessage(res.message);
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to generate PR");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMergePr = async (prId: string) => {
    setActionLoading(prId);
    try {
      const res = await api.mergeIacPr(prId);
      setMessage(`🎉 ${res.message} Awarded +100 ECO Tokens!`);
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to merge PR");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="pane p-6 rounded-md border border-slate-700 bg-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <GitPullRequest className="w-4 h-4" />
            <span>Feature #1 • Agentic AI GitOps Engine</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">IaC Auto-Remediation PR Generator</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Generates declarative Terraform HCL code diffs for underutilized resources and submits Git pull requests instead of direct destructive API calls.
          </p>
        </div>

        {/* Generate PR Control */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={selectedResourceId}
            onChange={(e) => setSelectedResourceId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 px-3 py-2 rounded-sm focus:outline-none focus:border-emerald-500"
          >
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.type.toUpperCase()}) {r.status === "Zombie" ? "⚠️ ZOMBIE" : ""}
              </option>
            ))}
          </select>
          <button
            onClick={handleGeneratePr}
            disabled={actionLoading === "generate" || !selectedResourceId}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-sm uppercase tracking-wider flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{actionLoading === "generate" ? "Generating..." : "Generate IaC PR"}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs p-3 rounded-sm flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white font-bold">×</button>
        </div>
      )}

      {/* PR Cards Grid */}
      {loading ? (
        <div className="pane p-12 text-center text-slate-400 text-xs uppercase tracking-widest">
          Loading IaC Pull Requests...
        </div>
      ) : prs.length === 0 ? (
        <div className="pane p-12 text-center text-slate-400 text-xs">
          <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          No open GitOps PRs currently. Select a resource above and click <strong>Generate IaC PR</strong>.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {prs.map((pr) => (
            <div
              key={pr.id}
              className={`pane p-6 rounded-md border transition-all ${
                pr.status === "MERGED" ? "border-slate-800 opacity-75 bg-slate-900/50" : "border-slate-700 bg-slate-800/90"
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-700">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-sm flex items-center justify-center font-bold ${
                      pr.status === "MERGED"
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {pr.status === "MERGED" ? <GitMerge className="w-5 h-5" /> : <GitPullRequest className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-base font-bold text-white tracking-tight">{pr.title}</h2>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-sm ${
                          pr.status === "MERGED" ? "bg-purple-950 text-purple-400 border border-purple-800" : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        }`}
                      >
                        {pr.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1 font-mono">
                      <span>Branch: <span className="text-emerald-400">{pr.branch}</span></span>
                      <span>•</span>
                      <span>Target Node: <span className="text-slate-200">{pr.resourceName}</span></span>
                    </div>
                  </div>
                </div>

                {/* Savings Badges & Action */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 text-xs">
                    <div className="bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-sm flex items-center space-x-1.5 text-emerald-400">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span className="font-bold">+${pr.costSavingsUsd.toFixed(2)}/mo</span>
                    </div>
                    <div className="bg-teal-950/60 border border-teal-800/60 px-3 py-1.5 rounded-sm flex items-center space-x-1.5 text-teal-400">
                      <Leaf className="w-3.5 h-3.5" />
                      <span className="font-bold">-{pr.carbonSavingsKg.toFixed(1)} kg CO2</span>
                    </div>
                  </div>

                  {pr.status === "OPEN" && (
                    <button
                      onClick={() => handleMergePr(pr.id)}
                      disabled={actionLoading === pr.id}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-sm uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
                    >
                      <GitMerge className="w-4 h-4" />
                      <span>{actionLoading === pr.id ? "Merging..." : "Merge PR to Git"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Code Diff Viewer */}
              <div className="mt-4">
                <div className="flex items-center justify-between bg-slate-950 px-4 py-2 rounded-t-sm border border-slate-800 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                    <span>terraform/modules/{pr.resourceName}/main.tf</span>
                  </div>
                  <span className="text-slate-500">Git HCL Diff</span>
                </div>
                <pre className="bg-slate-950 p-4 rounded-b-sm border border-t-0 border-slate-800 text-xs font-mono overflow-x-auto text-slate-300 leading-relaxed">
                  {pr.terraformDiff.split("\n").map((line, idx) => {
                    const isAdd = line.startsWith("+");
                    const isDel = line.startsWith("-");
                    return (
                      <div
                        key={idx}
                        className={`${
                          isAdd
                            ? "bg-emerald-950/40 text-emerald-300 font-semibold"
                            : isDel
                            ? "bg-red-950/40 text-red-400 line-through"
                            : "text-slate-400"
                        }`}
                      >
                        {line}
                      </div>
                    );
                  })}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
