import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const creatives = [
  { name: 'Summer Hero Banner',     format: '1200×628', type: 'Image',    status: 'active',   ctr: '3.8%', impressions: '84K', campaign: 'Summer Sale 2025' },
  { name: 'Product Showcase Video', format: '1080×1080',type: 'Video',    status: 'active',   ctr: '4.2%', impressions: '56K', campaign: 'Brand Awareness Q3' },
  { name: 'Carousel — Top 5 Picks', format: 'Carousel', type: 'Carousel', status: 'active',   ctr: '2.9%', impressions: '42K', campaign: 'Summer Sale 2025' },
  { name: 'Responsive Search Ad 1', format: 'RSA',      type: 'Text',     status: 'paused',   ctr: '5.1%', impressions: '120K',campaign: 'Retargeting Flow' },
  { name: 'Promo GIF — 30% Off',    format: '300×250',  type: 'GIF',      status: 'active',   ctr: '1.4%', impressions: '210K',campaign: 'Brand Awareness Q3' },
  { name: 'Story Ad — Flash Sale',  format: '1080×1920',type: 'Video',    status: 'draft',    ctr: '—',    impressions: '—',   campaign: 'Holiday Prep 2025' },
];

const statusBadge: Record<string, string> = {
  active: 'badge-green',
  paused: 'badge-amber',
  draft:  '',
};

const typeColor: Record<string, string> = {
  'Image':    '#EEF3FF',
  'Video':    '#EDE9FE',
  'Carousel': '#DCFCE7',
  'Text':     '#FEF3C7',
  'GIF':      '#FCE7F3',
};
const typeText: Record<string, string> = {
  'Image':    '#1D4ED8',
  'Video':    '#6D28D9',
  'Carousel': '#15803D',
  'Text':     '#B45309',
  'GIF':      '#9D174D',
};

// Simple creative preview placeholder (SVG)
function CreativeThumb({ type, name }: { type: string; name: string }) {
  const bg = typeColor[type] || '#F2F0EC';
  const tc = typeText[type] || '#6B7280';
  const icons: Record<string, string> = {
    'Image': '🖼', 'Video': '▶', 'Carousel': '◫', 'Text': 'T', 'GIF': 'GIF',
  };
  return (
    <div style={{
      width: 72, height: 52, borderRadius: 8,
      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: type === 'GIF' ? '0.65rem' : '1.2rem',
      color: tc, fontWeight: 700, flexShrink: 0,
      border: '1px solid rgba(0,0,0,0.06)',
    }}>
      {icons[type] || '◻'}
    </div>
  );
}

export default function CreativesPage() {
  return (
    <div className="app-layout">
      <Sidebar active="/creatives" />
      <div className="main-content">
        <Header
          title="Creatives"
          subtitle="Manage ad creatives across all campaigns"
          action={
            <>
              <button className="btn btn-secondary btn-sm">⬆ Upload</button>
              <button className="btn btn-primary btn-sm">＋ New Creative</button>
            </>
          }
        />

        <div className="page-content">

          {/* Stats */}
          <div className="grid-4" style={{ marginBottom: 20 }}>
            {[
              { label: 'Total creatives', value: '6',    sub: '5 in use' },
              { label: 'Avg CTR',         value: '3.5%', sub: 'across active' },
              { label: 'Top format',      value: 'RSA',  sub: 'by click rate' },
              { label: 'Formats used',    value: '5',    sub: 'Image, Video, Text…' },
            ].map((c, i) => (
              <div key={i} className="card" style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: 6 }}>{c.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{c.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{c.sub}</div>
              </div>
            ))}
          </div>

          {/* Filter row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
            <input className="input" style={{ maxWidth: 220 }} placeholder="🔍 Search creatives…" />
            <select className="input" style={{ maxWidth: 140 }}>
              <option>All types</option>
              <option>Image</option>
              <option>Video</option>
              <option>Carousel</option>
              <option>Text</option>
              <option>GIF</option>
            </select>
            <select className="input" style={{ maxWidth: 160 }}>
              <option>All campaigns</option>
              <option>Summer Sale 2025</option>
              <option>Brand Awareness Q3</option>
              <option>Retargeting Flow</option>
            </select>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <button className="btn btn-ghost btn-sm" title="Grid view">⊞</button>
              <button className="btn btn-secondary btn-sm" title="List view">☰</button>
            </div>
          </div>

          {/* Creatives table */}
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Creative name</th>
                    <th>Type</th>
                    <th>Format</th>
                    <th>Status</th>
                    <th>CTR</th>
                    <th>Impressions</th>
                    <th>Campaign</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {creatives.map((c, i) => (
                    <tr key={i}>
                      <td style={{ width: 90 }}>
                        <CreativeThumb type={c.type} name={c.name} />
                      </td>
                      <td style={{ fontWeight: 550, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{c.name}</td>
                      <td>
                        <span style={{
                          display: 'inline-block', padding: '3px 8px',
                          borderRadius: 99, fontSize: '0.72rem', fontWeight: 600,
                          background: typeColor[c.type] || '#F2F0EC',
                          color: typeText[c.type] || '#6B7280',
                        }}>
                          {c.type}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.format}</td>
                      <td>
                        <span className={`badge ${statusBadge[c.status]}`} style={c.status === 'draft' ? { border: '1px solid var(--border)', color: 'var(--text-muted)' } : {}}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem', color: c.ctr !== '—' ? 'var(--green)' : 'var(--text-muted)', fontWeight: c.ctr !== '—' ? 600 : 400 }}>{c.ctr}</td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem' }}>{c.impressions}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.campaign}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-ghost btn-sm">✎ Edit</button>
                          <button className="btn btn-ghost btn-sm">⋯</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance breakdown */}
          <div style={{ marginTop: 18 }}>
            <h3 style={{ marginBottom: 14 }}>Creative performance by type</h3>
            <div className="grid-3">
              {[
                { type: 'Text / RSA', avgCtr: '5.1%', impressions: '120K', note: 'Highest CTR format', color: 'var(--amber-light)', tc: 'var(--amber)' },
                { type: 'Video',      avgCtr: '4.2%', impressions: '56K',  note: 'Best for brand recall', color: 'var(--purple-light)', tc: 'var(--purple)' },
                { type: 'Image',      avgCtr: '3.8%', impressions: '84K',  note: 'Reliable conversion driver', color: 'var(--accent-light)', tc: 'var(--accent)' },
              ].map((p, i) => (
                <div key={i} className="card" style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 600,
                      background: p.color, color: p.tc,
                    }}>{p.type}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 24, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{p.avgCtr}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Avg CTR</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{p.impressions}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Impressions</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.78rem' }}>{p.note}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
