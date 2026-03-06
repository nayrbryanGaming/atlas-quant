# 🌐 Atlas-Quant | Deterministic Quantitative Signal Engine

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production-000000?style=flat-square&logo=vercel)](https://atlas-quant.vercel.app)
[![Solana Devnet](https://img.shields.io/badge/Solana-Devnet-14F195?style=flat-square&logo=solana)](https://explorer.solana.com/?cluster=devnet)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Atlas-Quant** is a professional-grade, stateless, and serverless quantitative market analysis platform. It is designed for high-scalability, low-latency signal generation using deterministic math combined with advisory AI classification.

> [!IMPORTANT]
> **This is NOT a trading bot.** Atlas-Quant provides educational signals, regime analysis, and pilot (simulated) trading capabilities. It does **not** execute real on-chain transactions or exchange orders.

---

## 🚀 Core Architecture

The system is built on a "Stateless-First" philosophy to ensure zero-cost maintenance and immune robustness against server failures.

*   **⚡ Serverless Runtime**: Hosted on Vercel using Next.js 15 (App Router). All logic executes in ephemeral serverless functions.
*   **📊 Deterministic Core**: Market signals are generated via pure TS functions (regime detection, momentum oscillators, volatility percentiles).
*   **🤖 AI Advisory Node**: Integrated with **Groq (Llama-3)** for high-speed regime commentary. AI acts only as a confidence filter—it never overrides core quant bias.
*   **🔗 Blockchain Identity**: User authentication is anchored to the Solana Devnet. Permissioning is managed via master-account whitelisting.
*   **♻️ Free-Tier Survival**: Engineered to run indefinitely on free APIs (CoinGecko, Groq, Solana RPC) using a 15-minute cron heartbeat.

---

## 🛠️ Quick Start

### 1. Installation
```bash
git clone https://github.com/nayrbryanGaming/atlas-quant.git
cd atlas-quant
npm install
```

### 2. Environment Configuration
Create a `.env.local` file with the following variables:
```env
COINGECKO_API_URL=https://api.coingecko.com/api/v3
GROQ_API_KEY=your_key_here
SOLANA_RPC_URL=https://api.devnet.solana.com
MASTER_PUBLIC_KEY=your_master_pubkey
CRON_SECRET=your_secret
FEATURE_AI_ENABLED=true
```

### 3. Local Development
```bash
npm run dev
```

### 4. Vercel Deployment
```bash
vercel --prod
```

---

## 🔒 Security & Access Control

1.  **Zero-Knowledge Auth**: Passwords are used client-side to derive a deterministic Ed25519 keypair. Secrets never touch the server.
2.  **Devnet Approval**: Login requires the user's public key to have received an active approval transaction from the Master Wallet with the memo `ATLAS_QUANT_APPROVED`.
3.  **Minimum Stakes**: Access control enforcement ensures all users maintain a specific SOL balance (default 5 SOL on Devnet) to mitigate spam.
4.  **Admin Bypass**: Specific administrative accounts (e.g., `nayrbryanGaming`) are pre-validated in `app/api/auth/verify/route.ts` for emergency access and platform management.

---

## 📂 Project Structure

*   `/app`: Next.js App Router & API Controllers.
*   `/src/core`: Pure quantitative logic & Pilot Trading Engine.
*   `/src/services`: External API drivers (Market, Auth, Solana).
*   `/src/domain`: Shared type definitions and contracts.
*   `/src/utils`: Cryptography and logging utilities.

---

## ⚖️ Disclaimer

Educational and simulated purposes only. Market data involves significant risk. **Atlas-Quant** and its contributors are not responsible for any financial losses. Always verify signals independently. This repository is provided "as-is" without warranty of any kind.

---
*Built for the future of decentralized quantitative finance by nayrbryanGaming.*
