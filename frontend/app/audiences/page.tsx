import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DonutChart from '../../components/DonutChart';

const segments = [
  { name: 'High-Intent Shoppers',   size: '84,200',  match: 92, status: 'active',  type: 'Behavioural',  updated: '2 hrs ago' },
  { name: 'Retargeting — Cart Abandon', size: '22,410', match: 87, status: 'active',  type: 'Retargeting',  updated: '5 hrs ago' },
  { name: 'Lookalike — Top Buyers', size: '210,000', match: 79, status: 'active',  type: 'Lookalike',    updated: '1 day ago' },
  { name: 'Email Subscribers',      size: '36,800',  match: 95, status: 'paused',  type: 'CRM Upload',   updated: '3 days ago' },
  { name: 'Video Viewers 75%+',     size: '58,100',  match: 81, status: 'active',  type: 'Engagement',   updated: '6 hrs ago' },
  { name: 'Seasonal Deal Seekers',  size: '145,600', match: 68, status: 'draft',   type: 'Interest',     updated: '1 week ago' },
];

const ageData = [
  { label: '18–24', value: 18, color: '#BFCFFC' },
  { label: '25–34', value: 34, color: '#2563EB' },
  { label: '35–44', value: 27, color: '#6090F5' },
  { label: '45–54', value: 14, color: '#93B4FA' },
  { label: '55+',   value: 7,  color: '#DBEAFE' },
];

const genderData = [
  { label: 'Female', value: 54, color: '#7C3AED' },
  { label: 'Male',   value: 42, color: '#2563EB' },
  { label: 'Other',  value: 4,  color: '#9CA3AF' },
];

const statusBadge: Record<string, string> = {
  active: 'badge-green',
  paused: 'badge-amber',
  draft:  '',
};

const typeBadge: Record<string, string> = {
  'Behavioural':  'badge-blue',
  'Retargeting':  'badge-purple',
  'Lookalike':    'badge-green',
  'CRM Upload':   'badge-amber',
  'Engagement':   'badge-blue',
  'Interest':     '',
};

export default function AudiencesPage() {
  return (
    <div className="app-layout">
      <Sidebar active="/audiences" />
      <div className="main-content">
        <Header
          title="Audiences"
          subtitle="Build, manage and sync audience segments"
          action={
            <>
              <button className="btn btn-secondary btn-sm">⬆ Upload CRM</button>
              <button className="btn btn-primary btn-sm">＋ New Segment</button>
            </>
          }
        />

        <div className="page-content">

          {/* Overview cards */}
          <div className="grid-4" style={{ marginBottom: 20 }}>
            {[
              { label: 'Total audiences',    value: '6',       sub: '5 active' },
              { label: 'Total reach',        value: '557K',    sub: 'unique users' },
              { label: 'Avg match rate',     value: '83.7%',   sub: 'across segments' },
              { label: 'Synced platforms',   value: '3',       sub: 'Google · Meta · TikTok' },
            ].map((c, i) => (
              <div key={i} className="card" style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: 6 }}>{c.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{c.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{c.sub}</div>
              </div>
            ))}
          </div>

          {/* Demographics */}
          <div className="grid-2" style={{ marginBottom: 20 }}>
            <div className="card card-pad">
              <h3 style={{ marginBottom: 16 }}>Age Distribution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ageData.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', width: 36, flexShrink: 0 }}>{a.label}</span>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: `${a.value}%`, background: a.color }} />
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, width: 30, textAlign: 'right', flexShrink: 0 }}>{a.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card card-pad">
              <h3 style={{ marginBottom: 16 }}>Gender Split</h3>
              <DonutChart data={genderData} size={110} />
              <hr className="divider" style={{ margin: '16px 0' }} />
              <h3 style={{ marginBottom: 12, fontSize: '0.9rem' }}>Platform sync status</h3>
              {[
                { platform: 'Google Ads',   status: 'Synced',  color: 'var(--green)', time: '2 hrs ago' },
                { platform: 'Meta Ads',     status: 'Synced',  color: 'var(--green)', time: '4 hrs ago' },
                { platform: 'TikTok Ads',   status: 'Pending', color: 'var(--amber)', time: 'In queue' },
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{p.platform}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Segments table */}
          <div className="card">
            <div className="card-pad" style={{ borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Audience Segments</h3>
              <input className="input btn-sm" style={{ width: 200 }} placeholder="🔍 Search segments…" />
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Segment name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Match rate</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {segments.map((s, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 550, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{s.name}</td>
                      <td>
                        <span className={`badge ${typeBadge[s.type] || ''}`} style={!typeBadge[s.type] ? { border: '1px solid var(--border)', color: 'var(--text-muted)' } : {}}>
                          {s.type}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem' }}>{s.size}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
                          <div className="progress-bar" style={{ flex: 1 }}>
                            <div className="progress-fill" style={{
                              width: `${s.match}%`,
                              background: s.match >= 90 ? 'var(--green)' : s.match >= 75 ? 'var(--accent)' : 'var(--amber)'
                            }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, minWidth: 30 }}>{s.match}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${statusBadge[s.status]}`} style={s.status === 'draft' ? { border: '1px solid var(--border)', color: 'var(--text-muted)' } : {}}>
                          {s.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.updated}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-ghost btn-sm">↗ Sync</button>
                          <button className="btn btn-ghost btn-sm">⋯</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
