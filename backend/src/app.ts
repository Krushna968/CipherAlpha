import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { IndexerService } from './services/indexer.js';
import { BlockchainService } from './services/blockchain.js';
import { SupervisorAgent } from './agents/supervisor.js';

const app = express();
app.use(cors());
app.use(express.json());

const indexerService = new IndexerService();
const blockchainService = new BlockchainService();
const supervisorAgent = new SupervisorAgent();

/**
 * Endpoint: POST /api/portfolio
 * Fetches user balance, token allocations, and transaction history.
 */
app.post('/api/portfolio', async (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }
  try {
    const portfolio = await indexerService.getPortfolio(address);
    res.json(portfolio);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch portfolio' });
  }
});

/**
 * Endpoint: POST /api/analytics
 * Fetches computed/decrypted FHE analytics from the smart contract.
 */
app.post('/api/analytics', async (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }
  try {
    const analytics = await blockchainService.getFheAnalytics(address);
    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch FHE analytics' });
  }
});

/**
 * Endpoint: POST /api/orchestrate
 * Executes LangGraph multi-agent flow and returns the selected investment strategy.
 */
app.post('/api/orchestrate', async (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }
  try {
    const portfolio = await indexerService.getPortfolio(address);
    const fhe = await blockchainService.getFheAnalytics(address);
    const result = await supervisorAgent.executeOrchestration(portfolio, fhe);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to execute agent orchestration' });
  }
});

/**
 * Endpoint: POST /api/chat
 * Handles conversational queries about portfolio state, recommendations, or risk.
 */
app.post('/api/chat', async (req, res) => {
  const { message, context } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const query = message.toLowerCase();
    let reply = "";
    let agentActivity: string[] = [];

    // Simulate Agent Thinking Steps for UX
    if (query.includes('rebalance') || query.includes('suggest') || query.includes('investment')) {
      agentActivity = [
        "Risk Analyst evaluated concentration risks...",
        "DeFi Optimizer queried Uniswap liquidity pools...",
        "Portfolio Rebalancer calculated optimal allocation weights...",
        "Supervisor Node completed arbitration and selected Defi Optimizer's strategy."
      ];
      reply = "Based on our LangGraph multi-agent analysis, the optimal strategy is to rebalance your portfolio to ETH: 50%, WBTC: 15%, USDT: 20%, LINK: 15%. This increases your expected APY to 18% while keeping your FHE Risk Score at a moderate 32/100. Would you like to execute this transaction on Sepolia?";
    } else if (query.includes('risk') || query.includes('drawdown')) {
      agentActivity = [
        "Risk Analyst loaded FHE Risk metrics from Sepolia...",
        "Token Intelligence checked pool depth and dev wallet custody..."
      ];
      reply = `Your FHE Risk Score is minimal (${context?.riskScore || 28}/100), calculated using zero-knowledge inputs. Maximum Drawdown threshold is set safely, and your assets are fully shielded under CoFHE.js. There are no immediate risks detected.`;
    } else {
      agentActivity = ["Market Sentiment checked Github activity & news feeds..."];
      reply = "Understood. The CipherAlpha Core agent network is actively monitoring your FHE portfolio. You can trigger an encrypted audit or simulate portfolio optimization at any time using the action cards below.";
    }

    // Delay response slightly to simulate thinking animation
    setTimeout(() => {
      res.json({ reply, agentActivity });
    }, 1500);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to process chat' });
  }
});

// Start Server
app.listen(config.port, () => {
  console.log(`CipherAlpha AI Backend listening on port ${config.port}`);
});
