"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./intro.css";

/* ═══════════════════════════════════════════════════════════
   CINEMATIC INTRO EXPERIENCE
   ────────────────────────────────────────────────────────────
   - First-visit only (versioned localStorage key)
   - Autoplay with sound → muted fallback → poster + play
   - Body scroll lock without layout shift
   - Premium crossfade exit
   - Full reduced-motion + SSR safety
   ═══════════════════════════════════════════════════════════ */

const STORAGE_KEY = "shorakaei:intro-seen:v1";
const VIDEO_SRC = "/video.mp4";
const POSTER_SRC = ""; // ← اگه پوستر داری، مثلاً "/video-poster.jpg"
const SAFETY_TIMEOUT_MS = 10_000; // حداکثر انتظار برای شروع پخش
const TRANSITION_MS = 900;

type Phase = "checking" | "playing" | "exiting" | "done";
type MediaState = "idle" | "audible" | "muted" | "blocked" | "error";

/* ── Safe localStorage helpers ── */
function safeReadSeen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function safeMarkSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore — privacy mode */
  }
}

export default function IntroExperience() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [mediaState, setMediaState] = useState<MediaState>("idle");

  const videoRef = useRef<HTMLVideoElement>(null);
  const exitTimerRef = useRef<number | null>(null);
  const safetyTimerRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  /* ─────────────────────────────────────────────────────────
     1. First-visit detection (runs once, on mount)
     ───────────────────────────────────────────────────────── */
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Returning visitor → never show
    if (safeReadSeen()) {
      setPhase("done");
      return;
    }

    // Respect prefers-reduced-motion → skip entirely
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      safeMarkSeen();
      setPhase("done");
      return;
    }

    // First meaningful visit → start
    setPhase("playing");
  }, []);

  /* ─────────────────────────────────────────────────────────
     2. Body scroll lock (only while intro is visible)
     ───────────────────────────────────────────────────────── */
  const isActive = phase === "playing" || phase === "exiting";

  useEffect(() => {
    if (!isActive) return;
    if (typeof window === "undefined") return;

    const body = document.body;
    const scrollY = window.scrollY;

    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };

    // Compensate scrollbar to avoid layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [isActive]);

  /* ─────────────────────────────────────────────────────────
     3. Finish / exit (idempotent)
     ───────────────────────────────────────────────────────── */
  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    // Mark as seen immediately — user has either watched or skipped
    safeMarkSeen();

    // Stop video to free CPU/network
    const video = videoRef.current;
    if (video) {
      try {
        video.pause();
      } catch {
        /* ignore */
      }
    }

    setPhase("exiting");

    if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
    exitTimerRef.current = window.setTimeout(() => {
      setPhase("done");
    }, TRANSITION_MS);
  }, []);

  /* ─────────────────────────────────────────────────────────
     4. Autoplay strategy (audible → muted → blocked)
     ───────────────────────────────────────────────────────── */
  useEffect(() => {
    if (phase !== "playing") return;
    if (typeof window === "undefined") return;

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let started = false;

    const attemptPlay = async () => {
      // Attempt 1: audible
      video.muted = false;
      video.volume = 1;

      try {
        await video.play();
        if (cancelled) return;
        setMediaState("audible");
        started = true;
        return;
      } catch (err: unknown) {
        const name = (err as Error)?.name;
        // AbortError = another play() call interrupted this one → stop
        if (name === "AbortError") return;
        // Otherwise fall through to muted attempt
      }

      if (cancelled) return;

      // Attempt 2: muted
      video.muted = true;
      try {
        await video.play();
        if (cancelled) return;
        setMediaState("muted");
        started = true;
        return;
      } catch {
        if (cancelled) return;
        setMediaState("blocked");
      }
    };

    void attemptPlay();

    // Safety net: if video still hasn't started after N seconds → exit
    safetyTimerRef.current = window.setTimeout(() => {
      if (cancelled) return;
      if (started) return;
      finish();
    }, SAFETY_TIMEOUT_MS);

    return () => {
      cancelled = true;
      if (safetyTimerRef.current) {
        window.clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = null;
      }
    };
  }, [phase, finish]);

  /* ─────────────────────────────────────────────────────────
     5. Cleanup on unmount
     ───────────────────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
      if (safetyTimerRef.current) window.clearTimeout(safetyTimerRef.current);
    };
  }, []);

  /* ─────────────────────────────────────────────────────────
     6. Event handlers
     ───────────────────────────────────────────────────────── */
  const handleEnded = useCallback(() => {
    finish();
  }, [finish]);

  const handleError = useCallback(() => {
    setMediaState("error");
    finish();
  }, [finish]);

  const handleEnableSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    setMediaState("audible");
    if (video.paused) {
      video.play().catch(() => {
        /* ignore */
      });
    }
  }, []);

  const handleSkip = useCallback(() => {
    finish();
  }, [finish]);

  const handleRetryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video
      .play()
      .then(() => setMediaState("muted"))
      .catch(() => {
        setMediaState("error");
        finish();
      });
  }, [finish]);

  /* ─────────────────────────────────────────────────────────
     7. Render
     ───────────────────────────────────────────────────────── */
  if (phase === "done") return null;

  const showSoundButton =
    mediaState === "muted" || mediaState === "blocked";
  const showPlayButton = mediaState === "blocked";

  return (
    <div
      className="intro-overlay"
      data-phase={phase}
      data-media={mediaState}
      role="dialog"
      aria-modal="true"
      aria-label="معرفی ویدئویی برند"
    >
      {/* ─── Media layer ─── */}
      <div className="intro-stage">
        <video
          ref={videoRef}
          className="intro-video"
          src={VIDEO_SRC}
          poster={POSTER_SRC || undefined}
          playsInline
          preload="auto"
          disablePictureInPicture
          controls={false}
          onEnded={handleEnded}
          onError={handleError}
        />
        <div className="intro-veil" aria-hidden="true" />
      </div>

      {/* ─── Skip control ─── */}
      <button
        type="button"
        className="intro-skip"
        onClick={handleSkip}
        aria-label="رد کردن معرفی"
      >
        <span className="intro-skip-label">رد کردن</span>
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* ─── Sound control (only when muted) ─── */}
      {showSoundButton && !showPlayButton && (
        <button
          type="button"
          className="intro-sound"
          onClick={handleEnableSound}
          aria-label="فعال کردن صدا"
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
          <span className="intro-sound-label">صدا</span>
        </button>
      )}

      {/* ─── Play control (only when fully blocked) ─── */}
      {showPlayButton && (
        <button
          type="button"
          className="intro-play"
          onClick={handleRetryPlay}
          aria-label="پخش ویدئو"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="currentColor"
            aria-hidden="true"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
      )}
    </div>
  );
}