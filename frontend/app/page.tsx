import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import MiniChart from '../components/MiniChart';
import BarChart from '../components/BarChart';
import DonutChart from '../components/DonutChart';

const sparkImpressions = [42, 55, 48, 67, 72, 65, 80, 88, 79, 95, 102, 98];
const sparkClicks      = [8, 12, 9, 15, 18, 14, 22, 26, 21, 30, 28, 33];
const sparkRevenue     = [1200, 1450, 1300, 1800, 2100, 1900, 2400, 2800, 2600, 3100, 2900, 3400];
const sparkCTR         = [1.9, 2.1, 1.8, 2.2, 2.5, 2.1, 2.7, 2.9, 2.6, 3.1, 3.0, 3.3];

const weeklyData = [
  { label: 'Mon', value: 42000, color: '#2563EB' },
  { label: 'Tue', value: 55000, color: '#2563EB' },
  { label: 'Wed', value: 48000, color: '#2563EB' },
  { label: 'Thu', value: 71000, color: '#2563EB' },
  { label: 'Fri', value: 63000, color: '#2563EB' },
  { label: 'Sat', value: 38000, color: '#BFCFFC' },
  { label: 'Sun', value: 29000, color: '#BFCFFC' },
];

const channelData = [
  { label: 'Search',  value: 124500, color: '#2563EB' },
  { label: 'Display', value: 87300,  color: '#7C3AED' },
  { label: 'Social',  value: 96200,  color: '#0EA5E9' },
  { label: 'Video',   value: 54100,  color: '#16A34A' },
  { label: 'Email',   value: 31800,  color: '#D97706' },
];

const donutData = [
  { label: 'Search',  value: 4520, color: '#2563EB' },
  { label: 'Social',  value: 3140, color: '#7C3AED' },
  { label: 'Display', value: 2210, color: '#0EA5E9' },
  { label: 'Video',   value: 1430, color: '#16A34A' },
];

const campaigns = [
  { name: 'Summer Sale 2025',   channel: 'Search',  status: 'active',  budget: '$4,200', spend: '$3,180', impressions: '124K', ctr: '3.8%', roas: '4.2x' },
  { name: 'Brand Awareness Q3', channel: 'Display', status: 'active',  budget: '$8,000', spend: '$5,640', impressions: '892K', ctr: '0.9%', roas: '2.1x' },
  { name: 'Product Launch — X', channel: 'Social',  status: 'paused',  budget: '$2,500', spend: '$2,500', impressions: '56K',  ctr: '2.1%', roas: '3.7x' },
  { name: 'Retargeting Flow',   channel: 'Video',   status: 'active',  budget: '$1,800', spend: '$1,220', impressions: '32K',  ctr: '4.5%', roas: '6.0x' },
  { name: 'Newsletter Blast',   channel: 'Email',   status: 'ended',   budget: '$400',   spend: '$400',   impressions: '18K',  ctr: '5.2%', roas: '8.4x' },
];

const statusBadge: Record<string, string> = {
  active: 'badge-green',
  paused: 'badge-amber',
  ended:  'badge-blue',
};

export default function DashboardPage() {
  return (
    <div className="app-layout">
      <Sidebar active="/" />
      <div className="main-content">
        <Header
          title="Dashboard"
          subtitle="Tuesday, 3 June 2025 · All accounts"
          action={
            <>
              <button className="btn btn-secondary btn-sm">
                <span>⬇</span> Export
              </button>
              <button className="btn btn-primary btn-sm">
                <span>＋</span> New Campaign
              </button>
            </>
          }
        />

        <div className="page-content">

          {/* Date range tabs */}
          <div className="date-tabs">
            {['Today', '7 Days', '30 Days', '90 Days', 'Custom'].map((t, i) => (
              <button key={t} className={`date-tab ${i === 1 ? 'date-tab-active' : ''}`}>{t}</button>
            ))}
          </div>

          {/* KPI cards */}
          <div className="grid-4" style={{ marginBottom: 20 }}>
            <StatCard
              label="Impressions"
              value="1.24M"
              trend="12.4%"
              trendUp
              sub="vs last week"
              color="blue"
              icon={<EyeIcon />}
            />
            <StatCard
              label="Clicks"
              value="38,420"
              trend="8.7%"
              trendUp
              sub="vs last week"
              color="green"
              icon={<CursorIcon />}
            />
            <StatCard
              label="Revenue"
              value="$34,120"
              trend="3.2%"
              trendUp={false}
              sub="vs last week"
              color="purple"
              icon={<DollarIcon />}
            />
            <StatCard
              label="Avg CTR"
              value="3.1%"
              trend="0.4%"
              trendUp
              sub="vs last week"
              color="amber"
              icon={<ChartIcon />}
            />
          </div>

          {/* Sparkline row */}
          <div className="grid-4" style={{ marginBottom: 20 }}>
            <SparkCard label="Impressions trend" data={sparkImpressions} color="#2563EB" />
            <SparkCard label="Clicks trend"      data={sparkClicks}      color="#16A34A" />
            <SparkCard label="Revenue trend"     data={sparkRevenue}     color="#7C3AED" />
            <SparkCard label="CTR trend"         data={sparkCTR}         color="#D97706" />
          </div>

          {/* Charts row */}
          <div className="grid-2" style={{ marginBottom: 20 }}>
            <div className="card card-pad">
              <div className="chart-header">
                <div>
                  <h3>Weekly Impressions</h3>
                  <p style={{ fontSize: '0.8rem', marginTop: 2 }}>Impressions by day of week</p>
                </div>
                <span className="badge badge-blue">This week</span>
              </div>
              <BarChart data={weeklyData} height={150} />
            </div>
            <div className="card card-pad">
              <div className="chart-header">
                <div>
                  <h3>Channel Breakdown</h3>
                  <p style={{ fontSize: '0.8rem', marginTop: 2 }}>Clicks by ad channel</p>
                </div>
                <span className="badge badge-purple">Live</span>
              </div>
              <BarChart data={channelData} height={150} />
            </div>
          </div>

          {/* Table + donut row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 18, marginBottom: 20, alignItems: 'start' }}>

            {/* Campaigns table */}
            <div className="card">
              <div className="card-pad" style={{ borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3>Active Campaigns</h3>
                  <p style={{ fontSize: '0.78rem', marginTop: 2 }}>5 campaigns · 3 active</p>
                </div>
                <button className="btn btn-ghost btn-sm">View all →</button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Channel</th>
                      <th>Status</th>
                      <th>Budget</th>
                      <th>Spend</th>
                      <th>Impr.</th>
                      <th>CTR</th>
                      <th>ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{c.name}</div>
                        </td>
                        <td><span style={{ fontSize: '0.8rem' }}>{c.channel}</span></td>
                        <td><span className={`badge ${statusBadge[c.status]}`}>{c.status}</span></td>
                        <td style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem' }}>{c.budget}</td>
                        <td style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem' }}>{c.spend}</td>
                        <td style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem' }}>{c.impressions}</td>
                        <td style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem', color: 'var(--green)', fontWeight: 500 }}>{c.ctr}</td>
                        <td>
                          <span className="badge badge-blue" style={{ fontFamily: 'var(--mono)' }}>{c.roas}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Donut */}
              <div className="card card-pad">
                <h3 style={{ marginBottom: 16 }}>Conversion Mix</h3>
                <DonutChart data={donutData} size={110} />
              </div>

              {/* Top performers */}
              <div className="card card-pad">
                <h3 style={{ marginBottom: 14 }}>Top Keywords</h3>
                {[
                  { kw: 'running shoes sale', roas: '6.8x', pct: 88 },
                  { kw: 'buy sneakers online', roas: '5.2x', pct: 68 },
                  { kw: 'best sport shoes',   roas: '4.1x', pct: 52 },
                  { kw: 'shoe discount 2025', roas: '3.4x', pct: 44 },
                ].map((k, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{k.kw}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>{k.roas}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${k.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alert bar */}
          <div className="alert-bar">
            <span className="alert-dot" />
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Budget alert:</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              "Summer Sale 2025" has used 75% of its monthly budget. Consider increasing the limit.
            </span>
            <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>Review</button>
          </div>

        </div>
      </div>

      <style>{`
        .date-tabs {
          display: flex; gap: 2px; margin-bottom: 20px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 3px;
          width: fit-content;
        }
        .date-tab {
          padding: 5px 14px; border-radius: 7px; border: none;
          background: transparent; font-size: 0.82rem; font-weight: 450;
          color: var(--text-secondary); cursor: pointer; transition: all 0.12s;
          font-family: var(--font);
        }
        .date-tab:hover { background: var(--surface-2); color: var(--text-primary); }
        .date-tab-active { background: var(--surface-2) !important; color: var(--text-primary) !important; font-weight: 550; box-shadow: var(--shadow-sm); }
        .chart-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        .alert-bar {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 18px; border-radius: var(--radius);
          background: var(--amber-light); border: 1px solid #FCD34D;
          flex-wrap: wrap;
        }
        .alert-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--amber); flex-shrink: 0;
        }
        @media (max-width: 960px) {
          .page-content > div[style*="280px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

/* Inline SVG Icons */
function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/>
      <circle cx="8" cy="8" r="2"/>
    </svg>
  );
}

function CursorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 1l10 6-5 1-2 5L3 1z"/>
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1v14M5 4h4.5a2.5 2.5 0 010 5H6a2.5 2.5 0 000 5H11"/>
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12l4-4 3 3 5-6"/>
    </svg>
  );
}

/* Sparkline card */
function SparkCard({ label, data, color }: { label: string; data: number[]; color: string }) {
  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const pct = ((last - prev) / prev * 100).toFixed(1);
  const up = last >= prev;

  return (
    <div className="card" style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>{label}</span>
        <span className={`trend ${up ? 'trend-up' : 'trend-down'}`}>{up ? '▲' : '▼'} {Math.abs(Number(pct))}%</span>
      </div>
      <MiniChart data={data} color={color} height={40} />
    </div>
  );
}
