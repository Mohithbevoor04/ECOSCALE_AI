import { useState, useEffect } from "react";
import { Block, ZkProof } from "../types";
import { api } from "../services/api";
import { BlockchainViewer } from "../components/BlockchainViewer";
import { ShieldCheck, RefreshCcw, Info, KeyRound, CheckCircle, Sparkles, Lock } from "lucide-react";

export const BlockchainPage = () => {
  const [activeTab, setActiveTab] = useState<"blockchain" | "zk">("blockchain");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [zkProofs, setZkProofs] = useState<ZkProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const [blockData, zkData] = await Promise.all([api.getBlockchain(), api.getZkProofs()]);
      setBlocks(blockData);
      setZkProofs(zkData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleVerifyZk = async (proofId: string) => {
    setVerifyingId(proofId);
    try {
      const res = await api.verifyZkProof(proofId);
      setMessage(`🔒 ${res.message}`);
      await fetchBlocks();
    } catch (err: any) {
      alert(err.message || "Failed to verify ZK proof");
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-3 uppercase">
            <span>Security & Audit Ledger</span>
            <ShieldCheck className="w-7 h-7 text-emerald-500" />
          </h1>
          <p className="text-slate-400 text-xs mt-1">Cryptographically secured operational history with Zero-Knowledge verification.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-md border border-slate-700">
          <button
            onClick={() => setActiveTab("blockchain")}
            className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "blockchain" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            SHA-256 Ledger
          </button>
          <button
            onClick={() => setActiveTab("zk")}
            className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors ${
              activeTab === "zk" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>zk-SNARKs Proofs</span>
          </button>
          <button
            onClick={fetchBlocks}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-sm border border-slate-700 ml-2"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-purple-500/10 border border-purple-500/40 text-purple-300 text-xs p-3 rounded-sm flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white font-bold">×</button>
        </div>
      )}

      {/* Info Callout */}
      {activeTab === "blockchain" ? (
        <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-sm p-4 flex items-start space-x-4">
          <div className="bg-emerald-600 p-2 text-slate-900 rounded-sm">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-emerald-400 tracking-widest uppercase mb-1">Blockchain Protocol Integrity</h3>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              Every action in EcoScale is appended into a private SHA-256 blockchain chain. Modifying historic payload invalidates all subsequent block hashes.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-purple-950/20 border border-purple-900/40 rounded-sm p-4 flex items-start space-x-4">
          <div className="bg-purple-600 p-2 text-white rounded-sm">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-purple-300 tracking-widest uppercase mb-1">Feature #3 • Zero-Knowledge Proof (zk-SNARK) Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              ZKP mathematically proves to external auditors that cost & carbon reductions occurred <strong>without revealing private node names, IP addresses, or network topology</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Content Rendering */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Verifying Merkle & ZK Proof Roots...</p>
        </div>
      ) : activeTab === "blockchain" ? (
        <BlockchainViewer blocks={blocks} />
      ) : (
        /* ZK Proofs View */
        <div className="space-y-4">
          {zkProofs.map((zk) => (
            <div key={zk.id} className="pane p-5 rounded-md border border-slate-700 bg-slate-800/90 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-sm bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-xs">
                    ZK
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
                      <span>Proof ID: {zk.id}</span>
                      <span className="text-xs text-slate-400 font-mono">(Block #{zk.blockIdx})</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">Public Input Hash: <span className="text-purple-300">{zk.publicInputHash}</span></p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="bg-emerald-950 text-emerald-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-sm border border-emerald-800 flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Cryptographically Validated</span>
                  </span>

                  <button
                    onClick={() => handleVerifyZk(zk.id)}
                    disabled={verifyingId === zk.id}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3 py-1.5 rounded-sm uppercase tracking-wider flex items-center space-x-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{verifyingId === zk.id ? "Verifying..." : "Re-Verify ZK Proof"}</span>
                  </button>
                </div>
              </div>

              {/* ZK Proof JSON Payload */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">zk-SNARK Salted Commitment Proof</span>
                <pre className="bg-slate-950 p-3 rounded-sm border border-slate-800 text-[11px] font-mono text-purple-300 overflow-x-auto">
                  {zk.zkProofData}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
