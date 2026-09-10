import { corsHeaders, handleOptions } from "../_shared/cors.ts";
import { callGeminiJSON } from "../_shared/gemini.ts";
import { getAuthedUser } from "../_shared/auth.ts";

// POST body: { ideaId: string, ideaDescription: string }
// Returns: { verdict, techStack, risks, nextSteps } and persists it
// to the `validations` table, linked to the idea and the calling user.

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const { user, supabase } = await getAuthedUser(req);
    const { ideaId, ideaDescription } = await req.json();

    if (!ideaDescription || typeof ideaDescription !== "string") {
      return new Response(
        JSON.stringify({ error: "ideaDescription is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `
      Act as an expert startup consultant and CTO.
      Analyze this startup idea: "${ideaDescription}".
      Provide a structured JSON response with exactly these fields:
      - "verdict": a number 1-10 (viability score) — return just the number, e.g. 7
      - "verdictSummary": one short sentence explaining the score
      - "techStack": an array of recommended technologies (strings)
      - "risks": an array of the top 3 technical or market risks (strings)
      - "nextSteps": an array of the first 3 actionable steps to build an MVP (strings)
      Return ONLY valid JSON, no markdown fences.
    `;

    const result = await callGeminiJSON(prompt);

    // Persist the report so it survives a refresh.
    if (ideaId) {
      const { error: insertError } = await supabase.from("validations").insert({
        idea_id: ideaId,
        user_id: user.id,
        verdict: String(result.verdict ?? ""),
        tech_stack: result.techStack ?? [],
        risks: result.risks ?? [],
        next_steps: result.nextSteps ?? [],
        raw_response: result,
      });
      if (insertError) console.error("Failed to save validation:", insertError);
    }

    return new Response(JSON.stringify(result), {
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
