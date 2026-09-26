export type ResourceStatus = "Normal" | "Zombie";

export interface Resource {
  id: string;
  name: string;
  type: string;
  cpu: number;
  memory: number;
  network: number;
  status: ResourceStatus;
  aiExplanation?: string;
  recommendation?: "Terminate" | "Resize" | "Postpone";
  region?: string;
}

export type CarbonIntensity = "Low" | "Medium" | "High";

export interface SystemConfig {
  autoMode: boolean;
  carbonIntensity: CarbonIntensity;
}

export interface Block {
  index: number;
  timestamp: string;
  data: string;
  previousHash: string;
  hash: string;
}

export interface ActionResponse {
  message: string;
  blockchain: Block;
}

export interface User {
  id: string;
  username: string;
  role: "Admin" | "Viewer";
  token: string;
}

export interface Analytics {
  totalResources: number;
  zombieCount: number;
  wastePercentage: number;
  actionsTaken: number;
  carbonStatus: CarbonIntensity;
  ecoTokens: number;
  totalSavedKg: number;
  totalSavedUsd: number;
}

// Feature 1: IaC GitOps PR
export interface IacPr {
  id: string;
  title: string;
  branch: string;
  resourceId: string;
  resourceName: string;
  terraformDiff: string;
  costSavingsUsd: number;
  carbonSavingsKg: number;
  status: "OPEN" | "MERGED";
  createdAt: string;
}

// Feature 2: Carbon Region & Forecast
export interface CarbonRegion {
  code: string;
  name: string;
  carbonGco2: number;
  renewablePercent: number;
  status: "Optimal" | "Moderate" | "Critical";
  primarySource: string;
}

export interface CarbonForecastPoint {
  time: string;
  gCo2: number;
  renewablePercent: number;
}

// Feature 3: Zero-Knowledge Proofs
export interface ZkProof {
  id: string;
  blockIdx: number;
  publicInputHash: string;
  proofHash: string;
  zkProofData: string;
  verified: number;
  createdAt: string;
}

// Feature 5: Tokenomics & Marketplace
export interface EcoTokenBalance {
  balance: number;
  totalSavedKg: number;
  totalSavedUsd: number;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  tokenCost: number;
  rewardType: string;
  claimed: number;
}

// Feature 7: AI Copilot
export interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
}
