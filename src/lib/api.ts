import { supabase } from "./supabaseClient";

const FILES_BUCKET = "founder-files";

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

export async function createServiceLead(sessionId: string | null, reason: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in.");

  const { error } = await supabase.from("service_leads").insert({
    user_id: user.id,
    session_id: sessionId,
    reason,
  });
  if (error) throw error;
}

export async function createCanvas(type: 'lean' | 'vision' | 'team', title: string, data: Record<string, string>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in.");
  const { data: row, error } = await supabase
    .from("canvases")
    .insert({ user_id: user.id, type, title, data })
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function updateCanvasData(canvasId: string, data: Record<string, string>, title?: string) {
  const updates: { data: Record<string, string>; updated_at: string; title?: string } = {
    data,
    updated_at: new Date().toISOString(),
  };
  if (title) updates.title = title;
  const { error } = await supabase.from("canvases").update(updates).eq("id", canvasId);
  if (error) throw error;
}

export async function listCanvases(type: 'lean' | 'vision' | 'team') {
  const { data, error } = await supabase
    .from("canvases")
    .select("*")
    .eq("type", type)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function analyzeCanvas(canvasId: string, type: 'lean' | 'vision' | 'team', data: Record<string, string>) {
  const { data: result, error } = await supabase.functions.invoke("analyze-canvas", {
    body: { canvasId, type, data },
  });
  if (error) throw error;
  return result.analysis;
}

export async function deleteCanvas(canvasId: string) {
  const { error } = await supabase.from("canvases").delete().eq("id", canvasId);
  if (error) throw error;
}

export async function getMyProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateMyProfile(name: string, bio: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in.");

  const { error } = await supabase
    .from("profiles")
    .update({ name, bio })
    .eq("id", user.id);
  if (error) throw error;
}

export async function uploadAvatar(file: File) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in.");

  const ext = file.name.split('.').pop();
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
  const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);
  if (updateError) throw updateError;

  return avatarUrl;
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

export async function createChatSession() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in.");

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({ user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listChatSessions() {
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getSessionMessages(sessionId: string) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function sendMessageToSession(sessionId: string, message: string) {
  const { data, error } = await supabase.functions.invoke("founder-chat", {
    body: { sessionId, message },
  });
  if (error) throw error;
  return data.reply as string;
}

export async function deleteChatSession(sessionId: string) {
  const { error } = await supabase.from("chat_sessions").delete().eq("id", sessionId);
  if (error) throw error;
}

export async function createNotification(type: string, title: string, message: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from("notifications").insert({ user_id: user.id, type, title, message });
  if (error) throw error;
}

export async function listNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
  if (error) throw error;
}

export async function markAllNotificationsRead() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);
  if (error) throw error;
}

export async function deleteNotification(id: string) {
  const { error } = await supabase.from("notifications").delete().eq("id", id);
  if (error) throw error;
}

export async function getDashboardStats() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in.");

  const [ideasRes, tasksRes, chatRes] = await Promise.all([
    supabase.from("ideas").select("id, title, created_at").eq("user_id", user.id),
    supabase.from("kanban_tasks").select("id, title, status, created_at").eq("user_id", user.id),
    supabase.from("chat_messages").select("id, created_at").eq("user_id", user.id).eq("role", "user"),
  ]);

  if (ideasRes.error) throw ideasRes.error;
  if (tasksRes.error) throw tasksRes.error;
  if (chatRes.error) throw chatRes.error;

  const ideas = ideasRes.data || [];
  const tasks = tasksRes.data || [];
  const chats = chatRes.data || [];
  const tasksDone = tasks.filter((task: any) => task.status === 'done').length;
  const upcomingMilestones = tasks.filter((task: any) => task.status !== 'done').length;

  const recentActivity = [
    ...ideas.map((item: any) => ({ label: `New idea: ${item.title}`, time: item.created_at })),
    ...tasks
      .filter((item: any) => item.status === 'done')
      .map((item: any) => ({ label: `Completed: ${item.title}`, time: item.created_at })),
    ...chats.map((item: any) => ({ label: 'New AI Chat Session', time: item.created_at })),
  ]
    .filter((activity) => activity.time)
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 4);

  return {
    activeProjects: ideas.length,
    tasksDone,
    tasksTotal: tasks.length,
    upcomingMilestones,
    recentActivity,
  };
}

export async function listKanbanTasks() {
  const { data, error } = await supabase
    .from("kanban_tasks")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createKanbanTask(
  tag: string,
  title: string,
  status: 'todo' | 'in-progress' | 'done' = 'todo'
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in.");

  const { data, error } = await supabase
    .from("kanban_tasks")
    .insert({ user_id: user.id, tag, title, status })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateKanbanTaskStatus(
  taskId: string,
  status: 'todo' | 'in-progress' | 'done'
) {
  const { error } = await supabase
    .from("kanban_tasks")
    .update({ status })
    .eq("id", taskId);
  if (error) throw error;
}

export async function deleteKanbanTask(taskId: string) {
  const { error } = await supabase
    .from("kanban_tasks")
    .delete()
    .eq("id", taskId);
  if (error) throw error;
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

export async function saveRoadmapNextSteps(
  ideaId: string,
  nextSteps: { title: string; desc: string; done: boolean }[]
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in.");

  const { data, error } = await supabase
    .from("roadmap_items")
    .insert({
      idea_id: ideaId,
      user_id: user.id,
      phase: "Immediate Next Steps",
      tasks: nextSteps,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function recalculateIdeaProgress(ideaId: string) {
  const rows = await getRoadmap(ideaId);
  const allTasks = (rows ?? []).flatMap((row: any) => Array.isArray(row.tasks) ? row.tasks : []);
  const done = allTasks.filter((task: any) => task.done).length;
  const progress = allTasks.length > 0 ? Math.round((done / allTasks.length) * 100) : 0;

  const { error } = await supabase
    .from("ideas")
    .update({ progress })
    .eq("id", ideaId);
  if (error) throw error;
  return progress;
}

// Uploads a real file to Storage and records it in the files table.
export async function uploadFile(file: File, ideaId?: string | null) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in to upload files.");

  const storagePath = `${user.id}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from(FILES_BUCKET)
    .upload(storagePath, file);
  if (uploadError) throw uploadError;

  const { data, error: insertError } = await supabase
    .from("files")
    .insert({
      user_id: user.id,
      idea_id: ideaId ?? null,
      file_name: file.name,
      storage_path: storagePath,
      file_type: file.type,
      size_bytes: file.size,
    })
    .select()
    .single();

  if (insertError) {
    await supabase.storage.from(FILES_BUCKET).remove([storagePath]);
    throw insertError;
  }

  return data;
}

export async function listFiles() {
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getFileUrl(storagePath: string) {
  const { data, error } = await supabase.storage
    .from(FILES_BUCKET)
    .createSignedUrl(storagePath, 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteFile(fileId: string, storagePath: string) {
  const { error: storageError } = await supabase.storage
    .from(FILES_BUCKET)
    .remove([storagePath]);
  if (storageError) throw storageError;

  const { error: dbError } = await supabase.from("files").delete().eq("id", fileId);
  if (dbError) throw dbError;
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
