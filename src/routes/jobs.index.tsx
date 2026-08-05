import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { npr } from "@/lib/categories";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Open Jobs Near You | SHRAMIK" },
      { name: "description", content: "Browse open local jobs in Nepal — electrical, plumbing, cleaning, construction and more. Send a quote and get hired." },
      { property: "og:title", content: "Open Jobs Near You | SHRAMIK" },
      { property: "og:description", content: "Find paid local work near you on SHRAMIK." },
    ],
  }),
  component: JobsPage,
});

const urgencyStyle: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  normal: "bg-secondary text-secondary-foreground",
  high: "bg-accent/15 text-accent",
  emergency: "bg-destructive/10 text-destructive",
};

function JobsPage() {
  const [q, setQ] = useState("");

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["open-jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) throw error;
      return data;
    },
  });

  const filtered = (jobs ?? []).filter((j) =>
    `${j.title} ${j.description} ${j.city ?? ""}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Open jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real work posted by people near you.</p>
        </div>
        <Button asChild><Link to="/jobs/new">Post a job</Link></Button>
      </div>

      <div className="relative mt-6">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" value={q} maxLength={80} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs, cities, skills" />
      </div>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading jobs…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center">
            <h2 className="font-semibold">No open jobs right now</h2>
            <p className="mt-2 text-sm text-muted-foreground">Be the first to post work in your area.</p>
            <Button asChild className="mt-4"><Link to="/jobs/new">Post a job</Link></Button>
          </div>
        ) : (
          filtered.map((j) => (
            <Card key={j.id} className="transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{j.title}</h2>
                    <Badge variant="secondary" className={urgencyStyle[j.urgency] ?? ""}>{j.urgency}</Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{j.description}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {j.city && <span className="flex items-center gap-1"><MapPin className="size-3" />{j.city}</span>}
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(j.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {j.budget_min || j.budget_max
                      ? `${npr(j.budget_min) ?? ""}${j.budget_max ? ` – ${npr(j.budget_max)}` : ""}`
                      : "Open budget"}
                  </div>
                  <Button asChild size="sm" variant="outline" className="mt-2">
                    <Link to="/dashboard">Send quote</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
