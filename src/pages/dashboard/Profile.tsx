import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../integrations/supabase/client";
import { toast } from "sonner";
import { isDemoUserId, loadDemoProfile, saveDemoProfile } from "@/lib/auth";

export default function Profile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const demoProfile = loadDemoProfile(user.id);
    if (demoProfile) {
      setDisplayName(demoProfile.display_name ?? "");
      setPhone(demoProfile.phone ?? "");
      setCity(demoProfile.city ?? "");
      setBio(demoProfile.bio ?? "");
      return;
    }

    if (!isDemoUserId(user.id)) {
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name ?? "");
          setPhone(data.phone ?? "");
          setCity(data.city ?? "");
          setBio(data.bio ?? "");
        }
      });
    }
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const payload = {
      display_name: displayName.trim().slice(0, 60),
      phone: phone.trim().slice(0, 40),
      city: city.trim().slice(0, 80),
      bio: bio.trim().slice(0, 500),
    };

    if (isDemoUserId(user.id)) {
      saveDemoProfile(user.id, payload);
      setSaving(false);
      toast.success("Demo profile saved locally");
      return;
    }

    const { error } = await supabase.from("profiles").upsert({ user_id: user.id, ...payload });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  }

  return (
    <form onSubmit={save} className="card-elevated rounded-2xl p-6 space-y-5 max-w-xl">
      <h1 className="font-display text-2xl font-bold">Profile</h1>
      <div className="space-y-2">
        <Label htmlFor="dn">Display name</Label>
        <Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-surface-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ph">Phone</Label>
          <Input id="ph" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-surface-2" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ct">City</Label>
          <Input id="ct" value={city} onChange={(e) => setCity(e.target.value)} className="bg-surface-2" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} rows={4} className="bg-surface-2" placeholder="Tell buyers a little about you…" />
      </div>
      <Button type="submit" variant="hero" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
    </form>
  );
}
