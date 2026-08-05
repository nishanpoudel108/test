import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Briefcase, HardHat, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const searchSchema = z.object({ mode: z.enum(["signin", "signup"]).optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in or join SHRAMIK" },
      { name: "description", content: "Create a SHRAMIK account to hire nearby workers or get hired for local work in Nepal." },
      { property: "og:title", content: "Sign in or join SHRAMIK" },
      { property: "og:description", content: "Hire local. Earn local. Join Nepal's workforce marketplace." },
    ],
  }),
  component: AuthPage,
});

const credsSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">(mode === "signup" ? "signup" : "signin");
  const [role, setRole] = useState<"employer" | "worker">("employer");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate({ to: "/dashboard", replace: true });
  }, [authLoading, user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = credsSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid details");
      return;
    }
    setBusy(true);
    try {
      if (tab === "signup") {
        if (fullName.trim().length < 2) {
          toast.error("Please enter your full name");
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName.trim(), phone: phone.trim(), role },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSent(true);
          toast.success("Check your email to confirm your account");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14">
      <h1 className="text-center font-display text-3xl font-bold">Welcome to SHRAMIK</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Connecting Skills. Creating Opportunities.
      </p>

      <Card className="mt-8 shadow-soft">
        <CardHeader className="pb-2">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="signup" className="mt-4">
              <CardTitle className="text-base">I want to…</CardTitle>
              <CardDescription>Choose how you'll use SHRAMIK. You can change later.</CardDescription>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("employer")}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-all",
                    role === "employer" ? "border-primary bg-primary/5 shadow-soft" : "hover:bg-secondary",
                  )}
                >
                  <Briefcase className="size-5 text-primary" />
                  <div className="mt-2 text-sm font-semibold">Hire workers</div>
                  <div className="text-xs text-muted-foreground">Post jobs, hire nearby</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("worker")}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-all",
                    role === "worker" ? "border-primary bg-primary/5 shadow-soft" : "hover:bg-secondary",
                  )}
                >
                  <HardHat className="size-5 text-accent" />
                  <div className="mt-2 text-sm font-semibold">Find work</div>
                  <div className="text-xs text-muted-foreground">Show skills, get hired</div>
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>

        <CardContent>
          {sent ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              We sent a confirmation link to <strong className="text-foreground">{email}</strong>. Confirm it,
              then sign in.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {tab === "signup" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={fullName} maxLength={100} onChange={(e) => setFullName(e.target.value)} placeholder="Ram Bahadur" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" value={phone} maxLength={20} onChange={(e) => setPhone(e.target.value)} placeholder="98XXXXXXXX" />
                  </div>
                </>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
                {tab === "signup" ? "Create account" : "Sign in"}
              </Button>
            </form>
          )}

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full" onClick={google} disabled={busy}>
            Continue with Google
          </Button>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        By continuing you agree to SHRAMIK's terms. <Link to="/how-it-works" className="underline">How it works</Link>
      </p>
    </div>
  );
}
