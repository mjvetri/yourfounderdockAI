import { corsHeaders, handleOptions } from "../_shared/cors.ts";
import { callGeminiChat } from "../_shared/gemini.ts";
import { getAuthedUser } from "../_shared/auth.ts";

// POST body: { ideaId: string | null, message: string }
// Loads prior chat history for this idea from the DB, sends it + the new
// message to Gemini, then saves both the user message and the reply.

const SYSTEM_INSTRUCTION =
  "You are FounderBot, a specialized AI assistant helping startup founders build MVPs. Be concise, encouraging, and technically accurate. Focus on Lean Startup methodology.";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const { user, supabase } = await getAuthedUser(req);
    const { ideaId, message } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "message is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Pull recent history for this idea (last 20 messages) to give Gemini context.
    let history: { role: string; parts: { text: string }[] }[] = [];
    if (ideaId) {
      const { data: rows } = await supabase
        .from("chat_messages")
        .select("role, text")
        .eq("idea_id", ideaId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(20);

      history = (rows ?? []).map((r) => ({
        role: r.role,
        parts: [{ text: r.text }],
      }));
    }

    const reply = await callGeminiChat(history, message, SYSTEM_INSTRUCTION);

    // Save both turns.
    await supabase.from("chat_messages").insert([
      { idea_id: ideaId ?? null, user_id: user.id, role: "user", text: message },
      { idea_id: ideaId ?? null, user_id: user.id, role: "model", text: reply },
    ]);

    return new Response(JSON.stringify({ reply }), {
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
