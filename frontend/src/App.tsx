import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMetaMask } from './hooks/useMetaMask.ts';
import { ToastProvider, useToast } from './components/Toast.tsx';
import { GlobalLoaderProvider, useGlobalLoader } from './components/GlobalLoader.tsx';
import { ChatWindow } from './components/ChatWindow.tsx';
import { AgentPanel } from './components/AgentPanel.tsx';
import { Recommendation } from './components/Recommendation.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { Documentation } from './components/Documentation.tsx';
import { PortfolioHealthGauge } from './components/PortfolioHealthGauge.tsx';
import {
  Cpu, Wallet, Settings, Activity, Shield,
  BarChart2, ChevronDown, ChevronUp, Zap, Lock, LogOut,
  ArrowUpRight, ArrowDownRight, Globe, Layers, Bell
} from 'lucide-react';

// ─── Sparkline ──────────────────────────────────────────
const Sparkline: React.FC<{ up: boolean; width?: number }> = ({ up, width = 52 }) => (
  <svg width={width} height="22" viewBox={`0 0 ${width} 22`} fill="none">
    {up
      ? <polyline points={`0,20 ${width*0.17},15 ${width*0.33},16 ${width*0.5},10 ${width*0.67},7 ${width*0.83},4 ${width},2`}
          stroke="#00f0c8" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      : <polyline points={`0,2 ${width*0.17},5 ${width*0.33},4 ${width*0.5},10 ${width*0.67},13 ${width*0.83},16 ${width},20`}
          stroke="#ef4444" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    }
  </svg>
);

const TICKERS = [
  { sym: 'BTC', price: '$96,420', chg: '+2.31%', up: true },
  { sym: 'ETH', price: '$3,491', chg: '+1.57%', up: true },
  { sym: 'SOL', price: '$182.4', chg: '-0.83%', up: false },
  { sym: 'LINK', price: '$14.2', chg: '+4.19%', up: true },
  { sym: 'Total', price: '$2,490,765', chg: '+4.38%', up: true },
];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
  { id: 'markets',   label: 'Markets',   icon: Globe },
  { id: 'trade',     label: 'Trade',     icon: Zap },
  { id: 'portfolio', label: 'Portfolio', icon: Layers },
  { id: 'analytics', label: 'Analytics', icon: Activity },
  { id: 'settings',  label: 'Settings',  icon: Settings },
];

// ─── Dummy Pages ─────────────────────────────────────────

const MarketsPage: React.FC = () => {
  const pairs = [
    { pair: 'BTC/USDT', price: '$96,420.11', chg: '+2.31%', vol: '$4.2B', high: '$97,100', low: '$93,800', up: true },
    { pair: 'ETH/USDT', price: '$3,491.55', chg: '+1.57%', vol: '$1.8B', high: '$3,540', low: '$3,380', up: true },
    { pair: 'SOL/USDT', price: '$182.40', chg: '-0.83%', vol: '$890M', high: '$188', low: '$178', up: false },
    { pair: 'LINK/USDT', price: '$14.20', chg: '+4.19%', vol: '$320M', high: '$14.8', low: '$13.4', up: true },
    { pair: 'ARB/USDT', price: '$1.08', chg: '-1.22%', vol: '$210M', high: '$1.12', low: '$1.04', up: false },
    { pair: 'OP/USDT', price: '$2.41', chg: '+3.40%', vol: '$180M', high: '$2.5', low: '$2.28', up: true },
    { pair: 'AVAX/USDT', price: '$38.90', chg: '+0.92%', vol: '$560M', high: '$40.1', low: '$37.5', up: true },
    { pair: 'MATIC/USDT', price: '$0.71', chg: '-2.10%', vol: '$420M', high: '$0.74', low: '$0.69', up: false },
  ];
  return (
    <div style={{ padding: 20, height: '100%', overflow: 'auto' }}>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Live Markets</h2>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>Real-time encrypted price feed via CoFHE oracle</p>
        </div>
        <span className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', fontSize: 11 }}>
          <div className="pulse-dot" style={{ width: 5, height: 5 }} /> LIVE
        </span>
      </div>
      <div className="glass" style={{ borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Pair', 'Price', '24h Change', 'Volume', '24h High', '24h Low', 'Chart'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono', letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pairs.map(r => (
              <tr key={r.pair} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 13 }}>{r.pair}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono', fontSize: 13 }}>{r.price}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ color: r.up ? 'var(--cyan)' : '#ef4444', fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {r.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{r.chg}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-secondary)' }}>{r.vol}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--cyan)' }}>{r.high}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono', fontSize: 12, color: '#ef4444' }}>{r.low}</td>
                <td style={{ padding: '12px 16px' }}><Sparkline up={r.up} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TradePage: React.FC = () => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('96420');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const orderBook = {
    asks: [
      ['$96,650', '0.42', '#ef444430'], ['$96,580', '1.12', '#ef444420'],
      ['$96,510', '0.87', '#ef444418'], ['$96,470', '2.30', '#ef444410'], ['$96,430', '0.65', '#ef44440a'],
    ],
    bids: [
      ['$96,380', '1.85', '#00f0c80a'], ['$96,340', '0.94', '#00f0c810'],
      ['$96,290', '3.10', '#00f0c818'], ['$96,240', '0.58', '#00f0c820'], ['$96,180', '2.22', '#00f0c830'],
    ],
  };
  return (
    <div style={{ padding: 20, height: '100%', overflow: 'auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
      {/* Order Book */}
      <div className="glass" style={{ borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono', letterSpacing: 1, marginBottom: 14, textTransform: 'uppercase' }}>Order Book · BTC/USDT</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginBottom: 6 }}>
          {['Price (USDT)', 'Amount (BTC)', 'Background'].map(h => (
            <span key={h} style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono' }}>{h === 'Background' ? '' : h}</span>
          ))}
        </div>
        {orderBook.asks.reverse().map(([p,a,bg], i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '4px 0', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: bg, right: 0, left: 'auto', width: `${20 + i*15}%` }} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#ef4444', position: 'relative' }}>{p}</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-secondary)', position: 'relative', textAlign: 'right' }}>{a}</span>
          </div>
        ))}
        <div style={{ textAlign: 'center', padding: '8px 0', fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 700, color: 'var(--cyan)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', margin: '6px 0' }}>
          $96,420.11 <span style={{ fontSize: 11, color: 'var(--cyan)' }}>▲</span>
        </div>
        {orderBook.bids.map(([p,a,bg], i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '4px 0', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: bg, right: 0, left: 'auto', width: `${20 + i*15}%` }} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--cyan)', position: 'relative' }}>{p}</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-secondary)', position: 'relative', textAlign: 'right' }}>{a}</span>
          </div>
        ))}
      </div>
      {/* Trade Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="glass" style={{ borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
            {(['buy','sell'] as const).map(s => (
              <button key={s} onClick={() => setSide(s)} style={{
                flex: 1, padding: '10px', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                background: side === s ? (s === 'buy' ? 'var(--cyan)' : '#ef4444') : 'transparent',
                color: side === s ? '#050505' : 'var(--text-secondary)',
                transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: 1,
                fontFamily: 'JetBrains Mono'
              }}>{s}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
            {(['limit','market'] as const).map(t => (
              <button key={t} onClick={() => setOrderType(t)} style={{
                flex: 1, padding: '7px', fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: orderType === t ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: orderType === t ? 'var(--text-primary)' : 'var(--text-dim)',
                fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: 1
              }}>{t}</button>
            ))}
          </div>
          {orderType === 'limit' && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono', display: 'block', marginBottom: 4 }}>PRICE (USDT)</label>
              <input className="input-dark" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono', display: 'block', marginBottom: 4 }}>AMOUNT (BTC)</label>
            <input className="input-dark" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
            {['25%','50%','75%','100%'].map(p => (
              <button key={p} style={{ padding: '6px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', fontFamily: 'JetBrains Mono' }}>{p}</button>
            ))}
          </div>
          <div style={{ marginBottom: 12, padding: 10, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono' }}>Total</span>
              <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--text-primary)', fontWeight: 700 }}>
                ${amount ? (parseFloat(amount) * parseFloat(price.replace(/[$,]/g,''))).toLocaleString() : '0.00'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono' }}>Fee (0.1%)</span>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>~$0.00</span>
            </div>
          </div>
          <button style={{
            width: '100%', padding: '12px', borderRadius: 10, fontFamily: 'JetBrains Mono', fontWeight: 700,
            fontSize: 13, border: 'none', cursor: 'pointer', letterSpacing: 1,
            background: side === 'buy' ? 'linear-gradient(135deg, var(--cyan), #0ea5e9)' : 'linear-gradient(135deg, #ef4444, #f97316)',
            color: '#050505', boxShadow: side === 'buy' ? '0 0 20px rgba(0,240,200,0.3)' : '0 0 20px rgba(239,68,68,0.3)'
          }}>
            {side === 'buy' ? '▲ BUY BTC' : '▼ SELL BTC'}
          </button>
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>My Balance</div>
          {[{ token: 'USDT', bal: '12,450.00', color: '#22c55e' }, { token: 'BTC', bal: '0.3421', color: '#f59e0b' }, { token: 'ETH', bal: '4.820', color: '#8b5cf6' }].map(b => (
            <div key={b.token} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{b.token}</span>
              <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono', fontWeight: 600, color: b.color }}>{b.bal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PortfolioPage: React.FC<{ fheAnalytics: any; portfolioData: any }> = ({ fheAnalytics, portfolioData }) => {
  const allocations = [
    { token: 'BTC', alloc: 42, value: '$52,500', chg: '+2.3%', up: true, color: '#f59e0b' },
    { token: 'ETH', alloc: 28, value: '$35,000', chg: '+1.6%', up: true, color: '#8b5cf6' },
    { token: 'SOL', alloc: 15, value: '$18,750', chg: '-0.8%', up: false, color: '#0ea5e9' },
    { token: 'LINK', alloc: 10, value: '$12,500', chg: '+4.2%', up: true, color: '#22c55e' },
    { token: 'OTHER', alloc: 5, value: '$6,250', chg: '+0.5%', up: true, color: '#6b7280' },
  ];
  return (
    <div style={{ padding: 20, height: '100%', overflow: 'auto' }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>My Portfolio</h2>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>FHE-encrypted holdings · privacy-preserving analytics</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total Value', val: portfolioData?.totalValueUsd ? `$${portfolioData.totalValueUsd.toLocaleString()}` : '$125,000', color: 'var(--cyan)' },
          { label: 'Portfolio Health', val: fheAnalytics ? `${fheAnalytics.portfolioHealth}/100` : '78/100', color: '#22c55e' },
          { label: 'Risk Score', val: fheAnalytics ? `${fheAnalytics.riskScore}/100` : '45/100', color: '#f59e0b' },
          { label: 'Yield APY', val: fheAnalytics ? `+${fheAnalytics.yieldExposure}%` : '+12%', color: '#0ea5e9' },
        ].map(s => (
          <div key={s.label} className="glass" style={{ borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: 'JetBrains Mono' }}>{s.val}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="glass" style={{ borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono', letterSpacing: 1, marginBottom: 14, textTransform: 'uppercase' }}>Holdings Breakdown</div>
          {allocations.map(a => (
            <div key={a.token} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{a.token}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: 'var(--text-primary)' }}>{a.value}</div>
                  <div style={{ fontSize: 10, color: a.up ? 'var(--cyan)' : '#ef4444', fontFamily: 'JetBrains Mono' }}>{a.chg}</div>
                </div>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: a.color, width: `${a.alloc}%`, borderRadius: 2, boxShadow: `0 0 8px ${a.color}60` }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2, fontFamily: 'JetBrains Mono', textAlign: 'right' }}>{a.alloc}%</div>
            </div>
          ))}
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono', letterSpacing: 1, marginBottom: 14, textTransform: 'uppercase' }}>Recent Transactions</div>
          {[
            { type: 'BUY', token: 'ETH', amount: '+0.5', val: '$1,745', time: '2h ago', color: 'var(--cyan)' },
            { type: 'SELL', token: 'SOL', amount: '-5.0', val: '$912', time: '8h ago', color: '#ef4444' },
            { type: 'BUY', token: 'BTC', amount: '+0.01', val: '$964', time: '1d ago', color: 'var(--cyan)' },
            { type: 'STAKE', token: 'LINK', amount: '+100', val: '$1,420', time: '2d ago', color: '#8b5cf6' },
            { type: 'SELL', token: 'ARB', amount: '-500', val: '$540', time: '3d ago', color: '#ef4444' },
          ].map((tx, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: `${tx.color}15`, color: tx.color, border: `1px solid ${tx.color}30` }}>{tx.type}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{tx.token}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: tx.color }}>{tx.amount} ETH</div>
                <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono' }}>{tx.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnalyticsPage: React.FC<{ fheAnalytics: any }> = ({ fheAnalytics }) => {
  const metrics = [
    { label: 'Risk Score', val: fheAnalytics?.riskScore ?? 45, max: 100, color: '#ef4444' },
    { label: 'Diversification', val: fheAnalytics?.diversificationScore ?? 75, max: 100, color: '#8b5cf6' },
    { label: 'Liquidity Score', val: fheAnalytics?.liquidityScore ?? 80, max: 100, color: '#0ea5e9' },
    { label: 'Portfolio Health', val: fheAnalytics?.portfolioHealth ?? 78, max: 100, color: '#22c55e' },
  ];
  return (
    <div style={{ padding: 20, height: '100%', overflow: 'auto' }}>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>ZK Analytics Dashboard</h2>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>Homomorphic computation results · CoFHE MPC decrypted</p>
        </div>
        {fheAnalytics && <span className="badge badge-cyan" style={{ padding: '5px 12px', fontSize: 11 }}>FHE COMPUTED</span>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {metrics.map(m => (
          <div key={m.label} className="glass" style={{ borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: 1 }}>{m.label}</span>
              <span style={{ fontSize: 28, fontWeight: 800, color: m.color, fontFamily: 'JetBrains Mono' }}>{m.val}</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${(m.val / m.max) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', background: m.color, borderRadius: 4, boxShadow: `0 0 12px ${m.color}60` }}
              />
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono' }}>{m.val} / {m.max} · {((m.val/m.max)*100).toFixed(0)}th percentile</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="glass" style={{ borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono', letterSpacing: 1, marginBottom: 14, textTransform: 'uppercase' }}>Yield Curve Simulation</div>
          <svg width="100%" height="100" viewBox="0 0 300 100" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,80 C30,75 60,60 90,50 S150,30 180,25 S240,15 300,10" stroke="var(--cyan)" strokeWidth="2" fill="none" />
            <path d="M0,80 C30,75 60,60 90,50 S150,30 180,25 S240,15 300,10 L300,100 L0,100 Z" fill="url(#yieldGrad)" />
            {[0,60,120,180,240,300].map((x,i) => (
              <text key={x} x={x} y={95} style={{ fill: 'var(--text-dim)', fontSize: 8, fontFamily: 'JetBrains Mono' }}>{['0','6','12','18','24','30'][i]}mo</text>
            ))}
          </svg>
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono', letterSpacing: 1, marginBottom: 14, textTransform: 'uppercase' }}>Strategy Recommendations</div>
          {[
            { action: 'REBALANCE', desc: 'Reduce BTC exposure by 8%', urgency: 'HIGH', color: '#ef4444' },
            { action: 'STAKE', desc: 'Stake 30% ETH for +6% APY', urgency: 'MED', color: '#f59e0b' },
            { action: 'HEDGE', desc: 'Add SOL put options', urgency: 'LOW', color: '#22c55e' },
          ].map(r => (
            <div key={r.action} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono', padding: '2px 6px', borderRadius: 4, background: `${r.color}15`, color: r.color, border: `1px solid ${r.color}30`, fontWeight: 700 }}>{r.action}</span>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{r.desc}</span>
              </div>
              <span style={{ fontSize: 9, color: r.color, fontFamily: 'JetBrains Mono' }}>{r.urgency}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const [rpcUrl, setRpcUrl] = useState('https://rpc.fhenix.zone');
  const [notifications, setNotifications] = useState(true);
  const [autoRebalance, setAutoRebalance] = useState(false);
  const [slippage, setSlippage] = useState('0.5');
  return (
    <div style={{ padding: 20, height: '100%', overflow: 'auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Settings</h2>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>Configure your CipherAlpha FHE environment</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="glass" style={{ borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--cyan)', fontFamily: 'JetBrains Mono', letterSpacing: 1, marginBottom: 16, textTransform: 'uppercase', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>Network Configuration</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Fhenix RPC URL</label>
              <input className="input-dark" value={rpcUrl} onChange={e => setRpcUrl(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Max Slippage (%)</label>
              <input className="input-dark" value={slippage} onChange={e => setSlippage(e.target.value)} />
            </div>
            {[
              { label: 'Push Notifications', val: notifications, set: setNotifications },
              { label: 'Auto Rebalance', val: autoRebalance, set: setAutoRebalance },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.label}</span>
                <div onClick={() => s.set(!s.val)} style={{
                  width: 40, height: 22, borderRadius: 11, cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                  background: s.val ? 'var(--cyan)' : 'rgba(255,255,255,0.1)',
                }}>
                  <div style={{
                    position: 'absolute', top: 3, transition: 'left 0.2s',
                    left: s.val ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: s.val ? '#050505' : '#94a3b8'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 11, color: '#0ea5e9', fontFamily: 'JetBrains Mono', letterSpacing: 1, marginBottom: 16, textTransform: 'uppercase', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>FHE Security</div>
          {[
            { label: 'ZK Proof Level', val: 'Maximum (128-bit)', color: 'var(--cyan)' },
            { label: 'Encryption Scheme', val: 'TFHE-rs v0.8', color: '#8b5cf6' },
            { label: 'Key Size', val: '2048-bit', color: '#f59e0b' },
            { label: 'Security Zone', val: 'Zone 0 (Default)', color: '#0ea5e9' },
            { label: 'Oracle Mode', val: 'CoFHE MPC Threshold', color: 'var(--cyan)' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.label}</span>
              <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: s.color, fontWeight: 600 }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────
const AppInner: React.FC = () => {
  const {
    wallet, loadingStates, portfolioData, fheAnalytics, agentResult, errorMsg,
    connectWallet, disconnectWallet, executeZKAnalytics, refreshDashboard,
  } = useMetaMask();

  const { showToast } = useToast();
  const { triggerLoader } = useGlobalLoader();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [pipelineExecuted, setPipelineExecuted] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [inputs, setInputs] = useState({
    portfolioValue: 125000, investmentBudget: 25000, riskPreference: 45,
    liquidityPct: 80, diversificationPct: 75, expectedApy: 12, maxDrawdown: 15, timeHorizon: 24,
  });

  const isBtnLoading = loadingStates.encrypting || loadingStates.updatingContract || loadingStates.calculatingFhe || loadingStates.requestingDecrypt;

  const getPipelineStep = (): number => {
    if (pipelineExecuted) return 5;
    if (agentResult) return 4;
    if (loadingStates.runningAgents) return 3;
    if (loadingStates.updatingContract || loadingStates.calculatingFhe || loadingStates.requestingDecrypt) return 2;
    if (loadingStates.encrypting) return 1;
    return 0;
  };

  const getBtnText = () => {
    if (loadingStates.encrypting) return '⟳  ZK-ENCRYPTING...';
    if (loadingStates.updatingContract) return '⟳  SUBMITTING TO FHE...';
    if (loadingStates.calculatingFhe) return '⟳  COMPUTING ANALYTICS...';
    if (loadingStates.requestingDecrypt) return '⟳  AWAITING DECRYPTION...';
    return '▶  INITIALIZE ZK-ANALYSIS';
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!wallet.isConnected) return; executeZKAnalytics(inputs); };
  const handleConnect = () => triggerLoader(async () => { await connectWallet(); }, 'ESTABLISHING SECURE CONNECTION...');

  useEffect(() => { if (errorMsg) showToast('error', errorMsg, 'SYSTEM ERROR'); }, [errorMsg]);
  useEffect(() => { if (agentResult?.selected) showToast('success', `Agent [${agentResult.selected.agentName}] selected.`, 'ARBITRATION COMPLETE'); }, [agentResult]);
  useEffect(() => { if (pipelineExecuted) showToast('success', 'Strategy verified on Fhenix L2.', 'EXECUTION CONFIRMED'); }, [pipelineExecuted]);
  useEffect(() => { if (loadingStates.encrypting) setPipelineExecuted(false); }, [loadingStates.encrypting]);

  const renderMainContent = () => {
    if (activeNav === 'markets')   return <MarketsPage />;
    if (activeNav === 'trade')     return <TradePage />;
    if (activeNav === 'portfolio') return <PortfolioPage fheAnalytics={fheAnalytics} portfolioData={portfolioData} />;
    if (activeNav === 'analytics') return <AnalyticsPage fheAnalytics={fheAnalytics} />;
    if (activeNav === 'settings')  return <SettingsPage />;

    // Dashboard
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '12px 14px', gap: 10 }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, flexShrink: 0 }}>
          {[
            { label: 'Portfolio Value', val: portfolioData?.totalValueUsd ? `$${portfolioData.totalValueUsd.toLocaleString()}` : '$125,000', sub: '▲ Live', color: 'var(--cyan)' },
            { label: 'FHE Risk Score', val: fheAnalytics ? `${fheAnalytics.riskScore}/100` : '—', sub: fheAnalytics ? 'Fhenix Helium' : 'Zero-Knowledge', color: '#0ea5e9' },
            { label: 'Yield Exposure', val: fheAnalytics ? `+${fheAnalytics.yieldExposure}%` : '—', sub: 'CoFHE MPC', color: '#22c55e' },
            { label: 'Active Agents', val: '05', sub: '▲ Multi-Agent Live', color: '#8b5cf6' },
          ].map(s => (
            <div key={s.label} className="glass" style={{ borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{s.val}</div>
              <div style={{ fontSize: 10, color: s.color, fontWeight: 600 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Chat + health panel */}
        <div style={{ flex: 1, display: 'flex', gap: 10, overflow: 'hidden', minHeight: 0 }}>
          {/* Chat — smaller now */}
          <div style={{
            flex: 1, overflow: 'hidden', borderRadius: 10, position: 'relative',
            background: 'rgba(13,17,23,0.6)', border: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', minWidth: 0
          }}>
            {loadingStates.runningAgents && <div className="scan-line" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />}
            <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {!wallet.isConnected ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(0,240,200,0.06)', border: '1px solid rgba(0,240,200,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={24} color="var(--cyan)" />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>
                      Encrypted{' '}
                      <span style={{ background: 'linear-gradient(90deg, var(--cyan), #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DeFi Intelligence</span>
                    </h2>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', lineHeight: 1.6, maxWidth: 300 }}>
                      Connect wallet to initialize CoFHE.js secure enclave. ZK proofs + LangGraph agents analyze your portfolio homomorphically.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '4px 10px' }}><Lock size={9} /> FHE Secured</span>
                    <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '4px 10px' }}><Zap size={9} /> Multi-Agent</span>
                  </div>
                  <button onClick={handleConnect} className="btn-zk" style={{ maxWidth: 200, fontSize: 12, padding: '10px 20px' }}>Connect Wallet</button>
                </motion.div>
              ) : (
                <ChatWindow fheAnalytics={fheAnalytics} walletAddress={wallet.address} />
              )}
            </div>
          </div>

          {/* Health + network status panel — only when analytics ready */}
          {fheAnalytics && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              style={{ width: 170, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="glass" style={{ borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono', color: 'var(--text-dim)', letterSpacing: 1, textTransform: 'uppercase' }}>Portfolio Health</span>
                <PortfolioHealthGauge score={fheAnalytics.portfolioHealth} size={120} />
              </div>
              <div className="glass" style={{ borderRadius: 10, padding: 12, flex: 1 }}>
                <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono', color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>Network</div>
                {[
                  { label: 'Fhenix L2', status: 'ONLINE', color: '#22c55e' },
                  { label: 'CoFHE MPC', status: 'ACTIVE', color: 'var(--cyan)' },
                  { label: 'ZK Oracle', status: 'SYNCED', color: '#0ea5e9' },
                ].map(n => (
                  <div key={n.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{n.label}</span>
                    <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono', color: n.color, padding: '2px 6px', background: `${n.color}10`, borderRadius: 4 }}>{n.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-deep)', overflow: 'hidden' }}>

      {/* TOP BAR */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: 48, background: 'rgba(13,17,23,0.98)',
        borderBottom: '1px solid var(--border)', flexShrink: 0, zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg, var(--cyan), #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={13} color="#050505" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: -0.3 }}>CipherAlpha</span>
          <span style={{ fontSize: 8, fontFamily: 'JetBrains Mono', color: 'var(--cyan)', padding: '2px 5px', background: 'rgba(0,240,200,0.08)', borderRadius: 4, border: '1px solid rgba(0,240,200,0.2)' }}>FHE</span>
        </div>

        {/* Tickers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1, justifyContent: 'center' }}>
          {TICKERS.map(t => (
            <div key={t.sym} style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)' }}>{t.sym}</span>
              <Sparkline up={t.up} width={40} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono', lineHeight: 1.1 }}>{t.price}</div>
                <div style={{ fontSize: 9, color: t.up ? 'var(--cyan)' : '#ef4444', fontFamily: 'JetBrains Mono' }}>{t.chg}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Wallet */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180, justifyContent: 'flex-end' }}>
          <Bell size={14} color="var(--text-dim)" style={{ cursor: 'pointer' }} />
          {wallet.isConnected ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,240,200,0.06)', border: '1px solid rgba(0,240,200,0.2)', borderRadius: 7, padding: '4px 10px' }}>
                <div className="pulse-dot" style={{ width: 5, height: 5 }} />
                <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: 'var(--cyan)' }}>{wallet.address?.slice(0,6)}...{wallet.address?.slice(-4)}</span>
              </div>
              <button onClick={disconnectWallet} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 7, padding: '4px 8px', cursor: 'pointer', color: '#ef4444', fontSize: 10, display: 'flex', alignItems: 'center', gap: 3 }}>
                <LogOut size={11} />
              </button>
            </>
          ) : (
            <button onClick={handleConnect} style={{ background: 'linear-gradient(135deg, var(--cyan), #0ea5e9)', border: 'none', borderRadius: 7, padding: '6px 14px', cursor: 'pointer', color: '#050505', fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, boxShadow: '0 0 16px rgba(0,240,200,0.3)' }}>
              <Wallet size={12} /> Connect Wallet
            </button>
          )}
        </div>
      </header>

      {/* BODY */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT SIDEBAR */}
        <aside style={{ width: 220, flexShrink: 0, background: 'rgba(13,17,23,0.85)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Nav */}
          <nav style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)' }}>
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id} className={`nav-item ${activeNav === item.id ? 'active' : ''}`} onClick={() => setActiveNav(item.id)}>
                  <Icon size={14} />
                  <span style={{ fontSize: 12 }}>{item.label}</span>
                  {item.id === 'analytics' && fheAnalytics && <span className="badge badge-cyan" style={{ marginLeft: 'auto', fontSize: 8, padding: '1px 5px' }}>LIVE</span>}
                </div>
              );
            })}
          </nav>

          {/* ZK Form — only on dashboard */}
          {activeNav === 'dashboard' && (
            <form onSubmit={handleSubmit} style={{ flex: 1, overflow: 'auto', padding: '10px 10px 8px' }}>
              <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono', color: 'var(--text-dim)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>⬡ ZK PARAMETERS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[{ key: 'portfolioValue', label: 'Valuation ($)' }, { key: 'investmentBudget', label: 'Budget ($)' }].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono', display: 'block', marginBottom: 3 }}>{f.label}</label>
                    <input type="number" className="input-dark" value={inputs[f.key as keyof typeof inputs]}
                      onChange={e => setInputs(p => ({ ...p, [f.key]: Number(e.target.value) || 0 }))} disabled={isBtnLoading} />
                  </div>
                ))}
                {[
                  { key: 'riskPreference', label: 'Risk Tolerance', color: 'var(--cyan)' },
                  { key: 'expectedApy', label: 'Target APY (%)', color: '#0ea5e9' },
                ].map(f => (
                  <div key={f.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <label style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono' }}>{f.label}</label>
                      <span style={{ fontSize: 9, color: f.color, fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{inputs[f.key as keyof typeof inputs]}</span>
                    </div>
                    <input type="range" min={1} max={100} value={inputs[f.key as keyof typeof inputs]}
                      onChange={e => setInputs(p => ({ ...p, [f.key]: Number(e.target.value) }))} disabled={isBtnLoading} style={{ accentColor: f.color }} />
                  </div>
                ))}
                <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 10, width: '100%', fontFamily: 'JetBrains Mono' }}>
                  <span>ADVANCED</span>
                  {showAdvanced ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                </button>
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        {[
                          { key: 'liquidityPct', label: 'Liquidity %', max: 100 },
                          { key: 'diversificationPct', label: 'Diversif. %', max: 100 },
                          { key: 'maxDrawdown', label: 'Max Draw %', max: 100 },
                          { key: 'timeHorizon', label: 'Time (mo)', max: 120 },
                        ].map(f => (
                          <div key={f.key}>
                            <label style={{ fontSize: 8, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono', display: 'block', marginBottom: 2 }}>{f.label}</label>
                            <input type="number" max={f.max} className="input-dark" value={inputs[f.key as keyof typeof inputs]}
                              onChange={e => setInputs(p => ({ ...p, [f.key]: Number(e.target.value) || 0 }))} disabled={isBtnLoading} style={{ padding: '5px 8px' }} />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Analytics preview */}
              {fheAnalytics && (
                <div style={{ marginTop: 10, padding: 8, background: 'rgba(0,240,200,0.04)', borderRadius: 7, border: '1px solid rgba(0,240,200,0.1)' }}>
                  <div style={{ fontSize: 8, color: 'var(--cyan)', fontFamily: 'JetBrains Mono', marginBottom: 6, letterSpacing: 1 }}>ZK RESULT</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                    {[
                      { label: 'Risk', value: `${fheAnalytics.riskScore}`, color: 'var(--cyan)' },
                      { label: 'APY', value: `+${fheAnalytics.yieldExposure}%`, color: '#0ea5e9' },
                      { label: 'Liq', value: `${fheAnalytics.liquidityScore}%`, color: '#22c55e' },
                      { label: 'Div', value: `${fheAnalytics.diversificationScore}%`, color: '#8b5cf6' },
                    ].map(m => (
                      <div key={m.label} style={{ textAlign: 'center', padding: '4px', background: 'rgba(0,0,0,0.2)', borderRadius: 5 }}>
                        <div style={{ fontSize: 8, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono' }}>{m.label}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: m.color, fontFamily: 'JetBrains Mono' }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 10 }}>
                <button type="submit" disabled={!wallet.isConnected || isBtnLoading} className={`btn-zk ${isBtnLoading ? 'loading' : ''}`} style={{ fontSize: 11, padding: '10px 12px' }}>
                  {getBtnText()}
                </button>
              </div>
              <div style={{ marginTop: 6, display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <span className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 8 }}><Lock size={8} />FHE</span>
                <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 8 }}><Shield size={8} />ZK</span>
              </div>
            </form>
          )}

          {/* Placeholder content for non-dashboard views */}
          {activeNav !== 'dashboard' && (
            <div style={{ padding: '12px 10px', flex: 1 }}>
              <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono', color: 'var(--text-dim)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>QUICK ACCESS</div>
              {['FHE Dashboard', 'ZK Reports', 'Agent Logs', 'Tx History'].map(l => (
                <div key={l} onClick={() => setActiveNav('dashboard')} style={{ padding: '7px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2, transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {l}
                </div>
              ))}
            </div>
          )}

          {/* User strip */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 700, color: '#fff' }}>
              {wallet.address ? wallet.address.slice(2,4).toUpperCase() : 'CA'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {wallet.isConnected ? `${wallet.address?.slice(0,8)}...` : 'Not Connected'}
              </div>
              <div style={{ fontSize: 8, color: 'var(--cyan)', fontFamily: 'JetBrains Mono' }}>PREMIUM</div>
            </div>
          </div>
        </aside>

        {/* CENTER MAIN */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          <div className="chart-grid" style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.25 }} />
          <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', overflow: activeNav !== 'dashboard' ? 'auto' : 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeNav} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: activeNav !== 'dashboard' ? 'visible' : 'hidden' }}>
                {renderMainContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT PANEL — bigger now */}
        <aside style={{ width: 300, flexShrink: 0, background: 'rgba(13,17,23,0.85)', borderLeft: '1px solid var(--border)', overflow: 'auto', padding: '12px 12px 60px' }}>
          <AgentPanel isRunning={loadingStates.runningAgents} agentResult={agentResult} pipelineStep={getPipelineStep()} />
          <div style={{ marginTop: 12 }}>
            <Recommendation agentResult={agentResult} portfolioData={portfolioData} walletAddress={wallet.address}
              onSuccess={async () => { setPipelineExecuted(true); await refreshDashboard(); }} />
          </div>
        </aside>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'app' | 'docs'>('landing');
  const { triggerLoader } = useGlobalLoader();

  return (
    <ToastProvider>
      {currentView === 'app' && <AppInner />}
      {currentView === 'landing' && (
        <LandingPage 
          onStart={() => triggerLoader(() => setCurrentView('app'), 'INITIALIZING FHE ENCLAVE...')} 
          onViewDocs={() => triggerLoader(() => setCurrentView('docs'), 'LOADING DOCUMENTATION...')} 
        />
      )}
      {currentView === 'docs' && (
        <Documentation onBack={() => triggerLoader(() => setCurrentView('landing'), 'CLOSING DOCUMENTATION...')} />
      )}
    </ToastProvider>
  );
};

const App: React.FC = () => (
  <GlobalLoaderProvider>
    <AppContent />
  </GlobalLoaderProvider>
);

export default App;
