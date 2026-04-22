import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Store, Shield, Crown, Mail, Lock } from "lucide-react";
import { PageShell } from "../components/layout/PageShell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { AppRole, createDemoSession, saveDemoSession, clearDemoSession, getDisplayNameFromEmail } from "../lib/auth";

const credSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string()
    .min(8, "Password must be 8-16 characters")
    .max(16, "Password must be 8-16 characters")
    .regex(/(?=.*[a-z])/, "Use at least one lowercase letter")
    .regex(/(?=.*[A-Z])/, "Use at least one uppercase letter")
    .regex(/(?=.*\d)/, "Use at least one number")
    .regex(/(?=.*[^\w\s])/, "Use at least one special character"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"role" | "form">("role");
  const [role, setRole] = useState<AppRole>("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const parsed = credSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);

    const shouldUseDemo = role === "admin" || role === "super";
    let loginSuccess = false;

    if (!shouldUseDemo) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data?.session) {
        clearDemoSession();
        loginSuccess = true;
      }
    }

    if (!loginSuccess) {
      const demoUser = createDemoSession(email, getDisplayNameFromEmail(email), role);
      saveDemoSession(demoUser);
      setLoading(false);
      toast.success(`Logged in as ${role}`);
      navigate("/dashboard");
      return;
    }

    setLoading(false);
    toast.success("Welcome back!");
    navigate("/dashboard");
  }

  return (
    <PageShell>
      <div className="container max-w-md py-16">
        {step === "role" ? (
          <div className="card-elevated rounded-2xl p-8 space-y-6 animate-fade-up">
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold">Welcome to <span className="text-gradient-emerald">AdFlow Pro</span></h1>
              <p className="text-sm text-muted-foreground mt-2">Choose the account type you want to use.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => { setRole("buyer"); setStep("form"); }}
                className="card-elevated rounded-xl p-5 flex items-center gap-4 text-left hover:border-primary group"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center group-hover:bg-primary/20 transition-colors">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold">Login as Buyer</p>
                  <p className="text-xs text-muted-foreground">Browse, save, and chat with sellers.</p>
                </div>
              </button>

              <button
                onClick={() => { setRole("seller"); setStep("form"); }}
                className="card-elevated rounded-xl p-5 flex items-center gap-4 text-left hover:border-primary group"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center group-hover:bg-primary/20 transition-colors">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold">Login as Seller</p>
                  <p className="text-xs text-muted-foreground">Post ads and manage your listings.</p>
                </div>
              </button>

              <button
                onClick={() => { setRole("admin"); setStep("form"); }}
                className="card-elevated rounded-xl p-5 flex items-center gap-4 text-left hover:border-primary group"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold">Login as Admin</p>
                  <p className="text-xs text-muted-foreground">Manage users and moderate content.</p>
                </div>
              </button>

              <button
                onClick={() => { setRole("super"); setStep("form"); }}
                className="card-elevated rounded-xl p-5 flex items-center gap-4 text-left hover:border-primary group"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center group-hover:bg-primary/20 transition-colors">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold">Login as Super Admin</p>
                  <p className="text-xs text-muted-foreground">Full platform control and settings.</p>
                </div>
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="card-elevated rounded-2xl p-8 space-y-5 animate-fade-up">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary">Login as {role}</p>
              <h1 className="font-display text-2xl font-bold mt-1">Sign in with email</h1>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-9 bg-surface-2" placeholder="you@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-9 bg-surface-2" placeholder="8-16 chars, uppercase, lowercase, number, special" />
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            <div className="flex items-center justify-between text-xs">
              <button type="button" onClick={() => setStep("role")} className="text-muted-foreground hover:text-foreground">← Change role</button>
              <Link to={`/signup?role=${role}`} className="text-primary hover:underline">Create account</Link>
            </div>
          </form>
        )}
      </div>
    </PageShell>
  );
}
