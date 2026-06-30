import React, { useEffect, useState } from 'react';

interface PortfolioHealthGaugeProps {
  score: number; // 0–100
  size?: number;
}

const getColor = (s: number) => {
  if (s >= 70) return '#4edea3'; // tertiary green
  if (s >= 40) return '#fbbf24'; // amber
  return '#ffb4ab'; // error red
};

const getLabel = (s: number) => {
  if (s >= 70) return 'Excellent';
  if (s >= 40) return 'Moderate';
  return 'At Risk';
};

export const PortfolioHealthGauge: React.FC<PortfolioHealthGaugeProps> = ({ score, size = 110 }) => {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDisplayed(score), 400);
    return () => clearTimeout(t);
  }, [score]);

  const strokeW = 12;
  const r = (size - strokeW) / 2;
  const cx = size / 2;
  const cy = size * 0.58; // push centre down so semicircle is centred in the box

  // Semicircle: goes from 180° (left) to 0° (right) through the top.
  // Arc length for a semicircle = π * r
  const arcLen = Math.PI * r;
  const filled = (displayed / 100) * arcLen;
  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div style={{ width: size, height: size * 0.6 + 4, position: 'relative' }}>
        <svg
          width={size}
          height={size * 0.6 + 4}
          overflow="visible"
        >
          {/* Background arc */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          {/* Score arc */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${arcLen - filled}`}
            style={{
              transition: 'stroke-dasharray 1.1s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease',
              filter: `drop-shadow(0 0 5px ${color}80)`,
            }}
          />
          {/* Score value */}
          <text
            x={cx} y={cy - 4}
            textAnchor="middle"
            fontSize="20"
            fontWeight="700"
            fill="white"
          >
            {displayed}
          </text>
          <text
            x={cx} y={cy + 11}
            textAnchor="middle"
            fontSize="9"
            fill="rgba(255,255,255,0.45)"
          >
            / 100
          </text>
        </svg>
      </div>
      <span
        className="text-[10px] font-bold tracking-wide"
        style={{ color }}
      >
        {getLabel(score)}
      </span>
    </div>
  );
};
