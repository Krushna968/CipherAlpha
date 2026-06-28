import React, { useState } from 'react';
import { Shield, Coins, Activity, ArrowUpRight, Cpu } from 'lucide-react';

interface PortfolioProps {
  portfolioData: any;
  fheAnalytics: any;
  loadingStates: any;
  onRunAnalytics: (inputs: any) => Promise<void>;
  isConnected: boolean;
}

export const Portfolio: React.FC<PortfolioProps> = ({
  portfolioData,
  fheAnalytics,
  loadingStates,
  onRunAnalytics,
  isConnected
}) => {
  // Input settings state
  const [inputs, setInputs] = useState({
    portfolioValue: 125000,
    investmentBudget: 25000,
    riskPreference: 45,
    liquidityPct: 80,
    diversificationPct: 75,
    expectedApy: 12,
    maxDrawdown: 15,
    timeHorizon: 24
  });

  const handleInputChange = (key: string, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;
    onRunAnalytics(inputs);
  };

  // Determine Loading Text
  const getLoadingText = () => {
    if (loadingStates.encrypting) return "CoFHE.js Encrypting Inputs...";
    if (loadingStates.updatingContract) return "Storing Encrypted State...";
    if (loadingStates.calculatingFhe) return "Computing Homomorphic Scores...";
    if (loadingStates.requestingDecrypt) return "Awaiting Decryption Tasks...";
    return "Submit Encrypted Specs";
  };

  const isBtnLoading = 
    loadingStates.encrypting || 
    loadingStates.updatingContract || 
    loadingStates.calculatingFhe || 
    loadingStates.requestingDecrypt;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Metrics Row */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-panel p-4 rounded-xl glow-hover transition-all duration-300">
          <div className="flex justify-between items-start mb-1">
            <span className="text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">Total Portfolio</span>
            <Coins className="text-primary w-5 h-5" />
          </div>
          <div className="font-headline-md text-2xl text-on-surface">
            ${portfolioData?.totalValueUsd ? portfolioData.totalValueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '$1,248,392'}
          </div>
          <div className="text-tertiary text-[11px] font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12.4%
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl glow-hover transition-all duration-300">
          <div className="flex justify-between items-start mb-1">
            <span className="text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">FHE Risk Score</span>
            <Shield className="text-primary w-5 h-5" />
          </div>
          <div className="font-headline-md text-2xl text-on-surface">
            {fheAnalytics ? `${fheAnalytics.riskScore}/100` : 'Shielded'}
          </div>
          <div className="text-on-surface-variant text-[11px] mt-1">
            {fheAnalytics ? 'Fhenix L2 Verified' : 'Zero-Knowledge'}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl glow-hover transition-all duration-300">
          <div className="flex justify-between items-start mb-1">
            <span className="text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">Active Agents</span>
            <Cpu className="text-primary w-5 h-5" />
          </div>
          <div className="font-headline-md text-2xl text-on-surface">05</div>
          <div className="text-tertiary text-[11px] mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span> Multi-Agent Active
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl glow-hover transition-all duration-300">
          <div className="flex justify-between items-start mb-1">
            <span className="text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">Portfolio Health</span>
            <Activity className="text-primary w-5 h-5" />
          </div>
          <div className="font-headline-md text-2xl text-on-surface">
            {fheAnalytics ? `${fheAnalytics.portfolioHealth}%` : '88%'}
          </div>
          <div className="text-tertiary text-[11px] mt-1">Deep Learning</div>
        </div>

        <div className="glass-panel p-4 rounded-xl glow-hover transition-all duration-300 col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-1">
            <span className="text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">Encrypted Tx</span>
            <Shield className="text-primary w-5 h-5" />
          </div>
          <div className="font-headline-md text-2xl text-on-surface">1,406</div>
          <div className="text-on-surface-variant text-[11px] mt-1">Fhenix L2 Verified</div>
        </div>
      </section>

      {/* FHE Form Configuration */}
      <section className="glass-panel p-6 rounded-2xl flex flex-col gap-5 border border-outline-variant/30">
        <div>
          <h3 className="font-headline-md text-xl text-primary font-bold">Confidential Portfolio Settings</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Configure your metrics. All numbers are encrypted locally on your browser via CoFHE.js. Only your encrypted values are sent to Fhenix L2.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-on-surface-variant font-semibold">Portfolio Value ($)</label>
            <input 
              type="number" 
              value={inputs.portfolioValue} 
              onChange={e => handleInputChange('portfolioValue', Number(e.target.value))}
              className="bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              disabled={isBtnLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-on-surface-variant font-semibold">Investment Budget ($)</label>
            <input 
              type="number" 
              value={inputs.investmentBudget} 
              onChange={e => handleInputChange('investmentBudget', Number(e.target.value))}
              className="bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              disabled={isBtnLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-on-surface-variant font-semibold">Risk Preference (1-100)</label>
            <input 
              type="number" 
              value={inputs.riskPreference} 
              onChange={e => handleInputChange('riskPreference', Number(e.target.value))}
              className="bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              disabled={isBtnLoading}
              min="1" max="100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-on-surface-variant font-semibold">Expected APY (%)</label>
            <input 
              type="number" 
              value={inputs.expectedApy} 
              onChange={e => handleInputChange('expectedApy', Number(e.target.value))}
              className="bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              disabled={isBtnLoading}
              min="0" max="100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-on-surface-variant font-semibold">Liquidity %</label>
            <input 
              type="number" 
              value={inputs.liquidityPct} 
              onChange={e => handleInputChange('liquidityPct', Number(e.target.value))}
              className="bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              disabled={isBtnLoading}
              min="0" max="100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-on-surface-variant font-semibold">Diversification %</label>
            <input 
              type="number" 
              value={inputs.diversificationPct} 
              onChange={e => handleInputChange('diversificationPct', Number(e.target.value))}
              className="bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              disabled={isBtnLoading}
              min="0" max="100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-on-surface-variant font-semibold">Max Drawdown (%)</label>
            <input 
              type="number" 
              value={inputs.maxDrawdown} 
              onChange={e => handleInputChange('maxDrawdown', Number(e.target.value))}
              className="bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              disabled={isBtnLoading}
              min="0" max="100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-on-surface-variant font-semibold">Horizon (Months)</label>
            <input 
              type="number" 
              value={inputs.timeHorizon} 
              onChange={e => handleInputChange('timeHorizon', Number(e.target.value))}
              className="bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              disabled={isBtnLoading}
            />
          </div>

          <div className="md:col-span-4 mt-2">
            <button
              type="submit"
              disabled={!isConnected || isBtnLoading}
              className={`w-full py-3 rounded-xl font-bold font-label-md text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                isBtnLoading 
                  ? 'bg-primary/20 text-primary border border-primary/30 cursor-not-allowed animate-pulse'
                  : isConnected
                    ? 'bg-primary text-on-primary hover:bg-primary-fixed scale-95 active:scale-90 shadow-md cursor-pointer'
                    : 'bg-surface-container border border-outline-variant/40 text-on-surface-variant cursor-not-allowed'
              }`}
            >
              {isBtnLoading && (
                <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
              )}
              {isConnected ? getLoadingText() : "Connect Wallet to Run FHE Analytics"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
