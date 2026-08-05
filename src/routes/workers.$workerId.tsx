import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Star, ShieldCheck, Briefcase, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { npr, verificationMeta } from "@/lib/categories";

export const Route = createFileRoute("/workers/$workerId")({
  head: () => ({
    meta: [
      { title: "Worker profile | SHRAMIK" },
      { name: "description", content: "View skills, experience, verification level, rates and reviews for this SHRAMIK worker." },
      { property: "og:title", content: "Worker profile | SHRAMIK" },
      { property: "og:description", content: "Verified local worker on Nepal's SHRAMIK marketplace." },
    ],
  }),
  component: WorkerDetail,
  errorComponent: () => <Fallback message="We couldn't load this profile." />,
  notFoundComponent: () => <Fallback message="This worker profile doesn't exist." />,
});

function Fallback({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Profile unavailable</h1>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <Button asChild className="mt-6"><Link to="/workers">Browse workers</Link></Button>
    </div>
  );
}

function WorkerDetail() {
  const { workerId } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["worker", workerId],
    queryFn: async () => {
      const [{ data: worker }, { data: profile }, { data: reviews }] = await Promise.all([
        supabase.from("worker_profiles").select("*").eq("user_id", workerId).maybeSingle(),
        supabase.from("profiles").select("id, full_name, avatar_url, city").eq("id", workerId).maybeSingle(),
        supabase.from("reviews").select("*").eq("worker_id", workerId).order("created_at", { ascending: false }).limit(10),
      ]);
      return { worker, profile, reviews: reviews ?? [] };
    },
  });

  if (isLoading) return <p className="mx-auto max-w-4xl px-4 py-16 text-sm text-muted-foreground">Loading profile…</p>;
  if (!data?.worker) return <Fallback message="This worker profile doesn't exist yet." />;

  const w = data.worker;
  const name = data.profile?.full_name || "SHRAMIK Worker";
  const v = verificationMeta[w.verification] ?? verificationMeta["basic"]!;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl border bg-card p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar className="size-20">
            <AvatarImage src={data.profile?.avatar_url ?? undefined} alt={name} />
            <AvatarFallback className="text-lg">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold">{name}</h1>
            <p className="text-muted-foreground">{w.headline || "Skilled worker"}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <Badge variant="secondary" className={v.className}>
                <ShieldCheck className="mr-1 size-3" />{v.label}
              </Badge>
              <span className="flex items-center gap-1">
                <Star className="size-4 fill-accent text-accent" />{w.rating.toFixed(1)} ({w.reviews_count} reviews)
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Briefcase className="size-4" />{w.jobs_completed} jobs done
              </span>
              {w.city && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="size-4" />{w.city}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl font-bold">
              {npr(w.hourly_rate) ?? npr(w.daily_rate) ?? "Custom"}
            </div>
            <div className="text-xs text-muted-foreground">
              {w.hourly_rate ? "per hour" : w.daily_rate ? "per day" : "quote per job"}
            </div>
            <Button asChild className="mt-3">
              <Link to="/jobs/new">Request this worker</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">About</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {w.bio || "This worker hasn't added a description yet."}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Reviews</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {data.reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reviews yet — be the first to hire and review.</p>
              ) : (
                data.reviews.map((r) => (
                  <div key={r.id} className="rounded-xl border p-4">
                    <div className="flex items-center gap-1 text-accent">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-accent" />
                      ))}
                    </div>
                    <p className="mt-2 text-sm">{r.comment}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Skills</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              {w.skills.length === 0 ? (
                <span className="text-sm text-muted-foreground">Not listed</span>
              ) : (
                w.skills.map((s: string) => <Badge key={s} variant="outline" className="font-normal">{s}</Badge>)
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Availability</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{w.is_available ? "Available for new work" : "Currently busy"}</p>
              <p>{w.experience_years} years of experience</p>
              <p className="flex items-center gap-2"><Phone className="size-4" /> Contact shared after hiring</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
