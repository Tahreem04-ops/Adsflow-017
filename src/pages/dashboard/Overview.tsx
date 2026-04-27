import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Eye, Heart, MessageCircle, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../integrations/supabase/client";
import { loadDemoAds } from "@/lib/auth";

export default function DashboardOverview() {
  const { user, roles, isSeller } = useAuth();
  const [stats, setStats] = useState({ ads: 0, views: 0, favorites: 0, messages: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const localDemoAds = loadDemoAds().filter((ad) => ad.seller_id === user.id);
      const [{ data: ads }, { count: favCount }, { count: msgCount }] = await Promise.all([
        supabase.from("ads").select("view_count").eq("seller_id", user.id),
        supabase.from("favorites").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("conversations").select("id", { count: "exact", head: true }).or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`),
      ]);
      const totalViews = (ads ?? []).reduce((sum, a: any) => sum + (a.view_count || 0), 0) + localDemoAds.reduce((sum, ad) => sum + (ad.view_count || 0), 0);
      const activeAds = (ads?.length ?? 0) + localDemoAds.length;
      setStats({ ads: activeAds, views: totalViews, favorites: favCount ?? 0, messages: msgCount ?? 0 });
    })();
  }, [user]);

  const cards = [
    { label: "Active ads", value: stats.ads, icon: Package, to: "/dashboard/ads" },
    { label: "Total views", value: stats.views, icon: Eye },
    { label: "Favorites", value: stats.favorites, icon: Heart, to: "/dashboard/favorites" },
    { label: "Conversations", value: stats.messages, icon: MessageCircle, to: "/dashboard/messages" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Welcome back 👋</h1>
          <p className="text-sm text-muted-foreground">{user?.user_metadata?.display_name ?? user?.email}</p>
          {roles.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">Role: {roles[0]}</p>
          )}
        </div>
        {isSeller && (
          <Button asChild variant="hero"><Link to="/post-ad"><Plus className="h-4 w-4" /> Post new ad</Link></Button>
        )}
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          const inner = (
            <div className="card-elevated rounded-2xl p-5">
              <Icon className="h-5 w-5 text-primary mb-3" />
              <p className="text-3xl font-display font-bold">{c.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
            </div>
          );
          return c.to ? <Link key={c.label} to={c.to}>{inner}</Link> : <div key={c.label}>{inner}</div>;
        })}
      </div>

      <div className="card-elevated rounded-2xl p-6">
        <h2 className="font-display font-semibold text-lg mb-1">Quick tips</h2>
        <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
          <li>Add 3+ photos to boost views by up to 4×.</li>
          <li>Reply to messages within 1 hour to win more deals.</li>
          <li>Mark sold items as <em>sold</em> to keep your listings clean.</li>
        </ul>
      </div>
    </div>
  );
}
