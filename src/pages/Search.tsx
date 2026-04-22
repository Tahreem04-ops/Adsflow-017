import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { SearchBar } from "../components/marketplace/SearchBar";
import { AdCard, AdCardData } from "../components/marketplace/AdCard";
import { CATEGORIES, CONDITIONS, DEMO_ADS } from "../lib/marketplace";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { supabase } from "../integrations/supabase/client";
import { Checkbox } from "../components/ui/checkbox";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const [ads, setAds] = useState<AdCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [favIds, setFavIds] = useState<Set<string>>(new Set());

  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const location = params.get("location") ?? "";
  const minPrice = Number(params.get("min") ?? 0);
  const maxPrice = Number(params.get("max") ?? 50000);
  const conditions = useMemo(() => (params.get("cond") ?? "").split(",").filter(Boolean), [params]);

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [locInput, setLocInput] = useState(location);

  useEffect(() => { setPriceRange([minPrice, maxPrice]); setLocInput(location); }, [minPrice, maxPrice, location]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let query = supabase
        .from("ads")
        .select("id,title,price,currency,location,images,category,condition,view_count,is_featured,description")
        .eq("status", "active")
        .gte("price", minPrice)
        .lte("price", maxPrice)
        .order("created_at", { ascending: false })
        .limit(12);

      if (q) query = query.ilike("title", `%${q}%`);
      if (category) query = query.eq("category", category);
      if (location) query = query.ilike("location", `%${location}%`);
      if (conditions.length) query = query.in("condition", conditions as any);

      const { data, error } = await query;
      if (error) console.error(error);

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
      const userDemoAds: AdCardData[] = JSON.parse(localStorage.getItem("demo_ads") || "[]")
        .filter((ad: any) => {
          if (q && !ad.title.toLowerCase().includes(q.toLowerCase())) return false;
          if (category && ad.category !== category) return false;
          if (location && !ad.location.toLowerCase().includes(location.toLowerCase())) return false;
          if (ad.price < minPrice || ad.price > maxPrice) return false;
          if (conditions.length && !conditions.includes(ad.condition)) return false;
          return true;
        })
        .map((ad: any) => ({
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

      // Filter demo ads client-side too so the page never looks empty
      const demoFiltered = DEMO_ADS.filter((d) => {
        if (q && !d.title.toLowerCase().includes(q.toLowerCase())) return false;
        if (category && d.category !== category) return false;
        if (location && !d.location.toLowerCase().includes(location.toLowerCase())) return false;
        if (d.price < minPrice || d.price > maxPrice) return false;
        if (conditions.length && !conditions.includes(d.condition)) return false;
        return true;
      }).map((d) => ({
        id: d.id, title: d.title, price: d.price, location: d.location,
        image: d.image, category: d.category, condition: d.condition, description: d.description,
      }));

      setAds([...userDemoAds, ...dbAds, ...demoFiltered]);
      setLoading(false);
    })();
  }, [q, category, location, minPrice, maxPrice, conditions]);

  useEffect(() => {
    if (!user) return;
    supabase.from("favorites").select("ad_id").eq("user_id", user.id).then(({ data }) => {
      setFavIds(new Set((data ?? []).map((f) => f.ad_id)));
    });
  }, [user]);

  function applyFilters() {
    const sp = new URLSearchParams(params);
    sp.set("min", String(priceRange[0]));
    sp.set("max", String(priceRange[1]));
    if (locInput) sp.set("location", locInput); else sp.delete("location");
    setParams(sp);
  }

  function toggleCondition(cond: string) {
    const sp = new URLSearchParams(params);
    const next = conditions.includes(cond)
      ? conditions.filter((c) => c !== cond)
      : [...conditions, cond];
    if (next.length) sp.set("cond", next.join(",")); else sp.delete("cond");
    setParams(sp);
  }

  function clearAll() { setParams(new URLSearchParams()); }

  async function toggleFavorite(adId: string) {
    if (!user) { toast.error("Please log in to save favorites"); return; }
    if (adId.startsWith("demo-")) { toast.info("Demo ad — post your own to favorite"); return; }
    if (favIds.has(adId)) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("ad_id", adId);
      setFavIds((s) => { const n = new Set(s); n.delete(adId); return n; });
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, ad_id: adId });
      setFavIds((s) => new Set(s).add(adId));
    }
  }

  return (
    <PageShell>
      <div className="container py-8">
        <SearchBar compact />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* FILTERS */}
          <aside className="card-elevated rounded-2xl p-5 h-fit lg:sticky lg:top-20 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearAll}>Reset</Button>
            </div>

            <div className="space-y-3">
              <Label>Price range</Label>
              <Slider
                value={priceRange}
                onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
                min={0} max={50000} step={50}
                className="my-4"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>${priceRange[0].toLocaleString()}</span>
                <span>${priceRange[1].toLocaleString()}+</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loc">Location</Label>
              <Input id="loc" value={locInput} onChange={(e) => setLocInput(e.target.value)} placeholder="City or region" className="bg-surface-2" />
            </div>

            <div className="space-y-2">
              <Label>Condition</Label>
              <div className="space-y-2">
                {CONDITIONS.map((c) => (
                  <label key={c.value} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={conditions.includes(c.value)} onCheckedChange={() => toggleCondition(c.value)} />
                    <span>{c.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button onClick={applyFilters} variant="emerald" className="w-full">Apply filters</Button>
          </aside>

          {/* RESULTS */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold">
                {loading ? "Searching…" : `${ads.length} result${ads.length !== 1 ? "s" : ""}`}
                {category && <span className="text-muted-foreground font-normal"> · in {CATEGORIES.find((c)=>c.slug===category)?.name}</span>}
                {q && <span className="text-muted-foreground font-normal"> · "{q}"</span>}
              </h2>
            </div>
            {ads.length === 0 && !loading ? (
              <div className="card-elevated rounded-2xl p-12 text-center">
                <p className="text-muted-foreground">No ads match your filters. Try widening the search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {ads.map((ad, i) => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    index={i}
                    isFavorite={favIds.has(ad.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
