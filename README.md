# ATLAS QUANT

**The definitive, stateless, and serverless quantitative market signal engine.**

## VISION
We are building the future of market analysis infrastructure. Not a toy trading bot. Not an opaque black box. **Atlas Quant** is a transparent, highly-scalable, and deterministic system designed to process market reality into actionable signals without the bloat of traditional architecture. 

It is designed to run indefinitely on free-tier infrastructure, utilizing Vercel's edge network, Groq's low-latency AI, and Solana's decentralized identity. This is the blueprint for open-source market intelligence in the quantum era.

---

## THE PRIME DIRECTIVES
1. **DETERMINISTIC FIRST**: Mathematics over magic. Quant logic is 100% explainable. AI is an advisory layer for regime classification and risk, *never* the core decision-maker.
2. **STATELESS BY DESIGN**: Storage is an anchor. We do not persist historical candles. We do not use traditional databases (Postgres, Mongo, Firebase). Market data is fetched, computed, and vaporized every 15 minutes.
3. **SERVERLESS-FIRST**: Built on Next.js App Router and Vercel Serverless Functions. Infinite scalability from day zero. Survives cold starts gracefully.
4. **BLOCKCHAIN IS NOT A DATABASE**: Solana Devnet is utilized strictly for cryptographic user identity, wallet-based access control, and master-account approvals.
5. **FREE API SURVIVAL MODE**: Engineered to function flawlessly within rate limits of free APIs (CoinGecko, Groq). Intelligent batching and filtering are hardcoded.

---

## SYSTEM ARCHITECTURE
A pure, decoupled, and highly cohesive 3-Layer Data Strategy:
- **Layer 1: Global Scan**: A lightweight scheduled 15-minute pulse to identify the active market universe.
- **Layer 2: Active Universe**: Deep OHLC fetch and deterministic analysis for filtered assets.
- **Layer 3: On-Demand**: Compute execution triggered strictly by user session context.

**Tech Stack**:
- **Frontend / Backend**: Next.js (App Router), Vercel
- **Identity / Auth**: Solana Devnet cryptographic key derivation
- **AI Assist Layer**: Groq API
- **Market Data**: CoinGecko API

---

## FEATURES
- **Market Regime Recognition**: Identifies bull, bear, neutral, and late-trend environments purely via quantitative methods.
- **Simulated Pilot Trading**: Forward-tests quantitative signals perfectly. No real orders, no exchange integration, no risk.
- **Web3 Zero-Knowledge Auth**: Users derive ephemeral keys from passwords. No database credentials to leak.
- **Master Access Control**: Strict governance. Unapproved wallets see nothing.
- **Safety First**: Fails closed. Denies access on uncertainty.

---

## STATUS
**PRODUCTION READY.** All core algorithms, domain models, and constraints are engineered for 100% predictability and open-source survival. 

*“A system that cannot survive on free infrastructure lacks the elegance to scale on paid.”* — The Atlas Principle

---
*Built for the public good. Immutable constraints, unparalleled execution.*
