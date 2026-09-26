# EcoScale AI - Intelligent Cloud Optimization

EcoScale AI is a full-stack, "closed-loop" cloud optimization system that identifies inefficient resource usage, explains it using AI, recommends optimizations, and logs every action securely on a blockchain ledger.

## 🚀 Architecture Overview

- **Frontend**: React.js (Vite) + Tailwind CSS + Recharts + Motion.
- **Backend**: Node.js (Express) + SQLite (better-sqlite3) + SHA-256 Blockchain.
- **ML Layer**: Heuristic-based Anomaly Detection (approximating Isolation Forest) with XAI (Explainable AI) descriptions.
- **Security**: JWT-based RBAC (Admin/Viewer) and AES-like cryptographic chaining for logs.

## 🏗 System Workflow

1. **Data Ingestion**: System pulses 100+ simulated cloud instances (EC2, RDS, Lambda).
2. **Analysis**: AI Engine scans for anomalies (Low CPU/NET/MEM) deviate from fleet averages.
3. **GreenOps**: Decisions are cross-referenced with Grid Carbon Intensity. High intensity postpones actions.
4. **Execution**: Admins terminate or resize nodes. "Auto-Heal" mode enables autonomous optimization.
5. **Transparency**: Every action is cryptographically hashed and linked in a tamper-proof blockchain.

## 🔧 Setup & Installation

### Backend
The backend runs on port 3000. It uses SQLite for persistence.
```bash
# The system auto-initializes the DB on start
npm run dev
```

### Frontend
Vite handles the frontend assets and proxies API calls to the Express server.

## 🔐 Blockchain Integrity
The system implements a private SHA-256 blockchain.
- **Genesis Block**: Validates the start of the audit chain.
- **Hashing**: Each block contains `index`, `timestamp`, `data`, `previous_hash`, and a unique `hash` derived from its payload and parent.
- **Tamper Resistance**: Modifying any past action would invalidate all subsequent hashes in the UI and Ledger.

## 🔄 Replacing Mock Data with AWS
To integrate real AWS data:
1. In `server.ts`, replace the `seedData()` generator with the AWS SDK (Boto3/SDK-v3).
2. Use `CloudWatch.getMetricStatistics` to fetch real-time CPU/Network stats.
3. The rest of the pipeline (Analysis, Blockchain, UI) remains identical.

## 🛡 Security & RBAC
- **Admin**: Can execute analysis, toggle auto-mode, and perform resource actions.
- **Viewer**: Read-only access to analytics and the audit ledger.
- **Default Credentials**: 
  - Admin: `admin`
  - Viewer: `viewer`
