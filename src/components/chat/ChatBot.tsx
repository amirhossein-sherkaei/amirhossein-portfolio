"use client";

/* ═══════════════════════════════════════════════════════════
   CHATBOT — Floating Assistant v2
   ────────────────────────────────────────────────────────────
   • Site-matching gradient icons
   • Editorial corner marks
   • Action buttons (navigate directly)
   • Full keyboard navigation
   • Auto-scroll + persistent history
   ═══════════════════════════════════════════════════════════ */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  generateResponse,
  getInitialMessage,
  type BotResponse,
} from './ChatEngine';
import type { ActionLink, ChatMessage, QuickReply } from './data';
import './chat.css';

/* ───────────────────────────────────────────────────────────
   Constants
   ─────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'chat-messages-v2';
const TYPING_DELAY_MS = 700;
const MAX_MESSAGES = 60;

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

function toPersian(value: string | number): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ───────────────────────────────────────────────────────────
   Site-matching icons (SVG with gradient)
   ─────────────────────────────────────────────────────────── */

function ChatIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="chatCloseDark"
            x1="16"
            y1="6"
            x2="16"
            y2="26"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3E3630" />
            <stop offset="1" stopColor="#18140F" />
          </linearGradient>
          <linearGradient
            id="chatCloseWarm"
            x1="10"
            y1="10"
            x2="22"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF9A55" />
            <stop offset="1" stopColor="#E94B2C" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="11" fill="url(#chatCloseDark)" />
        <path
          d="M11.5 11.5l9 9M20.5 11.5l-9 9"
          stroke="url(#chatCloseWarm)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="chatBubbleDark"
          x1="16"
          y1="4"
          x2="16"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3E3630" />
          <stop offset="1" stopColor="#18140F" />
        </linearGradient>
        <linearGradient
          id="chatBubbleWarm"
          x1="16"
          y1="8"
          x2="16"
          y2="16"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF9A55" />
          <stop offset="1" stopColor="#E94B2C" />
        </linearGradient>
      </defs>
      <path
        d="M6 8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-6.5L9 27v-5H10a4 4 0 0 1-4-4V8z"
        fill="url(#chatBubbleDark)"
      />
      <circle cx="12" cy="12" r="1.7" fill="url(#chatBubbleWarm)" />
      <circle cx="16" cy="12" r="1.7" fill="url(#chatBubbleWarm)" />
      <circle cx="20" cy="12" r="1.7" fill="url(#chatBubbleWarm)" />
    </svg>
  );
}

function ActionIcon({ type }: { type: ActionLink['icon'] }) {
  switch (type) {
    case 'external':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      );
    case 'spark':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" />
        </svg>
      );
    case 'doc':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
    case 'chat':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'arrow':
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      );
  }
}

/* ───────────────────────────────────────────────────────────
   Component
   ─────────────────────────────────────────────────────────── */

export function ChatBot() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const typingTimeout = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  /* Restore */
  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.slice(-MAX_MESSAGES));
          return;
        }
      }
      const initial = getInitialMessage();
      setMessages([
        {
          id: generateId(),
          role: 'bot',
          text: initial.text,
          timestamp: Date.now(),
          quickReplies: initial.quickReplies,
          actions: initial.actions,
          state: 'complete',
        },
      ]);
    } catch {
      /* ignore */
    }
  }, [mounted]);

  /* Persist */
  useEffect(() => {
    if (!mounted) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(messages.slice(-MAX_MESSAGES)),
      );
    } catch {
      /* ignore */
    }
  }, [mounted, messages]);

  /* Auto-scroll */
  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [messages, isTyping, open]);

  /* Focus */
  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 220);
    } else if (mounted) {
      bubbleRef.current?.focus();
    }
  }, [open, mounted]);

  /* Cleanup */
  useEffect(() => {
    return () => {
      if (typingTimeout.current !== null) {
        window.clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  /* Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  /* Close on route change */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Actions */
  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        text: trimmed,
        timestamp: Date.now(),
        state: 'complete',
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      typingTimeout.current = window.setTimeout(() => {
        const response: BotResponse = generateResponse(trimmed);

        const botMessage: ChatMessage = {
          id: generateId(),
          role: 'bot',
          text: response.text,
          timestamp: Date.now(),
          quickReplies: response.quickReplies,
          actions: response.actions,
          state: 'complete',
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        typingTimeout.current = null;

        if (!open) setHasNew(true);
      }, TYPING_DELAY_MS);
    },
    [isTyping, open],
  );

  const handleQuickReply = useCallback(
    (reply: QuickReply) => sendMessage(reply.value),
    [sendMessage],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    },
    [input, sendMessage],
  );

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
    setHasNew(false);
  }, []);

  const clearChat = useCallback(() => {
    const initial = getInitialMessage();
    setMessages([
      {
        id: generateId(),
        role: 'bot',
        text: initial.text,
        timestamp: Date.now(),
        quickReplies: initial.quickReplies,
        actions: initial.actions,
        state: 'complete',
      },
    ]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const lastMessage = messages[messages.length - 1];
  const showQuickReplies =
    !isTyping &&
    lastMessage?.role === 'bot' &&
    lastMessage.quickReplies &&
    lastMessage.quickReplies.length > 0;

  if (!mounted) return null;

  return (
    <>
      {/* ═══ Bubble ═══ */}
      <button
        ref={bubbleRef}
        type="button"
        className={`chat-bubble${open ? ' is-open' : ''}${
          hasNew ? ' has-new' : ''
        }`}
        onClick={handleToggle}
        aria-label={open ? 'بستن گفت‌وگو' : 'شروع گفت‌وگو'}
        aria-expanded={open}
        aria-controls="chat-panel"
      >
        <span className="chat-bubble-glyph" aria-hidden="true">
          <ChatIcon open={open} />
        </span>
        {hasNew && <span className="chat-bubble-badge" aria-hidden="true" />}
        <span className="chat-bubble-pulse" aria-hidden="true" />
      </button>

      {/* ═══ Panel ═══ */}
      <aside
        id="chat-panel"
        className={`chat-panel${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="false"
        aria-labelledby="chat-title"
        aria-hidden={!open}
      >
        {/* Editorial corner marks */}
        <span className="chat-corner chat-corner-tl" aria-hidden="true" />
        <span className="chat-corner chat-corner-tr" aria-hidden="true" />
        <span className="chat-corner chat-corner-bl" aria-hidden="true" />
        <span className="chat-corner chat-corner-br" aria-hidden="true" />

        {/* Header */}
        <header className="chat-head">
          <div className="chat-head-info">
            <span className="chat-head-avatar" aria-hidden="true">
              <span className="chat-head-avatar-inner">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" />
                </svg>
              </span>
              <span className="chat-head-avatar-status" />
            </span>

            <div className="chat-head-text">
              <span id="chat-title" className="chat-head-name">
                دستیار امیرحسین
              </span>
              <span className="chat-head-status">
                {isTyping ? (
                  <>
                    <span className="chat-head-status-dot" />
                    در حال نوشتن…
                  </>
                ) : (
                  <>
                    <span className="chat-head-status-dot chat-head-status-dot--online" />
                    آنلاین
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="chat-head-actions">
            <button
              type="button"
              className="chat-head-btn"
              onClick={clearChat}
              aria-label="شروع مجدد"
              title="شروع مجدد"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </button>
            <button
              type="button"
              className="chat-head-btn"
              onClick={() => setOpen(false)}
              aria-label="بستن"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div
          className="chat-stream"
          role="log"
          aria-live="polite"
          aria-label="پیام‌ها"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-msg chat-msg--${msg.role}`}
            >
              {msg.role === 'bot' && (
                <span className="chat-msg-avatar" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" />
                  </svg>
                </span>
              )}

              <div className="chat-msg-body">
                <div className="chat-msg-bubble">
                  <div
                    className="chat-msg-text"
                    dangerouslySetInnerHTML={{
                      __html: formatMessageText(msg.text),
                    }}
                  />

                  {/* Actions */}
                  {msg.role === 'bot' &&
                    msg.actions &&
                    msg.actions.length > 0 && (
                      <div className="chat-msg-actions">
                        {msg.actions.map((action) =>
                          action.external ? (
                            <a
                              key={action.href}
                              href={action.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`chat-action${
                                action.primary ? ' is-primary' : ''
                              }`}
                            >
                              <span className="chat-action-icon">
                                <ActionIcon type={action.icon} />
                              </span>
                              <span className="chat-action-label">
                                {action.label}
                              </span>
                            </a>
                          ) : (
                            <Link
                              key={action.href}
                              href={action.href}
                              className={`chat-action${
                                action.primary ? ' is-primary' : ''
                              }`}
                              onClick={() => setOpen(false)}
                            >
                              <span className="chat-action-icon">
                                <ActionIcon type={action.icon} />
                              </span>
                              <span className="chat-action-label">
                                {action.label}
                              </span>
                            </Link>
                          ),
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing */}
          {isTyping && (
            <div className="chat-msg chat-msg--bot">
              <span className="chat-msg-avatar" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" />
                </svg>
              </span>
              <div className="chat-msg-body">
                <div className="chat-msg-bubble chat-msg-bubble--typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          {/* Quick replies */}
          {showQuickReplies && lastMessage.quickReplies && (
            <div className="chat-quick">
              {lastMessage.quickReplies.map((reply) => (
                <button
                  key={reply.value}
                  type="button"
                  className="chat-quick-chip"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply.label}
                </button>
              ))}
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Input */}
        <form className="chat-compose" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="پیامت رو بنویس…"
            rows={1}
            dir="rtl"
            aria-label="پیام"
            disabled={isTyping}
          />
          <button
            type="submit"
            className="chat-send"
            disabled={!input.trim() || isTyping}
            aria-label="ارسال"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>

        {/* Footer hint */}
        <div className="chat-foot-hint" aria-hidden="true">
          <span>پاسخ حداکثر ۲۴ ساعت</span>
          <span className="chat-foot-sep">·</span>
          <span>بدون اسپم</span>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="chat-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

/* ───────────────────────────────────────────────────────────
   Text formatter
   ─────────────────────────────────────────────────────────── */

function formatMessageText(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const withBold = escaped.replace(
    /\*\*(.+?)\*\*/g,
    '<strong>$1</strong>',
  );

  const withQuote = withBold.replace(
    /^> (.+)$/gm,
    '<span class="chat-quote">$1</span>',
  );

  return withQuote.replace(/\n/g, '<br />');
}