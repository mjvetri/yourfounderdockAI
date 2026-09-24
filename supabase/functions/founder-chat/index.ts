import { corsHeaders, handleOptions } from "../_shared/cors.ts";
import { callGeminiChat } from "../_shared/gemini.ts";
import { getAuthedUser } from "../_shared/auth.ts";

const HELP_SIGNAL_PATTERNS = [
  /i don'?t know how/i,
  /i can'?t (do|build|make) this/i,
  /i don'?t have (?:a )?team/i,
  /i don'?t have (the )?(skills|resources|tools|time)/i,
  /this is too (hard|difficult|complicated)/i,
  /i'?m (stuck|overwhelmed|lost)/i,
];

function detectsHelpSignal(message: string): string | null {
  for (const pattern of HELP_SIGNAL_PATTERNS) {
    if (pattern.test(message)) {
      return message.length > 80 ? message.slice(0, 80) + "…" : message;
    }
  }
  return null;
}

const SYSTEM_INSTRUCTION = `You are DockMind, an AI MVP engineering partner. Your ONLY job is helping founders build their MVP — nothing else.

SCOPE — you help with:
- Software MVPs: tech stack choices, architecture decisions, database schema design, writing actual code snippets, debugging errors, API design, and step-by-step "how do I build X" guidance.
- Hardware MVPs: component selection, wiring/connection guidance, firmware code, and troubleshooting circuits or prototypes.
- Both: breaking a feature down into buildable steps, and telling the founder exactly what to do next.

OUT OF SCOPE — if asked about anything unrelated to building their MVP (general chit-chat, unrelated advice, topics with no connection to software/hardware product development), politely decline and redirect: "I'm focused specifically on helping you build your MVP — happy to help with your tech stack, code, or hardware wiring instead."

OUTPUT FORMAT RULES (important — the chat UI renders these specially):
- When you provide code, always wrap it in a fenced code block with the language tag on its own line, using three backticks before and after the code, with the language name right after the opening backticks (for example, a fence tagged javascript, or one tagged python).
- When a hardware question calls for a wiring/circuit diagram, provide it as a fenced block tagged circuit containing ONLY a JSON array, no other text inside that block. Each item must have exactly these keys: "from" (component and pin, e.g. "Soil Sensor VCC"), "to" (component and pin, e.g. "ESP32 3.3V"), and "label" (the connection type, e.g. "3.3V" or "GPIO14"). Example: a fenced block tagged circuit containing [{"from":"Sensor VCC","to":"ESP32 3.3V","label":"Power"},{"from":"Sensor GND","to":"ESP32 GND","label":"Ground"}]
- If the founder asks to add a component to a circuit you already described earlier in this conversation, respond with the COMPLETE updated circuit (all previous connections plus the new one), not just the new addition — so the diagram always shows the full current circuit.
- If the founder expresses that they lack a team, don't know how to build something themselves, or don't have the resources/skills to execute (e.g. "I don't have a team", "I don't know how to do this", "I don't have the tools for this"), do NOT just reassure them. Instead, respond briefly and warmly, then include a fenced block tagged service-offer containing ONLY this JSON: {"reason": "a short phrase summarizing what they said they can't do"}. Only do this once per topic — don't repeat the offer if you already made it earlier in this conversation for the same issue.
- For hardware answers, always include a short note reminding the founder to verify voltage/current compatibility before powering anything — you are a planning aid, not a certified schematic.
- Keep prose concise and actionable. Prefer numbered steps over long paragraphs when explaining a process.
`;

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const { user, supabase } = await getAuthedUser(req);
    const { sessionId, message } = await req.json();

    if (!sessionId || !message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "sessionId and message are required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("id, title")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();
    if (sessionError || !session) {
      return new Response(JSON.stringify({ error: "Chat session not found." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: rows, error: historyError } = await supabase
      .from("chat_messages")
      .select("role, text")
      .eq("session_id", sessionId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(30);
    if (historyError) throw historyError;

    const history = (rows ?? []).map((row) => ({
      role: row.role,
      parts: [{ text: row.text }],
    }));
    const helpSignal = detectsHelpSignal(message);
    let reply: string;
    try {
      reply = await callGeminiChat(history, message, SYSTEM_INSTRUCTION);
    } catch (error) {
      if (!helpSignal) throw error;
      reply = "Our YourFounder team can build this for you. Kindly reach us at yourfounder@team.com so we can help you get started.";
    }

    let finalReply = reply;
    if (helpSignal && !reply.includes("service-offer")) {
      finalReply += `\n\n\`\`\`service-offer\n${JSON.stringify({ reason: helpSignal })}\n\`\`\``;
    }

    const { error: messageError } = await supabase.from("chat_messages").insert([
      { session_id: sessionId, user_id: user.id, role: "user", text: message },
      { session_id: sessionId, user_id: user.id, role: "model", text: finalReply },
    ]);
    if (messageError) throw messageError;

    if (session.title === "New Chat") {
      const autoTitle = message.slice(0, 45) + (message.length > 45 ? "..." : "");
      await supabase.from("chat_sessions").update({ title: autoTitle }).eq("id", sessionId);
    }
    await supabase
      .from("chat_sessions")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", sessionId);

    return new Response(JSON.stringify({ reply: finalReply }), {
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
