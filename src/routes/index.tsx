import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin, Search, ShieldCheck, Sparkles, Star, Clock, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { iconFor } from "@/lib/categories";
import heroImage from "@/assets/hero-workers.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SHRAMIK — Hire Verified Local Workers in Nepal" },
      {
        name: "description",
        content:
          "SHRAMIK connects you with verified electricians, plumbers, cleaners, carpenters and day workers near you across Nepal. Post a job, compare quotes, hire in minutes.",
      },
      { property: "og:title", content: "SHRAMIK — Hire Verified Local Workers in Nepal" },
      {
        property: "og:description",
        content: "Nepal's AI-powered local workforce marketplace. Hire local. Earn local.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("group_type");
      if (error) throw error;
      return data;
    },
  });

  const specialized = (categories ?? []).filter((c) => c.group_type === "specialized").slice(0, 10);
  const general = (categories ?? []).filter((c) => c.group_type === "general").slice(0, 10);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        <img
          src={heroImage}
          alt="Nepali electrician, plumber, cleaner and carpenter standing together"
          width={1600}
          height={1104}
          className="absolute inset-0 size-full object-cover opacity-25 mix-blend-luminosity"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-primary-foreground sm:py-28">
          <Badge className="border-0 bg-white/15 text-primary-foreground backdrop-blur px-4 py-2 text-base">
  सीपलाई सम्मान, श्रमिकलाई अवसर
</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            Connecting Skills.
            <br />
            Creating Opportunities.
          </h1>
          <p className="mt-5 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
            Nepal's local workforce marketplace. Find a verified worker near you in minutes — or turn your
            skills into steady work.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary" className="h-12 text-base">
              <Link to="/workers">
                <Search className="mr-2 size-4" /> I want to hire
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="h-12 border border-white/30 bg-white/10 text-base text-primary-foreground hover:bg-white/20"
            >
              <Link to="/auth" search={{ mode: "signup" }}>
                I want to work <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-6">
            {[
              ["25+", "Service categories"],
              ["4 levels", "Worker verification"],
              ["Nepal-wide", "Local coverage"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl font-bold">{v}</dt>
                <dd className="text-xs text-primary-foreground/75">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Specialized workers</h2>
        <p className="mt-1 text-sm text-muted-foreground">Problem-based, inspection or custom estimate pricing.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {specialized.map((c) => {
            const Icon = iconFor(c.icon);
            return (
              <Link key={c.id} to="/workers" search={{ category: c.slug }} className="group">
                <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  <CardContent className="flex flex-col items-start gap-3 p-4">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-sm font-semibold">{c.name}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <h2 className="mt-14 font-display text-2xl font-bold sm:text-3xl">General workers</h2>
        <p className="mt-1 text-sm text-muted-foreground">Hourly, daily, weekly or fixed package pricing.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {general.map((c) => {
            const Icon = iconFor(c.icon);
            return (
              <Link key={c.id} to="/workers" search={{ category: c.slug }} className="group">
                <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  <CardContent className="flex flex-col items-start gap-3 p-4">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-success/15 text-success">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-sm font-semibold">{c.name}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Value props */}
      <section className="bg-surface py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Verified workers", body: "Basic to Platinum verification with ID and experience checks reviewed by our team." },
            { icon: MapPin, title: "Truly local", body: "Match by distance and service radius so help arrives fast — wherever you are in Nepal." },
            { icon: Sparkles, title: "AI understands your problem", body: "Describe or photograph the issue and AI suggests the category, urgency and a cost range." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-6 shadow-soft">
              <f.icon className="size-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust row */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { icon: Star, label: "Real ratings", value: "Verified reviews only" },
            { icon: BadgeCheck, label: "Trust levels", value: "Silver · Gold · Platinum" },
            { icon: Clock, label: "Fast response", value: "Quotes within hours" },
            { icon: MapPin, label: "Nearby first", value: "Radius-based matching" },
          ].map((i) => (
            <div key={i.label} className="flex items-start gap-3 rounded-xl border bg-card p-4">
              <i.icon className="mt-0.5 size-5 text-accent" />
              <div>
                <div className="text-sm font-semibold">{i.label}</div>
                <div className="text-xs text-muted-foreground">{i.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-accent p-10 text-center text-accent-foreground">
          <h2 className="font-display text-3xl font-bold">Every skill deserves opportunity</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm opacity-90">
            Join thousands of Nepali workers building a trusted digital work history — and employers who find
            them in minutes.
          </p>
          <Button asChild size="lg" className="mt-6 bg-foreground text-background hover:bg-foreground/90">
            <Link to="/auth" search={{ mode: "signup" }}>Get started free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
