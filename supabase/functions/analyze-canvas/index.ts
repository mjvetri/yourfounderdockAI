import { corsHeaders, handleOptions } from "../_shared/cors.ts";
import { callGeminiJSON } from "../_shared/gemini.ts";
import { getAuthedUser } from "../_shared/auth.ts";

type CanvasType = "lean" | "vision" | "team";

const CANVAS_CONTEXT: Record<CanvasType, string> = {
  lean: "a Lean Canvas covering problem, solution, unique value proposition, unfair advantage, customer segments, channels, key metrics, cost structure, and revenue streams",
  vision: "a Product Vision Board covering vision, target group, needs, product, and business goals",
  team: "a Team Canvas covering people & roles, common goals, values, purpose, personal goals, needs & expectations, rules & activities, strengths, and weaknesses/risks",
};

function buildPrompt(type: CanvasType, data: Record<string, string>): string {
  const filled = Object.entries(data)
    .filter(([, value]) => value && value.trim())
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  return `
Act as a rigorous startup advisor reviewing ${CANVAS_CONTEXT[type]}, filled in by a founder.

Here is what they filled in:
${filled || "(nothing filled in yet)"}

Analyze this critically — don't just be encouraging. Return JSON with:
- "summary": one or two sentence honest overall read on whether this idea/team/vision looks ready to move forward.
- "validated": array of { "point": string, "why": string } — things that look genuinely well thought out or backed by clear reasoning in what they wrote.
- "uncertain": array of { "point": string, "why": string } — things that are vague, unproven, or missing evidence, where more information is needed.
- "risky": array of { "point": string, "why": string } — things that could seriously undermine this if wrong, or gaps that could sink the idea/team.
- "nextSteps": array of strings — the 3-5 most important things to test or clarify next, ordered by priority.

If a section was left empty, treat that itself as something "uncertain" or "risky" depending on how critical that section is.
Return ONLY valid JSON, no markdown fences.
`;
}

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const { user, supabase } = await getAuthedUser(req);
    const { canvasId, type, data } = await req.json();

    if (!canvasId || !type || !data) {
      return new Response(JSON.stringify({ error: "canvasId, type, and data are required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validTypes: CanvasType[] = ["lean", "vision", "team"];
    if (!validTypes.includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid canvas type." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const analysis = await callGeminiJSON(buildPrompt(type, data));
    const { error: updateError } = await supabase
      .from("canvases")
      .update({ analysis, updated_at: new Date().toISOString() })
      .eq("id", canvasId)
      .eq("user_id", user.id);
    if (updateError) throw updateError;

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Canvas analysis failed." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
