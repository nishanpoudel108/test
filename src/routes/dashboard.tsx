import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { npr } from "@/lib/categories";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Dashboard | SHRAMIK" },
      { name: "description", content: "Track your posted jobs, quotes and work activity on SHRAMIK." },
      { property: "og:title", content: "Your Dashboard | SHRAMIK" },
      { property: "og:description", content: "Manage your SHRAMIK jobs and quotes." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, profile, isWorker, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  const { data: myJobs } = useQuery({
    enabled: !!user,
    queryKey: ["my-jobs", user?.id],
    queryFn: async () =>
      (await supabase.from("jobs").select("*").eq("employer_id", user!.id).order("created_at", { ascending: false }))
        .data ?? [],
  });

  if (loading || !user) {
    return <p className="mx-auto max-w-5xl px-4 py-20 text-sm text-muted-foreground">Loading your dashboard…</p>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Namaste, {profile?.full_name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You're signed in as {isWorker ? "a worker" : "an employer"}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild><Link to="/jobs/new">Post a job</Link></Button>
          <Button asChild variant="outline"><Link to="/workers">Find workers</Link></Button>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader><CardTitle className="text-base">Your posted jobs</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {(myJobs ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You haven't posted any jobs yet. Describe a problem and AI will help you post it in seconds.
            </p>
          ) : (
            myJobs!.map((j) => (
              <div key={j.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{j.title}</span>
                    <Badge variant="secondary">{j.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {j.city} · {new Date(j.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  {j.budget_min || j.budget_max
                    ? `${npr(j.budget_min) ?? ""}${j.budget_max ? ` – ${npr(j.budget_max)}` : ""}`
                    : "Open budget"}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {isWorker && (
        <Card className="mt-6">
          <CardHeader><CardTitle className="text-base">Get more work</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Browse open jobs near you and send quotes to win work.
            <div className="mt-3">
              <Button asChild size="sm"><Link to="/jobs">Browse open jobs</Link></Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
