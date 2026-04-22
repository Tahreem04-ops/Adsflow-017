import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AppRole, loadDemoSession, clearDemoSession, isDemoUserId } from "@/lib/auth";

export type AuthUser = User | {
  id: string;
  email: string | null;
  user_metadata?: { display_name?: string };
};

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cleanUser = (newSession: Session | null) => {
      if (newSession?.user) {
        setSession(newSession);
        setUser(newSession.user);
        fetchRoles(newSession.user.id);
      } else {
        const demo = loadDemoSession();
        if (demo) {
          setSession(null);
          setUser({ id: demo.id, email: demo.email, user_metadata: { display_name: demo.display_name } });
          setRoles([demo.role]);
        } else {
          setSession(null);
          setUser(null);
          setRoles([]);
        }
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      cleanUser(newSession);
    });

    supabase.auth.getSession().then(({ data }) => {
      cleanUser(data.session);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function fetchRoles(userId: string) {
    const demo = loadDemoSession();
    if (demo && demo.id === userId) {
      setRoles([demo.role]);
      return;
    }

    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    setRoles((data ?? []).map((r) => r.role as AppRole));
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    clearDemoSession();
    setSession(null);
    setUser(null);
    setRoles([]);
  };

  return {
    session,
    user,
    roles,
    loading,
    signOut,
    isSeller: roles.includes("seller"),
    isAdmin: roles.includes("admin"),
    isSuper: roles.includes("super"),
    isDemo: Boolean(user?.id && isDemoUserId(user.id)),
  };
}
