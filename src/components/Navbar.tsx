import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, User, GitPullRequest, Globe, ShieldCheck, Coins, Bot, LayoutDashboard } from "lucide-react";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userJson = localStorage.getItem("ecoscale_user");
  const user = userJson ? JSON.parse(userJson) : null;

  const links = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/iac", label: "IaC PRs", icon: GitPullRequest },
    { to: "/carbon-grid", label: "Carbon Grid", icon: Globe },
    { to: "/blockchain", label: "Audit & ZK", icon: ShieldCheck },
    { to: "/marketplace", label: "Eco Market", icon: Coins },
    { to: "/copilot", label: "AI Copilot", icon: Bot },
  ];

  const handleLogout = () => {
    localStorage.removeItem("ecoscale_token");
    localStorage.removeItem("ecoscale_user");
    navigate("/login");
  };

  return (
    <nav className="pane flex items-center justify-between border-b border-slate-700 px-6 h-16 bg-slate-900/90 shrink-0">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-sm flex items-center justify-center font-black text-slate-900 shadow-lg shadow-emerald-500/20 text-sm">
          ES
        </div>
        <Link to="/" className="text-lg font-black tracking-tight text-white uppercase flex items-center space-x-1.5">
          <span>ECOSCALE</span>
          <span className="text-emerald-500">AI</span>
        </Link>
      </div>

      <div className="flex items-center space-x-6 text-xs font-bold uppercase tracking-wider">
        {links.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center space-x-1.5 transition-colors duration-200 py-1 border-b-2 ${
                isActive
                  ? "text-emerald-400 border-emerald-500"
                  : "text-slate-400 border-transparent hover:text-white hover:border-slate-600"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-white leading-none uppercase tracking-tighter mb-0.5">{user?.username}</p>
            <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest leading-none">{user?.role}</p>
          </div>
          <div className="w-8 h-8 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center group cursor-pointer hover:border-emerald-500 transition-colors">
            <User className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-slate-800 hover:bg-red-950 hover:text-red-400 border border-slate-700 p-2 rounded-sm text-slate-400 transition-all"
          title="Log out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
