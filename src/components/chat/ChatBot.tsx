"use client";

/* ═══════════════════════════════════════════════════════════
   CHATBOT — v7 (Mobile-First Debug Edition)
   ═══════════════════════════════════════════════════════════ */

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  generateResponse,
  getInitialMessage,
  type BotResponse,
  type ChatContext,
} from "./ChatEngine";
import type { ActionLink, ChatMessage, QuickReply } from "./data";
import "./chat.css";

const STORAGE_KEY = "chat-messages-v7";
const TYPING_DELAY_MS = 600;
const MAX_MESSAGES = 60;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ───────────────────────────────────────────────────────────
   Chat bubble icon (SVG) — بجای لوگوی سایت
   ─────────────────────────────────────────────────────────── */

function ChatBubbleIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className="chat-bubble-icon-svg"
      aria-hidden="true"
    >
      <path
        d="M34 19.5c0 7.2-6.3 13-14 13-1.6 0-3.2-.2-4.6-.6-2.5 1.8-5.7 3-8.9 3.3 1.5-1.8 2.5-4.2 2.7-6.9C6.4 25.9 4.5 22.9 4.5 19.5c0-7.2 6.3-13 14-13s15.5 5.8 15.5 13z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="14" cy="19.5" r="1.9" fill="currentColor" />
      <circle cx="20" cy="19.5" r="1.9" fill="currentColor" />
      <circle cx="26" cy="19.5" r="1.9" fill="currentColor" />
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────
   Action icon
   ─────────────────────────────────────────────────────────── */

function ActionIcon({ type }: { type: ActionLink["icon"] }) {
  switch (type) {
    case "external":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" />
        </svg>
      );
    case "doc":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "arrow":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const typingTimeout = useRef<number | null>(null);
  const contextRef = useRef<ChatContext>({});

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
      setMessages([{
        id: generateId(),
        role: "bot",
        text: initial.text,
        timestamp: Date.now(),
        quickReplies: initial.quickReplies,
        actions: initial.actions,
        state: "complete",
      }]);
    } catch { /* ignore */ }
  }, [mounted]);

  /* Persist */
  useEffect(() => {
    if (!mounted) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(messages.slice(-MAX_MESSAGES)),
      );
    } catch { /* ignore */ }
  }, [mounted, messages]);

  /* Auto-scroll فقط اگه کاربر نزدیک bottom هست */
  useEffect(() => {
    if (!open) return;
    const el = streamRef.current;
    if (!el) return;
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < 120) {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isTyping, open]);

  /* Scroll tracking برای دکمه‌ی scroll-to-bottom */
  useEffect(() => {
    const el = streamRef.current;
    if (!el || !open) return;
    const handleScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollBtn(distance > 200);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [open]);

  /* قفل اسکرول بدنه وقتی پنل بازه (موبایل) */
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

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
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  /* Close on route change */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Auto-resize textarea */
  const autoResize = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [input, autoResize]);

  /* Send */
  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        text: trimmed,
        timestamp: Date.now(),
        state: "complete",
      };

      setMessages((prev) => [...prev, userMessage].slice(-MAX_MESSAGES));
      setInput("");
      setIsTyping(true);

      typingTimeout.current = window.setTimeout(() => {
        const response: BotResponse = generateResponse(
          trimmed,
          contextRef.current,
        );

        contextRef.current = { lastIntent: response.intent };

        const botMessage: ChatMessage = {
          id: generateId(),
          role: "bot",
          text: response.text,
          timestamp: Date.now(),
          quickReplies: response.quickReplies,
          actions: response.actions,
          state: "complete",
        };

        setMessages((prev) => [...prev, botMessage].slice(-MAX_MESSAGES));
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
      if (e.key === "Enter" && !e.shiftKey) {
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
    setMessages([{
      id: generateId(),
      role: "bot",
      text: initial.text,
      timestamp: Date.now(),
      quickReplies: initial.quickReplies,
      actions: initial.actions,
      state: "complete",
    }]);
    contextRef.current = {};
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  }, []);

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  const lastMessage = messages[messages.length - 1];
  const showQuickReplies =
    !isTyping &&
    lastMessage?.role === "bot" &&
    lastMessage.quickReplies &&
    lastMessage.quickReplies.length > 0;

  if (!mounted) return null;

  return (
    <>
      {/* ═══ Bubble ═══ */}
      <button
        ref={bubbleRef}
        type="button"
        className={`chat-bubble${open ? " is-open" : ""}${hasNew ? " has-new" : ""}`}
        onClick={handleToggle}
        aria-label={open ? "بستن گفت‌وگو" : "شروع گفت‌وگو"}
        aria-expanded={open}
        aria-controls="chat-panel"
      >
        <span className="chat-bubble-halo" aria-hidden="true" />
        <span className="chat-bubble-inner" aria-hidden="true">
          <ChatBubbleIcon />
        </span>
        {hasNew && <span className="chat-bubble-badge" aria-hidden="true" />}
        <span className="chat-bubble-pulse" aria-hidden="true" />
      </button>

      {/* ═══ Panel ═══ */}
      <aside
        id="chat-panel"
        className={`chat-panel${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="false"
        aria-labelledby="chat-title"
        aria-hidden={!open}
      >
        <span className="chat-corner chat-corner-tl" aria-hidden="true" />
        <span className="chat-corner chat-corner-tr" aria-hidden="true" />
        <span className="chat-corner chat-corner-bl" aria-hidden="true" />
        <span className="chat-corner chat-corner-br" aria-hidden="true" />

        <span className="chat-orb chat-orb-1" aria-hidden="true" />
        <span className="chat-orb chat-orb-2" aria-hidden="true" />

        {/* ─── Header ─── */}
        <header className="chat-head">
          <div className="chat-head-info">
            <span className="chat-avatar">
              <span className="chat-avatar-halo" aria-hidden="true" />
              <span className="chat-avatar-inner">
                <Image
                  src="/logo.png"
                  alt=""
                  width={64}
                  height={64}
                  className="chat-avatar-img"
                  priority={false}
                />
              </span>
              <span className="chat-avatar-status" aria-hidden="true" />
            </span>

            <div className="chat-head-text">
              <span id="chat-title" className="chat-head-name">
                دستیار امیرحسین
              </span>
              <span className="chat-head-status" role="status" aria-live="polite">
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.4" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        {/* ─── Stream ─── */}
        <div
          ref={streamRef}
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
              {msg.role === "bot" && (
                <span className="chat-msg-avatar" aria-hidden="true">
                  <Image
                    src="/logo.png"
                    alt=""
                    width={32}
                    height={32}
                    className="chat-msg-avatar-img"
                    priority={false}
                  />
                </span>
              )}

              <div className="chat-msg-body">
                <div className="chat-msg-bubble">
                  <div
                    className="chat-msg-text"
                    dangerouslySetInnerHTML={{
                      __html:
                        msg.role === "user"
                          ? escapeOnly(msg.text)
                          : formatMessageText(msg.text),
                    }}
                  />

                  {msg.role === "bot" &&
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
                              className={`chat-action${action.primary ? " is-primary" : ""}`}
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
                              className={`chat-action${action.primary ? " is-primary" : ""}`}
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

          {isTyping && (
            <div className="chat-msg chat-msg--bot">
              <span className="chat-msg-avatar" aria-hidden="true">
                <Image
                  src="/logo.png"
                  alt=""
                  width={32}
                  height={32}
                  className="chat-msg-avatar-img"
                  priority={false}
                />
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

        {showScrollBtn && (
          <button
            type="button"
            className="chat-scroll-bottom"
            onClick={scrollToBottom}
            aria-label="رفتن به آخرین پیام"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}

        {/* ─── Compose ─── */}
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
          />
          <button
            type="submit"
            className="chat-send"
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

        <div className="chat-foot-hint" aria-hidden="true">
          <span>پاسخ حداکثر ۲۴ ساعت</span>
          <span className="chat-foot-sep">·</span>
          <span>بدون اسپم</span>
        </div>
      </aside>

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
   Formatters
   ─────────────────────────────────────────────────────────── */

function escapeOnly(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");
}

function formatMessageText(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  const withQuote = withBold.replace(
    /^> (.+)$/gm,
    '<span class="chat-quote">$1</span>',
  );

  return withQuote.replace(/\n/g, "<br />");
}