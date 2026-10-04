"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/* LAZY CHATBOT - loads after first user interaction or 3s idle timeout */

const ChatBotInner = dynamic(
  () => import("./ChatBot").then((m) => ({ default: m.ChatBot })),
  {
    ssr: false,
    loading: () => null,
  }
);

export function ChatBot() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;

    let done = false;
    const trigger = () => {
      if (done) return;
      done = true;
      setShouldLoad(true);
    };

    const timer = window.setTimeout(trigger, 3000);

    const events = ["pointerdown", "touchstart", "keydown", "scroll"] as const;
    events.forEach((evt) => {
      window.addEventListener(evt, trigger, { once: true, passive: true });
    });

    return () => {
      window.clearTimeout(timer);
      events.forEach((evt) => {
        window.removeEventListener(evt, trigger);
      });
    };
  }, [shouldLoad]);

  if (!shouldLoad) return null;

  return <ChatBotInner />;
}