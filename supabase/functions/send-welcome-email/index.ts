import { corsHeaders, handleOptions } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const payload = await req.json();
    const record = payload.record;

    if (!record?.email) {
      return new Response(JSON.stringify({ error: "No email on this profile row." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured.");
    }

    const name = record.name || "there";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "YourFounderDock <onboarding@resend.dev>",
        to: record.email,
        subject: "Welcome to YourFounderDock",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Welcome aboard, ${name}!</h2>
            <p>Your FounderDock account is ready. Here's what to do first:</p>
            <ol>
              <li>Add your first startup idea</li>
              <li>Get an instant AI validation score</li>
              <li>Generate a roadmap and start building</li>
            </ol>
            <p style="margin-top: 24px;">
              <a href="https://yourdomain.com/dashboard" style="background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">
                Go to your dashboard
              </a>
            </p>
            <p style="color:#888; font-size:12px; margin-top:32px;">If you didn't create this account, you can ignore this email.</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend error:", errText);
      return new Response(JSON.stringify({ error: errText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
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
