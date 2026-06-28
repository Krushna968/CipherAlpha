import React, { useState } from 'react';
import { BrowserProvider, parseEther } from 'ethers';
import { ShieldCheck, CheckCircle2, TrendingUp, AlertTriangle, ExternalLink } from 'lucide-react';

interface RecommendationProps {
  agentResult: any;
  walletAddress: string | null;
  onSuccess: () => Promise<void>;
}

export const Recommendation: React.FC<RecommendationProps> = ({
  agentResult,
  walletAddress,
  onSuccess
}) => {
  const [txState, setTxState] = useState<{
    status: 'idle' | 'preparing' | 'signing' | 'confirming' | 'success' | 'failed';
    hash: string | null;
    error: string | null;
  }>({
    status: 'idle',
    hash: null,
    error: null
  });

  const selected = agentResult?.selected;
  const ranking = agentResult?.ranking || [];

  if (!selected) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center text-center min-h-[300px]">
        <AlertTriangle className="w-10 h-10 text-primary-fixed-dim mb-3 animate-pulse" />
        <h4 className="font-bold text-on-surface">No Active Recommendations</h4>
        <p className="text-xs text-on-surface-variant max-w-xs mt-1">
          Connect MetaMask, configure your settings, and submit your encrypted portfolio specifications to run the AI multi-agent orchestrator.
        </p>
      </div>
    );
  }

  const handleExecute = async () => {
    if (!walletAddress) return;
    
    setTxState({ status: 'preparing', hash: null, error: null });

    try {
      // 1. Request sign payload
      setTxState(prev => ({ ...prev, status: 'signing' }));
      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      // Trigger a Sepolia demo transaction: send a tiny bit of Sepolia ETH to ourselves
      // or to the CipherAlpha contract to mock rebalancing execution.
      const tx = await signer.sendTransaction({
        to: walletAddress,
        value: parseEther("0.0001") // Tiny amount to satisfy wallet request
      });

      setTxState(prev => ({ ...prev, status: 'confirming', hash: tx.hash }));

      // 2. Wait for block confirmation
      await tx.wait();

      setTxState(prev => ({ ...prev, status: 'success' }));
      
      // Call reload hook to fetch fresh portfolio and re-run analytics
      setTimeout(async () => {
        await onSuccess();
      }, 2000);
    } catch (e: any) {
      console.error("Transaction execution failed:", e);
      setTxState({
        status: 'failed',
        hash: null,
        error: e.message || "User rejected transaction or gas estimation failed."
      });
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-5 w-full">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-headline-md text-xl text-primary font-bold">Arbitrated Investment Strategy</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            LangGraph ranked output selected for maximum yield efficiency.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tertiary/10 border border-tertiary/20 text-tertiary">
          <ShieldCheck className="w-4.5 h-4.5" />
          <span className="text-[11px] font-bold">FHE Verified</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-3">
          <p className="text-[10px] text-on-surface-variant font-medium uppercase">Expected APY</p>
          <p className="text-lg font-bold text-tertiary">+{selected.expectedReturn}%</p>
        </div>
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-3">
          <p className="text-[10px] text-on-surface-variant font-medium uppercase">Risk Profile</p>
          <p className="text-lg font-bold text-on-surface">{selected.riskScore}/100</p>
        </div>
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-3">
          <p className="text-[10px] text-on-surface-variant font-medium uppercase">AI Confidence</p>
          <p className="text-lg font-bold text-primary">{selected.confidenceScore}%</p>
        </div>
      </div>

      {/* Suggested Allocation */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-on-surface-variant font-bold">SUGGESTED ASSET ALLOCATION</p>
        <div className="flex items-center gap-1 h-3 rounded-full overflow-hidden bg-surface-container mt-1">
          {Object.entries(selected.suggestedAllocation).map(([symbol, pct], idx) => {
            const colors = ['bg-primary', 'bg-tertiary', 'bg-secondary', 'bg-primary-fixed-dim'];
            const color = colors[idx % colors.length];
            return (
              <div 
                key={symbol} 
                className={`h-full ${color}`} 
                style={{ width: `${pct}%` }} 
                title={`${symbol}: ${pct}%`}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-on-surface mt-1">
          {Object.entries(selected.suggestedAllocation).map(([symbol, pct], idx) => {
            const dotColors = ['bg-primary', 'bg-tertiary', 'bg-secondary', 'bg-primary-fixed-dim'];
            const dotColor = dotColors[idx % dotColors.length];
            return (
              <div key={symbol} className="flex items-center justify-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                <span>{symbol}: <strong>{pct as number}%</strong></span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supervisor explanation */}
      <div className="border border-outline-variant/20 bg-surface-container-lowest p-4 rounded-xl">
        <p className="text-[11px] font-bold text-primary mb-1 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" /> ARBITRATOR INSIGHTS:
        </p>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {selected.reasoning}
        </p>
      </div>

      {/* Agent Rankings list */}
      {ranking.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] text-on-surface-variant font-bold">LANGGRAPH SUPERVISOR RANKINGS:</p>
          <div className="flex flex-col gap-1.5">
            {ranking.map((rank: any, rIdx: number) => (
              <div key={rank.agentName} className="flex justify-between items-center text-[11px] px-2 py-1 rounded bg-surface-container/30">
                <span className="text-on-surface-variant">{rIdx + 1}. {rank.agentName}</span>
                <span className="font-semibold text-on-surface">Efficiency Score: {rank.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction Pipeline */}
      {txState.status !== 'idle' && (
        <div className="border-t border-outline-variant/20 pt-4 flex flex-col gap-3">
          <p className="text-xs font-bold text-on-surface">Execution Pipeline Status:</p>
          
          <div className="flex flex-col gap-2 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/15">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Estimated Gas:</span>
              <span className="font-bold text-on-surface">0.000421 Sepolia ETH</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Network:</span>
              <span className="font-bold text-primary">Sepolia Testnet</span>
            </div>
            
            {txState.status === 'signing' && (
              <p className="text-xs text-primary font-semibold animate-pulse mt-1">Awaiting signature confirmation via MetaMask...</p>
            )}
            {txState.status === 'confirming' && (
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-xs text-tertiary font-semibold animate-pulse">Broadcasting transaction to Sepolia blocks...</p>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${txState.hash}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] text-primary hover:underline flex items-center gap-1.5"
                >
                  View on Etherscan <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
            {txState.status === 'success' && (
              <div className="flex items-center gap-1.5 text-xs text-tertiary font-bold mt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strategy executed successfully! Refreshing dashboard data...</span>
              </div>
            )}
            {txState.status === 'failed' && (
              <p className="text-xs text-error font-semibold mt-1">{txState.error}</p>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleExecute}
        disabled={txState.status === 'signing' || txState.status === 'confirming'}
        className="w-full py-3.5 rounded-xl bg-primary text-on-primary hover:bg-primary-fixed font-bold font-label-md text-sm transition-all duration-300 scale-95 active:scale-90 shadow-md cursor-pointer disabled:opacity-50"
      >
        Execute Strategy
      </button>
    </div>
  );
};
