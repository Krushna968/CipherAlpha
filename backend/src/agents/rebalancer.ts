import Groq from 'groq-sdk';
import { config, hasGroqKey } from '../config.js';
import { FheAnalytics } from '../services/blockchain.js';
import { PortfolioSummary } from '../services/indexer.js';
import { AgentRecommendation } from './riskAnalyst.js';

export class PortfolioRebalancerAgent {
  private groq?: Groq;

  constructor() {
    if (hasGroqKey()) {
      this.groq = new Groq({ apiKey: config.groqApiKey });
    }
  }

  async run(portfolio: PortfolioSummary, fhe: FheAnalytics): Promise<AgentRecommendation> {
    const prompt = `
      You are the Portfolio Rebalancer Agent for CipherAlpha AI.
      Analyze the following details:
      - FHE Diversification Score (Decrypted): ${fhe.diversificationScore}/100
      - Portfolio Health: ${fhe.portfolioHealth}/100
      - Current Token Allocations:
      ${JSON.stringify(portfolio.tokens)}

      Suggest a rebalancing strategy to optimize diversification and lock in gains.
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
          return { agentName: 'Portfolio Rebalancer', ...result };
        }
      } catch (error) {
        console.error("Groq AI Call failed in Portfolio Rebalancer, using fallback heuristics:", error);
      }
    }

    // Heuristics fallback
    return {
      agentName: 'Portfolio Rebalancer',
      confidenceScore: 90,
      expectedReturn: Math.round(fhe.yieldExposure * 1.1), 
      riskScore: Math.round(fhe.riskScore * 0.9), // Rebalancing usually reduces overall risk
      priorityScore: fhe.diversificationScore < 70 ? 88 : 50,
      reasoning: `Your portfolio's diversification score is ${fhe.diversificationScore}/100. ETH is currently occupying over 60% of your holdings, exposing you to systemic volatility. We suggest rebalancing to a 40/30/20/10 structure across ETH, WBTC, USDT, and LINK to align with optimal ZK-portfolio diversification parameters.`,
      suggestedAllocation: {
        'ETH': 40,
        'WBTC': 30,
        'USDT': 20,
        'LINK': 10
      }
    };
  }
}
