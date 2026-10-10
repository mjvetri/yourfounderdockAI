import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Ban, Flag, Hash, Loader2, MessageSquare, MoreHorizontal, Plus, Send, ShieldAlert, Smile, Trash2, UserX, X } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { supabase } from '../../../lib/supabaseClient';
import {
  blockUser,
  createCommunityChannel,
  createCommunityMessage,
  deleteCommunityChannel,
  ensureDefaultCommunityChannels,
  getLatestCommunityMessage,
  getCurrentUser,
  listBlockedUsers,
  listCommunityMessages,
  reportCommunityMessage,
  subscribeToCommunityPresence,
  subscribeToCommunityMessages,
  unblockUser,
} from '../../../lib/api';

type CommunityChannel = {
  id: string;
  name: string;
  slug: string;
  created_by?: string | null;
  description?: string | null;
  sort_order?: number;
};

type CommunityMessage = {
  id: string;
  channel_id: string;
  user_id: string;
  sender_name: string;
  sender_avatar?: string | null;
  body: string;
  created_at: string;
};

type CommunityBlock = {
  blocked_id: string;
  blocked_name?: string | null;
  created_at?: string;
};

function isMissingCommunitySchemaError(error: any) {
  const message = error?.message || '';
  return /community_.* does not exist|does not exist|relation .* does not exist/i.test(message);
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Just now';
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export default function CommunityPage() {
  const [channels, setChannels] = useState<CommunityChannel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [messagesByChannel, setMessagesByChannel] = useState<Record<string, CommunityMessage[]>>({});
  const [unreadByChannel, setUnreadByChannel] = useState<Record<string, number>>({});
  const [blockedUsers, setBlockedUsers] = useState<CommunityBlock[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [error, setError] = useState('');
  const [showChannelForm, setShowChannelForm] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [addingChannel, setAddingChannel] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);
  const [messageActionsId, setMessageActionsId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const selectedChannelIdRef = useRef(selectedChannelId);
  const mobileChatOpenRef = useRef(mobileChatOpen);
  selectedChannelIdRef.current = selectedChannelId;
  mobileChatOpenRef.current = mobileChatOpen;

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const channelRows = await ensureDefaultCommunityChannels();
        if (!active) return;

        const nextChannels = (channelRows ?? []) as CommunityChannel[];
        setChannels(nextChannels);
        setSelectedChannelId((current) => current ?? nextChannels[0]?.id ?? null);
        if (nextChannels.length === 0) {
          setError('No community channels are available. Refresh the page or check the Supabase channel access configuration.');
        }

        try {
          const blockedRows = await listBlockedUsers();
          if (!active) return;
          setBlockedUsers((blockedRows ?? []) as CommunityBlock[]);
        } catch (blockedErr: any) {
          if (isMissingCommunitySchemaError(blockedErr)) {
            setBlockedUsers([]);
            return;
          }
          throw blockedErr;
        }
      } catch (err: any) {
        if (active) {
          setError(isMissingCommunitySchemaError(err)
            ? 'The community tables are not available in your Supabase project yet. Please run the migration to enable Network rooms .'
            : (err?.message || 'Unable to load Network rooms.'));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    let presenceChannel: ReturnType<typeof subscribeToCommunityPresence> | null = null;

    const joinCommunityPresence = async () => {
      try {
        const user = await getCurrentUser();
        if (!active) return;
        if (!user) {
          setCurrentUserId(null);
          setOnlineCount(0);
          return;
        }

        setCurrentUserId(user.id);
        presenceChannel = subscribeToCommunityPresence(
          user.id,
          (state) => {
            if (active) setOnlineCount(Object.keys(state).length);
          },
          (presenceError) => {
            if (active) setError(presenceError.message);
          }
        );
      } catch (presenceError) {
        if (active) {
          setError(presenceError instanceof Error
            ? presenceError.message
            : 'Unable to connect to community presence.');
        }
      }
    };

    void joinCommunityPresence();
    return () => {
      active = false;
      if (presenceChannel) {
        void supabase.removeChannel(presenceChannel);
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedChannelId) return;

    let active = true;

    const loadMessages = async () => {
      try {
        const rows = await listCommunityMessages(selectedChannelId);
        if (active) {
          const channelMessages = (rows ?? []) as CommunityMessage[];
          setMessages(channelMessages);
          setMessagesByChannel((current) => ({ ...current, [selectedChannelId]: channelMessages }));
        }
      } catch (err: any) {
        if (active) {
          setError(isMissingCommunitySchemaError(err)
            ? 'The community tables are not available in your Supabase project yet. Please run the migration to enable Network rooms .'
            : (err?.message || 'Unable to load messages for this channel.'));
        }
      }
    };

    loadMessages();

    return () => {
      active = false;
    };
  }, [selectedChannelId]);

  useEffect(() => {
    if (channels.length === 0) return;

    let active = true;
    const loadChannelPreviews = async () => {
      try {
        const previews = await Promise.all(
          channels.map(async (channel) => [channel.id, await getLatestCommunityMessage(channel.id)] as const)
        );
        if (!active) return;

        setMessagesByChannel((current) => {
          let changed = false;
          const updated = { ...current };
          previews.forEach(([channelId, message]) => {
            if (message && !(current[channelId]?.length)) {
              updated[channelId] = [message as CommunityMessage];
              changed = true;
            }
          });
          return changed ? updated : current;
        });
      } catch (err: any) {
        if (active) setError(err?.message || 'Unable to load channel previews.');
      }
    };

    void loadChannelPreviews();
    return () => {
      active = false;
    };
  }, [channels]);

  useEffect(() => {
    const subscriptions = channels.map((channel) =>
      subscribeToCommunityMessages(channel.id, (incoming) => {
        const message = incoming as CommunityMessage;
        setMessagesByChannel((current) => {
          const channelMessages = current[channel.id] ?? [];
          if (channelMessages.some((item) => item.id === message.id)) return current;
          const updatedMessages = [...channelMessages, message];
          if (selectedChannelIdRef.current === channel.id) setMessages(updatedMessages);
          return { ...current, [channel.id]: updatedMessages };
        });

        const currentConversationVisible = selectedChannelIdRef.current === channel.id
          && (window.matchMedia('(min-width: 1024px)').matches || mobileChatOpenRef.current);
        if (!currentConversationVisible) {
          setUnreadByChannel((current) => ({ ...current, [channel.id]: (current[channel.id] ?? 0) + 1 }));
        }
      })
    );

    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }, [channels]);

  const activeChannel = channels.find((channel) => channel.id === selectedChannelId) ?? channels[0] ?? null;
  const blockedIds = blockedUsers.map((blockedUser) => blockedUser.blocked_id);
  const visibleMessages = messages.filter((message) => !blockedIds.includes(message.user_id));

  const handleSend = async () => {
    if (!selectedChannelId) {
      setError('No community channel is available. Refresh the page, and contact support if this continues.');
      return;
    }
    if (!draft.trim()) return;

    setSending(true);
    setError('');

    try {
      await createCommunityMessage(selectedChannelId, draft.trim());
      setDraft('');
    } catch (err: any) {
      setError(err?.message || 'Unable to send your message.');
    } finally {
      setSending(false);
    }
  };

  const handleAddChannel = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!channelName.trim()) return;

    setAddingChannel(true);
    setError('');
    try {
      const channel = await createCommunityChannel(channelName);
      setChannels((current) => [...current, channel as CommunityChannel]);
      setSelectedChannelId(channel.id);
      setMobileChatOpen(true);
      setChannelName('');
      setShowChannelForm(false);
    } catch (err: any) {
      setError(err?.code === '23505'
        ? 'A channel with that name already exists.'
        : (err?.message || 'Unable to create channel.'));
    } finally {
      setAddingChannel(false);
    }
  };

  const handleDeleteChannel = async (channel: CommunityChannel) => {
    if (channel.created_by !== currentUserId) return;
    if (!window.confirm(`Delete #${channel.name}? Its messages will also be deleted.`)) return;

    setError('');
    try {
      await deleteCommunityChannel(channel.id);
      const remainingChannels = channels.filter((item) => item.id !== channel.id);
      setChannels(remainingChannels);
      setMessagesByChannel((current) => {
        const { [channel.id]: _deletedMessages, ...remainingMessages } = current;
        return remainingMessages;
      });
      setUnreadByChannel((current) => {
        const { [channel.id]: _deletedUnread, ...remainingUnread } = current;
        return remainingUnread;
      });
      if (selectedChannelId === channel.id) {
        setSelectedChannelId(remainingChannels[0]?.id ?? null);
        setMessages([]);
        setMobileChatOpen(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to delete this channel.');
    }
  };

  const insertEmoji = (emoji: string) => {
    setDraft((current) => `${current}${emoji}`);
    setShowEmojiPicker(false);
  };

  const handleToggleBlock = async (userId: string, userName?: string) => {
    try {
      if (blockedIds.includes(userId)) {
        await unblockUser(userId);
        setBlockedUsers((current) => current.filter((blockedUser) => blockedUser.blocked_id !== userId));
      } else {
        await blockUser(userId, userName);
        setBlockedUsers((current) => [
          ...current,
          { blocked_id: userId, blocked_name: userName ?? null, created_at: new Date().toISOString() },
        ]);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to update moderation settings.');
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await unblockUser(userId);
      setBlockedUsers((current) => current.filter((blockedUser) => blockedUser.blocked_id !== userId));
    } catch (err: any) {
      setError(err?.message || 'Unable to unblock this user.');
    }
  };

  const handleReport = async (messageId: string) => {
    try {
      await reportCommunityMessage(messageId, 'spam');
      setError('Message reported for review.');
    } catch (err: any) {
      setError(err?.message || 'Unable to report this message.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout fullScreen>
        <div className="flex h-screen items-center justify-center pt-16">
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-7 text-center shadow-sm">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <Loader2 className="h-5 w-5 animate-spin" />
            </span>
            <p className="mt-4 font-display text-lg font-bold text-slate-900">Getting the community ready</p>
            <p className="mt-1 text-sm text-slate-500">Loading your founder channels…</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout fullScreen>
      <div className="flex h-[100dvh] min-h-0 w-full flex-col gap-3 pt-16 sm:gap-4 lg:h-screen lg:p-4 lg:pt-20">
        {error && (
          <div role="alert" className="mx-3 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700 shadow-sm sm:mx-4 lg:mx-0">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid min-h-0 flex-1 overflow-hidden border-y border-slate-200/80 bg-white shadow-sm sm:mx-4 sm:rounded-[26px] sm:border lg:mx-0 lg:grid-cols-[minmax(270px,26%)_minmax(0,1fr)]">
          <aside className={`min-h-0 flex-col border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/70 p-4 sm:p-5 lg:border-b-0 lg:border-r ${mobileChatOpen ? 'hidden lg:flex' : 'flex'}`}>
            <div className="mb-5 flex items-center justify-between px-1">
              <h2 className="font-display text-base font-bold text-slate-900">Channels</h2>
              <button
                type="button"
                onClick={() => setShowChannelForm((show) => !show)}
                aria-label={showChannelForm ? 'Close new channel form' : 'Create a channel'}
                title="Create a channel"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-primary-600 hover:text-white"
              >
                {showChannelForm ? <X className="h-4 w-4" /> : <Plus className="h-5 w-5" />}
              </button>
            </div>

            {showChannelForm && (
              <form onSubmit={handleAddChannel} className="mb-4 rounded-2xl border border-primary-100 bg-primary-50/60 p-3">
                <label htmlFor="new-community-channel" className="text-xs font-semibold text-slate-700">New channel</label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="new-community-channel"
                    value={channelName}
                    onChange={(event) => setChannelName(event.target.value)}
                    placeholder="e.g. Product feedback"
                    maxLength={40}
                    autoFocus
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                  <button
                    type="submit"
                    disabled={addingChannel || !channelName.trim()}
                    className="rounded-xl bg-primary-600 px-3 text-xs font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {addingChannel ? 'Adding' : 'Add'}
                  </button>
                </div>
              </form>
            )}

            <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto">
              {channels.map((channel) => {
                const active = channel.id === selectedChannelId;
                const channelMessages = messagesByChannel[channel.id] ?? [];
                const latestMessage = channelMessages[channelMessages.length - 1];
                const unreadCount = unreadByChannel[channel.id] ?? 0;
                return (
                  <div
                    key={channel.id}
                    className={`group relative flex w-full items-stretch overflow-hidden rounded-[20px] border transition-all duration-200 ${
                      active
                        ? 'border-primary-100 bg-gradient-to-r from-violet-100 to-indigo-50 shadow-sm'
                        : 'border-transparent bg-white/70 hover:border-slate-100 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedChannelId(channel.id);
                        setMobileChatOpen(true);
                        setUnreadByChannel((current) => ({ ...current, [channel.id]: 0 }));
                      }}
                      aria-pressed={active}
                      className="min-w-0 flex-1 p-3.5 text-left"
                    >
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                          active ? 'bg-primary-600 text-white' : 'bg-white text-slate-500 group-hover:text-primary-600'
                        }`}>
                          <Hash className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`truncate text-sm font-bold ${active ? 'text-primary-950' : 'text-slate-800'}`}>
                              {channel.name}
                            </span>
                            {unreadCount > 0 && (
                              <span aria-label={`${unreadCount} unread messages`} className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[10px] font-bold text-white">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                            {latestMessage ? `${latestMessage.sender_name}: ${latestMessage.body}` : channel.description || 'Community discussion'}
                          </p>
                        </div>
                      </div>
                    </button>
                    {channel.created_by === currentUserId && (
                      <button
                        type="button"
                        onClick={() => void handleDeleteChannel(channel)}
                        aria-label={`Delete ${channel.name} channel`}
                        title="Delete channel"
                        className="m-2 flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
              {channels.length === 0 && (
                <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-sm leading-5 text-amber-800">
                  No channels are available yet. Refresh the page to reload the community.
                </p>
              )}
            </div>
            <div className="mt-4 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowBlockedUsers((show) => !show)}
                aria-expanded={showBlockedUsers}
                className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <span>Blocked users</span>
                <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {blockedUsers.length}
                </span>
              </button>
              {showBlockedUsers && (
                <div className="mt-2 space-y-2">
                  {blockedUsers.length === 0 ? (
                    <p className="px-2 py-2 text-xs text-slate-500">You haven’t blocked anyone.</p>
                  ) : (
                    blockedUsers.map((blockedUser) => (
                      <div key={blockedUser.blocked_id} className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2">
                        <span className="truncate text-sm font-medium text-slate-700">
                          {blockedUser.blocked_name || 'Community member'}
                        </span>
                        <button
                          type="button"
                          onClick={() => void handleUnblockUser(blockedUser.blocked_id)}
                          className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold text-primary-700 transition hover:bg-primary-50"
                        >
                          Unblock
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </aside>

          <section className={`min-h-0 flex-col bg-white ${mobileChatOpen ? 'flex' : 'hidden lg:flex'}`}>
            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileChatOpen(false)}
                  aria-label="Back to channels"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 lg:hidden"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white shadow-md shadow-primary-600/20">
                  <Hash className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-xl font-bold text-slate-900">
                    {activeChannel?.name || 'Community'}
                  </h2>
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{onlineCount} online · community channel</p>
                </div>
              </div>
              <div className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-slate-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {onlineCount}
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col bg-white">
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-slate-50/60 px-4 py-5 sm:px-6 sm:py-8">
                {visibleMessages.length === 0 ? (
                  <div className="flex min-h-[300px] items-center justify-center px-4 text-center">
                    <div className="max-w-sm">
                      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 text-primary-600">
                        <MessageSquare className="h-7 w-7" />
                      </span>
                      <p className="mt-5 font-display text-lg font-bold text-slate-800">No messages yet</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Be the first founder to start the conversation.
                      </p>
                    </div>
                  </div>
                ) : (
                  visibleMessages.map((message) => (
                    <article key={message.id} className={`group flex gap-2 sm:gap-4 ${message.user_id === currentUserId ? 'flex-row-reverse' : ''}`}>
                      <div className="hidden h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-sm font-bold text-primary-700 sm:flex">
                        {message.sender_avatar ? (
                          <img src={message.sender_avatar} alt={message.sender_name} className="h-full w-full object-cover" />
                        ) : (
                          message.sender_name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className={`min-w-0 max-w-[88%] sm:max-w-[80%] ${message.user_id === currentUserId ? 'text-right' : ''}`}>
                        <div className={`mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 ${message.user_id === currentUserId ? 'justify-end' : ''}`}>
                          <p className="text-sm font-bold text-slate-900">{message.sender_name}</p>
                          <p className="text-xs font-medium text-slate-500">{formatTime(message.created_at)}</p>
                        </div>
                        <div className="relative">
                          <div className={`relative w-fit max-w-full rounded-[18px] px-4 py-3 ${message.user_id === currentUserId ? 'ml-auto rounded-tr-md bg-primary-600 text-white' : 'rounded-tl-md bg-white shadow-sm'}`}>
                            <p className={`whitespace-pre-wrap break-words text-left text-sm leading-6 ${message.user_id === currentUserId ? 'text-white' : 'text-slate-800'}`}>{message.body}</p>
                          </div>
                          <div className="absolute -bottom-2 right-1 z-10 lg:hidden">
                            <button
                              type="button"
                              onClick={() => setMessageActionsId((current) => current === message.id ? null : message.id)}
                              aria-label={`More actions for ${message.sender_name}'s message`}
                              aria-expanded={messageActionsId === message.id}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 shadow-sm"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {messageActionsId === message.id && (
                              <div className="absolute bottom-8 right-0 flex rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                                <button
                                  type="button"
                                  onClick={() => {
                                    void handleToggleBlock(message.user_id, message.sender_name);
                                    setMessageActionsId(null);
                                  }}
                                  aria-label={blockedIds.includes(message.user_id) ? 'Unblock user' : 'Block user'}
                                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                                >
                                  {blockedIds.includes(message.user_id) ? <UserX className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    void handleReport(message.id);
                                    setMessageActionsId(null);
                                  }}
                                  aria-label="Report message"
                                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-700"
                                >
                                  <Flag className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="hidden shrink-0 items-start gap-1 transition-opacity lg:flex lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(message.user_id, message.sender_name)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          title={blockedIds.includes(message.user_id) ? 'Unblock user' : 'Block user'}
                          aria-label={blockedIds.includes(message.user_id) ? 'Unblock user' : 'Block user'}
                        >
                          {blockedIds.includes(message.user_id) ? <UserX className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReport(message.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-amber-50 hover:text-amber-700"
                          title="Report message"
                          aria-label="Report message"
                        >
                          <Flag className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>

              <div className="border-t border-slate-100 bg-white px-3 py-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-8 sm:py-5">
                <div className="relative mx-auto flex max-w-4xl items-center gap-3 rounded-full border border-slate-200 bg-white p-2 shadow-[0_12px_35px_rgba(15,23,42,0.08)] focus-within:border-primary-200">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        void handleSend();
                      }
                    }}
                    placeholder="Share an update or ask the community…"
                    aria-label="Write a community message"
                    className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker((show) => !show)}
                      aria-label="Add an emoji"
                      title="Add an emoji"
                      className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-primary-600"
                    >
                      <Smile className="h-5 w-5" />
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-12 right-0 z-10 flex gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                        {['😀', '🎉', '🚀', '💡', '🙌', '❤️'].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => insertEmoji(emoji)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-lg hover:bg-slate-100"
                            aria-label={`Insert ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleSend()}
                    disabled={sending || !draft.trim() || !selectedChannelId}
                    title={!selectedChannelId ? 'No community channel is available' : 'Send message'}
                    aria-label="Send message"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white shadow-md shadow-primary-600/25 transition hover:scale-105 hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                  >
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-2 text-center text-[10px] text-slate-400">Press Enter to send · Shift + Enter for a new line</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
