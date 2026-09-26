import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./pages/Dashboard";
import { BlockchainPage } from "./pages/BlockchainPage";
import { IacPage } from "./pages/IacPage";
import { CarbonGridPage } from "./pages/CarbonGridPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { CopilotPage } from "./pages/CopilotPage";
import { Login } from "./pages/Login";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("ecoscale_token");
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <div className="bg-slate-900 selection:bg-emerald-500/30 selection:text-emerald-100 font-sans text-slate-50 min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex flex-col h-screen overflow-hidden">
                  <Navbar />
                  <div className="flex-1 overflow-hidden relative">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/iac" element={<IacPage />} />
                      <Route path="/carbon-grid" element={<CarbonGridPage />} />
                      <Route path="/blockchain" element={<BlockchainPage />} />
                      <Route path="/marketplace" element={<MarketplacePage />} />
                      <Route path="/copilot" element={<CopilotPage />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
