import { Analytics } from "../types";
import { Server, Zap, Recycle, Activity, Leaf } from "lucide-react";

interface Props {
  analytics: Analytics | null;
}

export const AnalyticsCards = ({ analytics }: Props) => {
  if (!analytics) return null;

  return (
    <div className="space-y-4">
      <StatCard
        label="Total Cluster Nodes"
        value={analytics.totalResources}
        icon={Server}
        trend="Active"
        color="text-white"
      />
      <StatCard
        label="Eco-Drain Anomalies"
        value={analytics.zombieCount}
        icon={Activity}
        trend={`${analytics.wastePercentage}% Waste`}
        color="text-red-500"
        alert
      />
      <StatCard
        label="Optimization Score"
        value="94%"
        icon={Recycle}
        trend="Peak efficiency"
        color="text-emerald-500"
      />
      <StatCard
        label="Grid Carbon Pulse"
        value={analytics.carbonStatus}
        icon={Leaf}
        trend="Live Grid State"
        color={analytics.carbonStatus === "High" ? "text-red-500" : "text-emerald-500"}
      />
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, trend, color, alert }: any) => (
  <div className={`stat-card ${alert ? 'border-red-900/50' : ''}`}>
    <div className="flex items-center justify-between mb-2">
      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</div>
      <Icon className={`w-3 h-3 ${color} opacity-50`} />
    </div>
    <div className={`text-2xl font-mono font-bold tracking-tight ${color}`}>
      {value}
    </div>
    <div className={`text-[10px] mt-1 font-bold italic ${alert ? 'text-red-400' : 'text-emerald-400'}`}>
      {trend}
    </div>
  </div>
);
