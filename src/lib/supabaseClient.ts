import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;

// Supabase renamed the public-facing key from "anon key" to "publishable
// key" on newer projects (prefixed sb_publishable_...). This accepts
// either name so it works whichever your dashboard shows you.
const supabaseKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string);

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY — set them in .env.local"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);