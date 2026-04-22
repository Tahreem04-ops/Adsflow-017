import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { PageShell } from "../components/layout/PageShell";
import { SearchBar } from "../components/marketplace/SearchBar";
import { CategoryGrid } from "../components/marketplace/CategoryGrid";
import { AdCard, AdCardData } from "../components/marketplace/AdCard";
import { Button } from "../components/ui/button";
import { supabase } from "../integrations/supabase/client";
import { DEMO_ADS } from "../lib/marketplace";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

function mapDemo(d: typeof DEMO_ADS[number], featured = false): AdCardData {
  return {
    id: d.id,
    title: d.title,
    price: d.price,
    location: d.location,
    image: d.image,
    category: d.category,
    condition: d.condition,
    description: d.description,
    is_featured: featured,
    view_count: Math.floor(Math.random() * 500),
  };
}

export default function HomePage() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState<AdCardData[]>([]);
  const [latest, setLatest] = useState<AdCardData[]>([]);
  const [favIds, setFavIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("ads")
        .select("id,title,price,currency,location,images,category,condition,view_count,is_featured,description,created_at")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(24);

      const dbAds: AdCardData[] = (data ?? []).map((a) => ({
        id: a.id,
        title: a.title,
        price: Number(a.price),
        currency: a.currency,
        location: a.location,
        image: a.images?.[0] || DEMO_ADS[0].image,
        category: a.category,
        condition: a.condition,
        view_count: a.view_count,
        is_featured: a.is_featured,
        description: a.description,
      }));

      // Load user-created demo ads from localStorage
      const userDemoAds: AdCardData[] = JSON.parse(localStorage.getItem("demo_ads") || "[]").map((ad: any) => ({
        id: ad.id,
        title: ad.title,
        price: ad.price,
        currency: ad.currency,
        location: ad.location,
        image: ad.images?.[0] || DEMO_ADS[0].image,
        category: ad.category,
        condition: ad.condition,
        view_count: ad.view_count || 0,
        is_featured: ad.is_featured || false,
        description: ad.description,
      }));

      const demoFeatured = DEMO_ADS.slice(0, 3).map((d) => mapDemo(d, true));
      const demoLatest = DEMO_ADS.map((d) => mapDemo(d));

      setFeatured([...dbAds.filter((a) => a.is_featured), ...userDemoAds.filter((a) => a.is_featured), ...demoFeatured].slice(0, 6));
      setLatest([...userDemoAds, ...dbAds, ...demoLatest].slice(0, 12));
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("favorites").select("ad_id").eq("user_id", user.id).then(({ data }) => {
      setFavIds(new Set((data ?? []).map((f) => f.ad_id)));
    });
  }, [user]);

  async function toggleFavorite(adId: string) {
    if (!user) {
      toast.error("Please log in to save favorites");
      return;
    }
    if (adId.startsWith("demo-")) {
      toast.info("Demo ads can't be favorited — post a real ad first");
      return;
    }
    if (favIds.has(adId)) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("ad_id", adId);
      setFavIds((s) => { const n = new Set(s); n.delete(adId); return n; });
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, ad_id: adId });
      setFavIds((s) => new Set(s).add(adId));
      toast.success("Added to favorites");
    }
  }

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container py-12 md:py-20 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-medium">
              <Sparkles className="h-3 w-3" /> The marketplace built for modern sellers
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Buy, sell, and discover <br />
              <span className="text-gradient-emerald">anything, anywhere.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              From flagship phones to dream cars — list it in 60 seconds, message buyers instantly, and close deals safely.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mt-8 animate-fade-up delay-200">
            <SearchBar />
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground animate-fade-in delay-300">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> Verified sellers</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-primary" /> Instant chat</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-primary" /> Live analytics</span>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container py-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Browse by category</h2>
            <p className="text-sm text-muted-foreground">Find exactly what you're looking for.</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/categories">View all →</Link>
          </Button>
        </div>
        <CategoryGrid />
      </section>

      {/* FEATURED */}
      <section className="container py-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2">
              Featured ads <span className="text-primary">★</span>
            </h2>
            <p className="text-sm text-muted-foreground">Hand-picked listings from top sellers.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((ad, i) => (
            <AdCard
              key={ad.id}
              ad={ad}
              index={i}
              isFavorite={favIds.has(ad.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* LATEST */}
      <section className="container py-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Latest ads</h2>
            <p className="text-sm text-muted-foreground">Fresh listings posted by the community.</p>
          </div>
          <Button asChild variant="soft" size="sm">
            <Link to="/search">See all</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {latest.map((ad, i) => (
            <AdCard
              key={ad.id}
              ad={ad}
              index={i}
              isFavorite={favIds.has(ad.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16">
        <div className="card-elevated rounded-3xl p-8 md:p-12 text-center bg-gradient-card relative overflow-hidden shine-on-hover">
          <h3 className="font-display text-2xl md:text-4xl font-bold">
            Got something to sell? <span className="text-gradient-emerald">List it free.</span>
          </h3>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Reach thousands of buyers in your city. Post your first ad in under a minute.
          </p>
          <div className="mt-6">
            <Button asChild variant="hero" size="xl">
              <Link to="/post-ad">Post an ad now</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
