import { NavLink, Outlet, Navigate } from "react-router-dom";
import { LayoutDashboard, Package, Plus, MessageCircle, Heart, User as UserIcon } from "lucide-react";
import { PageShell } from "../../components/layout/PageShell";
import { useAuth } from "../../hooks/useAuth";

const items = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/ads", label: "My Ads", icon: Package },
  { to: "/post-ad", label: "Post New Ad", icon: Plus },
  { to: "/dashboard/messages", label: "Messages", icon: MessageCircle },
  { to: "/dashboard/favorites", label: "Favorites", icon: Heart },
  { to: "/dashboard/profile", label: "Profile", icon: UserIcon },
];

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  if (!loading && !user) return <Navigate to="/login" replace />;

  return (
    <PageShell>
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          <aside className="card-elevated rounded-2xl p-3 h-fit lg:sticky lg:top-20">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {items.map((it) => {
                const Icon = it.icon;
                return (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    end={it.end as any}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" /> {it.label}
                  </NavLink>
                );
              })}
            </nav>
          </aside>
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
