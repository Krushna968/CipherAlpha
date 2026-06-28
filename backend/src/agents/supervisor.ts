import { StateGraph } from '@langchain/langgraph';
import { RiskAnalystAgent, AgentRecommendation } from './riskAnalyst.js';
import { DefiOptimizerAgent } from './defiOptimizer.js';
import { PortfolioRebalancerAgent } from './rebalancer.js';
import { TokenIntelligenceAgent } from './tokenIntel.js';
import { MarketSentimentAgent } from './sentiment.js';
import { FheAnalytics } from '../services/blockchain.js';
import { PortfolioSummary } from '../services/indexer.js';

// 1. Define the LangGraph State Schema
interface GraphState {
  portfolio: PortfolioSummary;
  fhe: FheAnalytics;
  recommendations: AgentRecommendation[];
  finalResult?: {
    selected: AgentRecommendation;
    ranking: Array<{ agentName: string; score: number }>;
    aggregatedReasoning: string;
  };
}

export class SupervisorAgent {
  private riskAnalyst = new RiskAnalystAgent();
  private defiOptimizer = new DefiOptimizerAgent();
  private rebalancer = new PortfolioRebalancerAgent();
  private tokenIntel = new TokenIntelligenceAgent();
  private sentiment = new MarketSentimentAgent();

  /**
   * Run the LangGraph orchestration flow end-to-end.
   */
  async executeOrchestration(portfolio: PortfolioSummary, fhe: FheAnalytics) {
    // We initialize the StateGraph channels
    const channels = {
      portfolio: { value: (x: any) => x },
      fhe: { value: (x: any) => x },
      recommendations: { value: (x: any, y: any) => (x || []).concat(y || []) },
      finalResult: { value: (x: any) => x }
    };

    const graph = new StateGraph<GraphState>({ channels })
      // Node 1: Risk Analyst
      .addNode("riskAnalyst", async (state) => {
        const rec = await this.riskAnalyst.run(state.portfolio, state.fhe);
        return { recommendations: [rec] };
      })
      // Node 2: DeFi Optimizer
      .addNode("defiOptimizer", async (state) => {
        const rec = await this.defiOptimizer.run(state.portfolio, state.fhe);
        return { recommendations: [rec] };
      })
      // Node 3: Rebalancer
      .addNode("rebalancer", async (state) => {
        const rec = await this.rebalancer.run(state.portfolio, state.fhe);
        return { recommendations: [rec] };
      })
      // Node 4: Token Intel
      .addNode("tokenIntel", async (state) => {
        const rec = await this.tokenIntel.run(state.portfolio, state.fhe);
        return { recommendations: [rec] };
      })
      // Node 5: Market Sentiment
      .addNode("sentiment", async (state) => {
        const rec = await this.sentiment.run(state.portfolio, state.fhe);
        return { recommendations: [rec] };
      })
      // Node 6: Supervisor Arbitration
      .addNode("supervisor", (state) => {
        const recs = state.recommendations;
        
        // Arbitration algorithm: Rank based on Composite Efficiency Score
        // Score = (ExpectedReturn * ConfidenceScore) / RiskScore
        const ranked = recs.map(rec => {
          const rawScore = (rec.expectedReturn * rec.confidenceScore) / (rec.riskScore || 1);
          const score = Math.round(rawScore * 10) / 10;
          return {
            rec,
            score
          };
        });

        // Sort descending
        ranked.sort((a, b) => b.score - a.score);

        const best = ranked[0].rec;
        const rankingList = ranked.map(r => ({
          agentName: r.rec.agentName,
          score: r.score
        }));

        const aggregatedReasoning = `Arbitration complete. Selected [${best.agentName}]'s strategy. It demonstrates the highest capital efficiency score of ${ranked[0].score} based on homomorphically calculated FHE metrics. The strategy optimizes your APY to ${best.expectedReturn}% while mitigating drawdown risk to ${best.riskScore}/100.`;

        return {
          finalResult: {
            selected: best,
            ranking: rankingList,
            aggregatedReasoning
          }
        };
      });

    // Link graph nodes sequentially
    graph.addEdge("__start__", "riskAnalyst");
    graph.addEdge("riskAnalyst", "defiOptimizer");
    graph.addEdge("defiOptimizer", "rebalancer");
    graph.addEdge("rebalancer", "tokenIntel");
    graph.addEdge("tokenIntel", "sentiment");
    graph.addEdge("sentiment", "supervisor");
    graph.addEdge("supervisor", "__end__");

    // Compile and run the graph
    const app = graph.compile();
    const result = await app.invoke({
      portfolio,
      fhe,
      recommendations: []
    });

    return result.finalResult;
  }
}
