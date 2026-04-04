'use client';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="page-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-sub">{subtitle}</p>}
      </div>
      {action && <div className="header-action">{action}</div>}

      <style>{`
        .page-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 32px 0;
          flex-wrap: wrap; gap: 12px;
        }
        .header-title { font-size: 1.4rem; font-weight: 700; letter-spacing: -0.02em; }
        .header-sub { font-size: 0.85rem; color: var(--text-muted); margin-top: 2px; }
        .header-action { display: flex; gap: 10px; align-items: center; }
        @media (max-width: 768px) {
          .page-header { padding: 16px 16px 0; }
          .header-title { font-size: 1.15rem; }
        }
      `}</style>
    </header>
  );
}
