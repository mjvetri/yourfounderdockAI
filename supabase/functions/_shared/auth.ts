import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

// Verifies the caller's JWT (forwarded from the frontend's Authorization
// header) and returns the authenticated user + a client scoped to them.
// Supabase already rejects the request before it reaches your function if
// verify_jwt = true in config.toml, so this just gives you the user's id
// so you can attach it to rows you write (ideas, validations, etc).
export async function getAuthedUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) throw new Error("Missing Authorization header.");

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error("Invalid or expired session.");

  return { user, supabase };
}
