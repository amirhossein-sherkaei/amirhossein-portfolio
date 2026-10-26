# 2-components.ps1
# Creates DevOnly.tsx and LazyChatBot.tsx (new files only, no modifications)

$ErrorActionPreference = "Stop"

$projectRoot = (Get-Location).Path
Write-Host ""
Write-Host "=== CREATE COMPONENTS ===" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path (Join-Path $projectRoot "package.json"))) {
    Write-Host "ERROR: package.json not found. Run from project root." -ForegroundColor Red
    exit 1
}

# --- 1) DevOnly.tsx ---
$devOnlyPath = Join-Path $projectRoot "src\components\DevOnly.tsx"
$devOnlyDir = Split-Path $devOnlyPath -Parent

if (-not (Test-Path $devOnlyDir)) {
    New-Item -ItemType Directory -Path $devOnlyDir -Force | Out-Null
}

if (Test-Path $devOnlyPath) {
    Write-Host "SKIP: DevOnly.tsx already exists" -ForegroundColor Yellow
} else {
    $devOnlyContent = @'
"use client";

import { ReactNode } from "react";

/* DEV ONLY - renders children only in development environment */

type Props = {
  children: ReactNode;
};

export default function DevOnly({ children }: Props) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }
  return <>{children}</>;
}
'@
    $enc = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($devOnlyPath, $devOnlyContent, $enc)
    Write-Host "CREATED: src\components\DevOnly.tsx" -ForegroundColor Green
}

# --- 2) LazyChatBot.tsx ---
$lazyBotPath = Join-Path $projectRoot "src\components\chat\LazyChatBot.tsx"
$lazyBotDir = Split-Path $lazyBotPath -Parent

if (-not (Test-Path $lazyBotDir)) {
    New-Item -ItemType Directory -Path $lazyBotDir -Force | Out-Null
}

if (Test-Path $lazyBotPath) {
    Write-Host "SKIP: LazyChatBot.tsx already exists" -ForegroundColor Yellow
} else {
    $lazyBotContent = @'
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
'@
    $enc = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($lazyBotPath, $lazyBotContent, $enc)
    Write-Host "CREATED: src\components\chat\LazyChatBot.tsx" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Cyan
Write-Host ""

# Verify
Write-Host "Verification:" -ForegroundColor Yellow
if (Test-Path $devOnlyPath) { Write-Host "  OK DevOnly.tsx exists" -ForegroundColor Green }
if (Test-Path $lazyBotPath) { Write-Host "  OK LazyChatBot.tsx exists" -ForegroundColor Green }
Write-Host ""