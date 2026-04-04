'use client';
import { useState } from 'react';
import Link from 'next/link';

const navItems = [
  { label: 'Dashboard',   href: '/',              icon: '▣' },
  { label: 'Campaigns',   href: '/campaigns',     icon: '◈' },
  { label: 'Analytics',   href: '/analytics',     icon: '◫' },
  { label: 'Audiences',   href: '/audiences',     icon: '◉' },
  { label: 'Creatives',   href: '/creatives',     icon: '◧' },
  { label: 'Reports',     href: '/reports',       icon: '◪' },
  { label: 'Integrations',href: '/integrations',  icon: '◎' },
];

const bottomItems = [
  { label: 'Settings',    href: '/settings',      icon: '◌' },
  { label: 'Help',        href: '/help',          icon: '◯' },
];

export default function Sidebar({ active = '/' }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="mobile-menu-btn"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="10" width="4" height="8" rx="1.5" fill="#2563EB" />
              <rect x="8" y="6"  width="4" height="12" rx="1.5" fill="#2563EB" opacity=".75" />
              <rect x="14" y="2" width="4" height="16" rx="1.5" fill="#2563EB" opacity=".5" />
            </svg>
          </div>
          <span className="logo-text">AdFlow</span>
          <button className="sidebar-close" onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Workspace pill */}
        <div className="workspace-pill">
          <div className="workspace-dot" />
          <span>Acme Corp</span>
          <span className="workspace-arrow">⌄</span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${active === item.href ? 'nav-item-active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="sidebar-bottom">
          {bottomItems.map(item => (
            <Link key={item.href} href={item.href} className="nav-item">
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="user-card">
            <div className="avatar">JD</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Jane Doe</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Admin</div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>⋯</span>
          </div>
        </div>
      </aside>

      <style>{`
        .sidebar {
          position: fixed; top: 0; left: 0;
          width: var(--sidebar-w); height: 100vh;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          z-index: 100; overflow: hidden;
          transition: transform 0.25s ease;
        }
        .sidebar-logo {
          display: flex; align-items: center; gap: 10px;
          padding: 20px 18px 16px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .logo-mark {
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--accent-light);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .logo-text {
          font-size: 1rem; font-weight: 700; letter-spacing: -0.02em;
          color: var(--text-primary); flex: 1;
        }
        .sidebar-close { display: none; background: none; border: none; cursor: pointer; font-size: 1rem; color: var(--text-muted); }
        .workspace-pill {
          display: flex; align-items: center; gap: 8px;
          margin: 12px 14px 4px;
          padding: 8px 12px;
          background: var(--surface-2);
          border-radius: var(--radius);
          font-size: 0.8rem; font-weight: 500;
          cursor: pointer;
        }
        .workspace-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--green); flex-shrink: 0;
        }
        .workspace-arrow { margin-left: auto; color: var(--text-muted); font-size: 0.85rem; }
        .sidebar-nav { flex: 1; overflow-y: auto; padding: 8px 10px; }
        .nav-section-label {
          font-size: 0.68rem; font-weight: 600; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--text-muted);
          padding: 8px 8px 6px;
        }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; border-radius: var(--radius-sm);
          font-size: 0.875rem; font-weight: 450; color: var(--text-secondary);
          text-decoration: none; transition: all 0.12s ease;
          margin-bottom: 1px;
        }
        .nav-item:hover { background: var(--surface-2); color: var(--text-primary); }
        .nav-item-active {
          background: var(--accent-light); color: var(--accent) !important; font-weight: 550;
        }
        .nav-icon { font-size: 0.9rem; width: 18px; text-align: center; flex-shrink: 0; opacity: 0.75; }
        .sidebar-bottom { padding: 10px; border-top: 1px solid var(--border); flex-shrink: 0; }
        .user-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 8px; margin-top: 4px;
          border-radius: var(--radius);
          cursor: pointer;
        }
        .user-card:hover { background: var(--surface-2); }
        .mobile-menu-btn {
          display: none; position: fixed; top: 14px; left: 14px; z-index: 200;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-sm); padding: 8px; cursor: pointer;
          flex-direction: column; gap: 4px; box-shadow: var(--shadow-sm);
        }
        .mobile-menu-btn span {
          display: block; width: 18px; height: 2px;
          background: var(--text-primary); border-radius: 99px;
        }
        .sidebar-overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,0.3); z-index: 99;
        }
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); width: 260px; }
          .sidebar-open { transform: translateX(0); }
          .sidebar-close { display: block; }
          .mobile-menu-btn { display: flex; }
          .sidebar-overlay { display: block; }
        }
      `}</style>
    </>
  );
}
