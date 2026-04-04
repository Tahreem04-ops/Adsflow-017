import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const campaigns = [
  { name: 'Summer Sale 2025',      channel: 'Search',  status: 'active', budget: 4200,  spend: 3180,  impressions: 124000, clicks: 4712,  ctr: 3.8, roas: 4.2, start: 'Jun 1', end: 'Jun 30' },
  { name: 'Brand Awareness Q3',    channel: 'Display', status: 'active', budget: 8000,  spend: 5640,  impressions: 892000, clicks: 8028,  ctr: 0.9, roas: 2.1, start: 'Jul 1', end: 'Sep 30' },
  { name: 'Product Launch — X',    channel: 'Social',  status: 'paused', budget: 2500,  spend: 2500,  impressions: 56000,  clicks: 1176,  ctr: 2.1, roas: 3.7, start: 'May 15', end: 'Jun 15' },
  { name: 'Retargeting Flow',      channel: 'Video',   status: 'active', budget: 1800,  spend: 1220,  impressions: 32000,  clicks: 1440,  ctr: 4.5, roas: 6.0, start: 'Jun 1', end: 'Jun 30' },
  { name: 'Newsletter Blast',      channel: 'Email',   status: 'ended',  budget: 400,   spend: 400,   impressions: 18000,  clicks: 936,   ctr: 5.2, roas: 8.4, start: 'May 1', end: 'May 31' },
  { name: 'Holiday Prep 2025',     channel: 'Search',  status: 'draft',  budget: 12000, spend: 0,     impressions: 0,      clicks: 0,     ctr: 0.0, roas: 0.0, start: 'Nov 1', end: 'Dec 31' },
];

const statusBadge: Record<string, string> = {
  active: 'badge-green',
  paused: 'badge-amber',
  ended:  'badge-blue',
  draft:  '',
};

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M`
  : n >= 1000    ? `${(n/1000).toFixed(0)}K`
  : String(n);

export default function CampaignsPage() {
  return (
    <div className="app-layout">
      <Sidebar active="/campaigns" />
      <div className="main-content">
        <Header
          title="Campaigns"
          subtitle="Manage and track all your ad campaigns"
          action={
            <>
              <button className="btn btn-secondary btn-sm">⬇ Export</button>
              <button className="btn btn-primary btn-sm">＋ New Campaign</button>
            </>
          }
        />

        <div className="page-content">

          {/* Filters */}
          <div className="filters-bar">
            <input className="input" style={{ maxWidth: 240 }} placeholder="🔍  Search campaigns…" />
            <select className="input" style={{ maxWidth: 140 }}>
              <option>All channels</option>
              <option>Search</option>
              <option>Display</option>
              <option>Social</option>
              <option>Video</option>
              <option>Email</option>
            </select>
            <select className="input" style={{ maxWidth: 140 }}>
              <option>All statuses</option>
              <option>Active</option>
              <option>Paused</option>
              <option>Ended</option>
              <option>Draft</option>
            </select>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm">☰  Columns</button>
              <button className="btn btn-ghost btn-sm">⇅  Sort</button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid-4" style={{ marginBottom: 20 }}>
            {[
              { label: 'Total campaigns', value: '6', sub: '3 active' },
              { label: 'Total budget',    value: '$28,900', sub: 'this month' },
              { label: 'Total spend',     value: '$12,940', sub: '44.8% utilised' },
              { label: 'Avg ROAS',        value: '4.9×',    sub: 'across active' },
            ].map((c, i) => (
              <div key={i} className="card" style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: 6 }}>{c.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{c.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{c.sub}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th><input type="checkbox" /></th>
                    <th>Campaign name</th>
                    <th>Channel</th>
                    <th>Status</th>
                    <th>Budget</th>
                    <th>Spend</th>
                    <th>Utilisation</th>
                    <th>Impressions</th>
                    <th>Clicks</th>
                    <th>CTR</th>
                    <th>ROAS</th>
                    <th>Period</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c, i) => {
                    const util = c.budget > 0 ? Math.round((c.spend / c.budget) * 100) : 0;
                    return (
                      <tr key={i}>
                        <td><input type="checkbox" /></td>
                        <td>
                          <div style={{ fontWeight: 550, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{c.name}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{c.channel}</span>
                        </td>
                        <td>
                          <span className={`badge ${statusBadge[c.status]}`} style={{ border: c.status === 'draft' ? '1px solid var(--border)' : 'none', color: c.status === 'draft' ? 'var(--text-muted)' : undefined }}>
                            {c.status}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem' }}>${c.budget.toLocaleString()}</td>
                        <td style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem' }}>${c.spend.toLocaleString()}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
                            <div className="progress-bar" style={{ flex: 1 }}>
                              <div className="progress-fill" style={{
                                width: `${util}%`,
                                background: util >= 90 ? 'var(--amber)' : 'var(--accent)'
                              }} />
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: 30 }}>{util}%</span>
                          </div>
                        </td>
                        <td style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem' }}>{fmt(c.impressions)}</td>
                        <td style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem' }}>{fmt(c.clicks)}</td>
                        <td style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem', color: 'var(--green)', fontWeight: 500 }}>{c.ctr > 0 ? `${c.ctr}%` : '—'}</td>
                        <td>
                          {c.roas > 0 ? <span className="badge badge-blue" style={{ fontFamily: 'var(--mono)' }}>{c.roas}×</span> : '—'}
                        </td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{c.start} → {c.end}</td>
                        <td>
                          <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}>⋯</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Showing 6 of 6 campaigns</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-secondary btn-sm" disabled>← Prev</button>
                <button className="btn btn-secondary btn-sm" disabled>Next →</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .filters-bar {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 18px; flex-wrap: wrap;
        }
        .table-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; border-top: 1px solid var(--border);
        }
        button:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
