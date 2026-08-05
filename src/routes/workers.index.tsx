import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { z } from "zod";
import { MapPin, Search, Star, ShieldCheck, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { NEPAL_CITIES, npr, verificationMeta } from "@/lib/categories";

export const Route = createFileRoute("/workers/")({
  validateSearch: z.object({ category: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Find Verified Workers Near You | SHRAMIK" },
      {
        name: "description",
        content:
          "Browse verified electricians, plumbers, cleaners, carpenters and helpers near you. Filter by skill, rating, price and city.",
      },
      { property: "og:title", content: "Find Verified Workers Near You | SHRAMIK" },
      { property: "og:description", content: "Compare local workers by rating, price, verification and availability." },
    ],
  }),
  component: WorkersPage,
});

type WorkerRow = {
  id: string;
  user_id: string;
  headline: string;
  bio: string | null;
  skills: string[];
  category_slugs: string[];
  experience_years: number;
  hourly_rate: number | null;
  daily_rate: number | null;
  is_available: boolean;
  city: string | null;
  rating: number;
  reviews_count: number;
  jobs_completed: number;
  verification: string;
};

function WorkersPage() {
  const { category } = Route.useSearch();
  const [q, setQ] = useState("");
  const [city, setCity] = useState<string>("all");
  const [cat, setCat] = useState<string>(category ?? "all");
  const [minRating, setMinRating] = useState([0]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await supabase.from("categories").select("*").order("name")).data ?? [],
  });

  const { data: workers, isLoading } = useQuery({
    queryKey: ["workers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("worker_profiles")
        .select("*")
        .order("rating", { ascending: false });
      if (error) throw error;
      return data as WorkerRow[];
    },
  });

  const { data: profiles } = useQuery({
    queryKey: ["all-profiles"],
    queryFn: async () => (await supabase.from("profiles").select("id, full_name, avatar_url, city")).data ?? [],
  });

  const nameFor = (id: string) => profiles?.find((p) => p.id === id)?.full_name || "SHRAMIK Worker";
  const avatarFor = (id: string) => profiles?.find((p) => p.id === id)?.avatar_url ?? undefined;

  const filtered = useMemo(() => {
    return (workers ?? []).filter((w) => {
      const text = `${w.headline} ${w.skills.join(" ")} ${nameFor(w.user_id)}`.toLowerCase();
      if (q && !text.includes(q.toLowerCase())) return false;
      if (city !== "all" && w.city !== city) return false;
      if (cat !== "all" && !w.category_slugs.includes(cat)) return false;
      if (w.rating < (minRating[0] ?? 0)) return false;
      if (verifiedOnly && w.verification === "basic") return false;
      if (availableOnly && !w.is_available) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workers, profiles, q, city, cat, minRating, verifiedOnly, availableOnly]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Find workers near you</h1>
      <p className="mt-1 text-sm text-muted-foreground">Compare skills, ratings, verification and price.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-5 rounded-2xl border bg-card p-5 shadow-soft lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-1.5">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Skill or name" maxLength={80} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {(categories ?? []).map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>City</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All of Nepal</SelectItem>
                {NEPAL_CITIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Minimum rating: {minRating[0]}★</Label>
            <Slider value={minRating} onValueChange={setMinRating} min={0} max={5} step={1} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="verified">Verified only</Label>
            <Switch id="verified" checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="available">Available now</Label>
            <Switch id="available" checked={availableOnly} onCheckedChange={setAvailableOnly} />
          </div>
        </aside>

        <section>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading workers…</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <h2 className="font-semibold">No workers match yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                SHRAMIK is growing across Nepal. Are you skilled? Create a worker profile and be discovered.
              </p>
              <Button asChild className="mt-4">
                <Link to="/auth" search={{ mode: "signup" }}>Join as a worker</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((w) => {
                const v = verificationMeta[w.verification] ?? verificationMeta["basic"]!;
                return (
                  <Card key={w.id} className="transition-all hover:-translate-y-0.5 hover:shadow-lift">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <Avatar className="size-12">
                          <AvatarImage src={avatarFor(w.user_id)} alt={nameFor(w.user_id)} />
                          <AvatarFallback>{nameFor(w.user_id).slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate font-semibold">{nameFor(w.user_id)}</h3>
                            {w.is_available && <span className="size-2 rounded-full bg-success" title="Available" />}
                          </div>
                          <p className="truncate text-sm text-muted-foreground">{w.headline || "Skilled worker"}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            <Badge className={v.className} variant="secondary">
                              <ShieldCheck className="mr-1 size-3" />{v.label}
                            </Badge>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Star className="size-3 fill-accent text-accent" />
                              {w.rating.toFixed(1)} ({w.reviews_count})
                            </span>
                            {w.city && (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="size-3" />{w.city}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {w.skills.slice(0, 4).map((s) => (
                          <Badge key={s} variant="outline" className="font-normal">{s}</Badge>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-semibold">{npr(w.hourly_rate) ?? npr(w.daily_rate) ?? "Custom quote"}</span>
                          <span className="text-muted-foreground">
                            {w.hourly_rate ? " /hr" : w.daily_rate ? " /day" : ""}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="size-3" /> {w.experience_years} yrs experience
                          </div>
                        </div>
                        <Button asChild size="sm">
                          <Link to="/workers/$workerId" params={{ workerId: w.user_id }}>View profile</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
