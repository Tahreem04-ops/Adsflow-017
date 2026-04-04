'use client';

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export default function DonutChart({ data, size = 120 }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.37;
  const strokeW = size * 0.14;

  let cumulative = 0;
  const circumference = 2 * Math.PI * r;

  const segments = data.map(d => {
    const pct = d.value / total;
    const dash = pct * circumference;
    const offset = -cumulative * circumference;
    cumulative += pct;
    return { ...d, dash, offset };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {segments.map((s, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={strokeW}
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={s.offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))}
        <text
          x={cx} y={cy - 6}
          textAnchor="middle" dominantBaseline="central"
          fontSize="13" fontWeight="700" fill="var(--text-primary)"
          fontFamily="'DM Sans', sans-serif"
        >
          {total.toLocaleString()}
        </text>
        <text
          x={cx} y={cy + 10}
          textAnchor="middle"
          fontSize="9" fill="var(--text-muted)"
          fontFamily="'DM Sans', sans-serif"
        >
          TOTAL
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{d.label}</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginLeft: 'auto' }}>
              {((d.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
