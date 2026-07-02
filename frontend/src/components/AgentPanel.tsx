import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ShieldAlert, TrendingUp, RefreshCw, BarChart2, Loader2, Cpu } from 'lucide-react';

interface AgentPanelProps {
  isRunning: boolean;
  agentResult: any;
  pipelineStep: number;
}

const AGENTS = [
  { name: 'Risk Analyst', icon: ShieldAlert },
  { name: 'DeFi Optimizer', icon: TrendingUp },
  { name: 'Rebalancer', icon: RefreshCw },
  { name: 'Token Intel', icon: Eye },
  { name: 'Sentiment', icon: BarChart2 },
];

const PIPELINE_STEPS = [
  { label: 'FHE snapshot', activeAt: 1, doneAt: 2 },
  { label: 'CoFHE encrypt', activeAt: 1, doneAt: 2 },
  { label: 'L2 validation', activeAt: 2, doneAt: 3 },
  { label: 'Agent compute', activeAt: 3, doneAt: 4 },
  { label: 'Execution txn', activeAt: 5, doneAt: 5 },
];

export const AgentPanel: React.FC<AgentPanelProps> = ({ isRunning, agentResult, pipelineStep }) => {
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isRunning) {
      AGENTS.forEach((a, i) => {
        setStatuses(p => ({ ...p, [a.name]: 'COMPUTING' }));
        setProgresses(p => ({ ...p, [a.name]: 0 }));
        let prog = 0;
        const interval = setInterval(() => {
          prog += Math.floor(Math.random() * 12) + 5;
          if (prog >= 100) {
            prog = 100;
            clearInterval(interval);
            setStatuses(p => ({ ...p, [a.name]: 'DONE' }));
          }
          setProgresses(p => ({ ...p, [a.name]: prog }));
        }, 120 + i * 80);
      });
    } else if (agentResult) {
      AGENTS.forEach(a => {
        setStatuses(p => ({ ...p, [a.name]: 'DONE' }));
        setProgresses(p => ({ ...p, [a.name]: 100 }));
      });
    } else {
      AGENTS.forEach(a => {
        setStatuses(p => ({ ...p, [a.name]: 'IDLE' }));
        setProgresses(p => ({ ...p, [a.name]: 0 }));
      });
    }
  }, [isRunning, agentResult]);

  return (
    <div className="flex flex-col gap-4">
      {/* Pipeline */}
      <div className="glass-panel p-4 rounded-xl border-t-2 border-t-tertiary">
        <h3 className="font-mono text-xs font-bold text-tertiary tracking-widest flex items-center gap-2 mb-3">
          <Cpu className="w-3.5 h-3.5" /> SYSTEM_PIPELINE
        </h3>
        <div className="flex flex-col gap-2.5">
          {PIPELINE_STEPS.map((step, idx) => {
            const status = pipelineStep >= step.doneAt ? 'success' : pipelineStep >= step.activeAt ? 'running' : 'idle';
            return (
              <div key={step.label} className="flex justify-between items-center text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-none flex-shrink-0 ${
                    status === 'success' ? 'bg-tertiary' : status === 'running' ? 'bg-secondary animate-pulse' : 'bg-outline-variant'
                  }`} />
                  <span className={status === 'success' ? 'text-on-surface' : status === 'running' ? 'text-secondary glow-secondary' : 'text-on-surface-variant'}>
                    0{idx + 1}_{step.label}
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  {status === 'success' && <motion.span key="ok" initial={{opacity:0}} animate={{opacity:1}} className="text-tertiary">OK</motion.span>}
                  {status === 'running' && <motion.span key="run" initial={{opacity:0}} animate={{opacity:1}} className="text-secondary animate-pulse flex items-center gap-1"><Loader2 className="w-2.5 h-2.5 animate-spin"/> RUN</motion.span>}
                  {status === 'idle' && <motion.span key="idle" className="text-on-surface-variant/50">WAIT</motion.span>}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agents */}
      <div className="glass-panel p-4 rounded-xl border-t-2 border-t-secondary">
        <h3 className="font-mono text-xs font-bold text-secondary tracking-widest flex items-center gap-2 mb-3">
          <Cpu className="w-3.5 h-3.5" /> AGENT_NETWORK
        </h3>
        <div className="flex flex-col gap-2">
          {AGENTS.map((agent, i) => {
            const Icon = agent.icon;
            const status = statuses[agent.name] || 'IDLE';
            const progress = progresses[agent.name] || 0;
            const isWinner = agentResult?.selected?.agentName === agent.name;

            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-2.5 rounded border transition-all ${
                  isWinner ? 'border-tertiary bg-tertiary/5 glow-tertiary' : 'border-outline-variant/30 bg-black/20'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${isWinner ? 'text-tertiary' : 'text-on-surface-variant'}`} />
                    <span className={`text-[10px] font-mono font-bold ${isWinner ? 'text-tertiary' : 'text-on-surface'}`}>
                      {agent.name.toUpperCase()}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono ${
                    status === 'DONE' ? 'text-tertiary' : status === 'COMPUTING' ? 'text-secondary animate-pulse' : 'text-on-surface-variant'
                  }`}>
                    [{status}]
                  </span>
                </div>
                <div className="w-full bg-surface-variant/50 h-0.5 relative overflow-hidden">
                  <div className={`absolute left-0 top-0 h-full ${status === 'DONE' ? 'bg-tertiary' : 'bg-secondary'}`} style={{ width: `${progress}%` }} />
                </div>
                {status === 'DONE' && agentResult?.recommendations && (
                  <div className="mt-2 pt-2 border-t border-outline-variant/20 flex justify-between text-[9px] font-mono text-on-surface-variant">
                    <span>CONF: <span className="text-secondary">{Math.floor(Math.random()*20 + 80)}%</span></span>
                    <span>RISK: <span className="text-secondary">{Math.floor(Math.random()*40 + 10)}</span></span>
                    <span>APY: <span className="text-tertiary">+{Math.floor(Math.random()*15 + 5)}%</span></span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
