import { corsHeaders, handleOptions } from "../_shared/cors.ts";
import { callGeminiJSON } from "../_shared/gemini.ts";
import { getAuthedUser } from "../_shared/auth.ts";

// POST body: { ideaId: string, ideaDescription: string, category: 'software' | 'hardware' }

function buildHardwarePrompt(ideaDescription: string) {
  return `
    Act as an experienced electronics hobbyist helping a non-technical
    founder understand how their hardware product's components would
    logically connect together. This is for early planning only — it will
    NOT be treated as a certified, manufacturable schematic.

    Product idea: "${ideaDescription}"

    Return JSON with:
    - "components": array of objects { "name": string, "role": string (one
      short phrase on what it does in this product) } — list the core
      electronic components this product would realistically need
      (microcontroller, sensors, motors, power source, etc). 4-8 components.
    - "wiringDiagram": an array of connection objects, each with exactly
      these keys: "from" (component and pin, e.g. "Sensor VCC"), "to"
      (component and pin, e.g. "ESP32 3.3V"), and "label" (the connection
      type, e.g. "3.3V" or "GPIO14"). List every connection needed to wire
      this circuit.
    - "notes": array of 2-4 short strings flagging things a real engineer
      should verify before building anything physical (e.g. voltage
      compatibility, current draw, part availability).

    Return ONLY valid JSON, no markdown fences.
  `;
}

function buildSoftwarePrompt(ideaDescription: string) {
  return `
    Act as a senior software engineer scoping the smallest working MVP for
    a non-technical founder's idea.

    Product idea: "${ideaDescription}"

    Return JSON with:
    - "techStack": array of objects { "layer": string (e.g. "Frontend",
      "Backend", "Database", "Auth"), "choice": string, "why": string
      (one short sentence) }
    - "folderStructure": array of strings representing a simple starter
      folder/file layout for this specific product (e.g.
      "src/pages/Login.tsx", "src/lib/api.ts") — 8-14 items, realistic to
      this idea, not generic boilerplate.
    - "firstMilestone": a single sentence describing the smallest
      end-to-end slice worth building first (one real user flow working,
      not every feature).
    - "notes": array of 2-3 short strings on realistic risks or gaps in
      this scaffold (e.g. "no payment flow included yet").

    Return ONLY valid JSON, no markdown fences.
  `;
}

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const { user, supabase } = await getAuthedUser(req);
    const { ideaId, ideaDescription, category } = await req.json();

    if (!ideaId || !ideaDescription) {
      return new Response(
        JSON.stringify({ error: "ideaId and ideaDescription are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const safeCategory: "software" | "hardware" = category === "hardware" ? "hardware" : "software";
    const prompt = safeCategory === "hardware"
      ? buildHardwarePrompt(ideaDescription)
      : buildSoftwarePrompt(ideaDescription);

    const result = await callGeminiJSON(prompt);

    await supabase.from("mvp_builds").delete().eq("idea_id", ideaId).eq("user_id", user.id);
    const { error: insertError } = await supabase.from("mvp_builds").insert({
      idea_id: ideaId,
      user_id: user.id,
      category: safeCategory,
      result,
    });
    if (insertError) console.error("Failed to save mvp build:", insertError);

    return new Response(JSON.stringify({ category: safeCategory, result }), {
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
