import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { supabase } from "../../integrations/supabase/client";
import { useAuth } from "../../hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

type Convo = {
  id: string;
  ad_id: string;
  buyer_id: string;
  seller_id: string;
  updated_at: string;
  ad?: { title: string; images: string[] };
  other_name?: string;
  last?: string;
};

export default function Messages() {
  const { user } = useAuth();
  const [convos, setConvos] = useState<Convo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("conversations")
        .select("id, ad_id, buyer_id, seller_id, updated_at, ads:ads(title, images)")
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      const list: Convo[] = await Promise.all((data ?? []).map(async (c: any) => {
        const otherId = c.buyer_id === user.id ? c.seller_id : c.buyer_id;
        const { data: prof } = await supabase.from("profiles").select("display_name").eq("user_id", otherId).maybeSingle();
        const { data: msg } = await supabase.from("messages").select("body").eq("conversation_id", c.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
        return { ...c, ad: c.ads, other_name: prof?.display_name ?? "User", last: msg?.body };
      }));
      setConvos(list);
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-bold flex items-center gap-2"><MessageCircle className="h-6 w-6 text-primary" /> Messages</h1>
      {loading ? <p className="text-muted-foreground text-sm">Loading…</p>
        : convos.length === 0 ? (
          <div className="card-elevated rounded-2xl p-10 text-center text-muted-foreground">
            No conversations yet. Start one by chatting on an ad.
          </div>
        ) : (
          <div className="space-y-2">
            {convos.map((c) => (
              <Link key={c.id} to={`/dashboard/messages/${c.id}`} className="card-elevated rounded-xl p-3 flex items-center gap-3 hover:border-primary/50">
                <div className="h-12 w-12 rounded-lg overflow-hidden bg-surface-2 shrink-0">
                  {c.ad?.images?.[0] ? <img src={c.ad.images[0]} alt="" className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{c.other_name} <span className="text-muted-foreground font-normal">· {c.ad?.title}</span></p>
                  <p className="text-sm text-muted-foreground truncate">{c.last ?? "No messages yet"}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{formatDistanceToNow(new Date(c.updated_at), { addSuffix: true })}</span>
              </Link>
            ))}
          </div>
        )}
    </div>
  );
}
