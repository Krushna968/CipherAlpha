import React, { useEffect, useState } from 'react';

const TOKEN_COLORS: Record<string, string> = {
  ETH:  '#00FF94', // Fhenix Green
  WBTC: '#00F0FF', // Neon Cyan
  USDT: '#d2bbff', // Primary purple
  LINK: '#8b949e', // Slate
};

interface DonutProps {
  data: Record<string, number>;
  label: string;
  size?: number;
}

const STROKE = 11;
const GAP_PCT = 2.5;

const DonutRing: React.FC<DonutProps> = ({ data, label, size = 90 }) => {
  const [ready, setReady] = useState(false);
  const r = (size - STROKE) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, [data]);

  let cum = 0;
  const entries = Object.entries(data);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE} />
          {entries.map(([symbol, pct]) => {
            const adjusted = Math.max(0, pct - GAP_PCT);
            const segLen = ready ? (adjusted / 100) * circ : 0;
            const offset = -(cum / 100) * circ;
            cum += pct;
            return (
              <circle
                key={symbol}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={TOKEN_COLORS[symbol] || '#888'}
                strokeWidth={STROKE}
                strokeDasharray={`${segLen} ${circ - segLen}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1)' }}
              />
            );
          })}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[9px] font-bold text-on-surface-variant font-mono tracking-widest">{label}</span>
        </div>
      </div>
    </div>
  );
};

interface TokenAllocationChartProps {
  current?: Record<string, number>;
  suggested: Record<string, number>;
}

export const TokenAllocationChart: React.FC<TokenAllocationChartProps> = ({ current, suggested }) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[9px] text-on-surface-variant font-bold font-mono tracking-widest">
        ALLOCATION_MODEL
      </p>

      {/* Charts row */}
      <div className="flex items-start justify-around gap-2 mt-2">
        {current && Object.keys(current).length > 0 && (
          <div className="flex flex-col items-center gap-1">
            <DonutRing data={current} label="NOW" />
            <span className="text-[8px] text-on-surface-variant font-mono mt-1">CURRENT</span>
          </div>
        )}
        <div className="flex flex-col items-center gap-1">
          <DonutRing data={suggested} label="TGT" />
          <span className="text-[8px] text-on-surface-variant font-mono mt-1">TARGET</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {Object.entries(suggested).map(([symbol, pct]) => (
          <div key={symbol} className="flex items-center gap-1.5 text-[10px]">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: TOKEN_COLORS[symbol] || '#888' }}
            />
            <span className="text-on-surface-variant font-mono">{symbol}</span>
            <span className="ml-auto font-bold text-on-surface font-mono">{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
