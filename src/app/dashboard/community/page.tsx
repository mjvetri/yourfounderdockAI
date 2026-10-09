import React, { useEffect, useState } from 'react';
import { Ban, Flag, Loader2, MessageSquare, Send, ShieldAlert, UserX, Users } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  blockUser,
  createCommunityMessage,
  ensureDefaultCommunityChannels,
  listBlockedUsers,
  listCommunityMessages,
  reportCommunityMessage,
  subscribeToCommunityMessages,
  unblockUser,
} from '../../../lib/api';

type CommunityChannel = {
  id: string;
  name: string;
  slug: string;
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
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const channelRows = await ensureDefaultCommunityChannels();
        if (!active) return;

        const nextChannels = (channelRows ?? []) as CommunityChannel[];
        setChannels(nextChannels);
        setSelectedChannelId((current) => current ?? nextChannels[0]?.id ?? null);

        const blockedRows = await listBlockedUsers();
        if (!active) return;
        setBlockedIds((blockedRows ?? []).map((row: any) => row.blocked_id));
      } catch (err: any) {
        if (active) {
          setError(err?.message || 'Unable to load founder community.');
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
    if (!selectedChannelId) return;

    let active = true;

    const loadMessages = async () => {
      try {
        const rows = await listCommunityMessages(selectedChannelId);
        if (active) setMessages((rows ?? []) as CommunityMessage[]);
      } catch (err: any) {
        if (active) setError(err?.message || 'Unable to load messages for this channel.');
      }
    };

    loadMessages();

    const subscription = subscribeToCommunityMessages(
      selectedChannelId,
      (message) => {
        setMessages((current) => {
          if (current.some((item) => item.id === message.id)) return current;
          return [...current, message as CommunityMessage];
        });
      },
      (state) => {
        const count = Object.values(state as Record<string, any[]>).reduce(
          (total, members) => total + (Array.isArray(members) ? members.length : 0),
          0
        );
        if (active) setOnlineCount(count);
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [selectedChannelId]);

  const activeChannel = channels.find((channel) => channel.id === selectedChannelId) ?? channels[0] ?? null;
  const visibleMessages = messages.filter((message) => !blockedIds.includes(message.user_id));

  const handleSend = async () => {
    if (!selectedChannelId || !draft.trim()) return;

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

  const handleToggleBlock = async (userId: string, userName?: string) => {
    try {
      if (blockedIds.includes(userId)) {
        await unblockUser(userId);
        setBlockedIds((current) => current.filter((id) => id !== userId));
      } else {
        await blockUser(userId, userName);
        setBlockedIds((current) => [...current, userId]);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to update moderation settings.');
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
      <DashboardLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card">
            <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
            Loading founder community…
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">Community</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">Founder Community</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            {onlineCount} online
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
            <div className="mb-3 flex items-center justify-between px-2">
              <h2 className="font-display text-lg font-bold text-slate-900">Channels</h2>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {channels.length}
              </span>
            </div>

            <div className="space-y-2">
              {channels.map((channel) => {
                const active = channel.id === selectedChannelId;
                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => setSelectedChannelId(channel.id)}
                    className={`w-full rounded-2xl border p-3 text-left transition-all ${
                      active
                        ? 'border-primary-200 bg-primary-50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-900">#{channel.name}</div>
                        <div className="mt-1 text-xs text-slate-500">{channel.description || 'Community discussion'}</div>
                      </div>
                      <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-500">
                        {messages.filter((msg) => msg.channel_id === channel.id).length}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900">
                    {activeChannel ? `#${activeChannel.name}` : 'Community'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {activeChannel?.description || 'Share updates, wins, and feedback with other founders.'}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                  <Users className="h-3.5 w-3.5" />
                  {onlineCount} online
                </div>
              </div>
            </div>

            <div className="flex h-[560px] flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {visibleMessages.length === 0 ? (
                  <div className="flex min-h-full items-center justify-center text-center">
                    <div className="max-w-sm">
                      <MessageSquare className="mx-auto mb-3 h-10 w-10 text-slate-200" />
                      <p className="font-medium text-slate-700">No messages yet</p>
                      <p className="mt-1 text-sm text-slate-500">Be the first founder to start the conversation.</p>
                    </div>
                  </div>
                ) : (
                  visibleMessages.map((message) => (
                    <div key={message.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                            {message.sender_avatar ? (
                              <img src={message.sender_avatar} alt={message.sender_name} className="h-full w-full object-cover" />
                            ) : (
                              message.sender_name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{message.sender_name}</p>
                            <p className="text-[11px] text-slate-400">{formatTime(message.created_at)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleBlock(message.user_id, message.sender_name)}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-800"
                            title={blockedIds.includes(message.user_id) ? 'Unblock user' : 'Block user'}
                          >
                            {blockedIds.includes(message.user_id) ? <UserX className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                            {blockedIds.includes(message.user_id) ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReport(message.id)}
                            className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700 hover:bg-amber-100"
                            title="Report message"
                          >
                            <Flag className="h-3 w-3" />
                            Report
                          </button>
                        </div>
                      </div>

                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{message.body}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-200 bg-slate-50 p-4">
                <div className="flex items-end gap-3">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={3}
                    placeholder="Share an update, ask a question, or celebrate a milestone…"
                    className="min-h-[88px] flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 shadow-sm outline-none transition-colors focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={sending || !draft.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {sending ? 'Sending' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
