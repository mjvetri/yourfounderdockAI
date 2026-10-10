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

function isMissingTableError(error: any) {
  const message = error?.message || '';
  return /does not exist|relation .* does not exist|column .* does not exist/i.test(message);
}

export async function ensureDefaultCommunityChannels() {
  const { data, error } = await supabase
    .from("community_channels")
    .select("*");

  if (error) {
    console.error("Community channels error:", error);
    throw error;
  }

  console.log("Community channels loaded:", data);
  return data ?? [];
}

export async function createCommunityChannel(name: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in.");

  const trimmedName = name.trim();
  if (!trimmedName) throw new Error("Channel name cannot be empty.");

  const slug = trimmedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!slug) throw new Error("Channel name must include letters or numbers.");

  const { data, error } = await supabase
    .from("community_channels")
    .insert({
      slug,
      name: trimmedName,
      description: "A space for founder discussion.",
      sort_order: 100,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCommunityChannel(channelId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in.");

  const { error } = await supabase
    .from("community_channels")
    .delete()
    .eq("id", channelId)
    .eq("created_by", user.id);

  if (error) throw error;
}

export async function getCommunityChannels() {
  try {
    const { data, error } = await supabase
      .from("community_channels")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) {
      if (isMissingTableError(error)) return [];
      throw error;
    }
    return data ?? [];
  } catch (error: any) {
    if (isMissingTableError(error)) return [];
    throw error;
  }
}

export async function listCommunityMessages(channelId: string) {
  try {
    const { data, error } = await supabase
      .from("community_messages")
      .select("*")
      .eq("channel_id", channelId)
      .order("created_at", { ascending: true });
    if (error) {
      if (isMissingTableError(error)) return [];
      throw error;
    }
    return data ?? [];
  } catch (error: any) {
    if (isMissingTableError(error)) return [];
    throw error;
  }
}

export async function getLatestCommunityMessage(channelId: string) {
  try {
    const { data, error } = await supabase
      .from("community_messages")
      .select("*")
      .eq("channel_id", channelId)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) {
      if (isMissingTableError(error)) return null;
      throw error;
    }
    return data?.[0] ?? null;
  } catch (error: any) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
}

export async function createCommunityMessage(channelId: string, body: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in.");

    const trimmed = body.trim();
    if (!trimmed) throw new Error("Message cannot be empty.");

    const { data: profile } = await supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    const { data, error } = await supabase
      .from("community_messages")
      .insert({
        channel_id: channelId,
        user_id: user.id,
        sender_name: profile?.name || "Founder",
        sender_avatar: profile?.avatar_url || null,
        body: trimmed,
      })
      .select()
      .single();
    if (error) {
      if (isMissingTableError(error)) {
        throw new Error("Community tables are not available yet. Please run the Supabase migration.");
      }
      throw error;
    }
    return data;
  } catch (error: any) {
    if (isMissingTableError(error)) {
      throw new Error("Community tables are not available yet. Please run the Supabase migration.");
    }
    throw error;
  }
}

export async function listBlockedUsers() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("community_blocks")
      .select("*")
      .eq("blocker_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      if (isMissingTableError(error)) return [];
      throw error;
    }
    return data ?? [];
  } catch (error: any) {
    if (isMissingTableError(error)) return [];
    throw error;
  }
}

export async function blockUser(blockedId: string, blockedName?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in.");

  try {
    const { error } = await supabase
      .from("community_blocks")
      .upsert({
        blocker_id: user.id,
        blocked_id: blockedId,
        blocked_name: blockedName || null,
        created_at: new Date().toISOString(),
      }, { onConflict: "blocker_id,blocked_id" });
    if (error) {
      if (isMissingTableError(error)) {
        throw new Error("Community tables are not available yet. Please run the Supabase migration.");
      }
      throw error;
    }
  } catch (error: any) {
    if (isMissingTableError(error)) {
      throw new Error("Community tables are not available yet. Please run the Supabase migration.");
    }
    throw error;
  }
}

export async function unblockUser(blockedId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in.");

  try {
    const { error } = await supabase
      .from("community_blocks")
      .delete()
      .eq("blocker_id", user.id)
      .eq("blocked_id", blockedId);
    if (error) {
      if (isMissingTableError(error)) {
        throw new Error("Community tables are not available yet. Please run the Supabase migration.");
      }
      throw error;
    }
  } catch (error: any) {
    if (isMissingTableError(error)) {
      throw new Error("Community tables are not available yet. Please run the Supabase migration.");
    }
    throw error;
  }
}

export async function reportCommunityMessage(messageId: string, reason: "spam" | "abusive" | "other" = "spam") {
  try {
    const { error } = await supabase.rpc("report_community_message", {
      p_message_id: messageId,
      p_reason: reason,
    });
    if (error) {
      if (isMissingTableError(error) || /function .* does not exist/i.test(error.message || '')) {
        throw new Error("Community moderation functions are not available yet. Please run the Supabase migration.");
      }
      throw error;
    }
  } catch (error: any) {
    if (isMissingTableError(error) || /function .* does not exist/i.test(error.message || '')) {
      throw new Error("Community moderation functions are not available yet. Please run the Supabase migration.");
    }
    throw error;
  }
}

export function subscribeToCommunityMessages(
  channelId: string,
  onInsert: (message: any) => void
) {
  const subscription = supabase.channel(`community:${channelId}`);

  subscription.on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "community_messages",
      filter: `channel_id=eq.${channelId}`,
    },
    (payload) => {
      onInsert(payload.new);
    }
  );

  subscription.subscribe();
  return subscription;
}

export function subscribeToCommunityPresence(
  userId: string,
  onPresenceSync: (state: Record<string, any[]>) => void,
  onError: (error: Error) => void
) {
  const presenceChannel = supabase.channel("founder-community-presence", {
    config: { presence: { key: userId } },
  });

  presenceChannel
    .on("presence", { event: "sync" }, () => {
      onPresenceSync(presenceChannel.presenceState());
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        try {
          const trackStatus = await presenceChannel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
          if (trackStatus !== "ok") {
            onError(new Error(`Could not publish community presence: ${trackStatus}`));
          }
        } catch (error) {
          onError(error instanceof Error ? error : new Error("Could not publish community presence."));
        }
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        onError(new Error(`Community presence connection ${status.toLowerCase().replace("_", " ")}.`));
      }
    });

  return presenceChannel;
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
    ...ideas.map((item: any) => ({ label: `New idea: ${item.title}`, time: item.created_at, type: 'idea' })),
    ...tasks
      .filter((item: any) => item.status === 'done')
      .map((item: any) => ({ label: `Completed: ${item.title}`, time: item.created_at, type: 'completed' })),
    ...chats.map((item: any) => ({ label: 'New AI Chat Session', time: item.created_at, type: 'chat' })),
  ]
    .filter((activity) => activity.time)
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 4);

  const activityEvents = [...ideas, ...tasks, ...chats].filter((item: any) => item.created_at);
  const weeklyActivity = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - offset));
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    return {
      day: date.toLocaleDateString(undefined, { weekday: 'short' }),
      count: activityEvents.filter((item: any) => {
        const timestamp = new Date(item.created_at).getTime();
        return timestamp >= date.getTime() && timestamp < nextDate.getTime();
      }).length,
    };
  });

  return {
    activeProjects: ideas.length,
    tasksDone,
    tasksTotal: tasks.length,
    upcomingMilestones,
    recentActivity,
    weeklyActivity,
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

// ---------------------------------------------------------------------------
// Go-to-market strategy
// ---------------------------------------------------------------------------
export async function getOrCreateGtmStrategy(ideaId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in.");
  const { data: existing, error: existingError } = await supabase.from("gtm_strategies").select("*").eq("idea_id", ideaId).eq("user_id", user.id).maybeSingle();
  if (existingError) throw existingError;
  if (existing) return existing;
  const { data, error } = await supabase.from("gtm_strategies").insert({ user_id: user.id, idea_id: ideaId, setup: {} }).select().single();
  if (error) throw error;
  return data;
}

export async function saveGtmSetup(gtmStrategyId: string, setup: Record<string, string>) {
  const { error } = await supabase.from("gtm_strategies").update({ setup, updated_at: new Date().toISOString() }).eq("id", gtmStrategyId);
  if (error) throw error;
}

export async function generateGtmStrategy(gtmStrategyId: string, ideaId: string, setup: Record<string, string>) {
  const { data, error } = await supabase.functions.invoke("generate-gtm-strategy", { body: { gtmStrategyId, ideaId, setup } });
  if (error) throw error;
  return data.strategy;
}

export async function updateChannelStatus(gtmStrategyId: string, strategy: any, channelIndex: number, status: string) {
  const updated = { ...strategy, channels: strategy.channels.map((channel: any, index: number) => index === channelIndex ? { ...channel, status } : channel) };
  const { error } = await supabase.from("gtm_strategies").update({ strategy: updated, updated_at: new Date().toISOString() }).eq("id", gtmStrategyId);
  if (error) throw error;
  return updated;
}

export async function toggleFirst100Task(gtmStrategyId: string, strategy: any, phaseIndex: number, taskIndex: number) {
  const updated = { ...strategy, first100: strategy.first100.map((phase: any, index: number) => index === phaseIndex ? { ...phase, tasks: phase.tasks.map((task: any, taskI: number) => taskI === taskIndex ? { ...task, done: !task.done } : task) } : phase) };
  const { error } = await supabase.from("gtm_strategies").update({ strategy: updated, updated_at: new Date().toISOString() }).eq("id", gtmStrategyId);
  if (error) throw error;
  return updated;
}

export async function addGtmTaskToRoadmap(ideaId: string, taskTitle: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in.");
  const { data: phase, error: phaseError } = await supabase.from("roadmap_items").select("*").eq("idea_id", ideaId).eq("user_id", user.id).eq("phase", "Go-To-Market").maybeSingle();
  if (phaseError) throw phaseError;
  if (phase) {
    const { error } = await supabase.from("roadmap_items").update({ tasks: [...(phase.tasks || []), { title: taskTitle, desc: "", done: false }] }).eq("id", phase.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("roadmap_items").insert({ idea_id: ideaId, user_id: user.id, phase: "Go-To-Market", tasks: [{ title: taskTitle, desc: "", done: false }] });
    if (error) throw error;
  }
}
