# CipherAlpha: Zero-Knowledge AI DeFi Intelligence

CipherAlpha is an advanced, fully homomorphic encrypted (FHE) multi-agent system built for the Fhenix Layer 2. It leverages LangGraph and Groq LLMs to analyze and optimize your decentralized finance (DeFi) portfolio in complete zero-knowledge.

## Features
- **FHE-Secured Vaults:** Utilizing `CoFHE.js`, user wallet data and balances remain encrypted in transit, at rest, and during computation.
- **Multi-Agent Arbitration:** A network of specialized LangGraph agents (Risk Analyst, DeFi Optimizer, Token Intelligence, etc.) independently analyze your portfolio and debate the optimal rebalancing strategy.
- **Cyber-DeFi Dashboard:** A premium, fully reactive UI with dynamic charts, terminal aesthetics, and real-time execution pipelines.

## Project Structure
- `/backend`: The Node.js + Express + LangChain AI agent supervisor.
- `/frontend`: The Vite + React + Framer Motion dashboard UI.

## Local Development
Make sure you have your `.env` configured with your `GROQ_API_KEY`.

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Built With
- **Frontend:** React, Vite, Framer Motion, Tailwind CSS, Ethers.js
- **Backend:** Node.js, Express, LangGraph, Groq SDK
- **Blockchain:** Fhenix L2, CoFHE.js
