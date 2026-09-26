import { Analytics } from "../types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Props {
  analytics: Analytics | null;
}

export const Charts = ({ analytics }: Props) => {
  if (!analytics) return null;

  const barData = [
    { name: "Nodes", count: analytics.totalResources - analytics.zombieCount, type: "Healthy" },
    { name: "Nodes", count: analytics.zombieCount, type: "Zombie" },
  ];

  const pieData = [
    { name: "Waste", value: analytics.zombieCount },
    { name: "Efficient", value: analytics.totalResources - analytics.zombieCount },
  ];

  const COLORS = ["#f43f5e", "#10b981"];

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="stat-card flex flex-col">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 italic">Distribution Pulse</h3>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <XAxis dataKey="type" fontSize={9} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                contentStyle={{ backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '2px', fontSize: '10px' }} 
              />
              <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.type === "Healthy" ? "#10b981" : "#f43f5e"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="stat-card flex flex-col relative">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 italic">Efficiency Ratio</h3>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius="60%"
                outerRadius="90%"
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '2px', fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
           <p className="text-xl font-black text-slate-100 tracking-tighter">{analytics.wastePercentage}%</p>
           <p className="text-[8px] font-bold text-slate-500 uppercase">Waste</p>
        </div>
      </div>
    </div>
  );
};
