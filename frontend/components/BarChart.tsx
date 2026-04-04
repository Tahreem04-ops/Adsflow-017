'use client';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  title?: string;
}

export default function BarChart({ data, height = 160, title }: BarChartProps) {
  const max = Math.max(...data.map(d => d.value));
  const w = 600;
  const h = height;
  const barW = Math.floor((w - 40) / data.length - 10);
  const gap = Math.floor((w - 40) / data.length);

  return (
    <div>
      {title && <div className="chart-title">{title}</div>}
      <svg
        viewBox={`0 0 ${w} ${h + 24}`}
        style={{ width: '100%', height: h + 24, overflow: 'visible' }}
      >
        {data.map((d, i) => {
          const barH = Math.max(((d.value / max) * (h - 20)), 4);
          const x = 20 + i * gap;
          const y = h - barH - 4;
          const color = d.color || '#2563EB';

          return (
            <g key={i}>
              {/* Bar background */}
              <rect
                x={x}
                y={20}
                width={barW}
                height={h - 20 - 4}
                rx="4"
                fill="#F2F0EC"
              />
              {/* Bar fill */}
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx="4"
                fill={color}
                opacity="0.85"
              />
              {/* Label */}
              <text
                x={x + barW / 2}
                y={h + 18}
                textAnchor="middle"
                fontSize="11"
                fill="#9E9B93"
                fontFamily="'DM Sans', sans-serif"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <style>{`
        .chart-title { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.04em; }
      `}</style>
    </div>
  );
}
