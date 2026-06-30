import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserProvider, parseEther } from 'ethers';
import { Shield, TrendingUp, AlertTriangle, Play, Loader2, CheckSquare } from 'lucide-react';
import { TokenAllocationChart } from './TokenAllocationChart.tsx';

interface RecommendationProps {
  agentResult: any;
  portfolioData: any;
  walletAddress: string | null;
  onSuccess: () => Promise<void>;
}

export const Recommendation: React.FC<RecommendationProps> = ({ agentResult, portfolioData, walletAddress, onSuccess }) => {
  const [txState, setTxState] = useState<{ status: string; hash: string | null; error: string | null }>({ status: 'idle', hash: null, error: null });

  const selected = agentResult?.selected;
  const currentAlloc: Record<string, number> = {};
  if (portfolioData?.tokens) {
    portfolioData.tokens.forEach((t: any) => currentAlloc[t.symbol] = Math.round(t.allocationPct));
  }

  if (!selected) {
    return (
      <div className="glass-panel p-6 rounded-xl border-t-2 border-t-outline-variant flex flex-col items-center justify-center text-center h-[200px]">
        <AlertTriangle className="w-8 h-8 text-on-surface-variant mb-2 opacity-50" />
        <p className="text-[10px] text-on-surface-variant font-mono">AWAITING_ARBITRATION</p>
      </div>
    );
  }

  const handleExecute = async () => {
    if (!walletAddress) return;
    try {
      setTxState({ status: 'signing', hash: null, error: null });
      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({ to: walletAddress, value: parseEther('0.0001') });
      setTxState({ status: 'confirming', hash: tx.hash, error: null });
      await tx.wait();
      setTxState({ status: 'success', hash: tx.hash, error: null });
      setTimeout(() => onSuccess(), 1500);
    } catch (e: any) {
      setTxState({ status: 'failed', hash: null, error: 'EXEC_REVERTED' });
    }
  };

  const handleSimulate = () => {
    setTxState({ status: 'success', hash: null, error: null });
    setTimeout(() => onSuccess(), 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-4 rounded-xl border-t-2 border-t-tertiary">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-mono text-xs font-bold text-tertiary tracking-widest">ARBITRATION_OUTPUT</h3>
          <p className="text-[9px] text-on-surface-variant font-mono mt-0.5">SELECTED_NODE: {selected.agentName}</p>
        </div>
        <div className="bg-tertiary/10 border border-tertiary/30 px-2 py-0.5 flex items-center gap-1 rounded">
          <Shield className="w-3 h-3 text-tertiary" />
          <span className="text-[9px] font-mono font-bold text-tertiary">FHE_SAFE</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'APY_EST', value: `+${selected.expectedReturn}%`, cls: 'text-tertiary' },
          { label: 'RISK_IDX',  value: `${selected.riskScore}`,    cls: 'text-secondary' },
          { label: 'CONF', value: `${selected.confidenceScore}%`, cls: 'text-on-surface' },
        ].map(c => (
          <div key={c.label} className="bg-black/30 border border-outline-variant/20 p-2 rounded flex flex-col items-center">
            <span className="text-[8px] font-mono text-on-surface-variant mb-0.5">{c.label}</span>
            <span className={`text-xs font-mono font-bold ${c.cls}`}>{c.value}</span>
          </div>
        ))}
      </div>

      <TokenAllocationChart current={Object.keys(currentAlloc).length > 0 ? currentAlloc : undefined} suggested={selected.suggestedAllocation} />

      <div className="mt-4 p-2 bg-black/40 border border-outline-variant/20 rounded">
        <p className="text-[9px] text-tertiary font-mono mb-1">&gt; ARBITRATOR_LOG:</p>
        <p className="text-[10px] text-on-surface-variant font-mono leading-relaxed">{selected.reasoning}</p>
      </div>

      <AnimatePresence>
        {txState.status !== 'idle' && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 border-t border-outline-variant/20 pt-3">
            <div className="bg-black/40 border border-secondary/30 p-2 rounded font-mono text-[9px] flex flex-col gap-1">
              {txState.status === 'signing' && <span className="text-secondary animate-pulse">&gt; AWAITING_SIGNATURE...</span>}
              {txState.status === 'confirming' && <span className="text-secondary animate-pulse">&gt; BROADCASTING_L2... [{txState.hash?.slice(0,8)}]</span>}
              {txState.status === 'success' && <span className="text-tertiary">&gt; EXECUTION_SUCCESSFUL.</span>}
              {txState.status === 'failed' && <span className="text-error">&gt; ERR: {txState.error}</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleExecute}
          disabled={txState.status === 'signing' || txState.status === 'confirming' || txState.status === 'success' || !walletAddress}
          className="flex-1 py-2 bg-tertiary/10 text-tertiary border border-tertiary/30 hover:bg-tertiary hover:text-background font-mono text-[10px] font-bold transition-all disabled:opacity-40 flex items-center justify-center gap-1"
        >
          <Play className="w-3 h-3" /> [EXECUTE]
        </button>
        {!walletAddress && (
          <button
            onClick={handleSimulate}
            disabled={txState.status === 'success'}
            className="flex-1 py-2 bg-transparent text-secondary border border-secondary/30 hover:bg-secondary/10 font-mono text-[10px] transition-all disabled:opacity-40"
          >
            [SIM_MODE]
          </button>
        )}
      </div>
    </motion.div>
  );
};
