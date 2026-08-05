import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  description: z.string().trim().min(10).max(2000),
  categories: z.array(z.string()).max(60).default([]),
});

export type JobAnalysis = {
  category_slug: string | null;
  urgency: "low" | "normal" | "high" | "emergency";
  suggested_title: string;
  estimated_min_npr: number;
  estimated_max_npr: number;
  summary: string;
};

export const analyzeJob = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<JobAnalysis> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [
          {
            role: "system",
            content:
              "You help Nepali users post local service jobs on SHRAMIK. Given a problem description, pick the best category slug from the provided list (or null), judge urgency, write a short clear job title, and estimate a realistic cost range in Nepalese Rupees for local labour. Reply with JSON only.",
          },
          {
            role: "user",
            content: `Categories: ${data.categories.join(", ") || "none"}\n\nProblem: ${data.description}\n\nReturn JSON with keys: category_slug, urgency (low|normal|high|emergency), suggested_title, estimated_min_npr (number), estimated_max_npr (number), summary.`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) throw new Error("AI is busy right now. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to continue.");
    if (!res.ok) throw new Error(`AI request failed (${res.status})`);

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = json.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as Partial<JobAnalysis>;

    return {
      category_slug: parsed.category_slug ?? null,
      urgency: (["low", "normal", "high", "emergency"] as const).includes(parsed.urgency as never)
        ? (parsed.urgency as JobAnalysis["urgency"])
        : "normal",
      suggested_title: String(parsed.suggested_title ?? "").slice(0, 120) || "Local service request",
      estimated_min_npr: Number(parsed.estimated_min_npr ?? 0),
      estimated_max_npr: Number(parsed.estimated_max_npr ?? 0),
      summary: String(parsed.summary ?? "").slice(0, 600),
    };
  });
