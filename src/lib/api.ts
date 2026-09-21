import { supabase } from "./supabaseClient";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// ---------------------------------------------------------------------------
// Ideas (the "kernel object")
// ---------------------------------------------------------------------------
export async function createIdea(title: string, description: string, category: "software" | "hardware") {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in to create an idea.");

  const { data, error } = await supabase
    .from("ideas")
    .insert({ title, description, category, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listIdeas() {
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateIdeaStatus(ideaId: string, status: string, progress?: number) {
  const { error } = await supabase
    .from("ideas")
    .update({ status, ...(progress !== undefined ? { progress } : {}) })
    .eq("id", ideaId);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// AI calls — these hit our own Edge Functions, never Gemini directly.
// The user's session token is attached automatically by supabase.functions.invoke.
// ---------------------------------------------------------------------------

// Replaces generateMVPAdvice(ideaDescription)
export async function generateMVPAdvice(ideaDescription: string, ideaId?: string) {
  const { data, error } = await supabase.functions.invoke("validate-idea", {
    body: { ideaDescription, ideaId },
  });
  if (error) throw error;
  return data; // { verdict, verdictSummary, techStack, risks, nextSteps }
}

// Replaces generateMarketValidation(type, idea)
export async function generateMarketValidation(
  type: "competitors" | "interviews" | "surveys" | "landing",
  idea: string
) {
  const { data, error } = await supabase.functions.invoke("market-validation", {
    body: { type, idea },
  });
  if (error) throw error;
  return data;
}

// Replaces chatWithFounderBot(history, message)
// Note: history is now loaded server-side from the DB by ideaId, so the
// frontend just sends the new message.
export async function chatWithFounderBot(ideaId: string | null, message: string) {
  const { data, error } = await supabase.functions.invoke("founder-chat", {
    body: { ideaId, message },
  });
  if (error) throw error;
  return data.reply as string;
}

// ---------------------------------------------------------------------------
// Roadmap — add these to your existing src/lib/api.ts (don't replace the
// whole file, just add these functions alongside what's already there)
// ---------------------------------------------------------------------------

export async function generateRoadmap(
  ideaId: string,
  ideaDescription: string,
  category: "software" | "hardware"
) {
  const { data, error } = await supabase.functions.invoke("generate-roadmap", {
    body: { ideaId, ideaDescription, category },
  });
  if (error) throw error;
  return data.phases as {
    title: string;
    status: string;
    items: { title: string; desc: string; done: boolean }[];
  }[];
}

export async function getRoadmap(ideaId: string) {
  const { data, error } = await supabase
    .from("roadmap_items")
    .select("*")
    .eq("idea_id", ideaId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function toggleRoadmapTask(
  roadmapItemId: string,
  tasks: { title: string; desc: string; done: boolean }[],
  taskIndex: number
) {
  const updated = tasks.map((t, i) => (i === taskIndex ? { ...t, done: !t.done } : t));
  const { error } = await supabase
    .from("roadmap_items")
    .update({ tasks: updated })
    .eq("id", roadmapItemId);
  if (error) throw error;
  return updated;
}
