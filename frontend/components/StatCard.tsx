'use client';

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  sub?: string;
  color?: 'blue' | 'green' | 'purple' | 'amber';
  icon?: React.ReactNode;
}

const colorMap = {
  blue:   { bg: 'var(--accent-light)',   text: 'var(--accent)',   icon: '#DBEAFE' },
  green:  { bg: 'var(--green-light)',    text: 'var(--green)',    icon: '#BBF7D0' },
  purple: { bg: 'var(--purple-light)',   text: 'var(--purple)',   icon: '#DDD6FE' },
  amber:  { bg: 'var(--amber-light)',    text: 'var(--amber)',    icon: '#FDE68A' },
};

export default function StatCard({ label, value, trend, trendUp, sub, color = 'blue', icon }: StatCardProps) {
  const c = colorMap[color];

  return (
    <div className="stat-card card">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        {icon && (
          <div className="stat-icon" style={{ background: c.icon, color: c.text }}>
            {icon}
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-bottom">
        {trend && (
          <span className={`trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
            {trendUp ? '▲' : '▼'} {trend}
          </span>
        )}
        {sub && <span className="stat-sub">{sub}</span>}
      </div>

      <style>{`
        .stat-card { padding: 20px; cursor: default; transition: box-shadow 0.2s ease; }
        .stat-card:hover { box-shadow: var(--shadow); }
        .stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .stat-label { font-size: 0.78rem; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase; color: var(--text-muted); }
        .stat-icon { width: 34px; height: 34px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
        .stat-value { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.03em; color: var(--text-primary); margin-bottom: 8px; }
        .stat-bottom { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .stat-sub { font-size: 0.78rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
