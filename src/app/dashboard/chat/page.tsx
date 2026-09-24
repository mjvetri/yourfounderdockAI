import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Bot, Send, Sparkles, Loader2, PanelRightClose, PanelRightOpen, Plus, Trash2, MessageSquare, Copy, Check } from 'lucide-react';
import { createChatSession, createNotification, createServiceLead, listChatSessions, getSessionMessages, sendMessageToSession, deleteChatSession } from '../../../lib/api';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface Session {
  id: string;
  title: string;
  updated_at: string;
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-slate-700 my-2">
      <div className="flex justify-between items-center bg-slate-800 px-3 py-1.5">
        <span className="text-xs text-slate-400">{language || 'code'}</span>
        <button type="button" onClick={handleCopy} className="text-slate-400 hover:text-white flex items-center gap-1 text-xs">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-slate-900 text-slate-100 text-xs p-3 overflow-x-auto"><code>{code}</code></pre>
    </div>
  );
}

interface Connection { from: string; to: string; label: string; }

function CircuitDiagram({ connections }: { connections: Connection[] }) {
  if (!connections || connections.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 my-2 space-y-3">
      {connections.map((connection, index) => (
        <div key={index} className="flex items-center gap-2 text-sm flex-wrap">
          <span className="px-2.5 py-1.5 rounded-md bg-slate-100 text-slate-800 font-medium">{connection.from}</span>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="h-px w-4 bg-slate-300" />
            <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">{connection.label}</span>
            <span className="h-px w-4 bg-slate-300" />
            <span>→</span>
          </div>
          <span className="px-2.5 py-1.5 rounded-md bg-slate-100 text-slate-800 font-medium">{connection.to}</span>
        </div>
      ))}
    </div>
  );
}

function ServiceOfferCard({ reason, sessionId }: { reason: string; sessionId: string | null }) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'sent'>('idle');

  const handleConfirm = async () => {
    setStatus('saving');
    try {
      await createServiceLead(sessionId, reason);
      setStatus('sent');
    } catch {
      setStatus('idle');
    }
  };

  if (status === 'sent') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-2 text-sm">
        <p className="font-medium text-green-800 mb-1">Please reach out to our team to get started.</p>
        <p className="text-green-700">Kindly contact us at <a href="mailto:yourfounder@team.com" className="underline font-medium">yourfounder@team.com</a> and we will help build it for you.</p>
      </div>
    );
  }

  return (
    <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 my-2">
      <p className="text-sm text-primary-900 mb-3">
        Sounds like this part might be easier to hand off. Our YourFounder team will build it for you — want us to reach out?
      </p>
      <button
        type="button"
        onClick={handleConfirm}
        disabled={status === 'saving'}
        className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {status === 'saving' ? 'Sending...' : 'Yes, have your team contact me'}
      </button>
    </div>
  );
}

function renderInlineMarkdown(text: string) {
  const segments = text.split(/\*\*(.+?)\*\*/g);
  return segments.map((segment, index) => (
    index % 2 === 1
      ? <strong key={index}>{segment}</strong>
      : <React.Fragment key={index}>{segment}</React.Fragment>
  ));
}

function MessageContent({ text, sessionId }: { text: string; sessionId: string | null }) {
  const parts = text.split(/```([\w-]*)[ \t]*\r?\n([\s\S]*?)```/g);
  const rendered: React.ReactNode[] = [];

  for (let i = 0; i < parts.length; i += 3) {
    const plain = parts[i];
    if (plain?.trim()) {
      rendered.push(
        <p key={`t-${i}`} className="whitespace-pre-wrap">{renderInlineMarkdown(plain.trim())}</p>
      );
    }
    const language = parts[i + 1];
    const code = parts[i + 2];
    if (code !== undefined) {
      if (language === 'circuit') {
        try {
          const connections: Connection[] = JSON.parse(code.trim());
          rendered.push(<CircuitDiagram key={`ckt-${i}`} connections={connections} />);
        } catch {
          rendered.push(<CodeBlock key={`ckt-err-${i}`} language="circuit" code={code.trim()} />);
        }
      } else if (language === 'service-offer') {
        try {
          const { reason } = JSON.parse(code.trim());
          rendered.push(<ServiceOfferCard key={`offer-${i}`} reason={reason} sessionId={sessionId} />);
        } catch {
          // Skip malformed service offers rather than showing implementation details.
        }
      } else {
        rendered.push(<CodeBlock key={`c-${i}`} language={language} code={code.trim()} />);
      }
    }
  }

  return <>{rendered}</>;
}

const ChatPage = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadSessions = async () => {
    const data = await listChatSessions();
    setSessions((data ?? []) as Session[]);
    return data ?? [];
  };

  useEffect(() => {
    loadSessions()
      .then(async (data: any[]) => {
        if (data.length > 0) await selectSession(data[0].id);
      })
      .catch((e) => setError(e.message || 'Unable to load chat history.'))
      .finally(() => setLoadingSessions(false));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const selectSession = async (sessionId: string) => {
    setError('');
    setActiveSessionId(sessionId);
    try {
      const rows = await getSessionMessages(sessionId);
      setMessages((rows ?? []) as Message[]);
    } catch (e: any) {
      setError(e.message || 'Unable to load this chat.');
    }
  };

  const startNewChat = async () => {
    setError('');
    try {
      const session = await createChatSession();
      setSessions((prev) => [session as Session, ...prev]);
      setActiveSessionId(session.id);
      setMessages([]);
    } catch (e: any) {
      setError(e.message || 'Unable to create a new chat.');
    }
  };

  const handleDeleteSession = async (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await deleteChatSession(sessionId);
      const remaining = sessions.filter((session) => session.id !== sessionId);
      setSessions(remaining);
      if (activeSessionId === sessionId) {
        if (remaining.length > 0) await selectSession(remaining[0].id);
        else {
          setActiveSessionId(null);
          setMessages([]);
        }
      }
    } catch (e: any) {
      setError(e.message || 'Unable to delete this chat.');
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    let sessionId = activeSessionId;
    try {
      if (!sessionId) {
        const session = await createChatSession();
        setSessions((prev) => [session as Session, ...prev]);
        sessionId = session.id;
        setActiveSessionId(sessionId);
      }

      const userMessage: Message = { id: `${Date.now()}-u`, role: 'user', text };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setSending(true);
      setError('');

      const reply = await sendMessageToSession(sessionId, text);
      setMessages((prev) => [...prev, { id: `${Date.now()}-m`, role: 'model', text: reply }]);
      await createNotification('chat', 'New Message from AI', reply.slice(0, 80) + (reply.length > 80 ? '...' : ''));
      await loadSessions();
    } catch (e: any) {
      setMessages((prev) => [...prev, { id: `${Date.now()}-e`, role: 'model', text: "Sorry, I couldn't respond just now. Try again in a moment." }]);
      setError(e.message || 'Unable to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <DashboardLayout fullScreen>
      <div className="flex h-screen bg-white overflow-hidden">
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm">DockMind</h2>
                <span className="flex items-center gap-1 text-xs text-green-600"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online</span>
              </div>
            </div>
            <button type="button" onClick={() => setSidebarOpen((value) => !value)} className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 rounded-md px-3 py-1.5 hover:bg-slate-50 transition-colors">
              {sidebarOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />} History
            </button>
          </div>

          {error && <div className="mx-5 mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
            {messages.length === 0 && !sending && <div className="h-full flex flex-col items-center justify-center text-center text-slate-400"><Sparkles className="w-8 h-8 mb-3" /><p>Start a new chat or pick one from your history.</p></div>}
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {message.role === 'model' && <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-white" /></div>}
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'bg-slate-100 text-slate-800 rounded-tr-sm' : 'bg-primary-600 text-white rounded-tl-sm'}`}>
                  {message.role === 'model' ? (
                    <MessageContent text={message.text} sessionId={activeSessionId} />
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            ))}
            {sending && <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-white" /></div><div className="bg-primary-600 text-white rounded-2xl rounded-tl-sm px-4 py-3"><Loader2 className="w-4 h-4 animate-spin" /></div></div>}
          </div>

          <div className="flex-shrink-0 border-t border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about your MVP (e.g., 'What is the best DB for a real-time chat app?')" disabled={sending} className="flex-1 border border-slate-200 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50" />
              <button type="button" onClick={handleSend} disabled={sending || !input.trim()} className="w-10 h-10 flex items-center justify-center bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-40 transition-colors flex-shrink-0"><Send className="w-4 h-4" /></button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-3">AI can make mistakes. Verify critical technical decisions.</p>
          </div>
        </div>

        {sidebarOpen && <div className="w-72 flex-shrink-0 border-l border-slate-100 flex flex-col">
          <div className="flex-shrink-0 p-4 border-b border-slate-100"><button type="button" onClick={startNewChat} className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-primary-700"><Plus className="w-4 h-4" /> New Chat</button></div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loadingSessions ? <div className="flex justify-center py-6"><Loader2 className="w-4 h-4 animate-spin text-slate-400" /></div> : sessions.length === 0 ? <p className="text-xs text-slate-400 text-center py-6">No chats yet.</p> : sessions.map((session) => (
              <div key={session.id} onClick={() => selectSession(session.id)} className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors ${activeSessionId === session.id ? 'bg-primary-50 text-primary-700' : 'hover:bg-slate-50 text-slate-600'}`}>
                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                <span className="flex-1 truncate">{session.title}</span>
                <button type="button" onClick={(event) => handleDeleteSession(session.id, event)} aria-label={`Delete ${session.title}`} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        </div>}
      </div>
    </DashboardLayout>
  );
};

export default ChatPage;
