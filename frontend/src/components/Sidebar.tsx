import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletState } from '../hooks/useMetaMask.ts';
import { Wallet, Settings, Activity, Cpu } from 'lucide-react';
import { PortfolioHealthGauge } from './PortfolioHealthGauge.tsx';

interface SidebarProps {
  wallet: WalletState;
  connectWallet: () => void;
  disconnectWallet: () => void;
  portfolioData: any;
  fheAnalytics: any;
  loadingStates: any;
  onRunAnalytics: (inputs: any) => Promise<void>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  wallet, connectWallet, disconnectWallet,
  portfolioData, fheAnalytics, loadingStates, onRunAnalytics
}) => {
  const [inputs, setInputs] = useState<Record<string, number | string>>({
    portfolioValue:    125000,
    investmentBudget:  25000,
    riskPreference:    45,
    liquidityPct:      80,
    diversificationPct:75,
    expectedApy:       12,
    maxDrawdown:       15,
    timeHorizon:       24,
  });
  const [showSettings, setShowSettings] = useState(false);

  const isBtnLoading = loadingStates.encrypting || loadingStates.updatingContract || loadingStates.calculatingFhe || loadingStates.requestingDecrypt;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.isConnected) return;
    
    const processedInputs = Object.fromEntries(
      Object.entries(inputs).map(([k, v]) => [k, Number(v) || 0])
    );
    
    onRunAnalytics(processedInputs);
    setShowSettings(false);
  };

  return (
    <aside className="lg:h-full h-auto flex flex-col gap-4 lg:overflow-y-auto overflow-y-visible pr-2 scrollbar-hide pb-10">
      
      {/* Brand & Wallet */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col gap-5 border border-tertiary/20 shadow-[0_0_20px_rgba(0,255,148,0.05)]">
        <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tertiary/20 to-secondary/10 flex items-center justify-center border border-tertiary/30">
            <Cpu className="w-5 h-5 text-tertiary" />
          </div>
          <div>
            <h1 className="font-bold text-on-surface tracking-tight text-lg leading-none">CipherAlpha</h1>
            <span className="text-[10px] text-tertiary font-mono">L2 Intelligence</span>
          </div>
        </div>

        <button
          onClick={wallet.isConnected ? disconnectWallet : connectWallet}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 ${
            wallet.isConnected 
              ? 'bg-surface-variant/30 text-on-surface border border-outline-variant hover:bg-error/10 hover:text-error hover:border-error/30'
              : 'bg-tertiary text-background hover:bg-tertiary-dim glow-tertiary'
          }`}
        >
          <Wallet className="w-4 h-4" />
          {wallet.isConnected ? `${wallet.address?.slice(0, 6)}...${wallet.address?.slice(-4)}` : 'Connect Wallet'}
        </button>
      </div>

      {/* Analytics Snapshot */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" /> Live Snapshot
        </h2>
        
        <div className="flex flex-col gap-3">
          <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/10">
            <p className="text-[10px] text-on-surface-variant mb-1 font-mono">PORTFOLIO VALUATION</p>
            <p className="text-xl font-bold font-mono text-on-surface">
              ${portfolioData?.totalValueUsd ? portfolioData.totalValueUsd.toLocaleString() : '---'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/10">
              <p className="text-[10px] text-on-surface-variant mb-1 font-mono">RISK SCORE</p>
              <p className="text-lg font-bold font-mono text-tertiary flex items-center gap-1">
                {fheAnalytics ? fheAnalytics.riskScore : '--'}<span className="text-[10px] text-on-surface-variant">/100</span>
              </p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/10">
              <p className="text-[10px] text-on-surface-variant mb-1 font-mono">YIELD (APY)</p>
              <p className="text-lg font-bold font-mono text-secondary">
                {fheAnalytics ? `+${fheAnalytics.yieldExposure}%` : '--'}
              </p>
            </div>
          </div>
        </div>

        {/* Health Gauge */}
        {fheAnalytics && (
          <div className="mt-2 border-t border-outline-variant/10 pt-4 flex flex-col items-center">
             <PortfolioHealthGauge score={fheAnalytics.portfolioHealth} size={130} />
          </div>
        )}
      </div>

      {/* Strategy Parameters (Always Visible) */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
          <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
            <Settings className="w-3.5 h-3.5" /> Strategy Parameters
          </h2>
          
          {/* Primary Settings */}
          <div className="flex flex-col gap-4">
            {/* Valuation & Budget (Numbers) */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'portfolioValue', label: 'Valuation ($)' },
                { key: 'investmentBudget', label: 'Budget ($)' },
              ].map(f => (
                <div key={f.key} className="flex flex-col gap-1">
                  <label className="text-[10px] text-on-surface-variant font-mono">{f.label}</label>
                  <input
                    type="number"
                    value={inputs[f.key]}
                    onChange={(e) => setInputs(prev => ({...prev, [f.key]: e.target.value === '' ? '' : Number(e.target.value)}))}
                    disabled={isBtnLoading}
                    className="bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-tertiary transition-colors font-mono w-full"
                  />
                </div>
              ))}
            </div>

            {/* Risk & APY (Sliders) */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-on-surface-variant font-mono">Risk Tolerance</label>
                  <span className="text-xs font-bold text-tertiary">{inputs.riskPreference}</span>
                </div>
                <input
                  type="range"
                  min="1" max="100"
                  value={inputs.riskPreference}
                  onChange={(e) => setInputs(prev => ({...prev, riskPreference: Number(e.target.value)}))}
                  disabled={isBtnLoading}
                  className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-tertiary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-on-surface-variant font-mono">Target APY (%)</label>
                  <span className="text-xs font-bold text-secondary">{inputs.expectedApy}%</span>
                </div>
                <input
                  type="range"
                  min="1" max="100"
                  value={inputs.expectedApy}
                  onChange={(e) => setInputs(prev => ({...prev, expectedApy: Number(e.target.value)}))}
                  disabled={isBtnLoading}
                  className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
                />
              </div>
            </div>
          </div>

          {/* Advanced Settings Toggle */}
          <div className="border-t border-outline-variant/10 pt-3 mt-1">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex justify-between items-center text-xs font-bold text-on-surface-variant hover:text-tertiary transition-colors"
            >
              <span className="font-mono">ADVANCED CONFIG</span>
              <span className="text-[10px]">{showSettings ? '▲' : '▼'}</span>
            </button>
            
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    {[
                      { key: 'liquidityPct', label: 'Liquidity (%)', max: 100 },
                      { key: 'diversificationPct', label: 'Diversification (%)', max: 100 },
                      { key: 'maxDrawdown', label: 'Max Drawdown (%)', max: 100 },
                      { key: 'timeHorizon', label: 'Time (Months)', max: 120 },
                    ].map(f => (
                      <div key={f.key} className="flex flex-col gap-1">
                        <label className="text-[9px] text-on-surface-variant font-mono truncate">{f.label}</label>
                        <input
                          type="number"
                          max={f.max}
                          value={inputs[f.key]}
                          onChange={(e) => setInputs(prev => ({...prev, [f.key]: e.target.value === '' ? '' : Number(e.target.value)}))}
                          disabled={isBtnLoading}
                          className="bg-surface-container-low border border-outline-variant/20 rounded-md px-2 py-1.5 text-xs text-on-surface focus:outline-none focus:border-tertiary transition-colors font-mono w-full"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Big Action Button */}
        <button
          type="submit"
          disabled={!wallet.isConnected || isBtnLoading}
          className="w-full py-4 rounded-xl font-bold font-mono transition-all bg-tertiary text-background hover:bg-tertiary-dim glow-tertiary disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm shadow-[0_0_20px_rgba(0,255,148,0.3)] mt-2"
        >
          {isBtnLoading ? (
            <span className="animate-pulse">COMPUTING [FHE]...</span>
          ) : (
            <>▶ INITIALIZE ZK-ANALYSIS</>
          )}
        </button>
      </form>

    </aside>
  );
};
