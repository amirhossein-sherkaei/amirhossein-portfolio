"use client";

/* ═══════════════════════════════════════════════════════════
   CHATBOT — Floating Assistant
   ────────────────────────────────────────────────────────────
   • Floating bubble + expandable panel
   • Persistent across sessions
   • Typing indicator with delay simulation
   • Quick replies
   • Auto-scroll
   • Full accessibility (keyboard, screen reader, focus trap)
   ═══════════════════════════════════════════════════════════ */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  generateResponse,
  getInitialMessage,
  type BotResponse,
} from './ChatEngine';
import type { ChatMessage, QuickReply } from './data';
import './chat.css';

/* ───────────────────────────────────────────────────────────
   Constants
   ─────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'chat-messages-v1';
const TYPING_DELAY_MS = 800;
const MAX_MESSAGES = 50;

/* ───────────────────────────────────────────────────────────
   Utilities
   ─────────────────────────────────────────────────────────── */

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

function toPersian(value: string | number): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ───────────────────────────────────────────────────────────
   Component
   ─────────────────────────────────────────────────────────── */

export function ChatBot() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const typingTimeout = useRef<number | null>(null);

  /* ─── Mount ─── */
  useEffect(() => setMounted(true), []);

  /* ─── Restore from sessionStorage ─── */
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
      // Init with welcome message
      const initial = getInitialMessage();
      setMessages([
        {
          id: generateId(),
          role: 'bot',
          text: initial.text,
          timestamp: Date.now(),
          quickReplies: initial.quickReplies,
          state: 'complete',
        },
      ]);
    } catch {
      /* ignore */
    }
  }, [mounted]);

  /* ─── Persist ─── */
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

  /* ─── Auto-scroll ─── */
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [messages, isTyping, open]);

  /* ─── Focus management ─── */
  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      bubbleRef.current?.focus();
    }
  }, [open]);

  /* ─── Cleanup ─── */
  useEffect(() => {
    return () => {
      if (typingTimeout.current !== null) {
        window.clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  /* ─── Escape closes panel ─── */
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

  /* ─── Actions ─── */

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

      // Simulate typing delay
      typingTimeout.current = window.setTimeout(() => {
        const response: BotResponse = generateResponse(trimmed);

        const botMessage: ChatMessage = {
          id: generateId(),
          role: 'bot',
          text: response.text,
          timestamp: Date.now(),
          quickReplies: response.quickReplies,
          state: 'complete',
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        typingTimeout.current = null;

        if (!open) setHasNewMessage(true);
      }, TYPING_DELAY_MS);
    },
    [isTyping, open],
  );

  const handleQuickReply = useCallback(
    (reply: QuickReply) => {
      sendMessage(reply.value);
    },
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
    setHasNewMessage(false);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
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
        state: 'complete',
      },
    ]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  /* ─── Last bot quick replies (only show if last message is bot) ─── */
  const lastMessage = messages[messages.length - 1];
  const showQuickReplies =
    !isTyping &&
    lastMessage?.role === 'bot' &&
    lastMessage.quickReplies &&
    lastMessage.quickReplies.length > 0;

  /* ─── Unread count ─── */
  const unreadCount = useMemo(() => {
    if (open || !hasNewMessage) return 0;
    return 1;
  }, [open, hasNewMessage]);

  /* ─── SSR guard ─── */
  if (!mounted) return null;

  /* ───────────────────────────────────────────────────────
     Render
     ─────────────────────────────────────────────────────── */

  return (
    <>
      {/* ═══ Floating Bubble ═══ */}
      <button
        ref={bubbleRef}
        type="button"
        className={`chat-bubble${open ? ' is-open' : ''}${
          hasNewMessage ? ' has-new' : ''
        }`}
        onClick={handleToggle}
        aria-label={open ? 'بستن گفت‌وگو' : 'شروع گفت‌وگو'}
        aria-expanded={open}
        aria-controls="chat-panel"
      >
        <span className="chat-bubble-icon" aria-hidden="true">
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.4" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          )}
        </span>

        {unreadCount > 0 && (
          <span className="chat-bubble-badge" aria-hidden="true">
            {toPersian(unreadCount)}
          </span>
        )}

        <span className="chat-bubble-pulse" aria-hidden="true" />
      </button>

      {/* ═══ Chat Panel ═══ */}
      <div
        ref={panelRef}
        id="chat-panel"
        className={`chat-panel${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="false"
        aria-labelledby="chat-title"
        aria-hidden={!open}
      >
        {/* Header */}
        <header className="chat-header">
          <div className="chat-header-info">
            <span className="chat-avatar" aria-hidden="true">
              <span className="chat-avatar-initial">ا</span>
              <span className="chat-avatar-online" />
            </span>
            <div className="chat-header-text">
              <span id="chat-title" className="chat-header-name">
                دستیار امیرحسین
              </span>
              <span className="chat-header-status">
                {isTyping ? 'در حال نوشتن…' : 'آنلاین'}
              </span>
            </div>
          </div>

          <div className="chat-header-actions">
            <button
              type="button"
              className="chat-icon-btn"
              onClick={clearChat}
              aria-label="شروع مجدد گفت‌وگو"
              title="شروع مجدد"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </button>
            <button
              type="button"
              className="chat-icon-btn"
              onClick={handleClose}
              aria-label="بستن"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.4" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div
          className="chat-messages"
          role="log"
          aria-live="polite"
          aria-label="پیام‌های گفت‌وگو"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message chat-message--${msg.role}`}
            >
              {msg.role === 'bot' && (
                <span className="chat-message-avatar" aria-hidden="true">
                  ا
                </span>
              )}

              <div className="chat-message-bubble">
                <p
                  className="chat-message-text"
                  dangerouslySetInnerHTML={{
                    __html: formatMessageText(msg.text),
                  }}
                />
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="chat-message chat-message--bot">
              <span className="chat-message-avatar" aria-hidden="true">
                ا
              </span>
              <div className="chat-message-bubble chat-message-bubble--typing">
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
              </div>
            </div>
          )}

          {/* Quick replies */}
          {showQuickReplies && lastMessage.quickReplies && (
            <div className="chat-quick-replies">
              {lastMessage.quickReplies.map((reply) => (
                <button
                  key={reply.value}
                  type="button"
                  className="chat-quick-reply"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply.label}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form className="chat-input-area" onSubmit={handleSubmit}>
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
            className="chat-send-btn"
            disabled={!input.trim() || isTyping}
            aria-label="ارسال"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>

      {/* ═══ Backdrop (mobile only) ═══ */}
      {open && (
        <div
          className="chat-backdrop"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}

/* ───────────────────────────────────────────────────────────
   Text formatter — turns **bold** into <strong>
   ─────────────────────────────────────────────────────────── */

function formatMessageText(text: string): string {
  // Escape HTML first
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold: **text**
  const withBold = escaped.replace(
    /\*\*(.+?)\*\*/g,
    '<strong>$1</strong>',
  );

  // Line breaks: \n → <br />
  return withBold.replace(/\n/g, '<br />');
}