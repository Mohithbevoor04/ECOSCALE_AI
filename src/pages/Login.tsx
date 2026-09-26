import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { ShieldCheck, LogIn, User, Eye } from "lucide-react";
import { motion } from "motion/react";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (selectedUsername: string) => {
    try {
      setLoading(true);
      await api.login(selectedUsername);
      navigate("/");
    } catch (err) {
      setError("Login failed. Identity not verified.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950">
      <div className="hidden lg:flex bg-slate-900 items-center justify-center p-12 relative overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 bg-emerald-600/5 mix-blend-overlay"></div>
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="bg-emerald-600 w-12 h-12 rounded-sm flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20">
            <ShieldCheck className="text-slate-900 w-6 h-6" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight leading-[0.9] mb-6">
            INFRASTRUCTURE <br/> OPTIMIZATION <br/> <span className="text-emerald-500">AUTONOMY.</span>
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed italic border-l-2 border-emerald-500 pl-4">
            Securing the cloud compute layer with AI-driven GreenOps and immutable transparency.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-12">
          <div className="text-center">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest italic mb-2">Internal Node Access</h2>
            <div className="h-0.5 w-12 bg-emerald-500 mx-auto"></div>
          </div>

          <div className="space-y-4">
            <LoginButton
              icon={User}
              label="System Administrator"
              role="root"
              desc="Full Provisioning + Auto-Heal"
              onClick={() => handleLogin("admin")}
              loading={loading}
            />
            <LoginButton
              icon={Eye}
              label="Audit Observer"
              role="viewer"
              desc="Global read-only visibility"
              onClick={() => handleLogin("viewer")}
              loading={loading}
            />
          </div>

          {error && (
            <p className="text-center text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-950/20 py-2 border border-red-900/30 rounded-sm">{error}</p>
          )}

          <div className="pt-8 border-t border-slate-800 flex items-center justify-center space-x-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <span>System Secured • RSA-4096 Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginButton = ({ icon: Icon, label, role, desc, onClick, loading }: any) => (
  <button
    disabled={loading}
    onClick={onClick}
    className="w-full p-6 bg-slate-900/50 border border-slate-800 rounded-sm hover:border-emerald-500 hover:bg-slate-900 transition-all duration-300 text-left group"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-slate-800 text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors rounded-sm">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-500 border border-slate-800 px-2 py-0.5 rounded-sm">
        {role}
      </span>
    </div>
    <h3 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-emerald-500 transition-colors">{label}</h3>
    <p className="text-[10px] text-slate-500 italic mt-0.5 font-medium">{desc}</p>
  </button>
);
