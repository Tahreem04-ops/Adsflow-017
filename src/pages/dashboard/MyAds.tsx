import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Eye, ExternalLink } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { supabase } from "../../integrations/supabase/client";
import { useAuth } from "../../hooks/useAuth";
import { formatPrice } from "../../lib/marketplace";
import { toast } from "sonner";

export default function MyAds() {
  const { user } = useAuth();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!user) return;
    setLoading(true);
    
    // Load from database
    const { data } = await supabase.from("ads").select("*").eq("seller_id", user.id).order("created_at", { ascending: false });
    
    // Load demo ads from localStorage
    const demoAds = JSON.parse(localStorage.getItem("demo_ads") || "[]").filter((ad: any) => ad.seller_id === user.id);
    
    // Combine: demos first, then database ads
    const allAds = [...demoAds, ...(data ?? [])];
    setAds(allAds);
    setLoading(false);
  }

  useEffect(() => { load(); }, [user]);

  async function remove(id: string) {
    if (!confirm("Delete this ad? This cannot be undone.")) return;
    
    // Check if it's a demo ad
    if (id.startsWith("demo-")) {
      const demoAds = JSON.parse(localStorage.getItem("demo_ads") || "[]");
      const filtered = demoAds.filter((ad: any) => ad.id !== id);
      localStorage.setItem("demo_ads", JSON.stringify(filtered));
      toast.success("Demo ad deleted");
      setAds((a) => a.filter((x) => x.id !== id));
    } else {
      const { error } = await supabase.from("ads").delete().eq("id", id);
      if (error) return toast.error(error.message);
      toast.success("Ad deleted");
      setAds((a) => a.filter((x) => x.id !== id));
    }
  }

  async function setStatus(id: string, status: "active" | "sold") {
    const { error } = await supabase.from("ads").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(status === "sold" ? "Marked as sold" : "Reactivated");
    load();
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">My Ads</h1>
        <Button asChild variant="hero" size="sm"><Link to="/post-ad"><Plus className="h-4 w-4" /> New ad</Link></Button>
      </header>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : ads.length === 0 ? (
        <div className="card-elevated rounded-2xl p-10 text-center">
          <p className="text-muted-foreground mb-4">You haven't posted any ads yet.</p>
          <Button asChild variant="hero"><Link to="/post-ad">Post your first ad</Link></Button>
        </div>
      ) : (
        <div className="space-y-3">
          {ads.map((ad) => (
            <div key={ad.id} className="card-elevated rounded-xl p-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="h-20 w-28 rounded-lg overflow-hidden bg-surface-2 shrink-0">
                {ad.images?.[0] ? <img src={ad.images[0]} alt={ad.title} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-muted-foreground text-xs">no photo</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={ad.status === "active" ? "default" : "secondary"} className={ad.status === "active" ? "bg-primary/15 text-primary border-primary/30" : ""}>{ad.status}</Badge>
                  {ad.is_featured && <Badge className="bg-gradient-emerald text-primary-foreground">Featured</Badge>}
                </div>
                <p className="font-display font-semibold truncate">{ad.title}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-3">
                  <span>{formatPrice(Number(ad.price), ad.currency)}</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{ad.view_count}</span>
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button asChild variant="ghost" size="sm"><Link to={`/ad/${ad.id}`}><ExternalLink className="h-4 w-4" /></Link></Button>
                {ad.status === "active" ? (
                  <Button variant="outline" size="sm" onClick={() => setStatus(ad.id, "sold")}>Mark sold</Button>
                ) : (
                  <Button variant="soft" size="sm" onClick={() => setStatus(ad.id, "active")}>Reactivate</Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => remove(ad.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
