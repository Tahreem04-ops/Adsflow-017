import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const faqs = [
  { 
    q: 'How do I connect a new ad platform?', 
    a: "Go to Integrations → click Connect next to the platform. You'll be redirected to authenticate via OAuth." 
  },
  { q: 'What does ROAS mean?', a: 'Return on Ad Spend (ROAS) = Revenue generated ÷ Ad spend. A ROAS of 4× means $4 earned for every $1 spent.' },
  { q: 'How often is data refreshed?', a: 'Connected platforms sync every 2–4 hours. You can trigger a manual sync from the Integrations page.' },
  { q: 'Can I export reports to PDF?', a: 'Yes — go to Reports, select or generate a report, and click the ⬇ download button.' },
];

const guides = [
  { title: 'Getting started with AdFlow', time: '3 min', icon: '🚀' },
  { title: 'Setting up your first campaign', time: '5 min', icon: '◈' },
  { title: 'Understanding attribution models', time: '8 min', icon: '◎' },
  { title: 'Building audience segments', time: '6 min', icon: '◉' },
  { title: 'Scheduling automated reports', time: '4 min', icon: '◪' },
  { title: 'API integration guide', time: '10 min', icon: '◧' },
];

export default function HelpPage() {
  return (
    <div className="app-layout">
      <Sidebar active="/help" />
      <div className="main-content">
        <Header title="Help & Support" subtitle="Documentation, guides and contact support" />

        <div className="page-content">

          {/* Search */}
          <div className="help-search card card-pad" style={{ marginBottom: 24 }}>
            <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ marginBottom: 6 }}>How can we help?</h2>
              <p style={{ marginBottom: 16 }}>Search our knowledge base or browse guides below</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <input className="input" placeholder="🔍  Search documentation…" style={{ flex: 1 }} />
                <button className="btn btn-primary">Search</button>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid-3" style={{ marginBottom: 24 }}>
            {[
              { title: 'Documentation', desc: 'Full platform reference', icon: '📖', color: 'var(--accent-light)', tc: 'var(--accent)' },
              { title: 'Video tutorials', desc: 'Step-by-step walkthroughs', icon: '▶', color: 'var(--purple-light)', tc: 'var(--purple)' },
              { title: 'Contact support', desc: 'Avg response time: 2 hrs', icon: '💬', color: 'var(--green-light)', tc: 'var(--green)' },
            ].map((l, i) => (
              <button key={i} className="card" style={{ padding: '20px', cursor: 'pointer', textAlign: 'left', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.15s', fontFamily: 'var(--font)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: l.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: l.tc, flexShrink: 0 }}>
                  {l.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 650, color: 'var(--text-primary)' }}>{l.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{l.desc}</div>
                </div>
                <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '1.1rem' }}>→</span>
              </button>
            ))}
          </div>

          <div className="grid-2" style={{ alignItems: 'start' }}>

            {/* Guides */}
            <div className="card card-pad">
              <h3 style={{ marginBottom: 16 }}>Popular guides</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {guides.map((g, i) => (
                  <div key={i} className="guide-item">
                    <span style={{ fontSize: '1rem' }}>{g.icon}</span>
                    <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{g.title}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>{g.time} read</span>
                    <span style={{ color: 'var(--text-muted)' }}>→</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="card card-pad">
              <h3 style={{ marginBottom: 16 }}>Frequently asked questions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {faqs.map((f, i) => (
                  <details key={i} className="faq-item">
                    <summary className="faq-q">{f.q}</summary>
                    <div className="faq-a">{f.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Contact card */}
          <div className="card" style={{ marginTop: 20, padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h3>Still need help?</h3>
              <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Our support team is available Mon–Fri, 9 AM–6 PM GMT. Avg response time is under 2 hours.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <button className="btn btn-secondary">💬 Live chat</button>
              <button className="btn btn-primary">✉ Email support</button>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .help-search { text-align: center; background: linear-gradient(135deg, #EEF3FF 0%, #F8F7F4 100%); }
        .guide-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 8px; border-radius: var(--radius-sm);
          cursor: pointer; transition: background 0.12s;
        }
        .guide-item:hover { background: var(--surface-2); }
        .faq-item { border-bottom: 1px solid var(--border); }
        .faq-item:last-child { border-bottom: none; }
        .faq-q {
          list-style: none; padding: 14px 0;
          font-size: 0.875rem; font-weight: 550; color: var(--text-primary);
          cursor: pointer; display: flex; justify-content: space-between; align-items: center;
        }
        .faq-q::-webkit-details-marker { display: none; }
        .faq-q::after { content: '+'; color: var(--text-muted); font-size: 1.1rem; flex-shrink: 0; margin-left: 8px; }
        details[open] .faq-q::after { content: '−'; }
        .faq-a { font-size: 0.82rem; color: var(--text-secondary); padding: 0 0 14px; line-height: 1.6; }
      `}</style>
    </div>
  );
}
