# 6-verify.ps1
# Compact verification of layout.tsx after reorganization

$ErrorActionPreference = "Stop"
$projectRoot = (Get-Location).Path

$layoutPath = Join-Path $projectRoot "src\app\layout.tsx"
$configPath = Join-Path $projectRoot "next.config.mjs"
$gitignorePath = Join-Path $projectRoot ".gitignore"

Write-Host ""
Write-Host "=== FINAL VERIFICATION ===" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $layoutPath)) { Write-Host "FAIL: layout.tsx missing" -ForegroundColor Red; exit 1 }
if (-not (Test-Path $configPath)) { Write-Host "FAIL: next.config.mjs missing" -ForegroundColor Red; exit 1 }

$layout = [System.IO.File]::ReadAllText($layoutPath, [System.Text.Encoding]::UTF8)
$config = [System.IO.File]::ReadAllText($configPath, [System.Text.Encoding]::UTF8)
$gitignore = if (Test-Path $gitignorePath) { [System.IO.File]::ReadAllText($gitignorePath, [System.Text.Encoding]::UTF8) } else { "" }

# --- Layout checks ---
Write-Host "--- layout.tsx ---" -ForegroundColor Magenta

$cssImports = ([regex]::Matches($layout, 'import\s+"@/styles/[^"]+";')).Count
$cssStatus = if ($cssImports -ge 50) { "OK" } else { "FAIL" }
$cssColor = if ($cssImports -ge 50) { "Green" } else { "Red" }
Write-Host "  [$cssStatus] CSS imports count: $cssImports" -ForegroundColor $cssColor

$tokensIdx = $layout.IndexOf('import "@/styles/tokens.css"')
$finalIdx = $layout.IndexOf('import "@/styles/final-polish-2026.css"')
if ($tokensIdx -ge 0 -and $finalIdx -ge 0 -and $tokensIdx -lt $finalIdx) {
    Write-Host "  [OK] CSS order: tokens.css -> final-polish-2026.css" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] CSS order wrong" -ForegroundColor Red
}

if ($layout -match 'LazyChatBot') {
    Write-Host "  [OK] LazyChatBot imported" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] LazyChatBot not imported" -ForegroundColor Red
}

if ($layout -match 'import DevOnly from') {
    Write-Host "  [OK] DevOnly imported" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] DevOnly not imported" -ForegroundColor Red
}

if ($layout -match '<DevOnly><GridOverlay /></DevOnly>') {
    Write-Host "  [OK] GridOverlay wrapped in DevOnly" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] GridOverlay not wrapped" -ForegroundColor Red
}

if ($layout -notmatch 'from "@/components/chat/ChatBot"') {
    Write-Host "  [OK] Old ChatBot import removed" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Old ChatBot import still there" -ForegroundColor Red
}

# --- Config checks ---
Write-Host ""
Write-Host "--- next.config.mjs ---" -ForegroundColor Magenta

if ($config -notmatch 'unoptimized') {
    Write-Host "  [OK] unoptimized removed" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] unoptimized still present" -ForegroundColor Red
}

if ($config -match 'image/avif') {
    Write-Host "  [OK] AVIF enabled" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] AVIF not enabled" -ForegroundColor Red
}

if ($config -match 'image/webp') {
    Write-Host "  [OK] WebP enabled" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] WebP not enabled" -ForegroundColor Red
}

# --- Gitignore ---
Write-Host ""
Write-Host "--- .gitignore ---" -ForegroundColor Magenta

if ($gitignore -match '(?m)^\.backup-\*/') {
    Write-Host "  [OK] .backup-*/ present" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] .backup-*/ missing" -ForegroundColor Red
}

# --- New files ---
Write-Host ""
Write-Host "--- New components ---" -ForegroundColor Magenta

$devOnly = Join-Path $projectRoot "src\components\DevOnly.tsx"
$lazyBot = Join-Path $projectRoot "src\components\chat\LazyChatBot.tsx"

if (Test-Path $devOnly) { Write-Host "  [OK] DevOnly.tsx" -ForegroundColor Green } else { Write-Host "  [FAIL] DevOnly.tsx" -ForegroundColor Red }
if (Test-Path $lazyBot) { Write-Host "  [OK] LazyChatBot.tsx" -ForegroundColor Green } else { Write-Host "  [FAIL] LazyChatBot.tsx" -ForegroundColor Red }

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Cyan
Write-Host ""