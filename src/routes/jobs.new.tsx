import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { NEPAL_CITIES, npr } from "@/lib/categories";
import { analyzeJob, type JobAnalysis } from "@/lib/ai.functions";

export const Route = createFileRoute("/jobs/new")({
  head: () => ({
    meta: [
      { title: "Post a Job | SHRAMIK" },
      { name: "description", content: "Describe your problem and let AI suggest the right worker category, urgency and a fair price range in Nepal." },
      { property: "og:title", content: "Post a Job | SHRAMIK" },
      { property: "og:description", content: "Post local work in minutes and get quotes from verified workers." },
    ],
  }),
  component: NewJob,
});

const jobSchema = z.object({
  title: z.string().trim().min(4).max(120),
  description: z.string().trim().min(10).max(2000),
  city: z.string().min(1),
});

function NewJob() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const runAnalyze = useServerFn(analyzeJob);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [categorySlug, setCategorySlug] = useState<string>("");
  const [urgency, setUrgency] = useState<"low" | "medium" | "high" | "emergency">("medium");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await supabase.from("categories").select("*").order("name")).data ?? [],
  });

  const analyze = async () => {
    if (description.trim().length < 10) {
      toast.error("Describe the problem in a bit more detail first");
      return;
    }
    setAnalyzing(true);
    try {
      const result = await runAnalyze({
        data: { description: description.trim(), categories: (categories ?? []).map((c) => c.slug) },
      });
      setAnalysis(result);
      if (!title) setTitle(result.suggested_title);
      if (result.category_slug) setCategorySlug(result.category_slug);
      setUrgency(result.urgency === "normal" ? "medium" : result.urgency);
      if (result.estimated_min_npr) setBudgetMin(String(result.estimated_min_npr));
      if (result.estimated_max_npr) setBudgetMax(String(result.estimated_max_npr));
      toast.success("AI filled in suggestions — edit anything you like");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to post a job");
      navigate({ to: "/auth", search: { mode: "signup" } });
      return;
    }
    const parsed = jobSchema.safeParse({ title, description, city });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please complete the form");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("jobs").insert({
      employer_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      city: parsed.data.city,
      urgency,
      category_slug: categorySlug || null,
      budget_min: budgetMin ? Number(budgetMin) : null,
      budget_max: budgetMax ? Number(budgetMax) : null,
      ai_summary: analysis?.summary ?? null,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Job posted! Workers can now send quotes.");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Post a job</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Describe the problem in your own words — AI does the rest.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">What's the problem?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              rows={5}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Water is leaking under the kitchen sink and the floor is getting wet since morning."
            />
            <Button type="button" variant="outline" onClick={analyze} disabled={analyzing}>
              {analyzing ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Sparkles className="mr-2 size-4" />}
              Analyze with AI
            </Button>
            {analysis && (
              <p className="rounded-xl bg-secondary p-3 text-sm text-secondary-foreground">
                {analysis.summary}
                {analysis.estimated_max_npr > 0 && (
                  <>
                    {" "}Estimated cost: <strong>{npr(analysis.estimated_min_npr)} – {npr(analysis.estimated_max_npr)}</strong>.
                  </>
                )}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-1.5">
          <Label htmlFor="title">Job title</Label>
          <Input id="title" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder="Fix kitchen sink leak" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={categorySlug} onValueChange={setCategorySlug}>
              <SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger>
              <SelectContent>
                {(categories ?? []).map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>City</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger><SelectValue placeholder="Choose city" /></SelectTrigger>
              <SelectContent>
                {NEPAL_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Urgency</Label>
            <Select value={urgency} onValueChange={(v) => setUrgency(v as "low" | "medium" | "high" | "emergency")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["low", "medium", "high", "emergency"].map((u) => (
                  <SelectItem key={u} value={u}>{u}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bmin">Budget min</Label>
              <Input id="bmin" inputMode="numeric" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value.replace(/\D/g, ""))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bmax">Budget max</Label>
              <Input id="bmax" inputMode="numeric" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value.replace(/\D/g, ""))} />
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={saving}>
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}Post job
        </Button>
      </form>
    </div>
  );
}
