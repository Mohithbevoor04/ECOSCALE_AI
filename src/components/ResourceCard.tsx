import { X, Brain, ShieldCheck, Clock, Settings2, Trash2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Resource } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  resource: Resource | null;
  onClose: () => void;
  onAction: (id: string, action: "terminate" | "resize" | "ignore") => void;
  loading?: boolean;
  isAdmin?: boolean;
}

// Dummy data for mini-chart
const data = [
  { time: '00:00', val: 30 },
  { time: '04:00', val: 45 },
  { time: '08:00', val: 60 },
  { time: '12:00', val: 40 },
  { time: '16:00', val: 55 },
  { time: '20:00', val: 35 },
  { time: '23:59', val: 42 },
];

export const ResourceCard = ({ resource, onClose, onAction, loading, isAdmin }: Props) => {
  if (!resource) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{resource.name}</h3>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className={`p-4 rounded-sm border ${
        resource.status === 'Zombie' ? 'bg-red-950/20 border-red-900/30' : 'bg-emerald-950/20 border-emerald-900/30'
      }`}>
        <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${
          resource.status === 'Zombie' ? 'text-red-400' : 'text-emerald-400'
        }`}>
          AI EXPLANATION
        </div>
        <p className="text-xs leading-relaxed text-slate-300 italic">
          {resource.aiExplanation || "System is idle. Run full optimization scan to generate deep-link AI insights for this node."}
        </p>
      </div>

      <div className="space-y-3">
        <DetailRow label="Resource Type" value={resource.type} />
        <DetailRow label="Region / Zone" value="US-EAST-1A" />
        <DetailRow label="Uptime Pulse" value="412d 4h 12m" />
        <DetailRow label="Eco-Rec. Status" value={resource.recommendation || "Pending Scan"} />
      </div>

      <div className="pt-6 border-t border-slate-800 flex flex-col space-y-2">
        {isAdmin ? (
          <>
            <button
              onClick={() => onAction(resource.id, "terminate")}
              disabled={loading}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded-sm uppercase tracking-widest transition-colors shadow-lg shadow-red-900/20 disabled:opacity-50"
            >
              Terminate Resource
            </button>
            <button
              onClick={() => onAction(resource.id, "resize")}
              disabled={loading}
              className="w-full py-2.5 border border-slate-700 hover:bg-slate-800 text-slate-300 text-[10px] font-bold rounded-sm uppercase tracking-widest transition-colors disabled:opacity-50"
            >
              Resize Instance
            </button>
            <button
              onClick={() => onAction(resource.id, "ignore")}
              disabled={loading}
              className="w-full py-2.5 text-slate-500 hover:text-slate-300 text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
            >
              Ignore Analysis
            </button>
          </>
        ) : (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm text-center">
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 italic">Observer mode: Restricted actions</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-[10px] font-bold">
    <span className="text-slate-500 uppercase tracking-widest">{label}</span>
    <span className="text-slate-300 font-mono italic">{value}</span>
  </div>
);

const DetailMetric = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-tighter mb-1">{label}</p>
    <p className="text-sm font-bold text-gray-900 font-mono tracking-tight">{value}</p>
  </div>
);

const ActionButton = ({ icon: Icon, label, desc, onClick, variant, disabled }: any) => {
  const styles = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200",
    secondary: "bg-gray-900 hover:bg-black text-white shadow-gray-200",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-red-200",
  }[variant as "primary" | "secondary" | "danger"];

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${styles}`}
    >
      <div className="bg-white/20 p-2 rounded-lg">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-bold tracking-tight">{label}</p>
        <p className="text-xs opacity-70 italic">{desc}</p>
      </div>
    </button>
  );
};
