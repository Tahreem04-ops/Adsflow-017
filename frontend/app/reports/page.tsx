import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const reports = [
  { name: 'Q2 2025 Performance Summary', type: 'PDF', size: '2.4 MB', date: 'Jun 30, 2025', status: 'ready',      owner: 'Jane Doe' },
  { name: 'May Campaign ROI Report',     type: 'XLSX', size: '1.1 MB', date: 'Jun 1, 2025',  status: 'ready',      owner: 'Jane Doe' },
  { name: 'Weekly KPIs — Wk 22',        type: 'PDF', size: '890 KB', date: 'Jun 2, 2025',  status: 'ready',      owner: 'Auto' },
  { name: 'Audience Insights June',      type: 'PDF', size: '3.2 MB', date: 'Generating…',  status: 'generating', owner: 'Jane Doe' },
  { name: 'Competitor Benchmark Q2',     type: 'PDF', size: '5.4 MB', date: 'May 15, 2025', status: 'ready',      owner: 'Mark R.' },
  { name: 'Channel Attribution Model',   type: 'XLSX', size: '780 KB', date: 'May 1, 2025',  status: 'ready',      owner: 'Jane Doe' },
];

const templates = [
  { name: 'Weekly Performance', icon: '📊', desc: 'KPIs, CTR, ROAS, spend summary' },
  { name: 'Campaign Deep-dive', icon: '◈',  desc: 'Single campaign full analysis' },
  { name: 'Attribution Report', icon: '◎',  desc: 'Multi-touch attribution model' },
  { name: 'Audience Insights',  icon: '◉',  desc: 'Demographics & device breakdown' },
];

export default function ReportsPage() {
  return (
    <div className="app-layout">
      <Sidebar active="/reports" />
      <div className="main-content">
        <Header
          title="Reports"
          subtitle="Schedule, generate and download analytics reports"
          action={
            <button className="btn btn-primary btn-sm">＋ New Report</button>
          }
        />

        <div className="page-content">

          {/* Templates */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 14, fontSize: '0.95rem' }}>Report templates</h3>
            <div className="grid-4">
              {templates.map((t, i) => (
                <button key={i} className="template-card">
                  <div className="template-icon">{t.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Reports list */}
          <div className="card">
            <div className="card-pad" style={{ borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Generated Reports</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input btn-sm" style={{ width: 200 }} placeholder="🔍 Search reports…" />
                <select className="input btn-sm" style={{ width: 130 }}>
                  <option>All types</option>
                  <option>PDF</option>
                  <option>XLSX</option>
                </select>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Report name</th>
                    <th>Format</th>
                    <th>Size</th>
                    <th>Generated</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 6,
                            background: r.type === 'PDF' ? 'var(--red-light)' : 'var(--green-light)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.62rem', fontWeight: 700,
                            color: r.type === 'PDF' ? 'var(--red)' : 'var(--green)',
                            flexShrink: 0,
                          }}>
                            {r.type}
                          </div>
                          <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{r.name}</span>
                        </div>
                      </td>
                      <td><span style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.type}</span></td>
                      <td><span style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.size}</span></td>
                      <td><span style={{ fontSize: '0.82rem' }}>{r.date}</span></td>
                      <td>
                        {r.status === 'ready'
                          ? <span className="badge badge-green">Ready</span>
                          : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div className="spinner" />
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Generating</span>
                            </div>
                          )
                        }
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="avatar">{r.owner === 'Auto' ? 'AU' : r.owner.split(' ').map(n => n[0]).join('')}</div>
                          <span style={{ fontSize: '0.82rem' }}>{r.owner}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {r.status === 'ready' && (
                            <>
                              <button className="btn btn-ghost btn-sm">⬇</button>
                              <button className="btn btn-ghost btn-sm">↗</button>
                            </>
                          )}
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

      <style>{`
        .template-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 18px 16px; text-align: left;
          cursor: pointer; transition: all 0.15s;
          display: flex; flex-direction: column; gap: 6px;
          box-shadow: var(--shadow-sm);
          font-family: var(--font);
        }
        .template-card:hover {
          border-color: var(--accent-mid); box-shadow: var(--shadow);
          transform: translateY(-1px);
        }
        .template-icon {
          font-size: 1.3rem; margin-bottom: 4px;
          width: 38px; height: 38px; border-radius: 10px;
          background: var(--accent-light);
          display: flex; align-items: center; justify-content: center;
        }
        .spinner {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
