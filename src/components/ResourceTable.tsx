import { Resource } from "../types";
import { Cpu, HardDrive, Network, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  resources: Resource[];
  onSelect: (resource: Resource) => void;
  selectedId?: string;
}

export const ResourceTable = ({ resources, onSelect, selectedId }: Props) => {
  return (
    <div className="w-full overflow-hidden rounded-sm border border-slate-800">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-800/40 text-slate-400 text-[10px] uppercase font-bold tracking-widest italic">
          <tr className="border-b border-slate-700">
            <th className="px-4 py-3">Resource ID</th>
            <th className="px-4 py-3">CPU</th>
            <th className="px-4 py-3">Memory</th>
            <th className="px-4 py-3">Network</th>
            <th className="px-4 py-3 text-right">Optimization Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          <AnimatePresence initial={false}>
            {resources.map((resource) => (
              <motion.tr
                key={resource.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => onSelect(resource)}
                className={`group transition-all cursor-pointer ${
                  selectedId === resource.id ? "bg-slate-800/60" : "bg-slate-900/30 hover:bg-slate-800/40"
                } ${
                  resource.status === "Zombie" 
                    ? "border-l-4 border-l-red-500 bg-red-500/5 hover:bg-red-500/10" 
                    : "border-l-4 border-l-emerald-500 hover:border-l-emerald-400"
                }`}
              >
                <td className="px-4 py-3 font-mono text-xs font-bold text-slate-300">
                  {resource.name}
                  <div className="text-[9px] text-slate-600 uppercase tracking-tighter mt-0.5">{resource.type}</div>
                </td>
                <td className="px-4 py-3">
                  <MetricBar value={resource.cpu} alert={resource.status === "Zombie"} />
                </td>
                <td className="px-4 py-3">
                  <MetricBar value={resource.memory} alert={resource.status === "Zombie"} />
                </td>
                <td className="px-4 py-3">
                  <MetricBar value={resource.network} alert={resource.status === "Zombie"} />
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`tag ${
                    resource.status === "Zombie" 
                      ? "bg-red-500/10 text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.1)]" 
                      : "bg-emerald-500/10 text-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.1)]"
                  }`}>
                    {resource.status === "Zombie" ? "Anomaly" : "Optimized"}
                  </span>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

const MetricBar = ({ value, alert }: { value: number; alert?: boolean }) => (
  <div className="flex items-center space-x-3 w-32">
    <div className="metric-bar flex-1 h-1">
      <div
        className={`metric-fill ${alert ? 'bg-red-500' : 'bg-emerald-500'}`}
        style={{ width: `${value}%` }}
      />
    </div>
    <span className="text-[10px] font-mono font-bold text-slate-600 group-hover:text-slate-400 transition-colors">{Math.round(value)}%</span>
  </div>
);
