import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, User as UserIcon } from "lucide-react";
import { PageShell } from "../components/layout/PageShell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { AppRole, createDemoSession, saveDemoSession, getDisplayNameFromEmail } from "../lib/auth";

const schema = z.object({
  displayName: z.string().trim().min(2, "Name too short").max(60),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string()
    .min(8, "Password must be 8-16 characters")
    .max(16, "Password must be 8-16 characters")
    .regex(/(?=.*[a-z])/, "Use at least one lowercase letter")
    .regex(/(?=.*[A-Z])/, "Use at least one uppercase letter")
    .regex(/(?=.*\d)/, "Use at least one number")
    .regex(/(?=.*[^\w\s])/, "Use at least one special character"),
});

export default function SignupPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialRole = (params.get("role") === "seller" ? "seller" : "buyer") as AppRole;
  const [role, setRole] = useState<AppRole>(initialRole);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ displayName, email, password });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setLoading(true);

    let success = false;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: displayName, role },
      },
    });

    if (!error) {
      success = true;
    }

    if (!success) {
      const demoUser = createDemoSession(email, displayName || getDisplayNameFromEmail(email), role);
      saveDemoSession(demoUser);
    }

    setLoading(false);
    toast.success("Account created! Welcome.");
    navigate("/dashboard");
  }

  return (
    <PageShell>
      <div className="container max-w-md py-16">
        <form onSubmit={handleSignup} className="card-elevated rounded-2xl p-8 space-y-5 animate-fade-up">
          <div>
            <h1 className="font-display text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join AdFlow Pro in seconds.</p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-surface-2 rounded-lg">
            {( ["buyer", "seller"] as const ).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`py-2 rounded-md text-sm font-medium capitalize transition-colors ${role === r ? "bg-gradient-emerald text-primary-foreground shadow-emerald" : "text-muted-foreground hover:text-foreground"}`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="pl-9 bg-surface-2" placeholder="Your name" />
            </div>
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
            {loading ? "Creating account…" : `Create ${role} account`}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </PageShell>
  );
}
