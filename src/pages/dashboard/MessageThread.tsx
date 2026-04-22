import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { supabase } from "../../integrations/supabase/client";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";

type Msg = { id: string; body: string; sender_id: string; created_at: string };

export default function MessageThread() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [other, setOther] = useState<{ name: string; ad_title: string; ad_id: string } | null>(null);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !user) return;
    (async () => {
      const { data: convo } = await supabase
        .from("conversations")
        .select("ad_id, buyer_id, seller_id, ads:ads(title)")
        .eq("id", id)
        .maybeSingle();
      if (!convo) return;
      const otherId = convo.buyer_id === user.id ? convo.seller_id : convo.buyer_id;
      const { data: prof } = await supabase.from("profiles").select("display_name").eq("user_id", otherId).maybeSingle();
      setOther({ name: prof?.display_name ?? "User", ad_title: (convo as any).ads?.title ?? "Ad", ad_id: convo.ad_id });

      const { data: msgs } = await supabase.from("messages").select("*").eq("conversation_id", id).order("created_at", { ascending: true });
      setMessages(msgs ?? []);
    })();

    // realtime subscription
    const channel = supabase
      .channel(`messages:${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${id}` }, (payload) => {
        setMessages((m) => [...m, payload.new as Msg]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id, user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !id || !text.trim()) return;
    const body = text.trim().slice(0, 2000);
    setText("");
    const { error } = await supabase.from("messages").insert({ conversation_id: id, sender_id: user.id, body });
    if (error) toast.error(error.message);
    // bump conversation updated_at
    await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", id);
  }

  return (
    <div className="card-elevated rounded-2xl flex flex-col h-[calc(100vh-12rem)]">
      <header className="p-4 border-b border-border flex items-center gap-3">
        <Button asChild variant="ghost" size="icon"><Link to="/dashboard/messages"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{other?.name ?? "…"}</p>
          {other && <Link to={`/ad/${other.ad_id}`} className="text-xs text-primary hover:underline truncate">{other.ad_title}</Link>}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground mt-10">Say hi 👋</p>
        ) : messages.map((m) => {
          const mine = m.sender_id === user?.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"} animate-fade-in`}>
              <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm ${mine ? "bg-gradient-emerald text-primary-foreground rounded-br-sm" : "bg-surface-2 text-foreground rounded-bl-sm"}`}>
                {m.body}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="p-3 border-t border-border flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} placeholder="Type a message…" className="bg-surface-2" />
        <Button type="submit" variant="hero" size="icon" disabled={!text.trim()}><Send className="h-4 w-4" /></Button>
      </form>
    </div>
  );
}
