import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { supabase } from "../../integrations/supabase/client";
import { useAuth } from "../../hooks/useAuth";
import { AdCard, AdCardData } from "../../components/marketplace/AdCard";
import { DEMO_ADS } from "../../lib/marketplace";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export default function Favorites() {
  const { user } = useAuth();
  const [ads, setAds] = useState<AdCardData[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("favorites")
      .select("ad_id, ads:ads(id,title,price,currency,location,images,category,condition,view_count,is_featured,description)")
      .eq("user_id", user.id);
    const list: AdCardData[] = (data ?? [])
      .map((row: any) => row.ads)
      .filter(Boolean)
      .map((a: any) => ({
        id: a.id, title: a.title, price: Number(a.price), currency: a.currency,
        location: a.location, image: a.images?.[0] || DEMO_ADS[0].image, category: a.category,
        condition: a.condition, view_count: a.view_count, is_featured: a.is_featured, description: a.description,
      }));
    setAds(list);
    setLoading(false);
  }

  useEffect(() => {
    load();
    if (!user) return;

    // Real-time subscription for favorites
    const channel = supabase
      .channel(`favorites:${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "favorites", filter: `user_id=eq.${user.id}` }, (payload) => {
        // Reload favorites when a new favorite is added
        load();
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "favorites", filter: `user_id=eq.${user.id}` }, (payload) => {
        // Remove from local state when deleted
        setAds((a) => a.filter((x) => x.id !== payload.old.ad_id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  async function unfav(id: string) {
    if (!user) return;
    await supabase.from("favorites").delete().eq("user_id", user.id).eq("ad_id", id);
    setAds((a) => a.filter((x) => x.id !== id));
    toast.success("Removed");
  }

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Heart className="h-6 w-6 text-primary" /> Favorites</h1>
      {loading ? <p className="text-muted-foreground text-sm">Loading…</p>
        : ads.length === 0 ? (
          <div className="card-elevated rounded-2xl p-10 text-center">
            <p className="text-muted-foreground mb-4">No favorites yet.</p>
            <Button asChild variant="hero"><Link to="/search">Browse ads</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {ads.map((a, i) => <AdCard key={a.id} ad={a} index={i} isFavorite onToggleFavorite={unfav} />)}
          </div>
        )}
    </div>
  );
}
