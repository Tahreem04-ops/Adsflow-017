import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function SettingsPage() {
  return (
    <div className="app-layout">
      <Sidebar active="/settings" />
      <div className="main-content">
        <Header title="Settings" subtitle="Manage your account and workspace preferences" />

        <div className="page-content">
          <div className="settings-layout">

            {/* Sidebar nav */}
            <aside className="settings-nav">
              {[
                ['Profile',        '◉'],
                ['Workspace',      '◈'],
                ['Notifications',  '◯'],
                ['Integrations',   '◎'],
                ['Billing',        '◪'],
                ['API & Access',   '◧'],
                ['Team',           '◉'],
              ].map(([label, icon], i) => (
                <button key={i} className={`settings-nav-item ${i === 0 ? 'settings-nav-active' : ''}`}>
                  <span style={{ opacity: 0.7 }}>{icon}</span>
                  {label}
                </button>
              ))}
            </aside>

            {/* Main settings */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* Profile section */}
              <div className="card card-pad" style={{ marginBottom: 16 }}>
                <h3 style={{ marginBottom: 4 }}>Profile</h3>
                <p style={{ fontSize: '0.82rem', marginBottom: 20 }}>Update your personal information</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>
                    JD
                  </div>
                  <div>
                    <button className="btn btn-secondary btn-sm">Upload photo</button>
                    <p style={{ fontSize: '0.75rem', marginTop: 6 }}>JPG, PNG up to 2MB</p>
                  </div>
                </div>

                <div className="settings-form">
                  <div className="form-group">
                    <label className="form-label">First name</label>
                    <input className="input" defaultValue="Jane" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last name</label>
                    <input className="input" defaultValue="Doe" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Email address</label>
                    <input className="input" defaultValue="jane@acmecorp.com" type="email" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Role</label>
                    <input className="input" defaultValue="Marketing Manager" />
                  </div>
                </div>
                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button className="btn btn-secondary">Cancel</button>
                  <button className="btn btn-primary">Save changes</button>
                </div>
              </div>

              {/* Notifications */}
              <div className="card card-pad" style={{ marginBottom: 16 }}>
                <h3 style={{ marginBottom: 4 }}>Notifications</h3>
                <p style={{ fontSize: '0.82rem', marginBottom: 20 }}>Choose what you receive and how</p>

                {[
                  { label: 'Budget alerts',      sub: 'Notify when a campaign exceeds 80% budget', on: true },
                  { label: 'Weekly digest',      sub: 'Sunday summary of performance metrics',     on: true },
                  { label: 'Campaign end alerts',sub: 'Remind me 3 days before a campaign ends',  on: false },
                  { label: 'Anomaly detection',  sub: 'Alert on unusual CTR or spend spikes',      on: true },
                ].map((n, i) => (
                  <div key={i} className="notif-row">
                    <div>
                      <div style={{ fontWeight: 550, fontSize: '0.875rem' }}>{n.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{n.sub}</div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked={n.on} />
                      <span className="toggle-thumb" />
                    </label>
                  </div>
                ))}
              </div>

              {/* Danger zone */}
              <div className="card card-pad" style={{ borderColor: 'var(--red-light)' }}>
                <h3 style={{ marginBottom: 4, color: 'var(--red)' }}>Danger zone</h3>
                <p style={{ fontSize: '0.82rem', marginBottom: 16 }}>These actions are irreversible</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary btn-sm" style={{ borderColor: 'var(--red)', color: 'var(--red)' }}>Delete workspace</button>
                  <button className="btn btn-secondary btn-sm" style={{ borderColor: 'var(--red)', color: 'var(--red)' }}>Delete account</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        .settings-layout {
          display: flex; gap: 24px; align-items: flex-start;
        }
        .settings-nav {
          width: 190px; flex-shrink: 0;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 8px;
          box-shadow: var(--shadow-sm);
        }
        .settings-nav-item {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 8px 10px; border-radius: var(--radius-sm);
          background: transparent; border: none; font-size: 0.875rem;
          color: var(--text-secondary); cursor: pointer; text-align: left;
          font-family: var(--font); transition: all 0.12s;
          margin-bottom: 1px;
        }
        .settings-nav-item:hover { background: var(--surface-2); color: var(--text-primary); }
        .settings-nav-active { background: var(--accent-light) !important; color: var(--accent) !important; font-weight: 550; }
        .settings-form {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
        }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-label { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); }
        .notif-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 0; border-bottom: 1px solid var(--border);
          gap: 16px;
        }
        .notif-row:last-child { border-bottom: none; }
        .toggle { position: relative; display: inline-block; width: 38px; height: 22px; flex-shrink: 0; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .toggle-thumb {
          position: absolute; inset: 0; background: var(--border-strong);
          border-radius: 99px; cursor: pointer; transition: 0.2s;
        }
        .toggle-thumb::before {
          content: ''; position: absolute; width: 16px; height: 16px;
          left: 3px; bottom: 3px; background: white;
          border-radius: 50%; transition: 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        .toggle input:checked + .toggle-thumb { background: var(--accent); }
        .toggle input:checked + .toggle-thumb::before { transform: translateX(16px); }
        @media (max-width: 768px) {
          .settings-layout { flex-direction: column; }
          .settings-nav { width: 100%; }
          .settings-form { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
