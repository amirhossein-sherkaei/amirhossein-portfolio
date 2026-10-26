# 5-css-organization.ps1
# Reorganize CSS imports in layout.tsx with numbered groups + comments.
# ZERO file changes. ZERO renames. Only layout.tsx is modified.

$ErrorActionPreference = "Stop"

$projectRoot = (Get-Location).Path
$layoutPath = Join-Path $projectRoot "src\app\layout.tsx"

Write-Host ""
Write-Host "=== REORGANIZE CSS IN LAYOUT.TSX ===" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $layoutPath)) {
    Write-Host "ERROR: layout.tsx not found" -ForegroundColor Red
    exit 1
}

# Additional backup
$backupPath = "$layoutPath.bak2"
Copy-Item -Path $layoutPath -Destination $backupPath -Force
Write-Host "Backup: $backupPath" -ForegroundColor Gray

$enc = New-Object System.Text.UTF8Encoding($false)
$content = [System.IO.File]::ReadAllText($layoutPath, [System.Text.Encoding]::UTF8)

$nl = if ($content.Contains("`r`n")) { "`r`n" } else { "`n" }

# Find CSS section boundaries
$startMarker = '/* 1. Design tokens */'
$endMarker = 'import "@/styles/final-polish-2026.css";'

$startIdx = $content.IndexOf($startMarker)
if ($startIdx -lt 0) {
    Write-Host "ERROR: start marker not found" -ForegroundColor Red
    exit 1
}

$endIdx = $content.IndexOf($endMarker)
if ($endIdx -lt 0) {
    Write-Host "ERROR: end marker not found" -ForegroundColor Red
    exit 1
}
$endIdx = $endIdx + $endMarker.Length

Write-Host "Found CSS section: $startIdx..$endIdx" -ForegroundColor Gray
Write-Host ""

# Build new CSS section
$newLines = @(
    '/* ------------------------------------------------------------------'
    '   CSS IMPORTS - ORDER MATTERS'
    '   ------------------------------------------------------------------'
    '   Single source of truth for CSS cascade order.'
    '   Each file is numbered by its position.'
    '   Do not reorder without understanding cascade implications.'
    '   ------------------------------------------------------------------ */'
    ''
    '/* 01-04 - Foundation */'
    'import "@/styles/tokens.css";'
    'import "@/styles/motion.css";'
    'import "@/styles/base.css";'
    'import "@/styles/magnetic.css";'
    ''
    '/* 05-09 - Core systems */'
    'import "@/styles/reveal.css";'
    'import "@/styles/mobile-touch.css";'
    'import "@/styles/mobile-modal.css";'
    'import "@/styles/mobile-typography.css";'
    'import "@/styles/mobile-nav-v2.css";'
    ''
    '/* 10-14 - Mobile foundations */'
    'import "@/styles/mobile-bottom-nav.css";'
    'import "@/styles/perceived-performance.css";'
    'import "@/styles/adaptive-navigation.css";'
    'import "@/styles/sensory.css";'
    'import "@/styles/welcome-onboarding.css";'
    ''
    '/* 15-17 - Forms */'
    'import "@/styles/order-form-v2.css";'
    'import "@/styles/order-premium.css";'
    'import "@/styles/mobile-declutter.css";'
    ''
    '/* 18-22 - Work + Layout */'
    'import "@/styles/work-pages.css";'
    'import "@/styles/work-premium.css";'
    'import "@/styles/layout.css";'
    'import "@/styles/layout-more.css";'
    'import "@/styles/footer-effects.css";'
    ''
    '/* 23-27 - Pages + Responsive */'
    'import "@/styles/pages.css";'
    'import "@/styles/responsive.css";'
    'import "@/styles/enhancements.css";'
    'import "@/styles/process.css";'
    'import "@/styles/commitments.css";'
    ''
    '/* 28-29 - Mobile overrides (MUST come after mobile-declutter) */'
    'import "@/styles/mobile-fix.css";'
    'import "@/styles/mobile-polish-v2.css";'
    ''
    '/* 30 - Blog page-level CSS is imported in src/app/blog/page.tsx */'
    ''
    '/* 31-33 - Blog extras + Theme + Hero */'
    'import "@/styles/blog-premium.css";'
    'import "@/styles/theme-toggle.css";'
    'import "@/styles/hero-editorial.css";'
    ''
    '/* 34-38 - Hero + Branding */'
    'import "@/styles/hero-premium.css";'
    'import "@/styles/signature-ink.css";'
    'import "@/styles/density-standardization.css";'
    'import "@/styles/services-premium.css";'
    'import "@/styles/manuscript-grid.css";'
    ''
    '/* 39-42 - Sections */'
    'import "@/styles/hero-bento-live.css";'
    'import "@/styles/testimonials.css";'
    'import "@/styles/brand-logo.css";'
    'import "@/styles/newsletter.css";'
    ''
    '/* 43-47 - Performance + Footer */'
    'import "@/styles/performance-boost.css";'
    'import "@/styles/footer-v2.css";'
    'import "@/styles/contact-links.css";'
    'import "@/styles/count-up.css";'
    'import "@/styles/chapter-rail.css";'
    ''
    '/* 48-50 - Performance + Nav */'
    'import "@/styles/performance-layer.css";'
    'import "@/styles/nav-premium.css";'
    'import "@/styles/performance-pro.css";'
    ''
    '/* 51-55 - Final polish + Blog editorial */'
    'import "@/styles/final-polish.css";'
    'import "@/styles/mobile-performance-fix.css";'
    'import "@/styles/editorial-structure.css";'
    'import "@/styles/blog-editorial.css";'
    'import "@/styles/blog-article-premium.css";'
    ''
    '/* 56 - Dev tools (GridOverlay is wrapped in DevOnly) */'
    'import "@/styles/grid-overlay.css";'
    ''
    '/* 57 - ULTIMATE FINAL - must be the last CSS import */'
    'import "@/styles/final-polish-2026.css";'
)

$newSection = $newLines -join $nl

# Replace
$before = $content.Substring(0, $startIdx)
$after = $content.Substring($endIdx)
$newContent = $before + $newSection + $after

# Save
[System.IO.File]::WriteAllText($layoutPath, $newContent, $enc)

Write-Host "OK: layout.tsx CSS section reorganized" -ForegroundColor Green
Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Verify:" -ForegroundColor Yellow
Write-Host "  Get-Content .\src\app\layout.tsx -TotalCount 130" -ForegroundColor White
Write-Host ""