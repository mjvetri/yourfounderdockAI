import { corsHeaders, handleOptions } from "../_shared/cors.ts";
import { callGeminiJSON } from "../_shared/gemini.ts";
import { getAuthedUser } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const { user, supabase } = await getAuthedUser(req);
    const { gtmStrategyId, ideaId, setup } = await req.json();
    if (!gtmStrategyId || !ideaId || !setup) throw new Error("gtmStrategyId, ideaId, and setup are required.");

    const { data: idea, error: ideaError } = await supabase.from("ideas").select("*").eq("id", ideaId).eq("user_id", user.id).single();
    if (ideaError) throw ideaError;
    const { data: leanCanvases, error: canvasError } = await supabase.from("canvases").select("data").eq("user_id", user.id).eq("type", "lean").order("updated_at", { ascending: false }).limit(1);
    if (canvasError) throw canvasError;

    const leanCanvas = leanCanvases?.[0]?.data ?? null;
    const prompt = `Act as a sharp, practical go-to-market advisor for an early-stage founder.\n\nProduct: "${idea.title}" — ${idea.description}\nCategory: ${idea.category ?? "software"}\nProduct type: ${setup.productType}\nCurrent stage: ${setup.currentStage}\nTarget market: ${setup.targetMarket}\nLaunch location: ${setup.launchLocation}\nInitial budget: ${setup.initialBudget}\nLaunch goal: ${setup.launchGoal}\n${leanCanvas ? `Existing Lean Canvas context: ${JSON.stringify(leanCanvas)}` : "No Lean Canvas filled in yet — infer reasonable assumptions."}\n\nReturn ONLY valid JSON, no markdown fences, in this exact shape:\n{ "targetCustomer": { "primary": string, "earlyAdopters": string[] }, "positioning": { "statement": string, "alternatives": string[], "differentiation": string }, "messaging": { "oneLiner": string, "shortPitch": string, "landingHeadline": string, "socialMessage": string }, "channels": [{ "name": string, "cost": "Low"|"Medium"|"High", "reach": "Low"|"Medium"|"High", "confidence": "Low"|"Medium"|"High", "status": "untested" }], "first100": [{ "phase": string, "range": string, "tasks": [{ "title": string, "done": false }] }], "launchTimeline": [{ "week": string, "tasks": string[] }], "riskAnalysis": { "strong": string[], "uncertain": string[], "critical": string[] } }\n\nInclude 4-6 channels appropriate for a ${setup.productType} product${idea.category === "hardware" ? " (favor pilots, demos, and physical distribution channels for hardware alongside digital ones)" : ""}. Include exactly 4 phases in first100, totaling a path to 100 customers, each with 2-4 concrete tasks. Include exactly 4 weeks in launchTimeline with 3-5 tasks each.`;
    const strategy = await callGeminiJSON(prompt);
    const { error: updateError } = await supabase.from("gtm_strategies").update({ strategy, setup, updated_at: new Date().toISOString() }).eq("id", gtmStrategyId).eq("user_id", user.id);
    if (updateError) throw updateError;
    return new Response(JSON.stringify({ strategy }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unexpected error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
