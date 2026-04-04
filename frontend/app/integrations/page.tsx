import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const integrations = [
  {
    name: 'Google Ads',       category: 'Ad Platform',   status: 'connected',
    desc: 'Sync campaigns, budgets and performance data automatically.',
    icon: '🔵', lastSync: '2 hours ago', accounts: 2,
  },
  {
    name: 'Meta Ads',         category: 'Ad Platform',   status: 'connected',
    desc: 'Manage Facebook & Instagram ad campaigns from one place.',
    icon: '🟣', lastSync: '4 hours ago', accounts: 1,
  },
  {
    name: 'TikTok Ads',       category: 'Ad Platform',   status: 'pending',
    desc: 'Connect TikTok Ads Manager for short-video campaign tracking.',
    icon: '⬛', lastSync: 'Pending auth', accounts: 0,
  },
  {
    name: 'Google Analytics', category: 'Analytics',     status: 'connected',
    desc: 'Pull GA4 events to enrich attribution reporting.',
    icon: '🟠', lastSync: '1 hour ago', accounts: 1,
  },
  {
    name: 'Salesforce',       category: 'CRM',           status: 'disconnected',
    desc: 'Sync leads and pipeline data for closed-loop reporting.',
    icon: '🔷', lastSync: 'Never', accounts: 0,
  },
  {
    name: 'HubSpot',          category: 'CRM',           status: 'connected',
    desc: 'Map ad conversions to CRM contacts and deal stages.',
    icon: '🟧', lastSync: '3 hours ago', accounts: 1,
  },
  {
    name: 'Slack',            category: 'Notifications', status: 'connected',
    desc: 'Receive budget alerts and weekly digests in Slack channels.',
    icon: '💬', lastSync: 'Live', accounts: 1,
  },
  {
    name: 'Zapier',           category: 'Automation',    status: 'disconnected',
    desc: 'Trigger workflows based on campaign events and thresholds.',
    icon: '⚡', lastSync: 'Never', accounts: 0,
  },
];

const categories = ['All', 'Ad Platform', 'Analytics', 'CRM', 'Notifications', 'Automation'];

const statusStyle: Record<string, { badge: string; dot: string; label: string }> = {
  connected:    { badge: 'badge-green',  dot: 'var(--green)',  label: 'Connected' },
  pending:      { badge: 'badge-amber',  dot: 'var(--amber)',  label: 'Pending' },
  disconnected: { badge: '',             dot: 'var(--border-strong)', label: 'Not connected' },
};

export default function IntegrationsPage() {
  return (
    <div className="app-layout">
      <Sidebar active="/integrations" />
      <div className="main-content">
        <Header
          title="Integrations"
          subtitle="Connect your ad platforms, analytics tools and CRMs"
        />

        <div className="page-content">

          {/* Summary */}
          <div className="grid-4" style={{ marginBottom: 24 }}>
            {[
              { label: 'Connected',    value: '5', color: 'var(--green)' },
              { label: 'Pending',      value: '1', color: 'var(--amber)' },
              { label: 'Disconnected', value: '2', color: 'var(--text-muted)' },
              { label: 'Available',    value: '8', color: 'var(--accent)' },
            ].map((c, i) => (
              <div key={i} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', color: c.color }}>{c.value}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 1 }}>{c.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Category tabs */}
          <div className="date-tabs" style={{ marginBottom: 20 }}>
            {categories.map((cat, i) => (
              <button key={cat} className={`date-tab ${i === 0 ? 'date-tab-active' : ''}`}>{cat}</button>
            ))}
          </div>

          {/* Integration cards grid */}
          <div className="integrations-grid">
            {integrations.map((intg, i) => {
              const s = statusStyle[intg.status];
              return (
                <div key={i} className="integration-card card">
                  <div className="intg-top">
                    <div className="intg-icon">{intg.icon}</div>
                    <span className={`badge ${s.badge}`} style={!s.badge ? { border: '1px solid var(--border)', color: 'var(--text-muted)' } : {}}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
                      {s.label}
                    </span>
                  </div>
                  <div className="intg-name">{intg.name}</div>
                  <div className="intg-cat">{intg.category}</div>
                  <p className="intg-desc">{intg.desc}</p>
                  <div className="intg-footer">
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {intg.status === 'connected' ? `Synced ${intg.lastSync}` : intg.lastSync}
                    </span>
                    {intg.status === 'connected' && (
                      <button className="btn btn-ghost btn-sm">Settings</button>
                    )}
                    {intg.status === 'pending' && (
                      <button className="btn btn-secondary btn-sm">Authenticate →</button>
                    )}
                    {intg.status === 'disconnected' && (
                      <button className="btn btn-primary btn-sm">Connect</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* API key section */}
          <div className="card card-pad" style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3>API Access</h3>
                <p style={{ fontSize: '0.8rem', marginTop: 2 }}>Use the AdFlow REST API to build custom integrations</p>
              </div>
              <button className="btn btn-secondary btn-sm">Generate key</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                className="input"
                readOnly
                defaultValue="af_live_••••••••••••••••••••••••••••••••"
                style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem', flex: 1 }}
              />
              <button className="btn btn-secondary btn-sm">Copy</button>
              <button className="btn btn-secondary btn-sm">Revoke</button>
            </div>
            <p style={{ fontSize: '0.75rem', marginTop: 10 }}>
              View <a href="#" style={{ color: 'var(--accent)' }}>API documentation</a> for authentication and endpoint references.
            </p>
          </div>

        </div>
      </div>

      <style>{`
        .integrations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .integration-card {
          padding: 20px; display: flex; flex-direction: column; gap: 6px;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .integration-card:hover { box-shadow: var(--shadow); transform: translateY(-1px); }
        .intg-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
        .intg-icon { font-size: 1.6rem; }
        .intg-name { font-size: 1rem; font-weight: 650; color: var(--text-primary); }
        .intg-cat { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted); margin-top: -2px; }
        .intg-desc { font-size: 0.8rem; color: var(--text-secondary); flex: 1; line-height: 1.5; }
        .intg-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
        .date-tabs { display: flex; gap: 2px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 3px; width: fit-content; }
        .date-tab { padding: 5px 14px; border-radius: 7px; border: none; background: transparent; font-size: 0.82rem; font-weight: 450; color: var(--text-secondary); cursor: pointer; transition: all 0.12s; font-family: var(--font); }
        .date-tab:hover { background: var(--surface-2); color: var(--text-primary); }
        .date-tab-active { background: var(--surface-2) !important; color: var(--text-primary) !important; font-weight: 550; box-shadow: var(--shadow-sm); }
      `}</style>
    </div>
  );
}
