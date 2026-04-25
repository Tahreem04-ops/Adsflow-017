import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<"role" | "form">("role");
  const [role, setRole] = useState<AppRole>("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if role is specified in URL query parameters
    const roleParam = searchParams.get("role") as AppRole | null;
    if (roleParam && (roleParam === "buyer" || roleParam === "seller")) {
      setRole(roleParam);
      setStep("form");
    }
  }, [searchParams]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = credSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errorMsg = parsed.error.errors[0].message;
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    setLoading(true);

    try {
      // Try to authenticate with Supabase (for real users)
      const { data, error: authError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (authError) {
        // If Supabase auth fails, use demo mode
        const demoUser = createDemoSession(email, getDisplayNameFromEmail(email), role);
        saveDemoSession(demoUser);
        toast.success(`Logged in as ${role}`);
        navigate("/dashboard");
        return;
      }

      if (data?.session) {
        clearDemoSession();
        toast.success("Welcome back!");
        navigate("/dashboard");
        return;
      }
    } catch (err) {
      // If any error occurs, fall back to demo mode
      const demoUser = createDemoSession(email, getDisplayNameFromEmail(email), role);
      saveDemoSession(demoUser);
      toast.success(`Logged in as ${role}`);
      navigate("/dashboard");
      return;
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <div className="container max-w-md py-16">
        {step === "role" ? (
          <div className="card-elevated rounded-2xl p-8 space-y-6 animate-fade-up">
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold">Welcome to <span className="text-gradient-emerald">AdFlow Pro</span></h1>
              <p className="text-sm text-muted-foreground mt-2">Select your account type to continue.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => { setRole("buyer"); setStep("form"); }}
                className="card-elevated rounded-xl p-6 flex items-center gap-4 text-left hover:border-primary hover:bg-primary/5 group transition-all duration-200"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-display font-semibold text-lg">Buyer</p>
                  <p className="text-sm text-muted-foreground">Browse and buy items</p>
                </div>
              </button>

              <button
                onClick={() => { setRole("seller"); setStep("form"); }}
                className="card-elevated rounded-xl p-6 flex items-center gap-4 text-left hover:border-primary hover:bg-primary/5 group transition-all duration-200"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-display font-semibold text-lg">Seller</p>
                  <p className="text-sm text-muted-foreground">Post and manage ads</p>
                </div>
              </button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              New here? <Link to="/signup" className="text-primary font-medium hover:underline">Create an account</Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="card-elevated rounded-2xl p-8 space-y-5 animate-fade-up">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-semibold">Login as {role}</p>
              <h1 className="font-display text-2xl font-bold mt-2">Sign in</h1>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="pl-9 bg-surface-2 rounded-lg" 
                  placeholder="you@example.com" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="pl-9 bg-surface-2 rounded-lg" 
                  placeholder="Enter your password" 
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Min 8 chars: uppercase, lowercase, number, special character</p>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            <div className="flex items-center justify-between text-xs">
              <button type="button" onClick={() => { setStep("role"); setError(""); }} className="text-muted-foreground hover:text-foreground transition-colors">
                ← Change role
              </button>
              <Link to={`/signup?role=${role}`} className="text-primary hover:underline font-medium">
                Create account
              </Link>
            </div>
          </form>
        )}
      </div>
    </PageShell>
  );
}
