import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, FileText, Handshake, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How SHRAMIK Works | Hire or Get Hired in Nepal" },
      { name: "description", content: "Post a job, compare quotes from verified nearby workers, hire with confidence and review the work. Here's how SHRAMIK works." },
      { property: "og:title", content: "How SHRAMIK Works" },
      { property: "og:description", content: "Four simple steps to hire local workers or find work in Nepal." },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  { icon: FileText, title: "Describe the work", body: "Write the problem in plain words. AI suggests the category, urgency and a fair price range." },
  { icon: Search, title: "Get matched nearby", body: "Verified workers within your area see the job and send quotes." },
  { icon: Handshake, title: "Compare and hire", body: "Check ratings, verification level, experience and price — then hire." },
  { icon: Star, title: "Pay and review", body: "Confirm the work is done, pay, and leave a review that builds Nepal's trust network." },
];

function HowItWorks() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">How SHRAMIK works</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Whether you need help today or want steady work, SHRAMIK keeps it simple, local and trusted.
      </p>

      <ol className="mt-10 grid gap-5 sm:grid-cols-2">
        {steps.map((s, i) => (
          <li key={s.title} className="rounded-2xl border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="size-5" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Step {i + 1}
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild size="lg"><Link to="/jobs/new">Post a job</Link></Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/auth" search={{ mode: "signup" }}>Join as a worker</Link>
        </Button>
      </div>
    </div>
  );
}
