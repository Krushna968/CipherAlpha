import Groq from 'groq-sdk';
import { config, hasGroqKey } from '../config.js';
import { FheAnalytics } from '../services/blockchain.js';
import { PortfolioSummary } from '../services/indexer.js';

export interface AgentRecommendation {
  agentName: string;
  confidenceScore: number;     // 1 - 100
  expectedReturn: number;      // Pct APY
  riskScore: number;           // 1 - 100
  priorityScore: number;       // 1 - 100
  reasoning: string;
  suggestedAllocation: Record<string, number>;
}

export class RiskAnalystAgent {
  private groq?: Groq;

  constructor() {
    if (hasGroqKey()) {
      this.groq = new Groq({ apiKey: config.groqApiKey });
    }
  }

  async run(portfolio: PortfolioSummary, fhe: FheAnalytics): Promise<AgentRecommendation> {
    const prompt = `
      You are the Risk Analyst Agent for CipherAlpha AI.
      Analyze the following portfolio details and FHE-calculated risk parameters:
      - Total Portfolio Value: $${portfolio.totalValueUsd.toFixed(2)}
      - FHE Risk Score (Decrypted): ${fhe.riskScore}/100
      - Diversification Score: ${fhe.diversificationScore}/100
      - Portfolio Health: ${fhe.portfolioHealth}/100

      Current Token Holdings:
      ${JSON.stringify(portfolio.tokens)}

      Generate a risk mitigation and asset allocation strategy.
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
          return { agentName: 'Risk Analyst', ...result };
        }
      } catch (error) {
        console.error("Groq AI Call failed in Risk Analyst, using fallback heuristics:", error);
      }
    }

    // Heuristics fallback
    const expectedReturn = Math.max(5, 15 - Math.round(fhe.riskScore / 5)); // Higher risk -> slightly lower safe returns
    return {
      agentName: 'Risk Analyst',
      confidenceScore: 92,
      expectedReturn,
      riskScore: fhe.riskScore,
      priorityScore: fhe.riskScore > 35 ? 85 : 45, // High risk -> High priority to fix it
      reasoning: `Your FHE Risk Score is ${fhe.riskScore}/100. The concentration of assets is currently weighted heavily in volatile Layer-1/2 components. We suggest rebalancing 25% of holdings to shielded stablecoins (USDT) to insulate against local contract drawdowns and mempool frontrunning.`,
      suggestedAllocation: {
        'ETH': 40,
        'WBTC': 20,
        'USDT': 30,
        'LINK': 10
      }
    };
  }
}
