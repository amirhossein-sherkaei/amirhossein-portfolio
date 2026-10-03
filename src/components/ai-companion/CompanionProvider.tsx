"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/* ═══════════════════════════════════════════════════════════
   COMPANION PROVIDER — AI on-device manager
   ────────────────────────────────────────────────────────────
   Manages the lifecycle of the Chrome built-in AI session.
   - Checks availability (device capability, model download)
   - Warms up the session on first user interaction
   - Generates short, contextual messages
   - Falls back gracefully if AI is unavailable
   ═══════════════════════════════════════════════════════════ */

type CompanionContextValue = {
  message: string;
  isAvailable: boolean;
  isThinking: boolean;
  generateMessage: (context: string) => Promise<void>;
  dismiss: () => void;
};

const CompanionContext = createContext<CompanionContextValue | null>(null);

export function useCompanion() {
  const ctx = useContext(CompanionContext);
  if (!ctx)
    throw new Error("useCompanion must be used within <CompanionProvider>");
  return ctx;
}

/* ── Type guard for the experimental API ── */
type LanguageModelAPI = {
  availability: () => Promise<
    "available" | "downloadable" | "downloading" | "unavailable"
  >;
  create: (options?: {
    initialPrompts?: Array<{ role: string; content: string }>;
    monitor?: (m: EventTarget) => void;
  }) => Promise<{
    prompt: (text: string) => Promise<string>;
    clone: () => Promise<any>;
    destroy: () => void;
  }>;
};

function getLanguageModel(): LanguageModelAPI | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { LanguageModel?: LanguageModelAPI };
  return w.LanguageModel ?? null;
}

const WARMUP_DELAY_MS = 3000;
const MAX_CONTEXT_LENGTH = 200;

export function CompanionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [message, setMessage] = useState("");

  const sessionRef = useRef<Awaited<
    ReturnType<LanguageModelAPI["create"]>
  > | null>(null);
  const warmupRef = useRef<number | null>(null);

  /* ── 1. Availability check + session warm-up ── */
  useEffect(() => {
    const api = getLanguageModel();
    if (!api) return;

    let cancelled = false;

    const init = async () => {
      try {
        const status = await api.availability();
        if (cancelled) return;

        if (status === "available" || status === "downloadable") {
          setIsAvailable(true);

          // Warm up the session after a short delay.
          // This follows the Chrome guidance: prepare the model
          // "in reasonable time" after the user shows intent[reference:1].
          warmupRef.current = window.setTimeout(async () => {
            if (cancelled) return;
            try {
              sessionRef.current = await api.create({
                initialPrompts: [
                  {
                    role: "system",
                    content: `You are a friendly, concise companion on a design portfolio website.
                      You help visitors by giving short, warm, and helpful tips.
                      Always respond in Persian (Farsi).
                      Keep every message under 15 words.
                      Never use emojis. Be poetic but brief.`,
                  },
                ],
              });
            } catch {
              /* silent — warm-up is best-effort */
            }
          }, WARMUP_DELAY_MS);
        }
      } catch {
        /* API not usable — stay silent */
      }
    };

    init();

    return () => {
      cancelled = true;
      if (warmupRef.current) window.clearTimeout(warmupRef.current);
      sessionRef.current?.destroy();
      sessionRef.current = null;
    };
  }, []);

  /* ── 2. Generate a contextual message ── */
  const generateMessage = useCallback(
    async (context: string) => {
      if (!isAvailable) return;

      // Truncate context for speed & token efficiency[reference:2].
      const safeContext =
        context.length > MAX_CONTEXT_LENGTH
          ? context.slice(0, MAX_CONTEXT_LENGTH)
          : context;

      setIsThinking(true);
      setMessage("");

      try {
        // Lazily create the session if warm-up hasn't finished.
        if (!sessionRef.current) {
          const api = getLanguageModel();
          if (!api) return;
          sessionRef.current = await api.create({
            initialPrompts: [
              {
                role: "system",
                content: `You are a friendly, concise companion on a design portfolio website.
                  Always respond in Persian (Farsi).
                  Keep every message under 15 words.
                  Never use emojis. Be poetic but brief.`,
              },
            ],
          });
        }

        const result = await sessionRef.current.prompt(
          `The visitor is currently looking at: ${safeContext}. Write a short, helpful message.`
        );

        setMessage(result.trim());
      } catch {
        setMessage("");
      } finally {
        setIsThinking(false);
      }
    },
    [isAvailable]
  );

  const dismiss = useCallback(() => {
    setMessage("");
  }, []);

  return (
    <CompanionContext.Provider
      value={{ message, isAvailable, isThinking, generateMessage, dismiss }}
    >
      {children}
    </CompanionContext.Provider>
  );
}