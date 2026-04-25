import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, Heart, MapPin, MessageCircle, Phone, ShieldCheck, ArrowLeft } from "lucide-react";
import { PageShell } from "../components/layout/PageShell";
import { AdCard, AdCardData } from "../components/marketplace/AdCard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "../hooks/useAuth";
import { categoryName, conditionLabel, DEMO_ADS, formatPrice, getFallbackImage } from "../lib/marketplace";
import { toast } from "sonner";

type AdDetail = {
  id: string;
  title: string;
  price: number;
  currency?: string;
  location: string;
  category: string;
  condition: string;
  description: string;
  images: string[];
  view_count: number;
  contact_phone?: string | null;
  contact_email?: string | null;
  seller_id?: string;
  seller_name?: string;
  is_demo?: boolean;
};

export default function AdDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ad, setAd] = useState<AdDetail | null>(null);
  const [related, setRelated] = useState<AdCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [contactingChat, setContactingChat] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      
      // Check localStorage for user-created demo ads first
      const localAds = JSON.parse(localStorage.getItem("demo_ads") || "[]");
      const localAd = localAds.find((ad: any) => ad.id === id);
      
      if (localAd) {
        setAd({
          id: localAd.id,
          title: localAd.title,
          price: localAd.price,
          currency: localAd.currency,
          location: localAd.location,
          category: localAd.category,
          condition: localAd.condition,
          description: localAd.description,
          images: localAd.images || [],
          view_count: localAd.view_count || 0,
          contact_phone: localAd.contact_phone,
          contact_email: localAd.contact_email,
          seller_id: localAd.seller_id,
          seller_name: `Demo ${localAd.seller_id?.split('-')[1] || 'User'}`,
          is_demo: true,
        });
        
        // Related ads from both localStorage and DEMO_ADS
        const allRelated = [...localAds.filter((ad: any) => ad.id !== id), ...DEMO_ADS.filter((ad: any) => ad.id !== id)];
        setRelated(allRelated
          .filter((ad: any) => ad.category === localAd.category)
          .slice(0, 3)
          .map((ad: any) => ({
            id: ad.id,
            title: ad.title,
            price: ad.price,
            location: ad.location,
            image: ad.images?.[0] || ad.image,
            category: ad.category,
            condition: ad.condition
          })));
        
        setLoading(false);
        return;
      }
      
      // Demo path (system demo ads)
      if (id.startsWith("demo-")) {
        const d = DEMO_ADS.find((x) => x.id === id);
        if (d) {
          setAd({
            id: d.id, title: d.title, price: d.price, location: d.location,
            category: d.category, condition: d.condition, description: d.description,
            images: [d.image, d.image, d.image], view_count: Math.floor(Math.random() * 500),
            seller_name: d.seller, is_demo: true,
          });
          setRelated(DEMO_ADS.filter((x) => x.id !== d.id && x.category === d.category)
            .concat(DEMO_ADS.filter((x) => x.id !== d.id && x.category !== d.category))
            .slice(0, 3)
            .map((x) => ({ id: x.id, title: x.title, price: x.price, location: x.location, image: x.image, category: x.category, condition: x.condition })));
        }
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) { setLoading(false); return; }

      // Fetch seller profile
      const { data: prof } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", data.seller_id)
        .maybeSingle();

      setAd({
        id: data.id,
        title: data.title,
        price: Number(data.price),
        currency: data.currency,
        location: data.location,
        category: data.category,
        condition: data.condition,
        description: data.description,
        images: data.images?.length ? data.images : [DEMO_ADS[0].image],
        view_count: data.view_count,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        seller_id: data.seller_id,
        seller_name: prof?.display_name ?? "Seller",
      });

      // Track view
      supabase.from("ad_views").insert({ ad_id: id, viewer_id: user?.id ?? null });

      // Related
      const { data: rel } = await supabase
        .from("ads")
        .select("id,title,price,currency,location,images,category,condition,view_count,is_featured,description")
        .eq("category", data.category)
        .eq("status", "active")
        .neq("id", id)
        .limit(3);

      setRelated((rel ?? []).map((a) => ({
        id: a.id, title: a.title, price: Number(a.price), location: a.location,
        image: a.images?.[0] || DEMO_ADS[0].image, category: a.category, condition: a.condition,
        view_count: a.view_count, is_featured: a.is_featured, description: a.description,
      })));

      // Favorite state
      if (user) {
        const { data: fav } = await supabase
          .from("favorites").select("id").eq("user_id", user.id).eq("ad_id", id).maybeSingle();
        setIsFav(!!fav);
      }

      setLoading(false);

      // Real-time subscription for favorite state
      if (user) {
        const channel = supabase
          .channel(`favorites:detail:${id}:${user.id}`)
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "favorites", filter: `user_id=eq.${user.id}` }, (payload) => {
            if (payload.new.ad_id === id) setIsFav(true);
          })
          .on("postgres_changes", { event: "DELETE", schema: "public", table: "favorites", filter: `user_id=eq.${user.id}` }, (payload) => {
            if (payload.old.ad_id === id) setIsFav(false);
          })
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    })();
  }, [id, user]);

  async function toggleFav() {
    if (!user) { toast.error("Please log in to save favorites"); return; }
    if (!ad || ad.is_demo) { toast.info("Demo ad — favorite a real listing"); return; }
    if (isFav) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("ad_id", ad.id);
      setIsFav(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, ad_id: ad.id });
      setIsFav(true);
      toast.success("Saved to favorites");
    }
  }

  async function startChat() {
    if (!ad) return;
    if (!user) { toast.error("Please log in to chat"); navigate("/login"); return; }
    if (ad.is_demo || !ad.seller_id) { toast.info("Demo ad — chat unavailable"); return; }
    if (ad.seller_id === user.id) { toast.info("This is your own ad"); return; }

    setContactingChat(true);
    // Find or create conversation
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("ad_id", ad.id)
      .eq("buyer_id", user.id)
      .maybeSingle();

    let convoId = existing?.id;
    if (!convoId) {
      const { data: created, error } = await supabase
        .from("conversations")
        .insert({ ad_id: ad.id, buyer_id: user.id, seller_id: ad.seller_id })
        .select("id")
        .single();
      if (error) { toast.error(error.message); setContactingChat(false); return; }
      convoId = created.id;
    }
    navigate(`/dashboard/messages/${convoId}`);
  }

  if (loading) return <PageShell><div className="container py-20 text-center text-muted-foreground">Loading…</div></PageShell>;
  if (!ad) return (
    <PageShell>
      <div className="container py-20 text-center space-y-4">
        <h1 className="font-display text-2xl">Ad not found</h1>
        <Button asChild variant="outline"><Link to="/">Back home</Link></Button>
      </div>
    </PageShell>
  );

  return (
    <PageShell>
      <div className="container py-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
          {/* IMAGES */}
          <div className="space-y-3">
            <div className="card-elevated rounded-2xl overflow-hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {ad.images.map((img, i) => (
                    <CarouselItem key={i}>
                      <div className="aspect-[4/3] bg-surface-3">
                        <img src={img} alt={`${ad.title} ${i + 1}`} onError={(event) => { event.currentTarget.src = getFallbackImage(ad.category); }} className="w-full h-full object-cover" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {ad.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-3 bg-background/70 border-border" />
                    <CarouselNext className="right-3 bg-background/70 border-border" />
                  </>
                )}
              </Carousel>
            </div>
            {ad.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {ad.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={img} alt="" onError={(event) => { event.currentTarget.src = getFallbackImage(ad.category); }} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20">{categoryName(ad.category)}</Badge>
                <Badge variant="secondary">{conditionLabel(ad.condition)}</Badge>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold leading-tight">{ad.title}</h1>
              <p className="text-3xl font-display font-bold text-gradient-emerald mt-3">
                {formatPrice(ad.price, ad.currency)}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {ad.location}</span>
                <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {ad.view_count} views</span>
              </div>
            </div>

            <div className="card-elevated rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Seller</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-emerald grid place-items-center font-display font-bold text-primary-foreground">
                    {(ad.seller_name ?? "S").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{ad.seller_name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-primary" /> Verified</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="hero" size="lg" onClick={startChat} disabled={contactingChat}>
                <MessageCircle className="h-4 w-4" /> Chat
              </Button>
              {ad.contact_phone ? (
                <Button asChild variant="outline" size="lg">
                  <a href={`tel:${ad.contact_phone}`}><Phone className="h-4 w-4" /> Call</a>
                </Button>
              ) : (
                <Button variant="outline" size="lg" onClick={() => toast.info("No phone provided — use chat instead")}>
                  <Phone className="h-4 w-4" /> Call
                </Button>
              )}
            </div>

            <Button variant="soft" onClick={toggleFav} className="w-full">
              <Heart className={`h-4 w-4 ${isFav ? "fill-primary" : ""}`} />
              {isFav ? "Saved to favorites" : "Add to favorites"}
            </Button>

            <div>
              <h3 className="font-display font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{ad.description}</p>
            </div>
          </div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold mb-5">Related products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((r, i) => <AdCard key={r.id} ad={r} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
