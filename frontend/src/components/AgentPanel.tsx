import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ShieldAlert, TrendingUp, RefreshCw, BarChart2, Loader2, Cpu, CheckCircle2 } from 'lucide-react';

interface AgentPanelProps {
  isRunning: boolean;
  agentResult: any;
  pipelineStep: number;
}

const AGENTS = [
  { name: 'Risk Analyst',  icon: ShieldAlert, color: '#ef4444' },
  { name: 'DeFi Optimizer', icon: TrendingUp,  color: '#00f0c8' },
  { name: 'Rebalancer',    icon: RefreshCw,   color: '#0ea5e9' },
  { name: 'Token Intel',   icon: Eye,          color: '#8b5cf6' },
  { name: 'Sentiment',     icon: BarChart2,    color: '#f59e0b' },
];

const PIPELINE_STEPS = [
  { label: 'FHE snapshot',  activeAt: 1, doneAt: 2 },
  { label: 'CoFHE encrypt', activeAt: 1, doneAt: 2 },
  { label: 'L2 validation', activeAt: 2, doneAt: 3 },
  { label: 'Agent compute', activeAt: 3, doneAt: 4 },
  { label: 'Execution txn', activeAt: 5, doneAt: 5 },
];

export const AgentPanel: React.FC<AgentPanelProps> = ({ isRunning, agentResult, pipelineStep }) => {
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [statuses, setStatuses]     = useState<Record<string, string>>({});

  useEffect(() => {
    if (isRunning) {
      AGENTS.forEach((a, i) => {
        setStatuses(p => ({ ...p, [a.name]: 'COMPUTING' }));
        setProgresses(p => ({ ...p, [a.name]: 0 }));
        let prog = 0;
        const iv = setInterval(() => {
          prog += Math.floor(Math.random() * 12) + 5;
          if (prog >= 100) { prog = 100; clearInterval(iv); setStatuses(p => ({ ...p, [a.name]: 'DONE' })); }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Pipeline */}
      <div style={{
        background: 'rgba(13,17,23,0.7)',
        border: '1px solid var(--border)',
        borderTop: '2px solid var(--cyan)',
        borderRadius: 10,
        padding: '12px 14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Cpu size={12} color="var(--cyan)" />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--cyan)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            SYSTEM_PIPELINE
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PIPELINE_STEPS.map((step, idx) => {
            const status = pipelineStep >= step.doneAt ? 'success' : pipelineStep >= step.activeAt ? 'running' : 'idle';
            return (
              <div key={step.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 6, height: 6,
                    borderRadius: 1,
                    background: status === 'success' ? 'var(--cyan)' : status === 'running' ? '#0ea5e9' : 'var(--text-dim)',
                    boxShadow: status !== 'idle' ? `0 0 6px ${status === 'success' ? 'var(--cyan)' : '#0ea5e9'}` : 'none',
                    flexShrink: 0
                  }} />
                  <span style={{
                    fontFamily: 'JetBrains Mono', fontSize: 10,
                    color: status === 'success' ? 'var(--text-primary)' : status === 'running' ? '#0ea5e9' : 'var(--text-dim)'
                  }}>
                    0{idx + 1}_{step.label}
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.span key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <CheckCircle2 size={10} /> OK
                    </motion.span>
                  )}
                  {status === 'running' && (
                    <motion.span key="run" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Loader2 size={10} className="animate-spin" /> RUN
                    </motion.span>
                  )}
                  {status === 'idle' && (
                    <motion.span key="wait"
                      style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-dim)' }}>
                      WAIT
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent Network */}
      <div style={{
        background: 'rgba(13,17,23,0.7)',
        border: '1px solid var(--border)',
        borderTop: '2px solid #0ea5e9',
        borderRadius: 10,
        padding: '12px 14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Cpu size={12} color="#0ea5e9" />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#0ea5e9', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            AGENT_NETWORK
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                style={{
                  padding: '8px 10px', borderRadius: 8,
                  border: isWinner ? `1px solid ${agent.color}40` : '1px solid var(--border)',
                  background: isWinner ? `${agent.color}08` : 'rgba(0,0,0,0.2)',
                  boxShadow: isWinner ? `0 0 12px ${agent.color}20` : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon size={12} color={isWinner ? agent.color : 'var(--text-dim)'} />
                    <span style={{
                      fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600,
                      color: isWinner ? agent.color : 'var(--text-primary)'
                    }}>
                      {agent.name.toUpperCase()}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'JetBrains Mono', fontSize: 9,
                    color: status === 'DONE' ? 'var(--cyan)' : status === 'COMPUTING' ? '#0ea5e9' : 'var(--text-dim)'
                  }}>
                    [{status}]
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', background: status === 'DONE' ? agent.color : '#0ea5e9', borderRadius: 1 }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                {/* Agent stats when done */}
                {status === 'DONE' && agentResult?.recommendations && (
                  <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                    {[
                      { label: 'CONF', value: `${Math.floor(Math.random() * 20 + 80)}%`, color: '#0ea5e9' },
                      { label: 'RISK', value: `${Math.floor(Math.random() * 40 + 10)}`, color: '#f59e0b' },
                      { label: 'APY', value: `+${Math.floor(Math.random() * 15 + 5)}%`, color: 'var(--cyan)' },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 8, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono' }}>{s.label}</div>
                        <div style={{ fontSize: 10, color: s.color, fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{s.value}</div>
                      </div>
                    ))}
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
