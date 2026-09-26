import {
  Resource,
  Block,
  ActionResponse,
  User,
  Analytics,
  SystemConfig,
  IacPr,
  CarbonRegion,
  CarbonForecastPoint,
  ZkProof,
  EcoTokenBalance,
  MarketplaceItem,
} from "../types";

const getAuthHeaders = () => {
  const token = localStorage.getItem("ecoscale_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  async login(username: string): Promise<User> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const user = await res.json();
    localStorage.setItem("ecoscale_token", user.token);
    localStorage.setItem("ecoscale_user", JSON.stringify(user));
    return user;
  },

  async getResources(): Promise<Resource[]> {
    const res = await fetch("/api/resources", { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch resources");
    return res.json();
  },

  async runAnalysis(): Promise<{ message: string; resources: Resource[] }> {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) throw new Error("Failed to run analysis");
    return res.json();
  },

  async performAction(resourceId: string, action: string): Promise<ActionResponse> {
    const res = await fetch("/api/action", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ resourceId, action }),
    });
    if (!res.ok) throw new Error("Failed to perform action");
    return res.json();
  },

  async getBlockchain(): Promise<Block[]> {
    const res = await fetch("/api/blockchain", { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch blockchain");
    return res.json();
  },

  async getAnalytics(): Promise<Analytics> {
    const res = await fetch("/api/analytics", { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return res.json();
  },

  async getConfig(): Promise<SystemConfig> {
    const res = await fetch("/api/config", { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch config");
    return res.json();
  },

  async setConfig(config: Partial<SystemConfig>): Promise<SystemConfig> {
    const res = await fetch("/api/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error("Failed to update config");
    return res.json();
  },

  // --- Feature 1: IaC GitOps PR ---
  async getIacPrs(): Promise<IacPr[]> {
    const res = await fetch("/api/iac/prs", { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch IaC PRs");
    return res.json();
  },

  async generateIacPr(resourceId: string): Promise<{ message: string; prId: string }> {
    const res = await fetch("/api/iac/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ resourceId }),
    });
    if (!res.ok) throw new Error("Failed to generate IaC PR");
    return res.json();
  },

  async mergeIacPr(prId: string): Promise<{ message: string; blockchain: Block }> {
    const res = await fetch("/api/iac/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ prId }),
    });
    if (!res.ok) throw new Error("Failed to merge IaC PR");
    return res.json();
  },

  // --- Feature 2: Carbon Region Shifting & Forecast ---
  async getCarbonRegions(): Promise<CarbonRegion[]> {
    const res = await fetch("/api/carbon/regions", { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch carbon regions");
    return res.json();
  },

  async getCarbonForecast(): Promise<CarbonForecastPoint[]> {
    const res = await fetch("/api/carbon/forecast", { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch carbon forecast");
    return res.json();
  },

  async shiftWorkload(resourceId: string, targetRegion: string): Promise<{ message: string; blockchain: Block }> {
    const res = await fetch("/api/carbon/shift", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ resourceId, targetRegion }),
    });
    if (!res.ok) throw new Error("Failed to shift workload");
    return res.json();
  },

  // --- Feature 3: Zero-Knowledge Proofs ---
  async getZkProofs(): Promise<ZkProof[]> {
    const res = await fetch("/api/zk/proofs", { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch ZK proofs");
    return res.json();
  },

  async verifyZkProof(proofId: string): Promise<{ verified: boolean; message: string }> {
    const res = await fetch("/api/zk/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ proofId }),
    });
    if (!res.ok) throw new Error("Failed to verify ZK proof");
    return res.json();
  },

  // --- Feature 5: Tokenomics & Marketplace ---
  async getTokenBalance(): Promise<EcoTokenBalance> {
    const res = await fetch("/api/tokens/balance", { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch token balance");
    return res.json();
  },

  async getMarketplace(): Promise<MarketplaceItem[]> {
    const res = await fetch("/api/tokens/marketplace", { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch marketplace");
    return res.json();
  },

  async redeemMarketplace(itemId: string): Promise<{ message: string; balance: number; blockchain: Block }> {
    const res = await fetch("/api/tokens/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ itemId }),
    });
    if (!res.ok) throw new Error("Failed to redeem reward");
    return res.json();
  },

  // --- Feature 7: AI Copilot ---
  async sendCopilotMessage(message: string): Promise<{ reply: string }> {
    const res = await fetch("/api/copilot/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error("Failed to send copilot message");
    return res.json();
  },
};
