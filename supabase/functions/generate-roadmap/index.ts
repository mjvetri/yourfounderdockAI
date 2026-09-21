import { corsHeaders, handleOptions } from "../_shared/cors.ts";
import { callGeminiJSON } from "../_shared/gemini.ts";
import { getAuthedUser } from "../_shared/auth.ts";

// POST body: { ideaId: string, ideaDescription: string, category: 'software' | 'hardware' }
// Returns: { phases: [{ title, status, items: [{ title, desc, done }] }] }
// Saves the generated roadmap rows to public.roadmap_items for the current user.

function buildPrompt(ideaDescription: string, category: "software" | "hardware") {
  const base = `
    Act as a senior product strategist and technical founder coach.
    Analyze this startup idea: "${ideaDescription}".
    The product category is: ${category}.

    Generate a realistic, founder-friendly roadmap in valid JSON only.
    Return a top-level object with exactly this shape:
    {
      "phases": [
        {
          "title": "Phase 1: ...",
          "status": "active",
          "items": [
            { "title": "...", "desc": "...", "done": false }
          ]
        }
      ]
    }

    Requirements:
    - Output valid JSON, no markdown fences.
    - Use 3 to 5 phases.
    - Each phase should have 2 to 4 tasks.
    - Titles and descriptions should sound practical and execution-ready.
    - The roadmap should match a ${category} startup and reflect lean validation, MVP building, and launch iteration.
    - Each item must include a short title, a clear desc, and done: false.
  `;

  if (category === "hardware") {
    return `${base}
      Focus on physical product constraints such as prototype validation, BOM, electronics, firmware, testing, pilot manufacturing, certification, tooling, and supply chain risk.
      Keep tasks grounded in real hardware development milestones.
    `;
  }

  return `${base}
    Focus on product discovery, UX validation, backend/API development, AI features if relevant, analytics, beta launch, and learning loops.
    Keep tasks grounded in real SaaS product delivery and iterative validation.
  `;
}

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const { user, supabase } = await getAuthedUser(req);
    const { ideaId, ideaDescription, category } = await req.json();

    if (!ideaId || typeof ideaId !== "string") {
      return new Response(JSON.stringify({ error: "ideaId is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!ideaDescription || typeof ideaDescription !== "string") {
      return new Response(JSON.stringify({ error: "ideaDescription is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalizedCategory = category === "hardware" ? "hardware" : "software";

    const result = await callGeminiJSON(buildPrompt(ideaDescription, normalizedCategory));
    const phases = Array.isArray(result?.phases) ? result.phases : [];

    if (!phases.length) {
      return new Response(JSON.stringify({ error: "Gemini returned no roadmap phases." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Replace any prior generated roadmap for this idea so the page reflects the latest plan.
    await supabase
      .from("roadmap_items")
      .delete()
      .eq("idea_id", ideaId)
      .eq("user_id", user.id);

    const rows = phases.map((phase: any) => ({
      idea_id: ideaId,
      user_id: user.id,
      phase: phase.title ?? "Phase",
      tasks: Array.isArray(phase.items) ? phase.items.map((item: any) => ({
        title: String(item?.title ?? "Task"),
        desc: String(item?.desc ?? ""),
        done: Boolean(item?.done ?? false),
      })) : [],
    }));

    const { error: insertError } = await supabase.from("roadmap_items").insert(rows);
    if (insertError) {
      throw insertError;
    }

    return new Response(JSON.stringify({ phases }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
