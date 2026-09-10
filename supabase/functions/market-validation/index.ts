import { corsHeaders, handleOptions } from "../_shared/cors.ts";
import { callGeminiJSON } from "../_shared/gemini.ts";
import { getAuthedUser } from "../_shared/auth.ts";

type ValidationType = "competitors" | "interviews" | "surveys" | "landing";

// POST body: { type: ValidationType, idea: string }
function buildPrompt(type: ValidationType, idea: string): string {
  switch (type) {
    case "competitors":
      return `Analyze potential competitors for this startup idea: "${idea}".
        Return a JSON object with:
        - "competitors": Array of objects { "name": string, "strength": string, "weakness": string }.
        - "marketGap": String describing the opportunity.
        - "differentiationStrategy": String advice on how to win.
        Return ONLY valid JSON.`;
    case "interviews":
      return `Create a customer interview guide for this idea: "${idea}".
        Return a JSON object with:
        - "targetPersona": Description of the ideal interviewee.
        - "warmUpQuestions": Array of 3 ice-breaker questions.
        - "problemValidationQuestions": Array of 5 deep-dive questions to validate the pain point.
        - "solutionQuestions": Array of 3 questions to test the solution fit.
        Return ONLY valid JSON.`;
    case "surveys":
      return `Create a market validation survey for this idea: "${idea}".
        Return a JSON object with:
        - "surveyTitle": Catchy title.
        - "questions": Array of objects { "question": string, "type": "multiple-choice" | "text" | "rating", "options": string[] (optional) }.
        Return ONLY valid JSON.`;
    case "landing":
      return `Generate copy for a landing page to test this idea: "${idea}".
        Return a JSON object with:
        - "headline": A high-converting H1.
        - "subheadline": A compelling H2.
        - "benefits": Array of 3 key benefits with titles and descriptions.
        - "cta": A strong Call to Action text.
        - "heroImagePrompt": A text prompt to generate a hero image.
        Return ONLY valid JSON.`;
  }
}

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    await getAuthedUser(req); // just verifying the caller is logged in
    const { type, idea } = await req.json();

    const validTypes: ValidationType[] = ["competitors", "interviews", "surveys", "landing"];
    if (!validTypes.includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid type." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!idea || typeof idea !== "string") {
      return new Response(JSON.stringify({ error: "idea is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await callGeminiJSON(buildPrompt(type, idea));

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
