"use client";

/* ═══════════════════════════════════════════════════════════
   CHATBOT — v10.2 (Legendary · Fully Type-Safe)
   ═══════════════════════════════════════════════════════════ */

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  generateResponse,
  getInitialMessage,
  type BotResponse,
  type ChatContext,
} from "./ChatEngine";
import type { ActionLink, ChatMessage, IntentType, QuickReply } from "./data";
import "./chat.css";

/* ───────────────────────────────────────────────────────────
   Web Speech API type declarations (missing from TS DOM lib)
   ─────────────────────────────────────────────────────────── */

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEventLike extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventLike extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

/* ───────────────────────────────────────────────────────────
   Constants
   ─────────────────────────────────────────────────────────── */

const STORAGE_KEY = "chat-messages-v10";
const BOOKMARKS_KEY = "chat-bookmarks-v10";
const CEREMONY_KEY = "chat-ceremony-date";
const TYPING_DELAY_MS = 600;
const IDLE_DELAY_MS = 28_000;
const MAX_MESSAGES = 60;

const MOOD_COLORS: Partial<Record<IntentType, string>> = {
  greeting: "#10b981", thanks: "#10b981", goodbye: "#10b981",
  ask_pricing: "#f59e0b", ask_pricing_landing: "#f59e0b",
  ask_pricing_corporate: "#f59e0b", ask_pricing_shop: "#f59e0b",
  ask_process: "#3b82f6", ask_timeline: "#3b82f6",
  ask_portfolio: "#8b5cf6", ask_portfolio_arka: "#8b5cf6",
  ask_portfolio_nila: "#8b5cf6", ask_portfolio_vira: "#8b5cf6",
  ask_portfolio_lumen: "#8b5cf6",
  ask_services: "#06b6d4", ask_service_web: "#06b6d4",
  ask_service_ai: "#06b6d4", ask_service_video: "#06b6d4",
  start_project: "#e94b2c", describe_project: "#e94b2c",
  help: "#facc15", compliment: "#10b981", unknown: "#6b7280",
};

const IDLE_WHISPERS = [
  "اگه سؤالی داری، همین‌جام 👋",
  "می‌خوای یه نمونه‌کار ببینی؟",
  "درباره‌ی قیمت‌ها بپرسم؟",
  "یه ایده داری؟ بگو با هم شکلش بدیم",
  "دنبال چیزی هستی که پیدا نکردی؟",
];

const SLASH_COMMANDS = [
  { cmd: "/help", label: "راهنما", desc: "لیست دستورات" },
  { cmd: "/price", label: "قیمت‌ها", desc: "تعرفه‌ها و هزینه‌ها" },
  { cmd: "/demo", label: "نمونه‌کارها", desc: "پروژه‌های منتخب" },
  { cmd: "/services", label: "خدمات", desc: "سه خدمت اصلی" },
  { cmd: "/contact", label: "راه تماس", desc: "شماره و راه‌های ارتباطی" },
  { cmd: "/new", label: "گفت‌وگوی جدید", desc: "شروع از صفر" },
  { cmd: "/clear", label: "پاک‌کردن", desc: "پاک‌کردن کامل مکالمه" },
];

/* ───────────────────────────────────────────────────────────
   Message factories
   ─────────────────────────────────────────────────────────── */

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createUserMessage(text: string): ChatMessage {
  return {
    id: generateId(),
    role: "user",
    text,
    timestamp: Date.now(),
    state: "complete",
  };
}

function createBotMessage(response: BotResponse): ChatMessage {
  return {
    id: generateId(),
    role: "bot",
    text: response.text,
    timestamp: Date.now(),
    quickReplies: response.quickReplies,
    actions: response.actions,
    state: "complete",
    intent: response.intent,
  };
}

function createWelcomeMessage(): ChatMessage {
  const initial = getInitialMessage();
  return {
    id: generateId(),
    role: "bot",
    text: initial.text,
    timestamp: Date.now(),
    quickReplies: initial.quickReplies,
    actions: initial.actions,
    state: "complete",
    intent: initial.intent,
  };
}

/* ───────────────────────────────────────────────────────────
   Helpers
   ─────────────────────────────────────────────────────────── */

function isNightTime(): boolean {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 6;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  return `${h}:${m}`.replace(/\d/g, (x) => persian[Number(x)]);
}

function getMoodColor(intent?: IntentType): string {
  if (!intent) return "var(--accent)";
  return MOOD_COLORS[intent] ?? "var(--accent)";
}

function haptic(type: "light" | "medium" | "heavy" | "success" | "error" = "light") {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;
  try {
    if ("vibrate" in navigator) {
      const patterns: Record<string, number | number[]> = {
        light: 10, medium: 20, heavy: 30,
        success: [10, 40, 10], error: [30, 50, 30],
      };
      navigator.vibrate(patterns[type]);
    }
  } catch { /* ignore */ }
}

function fireConfetti() {
  if (typeof document === "undefined") return;
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:99999;overflow:hidden";
  document.body.appendChild(container);
  const colors = ["#ff9a55", "#e94b2c", "#c22e15", "#f59e0b", "#8b5cf6", "#10b981"];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("div");
    const size = 6 + Math.random() * 6;
    const isCircle = Math.random() > 0.5;
    piece.style.cssText = `position:absolute;left:${Math.random() * 100}%;top:-20px;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random() * colors.length)]};${isCircle ? "border-radius:50%;" : `transform:rotate(${Math.random() * 360}deg);`}opacity:0.9;will-change:transform,opacity`;
    container.appendChild(piece);
    const duration = 1500 + Math.random() * 1500;
    const xDrift = (Math.random() - 0.5) * 200;
    piece.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${xDrift}px, ${window.innerHeight + 40}px) rotate(${720 + Math.random() * 360}deg)`, opacity: 0 },
      ],
      { duration, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
    );
  }
  setTimeout(() => container.remove(), 3500);
}

/* ───────────────────────────────────────────────────────────
   Icons
   ─────────────────────────────────────────────────────────── */

function ChatBubbleIcon() {
  return (
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className="chat-bubble-icon-svg" aria-hidden="true">
      <path d="M34 19.5c0 7.2-6.3 13-14 13-1.6 0-3.2-.2-4.6-.6-2.5 1.8-5.7 3-8.9 3.3 1.5-1.8 2.5-4.2 2.7-6.9C6.4 25.9 4.5 22.9 4.5 19.5c0-7.2 6.3-13 14-13s15.5 5.8 15.5 13z" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="14" cy="19.5" r="1.9" fill="currentColor" />
      <circle cx="20" cy="19.5" r="1.9" fill="currentColor" />
      <circle cx="26" cy="19.5" r="1.9" fill="currentColor" />
    </svg>
  );
}

function ActionIcon({ type }: { type: ActionLink["icon"] }) {
  switch (type) {
    case "external": return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>);
    case "spark": return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" /></svg>);
    case "doc": return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>);
    case "chat": return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>);
    default: return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>);
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

  const [typingIntensity, setTypingIntensity] = useState(0);
  const [moodColor, setMoodColor] = useState("var(--accent)");
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const [showCeremony, setShowCeremony] = useState(false);
  const [idleWhisper, setIdleWhisper] = useState<string | null>(null);
  const [contextChip, setContextChip] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [isListening, setIsListening] = useState(false);
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashIndex, setSlashIndex] = useState(0);
  const [exitHint, setExitHint] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const typingTimeout = useRef<number | null>(null);
  const auraTimeout = useRef<number | null>(null);
  const idleTimeout = useRef<number | null>(null);
  const contextRef = useRef<ChatContext>({});
  const lastKeystroke = useRef<number>(0);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => setMounted(true), []);

  // Adaptive night theme
  useEffect(() => {
    if (!mounted || !open) return;
    if (isNightTime()) document.documentElement.setAttribute("data-chat-time", "night");
    else document.documentElement.removeAttribute("data-chat-time");
    return () => document.documentElement.removeAttribute("data-chat-time");
  }, [mounted, open]);

  // Restore
  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.slice(-MAX_MESSAGES));
        } else {
          setMessages([createWelcomeMessage()]);
        }
      } else {
        setMessages([createWelcomeMessage()]);
      }
      const bm = sessionStorage.getItem(BOOKMARKS_KEY);
      if (bm) setBookmarks(new Set(JSON.parse(bm) as string[]));
    } catch { /* ignore */ }
  }, [mounted]);

  // Persist messages
  useEffect(() => {
    if (!mounted) return;
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES))); } catch { /* ignore */ }
  }, [mounted, messages]);

  // Persist bookmarks
  useEffect(() => {
    if (!mounted) return;
    try { sessionStorage.setItem(BOOKMARKS_KEY, JSON.stringify(Array.from(bookmarks))); } catch { /* ignore */ }
  }, [mounted, bookmarks]);

  // First-open ceremony
  useEffect(() => {
    if (!open || !mounted) return;
    const today = new Date().toISOString().slice(0, 10);
    try {
      if (sessionStorage.getItem(CEREMONY_KEY) !== today) {
        setShowCeremony(true);
        sessionStorage.setItem(CEREMONY_KEY, today);
        setTimeout(() => setShowCeremony(false), 2200);
      }
    } catch { /* ignore */ }
  }, [open, mounted]);

  // Auto-scroll
  useEffect(() => {
    if (!open) return;
    const el = streamRef.current;
    if (!el) return;
    const d = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (d < 120) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, open]);

  // Scroll tracking
  useEffect(() => {
    const el = streamRef.current;
    if (!el || !open) return;
    const handler = () => {
      const d = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollBtn(d > 200);
    };
    el.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => el.removeEventListener("scroll", handler);
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const p = document.body.style.position;
    const t = document.body.style.top;
    const w = document.body.style.width;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.position = p;
      document.body.style.top = t;
      document.body.style.width = w;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Focus
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 400);
    else if (mounted) bubbleRef.current?.focus();
  }, [open, mounted]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      if (auraTimeout.current) clearTimeout(auraTimeout.current);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      recognitionRef.current?.abort?.();
    };
  }, []);

  // Idle whisper
  const resetIdleTimer = useCallback(() => {
    if (idleTimeout.current) clearTimeout(idleTimeout.current);
    setIdleWhisper(null);
    idleTimeout.current = window.setTimeout(() => {
      setIdleWhisper(IDLE_WHISPERS[Math.floor(Math.random() * IDLE_WHISPERS.length)]);
    }, IDLE_DELAY_MS);
  }, []);

  useEffect(() => {
    if (!open) {
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      setIdleWhisper(null);
      return;
    }
    resetIdleTimer();
    return () => { if (idleTimeout.current) clearTimeout(idleTimeout.current); };
  }, [open, resetIdleTimer, messages.length]);

  // Reset chat
  const resetChat = useCallback(() => {
    setMessages([createWelcomeMessage()]);
    contextRef.current = {};
    setContextChip(null);
    setMoodColor("var(--accent)");
    setInput("");
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    haptic("medium");
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (searchOpen) { setSearchOpen(false); return; }
        if (slashOpen) { setSlashOpen(false); return; }
        if (open) { e.preventDefault(); setOpen(false); }
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) setSearchOpen((v) => !v);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        const text = messages.map((m) => `${m.role === "user" ? "👤 من" : "🤖 دستیار"}:\n${m.text}`).join("\n\n---\n\n");
        navigator.clipboard?.writeText(text).then(() => {
          setExitHint(true);
          haptic("success");
          setTimeout(() => setExitHint(false), 2000);
        }).catch(() => {});
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, searchOpen, slashOpen, messages]);

  // Focus search
  useEffect(() => {
    if (searchOpen) { setTimeout(() => searchInputRef.current?.focus(), 100); setSearchQuery(""); }
  }, [searchOpen]);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Auto-resize textarea
  const autoResize = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, []);

  useEffect(() => { autoResize(); }, [input, autoResize]);

  // Aura on typing
  const bumpAura = useCallback(() => {
    const now = Date.now();
    const delta = now - lastKeystroke.current;
    lastKeystroke.current = now;
    const intensity = delta < 100 ? 1 : delta < 250 ? 0.7 : delta < 500 ? 0.5 : 0.3;
    setTypingIntensity(intensity);
    if (auraTimeout.current) clearTimeout(auraTimeout.current);
    auraTimeout.current = window.setTimeout(() => setTypingIntensity(0), 700);
  }, []);

  // Slash detect
  useEffect(() => {
    if (input.startsWith("/") && !input.includes(" ")) { setSlashOpen(true); setSlashIndex(0); }
    else setSlashOpen(false);
  }, [input]);

  // Voice input
  const toggleVoice = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window as SpeechRecognitionWindow;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      alert("مرورگر تو از ضبط صدا پشتیبانی نمی‌کنه. Chrome یا Safari رو امتحان کن.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = "fa-IR";
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onresult = (event: SpeechRecognitionEventLike) => {
      const t = Array.from({ length: event.results.length })
        .map((_, i) => event.results[i][0].transcript)
        .join("");
      setInput(t);
      autoResize();
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    rec.start();
    recognitionRef.current = rec;
    setIsListening(true);
    haptic("medium");
  }, [isListening, autoResize]);

  // Copy message
  const copyMessage = useCallback((text: string) => {
    navigator.clipboard?.writeText(text).then(() => haptic("light")).catch(() => {});
  }, []);

  // Bookmark
  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    haptic("light");
  }, []);

  // React
  const reactToMessage = useCallback((id: string, emoji: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, reaction: m.reaction === emoji ? undefined : emoji } : m)));
    haptic("light");
    if (emoji === "❤️" || emoji === "🎉" || emoji === "🔥") fireConfetti();
  }, []);

  // Send
  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const lower = trimmed.toLowerCase();
      if (lower === "/clear" || lower === "/new") {
        resetChat();
        return;
      }

      haptic("light");
      const userMsg = createUserMessage(trimmed);
      setMessages((prev) => [...prev, userMsg].slice(-MAX_MESSAGES));
      setInput("");
      setIsTyping(true);
      setSlashOpen(false);
      setIdleWhisper(null);

      typingTimeout.current = window.setTimeout(() => {
        const response: BotResponse = generateResponse(trimmed, contextRef.current);
        contextRef.current = { lastIntent: response.intent };
        setMoodColor(getMoodColor(response.intent));

        if (response.intent && !["greeting", "thanks", "goodbye", "unknown"].includes(response.intent)) {
          const chipLabels: Partial<Record<IntentType, string>> = {
            ask_pricing: "درباره‌ی قیمت", ask_pricing_landing: "درباره‌ی قیمت لندینگ",
            ask_pricing_corporate: "درباره‌ی قیمت سایت شرکتی", ask_pricing_shop: "درباره‌ی قیمت فروشگاه",
            ask_process: "درباره‌ی فرآیند کار", ask_timeline: "درباره‌ی زمان‌بندی",
            ask_portfolio: "درباره‌ی نمونه‌کارها", ask_portfolio_arka: "درباره‌ی آرکا",
            ask_portfolio_nila: "درباره‌ی نیلا", ask_portfolio_vira: "درباره‌ی ویرا",
            ask_portfolio_lumen: "درباره‌ی لومن", ask_services: "درباره‌ی خدمات",
            ask_service_web: "درباره‌ی وب‌سایت", ask_service_ai: "درباره‌ی هوش مصنوعی",
            ask_service_video: "درباره‌ی ویدیو", start_project: "درباره‌ی شروع پروژه",
            describe_project: "درباره‌ی پروژه‌ی تو", ask_contact: "درباره‌ی راه تماس",
            ask_stack: "درباره‌ی تکنولوژی‌ها", ask_ownership: "درباره‌ی مالکیت",
            ask_guarantee: "درباره‌ی ضمانت", ask_faq: "پاسخ به سؤالت",
          };
          setContextChip(chipLabels[response.intent] ?? null);
        } else setContextChip(null);

        const botMsg = createBotMessage(response);
        setMessages((prev) => [...prev, botMsg].slice(-MAX_MESSAGES));
        setIsTyping(false);
        typingTimeout.current = null;
        setFreshIds((prev) => new Set(prev).add(botMsg.id));
        setTimeout(() => setFreshIds((prev) => { const n = new Set(prev); n.delete(botMsg.id); return n; }), 1400);

        if (!open) { setHasNew(true); haptic("medium"); }
        else haptic("light");
      }, TYPING_DELAY_MS);
    },
    [isTyping, open, resetChat],
  );

  const handleQuickReply = useCallback((reply: QuickReply) => sendMessage(reply.value), [sendMessage]);

  const handleSubmit = useCallback((e: React.FormEvent) => { e.preventDefault(); sendMessage(input); }, [input, sendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (slashOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      setSlashIndex((i) => (e.key === "ArrowDown" ? Math.min(i + 1, SLASH_COMMANDS.length - 1) : Math.max(i - 1, 0)));
      return;
    }
    if (slashOpen && e.key === "Enter") {
      e.preventDefault();
      const cmd = SLASH_COMMANDS[slashIndex]?.cmd;
      if (cmd) sendMessage(cmd);
      return;
    }
    if (slashOpen && e.key === "Tab") {
      e.preventDefault();
      const cmd = SLASH_COMMANDS[slashIndex]?.cmd;
      if (cmd) setInput(cmd);
      setSlashOpen(false);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }, [input, sendMessage, slashOpen, slashIndex]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    bumpAura();
    resetIdleTimer();
  }, [bumpAura, resetIdleTimer]);

  const handleToggle = useCallback(() => { setOpen((p) => !p); setHasNew(false); haptic("light"); }, []);

  const scrollToBottom = useCallback(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); haptic("light"); }, []);

  // Search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return messages.filter((m) => m.text.toLowerCase().includes(q));
  }, [searchQuery, messages]);

  const scrollToMessage = useCallback((id: string) => {
    document.querySelector(`[data-msg-id="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    setSearchOpen(false);
    haptic("light");
  }, []);

  const lastMessage = messages[messages.length - 1];
  const showQuickReplies = !isTyping && lastMessage?.role === "bot" && lastMessage.quickReplies && lastMessage.quickReplies.length > 0;
  const filteredSlash = SLASH_COMMANDS.filter((c) => c.cmd.startsWith(input.toLowerCase()));

  if (!mounted) return null;

  return (
    <>
      {/* ═══ BUBBLE ═══ */}
      <button ref={bubbleRef} type="button"
        className={`chat-bubble${open ? " is-open" : ""}${hasNew ? " has-new" : ""}`}
        onClick={handleToggle}
        aria-label={open ? "بستن گفت‌وگو" : "شروع گفت‌وگو"}
        aria-expanded={open} aria-controls="chat-panel"
        style={{ "--aura-intensity": typingIntensity } as React.CSSProperties}>
        <span className="chat-bubble-halo" aria-hidden="true" />
        <span className="chat-bubble-inner" aria-hidden="true"><ChatBubbleIcon /></span>
        {hasNew && <span className="chat-bubble-badge" aria-hidden="true" />}
        <span className="chat-bubble-pulse" aria-hidden="true" />
      </button>

      {/* ═══ PANEL ═══ */}
      <aside id="chat-panel" className={`chat-panel${open ? " is-open" : ""}${showCeremony ? " is-celebrating" : ""}`}
        role="dialog" aria-modal="false" aria-labelledby="chat-title" aria-hidden={!open}>
        <div className="chat-drag-handle" aria-hidden="true" />

        {showCeremony && (
          <div className="chat-ceremony" aria-hidden="true">
            <span className="chat-ceremony-ring" />
            <span className="chat-ceremony-ring chat-ceremony-ring--2" />
            <span className="chat-ceremony-ring chat-ceremony-ring--3" />
          </div>
        )}

        <span className="chat-corner chat-corner-tl" aria-hidden="true" />
        <span className="chat-corner chat-corner-tr" aria-hidden="true" />
        <span className="chat-corner chat-corner-bl" aria-hidden="true" />
        <span className="chat-corner chat-corner-br" aria-hidden="true" />
        <span className="chat-orb chat-orb-1" aria-hidden="true" />
        <span className="chat-orb chat-orb-2" aria-hidden="true" />

        {/* Header */}
        <header className="chat-head">
          <div className="chat-head-info">
            <span className="chat-avatar">
              <span className="chat-avatar-halo" aria-hidden="true" />
              <span className="chat-avatar-inner">
                <Image src="/logo.png" alt="" width={64} height={64} className="chat-avatar-img" priority={false} />
              </span>
              <span className="chat-avatar-status" aria-hidden="true" />
            </span>
            <div className="chat-head-text">
              <span id="chat-title" className="chat-head-name">
                دستیار امیرحسین
                <span className="chat-mood-ring" style={{ "--mood-color": moodColor } as React.CSSProperties} aria-hidden="true" />
              </span>
              <span className="chat-head-status" role="status" aria-live="polite">
                {isTyping ? (<><span className="chat-head-status-dot" />در حال نوشتن…</>)
                  : isListening ? (<><span className="chat-head-status-dot" />در حال شنیدن…</>)
                  : (<><span className="chat-head-status-dot chat-head-status-dot--online" />آنلاین</>)}
              </span>
            </div>
          </div>
          <div className="chat-head-actions">
            <button type="button" className="chat-head-btn" onClick={() => setSearchOpen(true)}
              aria-label="جستجو در مکالمه" title="جستجو (⌘K)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button type="button" className="chat-head-btn" onClick={resetChat}
              aria-label="شروع مجدد" title="شروع مجدد">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </button>
            <button type="button" className="chat-head-btn" onClick={() => { setOpen(false); haptic("light"); }} aria-label="بستن">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        {/* Stream */}
        <div ref={streamRef} className="chat-stream" role="log" aria-live="polite" aria-label="پیام‌ها">
          {messages.map((msg) => {
            const isFresh = freshIds.has(msg.id);
            const isBookmarked = bookmarks.has(msg.id);
            return (
              <div key={msg.id} data-msg-id={msg.id} className={`chat-msg chat-msg--${msg.role}${isBookmarked ? " is-bookmarked" : ""}`}>
                {msg.role === "bot" && (
                  <span className="chat-msg-avatar" aria-hidden="true">
                    <Image src="/logo.png" alt="" width={32} height={32} className="chat-msg-avatar-img" priority={false} />
                  </span>
                )}
                <div className="chat-msg-body">
                  <div className="chat-msg-bubble">
                    <div className={`chat-msg-text${isFresh ? " is-fresh" : ""}`}
                      dangerouslySetInnerHTML={{ __html: msg.role === "user" ? escapeOnly(msg.text) : formatMessageText(msg.text) }} />
                    {msg.reaction && <span className="chat-msg-reaction" aria-hidden="true">{msg.reaction}</span>}
                    <span className="chat-msg-time">{formatTime(msg.timestamp)}</span>
                    <div className="chat-msg-hover-actions" role="group" aria-label="اکشن‌های پیام">
                      <button type="button" className="chat-msg-action-btn" onClick={() => copyMessage(msg.text)} aria-label="کپی" title="کپی">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      </button>
                      <button type="button" className={`chat-msg-action-btn${isBookmarked ? " is-active" : ""}`}
                        onClick={() => toggleBookmark(msg.id)} aria-label={isBookmarked ? "حذف ذخیره" : "ذخیره"}>
                        <svg viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </button>
                      <button type="button" className={`chat-msg-action-btn${msg.reaction === "❤️" ? " is-active" : ""}`}
                        onClick={() => reactToMessage(msg.id, "❤️")} aria-label="واکنش قلب">
                        <svg viewBox="0 0 24 24" fill={msg.reaction === "❤️" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>
                    {msg.role === "bot" && msg.actions && msg.actions.length > 0 && (
                      <div className="chat-msg-actions">
                        {msg.actions.map((action) =>
                          action.external ? (
                            <a key={action.href} href={action.href} target="_blank" rel="noopener noreferrer"
                              className={`chat-action${action.primary ? " is-primary" : ""}`}
                              onClick={() => haptic("light")}>
                              <span className="chat-action-icon"><ActionIcon type={action.icon} /></span>
                              <span className="chat-action-label">{action.label}</span>
                            </a>
                          ) : (
                            <Link key={action.href} href={action.href}
                              className={`chat-action${action.primary ? " is-primary" : ""}`}
                              onClick={() => { setOpen(false); haptic("light"); }}>
                              <span className="chat-action-icon"><ActionIcon type={action.icon} /></span>
                              <span className="chat-action-label">{action.label}</span>
                            </Link>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="chat-msg chat-msg--bot">
              <span className="chat-msg-avatar" aria-hidden="true">
                <Image src="/logo.png" alt="" width={32} height={32} className="chat-msg-avatar-img" priority={false} />
              </span>
              <div className="chat-msg-body">
                <div className="chat-msg-bubble chat-msg-bubble--typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          {idleWhisper && !isTyping && (
            <div className="chat-idle-whisper" role="status" aria-live="polite">
              <span className="chat-idle-whisper-dot" aria-hidden="true" />{idleWhisper}
            </div>
          )}

          {showQuickReplies && lastMessage.quickReplies && (
            <div className="chat-quick">
              {lastMessage.quickReplies.map((reply) => (
                <button key={reply.value} type="button" className="chat-quick-chip"
                  onClick={() => handleQuickReply(reply)}>{reply.label}</button>
              ))}
            </div>
          )}

          <div ref={endRef} />
        </div>

        {showScrollBtn && (
          <button type="button" className="chat-scroll-bottom" onClick={scrollToBottom} aria-label="رفتن به آخرین پیام">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}

        {contextChip && !isTyping && (
          <div className="chat-context-chip" aria-hidden="true">
            <span className="chat-context-chip-dot" />{contextChip}
          </div>
        )}

        {exitHint && (
          <div className="chat-exit-hint" role="status" aria-live="polite">
            ✅ مکالمه کپی شد
          </div>
        )}

        {slashOpen && filteredSlash.length > 0 && (
          <div className="chat-slash-menu" role="menu">
            {filteredSlash.map((c, i) => (
              <button key={c.cmd} type="button"
                className={`chat-slash-item${i === slashIndex ? " is-active" : ""}`}
                onClick={() => { setInput(""); setSlashOpen(false); sendMessage(c.cmd); }}
                onMouseEnter={() => setSlashIndex(i)}>
                <span className="chat-slash-cmd">{c.cmd}</span>
                <span className="chat-slash-label">{c.label}</span>
                <span className="chat-slash-desc">{c.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Compose */}
        <form className="chat-compose" onSubmit={handleSubmit}>
          <button type="button"
            className={`chat-voice-btn${isListening ? " is-listening" : ""}`}
            onClick={toggleVoice}
            aria-label={isListening ? "توقف ضبط" : "ضبط صدا"} title="ضبط صدا">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
          <textarea ref={inputRef} className="chat-input" value={input}
            onChange={handleInputChange} onKeyDown={handleKeyDown}
            placeholder="پیامت رو بنویس… یا / بزن" rows={1} dir="rtl" aria-label="پیام" />
          <button type="submit" className="chat-send" disabled={!input.trim() || isTyping} aria-label="ارسال">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>

        <div className="chat-foot-hint" aria-hidden="true">
          <span>⌘K جستجو</span>
          <span className="chat-foot-sep">·</span>
          <span>⌘⇧C کپی مکالمه</span>
          <span className="chat-foot-sep">·</span>
          <span>/ دستورات</span>
        </div>
      </aside>

      {open && <div className="chat-backdrop" onClick={() => { setOpen(false); haptic("light"); }} aria-hidden="true" />}

      {/* SEARCH PALETTE */}
      {searchOpen && (
        <div className="chat-search-overlay" role="dialog" aria-modal="true" aria-label="جستجو">
          <div className="chat-search-backdrop" onClick={() => setSearchOpen(false)} />
          <div className="chat-search-panel">
            <div className="chat-search-head">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input ref={searchInputRef} type="text" className="chat-search-input" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} placeholder="جستجو در مکالمه…" dir="rtl" />
              <kbd className="chat-search-kbd">Esc</kbd>
            </div>
            <div className="chat-search-results">
              {!searchQuery.trim() && <div className="chat-search-empty">یه کلمه تایپ کن تا بگردم</div>}
              {searchQuery.trim() && searchResults.length === 0 && <div className="chat-search-empty">چیزی پیدا نشد</div>}
              {searchResults.map((m) => (
                <button key={m.id} type="button" className="chat-search-result" onClick={() => scrollToMessage(m.id)}>
                  <span className={`chat-search-role chat-search-role--${m.role}`}>{m.role === "user" ? "من" : "بات"}</span>
                  <span className="chat-search-text">{m.text.slice(0, 120)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ───────────────────────────────────────────────────────────
   Formatters
   ─────────────────────────────────────────────────────────── */

function escapeOnly(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br />");
}

function formatMessageText(text: string): string {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const withQuote = withBold.replace(/^> (.+)$/gm, '<span class="chat-quote">$1</span>');
  const withCode = withQuote.replace(/`([^`]+)`/g, '<code class="chat-code">$1</code>');
  return withCode.replace(/\n/g, "<br />");
}