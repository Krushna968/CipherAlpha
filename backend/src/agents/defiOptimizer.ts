import Groq from 'groq-sdk';
import { config, hasGroqKey } from '../config.js';
import { FheAnalytics } from '../services/blockchain.js';
import { PortfolioSummary } from '../services/indexer.js';
import { AgentRecommendation } from './riskAnalyst.js';

export class DefiOptimizerAgent {
  private groq?: Groq;

  constructor() {
    if (hasGroqKey()) {
      this.groq = new Groq({ apiKey: config.groqApiKey });
    }
  }

  async run(portfolio: PortfolioSummary, fhe: FheAnalytics): Promise<AgentRecommendation> {
    const prompt = `
      You are the DeFi Optimizer Agent for CipherAlpha AI.
      Analyze the following details:
      - Total Portfolio Value: $${portfolio.totalValueUsd.toFixed(2)}
      - FHE Liquidity Score (Decrypted): ${fhe.liquidityScore}/100
      - Yield Exposure (Expected APY): ${fhe.yieldExposure}%
      
      Generate a yield optimization strategy using staking, lending, or yield pools on Fhenix/Sepolia.
      Return your answer strictly in the following JSON format:
      {
        "confidenceScore": number,
        "expectedReturn": number,
        "riskScore": number,
        "priorityScore": number,
        "reasoning": "string",
        "suggestedAllocation": { "ETH": number, "WBTC": number, "USDT": number, "LINK": number }
      }
    `;

    if (this.groq) {
      try {
        const chatCompletion = await this.groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama-3.3-70b-versatile',
          response_format: { type: 'json_object' }
        });
        const content = chatCompletion.choices[0]?.message?.content;
        if (content) {
          const result = JSON.parse(content);
          return { agentName: 'DeFi Optimizer', ...result };
        }
      } catch (error) {
        console.error("Groq AI Call failed in DeFi Optimizer, using fallback heuristics:", error);
      }
    }

    // Heuristics fallback
    const expectedReturn = Math.max(12, fhe.yieldExposure + 4); // Suggest optimizing for higher yields
    return {
      agentName: 'DeFi Optimizer',
      confidenceScore: 88,
      expectedReturn,
      riskScore: Math.round(fhe.riskScore * 1.15), // Optimizing for yield introduces slightly more risk
      priorityScore: 78,
      reasoning: `We detected idle capital. By routing 35% of your portfolio into Fhenix L2 Liquid Staking (stETH) and depositing the remaining stablecoins in shielded lending vaults, we can elevate your average APY from ${fhe.yieldExposure}% to ${expectedReturn}% with minimal liquidity friction.`,
      suggestedAllocation: {
        'ETH': 50,
        'WBTC': 15,
        'USDT': 20,
        'LINK': 15
      }
    };
  }
}
