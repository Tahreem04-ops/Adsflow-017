import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import BarChart from '../../components/BarChart';
import MiniChart from '../../components/MiniChart';
import DonutChart from '../../components/DonutChart';

const monthlyImpr = [
  { label: 'Jan', value: 380000, color: '#2563EB' },
  { label: 'Feb', value: 420000, color: '#2563EB' },
  { label: 'Mar', value: 510000, color: '#2563EB' },
  { label: 'Apr', value: 490000, color: '#2563EB' },
  { label: 'May', value: 630000, color: '#2563EB' },
  { label: 'Jun', value: 710000, color: '#2563EB' },
];

const deviceData = [
  { label: 'Mobile',  value: 54200, color: '#2563EB' },
  { label: 'Desktop', value: 38100, color: '#7C3AED' },
  { label: 'Tablet',  value: 10700, color: '#0EA5E9' },
];

const geoData = [
  { country: 'United States', clicks: 18420, pct: 48 },
  { country: 'United Kingdom', clicks: 7830,  pct: 20 },
  { country: 'Canada',         clicks: 5210,  pct: 14 },
  { country: 'Australia',      clicks: 3840,  pct: 10 },
  { country: 'Germany',        clicks: 2910,  pct: 8  },
];

const funnelSteps = [
  { label: 'Impressions', value: 1240000, pct: 100, color: '#BFCFFC' },
  { label: 'Clicks',      value: 38420,   pct: 3.1, color: '#93B4FA' },
  { label: 'Visits',      value: 31200,   pct: 81,  color: '#6090F5' },
  { label: 'Leads',       value: 4180,    pct: 13,  color: '#3B72EF' },
  { label: 'Conversions', value: 842,     pct: 20,  color: '#2563EB' },
];

const lineData = [28, 34, 29, 42, 48, 44, 56, 62, 58, 71, 68, 80];

export default function AnalyticsPage() {
  return (
    <div className="app-layout">
      <Sidebar active="/analytics" />
      <div className="main-content">
        <Header
          title="Analytics"
          subtitle="Deep-dive into your ad performance metrics"
          action={
            <>
              <select className="input btn-sm" style={{ width: 'auto', border: '1.5px solid var(--border)', fontFamily: 'var(--font)' }}>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>
              <button className="btn btn-primary btn-sm">⬇ Export report</button>
            </>
          }
        />

        <div className="page-content">

          {/* Conversion funnel */}
          <div className="card card-pad" style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3>Conversion Funnel</h3>
                <p style={{ fontSize: '0.8rem', marginTop: 2 }}>From impression to conversion — last 30 days</p>
              </div>
            </div>
            <div className="funnel-grid">
              {funnelSteps.map((s, i) => (
                <div key={i} className="funnel-step">
                  <div className="funnel-bar-wrap">
                    <div className="funnel-bar" style={{ height: `${s.pct === 100 ? 60 : Math.max(s.pct * 0.6, 10)}px`, background: s.color }} />
                  </div>
                  <div className="funnel-value">{s.value >= 1000 ? `${(s.value/1000).toFixed(0)}K` : s.value}</div>
                  <div className="funnel-label">{s.label}</div>
                  {i < funnelSteps.length - 1 && (
                    <div className="funnel-arrow">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Charts row */}
          <div className="grid-2" style={{ marginBottom: 18 }}>
            <div className="card card-pad">
              <h3 style={{ marginBottom: 4 }}>Monthly Impressions</h3>
              <p style={{ fontSize: '0.8rem', marginBottom: 16 }}>H1 2025 overview</p>
              <BarChart data={monthlyImpr} height={140} />
            </div>
            <div className="card card-pad">
              <h3 style={{ marginBottom: 4 }}>Click-through Rate</h3>
              <p style={{ fontSize: '0.8rem', marginBottom: 8 }}>Rolling 12-week CTR (%)</p>
              <div style={{ marginTop: 8 }}>
                <MiniChart data={lineData} color="#2563EB" height={120} />
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>3.1%</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current avg CTR</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--green)' }}>+0.8%</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>vs 12 weeks ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Device + Geo row */}
          <div className="grid-2" style={{ marginBottom: 18 }}>
            <div className="card card-pad">
              <h3 style={{ marginBottom: 16 }}>Device Breakdown</h3>
              <DonutChart data={deviceData} size={120} />
            </div>
            <div className="card card-pad">
              <h3 style={{ marginBottom: 14 }}>Top Geographies</h3>
              {geoData.map((g, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{g.country}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--mono)' }}>{g.clicks.toLocaleString()}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${g.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insight cards */}
          <div className="grid-3">
            {[
              { title: 'Best performing day', val: 'Thursday', sub: 'Avg 22% higher CTR than other days', icon: '📅', color: 'var(--accent-light)' },
              { title: 'Peak traffic hour',   val: '6–8 PM',  sub: 'Highest impression volume window',   icon: '🕖', color: 'var(--purple-light)' },
              { title: 'Top ad format',       val: 'Responsive', sub: '38% higher conversion rate',      icon: '◧',  color: 'var(--green-light)' },
            ].map((ins, i) => (
              <div key={i} className="card" style={{ padding: 20 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: ins.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 12 }}>
                  {ins.icon}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: 4 }}>{ins.title}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>{ins.val}</div>
                <p style={{ fontSize: '0.78rem' }}>{ins.sub}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style>{`
        .funnel-grid {
          display: flex; align-items: flex-end; gap: 0;
          justify-content: center; position: relative;
        }
        .funnel-step {
          display: flex; flex-direction: column; align-items: center;
          position: relative; flex: 1;
        }
        .funnel-bar-wrap {
          display: flex; align-items: flex-end; justify-content: center;
          height: 65px; width: 100%;
        }
        .funnel-bar {
          width: 60%; border-radius: 4px 4px 0 0;
          transition: height 0.4s ease;
          min-height: 8px;
        }
        .funnel-value {
          font-size: 0.9rem; font-weight: 700; letter-spacing: -0.01em;
          margin-top: 6px; color: var(--text-primary);
        }
        .funnel-label {
          font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;
          text-transform: uppercase; letter-spacing: 0.03em; font-weight: 600;
        }
        .funnel-arrow {
          position: absolute; right: -8px; top: 50%; transform: translateY(-50%);
          font-size: 1.2rem; color: var(--border-strong); z-index: 1;
        }
        @media (max-width: 768px) {
          .funnel-grid { flex-wrap: wrap; gap: 12px; }
          .funnel-arrow { display: none; }
        }
      `}</style>
    </div>
  );
}
