import { Block } from "../types";
import { motion } from "motion/react";
import { Link2, Clock, Hash, FileText } from "lucide-react";

interface Props {
  blocks: Block[];
}

export const BlockchainViewer = ({ blocks }: Props) => {
  return (
    <div className="space-y-4">
      {blocks.slice().reverse().map((block, i) => (
        <motion.div
          key={block.hash}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden flex"
        >
          <div className="w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
          <div className="p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-slate-800 text-slate-400 rounded-sm">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Block Index {block.index}</h3>
                  <div className="flex items-center space-x-2 text-[9px] text-slate-500 font-bold uppercase mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>SYNCHRONIZED {new Date(block.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 px-2 py-1 rounded-sm bg-emerald-500/5 border border-emerald-500/10">
                <Link2 className="w-3 h-3 text-emerald-500" />
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">IMPENDING_VERIFIED</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/50 p-4 font-mono text-[11px] text-slate-300 leading-relaxed mb-4 border-l-2 border-l-emerald-500/50">
              <span className="text-slate-600 mr-2 text-[9px] uppercase font-sans font-bold">Payload:</span>
              {block.data}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <HashField label="Parent Identity" hash={block.previousHash} />
              <HashField label="Current Signature" hash={block.hash} active />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const HashField = ({ label, hash, active }: { label: string; hash: string; active?: boolean }) => (
  <div className="space-y-1">
    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest italic">{label}</p>
    <div className={`p-2 rounded-sm border font-mono text-[9px] flex items-center space-x-2 overflow-hidden transition-all ${
      active ? "bg-emerald-950/10 text-emerald-400 border-emerald-900/40" : "bg-slate-950 text-slate-600 border-slate-800/50"
    }`}>
      <span className="truncate uppercase">{hash}</span>
    </div>
  </div>
);
