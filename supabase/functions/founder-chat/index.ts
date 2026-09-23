import { corsHeaders, handleOptions } from "../_shared/cors.ts";
import { callGeminiChat } from "../_shared/gemini.ts";
import { getAuthedUser } from "../_shared/auth.ts";

const SYSTEM_INSTRUCTION =
  "You are DockMind, a specialized AI assistant helping startup founders build MVPs. Be concise, encouraging, and technically accurate. Focus on Lean Startup methodology.";

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
    const reply = await callGeminiChat(history, message, SYSTEM_INSTRUCTION);

    const { error: messageError } = await supabase.from("chat_messages").insert([
      { session_id: sessionId, user_id: user.id, role: "user", text: message },
      { session_id: sessionId, user_id: user.id, role: "model", text: reply },
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
