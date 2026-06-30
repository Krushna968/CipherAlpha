import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Coins, Activity, ArrowUpRight, Cpu } from 'lucide-react';
import { PortfolioHealthGauge } from './PortfolioHealthGauge.tsx';

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
  isConnected,
}) => {
  const [inputs, setInputs] = useState({
    portfolioValue:    125000,
    investmentBudget:  25000,
    riskPreference:    45,
    liquidityPct:      80,
    diversificationPct:75,
    expectedApy:       12,
    maxDrawdown:       15,
    timeHorizon:       24,
  });

  const handleInputChange = (key: string, value: number) =>
    setInputs(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;
    onRunAnalytics(inputs);
  };

  const getLoadingText = () => {
    if (loadingStates.encrypting)       return 'CoFHE.js Encrypting Inputs…';
    if (loadingStates.updatingContract) return 'Storing Encrypted State on Fhenix…';
    if (loadingStates.calculatingFhe)   return 'Computing Homomorphic Analytics…';
    if (loadingStates.requestingDecrypt)return 'Awaiting CoFHE Decryption…';
    return 'Run FHE Analytics';
  };

  const isBtnLoading =
    loadingStates.encrypting ||
    loadingStates.updatingContract ||
    loadingStates.calculatingFhe ||
    loadingStates.requestingDecrypt;

  // Token colors for the holdings table
  const tokenColors: Record<string, string> = {
    ETH: 'text-[#d2bbff]', WBTC: 'text-[#4edea3]', USDT: 'text-[#adc6ff]', LINK: 'text-[#ffb4ab]',
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* ── Metrics Row ─────────────────────────────────────────────── */}
      <motion.section
        variants={stagger} initial="hidden" animate="visible"
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {/* Total Portfolio */}
        <motion.div variants={fadeUp} className="glass-panel p-4 rounded-xl glow-hover transition-all duration-300">
          <div className="flex justify-between items-start mb-1">
            <span className="text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">Total Portfolio</span>
            <Coins className="text-primary w-5 h-5" />
          </div>
          <div className="font-headline-md text-2xl text-on-surface">
            ${portfolioData?.totalValueUsd
              ? portfolioData.totalValueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })
              : '—'}
          </div>
          <div className="text-tertiary text-[11px] font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {portfolioData ? '+live' : 'Connect wallet'}
          </div>
        </motion.div>

        {/* FHE Risk Score */}
        <motion.div variants={fadeUp} className="glass-panel p-4 rounded-xl glow-hover transition-all duration-300">
          <div className="flex justify-between items-start mb-1">
            <span className="text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">FHE Risk Score</span>
            <Shield className="text-primary w-5 h-5" />
          </div>
          <div className="font-headline-md text-2xl text-on-surface">
            {fheAnalytics ? `${fheAnalytics.riskScore}/100` : 'Shielded'}
          </div>
          <div className="text-on-surface-variant text-[11px] mt-1">
            {fheAnalytics ? 'Fhenix Helium' : 'Zero-Knowledge'}
          </div>
        </motion.div>

        {/* Active Agents */}
        <motion.div variants={fadeUp} className="glass-panel p-4 rounded-xl glow-hover transition-all duration-300">
          <div className="flex justify-between items-start mb-1">
            <span className="text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">Active Agents</span>
            <Cpu className="text-primary w-5 h-5" />
          </div>
          <div className="font-headline-md text-2xl text-on-surface">05</div>
          <div className="text-tertiary text-[11px] mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" /> Multi-Agent Live
          </div>
        </motion.div>

        {/* Portfolio Health — replaced with Gauge when analytics present */}
        <motion.div variants={fadeUp} className="glass-panel p-4 rounded-xl glow-hover transition-all duration-300 flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <span className="text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">Portfolio Health</span>
            <Activity className="text-primary w-5 h-5" />
          </div>
          {fheAnalytics ? (
            <div className="flex justify-center mt-1">
              <PortfolioHealthGauge score={fheAnalytics.portfolioHealth} size={100} />
            </div>
          ) : (
            <>
              <div className="font-headline-md text-2xl text-on-surface">—</div>
              <div className="text-on-surface-variant text-[11px] mt-1">Run analytics</div>
            </>
          )}
        </motion.div>

        {/* Yield Exposure */}
        <motion.div variants={fadeUp} className="glass-panel p-4 rounded-xl glow-hover transition-all duration-300 col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-1">
            <span className="text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">Yield Exposure</span>
            <Shield className="text-primary w-5 h-5" />
          </div>
          <div className="font-headline-md text-2xl text-on-surface">
            {fheAnalytics ? `${fheAnalytics.yieldExposure}%` : '—'}
          </div>
          <div className="text-on-surface-variant text-[11px] mt-1">
            {fheAnalytics ? 'APY via CoFHE' : 'Submit analytics'}
          </div>
        </motion.div>
      </motion.section>

      {/* ── Current Holdings Table (only when connected) ─────────── */}
      {portfolioData?.tokens && portfolioData.tokens.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-panel p-5 rounded-2xl border border-outline-variant/30"
        >
          <h3 className="font-headline-md text-base text-on-surface font-bold mb-3">Current Holdings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-on-surface-variant border-b border-outline-variant/20">
                  <th className="text-left pb-2 font-semibold uppercase tracking-wider text-[10px]">Token</th>
                  <th className="text-right pb-2 font-semibold uppercase tracking-wider text-[10px]">Balance</th>
                  <th className="text-right pb-2 font-semibold uppercase tracking-wider text-[10px]">Price</th>
                  <th className="text-right pb-2 font-semibold uppercase tracking-wider text-[10px]">Value</th>
                  <th className="text-right pb-2 font-semibold uppercase tracking-wider text-[10px]">Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {portfolioData.tokens.map((token: any) => (
                  <tr key={token.symbol} className="hover:bg-surface-container/30 transition-colors">
                    <td className="py-2 flex items-center gap-2">
                      <span className={`font-bold ${tokenColors[token.symbol] || 'text-on-surface'}`}>{token.symbol}</span>
                      <span className="text-on-surface-variant">{token.name}</span>
                    </td>
                    <td className="py-2 text-right text-on-surface">{token.balance}</td>
                    <td className="py-2 text-right text-on-surface">${token.priceUsd.toLocaleString()}</td>
                    <td className="py-2 text-right font-semibold text-on-surface">
                      ${token.valueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-12 bg-surface-container h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${Math.min(token.allocationPct, 100)}%` }}
                          />
                        </div>
                        <span className="text-on-surface-variant">{token.allocationPct.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      )}

      {/* ── FHE Configuration Form ────────────────────────────────── */}
      <section className="glass-panel p-6 rounded-2xl flex flex-col gap-5 border border-outline-variant/30">
        <div>
          <h3 className="font-headline-md text-xl text-primary font-bold">Confidential Portfolio Settings</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            All values are encrypted locally on your browser via CoFHE.js — only ciphertext reaches Fhenix Helium.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { key: 'portfolioValue',    label: 'Portfolio Value ($)',    min: 0,   max: undefined },
            { key: 'investmentBudget',  label: 'Investment Budget ($)',  min: 0,   max: undefined },
            { key: 'riskPreference',    label: 'Risk Preference (1–100)',min: 1,   max: 100 },
            { key: 'expectedApy',       label: 'Expected APY (%)',       min: 0,   max: 100 },
            { key: 'liquidityPct',      label: 'Liquidity %',            min: 0,   max: 100 },
            { key: 'diversificationPct',label: 'Diversification %',      min: 0,   max: 100 },
            { key: 'maxDrawdown',       label: 'Max Drawdown (%)',        min: 0,   max: 100 },
            { key: 'timeHorizon',       label: 'Time Horizon (Months)',   min: 1,   max: 120 },
          ].map(field => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label className="text-xs text-on-surface-variant font-semibold">{field.label}</label>
              <input
                type="number"
                value={inputs[field.key as keyof typeof inputs]}
                onChange={e => handleInputChange(field.key, Number(e.target.value))}
                min={field.min}
                max={field.max}
                disabled={isBtnLoading}
                className="bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              />
            </div>
          ))}

          <div className="md:col-span-4 mt-2">
            <button
              type="submit"
              disabled={!isConnected || isBtnLoading}
              className={`w-full py-3.5 rounded-xl font-bold font-label-md text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                isBtnLoading
                  ? 'bg-primary/20 text-primary border border-primary/30 cursor-not-allowed animate-pulse'
                  : isConnected
                    ? 'bg-primary text-on-primary hover:bg-primary-fixed scale-95 active:scale-90 shadow-lg cursor-pointer'
                    : 'bg-surface-container border border-outline-variant/40 text-on-surface-variant cursor-not-allowed'
              }`}
            >
              {isBtnLoading && (
                <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
              )}
              {isConnected ? getLoadingText() : 'Connect Wallet to Run FHE Analytics'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
