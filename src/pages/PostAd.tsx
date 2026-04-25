import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Image as ImageIcon, X, Upload } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, CONDITIONS, DEMO_ADS } from "@/lib/marketplace";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { addDemoAd, isDemoUserId } from "@/lib/auth";

const schema = z.object({
  title: z.string().trim().min(4, "Title too short").max(120),
  description: z.string().trim().min(10, "Add more details").max(2000),
  price: z.number().min(0).max(10_000_000),
  category: z.string().min(1, "Pick a category"),
  condition: z.enum(["new", "like_new", "good", "fair", "used"]),
  location: z.string().trim().min(2).max(120),
  contact_phone: z.string().trim().max(40).optional().or(z.literal("")),
});

export default function PostAdPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState<"new" | "like_new" | "good" | "fair" | "used">("good");
  const [location, setLocation] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && !user) {
    return <Navigate to="/login?role=seller" replace />;
  }

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    const next = [...files, ...picked].slice(0, 6);
    setFiles(next);
  }

  function removeFile(i: number) {
    setFiles((f) => f.filter((_, idx) => idx !== i));
  }

  function placeholderImage() {
    return DEMO_ADS.find((ad) => ad.category === category)?.image ?? DEMO_ADS[0].image;
  }

  async function uploadImages(): Promise<string[]> {
    if (!user || isDemoUserId(user.id)) return [];
    const urls: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("ad-images").upload(path, file, { contentType: file.type });
      if (error) { toast.error(`Upload failed: ${error.message}`); continue; }
      const { data } = supabase.storage.from("ad-images").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const parsed = schema.safeParse({
      title, description,
      price: Number(price),
      category, condition, location, contact_phone: contactPhone,
    });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }

    setSubmitting(true);
    try {
      const images = files.length ? await uploadImages() : [];
      const demoMode = isDemoUserId(user.id);
      const adPayload = {
        id: demoMode ? `demo-${crypto.randomUUID()}` : undefined,
        seller_id: user.id,
        title: parsed.data.title,
        description: parsed.data.description,
        price: parsed.data.price,
        category: parsed.data.category,
        condition: parsed.data.condition,
        location: parsed.data.location,
        contact_phone: parsed.data.contact_phone || null,
        contact_email: user.email,
        images: demoMode ? (files.length ? files.map(f => URL.createObjectURL(f)) : [placeholderImage()]) : images,
        currency: "USD",
        status: "active",
        is_featured: false,
        view_count: 0,
        created_at: new Date().toISOString(),
      } as any;

      if (demoMode) {
        addDemoAd(adPayload);
        toast.success("Your ad is live in demo mode!");
        navigate(`/ad/${adPayload.id}`);
      } else {
        const { data, error } = await supabase.from("ads").insert(adPayload).select("id").single();
        if (error) {
          const localAd = { ...adPayload, id: `demo-${crypto.randomUUID()}` };
          addDemoAd(localAd);
          toast.success("Unable to save to database, but your ad is saved locally.");
          navigate(`/ad/${localAd.id}`);
        } else {
          await supabase.from("user_roles").insert({ user_id: user.id, role: "seller" }).then(() => {});
          toast.success("Your ad is live!");
          navigate(`/ad/${data.id}`);
        }
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Could not post ad");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <div className="container max-w-2xl py-10">
        <header className="mb-6">
          <h1 className="font-display text-3xl font-bold">Post a new ad</h1>
          <p className="text-sm text-muted-foreground mt-1">Reach buyers in your area in minutes.</p>
        </header>

        <form onSubmit={handleSubmit} className="card-elevated rounded-2xl p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required className="bg-surface-2" placeholder="e.g. iPhone 15 Pro Max — 256GB" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <Input id="price" type="number" min="0" step="1" value={price} onChange={(e) => setPrice(e.target.value)} required className="bg-surface-2" />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-surface-2"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (<SelectItem key={c.slug} value={c.slug}>{c.emoji} {c.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Condition *</Label>
              <Select value={condition} onValueChange={(v) => setCondition(v as any)}>
                <SelectTrigger className="bg-surface-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => (<SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={120} required className="bg-surface-2" placeholder="City, State" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Contact phone (optional)</Label>
            <Input id="phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} maxLength={40} className="bg-surface-2" placeholder="+1 555 000 0000" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description *</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} required rows={5} className="bg-surface-2" placeholder="Condition, what's included, any defects, why selling…" />
          </div>

          <div className="space-y-2">
            <Label>Photos (up to 6)</Label>
            <label className="card-elevated rounded-xl border-dashed border-2 border-border hover:border-primary p-6 flex flex-col items-center justify-center gap-2 cursor-pointer text-muted-foreground hover:text-primary">
              <Upload className="h-6 w-6" />
              <span className="text-sm">Click to upload images</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={onPickFiles} />
            </label>
            {files.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                {files.map((f, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border bg-surface-2">
                    <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 h-6 w-6 grid place-items-center rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Posting…" : "Publish ad"}
          </Button>
        </form>
      </div>
    </PageShell>
  );
}
