import React, { useEffect, useState } from 'react';
import { Eye, ShieldAlert, TrendingUp, RefreshCw, BarChart2, CheckCircle2 } from 'lucide-react';

interface AgentPanelProps {
  isRunning: boolean;
  agentResult: any;
}

interface AgentCard {
  name: string;
  role: string;
  icon: any;
  color: string;
}

const AGENTS: AgentCard[] = [
  { name: 'Risk Analyst', role: 'Risk, Drawdown & Volatility evaluation', icon: ShieldAlert, color: 'text-error' },
  { name: 'DeFi Optimizer', role: 'Yield strategies, Staking & Lending APY', icon: TrendingUp, color: 'text-tertiary' },
  { name: 'Portfolio Rebalancer', role: 'Diversification & allocation weighting', icon: RefreshCw, color: 'text-primary' },
  { name: 'Token Intelligence', role: 'Exploit audits, pool depth & safety scans', icon: Eye, color: 'text-secondary' },
  { name: 'Market Sentiment', role: 'News crawler, github activity & social metrics', icon: BarChart2, color: 'text-primary-fixed-dim' }
];

export const AgentPanel: React.FC<AgentPanelProps> = ({ isRunning, agentResult }) => {
  const [progresses, setProgresses] = useState<Record<string, number>>({
    'Risk Analyst': 0,
    'DeFi Optimizer': 0,
    'Portfolio Rebalancer': 0,
    'Token Intelligence': 0,
    'Market Sentiment': 0
  });

  const [statuses, setStatuses] = useState<Record<string, string>>({
    'Risk Analyst': 'Idle',
    'DeFi Optimizer': 'Idle',
    'Portfolio Rebalancer': 'Idle',
    'Token Intelligence': 'Idle',
    'Market Sentiment': 'Idle'
  });

  useEffect(() => {
    if (isRunning) {
      // Simulate sequential/parallel execution animation
      AGENTS.forEach((agent, index) => {
        setStatuses(prev => ({ ...prev, [agent.name]: 'Thinking...' }));
        setProgresses(prev => ({ ...prev, [agent.name]: 0 }));

        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.floor(Math.random() * 15) + 5;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setStatuses(prev => ({ ...prev, [agent.name]: 'Completed' }));
          }
          setProgresses(prev => ({ ...prev, [agent.name]: progress }));
        }, 100 + index * 100);
      });
    } else if (agentResult) {
      // All completed
      AGENTS.forEach(agent => {
        setStatuses(prev => ({ ...prev, [agent.name]: 'Completed' }));
        setProgresses(prev => ({ ...prev, [agent.name]: 100 }));
      });
    } else {
      AGENTS.forEach(agent => {
        setStatuses(prev => ({ ...prev, [agent.name]: 'Idle' }));
        setProgresses(prev => ({ ...prev, [agent.name]: 0 }));
      });
    }
  }, [isRunning, agentResult]);

  return (
    <aside className="glass-panel p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-6 w-full">
      <div>
        <h3 className="font-headline-md text-xl text-on-surface font-bold">Multi-Agent Intelligence Core</h3>
        <p className="text-xs text-on-surface-variant mt-1">
          Five independent agents analyzing on-chain indices and encrypted metrics under FHE.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          const status = statuses[agent.name];
          const progress = progresses[agent.name];
          const isDone = status === 'Completed';
          const isThinking = status === 'Thinking...';

          // Extract agent specific result details if finished
          const recommendations = agentResult?.recommendations || [];
          const agentData = recommendations.find((r: any) => r.agentName === agent.name);

          return (
            <div key={agent.name} className="border border-outline-variant/20 rounded-xl p-3 bg-surface-container-low flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg bg-surface-variant flex items-center justify-center ${agent.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">{agent.name}</p>
                    <p className="text-[10px] text-on-surface-variant">{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isDone ? (
                    <div className="flex items-center gap-1 text-tertiary">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-semibold">Done</span>
                    </div>
                  ) : isThinking ? (
                    <span className="text-[10px] text-primary animate-pulse font-semibold">Thinking...</span>
                  ) : (
                    <span className="text-[10px] text-on-surface-variant font-semibold">Idle</span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    isDone ? 'bg-tertiary' : 'bg-primary'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Agent metrics output once completed */}
              {isDone && agentData && (
                <div className="flex justify-between items-center text-[10px] text-on-surface-variant border-t border-outline-variant/10 pt-1.5 mt-0.5">
                  <span>Confidence: <strong className="text-primary">{agentData.confidenceScore}%</strong></span>
                  <span>Risk: <strong className={agentData.riskScore > 50 ? 'text-error' : 'text-tertiary'}>{agentData.riskScore}/100</strong></span>
                  <span>APY: <strong className="text-tertiary">+{agentData.expectedReturn}%</strong></span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
